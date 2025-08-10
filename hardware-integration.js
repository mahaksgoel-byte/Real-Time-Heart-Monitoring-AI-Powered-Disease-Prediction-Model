// Hardware Integration Module
class HardwareIntegration {
  constructor() {
    // Configuration
    this.SOCKET_URL = "ws://localhost:5000";
    this.socket = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 5000; // 5 seconds

    // Initialize connection
    this.initConnection();
  }

  initConnection() {
    this.socket = new WebSocket(this.SOCKET_URL);

    this.socket.onopen = () => {
      console.log('Connected to BPM WebSocket');
      this.connected = true;
      this.reconnectAttempts = 0;
      this.showHardwareStatus('Connected to heart rate monitor', 'success');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.bpm) {
          this.handleBPMData(data.bpm);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      console.log('Disconnected from BPM WebSocket');
      this.connected = false;
      this.handleDisconnection();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.showHardwareStatus('Connection error', 'error');
    };
  }

  handleBPMData(bpm) {
    // Update all heart rate inputs on the page
    const heartRateInputs = document.querySelectorAll('input[id*="heartRate"], input[id*="HeartRate"]');
    
    heartRateInputs.forEach(input => {
      if (!input.disabled) {
        input.value = bpm;
        // Trigger any input event listeners
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
      }
    });

    // Show first-time notification
    if (!localStorage.getItem('bpmNotificationShown')) {
      this.showToast(`Heart rate detected: ${bpm} BPM`, false);
      localStorage.setItem('bpmNotificationShown', 'true');
    }

    // Optional: Update a visual BPM indicator if exists
    const bpmIndicator = document.getElementById('bpmIndicator');
    if (bpmIndicator) {
      bpmIndicator.textContent = bpm;
      bpmIndicator.classList.remove('text-gray-500', 'text-red-500', 'text-green-500');
      
      if (bpm < 60) {
        bpmIndicator.classList.add('text-blue-500');
      } else if (bpm > 100) {
        bpmIndicator.classList.add('text-red-500');
      } else {
        bpmIndicator.classList.add('text-green-500');
      }
    }
  }

  handleDisconnection() {
    this.showHardwareStatus('Disconnected - Attempting to reconnect...', 'warning');
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}`);
        this.initConnection();
      }, this.reconnectDelay);
    } else {
      this.showHardwareStatus('Connection lost - Please refresh page', 'error');
    }
  }

  showHardwareStatus(message, type = 'info') {
    // Update status indicator if exists
    const statusElement = document.getElementById('hardwareStatus');
    if (statusElement) {
      statusElement.textContent = message;
      statusElement.className = 'hardware-status'; // Reset classes
      statusElement.classList.add(`status-${type}`);
    }

    // Optional: Show toast notification
    this.showToast(`Hardware: ${message}`, type === 'error');
  }

  showToast(message, isError = false) {
    // Reuse existing toast functionality if available
    if (typeof showToast === 'function') {
      showToast(message, isError);
    } else {
      // Fallback simple notification
      console.log(`${isError ? 'Error' : 'Info'}: ${message}`);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const hardware = new HardwareIntegration();
  
  // Make available globally if needed
  window.heartRateMonitor = hardware;
});