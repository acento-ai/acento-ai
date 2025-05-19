# Acento.ai

> **Your personal AI-powered communication coach**  
> Improve your professional speaking skills with personalized, actionable feedback on your audio conversations.

---

## 🚀 Table of Contents

1. [About](#about)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
   - [Running Locally](#running-locally)  

---



## About

Every great career begins with a single conversation. Yet high-stakes interviews, sales pitches, and professional meetings can feel overwhelming—especially when you don’t get clear feedback. **Acento.ai** bridges that gap by turning your recorded audio into a roadmap for growth: tone, pacing, filler-word usage, clarity, and confidence.

Devpost: [https://devpost.com/software/acento-ai](https://devpost.com/software/acento-ai)

Check out the live demo [here](https://theamanm.github.io/acento-ai/)


---

## Features

- **Audio Import**  
  Upload practice interviews, meetings, sales pitches.
- **Transcription & Analysis**  
  WhisperAI-powered transcripts combined with OpenSmile feature extraction.
- **AI-Driven Feedback**  
  Gemini-backed recommendations on tone, pacing, clarity, and filler words.
- **Personalized Roadmap**  
  Actionable tips and exercises tailored to your speaking style.
- **History & Progress Tracking**  
  Review past sessions, compare metrics, and celebrate improvements.

---

## Tech Stack

- **Front-end:** React  
- **Back-end & Hosting:** Firebase (Auth, Firestore, Hosting)  
- **Speech-to-Text:** WhisperAI  
- **Audio Feature Extraction:** OpenSmile  
- **AI Insights & Recommendations:** Gemini API  
- **Deployment:** Firebase Hosting  

---

## Getting Started

### Prerequisites

- Node.js >= 14.x  
- npm or yarn  
- A Firebase project with Firestore and Hosting enabled  
- API keys for:
  - Gemini


### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/acento.ai.git
cd acento.ai

# Install dependencies
npm install

pip install -r backend\requirements.txt

```
### Running Locally

1. Add a .env with "GEMINI_API_KEY" in `backend\model`

2. Start the development server:
```
# in one terminal
cd frontend
flask run

# in another
cd frontend
npm run dev
```
3. Visit http://localhost:3000 in your browser.













