❤️ Heart Disease Prediction & Monitoring Web Application

📌 Overview
This is an integrated web application for real-time heart health monitoring and heart disease risk prediction.
The platform combines live heartbeat sensing from connected hardware with AI-powered disease prediction, health guidance, preventive tips, and chatbot assistance — all in one easy-to-use interface.

Users can:
- Securely sign up and log in.
- Stream and visualize live heartbeat data from a connected heart-rate sensor.
- Predict heart disease risk using an integrated machine learning model.
- View personalized preventive healthcare recommendations.
- Chat with an AI assistant for health-related guidance.
- Access educational content and awareness resources.

🚀 Features

❤️ Live Heartbeat Monitoring – Reads data directly from connected hardware (Arduino-based heart rate sensor) and displays it in real time.

🩺 Disease Prediction – AI-powered model analyzes user inputs to predict heart disease risk.

📋 Prevention Tips – Displays lifestyle and medical advice to lower health risks.

🤖 AI Chatbot – Instant responses to heart-health-related queries.

🔐 User Authentication – Secure signup/login system for personalized use.

🎵 Media Integration – Background videos and audio for engagement.

🛠️ Tech Stack
- Frontend: HTML5, CSS3, JavaScript
- Backend: Python (Flask Framework)
- Machine Learning: scikit-learn model (serialized with pickle)
- Hardware: Arduino with pulse sensor & OLED display
- Other: Flask-CORS for cross-origin requests

📂 Project Structure
```
├── app.py                       # Flask backend server
├── model.pk1                    # Serialized ML prediction model
├── index.html                    # Home page
├── prediction.html               # Heart disease prediction interface
├── results.html                  # Prediction results page
├── chatbot.html                  # AI chatbot interface
├── prevention.html               # Preventive tips and awareness
├── script.js                     # Frontend JavaScript (live heartbeat, UI logic)
├── style.css                     # Styling
├── assets/
│   ├── videos/
│   │   └── heart-bg.mp4          # Background video
│   ├── audio/
│   │   └── heartbeat.mp3         # Audio effect
│   └── images/
│       └── (PNG/JPG image files)
└── Heartbeat/
    └── Heartbeat.ino             # Arduino sketch for live heartbeat sensing
```

⚙️ Installation & Setup

1. Clone the Repository
   git clone https://github.com/yourusername/heart-monitor-ai-model.git
   cd Heart-Monitor-Prediction
   
2. Install Dependencies
   pip install flask flask-cors scikit-learn
   
3. Connect Hardware
- Upload Heartbeat.ino to an Arduino-compatible board.
- Connect the pulse sensor to A0.
- Ensure Arduino is connected via USB to the server machine.

4. Run the Server
  python app.py
  Server runs on: http://127.0.0.1:5000

5. Open the Application
Open index.html or other pages via a local server.

🐞 Challenges Faced

- Hardware–Software Integration – Ensuring real-time heartbeat data was accurately read and sent to the web app. Solved by optimizing serial read intervals and syncing frontend updates.
- Model Deployment – Issues loading the ML model on Flask startup; fixed by using pickle and absolute file paths.
- CORS & Fetch Errors – Requests failed when serving HTML locally; fixed with Flask-CORS and serving from a running Flask backend.
- UI Responsiveness – Real-time data rendering affected page performance; optimized DOM updates to only refresh on change.

📸 Screenshots
(Add screenshots of dashboard, live heartbeat graph, prediction form, chatbot, etc.)

💡 Future Improvements
Mobile-friendly responsive design.
Cloud-based heartbeat data storage for long-term tracking.
Improved AI chatbot with more medical datasets.

📜 License
This project is licensed under the Apache License.

🔗 GitHub Repository: https://github.com/mahaksgoel-byte/Real-Time-Heart-Monitoring-AI-Powered-Disease-Prediction-Model
