
#include <ServoFS5106B.h>
#include <Queue.h>

#define LED_PIN 13

Servo servoX;
int servoXPin = 5;
int servoXMinVal = 0;
int servoXMaxVal = 180;
int servoXMidVal = (servoXMaxVal - servoXMinVal) / 2;

Servo servoY;
int servoYPin = 6;
int servoYMinVal = 0;
int servoYMaxVal = 90;
int servoYMidVal = (servoYMaxVal - servoYMinVal) / 2;

Queue scheduler;
int pirPin = 48;
int motionLevel = 0;

int msgByte= -1;         // incoming byte
const int msgSize = 50;  // max message size
char msgArray[msgSize];  // array for incoming data
int msgPos = 0;          // current position
char msgType;
char msgValueArray[4];
int msgValue;

int ellapsedFrames = 0;

void setup(){
  Serial.begin(9600);
  Serial.flush();
  
  servoX.attach(servoXPin);
  servoX.write(servoXMidVal);
  
  servoY.attach(servoYPin);
  servoY.write(servoYMidVal);
  
  pinMode(pirPin, INPUT);
  digitalWrite(pirPin, LOW);
  // callibration time
  for(int i = 0; i < 3; i++){
    //Serial.print(".");
    delay(1000);
  }
  
  scheduler.scheduleFunction(sendMotionData, "Test", 2000, 1000);
}

void loop(){
  handleSerial();
  scheduler.Run(millis());
}

void receiveData() {
  if (msgType == 'x') {
    int val = map(msgValue, 90, -90, servoXMinVal, servoXMaxVal);
    servoX.write(val);
  }
  
  if (msgType == 'y') {
    int val = map(msgValue, 45, -45, servoYMinVal, servoYMaxVal);
    servoY.write(val);
  }
}

int sendMotionData(unsigned long now) {
  int motionVal = digitalRead(pirPin);
  
  // increment/decrement motionLevel
  if (motionVal == 1) {
    motionLevel++;
    if (motionLevel > 10) motionLevel = 10;
  } else {
    motionLevel--;
    if (motionLevel < -1) motionLevel = -1;
  }
  
  if (motionLevel >= 0) {
    Serial.print("{\"motionGauge\": ");
    Serial.print(motionLevel);
    Serial.println("}");
  }
}

void sendData() {
  Serial.print("msgType: ");
  Serial.print(msgType);
  Serial.print(" msgValue: ");
  Serial.println(msgValue);
}

void handleSerial() {  
  if (Serial.available() > 0) {
    digitalWrite(LED_PIN, HIGH);
    msgByte = Serial.read();
    
    if (msgByte != '\n') {
      // add incoming byte to array
      msgArray[msgPos] = msgByte;
      msgPos++;
    } else {
      // reached end of line
      msgArray[msgPos] = 0;
      parseMessage();
      
      // here the message is processed
      receiveData();
      //sendData();
    
      // reset byte array
      for (int c = 0; c < msgSize; c++) 
        msgArray[c] = ' ';

      msgPos = 0;
      digitalWrite(LED_PIN, LOW);
    }
  }
}

void parseMessage() {
  msgType = msgArray[0];
  
  // reset byte array
  for (int c = 0; c < 4; c++) 
    msgValueArray[c] = ' ';

  int i = 0;
  while(msgArray[i+1] != 0) {
    msgValueArray[i] = msgArray[i+1];
    i++;
  }
  msgValueArray[i] = 0;
  
  msgValue = atoi(msgValueArray);
}