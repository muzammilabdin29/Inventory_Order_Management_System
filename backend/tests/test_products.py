def test_create_product(client):
    response = client.post(
        "/products",
        json={"name": "Widget", "sku": "WID-001", "price": "9.99", "quantity_in_stock": 50},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["sku"] == "WID-001"
    assert body["quantity_in_stock"] == 50


def test_duplicate_sku_rejected(client):
    payload = {"name": "Widget", "sku": "WID-001", "price": "9.99", "quantity_in_stock": 50}
    client.post("/products", json=payload)
    response = client.post("/products", json=payload)
    assert response.status_code == 409


def test_negative_stock_rejected(client):
    response = client.post(
        "/products",
        json={"name": "Widget", "sku": "WID-002", "price": "9.99", "quantity_in_stock": -1},
    )
    assert response.status_code == 422


def test_get_nonexistent_product(client):
    response = client.get("/products/999")
    assert response.status_code == 404
