import os
import uuid
from datetime import date

import pytest
import requests


# Module: Weekly strategy trigger scope and weekly review packet coverage
@pytest.fixture(scope="session")
def base_url() -> str:
    value = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:3000")
    return value.rstrip("/")


def _create_authenticated_session(base_url: str) -> requests.Session:
    session = requests.Session()

    email = f"pytest.strategy.{uuid.uuid4().hex[:10]}@zcvios.local"
    password = "DemoPass123!"

    register_response = session.post(
        f"{base_url}/rpc/register",
        json={"name": "Pytest Strategy", "email": email, "password": password},
        timeout=20,
    )
    assert register_response.status_code == 200

    csrf_response = session.get(f"{base_url}/auth/csrf", timeout=20)
    assert csrf_response.status_code == 200
    csrf_token = csrf_response.json().get("csrfToken")
    assert csrf_token

    callback_response = session.post(
        f"{base_url}/auth/callback/credentials",
        data={
            "csrfToken": csrf_token,
            "email": email,
            "password": password,
            "json": "true",
            "redirect": "false",
            "callbackUrl": f"{base_url}/dashboard",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=20,
        allow_redirects=False,
    )
    assert callback_response.status_code in (200, 302)

    session_response = session.get(f"{base_url}/auth/session", timeout=20)
    assert session_response.status_code == 200
    assert session_response.json().get("user", {}).get("email") == email

    return session


def test_strategy_runs_only_on_weekly_revenue_save(base_url: str):
    auth_client = _create_authenticated_session(base_url)

    weekly_before = auth_client.get(f"{base_url}/rpc/reports/weekly", timeout=20)
    assert weekly_before.status_code == 200
    before_data = weekly_before.json()
    before_bottleneck = before_data["bottleneckNote"]
    before_lever = before_data["lever"]

    log_response = auth_client.post(
        f"{base_url}/rpc/logs",
        json={
            "date": date.today().isoformat(),
            "minutes": 30,
            "category": "LEVER",
            "completed": True,
            "note": "pytest strategy scope check",
        },
        timeout=20,
    )
    assert log_response.status_code == 200

    weekly_after_log = auth_client.get(f"{base_url}/rpc/reports/weekly", timeout=20)
    assert weekly_after_log.status_code == 200
    after_log_data = weekly_after_log.json()
    assert after_log_data["lever"] == before_lever
    assert after_log_data["bottleneckNote"] == before_bottleneck

    revenue_response = auth_client.post(
        f"{base_url}/rpc/revenue",
        json={
            "weekStart": date.today().isoformat(),
            "revenue": 1750,
            "note": "pytest strategy trigger",
            "trafficSessions": 120,
            "leadsGenerated": 14,
            "closedSales": 3,
            "churnedCustomers": 1,
            "grossMarginPct": 38,
        },
        timeout=20,
    )
    assert revenue_response.status_code == 200
    revenue_data = revenue_response.json()
    assert revenue_data["ok"] is True
    assert revenue_data["signals"]["trafficSessions"] == 120

    weekly_after_revenue = auth_client.get(f"{base_url}/rpc/reports/weekly", timeout=20)
    assert weekly_after_revenue.status_code == 200
    after_revenue_data = weekly_after_revenue.json()
    assert after_revenue_data["weeklySignals"]["trafficSessions"] == 120
    assert after_revenue_data["weeklySignals"]["leadsGenerated"] == 14
    assert after_revenue_data["weeklySignals"]["closedSales"] == 3
    assert after_revenue_data["weeklySignals"]["churnedCustomers"] == 1
    assert after_revenue_data["weeklySignals"]["grossMarginPct"] == 38
    assert after_revenue_data["bottleneckNote"] != before_bottleneck


def test_weekly_review_packet_contains_signal_metrics(base_url: str):
    auth_client = _create_authenticated_session(base_url)

    save_response = auth_client.post(
        f"{base_url}/rpc/revenue",
        json={
            "weekStart": date.today().isoformat(),
            "revenue": 1999,
            "note": "pytest weekly review packet",
            "trafficSessions": 111,
            "leadsGenerated": 12,
            "closedSales": 4,
            "churnedCustomers": 0,
            "grossMarginPct": 44,
        },
        timeout=20,
    )
    assert save_response.status_code == 200

    review_response = auth_client.get(f"{base_url}/rpc/reports/weekly-review", timeout=20)
    assert review_response.status_code == 200
    payload = review_response.json()

    assert "report" in payload
    assert "missionSnapshot" in payload
    assert "overrideHistory" in payload

    report = payload["report"]
    assert report["weeklySignals"]["trafficSessions"] == 111
    assert report["weeklySignals"]["leadsGenerated"] == 12
    assert report["weeklySignals"]["closedSales"] == 4
    assert report["weeklySignals"]["churnedCustomers"] == 0
    assert report["weeklySignals"]["grossMarginPct"] == 44
