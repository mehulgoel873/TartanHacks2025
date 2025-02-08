from pathlib import Path
from typing import Literal

from pydantic import BaseModel

from ollama import chat


# Define the schema for image objects
class Object(BaseModel):
  name: str
  confidence: float
  attributes: str


class ImageDescription(BaseModel):
  summary: str
  website: str 
  objects: list[Object]
  #   scene: str
  # #   colors: list[str]
  #   time_of_day: Literal['Morning', 'Afternoon', 'Evening', 'Night']
  #   setting: Literal['Indoor', 'Outdoor', 'Unknown']
  text_content: str | None = None


# Get path from user input
path = [Path("./images/bad/imag3.png"), Path("./images/bad/image-2.png"), Path("./images/bad/image.png"), Path("./images/bad/image4.png")]

# Verify the file exists
for p in path:
    if not p.exists():
        raise FileNotFoundError(f'Image not found at: {p}')

# Set up chat as usual
for p in path:

    response = chat(
    model='llama3.2-vision',
    format=ImageDescription.model_json_schema(),  # Pass in the schema for the response
    messages=[
        {
        'role': 'user',
        'content': 'Analyze this image and return a detailed JSON description including website or app used, objects, and any text detected. If you cannot determine certain details, leave those fields empty.',
        'images': [p],
        },
    ],
    options={'temperature': 0},  # Set temperature to 0 for more deterministic output
    )

    # Convert received content to the schema
    image_analysis = ImageDescription.model_validate_json(response.message.content)
    print(image_analysis)