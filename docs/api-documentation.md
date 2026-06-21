# API Reference

Base URL (local): `http://localhost:8000`
Interactive docs (Swagger UI): `http://localhost:8000/docs`

All responses are JSON. Errors follow the shape `{"detail": "..."}`.

## Products

### `POST /products`
Create a product.

Request body:
```json
{ "name": "Wireless Mouse", "sku": "WM-2042", "price": 19.99, "quantity_in_stock": 100 }
```
- `201 Created` → product object
- `409 Conflict` → SKU already exists
- `422 Unprocessable Entity` → validation error (e.g. negative stock, price <= 0)

### `GET /products`
List products. Query params: `skip` (default 0), `limit` (default 100, max 500).

### `GET /products/{id}`
Retrieve a single product. `404` if not found.

### `PUT /products/{id}`
Partial update — only send the fields you want to change.
- `409 Conflict` if the new SKU clashes with another product.

### `DELETE /products/{id}`
`204 No Content` on success.

## Customers

### `POST /customers`
```json
{ "full_name": "Jane Doe", "email": "jane@example.com", "phone": "555-123-4567" }
```
- `409 Conflict` → email already exists

### `GET /customers`, `GET /customers/{id}`, `DELETE /customers/{id}`
Standard list / retrieve / delete semantics, matching the products endpoints.

## Orders

### `POST /orders`
```json
{
  "customer_id": 1,
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ]
}
```
The server, never the client, computes `total_amount` and deducts stock.
- `201 Created` → order object including line items with resolved product details
- `404 Not Found` → unknown customer or product id
- `422 Unprocessable Entity` → any line item exceeds available stock (no partial writes occur)

### `GET /orders`, `GET /orders/{id}`
Returns orders with nested `items`, each including its `product`.

### `DELETE /orders/{id}`
Cancels the order and restocks the products it held. `204 No Content`.

## Dashboard

### `GET /dashboard/summary`
```json
{
  "total_products": 12,
  "total_customers": 5,
  "total_orders": 8,
  "low_stock_threshold": 10,
  "low_stock_products": [ /* ProductOut[] with quantity_in_stock <= 10 */ ]
}
```
