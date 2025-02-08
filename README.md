# Lighthouse
Productivity apps and extensions are plentiful in this day and age, but they all share some common drawbacks: they only work in the browser, or they require lengthy setup and customization, or ___. Enter Lighthouse: a browser extension that can automatically detect and block procrastination no matter what you're doing, and can do so with minimal input.

# Setup
## Browser Extension
To use this extension for yourself, simply install the Lighthouse browser extension from the Chrome extension page.
You will also need an OpenAI API key to access the fastest version of our intelligent detection.
To start tracking, simply click the icon at the top and let the light illuminate the way.

## Server Setup
To run our serverlocally, you will need

# Tech Stack

## Step 1: Data Generation and Labelling
We webscraped various websites and apps to take their screenshots and extract image caption for data generation and labelling based on the html text extracted. This data is mainly implemented for testing and validation step.

## Step 2: Feature Extraction
We first implemented a Multi-headed Model by integrating Optical Character Recognition Model for text extraction and Ollama Vision and Open AI Model for image feature extraction. The OCR Model is trained on Pytesseract.

## Step 3: Prediction
In this step, we implemented an Open AI model that is prompt engineered to figure out whether the user is wasting time or not based on their inputted goals. It returns a scale of values increasing in intensity from 0 to 4, based on which the front-end produces different responses.


