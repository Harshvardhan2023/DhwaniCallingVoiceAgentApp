import json
from groq import AsyncGroq
from config import Config
from services.database import check_application_status

client = AsyncGroq(api_key=Config.GROQ_API_KEY)
model = "llama-3.1-8b-instant"

async def process_user_turn(transcript, system_prompt):
    """
    Takes Conversation History -> Returns (Response_Text, Signal)
    Signal can be: None, "TRANSFER_SIGNAL"
    """
    
    # 1. Build Context
    messages = [{"role": "system", "content": system_prompt}]
    for turn in transcript:
        role = "user" if turn['role'] == "user" else "assistant"
        messages.append({"role": role, "content": turn['content']})

    # 2. Get AI Response
    try:
        completion = await client.chat.completions.create(
            messages=messages,
            model=model,
            max_tokens=200
        )
        ai_reply = completion.choices[0].message.content
    except Exception as e:
        print(f"❌ Groq Error: {e}")
        return "I am currently experiencing High Traffic. Please Try Again !!", None

    # 3. Tool: Check Status (Mock DB)
    if "[CHECK_STATUS:" in ai_reply:
        try:
            start = ai_reply.find("[CHECK_STATUS:") + 14
            end = ai_reply.find("]", start)
            app_id = ai_reply[start:end].strip()
            
            # DB Lookup
            status = check_application_status(app_id)
            
            # Feed result back to AI to generate natural speech
            tool_msg = f"SYSTEM: Status for ID {app_id} is: {status}. Explain this to the user."
            messages.append({"role": "assistant", "content": ai_reply})
            messages.append({"role": "user", "content": tool_msg})
            
            final_comp = await client.chat.completions.create(
                messages=messages, model="llama-3.1-8b-instant"
            )
            return final_comp.choices[0].message.content, None
            
        except Exception:
            return "I couldn't verify that ID. Please check the Number.", None

    # 4. Tool: Transfer Trigger
    # If the AI decided to transfer, we catch it here
    if "[TRANSFER_CALL]" in ai_reply:
        return ai_reply, "TRANSFER_SIGNAL"

    return ai_reply, None