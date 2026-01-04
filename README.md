# 🗣️ Dhwani - Voice-First AI Citizen Interface
> **Bridging the Digital Divide with a Zero-Latency, Action-Oriented AI Voice Agent.**

[![Watch the Demo](https://img.youtube.com/vi/VvWGgAr22GY/maxresdefault.jpg)](https://youtu.be/VvWGgAr22GY)

## 🚀 The Problem
Government services remain inaccessible to millions of citizens due to:
* **Language Barriers:** Interfaces are mostly English-first.
* **Digital Illiteracy:** Complex forms and navigation.
* **High Latency:** Existing IVR systems are slow and frustrating.

## 💡 The Solution
**Dhwani** is a full-duplex, multimodal AI voice agent that allows citizens to access services (check status, file complaints, book slots) by simply **talking** in their native language (Hindi/English/Hinglish).

It acts as an **Intelligent Agent**, not just a chatbot—connecting directly to backend databases to perform tasks autonomously.

---

## ✨ Key Features

### 🧠 Cognitive Intelligence
* **Hyper-Local Linguistics:** Supports Code-Switching (Hinglish) and detects user language automatically.
* **Real-Time Sentiment Analysis:** Detects distress/anger and prioritizes the call for human intervention.

### ⚡ Performance
* **"Flash" Inference:** Powered by **Groq LPU (Llama 3.1 8B)** for millisecond responses.
* **Smart Interruptibility:** Handles "Barge-In" (stops talking instantly when interrupted), mimicking natural human conversation.

### 🛠️ Action-Oriented
* **Autonomous Agent:** Updates Google Sheets, Databases, and CRMs via **n8n** workflows.
* **Multimodal Sync:** The UI updates visually in real-time as the agent speaks, aiding hearing-impaired users.

---

## 🏗️ Architecture & Tech Stack

### **Frontend (The Interface)**
* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS + Lucide React
* **Voice Client:** Retell AI Web SDK

### **Backend (The Brain)**
* **Server:** Python FastAPI (Async Uvicorn)
* **LLM Engine:** Groq API (Llama 3.1 8B Instant)
* **Telephony Orchestration:** Retell AI
* **Secure Tunneling:** Cloudflare Tunnel (`cloudflared`)

### **Data & Automation**
* **Database:** Firebase Firestore & Auth
* **Workflow Engine:** n8n (Self-Hosted via Docker)
* **SIP Bridging:** Linphone (For agent handoffs)

---

## ⚙️ Installation & Setup

### Prerequisites
* Node.js 18+
* Python 3.10+
* Docker (Optional, for n8n)

### 1. Clone the Repository
```bash
git clone [https://github.com/Harshvardhan2023/DhwaniCallingVoiceAgentApp.git](https://github.com/Harshvardhan2023/DhwaniCallingVoiceAgentApp.git)
cd DhwaniCallingVoiceAgentApp
```
### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
```
#### Configure Environment Variables: Create a .env file in /backend:
```bash
GROQ_API_KEY=your_groq_key
RETELL_API_KEY=your_retell_key
FIREBASE_CREDENTIALS=serviceAccountKey.json
SIP_TARGET=sip:username@sip.linphone.org
```
#### Run Server:
```bash
python main.py
```
### 3. Frontend Setup
```bash
cd ../dhwani-web
npm install
npm run dev
```
#### Access the app at http://localhost:3000.

---

## 🔌 Integration Workflow (Data Flow)
1. **User Speaks:** Audio streamed via WebSocket to **Retell AI**.
2. **Transcription:** Retell sends text to **FastAPI Backend**.
3. **Intelligence:** Backend queries **Groq (Llama 3)** for a response.
4. **Action:** If a task is detected (e.g., "Check Status"), Backend triggers **n8n Webhook**.
5. **Response:** Audio is synthesized (TTS) and streamed back to the user instantly.

## 🛡️ Security
* **Zero-Trust Tunneling:** Backend is exposed via **Cloudflare Tunnel**, keeping ports closed.
* **Sovereign Data:** Citizen logs are processed on self-hosted instances (**n8n**), ensuring data privacy.

## 👥 Team
* **Harshvardhan Mehta** - Lead Developer
