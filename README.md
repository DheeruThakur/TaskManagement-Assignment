# TaskManagement

## Overview

### Project Description
The Task Management API is a backend service designed to manage user tasks and their associated subtasks. Built with Express.js and MongoDB, this API provides endpoints for creating, reading, updating, and deleting tasks and subtasks, while ensuring that tasks marked for deletion are excluded from responses. This makes it suitable for applications requiring robust task management features, such as project management tools, to-do list applications, or any productivity software.

### Features

* **User Task Management:** Allows users to manage their tasks with attributes like subject, deadline, and status.
* **Subtask Management:** Supports tasks with nested subtasks, each having its own attributes.
* **Soft Deletion:** Tasks and subtasks can be marked as deleted without being removed from the database, enabling recovery if needed.
* **Filtering:** Automatically excludes deleted tasks and subtasks from listing endpoints to keep responses clean and relevant.
* **CRUD Operations:** Full support for Create, Read, Update, and Delete operations on tasks and subtasks.
  
### Technologies Used

* **Express.js:** A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
* **MongoDB:** A NoSQL database for storing user information, tasks, and subtasks in a flexible, JSON-like format.
* **Mongoose:** An Object Data Modeling (ODM) library for MongoDB and Node.js, providing a straightforward, schema-based solution to model application data.

### Installation

1. Clone the repository: git clone https://github.com/DheeruThakur/TaskManagement-Assignment.git
2. Navigate to the project directory
3. Install dependencies for server: npm install
4. Set up environment variables in .env file in src directory (MONGODB_URI, PORT)
5. RUN npm start in root folder to start the server
6. Access the app in your browser: ```http://localhost:PORT```

## Project Structure
- `/models`: Mongoose schemas for User, Task, and Subtask. Task and Subtask schemas are embedded schemas.
- `/routes`: API route definitions.
- `/controllers`: Request handling logic.
- `/db`: handle DataBase connection and the aggregation query file
- `/utils`: handle custom API response logic
- `app.js`: creates express app.
- `index.js`: Main entry point.
- `constants.js`: stores database name

