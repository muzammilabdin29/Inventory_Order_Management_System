def _create_customer(client):
    res = client.post(
        "/customers",
        json={"full_name": "Jane Doe", "email": "jane@example.com", "phone": "123-456-7890"},
    )
    return res.json()["id"]


def _create_product(client, stock=10):
    res = client.post(
        "/products",
        json={"name": "Widget", "sku": "WID-001", "price": "10.00", "quantity_in_stock": stock},
    )
    return res.json()["id"]


def test_create_order_deducts_stock_and_computes_total(client):
    customer_id = _create_customer(client)
    product_id = _create_product(client, stock=10)

    response = client.post(
        "/orders",
        json={"customer_id": customer_id, "items": [{"product_id": product_id, "quantity": 3}]},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["total_amount"] == "30.00"

    product_check = client.get(f"/products/{product_id}")
    assert product_check.json()["quantity_in_stock"] == 7


def test_order_rejected_when_insufficient_stock(client):
    customer_id = _create_customer(client)
    product_id = _create_product(client, stock=2)

    response = client.post(
        "/orders",
        json={"customer_id": customer_id, "items": [{"product_id": product_id, "quantity": 5}]},
    )
    assert response.status_code == 422

    # Stock must be unchanged after a rejected order.
    product_check = client.get(f"/products/{product_id}")
    assert product_check.json()["quantity_in_stock"] == 2


def test_delete_order_restocks_product(client):
    customer_id = _create_customer(client)
    product_id = _create_product(client, stock=10)

    order_res = client.post(
        "/orders",
        json={"customer_id": customer_id, "items": [{"product_id": product_id, "quantity": 4}]},
    )
    order_id = order_res.json()["id"]

    delete_res = client.delete(f"/orders/{order_id}")
    assert delete_res.status_code == 204

    product_check = client.get(f"/products/{product_id}")
    assert product_check.json()["quantity_in_stock"] == 10
