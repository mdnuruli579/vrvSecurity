#Admin Page React Application
This project is a React-based Admin Panel designed to manage users, roles, and permissions. It includes functionality to define user roles and associated permissions, making it suitable for building access-controlled systems. A JSON Server is used to simulate APIs for development and testing.
#Features
User Management: Create, update, view, and delete users.<br/>
Role-Based Access Control: Assign roles to users with specific permissions.<br/>
Permission Management: Define and manage permissions (e.g., Read, Write, Delete).<br/>
Dynamic UI: Displays options and functionalities based on user roles.<br/>
Fake API Integration: Uses JSON Server for simulating REST API calls.<br/>
#Technologies Used
React: Frontend framework for building UI components.<br/>
React Router: For handling navigation.<br/>
React Bootstrap: For styling and responsive UI.<br/>
JSON Server: To simulate a REST API for managing users, roles, and permissions.<br/>
Sweetalert2: To showing beautiful alert box <br/>
#Install dependencies
npm (Node Package Manager)
npm install<br/>
npm install -g json-server<br/>
#Start the JSON Server
json-server --watch db.json --port 8080 <br/>
#Start react application
npm start <br/>
open your browser and run <br/>
http://localhost:3000
