# Per Diem App

## Environment Setup

This project uses environment variables for sensitive information. Before running the app, you need to set up your environment:

1. Create a `.env` file in the root directory
2. Add the following variables to your `.env` file:

```
# Google Sign-In
GOOGLE_WEB_CLIENT_ID=your_google_web_client_id

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

**Note:** Never commit your `.env` file to version control. It's already added to `.gitignore`.

### Firebase Admin SDK

If you need to use the Firebase Admin SDK:

1. Download your service account key from the Firebase Console
2. Save it as `firebase-adminsdk.json` in the project root
3. This file is already added to `.gitignore` to prevent accidental commits

   The Application is created for android only for now because I have windows system and please check it on android.

   create a google-services.json file and past the code i have sended to you.

## Installation

```bash
npm install
```

## Running the App

```bash
npm start
```
and then press s to expo go and run the application.

## My Approch
I have created the bottom sheet from the scratch to avoid dependency fail in build I have faced and for state persistence I have used React Context so the application be light and fast.
rest of the things were easy and straight forward.

## Demo Video
<a id='https://www.loom.com/share/cd02202206284267bf4a7158074898d1?sid=7dd1788a-df85-481e-ac48-204a8063f95d'></a>

you can also use npm run android command

```bash
npm run android
```


Then follow the instructions to run on your preferred platform. 
