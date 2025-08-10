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
Heart-Monitor-Prediction
│
├── app.py                       # Flask backend server
├── generate_model.py             # Script to train & save ML model
├── serial_to_websocket.py        # Arduino-to-WebSocket integration
├── hardware-integration.js       # JavaScript for hardware communication
│
├── model.pkl                     # Serialized ML prediction model
├── requirements.txt              # Python dependencies
├── tailwind.config.js            # Tailwind CSS configuration
│
├── index.html                    # Home page
├── login.html                    # User login page
├── signup.html                   # User registration page
├── prediction.html                # Heart disease prediction form
├── results.html                   # Prediction results page
├── chatbot.html                   # AI chatbot interface
├── checkins.html                  # User health check-ins
├── preventions.html               # Preventive tips page
│
├── script.js                     # Frontend JS logic
├── style.css                     # Styling
│
📂 assets
│   📂 audio
│   │   └── heartbeat.mp3         # Heartbeat sound effect
│   📂 Data
│   │   └── cardio_cleaned_optimized.csv  # Cleaned dataset
│   📂 heartbeat
│   │   └── Heartbeat.ino         # Arduino sketch for live heartbeat sensing
│   📂 images
│   │   ├── Screenshot 2025-06-10 at ...
│   │   ├── Screenshot 2025-06-10 at ...
│   │   └── Screenshot 2025-06-10 at ...
│   📂 videos
│       └── heart-bg.mp4          # Background video

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
