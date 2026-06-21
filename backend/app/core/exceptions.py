class NotFoundException(Exception):
    """Raised when a requested resource does not exist."""

    def __init__(self, resource: str, identifier):
        self.resource = resource
        self.identifier = identifier
        super().__init__(f"{resource} with id {identifier} not found")


class DuplicateException(Exception):
    """Raised when a uniqueness constraint (SKU, email) would be violated."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class InsufficientStockException(Exception):
    """Raised when an order requests more units than are currently in stock."""

    def __init__(self, product_name: str, requested: int, available: int):
        self.product_name = product_name
        self.requested = requested
        self.available = available
        super().__init__(
            f"Insufficient stock for '{product_name}': requested {requested}, available {available}"
        )


class ValidationException(Exception):
    """Raised for business-rule validation failures (e.g. negative quantity)."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)
