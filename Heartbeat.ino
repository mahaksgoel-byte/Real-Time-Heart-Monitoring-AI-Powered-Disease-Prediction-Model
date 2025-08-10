#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 srituhobby = Adafruit_SSD1306(128, 64, &Wire);

#define sensor A0
#define Highpulse 540

int sX = 0;
int sY = 60;
int x = 0;
int Svalue;
int value;
long Stime = 0;
long Ltime = 0;
int count = 0;
int Bpm = 0;
bool pulseDetected = false;

void setup() {
  Serial.begin(115200);  // Increased baud rate for better performance
  srituhobby.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  delay(1000);
  srituhobby.clearDisplay();
  pinMode(8, OUTPUT); // Set buzzer pin as output
}

void loop() {
  Svalue = analogRead(sensor);
  value = map(Svalue, 0, 1024, 0, 45);

  int y = 60 - value;

  if (x > 128) {
    x = 0;
    sX = 0;
    srituhobby.clearDisplay();
  }

  srituhobby.drawLine(sX, sY, x, y, WHITE);
  sX = x;
  sY = y;
  x++;

  BPM();

  srituhobby.setCursor(0, 0);
  srituhobby.setTextSize(2);
  srituhobby.setTextColor(SSD1306_WHITE);
  srituhobby.print("BPM :");
  srituhobby.display();
}

void BPM() {
  if (Svalue > Highpulse && !pulseDetected) {
    pulseDetected = true;
    Stime = millis() - Ltime;
    count++;
    
    if (Stime / 1000 >= 60) {
      Ltime = millis();
      Bpm = count;
      count = 0;
      
      // Send BPM data to serial
      Serial.print("BPM:");
      Serial.println(Bpm);
      
      // Display on OLED
      srituhobby.setCursor(60, 0);
      srituhobby.setTextSize(2);
      srituhobby.setTextColor(SSD1306_WHITE);
      srituhobby.print(Bpm);
      srituhobby.print("   ");
      srituhobby.display();
      
      digitalWrite(8, HIGH);
      delay(100);
      digitalWrite(8, LOW);
    }
  }
  
  if (Svalue < Highpulse) {
    pulseDetected = false;
  }
}