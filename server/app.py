from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Store the latest status (this will be sent via GET)
current_status = {"status": "Waiting for screenshot"}

@app.route('/')
def index():
    return render_template('basic-view.html')

@app.route('/upload', methods=['POST'])
def upload_screenshot():
    global current_status
    if 'screenshot' in request.files:
        file = request.files['screenshot']
        file.save("screenshot.png")  # Save the screenshot
        current_status = {"status": "Screenshot received"}
        return jsonify({"message": "Screenshot uploaded successfully"}), 200
    else:
        return jsonify({"error": "No screenshot uploaded"}), 400

@app.route('/status', methods=['GET'])
def get_status():
    return jsonify(current_status)  # Send back the latest status

if __name__ == '__main__':
    app.run(debug=True)
