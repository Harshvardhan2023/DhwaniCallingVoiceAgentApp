# In a real app, this would connect to SQL/Firebase
MOCK_DB = {
    "1234": "Pending Approval. Currently with the District Officer.",
    "5678": "Approved. Certificate available for download.",
    "K1914": "Under Review. Expected completion by Tuesday."
}

def check_application_status(app_id: str) -> str:
    """Simulates a database lookup."""
    return MOCK_DB.get(app_id, "Record not found. Please check the ID.")