Here's the updated README.md file including the steps to run the application:

# MERN Coding Challenge

This project is a full-stack MERN (MongoDB, Express, React, Node.js) application. It fetches data from an external source, initializes the database, and provides APIs for various operations. The frontend displays data in tables and charts.

## Project Structure

mern-coding-challenge/
│
├── backend/ # Backend code
│ ├── models/ # Mongoose models
│ │ └── Transaction.js
│ └── index.js # Express server setup
│
├── frontend/ # Frontend code
│ ├── src/
│ │ ├── components/ # React components
│ │ │ ├── BarChart.js
│ │ │ ├── PieChart.js
│ │ │ ├── Statistics.js
│ │ │ └── TransactionsTable.js
│ │ └── App.js
│ └── ... # Other CRA files
│
├── README.md # Project instructions
└── package.json # Scripts to run the project




## Installation

### Prerequisites

- Node.js and npm installed
- MongoDB installed and running locally

### Setup

1. Clone the repository:

```bash
git clone <repository_url>
cd mern-coding-challenge

2. Install dependencies for both backend and frontend:

cd backend
npm install

cd ../frontend
npm install

cd ..
npm install concurrently


3. Create a .env file in the backend directory with the following content (if you need custom configuration):

DATABASE_URL=mongodb://localhost:27017/mern-coding-challenge


Running the Application
To start both the backend and frontend servers concurrently, run:

npm start

This command will run two scripts defined in package.json:

server: Starts the backend server.
client: Starts the React development server.
Accessing the Application
The backend server will run on http://localhost:3000.
The React frontend development server will run on http://localhost:3001.
Initializing the Database
To initialize the database with seed data, open your browser and navigate to:
http://localhost:3000/api/init
This will fetch data from the external source and populate your MongoDB database.

Available APIs
Initialize Database


GET /api/init
Fetches data from an external source and populates the MongoDB database.

List Transactions with Search and Pagination
http

GET /api/transactions
Query Parameters:

page: Page number (default: 1)
perPage: Number of transactions per page (default: 10)
search: Search term
month: Month filter in MM format
Statistics


GET /api/statistics
Query Parameters:

month: Month filter in MM format
Bar Chart Data
http

GET /api/bar-chart
Query Parameters:

month: Month filter in MM format
Pie Chart Data


GET /api/pie-chart
Query Parameters:

month: Month filter in MM format
Combined Data
http

GET /api/combined
Query Parameters:

month: Month filter in MM format
Frontend Components
TransactionsTable: Displays transactions with search and pagination.
Statistics: Shows statistics for the selected month.
BarChart: Displays a bar chart of item count in different price ranges.
PieChart: Displays a pie chart of item count by category.
Contributing
If you want to contribute to this project, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.

License
This project is licensed under the MIT License - see the LICENSE file for details.


This README provides clear instructions on how to set up, run, and understand the project, making it easier for others to get started with your MERN stack application. The styled-components enhance the interactivity and styling of the frontend.











