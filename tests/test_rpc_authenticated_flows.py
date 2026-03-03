import os
import time
from datetime import date, timedelta

import pytest
import requests


@pytest.fixture(scope="session")
def base_url() -> str:
    value = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:3000")
    return value.rstrip("/")


@pytest.fixture()
def auth_client(base_url: str) -> requests.Session:
    return login_session(base_url, "demo@zcvios.local", "DemoPass123!")


def login_session(base_url: str, email: str, password: str) -> requests.Session:
    session = requests.Session()

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
    session_payload = session_response.json()
    assert session_payload.get("user", {}).get("email") == email

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


def test_data_export_and_delete_account_flow(base_url: str):
    email = f"qa.privacy.{int(time.time())}@zcvios.local"
    password = "PrivacyPass123!"

    register_response = requests.post(
        f"{base_url}/rpc/register",
        json={"name": "QA Privacy", "email": email, "password": password},
        timeout=20,
    )
    assert register_response.status_code == 200

    session = login_session(base_url, email, password)

    export_response = session.get(f"{base_url}/rpc/data-export", timeout=20)
    assert export_response.status_code == 200
    export_payload = export_response.json()
    assert export_payload.get("policy") == "We do not sell your data."
    assert export_payload.get("data", {}).get("user", {}).get("email") == email

    delete_response = session.delete(
        f"{base_url}/rpc/data-delete",
        json={"confirmation": "DELETE"},
        timeout=20,
    )
    assert delete_response.status_code == 200
    assert delete_response.json().get("ok") is True

    deleted_session = requests.Session()
    csrf = deleted_session.get(f"{base_url}/auth/csrf", timeout=20).json().get("csrfToken")
    assert csrf
    login_after_delete = deleted_session.post(
        f"{base_url}/auth/callback/credentials",
        data={
            "csrfToken": csrf,
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
    assert login_after_delete.status_code in (200, 302, 401)
    session_payload = deleted_session.get(f"{base_url}/auth/session", timeout=20).json()
    assert not session_payload.get("user")
