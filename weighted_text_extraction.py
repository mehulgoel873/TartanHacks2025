from PIL import Image
import pytesseract
import cv2
import numpy as np

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
    return extracted_text

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
    large_text_threshold = median_height * 1.5  # Text 1.5x larger than median
    small_text_threshold = median_height * 0.6  # Text 0.6x smaller than median

    # Filter text based on size
    large_text = []
    small_text = []
    for i in range(len(data["text"])):
        if int(data["conf"][i]) > 50:  # Ignore low-confidence text
            text = data["text"][i].strip()
            height = data["height"][i]

            if height >= large_text_threshold:
                large_text.append(text)
            elif height <= small_text_threshold:
                small_text.append(text)

    # Print results
    print("LARGE TEXT (Headings, Titles):")
    print("\n".join(large_text))

    print("\nSMALL TEXT (Subtitles, Footnotes, Tooltips):")
    print("\n".join(small_text))


# def extract_center_text(image_path):


# Example usage
if __name__ == "__main__":
    screenshot_path = "TartanHacks2025/images/image-2.png"  # Replace with your screenshot file path
    try:
        result_all = extract_all_text(screenshot_path)
        print("Generated Description:", result_all)
    except Exception as e:
        print(f"An error occurred: {e}")
