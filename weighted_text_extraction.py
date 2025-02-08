from PIL import Image
import pytesseract
import cv2
import re
import numpy as np

def extract_real_words(words):
    return [word for word in words if len(word) > 1 and re.search(r'[a-zA-Z]', word)]

def extract_all_text(image_path: str):
    """
    Given a screenshot and a specific prompt, generate a description of what is happening in the screenshot using GPT.

    Args:
        image_path (str): Path to the screenshot image file.
        prompt (str): Specific prompt to guide the description generation.

    Returns:
        str: A textual description of the image content.
    """

    # Step 2: Open the image using PIL
    image = Image.open(image_path).convert("RGB")

    # Step 3: Extract text from the image using OCR (Tesseract)
    extracted_text = pytesseract.image_to_string(image)
    string_list = extracted_text.splitlines()
    string_list = [line.strip() for line in string_list if line.strip()]
    return extract_real_words(string_list)

def extract_largest_text(image_path):
    # Load the image
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Convert to grayscale for better OCR accuracy

    # Run OCR with bounding box output
    custom_config = r'--oem 3 --psm 6'  # OCR Engine Mode 3, PSM 6 (Assumes uniform text block)
    data = pytesseract.image_to_data(gray, config=custom_config, output_type=pytesseract.Output.DICT)

    # Get the median text height (helps define "large" and "small" text)
    all_heights = [data["height"][i] for i in range(len(data["text"])) if int(data["conf"][i]) > 50]
    median_height = np.median(all_heights) if all_heights else 0

    # Define size thresholds
    large_text_threshold = median_height * 1.2  # Text 1.5x larger than median

    # Filter text based on size
    large_text = []
    for i in range(len(data["text"])):
        if int(data["conf"][i]) > 50:  # Ignore low-confidence text
            text = data["text"][i].strip()
            height = data["height"][i]

            if height >= large_text_threshold:
                large_text.append(text)

    # Print results
    return extract_real_words(large_text)


def extract_center_text(image_path):
    image = cv2.imread(image_path)

    # Convert to grayscale for better OCR accuracy
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply OCR with bounding boxes
    custom_config = r'--oem 3 --psm 6'  # OCR Engine Mode 3, Automatic Page Segmentation Mode 6
    data = pytesseract.image_to_data(gray, config=custom_config, output_type=pytesseract.Output.DICT)

    # Get image dimensions
    h, w, _ = image.shape

    center_x_min, center_x_max = w * 0.15, w * 0.85
    center_y_min, center_y_max = h * 0.15, h * 0.85

    # Filter text that appears in the center of the screen
    relevant_text = []
    for i in range(len(data["text"])):
        if int(data["conf"][i]) > 50:  # Confidence threshold (adjustable)
            x, y, width, height = data["left"][i], data["top"][i], data["width"][i], data["height"][i]
            text = data["text"][i].strip()

            # Check if text box is within the center region
            if center_x_min < x < center_x_max and center_y_min < y < center_y_max:
                relevant_text.append(text)

    # Print relevant text
    return extract_real_words(relevant_text)



# Example usage
if __name__ == "__main__":
    screenshot_path = "images/cat.png"  # Replace with your screenshot file path
    try:
        result_all = extract_all_text(screenshot_path)
        print("All Text:", result_all)
        print()
        result_size = extract_largest_text(screenshot_path)
        print("Largest Text:", result_size)
        print()
        result_loc = extract_center_text(screenshot_path)
        print("Centered Text:", result_loc)
    except Exception as e:
        print(f"An error occurred: {e}")
