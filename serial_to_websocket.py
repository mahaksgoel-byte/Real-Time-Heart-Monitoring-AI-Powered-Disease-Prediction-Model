import serial
import requests
import time

ARDUINO_PORT = 'COM3'  # Change to your Arduino port
BAUD_RATE = 115200
API_URL = 'http://localhost:5000/bpm'

def read_arduino():
    try:
        ser = serial.Serial(ARDUINO_PORT, BAUD_RATE, timeout=1)
        print(f"Connected to Arduino on {ARDUINO_PORT}")
        
        while True:
            line = ser.readline().decode('utf-8').strip()
            if line.startswith('BPM:'):
                bpm = int(line.split(':')[1])
                print(f"Received BPM: {bpm}")
                
                # Send to backend
                try:
                    response = requests.post(API_URL, json={'bpm': bpm})
                    if response.status_code != 200:
                        print(f"Failed to send BPM: {response.text}")
                except Exception as e:
                    print(f"API error: {e}")
                    
    except serial.SerialException as e:
        print(f"Serial error: {e}. Retrying in 5 seconds...")
        time.sleep(5)
        read_arduino()

if __name__ == '__main__':
    read_arduino()