# Lighthouse
Productivity apps and extensions are plentiful in this day and age, but they all share some common drawbacks: they only work in the browser, they require lengthy setup and customization, or they can't understand multi-tasking. Enter Lighthouse: a browser extension that can automatically detect and block procrastination no matter what you're doing, and can do so with minimal input. For a deeper explanation, take a look at our [slidedeck](https://docs.google.com/presentation/d/1pQ9IKdjD5gEtNML6fdhPhIV55WQjFpQR4xBptzKj2rc/edit?usp=sharing).

# Setup
## Browser Extension
To use this extension, simply install the Lighthouse browser extension from the Chrome extension page. To do this, enable developer extensions and select the `frontend-garbage` folder.
> [!TIP]
> Take a look at more details within Google's own [guide](https://support.google.com/chrome/a/answer/2714278?hl=en) and follow step 2.
To start tracking, simply click the icon at the top and let the light illuminate the way.

## Server Setup
To run our server locally, you will need a list of Python packages for 3.10, which are:
1. Flask and Flask-Cors
2. Pillow
3. Openai
4. Tesseract
5. OpenCV2
>[!WARNING]
>Tesseract is a larger installation than just a Python package, follow the guide found on the [Tesseract Website](https://tesseract-ocr.github.io/tessdoc/Installation.html)

# Tech Stack

## Step 1: Data Generation and Labelling
We web-scraped various websites and apps to take their screenshots and extract image captions for data generation and labeling based on the HTML text extracted. This data is mainly implemented for the testing and validation step. One of the key datasets we used was created by Google's Multimodal QA [Github Dataset](https://github.com/google-research-datasets/screen_qa/tree/main/answers_and_bboxes)

## Step 2: Chrome Extension Frontend
We created a frontend that can take singular images of the screen with the proper privacy protections ensured by Chrome and send it to the server with proper API Access. 

## Step 3: Feature Extraction
We first implemented a Multi-headed Model by integrating the Optical Character Recognition Model for text extraction and Ollama Vision and Open AI Model for image feature extraction. The OCR Model is trained on Pytesseract. In this model, we focus on text that is prominently displayed by following standard web design techniques and sort this into the predictor.

## Step 4: Prediction
In this step, we implemented an Open AI model that is prompt-engineered to figure out whether the user is wasting time or not based on their inputted goals. It returns a scale of values increasing in intensity from 0 to 4, based on which the front end produces different responses.