## Schema Documentation Link 
[https://docs.google.com/document/d/1JDEeG_gn5kpSImywhgP8GJgU1MlzYtbXZw2Si-lZtPc/edit?usp=sharing]
  
### API Endpoints

* **BaseUrl Example :** ```http://localhost:8090/api/v1```
  
*  **NOTE :** Email (it is unique) is passed everytime in the request's body because when we run queries in the database it helps in identification of user.
  
``` 1. POST /add-user ```

* This endpoint creates new user in the database (with empty array of tasks)

| Parameter | Type   | Description         | Passing place of parameter  |
|-----------|--------|---------------------|-----------------------------|
| email     | string | Required , Unique   |  In request's body          |
| name      | string | Required            |  In request's body          |

### Example of URL

```
http://localhost:8090/api/v1/add-user
```

### Example of Request's body

```
{
    "name": "Dheeru Thakur",
    "email": "sdheerendra382@gmail.com"
}
```

#### Success Response

```json
{
    "statusCode": 201,
    "data": {
        "name": "Dheeru Thakur",
        "email": "sdheerendra382@gmail.com",
        "tasks": [],
        "_id": "664ce603900f556189797508",
        "__v": 0
    },
    "message": "User registered Successfully",
    "success": true,
}
```

---

``` 2. POST /tasks ```

* This endpoint creates new task(with empty array of subtasks) and push it inside the task's array of the user

| Parameter | Type   | Description   | Passing place of parameter  |
|-----------|--------|---------------|-----------------------------|
| subject   | string | Required      |  In request's body          |
| deadline  | Date   | Required      |  In request's body          |
| status    | string | Required      |  In request's body          |
| email     | string | Required      |  In request's body          |


### Example of URL

```
http://localhost:8090/api/v1/tasks
```

### Example of Request's body

```
{
    "subject": "DSA",
    "deadline": "2024-05-21",
    "status" : "pending",
    "email": "sdheerendra382@gmail.com"
}
```


#### Success Response
```json
{
    "statusCode": 201,
    "data": {
        "subject": "DSA",
        "deadline": "2024-05-21T00:00:00.000Z",
        "status": "pending",
        "isDeleted": false,
        "_id": "664cee33d17d4a046098a87e",
        "subtasks": []
    },
    "message": "Task created successfully",
    "success": true
}
```
---

``` 3. POST /tasks/:taskId/subtask```

* This endpoint creates new subtask and push it inside the subtask's array of the task

* you have to pass actual taskId given by mongoDB in url in place of ":taskId"

| Parameter | Type   | Description   | Passing place of parameter  |
|-----------|--------|---------------|-----------------------------|
| subject   | string | Required      |  In request's body          |
| deadline  | Date   | Required      |  In request's body          |
| status    | string | Required      |  In request's body          |
| email     | string | Required      |  In request's body          |

### Example of URL

```
http://localhost:8090/api/v1/tasks/664cee33d17d4a046098a87e/subtask
```

### Example of Request's body

```
{
    "subject": "DP",
    "deadline": "2024/05/22",
    "status" : "pending",
    "email": "sdheerendra382@gmail.com"
}
```


#### Success Response
```json
{
    "statusCode": 201,
    "data": [
        {
            "subject": "DSA",
            "deadline": "2024-05-21T00:00:00.000Z",
            "status": "pending",
            "isDeleted": false,
            "_id": "664cee33d17d4a046098a87e",
            "subtasks": [
                {
                    "subject": "graph",
                    "deadline": "2024-05-21T18:30:00.000Z",
                    "status": "pending",
                    "isDeleted": false,
                    "_id": "664cee43d17d4a046098a880"
                },
                {
                    "subject": "DP",
                    "deadline": "2024-05-21T18:30:00.000Z",
                    "status": "pending",
                    "isDeleted": false,
                    "_id": "664cee48d17d4a046098a88d"
                }
            ]
        }
    ],
    "message": "SubTask added successfully",
    "success": true
}

```

---

``` 4. GET /tasks```

* This endpoint fetch all the tasks and nested subtasks whose isDeleted flag is false

| Parameter | Type   | Description   | Passing place of parameter  |
|-----------|--------|---------------|-----------------------------|
| email     | string | Required      |  In request's body          |

### Example of URL

```
http://localhost:8090/api/v1/tasks
```

### Example of Request's body

```
{
    "email": "sdheerendra382@gmail.com"
}
```


#### Success Response
```json
{
    "statusCode": 200,
    "data": [
        {
            "_id": "664ce603900f556189797508",
            "tasks": [
                {
                    "subject": "Databases",
                    "deadline": "2024-05-22T00:00:00.000Z",
                    "status": "completed",
                    "isDeleted": false,
                    "_id": "664ce621900f55618979750b",
                    "subtasks": [
                        {
                            "subject": "mongodb",
                            "deadline": "2024-05-30T00:00:00.000Z",
                            "status": "completed",
                            "isDeleted": false,
                            "_id": "664cede0d17d4a046098a86f"
                        },
                        {
                            "subject": "dynamodb",
                            "deadline": "2024-05-30T00:00:00.000Z",
                            "status": "completed",
                            "isDeleted": false,
                            "_id": "664cede0d17d4a046098a870"
                        },
                        {
                            "subject": "mysql",
                            "deadline": "2024-05-30T00:00:00.000Z",
                            "status": "completed",
                            "isDeleted": false,
                            "_id": "664cede0d17d4a046098a871"
                        }
                    ]
                },
                {
                    "subject": "DSA",
                    "deadline": "2024-05-21T00:00:00.000Z",
                    "status": "pending",
                    "isDeleted": false,
                    "_id": "664cee33d17d4a046098a87e",
                    "subtasks": [
                        {
                            "subject": "graph",
                            "deadline": "2024-05-21T18:30:00.000Z",
                            "status": "pending",
                            "isDeleted": false,
                            "_id": "664cee43d17d4a046098a880"
                        },
                        {
                            "subject": "DP",
                            "deadline": "2024-05-21T18:30:00.000Z",
                            "status": "pending",
                            "isDeleted": false,
                            "_id": "664cee48d17d4a046098a88d"
                        }
                    ]
                }
            ]
        }
    ],
    "message": "Tasks fetched successfully",
    "success": true
}

```

---

``` 5. GET /tasks/:taskId/subtasks```
* This endpoint fetch all the subtasks of a particular task whose isDeleted flag is false

* you have to pass actual taskId(who's subtasks you want to fetch) given by mongoDB in url in place of ":taskId"

| Parameter | Type   | Description   | Passing place of parameter  |
|-----------|--------|---------------|-----------------------------|
| email     | string | Required      |  In request's body          |

### Example of URL

```
http://localhost:8090/api/v1/tasks/664ce621900f55618979750b/subtasks
```

### Example of Request's body

```
{
    "email": "sdheerendra382@gmail.com"
}
```


#### Success Response
```json
{
    "statusCode": 200,
    "data": [
        {
            "_id": "664ce621900f55618979750b",
            "subtasks": [
                {
                    "subject": "mysql",
                    "deadline": "2024-05-21T18:30:00.000Z",
                    "status": "pending",
                    "isDeleted": false,
                    "_id": "664ce723bcb9b95e9fcdf667"
                },
                {
                    "subject": "mongoDB",
                    "deadline": "2024-05-21T18:30:00.000Z",
                    "status": "pending",
                    "isDeleted": false,
                    "_id": "664ce74bdddc3c346eca5b03"
                },
                {
                    "subject": "postgres",
                    "deadline": "2024-05-21T18:30:00.000Z",
                    "status": "pending",
                    "isDeleted": false,
                    "_id": "664ce75ddddc3c346eca5b09"
                }
            ]
        }
    ],
    "message": "Tasks fetched successfully",
    "success": true
}

```

---

``` 6. PUT /tasks/:taskId```

* This endpoint update the task(who's id mentioned in url)  

* you have to pass actual taskId(which task you want to update) given by mongoDB in url in place of ":taskId"

| Parameter | Type   | Description   | Passing place of parameter  |
|-----------|--------|---------------|-----------------------------|
| subject   | string | Required      |  In request's body          |
| deadline  | Date   | Required      |  In request's body          |
| status    | string | Required      |  In request's body          |
| email     | string | Required      |  In request's body          |

### Example of URL

```
http://localhost:8090/api/v1/tasks/664ce621900f55618979750b
```

### Example of Request's body

```
{
    "subject": "Databases",
    "deadline": "2024-05-22",
    "status" : "completed",
    "email": "sdheerendra382@gmail.com"
}
```



#### Success Response
```json
{
    "statusCode": 200,
    "data": {
        "subject": "Databases",
        "deadline": "2024-05-22T00:00:00.000Z",
        "status": "completed",
        "isDeleted": false,
        "_id": "664ce621900f55618979750b",
        "subtasks": [
            {
                "subject": "mysql",
                "deadline": "2024-05-21T18:30:00.000Z",
                "status": "pending",
                "isDeleted": false,
                "_id": "664ce723bcb9b95e9fcdf667"
            },
            {
                "subject": "mongoDB",
                "deadline": "2024-05-21T18:30:00.000Z",
                "status": "pending",
                "isDeleted": false,
                "_id": "664ce74bdddc3c346eca5b03"
            }
        ]
    },
    "message": "Task updated successfully",
    "success": true
}

```

---

``` 7. PUT /tasks/:taskId/subtasks```

* This endpoint update the subtasks array with the provided one, but preserves all the subtasks whose isDeleted flag is true in the database.

* you have to pass actual taskId(who's subtasks you want to update) given by mongoDB in url in place of ":taskId"

| Parameter   | Type              | Description   | Passing place of parameter  |
|-------------|-------------------|---------------|-----------------------------|
| email       | string            | Required      |  In request's body          |
| subtaskList | Array of subtasks | Required      |  In request's body          |

### Example of URL

```
http://localhost:8090/api/v1/tasks/664ce621900f55618979750b/subtasks
```

### Example of Request's body

```
{
    "email": "sdheerendra382@gmail.com",
    "subtaskList" : [
        {
            "subject": "mongodb",
            "deadline": "2024-05-30",
            "status" : "completed"
        },
        {
            "subject": "dynamodb",
            "deadline": "2024-05-30",
            "status" : "completed"
        },
        {
            "subject": "mysql",
            "deadline": "2024-05-30",
            "status" : "completed"
        }
    ]

}
```



#### Success Response
```json
{
    "statusCode": 200,
    "data": [
        {
            "subject": "mongodb",
            "deadline": "2024-05-30",
            "status": "completed"
        },
        {
            "subject": "dynamodb",
            "deadline": "2024-05-30",
            "status": "completed"
        },
        {
            "subject": "mysql",
            "deadline": "2024-05-30",
            "status": "completed"
        }
    ],
    "message": "Task updated successfully",
    "success": true
}

```

---

``` 8. DELETE /tasks/:taskId```

* This endpoint delete the task(whose id mention in url). Basically update the isDeleted flag value to true.

* you have to pass actual taskId(which you want to delete) given by mongoDB in url in place of ":taskId"

| Parameter   | Type        | Description   | Passing place of parameter  |
|-------------|-------------|---------------|-----------------------------|
| email       | string      | Required      |  In request's body          |

### Example of URL

```
http://localhost:8090/api/v1/tasks/664ce686900f55618979750f
```

### Example of Request's body

```
{
    "email": "sdheerendra382@gmail.com"
}
```




#### Success Response
```json
{
    "statusCode": 200,
    "data": {
        "_id": "664ce603900f556189797508",
        "name": "Dheeru Thakur",
        "email": "sdheerendra382@gmail.com",
        "tasks": [
            {
                "subject": "DBMS",
                "deadline": "2024-05-21T00:00:00.000Z",
                "status": "pending",
                "isDeleted": false,
                "_id": "664ce621900f55618979750b",
                "subtasks": [
                    {
                        "subject": "mysql",
                        "deadline": "2024-05-21T18:30:00.000Z",
                        "status": "pending",
                        "isDeleted": false,
                        "_id": "664ce723bcb9b95e9fcdf667"
                    },
                    {
                        "subject": "mongoDB",
                        "deadline": "2024-05-21T18:30:00.000Z",
                        "status": "pending",
                        "isDeleted": false,
                        "_id": "664ce74bdddc3c346eca5b03"
                    },
                    {
                        "subject": "postgres",
                        "deadline": "2024-05-21T18:30:00.000Z",
                        "status": "pending",
                        "isDeleted": false,
                        "_id": "664ce75ddddc3c346eca5b09"
                    }
                ]
            },
            {
                "subject": "Operating system",
                "deadline": "2024-05-21T00:00:00.000Z",
                "status": "pending",
                "isDeleted": true,
                "_id": "664ce686900f55618979750f",
                "subtasks": [
                    {
                        "subject": "windows",
                        "deadline": "2024-05-21T18:30:00.000Z",
                        "status": "pending",
                        "isDeleted": false,
                        "_id": "664ce779dddc3c346eca5b10"
                    },
                    {
                        "subject": "linux",
                        "deadline": "2024-05-21T18:30:00.000Z",
                        "status": "pending",
                        "isDeleted": false,
                        "_id": "664ce785dddc3c346eca5b18"
                    },
                    {
                        "subject": "macos",
                        "deadline": "2024-05-21T18:30:00.000Z",
                        "status": "pending",
                        "isDeleted": false,
                        "_id": "664ce78ddddc3c346eca5b21"
                    }
                ]
            }
        ],
        "__v": 2
    },
    "message": "Task deleted successfully",
    "success": true
}
```

---

``` 9. DELETE /tasks/:taskId/subtask/:subtaskId```

* This endpoint delete the subtask(whose id mention in url) of a task(whose id mention in url). Basically update the isDeleted flag value to true.

* you have to pass actual taskId(who's subtask you want to delete) and subtaskId(which subtask you want to delete) given by mongoDB in url in place of ":taskId" and "subtaskId" respectively.

| Parameter   | Type        | Description   | Passing place of parameter  |
|-------------|-------------|---------------|-----------------------------|
| email       | string      | Required      |  In request's body          |

### Example of URL

```
http://localhost:8090/api/v1/tasks/664ce621900f55618979750b/subtask/664ce75ddddc3c346eca5b09
```

### Example of Request's body

```
{
    "email": "sdheerendra382@gmail.com"
}
```




#### Success Response
```json
{
    "statusCode": 200,
    "data": {
        "_id": "664ce603900f556189797508",
        "name": "Dheeru Thakur",
        "email": "sdheerendra382@gmail.com",
        "tasks": [
            {
                "subject": "DBMS",
                "deadline": "2024-05-21T00:00:00.000Z",
                "status": "pending",
                "isDeleted": false,
                "_id": "664ce621900f55618979750b",
                "subtasks": [
                    {
                        "subject": "mysql",
                        "deadline": "2024-05-21T18:30:00.000Z",
                        "status": "pending",
                        "isDeleted": false,
                        "_id": "664ce723bcb9b95e9fcdf667"
                    },
                    {
                        "subject": "mongoDB",
                        "deadline": "2024-05-21T18:30:00.000Z",
                        "status": "pending",
                        "isDeleted": false,
                        "_id": "664ce74bdddc3c346eca5b03"
                    },
                    {
                        "subject": "postgres",
                        "deadline": "2024-05-21T18:30:00.000Z",
                        "status": "pending",
                        "isDeleted": true,
                        "_id": "664ce75ddddc3c346eca5b09"
                    }
                ]
            },
            {
                "subject": "Operating system",
                "deadline": "2024-05-21T00:00:00.000Z",
                "status": "pending",
                "isDeleted": true,
                "_id": "664ce686900f55618979750f",
                "subtasks": [
                    {
                        "subject": "windows",
                        "deadline": "2024-05-21T18:30:00.000Z",
                        "status": "pending",
                        "isDeleted": false,
                        "_id": "664ce779dddc3c346eca5b10"
                    },
                    {
                        "subject": "linux",
                        "deadline": "2024-05-21T18:30:00.000Z",
                        "status": "pending",
                        "isDeleted": false,
                        "_id": "664ce785dddc3c346eca5b18"
                    },
                    {
                        "subject": "macos",
                        "deadline": "2024-05-21T18:30:00.000Z",
                        "status": "pending",
                        "isDeleted": false,
                        "_id": "664ce78ddddc3c346eca5b21"
                    }
                ]
            }
        ],
        "__v": 2
    },
    "message": "SubTask deleted successfully",
    "success": true
}
```


