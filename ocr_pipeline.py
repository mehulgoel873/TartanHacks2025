from transformers import GPT2LMHeadModel, GPT2Tokenizer
from PIL import Image
import pytesseract

def describe_screenshot_with_gpt(image_path: str, prompt: str):
    """
    Given a screenshot and a specific prompt, generate a description of what is happening in the screenshot using GPT.

    Args:
        image_path (str): Path to the screenshot image file.
        prompt (str): Specific prompt to guide the description generation.

    Returns:
        str: A textual description of the image content.
    """
    # Step 1: Load GPT-2 model and tokenizer
    gpt_model = GPT2LMHeadModel.from_pretrained("gpt2")
    tokenizer = GPT2Tokenizer.from_pretrained("gpt2")

    # Set pad token to avoid warnings
    tokenizer.pad_token = tokenizer.eos_token
    gpt_model.config.pad_token_id = tokenizer.eos_token_id

    # Step 2: Open the image using PIL
    image = Image.open(image_path).convert("RGB")

    # Step 3: Extract text from the image using OCR (Tesseract)
    extracted_text = pytesseract.image_to_string(image)

    # Step 4: Combine the prompt with the extracted text
    combined_prompt = f"{prompt}\nExtracted text from the image: {extracted_text}\nDescription:"

    # Step 5: Tokenize the combined prompt
    inputs = tokenizer(combined_prompt, return_tensors="pt", padding=True)

    # Step 6: Generate description using GPT-2
    description_ids = gpt_model.generate(
        input_ids=inputs["input_ids"],
        attention_mask=inputs["attention_mask"],
        max_length=200,
        num_return_sequences=1,
        pad_token_id = tokenizer.eos_token_id,
        do_sample=True,
        temperature=0.7,
    )

    # Step 7: Decode the generated description
    description = tokenizer.decode(description_ids[0], skip_special_tokens=True)

    return description

# Example usage
if __name__ == "__main__":
    screenshot_path = "images/image-2.png"  # Replace with your screenshot file path
    user_prompt = "This is a screenshot. Describe what is happening on this window. Specify what app/website is being used, as well as what the user is doing."

    try:
        result = describe_screenshot_with_gpt(screenshot_path, user_prompt)
        print("Generated Description:", result)
    except Exception as e:
        print(f"An error occurred: {e}")
