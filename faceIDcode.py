import os
import cv2
import face_recognition
from flask_cors import CORS
import numpy as np
from pubnub.pubnub import PubNub
from pubnub.pnconfiguration import PNConfiguration
from flask import Flask, Response, jsonify
 
app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes and methods
 
# Initialize the Haar Cascade
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

access_status = {"access_granted": False, "user": ""}
 
# Load all images from the operatorimages folder and create encodings
#image_folder = "operatorImages"
image_folder = os.path.join(os.path.dirname(__file__), "operatorImages")
known_face_encodings = []
known_face_names = []
for filename in os.listdir(image_folder):
    if filename.endswith(".jpg") or filename.endswith(".png"):
        image_path = os.path.join(image_folder, filename)
        image = face_recognition.load_image_file(image_path)
        image_encodings = face_recognition.face_encodings(image)
        if image_encodings:
            face_encoding = image_encodings[0]
            person_name = os.path.splitext(os.path.basename(filename))[0]
            known_face_encodings.append(face_encoding)
            known_face_names.append(person_name)
 
def generate_frames():
    global face_recognition_started
    cap = cv2.VideoCapture(0)
    try:
        while True:
            success, frame = cap.read()
            if not success:
                break
    
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.3, 5)
            # Perform face recognition if triggered
            if face_recognition_started:
                for (x, y, w, h) in faces:
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
                    face_frame = frame[y:y + h, x:x + w]
                    face_frame_rgb = cv2.cvtColor(face_frame, cv2.COLOR_BGR2RGB)
                    current_face_encoding = face_recognition.face_encodings(face_frame_rgb)
        
                    if current_face_encoding:
                        matches = face_recognition.compare_faces(known_face_encodings, current_face_encoding[0])
                        name = "Unknown"
        
                        face_distances = face_recognition.face_distance(known_face_encodings, current_face_encoding[0])
                        best_match_index = np.argmin(face_distances)
                        if matches[best_match_index]:
                            name = known_face_names[best_match_index]
                            print(f"Access Granted for {name}")
                            cv2.putText(frame, f"{name} - Access Granted", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2, cv2.LINE_AA)
                            
                            # Update the access status
                            access_status["access_granted"] = True
                            access_status["user"] = name
        
                            # Send message over PubNub
                            payload = {'userId': name, 'passCode': 'valid', 'requestFromAdmin': True}
                            # pubnub.publish().channel('face_recognition_channel').message(payload).pn_async(publish_callback)
                            print(payload)
                            #cap.release()
                            print("Camera released")
                        else:
                            name = "Unknown"
                            print("Access Not Granted")
                            cv2.putText(frame, "Unknown - Access Not Granted", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2, cv2.LINE_AA)
                            payload = {'userId': 'invalid', 'passCode': 'invalid', 'requestFromAdmin': True}
                            #pubnub.publish().channel('face_recognition_channel').message(payload).pn_async(publish_callback)
                            print(payload)
    
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    finally:
        #cap.release()
        print("Camera released")
 
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/trigger_face_recognition', methods=['POST'])
def trigger_face_recognition():
    global face_recognition_started
    face_recognition_started = True
    return "Face recognition started"

@app.route('/get_access_status')
def get_access_status():
    return jsonify(access_status)

@app.route('/stop_face_recognition', methods=['POST'])
def stop_face_recognition():
    global face_recognition_started
    face_recognition_started = False  # Use this flag to stop the frame generation loop
    access_status["access_granted"] = False  # Reset access status
    access_status["user"] = ""  # Clear the recognized user name
    return "Face recognition stopped"
 
if __name__ == '__main__':
    app.run(debug=True, threaded=True)

    # Initialize PubNub
# pnconfig = PNConfiguration()
# pnconfig.publish_key = 'pub-c-9eb20452-d655-4bf0-91b9-8eecde9199e3'
# pnconfig.subscribe_key = 'sub-c-878f6650-7fba-4b01-bd5c-061c161b0e9a'
# pnconfig.ssl = True
# pnconfig.uuid = 'unique_identifier_for_this_client'
# pubnub = PubNub(pnconfig)
 
# Callback function for publish response
# def publish_callback(result, status):
#     if not status.is_error():
#         print(f"Message published successfully: {result}")
#     else:
#         print(f"Failed to publish message: {status}")