import os
from datetime import date, timedelta

import pytest
import requests


@pytest.fixture(scope="session")
def base_url() -> str:
    value = os.environ.get("REACT_APP_BACKEND_URL")
    if not value:
        pytest.skip("REACT_APP_BACKEND_URL not set")
    return value.rstrip("/")


@pytest.fixture()
def auth_client(base_url: str) -> requests.Session:
    session = requests.Session()

    csrf_response = session.get(f"{base_url}/auth/csrf", timeout=20)
    assert csrf_response.status_code == 200
    csrf_token = csrf_response.json().get("csrfToken")
    assert csrf_token

    callback_response = session.post(
        f"{base_url}/auth/callback/credentials",
        data={
            "csrfToken": csrf_token,
            "email": "demo@zcvios.local",
            "password": "DemoPass123!",
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
    session_payload = session_response.json()
    assert session_payload.get("user", {}).get("email") == "demo@zcvios.local"

    return session


def test_authenticated_session_is_available(base_url: str, auth_client: requests.Session):
    response = auth_client.get(f"{base_url}/auth/session", timeout=20)
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["email"] == "demo@zcvios.local"


def test_authenticated_mission_and_weekly_review(base_url: str, auth_client: requests.Session):
    mission_response = auth_client.get(f"{base_url}/rpc/mission", timeout=20)
    assert mission_response.status_code == 200
    mission_data = mission_response.json()
    assert "mission" in mission_data
    assert "lever" in mission_data["mission"]
    assert mission_data.get("inactivityLevel", 0) >= 0

    review_response = auth_client.get(f"{base_url}/rpc/reports/weekly-review", timeout=20)
    assert review_response.status_code == 200
    review_data = review_response.json()
    assert "report" in review_data
    assert "overrideHistory" in review_data


def test_authenticated_revenue_save_with_signals(base_url: str, auth_client: requests.Session):
    response = auth_client.post(
        f"{base_url}/rpc/revenue",
        json={
            "weekStart": date.today().isoformat(),
            "revenue": 2345,
            "note": "pytest-authenticated-revenue",
            "trafficSessions": 140,
            "leadsGenerated": 16,
            "closedSales": 4,
            "churnedCustomers": 1,
            "grossMarginPct": 36,
        },
        timeout=20,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert "strategy" in data
    assert data["signals"]["trafficSessions"] == 140


def test_future_dated_log_is_rejected(base_url: str, auth_client: requests.Session):
    future_date = (date.today() + timedelta(days=2)).isoformat()
    response = auth_client.post(
        f"{base_url}/rpc/logs",
        json={
            "date": future_date,
            "minutes": 45,
            "category": "LEVER",
            "completed": True,
            "note": "future-date-should-fail",
        },
        timeout=20,
    )
    assert response.status_code == 400
    assert "Future dates are not allowed" in response.json().get("error", "")
