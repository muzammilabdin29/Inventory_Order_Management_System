def test_create_customer(client):
    response = client.post(
        "/customers",
        json={"full_name": "Jane Doe", "email": "jane@example.com", "phone": "123-456-7890"},
    )
    assert response.status_code == 201
    assert response.json()["email"] == "jane@example.com"


def test_duplicate_email_rejected(client):
    payload = {"full_name": "Jane Doe", "email": "jane@example.com", "phone": "123-456-7890"}
    client.post("/customers", json=payload)
    response = client.post("/customers", json=payload)
    assert response.status_code == 409
