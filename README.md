
# Rojgaar Kendra - Job Portal

## Overview

This repository contains a **Rojgaar Kendra - Job Portal** project that provides a platform for job seekers and employers to connect. The project is divided into two main sections: **frontend** and **backend**, both built using modern web development technologies.

### Features

- User authentication (login/register)
- Role-based functionality (job seekers and employers)
- Job posting and application management
- Responsive design for seamless user experience
- Deployed at: [rojgar-kendra.vercel.app](rojgar-kendra.vercel.app)

---

## Project Structure

### Folder Structure

- **frontend**: Contains the React.js code for the user interface.
- **backend**: Contains the Node.js/Express server code and MongoDB database integration.

---

## Prerequisites

To run this project locally, ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn (for package management)

---

## Installation and Setup

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/hsuyaa0413/rojgaar-kendra.git
cd rojgaar-kendra
```

### 2. Backend Setup

Navigate to the `backend` folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend` directory and add the following environment variables:

```env
MONGO_URI=
JWT_SECRET=
PORT=5000
```

Start the backend server:

```bash
npm start
```

The backend server will run on `http://localhost:5000`.

---

### 3. Frontend Setup

Navigate to the `frontend` folder:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`.

---

## Usage Instructions

### Running Locally

1. Ensure both backend (`http://localhost:5000`) and frontend (`http://localhost:3000`) servers are running.
2. Open your browser and navigate to `http://localhost:3000`.
3. Register as a new user or log in with existing credentials.
4. Explore job postings, apply for jobs, or post new job opportunities.

---

## Deployment

The project is already deployed at [rojgar-kendra.vercel.app](rojgar-kendra.vercel.app). For redeployment:

1. Use platforms like Vercel for frontend deployment.
2. Use platforms like Heroku or Render for backend deployment.
3. Ensure environment variables are correctly configured on deployment platforms.

---

## Technologies Used

| Technology | Purpose            |
| ---------- | ------------------ |
| React.js   | Frontend framework |
| Node.js    | Backend runtime    |
| Express.js | Backend framework  |
| MongoDB    | Database           |
| JWT        | Authentication     |
| CSS        | Styling            |

---

## Contributing

Feel free to fork this repository and submit pull requests for improvements or additional features.

---

## License

This project is open-source under no specific license mentioned in the repository.

For any issues or questions, contact the repository owner via GitHub.

Citations:
[1] https://github.com/hsuyaa0413/rojgaar-kendra

---

<h1 align="center">Built with ❤️ by Aayush Dhungel.</h1>
