from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Store the latest status (this will be sent via GET)
current_status = {"status": "Waiting for screenshot"}

@app.route('/')
def index():
    return render_template('basic-view.html')

current_status = {}

@app.route('/upload', methods=['POST'])
def upload_screenshot():
    global current_status

    # Check if a file is in the request
    if 'screenshot' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['screenshot']

    # Ensure the file has a name
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the file
    file.save("screenshot-python.png")
    
    # Update status
    current_status = {"status": "Screenshot received"}

    return jsonify({"message": "Screenshot uploaded successfully"}), 200

@app.route('/status', methods=['GET'])
def get_status():
    return jsonify(current_status)  # Send back the latest status

if __name__ == '__main__':
    app.run(debug=True)
