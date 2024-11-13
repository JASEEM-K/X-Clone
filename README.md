# X Clone

X Clone is a social media web application inspired by [X](https://x.com). This project replicates key features of the original platform, enabling users to connect, share updates, and interact with others in a familiar social media interface.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#some-api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Sign up, log in, and log out securely.
- **Profile Management**: Customize your profile with bio, profile and cover picture, and basic information.
- **Followers and Following**: Connect with other users, view and manage followers and followings.
- **Feed**: View posts from users you follow, post you user liked and also view individual users posts form there own profile.
- **Post Creation**: Share updates and photos with others.
- **Like and Comment**: Engage with posts by liking or commenting on them.
- **Notifications**: Get notified about interactions with your content.

## Tech Stack

- **Frontend**: React, HTML, TailwindCSS ,DaisyUI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Other Tools**: Git, cloudinary

## Getting Started

To get a local copy of this project up and running, follow these steps.

### Prerequisites

- **Node.js**: Make sure you have [Node.js](https://nodejs.org/) installed.
- **MongoDB**: You’ll need access to a MongoDB instance, either locally or via a cloud service like MongoDB Atlas.

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/JASEEM-K/X-Clone.git
    cd x-clone
    ```

2. **Install dependencies** for both frontend and backend:
    ```bash
    # Backend dependencies
    npm install

    # Frontend dependencies
    cd /frontend
    npm install
    ```

3. **Set up environment variables**:
   Create a `.env` file in the `x-clone` directory with the following:
   ```plaintext
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   CLOUDINARY_NAME=your_cloudinary_cloud_name

The app should now be running locally. Open your browser and go to http://localhost:5000.

## Usage

   - Sign Up: Register a new account to start using the app.
   - Log In: Access your account with your credentials.
   - Follow Users: Search for and follow other users to populate your feed.
   - Create Posts: Share text or media content to your followers.
   - Engage: Like and comment on posts to interact with others.

## Some API Endpoints

   - User Authentication:
       - POST /api/auth/register: Register a new user
       - POST /api/auth/login: Log in to the app
   - User Profile:
       - GET /api/users/:id: Get user profile by ID
       - PUT /api/users/:id: Update user profile
   - Post Management:
       - POST /api/posts: Create a new post
       - GET /api/posts/:id: Get a post by ID
       - PUT /api/posts/:id/like: Like a post.
       - POST /api/posts/:id/comment: Comment on a post
