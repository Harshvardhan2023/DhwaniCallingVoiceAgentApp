import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    RETELL_API_KEY = os.getenv("RETELL_API_KEY")
    AGENT_ID = os.getenv("AGENT_ID")
    SIP_TARGET = os.getenv("SIP_TARGET")

    @classmethod
    def validate(cls):
        if not all([cls.GROQ_API_KEY, cls.RETELL_API_KEY, cls.AGENT_ID, cls.SIP_TARGET]):
            print("❌ WARNING: Missing API Keys !!")

Config.validate()