from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from preparing_data import *
from sending_data import *

app = Flask(__name__)
CORS(app)

# Store the latest status (this will be sent via GET)

class Data:
    current_status = 0
user_data = ["Productivity", "Social Media"]

@app.route('/upload', methods=['POST'])
def upload_screenshot():
    # Check if a file is in the request
    if 'screenshot' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['screenshot']

    # Ensure the file has a name
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the file
    file.save("screenshot-python.png")
    print("saved screenshot!")
    # Update status

    print("computing pt1")
    img_txt = get_image_info("screenshot-python.png")
    print(img_txt)
    print("done computing pt1")

    print("computing pt2")
    Data.current_status = make_decision(img_txt, user_data)
    print("satus: ", Data.current_status, id(Data.current_status))
    print("done computing pt2")



    return jsonify({"message": "Screenshot uploaded successfully"}), 200

@app.route('/user_data', methods=['POST'])
def get_user_data():
    focus_data = request.form.get("focus")
    distract_data = request.form.get("distract")
    user_data = [focus_data, distract_data]
    print(user_data)

    return jsonify({"message": "Recieved User Data"}), 200

@app.route('/status', methods=['GET'])
def get_status():
    print("GIVING: ", Data.current_status, id(Data.current_status))
    return jsonify(Data.current_status)  # Send back the latest status

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5050)
