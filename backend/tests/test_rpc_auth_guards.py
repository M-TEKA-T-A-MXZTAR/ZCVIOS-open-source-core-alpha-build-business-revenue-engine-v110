import os
import requests
import pytest

# Module: Core protected RPC route handlers authentication guard coverage
PROTECTED_RPC_ENDPOINTS = [
    "/rpc/mission",
    "/rpc/revenue",
    "/rpc/logs",
    "/rpc/reports/weekly",
    "/rpc/reports/monthly",
    "/rpc/openai-key",
    "/rpc/pause",
    "/rpc/data-export",
    "/rpc/onboarding",
]

# Module: Data deletion and override write routes authentication guard coverage
PROTECTED_RPC_MUTATIONS = [
    ("POST", "/rpc/mission", None),
    ("POST", "/rpc/revenue", {"revenue": 10, "note": "pytest-unauth"}),
    ("POST", "/rpc/logs", {"date": "2026-02-10", "minutes": 30, "category": "LEVER", "completed": True}),
    ("POST", "/rpc/pause", {"mode": "1week"}),
    ("POST", "/rpc/openai-key", {"apiKey": "sk-test-key-for-auth-guard-00000"}),
    ("DELETE", "/rpc/openai-key", None),
    ("DELETE", "/rpc/data-delete", {"confirmation": "DELETE"}),
    ("POST", "/rpc/onboarding", {"businessType": "unknown", "hoursAvailablePerWeek": 40, "weeklyRevenue": 0, "targetMonthlyIncome": 1000, "targetMaxHoursPerWeek": 35, "consistencyWindowMonths": 6, "fullLoggingEnabled": False, "commandMode": True}),
    ("POST", "/rpc/lever-override", {"selectedLever": "Distribution", "reason": "pytest"}),
]


@pytest.fixture(scope="session")
def base_url() -> str:
    value = os.environ.get("REACT_APP_BACKEND_URL")
    if not value:
        pytest.skip("REACT_APP_BACKEND_URL not set")
    return value.rstrip("/")


@pytest.fixture()
def client() -> requests.Session:
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


def test_landing_is_public(base_url: str, client: requests.Session):
    response = client.get(f"{base_url}/")
    assert response.status_code == 200
    assert "ZC-VIOS Core" in response.text


@pytest.mark.parametrize("endpoint", PROTECTED_RPC_ENDPOINTS)
def test_protected_rpc_get_returns_401_without_session(base_url: str, client: requests.Session, endpoint: str):
    response = client.get(f"{base_url}{endpoint}")
    assert response.status_code == 401
    data = response.json()
    assert data["error"] == "Unauthorized"


@pytest.mark.parametrize("method,endpoint,payload", PROTECTED_RPC_MUTATIONS)
def test_protected_rpc_mutations_return_401_without_session(
    base_url: str,
    client: requests.Session,
    method: str,
    endpoint: str,
    payload: dict | None,
):
    url = f"{base_url}{endpoint}"
    if method == "POST":
        response = client.post(url, json=payload)
    elif method == "DELETE":
        response = client.delete(url, json=payload)
    else:
        raise AssertionError(f"Unsupported method in test: {method}")

    assert response.status_code == 401
    data = response.json()
    assert data["error"] == "Unauthorized"


def test_register_route_validation_for_invalid_payload(base_url: str, client: requests.Session):
    response = client.post(
        f"{base_url}/rpc/register",
        json={"email": "invalid-email", "password": "123", "name": "pytest"},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["error"] == "Invalid input"
