# WanderLust

WanderLust is a comprehensive vacation rental platform that allows users to explore, book, and host unique accommodations around the world. Built with a robust tech stack, it features secure authentication, interactive maps, and a seamless user experience.

## Project Link
[Live Demo](https://wanderlust-h8zw.onrender.com/listings)

## 🚀 Features

*   **User Authentication**: Secure signup and login functionality using Passport.js.
*   **CRUD Operations**: Users can create, read, update, and delete listings.
*   **Image Uploads**: Seamless image uploading and storage using Cloudinary.
*   **Interactive Maps**: Integration with Mapbox to display listing locations on a map.
*   **Reviews & Ratings**: Users can leave reviews and ratings for listings.
*   **Responsive Design**: Optimized for various devices using Bootstrap (via EJS Mate).
*   **Session Management**: Persistent user sessions with MongoDB store.

## 🛠️ Tech Stack

*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (with Mongoose), MongoDB Atlas
*   **Templating**: EJS (Embedded JavaScript) with `ejs-mate`
*   **Authentication**: Passport.js
*   **Cloud Storage**: Cloudinary
*   **Maps**: Mapbox SDK
*   **Styling**: Bootstrap, Custom CSS

## 📋 Prerequisites

Before running the application, ensure you have the following installed/setup:

*   [Node.js](https://nodejs.org/) (v14 or higher recommended)
*   [MongoDB](https://www.mongodb.com/) (Local or Atlas)
*   [Cloudinary Account](https://cloudinary.com/) (for image storage)
*   [Mapbox Account](https://www.mapbox.com/) (for maps)

## ⚙️ Environment Variables

Create a `.env` file in the root directory of the project and add the following configuration:

```env
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_mapbox_public_token
ATLASDB_URL=your_mongodb_connection_string
SECRET_KEY=your_session_secret_key
```

> **Note**: The `ATLASDB_URL` can be your local MongoDB URI (e.g., `mongodb://127.0.0.1:27017/wanderlust`) for local development if you prefer.

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/OmkarD09/WanderLust.git
    cd WanderLust
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create the `.env` file as described in the "Environment Variables" section.

4.  **Seed the Database:**
    Initialize the database with sample listings.
    ```bash
    node init/index.js
    ```

5.  **Start the Application:**
    ```bash
    node app.js
    ```

6.  **Access the App:**
    Open your browser and visit `http://localhost:8080`.

## 🏗️ Project Structure
```
WanderLust/
├── controllers/        # Route controllers (MVC pattern)
│   ├── listing.js
│   ├── reviews.js
│   └── users.js
├── models/            # Mongoose schemas
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── routes/            # Express routes
│   ├── listing.js
│   ├── review.js
│   ├── user.js
│   └── middlewares.js
├── views/             # EJS templates
│   ├── layouts/
│   ├── listings/
│   ├── users/
│   └── includes/
├── public/            # Static assets
│   ├── css/
│   └── js/
├── utils/             # Utility functions
│   ├── ExpressError.js
│   └── wrapAsync.js
├── init/              # Database initialization
├── cloudConfig.js     # Cloudinary configuration
├── schema.js          # Joi validation schemas
└── app.js             # Main application file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.
