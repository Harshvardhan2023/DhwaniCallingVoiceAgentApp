import json
import asyncio
import requests
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from config import Config
from prompts import RECEPTIONIST_PROMPT
from services.llm import process_user_turn

router = APIRouter()

# --- 1. Frontend Token Gen ---
@router.get("/create-web-call")
async def create_web_call():
    headers = {
        "Authorization": f"Bearer {Config.RETELL_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {"agent_id": Config.AGENT_ID}
    try:
        response = requests.post(
            "https://api.retellai.com/v2/create-web-call", 
            headers=headers, 
            json=payload
        )
        return response.json()
    except Exception as e:
        return {"error": str(e)}

# --- 2. WebSocket Handler ---
@router.websocket("/llm-websocket/{call_id:path}")
async def websocket_endpoint(websocket: WebSocket, call_id: str):
    await websocket.accept()
    print(f"✅ Incoming Call: {call_id}")

    # Send Initial Greeting
    await websocket.send_text(json.dumps({
        "response_id": 0,
        "content": "Hello, Central Citizen Services. How may I assist you?",
        "content_complete": True, "end_call": False
    }))

    try:
        async for data in websocket.iter_text():
            request = json.loads(data)

            # --- Echo Cancellation ---
            if request.get('transcript'):
                user_text = request['transcript'][-1]['content']
                if "Central Citizen Services" in user_text and len(user_text.split()) > 3:
                    if request['interaction_type'] == 'response_required':
                         await websocket.send_text(json.dumps({
                            "response_id": request['response_id'], "content": "", "content_complete": True, "end_call": False
                        }))
                    continue 

            # --- Processing ---
            if request['interaction_type'] == 'response_required':
                response_id = request['response_id']
                transcript = request['transcript']

                # Call LLM Service (Pass Receptionist Prompt)
                response_text, signal = await process_user_turn(transcript, RECEPTIONIST_PROMPT)

                # HANDLE REAL SIP TRANSFER
                if signal == "TRANSFER_SIGNAL":
                    print(f"🔄 TRANSFERRING TO SIP: {Config.SIP_TARGET}")
                    
                    # 1. Notify User
                    await websocket.send_text(json.dumps({
                        "response_id": response_id,
                        "content": "I am transferring you to the District Officer. Please hold the line.",
                        "content_complete": True, "end_call": False
                    }))
                    
                    # 2. Execute Transfer (Retell -> Your Linphone)
                    transfer_payload = {
                        "response_id": response_id,
                        "transfer_call": {
                            "to_call_url": Config.SIP_TARGET
                        }
                    }
                    await websocket.send_text(json.dumps(transfer_payload))
                    continue # Stop processing logic for this turn

                # Standard Response
                await websocket.send_text(json.dumps({
                    "response_id": response_id,
                    "content": response_text,
                    "content_complete": True,
                    "end_call": False
                }))

    except WebSocketDisconnect:
        print(f"🔴 Call Disconnected: {call_id}")
    except Exception as e:
        print(f"❌ Error: {e}")