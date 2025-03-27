# Project Name

## Description
This project consists of a full-stack application with the following structure:
- **Frontend**: Vue.js (Runs using `npm run dev`)
- **Backend**: Node.js with Express.js (Runs using `npm run dev`)
- **API**: FastAPI (Runs using `uvicorn`)

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Python 3.7+](https://www.python.org/downloads/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Uvicorn](https://www.uvicorn.org/)

## Project Setup

### 1. Frontend (Vue.js)
- Navigate to the `frontend` directory:
    ```bash
    cd ui
    ```
- Install the required dependencies:
    ```bash
    npm install
    ```
- Run the Vue.js development server:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.

### 2. Backend (Node.js with Express)

- Install the required dependencies:
    ```bash
    npm install
    ```
- Run the Node.js server:
    ```bash
    npm run dev
    ```
    The backend will be available at `http://localhost:3000`.

### 3. API (FastAPI)
- Navigate to the `api` directory:
    ```bash
    cd api
    ```
- Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```
- Run the FastAPI server using Uvicorn:
    ```bash
    uvicorn app:app --host 0.0.0.0 --port 5000 --reload
    ```
    The API will be available at `http://localhost:5000`.

## Project Structure

