"""Custom service-layer exceptions."""


class ServiceError(Exception):
    """Structured exception for expected service-layer failures."""

    def __init__(self, message: str, status_code: int) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code
