import sys
import json
import struct
import platform
import subprocess
# from playsound import playsound
from tkinter import Tk, Label, Button

# Read incoming messages from Chrome extension
def read_message():
    raw_length = sys.stdin.buffer.read(4)
    if len(raw_length) == 0:
        sys.exit(0)
    message_length = struct.unpack('I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    return json.loads(message)

# Send a message back to Chrome extension (optional)
def send_message(response):
    message = json.dumps(response)
    sys.stdout.buffer.write(struct.pack('I', len(message)))
    sys.stdout.buffer.write(message.encode('utf-8'))
    sys.stdout.buffer.flush()

# Display a blocking popup
def show_popup(message):
    root = Tk()
    root.title("Alert")
    root.attributes('-topmost', True)
    root.geometry("400x200")

    Label(root, text=message, font=("Arial", 16)).pack(pady=20)
    Button(root, text="Close", command=root.destroy).pack(pady=10)

    root.mainloop()

# # Play a system sound
# def play_sound():
#     if platform.system() == "Windows":
#         playsound("C:\\Windows\\Media\\Alarm01.wav")  # Example sound path
#     else:
#         subprocess.run(["afplay", "/System/Library/Sounds/Glass.aiff"])

# Main event loop
if __name__ == "__main__":
    while True:
        try:
            message = read_message()
            status = message.get("status", "")

            if status == 0:
                show_popup("DEFCON 0")
            elif status == 1:
                show_popup("DEFCON 1")

            elif status == 2:
                show_popup("DEFCON 2")

            elif status == 3:
                show_popup("DEFCON 3")

            elif status == 4:
                show_popup("DEFCON 4")

            send_message({"response": "Alert triggered."})

        except Exception as e:
            send_message({"error": str(e)})
