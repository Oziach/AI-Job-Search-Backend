# AI-Job-Search-Backend

Deploy link : http://16.171.226.11/
May take a few seconds to fetch jobs

default-
username: username
password: password

Architecture:
-Fetched jobs using apis and stored in MongoDB database
-Models for User and Job
-API Endpoints to upload resume: extracts the text using pdf-js
-Uses DeepSeek to identify explicit and implicit skills with high accuracy (I couldn't train a NER model as I wanted to, in interest of time)
-Reteurns matched skills against jobs and calculates match score = matched skills / total job skills
-On frontend, user can upload their resume as a pdf or docx and click "Find Jobs"
-Uploaded resumes stored in AWS S3 Bucket

-Mandatory registration/login 
-uses jwt for authentication 
-token signed and sent through headers

-Deployment
Frontend and backend deployed on AWS EC2 instance
