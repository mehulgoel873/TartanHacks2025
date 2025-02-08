from openai import OpenAI
from pydantic import BaseModel
import json
client = OpenAI()

class ResponseEvent(BaseModel):
    isWorkingOnGoal: bool
    confidence: float

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
    data = json.loads(response.choices[0].message.content)
    isWorkingonGoal = data["isWorkingOnGoal"]
    confidence = int(float(data["confidence"])*100)

    if (isWorkingonGoal):
        res = 0
    else:
        if (confidence >= 75):
            res = 1
        elif (confidence < 75 and confidence >= 50):
            res = 2
        elif (confidence < 50 and confidence >=25):
            res = 3
        else:
            res = 4
    return(res)