from openai import OpenAI
from pydantic import BaseModel
from preparing_data import *

client = OpenAI()

def process_image(image_path):
    # Example image processing function: open and print the image size
    print(f"Processing {image_path}")
    



def process_images_in_folder(folder_path, max_images=10):
    supported_extensions = (".jpg", ".jpeg", ".png", ".bmp", ".gif")  # Add other image formats if needed
    image_count = 0

    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)

        # Check if it's an image
        if os.path.isfile(file_path) and filename.lower().endswith(supported_extensions):
            process_image(file_path)
            image_count += 1
            
            # Stop after processing the first max_images images
            if image_count >= max_images:
                break


class ResponseEvent(BaseModel):
    isWorkingOnGoal: bool
    confidence: float

def make_decision(user_act, user_goal):
    '''
        INPUT:
        user_act := a list of string containing information about the user's activity in the format: [website/app,summary of user activity,text in the image]
        user_goal:= a list containing two strings:[desired behaviour, activities to avoid]

        OUTPUT:
        tuple containing the following data: (isWorkingonGoal: bool, confidence: float)
    '''
    
    working_on_goal = user_goal[0]
    not_working_on_goal = user_goal[1]
    webapp = user_act[0]
    activity_summary = user_act[1]
    text_in_image = user_act[2]

    response = client.chat.completions.create(
        model="gpt-4o-2024-08-06", 
        messages=[
            {
                "role": "developer", 
                "content": f"You extract information about whether the user is working on their goals or not into JSON data. User goals consist of {working_on_goal} and user wants to definitely avoid {not_working_on_goal}. Anything else is considered straying from the goal."
            },
            {
                "role": "user", 
                "content": f"I am currently on the website/app {webapp}. Here is a summary: {activity_summary}. The text on my screen is: {text_in_image}."
            }
        ],
        response_format={
           'type': 'json_schema',
           'json_schema': 
              {
                "name":"team-cool", 
                "schema": ResponseEvent.model_json_schema()
              }
         }
        
    )

    return(response.choices[0].message.content)




'''TESTING'''
if __name__ == "__main__":
    import os
    from PIL import Image

    # Replace with your folder path
    folder_path = "./combined"
    process_images_in_folder(folder_path)