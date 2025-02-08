from openai import OpenAI
from pydantic import BaseModel
from preparing_data import *
from enum import Enum

import json
client = OpenAI()

#global variable: ONLY FOR TESTING
gL = ["tracking menstrual cycle","period tracking on calendar", 
                 "fitness app", "playing sports",
                 "gaming", "first person shooting video",
                 "banking information", "loginning into finance portal",
                 "learning new languages, studying new words",
                 "birthdays reminders",
                 "google maps", "apple maps", "location tracker"]

user_goals = {0: [gL[0], gL[4] + gL[5]],
              20: [gL[2] + gL[3], gL[4] + gL[5]],
              10: [gL[4] + gL[5], gL[3] + gL[4]],
              30: [gL[6], gL[7] + gL[2] + gL[4]]}

# defining the enums we want to send at the end
class Confidence(Enum):
    ON_GOAL = 0
    LOW = 1
    MEDIUM = 2
    HIGH = 3

class ResponseEvent(BaseModel):
    isWorkingOnGoal: bool
    confidenceWorkingOnGoal: Confidence

def process_image(image_path, img_index):
    # Example image processing function: open and print the image size
    print(f"Processing {image_path}")
    website, summary, image_text = get_image_info(image_path)
    print(f"website: {website}")
    print(f"summary: {summary}")
    print(f"text   : {image_text}")
    return make_decision([website, summary, image_text], user_goals[img_index])

def process_images_in_folder(folder_path, indexList):
    supported_extensions = (".jpg", ".jpeg", ".png", ".bmp", ".gif")  # Add other image formats if needed
    image_count = 0
    cList = []

    for curr_i in indexList:
        filename = f"{curr_i}.jpg"
        file_path = os.path.join(folder_path, filename)

        # Check if it's an image
        if os.path.isfile(file_path) and filename.lower().endswith(supported_extensions):
            c = process_image(file_path, curr_i)
            image_count += 1
            cList.append(c)
    
    return cList

def make_decision(user_act, user_goal):
    '''
        INPUT:
        user_act := a list of string containing information about the user's activity in the format: [website/app,summary of user activity,text in the image]
        user_goal:= a list containing two strings:[desired behaviour, activities to avoid]

        OUTPUT:
        A number denoting whether the user was working on their goal along with a confidence interval.
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
                "role": "developer", 
                "content": f"If the user is working towards their goal, set Confidence Enum value to 0. If the user is not working towards their goal, set the ENUM value to either 1,2 or 3 based in intensity of distraction from the goal."
            },
            {
                "role": "user", 
                "content": f"I am currently on the website/app {webapp}. Here is a summary: {activity_summary}. The text on my screen is: {text_in_image}."
            },
            
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
    
    data = json.loads(response.choices[0].message.content)
    isWorkingonGoal = data["isWorkingOnGoal"]
    confidence = float(data["confidenceWorkingOnGoal"])

    # if (isWorkingonGoal):
    #     res = 0
    # else:
    #     if (confidence >= 0.75):
    #         res = 1
    #     elif (confidence < 0.75 and confidence >= 50.0):
    #         res = 2
    #     elif (confidence < 0.5 and confidence >=0.25):
    #         res = 3
    #     else:
    #         res = 4
    return confidence


'''TESTING'''
if __name__ == "__main__":
    import os
    from PIL import Image

    # Replace with your folder path
    folder_path = "../pipeline/combined"
    indexList = [0, 10, 20, 30]
    confidenceList, resList = process_images_in_folder(folder_path, indexList)
    
    # print results
    for i in range(len(confidenceList)):
        curr_c = confidenceList[i]
        print(f"confidence: {curr_c}")
    
