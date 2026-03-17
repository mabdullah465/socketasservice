Prerequisites
Before running this project, make sure you have the following installed:

Node.js
npm
Installation
Clone this repository.
Install the dependencies by running npm install.
Create a .env file in the root directory and add the following variables:
JWT_SECRET=<your_jwt_secret>
Replace <your_jwt_secret> with your own secret key.
Start the server by running node index.js.
Usage
Creating a Project
To create a new project, send a POST request to /api/projects with the following JSON body:

json
{
  "name": "<project_name>",
  "base_url": "<base_url>",
  "authendpoint": "<auth_endpoint>"
}
Replace <project_name>, <base_url>, and <auth_endpoint> with the appropriate values.

Signing Up
To sign up a new user, send a POST request to /api/signup with the following JSON body:

json
{
  "email": "<user_email>",
  "password": "<user_password>"
}
Replace <user_email> and <user_password> with the appropriate values.

Logging In
To log in a user, send a POST request to /api/login with the following JSON body:

json
{
  "email": "<user_email>",
  "password": "<user_password>"
}
Replace <user_email> and <user_password> with the appropriate values.

Sending Notifications
To send a notification to a user, send a POST request to /api/event/notification with the following JSON body:

json
{
  "user_id": <user_id>,
  "type": "<notification_type>",
  "data": "<notification_data>"
}
Replace <user_id> with the ID of the user to whom the notification should be sent, <notification_type> with the type of the notification (e.g., "info", "error"), and <notification_data> with the content of the notification.

Documentation
Socket Handshake
To establish a socket connection, the client needs to send the following headers in the handshake request:

apikey: The API key of the project.
token: The authentication token of the user.
These headers are required for the server to authenticate the client and authorize access to the socket events.

Notification Endpoint
The /api/event/notification endpoint is used to send notifications to specific users. The request body should contain the following properties:

user_id: The ID of the user to whom the notification should be sent.
type: The type of the notification (e.g., "info", "error").
data: The content of the notification.
The server will then check if the user is online and send the notification to their socket connection if they are online. If the user is offline, the server will log a message and return a response indicating that the notification was dropped.

I hope this helps! Let me know if you have any further questions.