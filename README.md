# 🗣️ Dhwani - Voice-First AI Citizen Interface
> **Bridging the Digital Divide with a Zero-Latency, Action-Oriented AI Voice Agent.**

![Project Banner](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop) 

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
