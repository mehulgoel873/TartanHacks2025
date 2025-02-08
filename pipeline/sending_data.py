from openai import OpenAI
from pydantic import BaseModel

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