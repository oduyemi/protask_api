# ProTask API Documentation

## Introduction

Welcome to the ProTask API documentation. ProTask is a task management system designed to facilitate mentor-mentee relationships by allowing mentors to assign projects or tasks to individual mentees and follow up with them.

### Getting Started

#### Base URL

The base URL for all API endpoints is:

`https://protask-api.vercel.com`

### Authentication

Authentication is required to access the ProTask API. Authentication is implemented using JSON Web Tokens (JWT). You must include your JWT token in the headers of each request.

#### Authentication Endpoint

`POST /mentees/login`

`POST /mentors/login`

`Request:`

`{
  "email": "user@example.com",
  "password": "password"
}`

`Response:`

`{
  "token": "your_jwt_token_here"
}`

#### Errors

The API uses standard HTTP status codes to indicate the success or failure of a request.

##### 200 OK: The request was successful.

##### 400 Bad Request: The request was malformed or missing required parameters.

##### 401 Unauthorized: Authentication credentials were missing or invalid.

##### 404 Not Found: The requested resource was not found.

##### 500 Internal Server Error: An unexpected error occurred on the server.

#### Endpoints

##### Mentors

###### Get All Mentors

`GET /mentors`

Retrieve a list of all mentors.

###### Get Mentor by ID

`GET /mentors/:mentorId`

Retrieve a specific mentor by ID.

###### Create Mentor

`POST /mentors`

Create a new mentor.

###### Update Mentor

`PUT /mentors/:mentorId`

Update an existing mentor.

###### Delete Mentor

`DELETE /mentors/:mentorId`

Delete a mentor.

##### Mentees

###### Get All Mentees

`GET /mentees`

Retrieve a list of all mentees.

###### Get Mentee by ID

`GET /mentees/:menteeId`

Retrieve a specific mentee by ID.

###### Create Mentee

`POST /mentees`

Create a new mentee.

###### Update Mentee

`PUT /mentees/:menteeId`

Update an existing mentee.

###### Delete Mentee

`DELETE /mentees/:menteeId`

Delete a mentee.

###### Tasks

Get All Tasks

`GET /tasks`

Retrieve a list of all tasks.

###### Get Task by ID

`GET /tasks/:taskId`

Retrieve a specific task by ID.

###### Create Task

`POST /tasks`

Create a new task.

###### Update Task

`PUT /tasks/:taskId`

Update an existing task.

Delete Task
bash
Copy code
DELETE /tasks/:id
