# Cutshort Backend Assignmnet
App to Read, Write Posts and Todo. 
Built using Node.js, Express.js, MongoDB, Typescript, Jest

## Features
* User SignUp
    * Sign up with unique email id
    > router.post('/api/user/signup')
    * Error if User registers with same email id
    * Password is hashed before saving it to the database
    * Create access token and refresh token and is set on cookies for authentication
* User Login
    * Login with email id and password
    > router.post('/api/user/login')
    > router.delete('/api/user/logout')
    * On successful login create access token and refresh token and is set on cookies for authentication
* Post
    * Add, Edit, Delete post by logged in user/owner
    > router.post('/api/addPost')
    > router.put('/api/:userId/updatePost/:postId')
    > router.delete('/api/:userId/deletePost/:postId')
    * Anyone can access post (Pagination, Sorting)
    > router.get('/api/:userId/posts?page=1&limit=5&sort=title')
    > router.get('/api/:userId/posts/:postId')
    * Anyone can comment on post
    > router.post('/api/:userId/comment/:postId')
* Todo
    * Add, Edit, Delete todo by logged in user/owner
    > router.post('/api/addTodo')
    > router.put('/api/:userId/updateTodo/:todoId')
    > router.delete('/api/:userId/deleteTodo/:todoId')
    * Anyone can access todo (Pagination, Sorting, Filter based on 'Marked as Completed')
    > router.get('/api/:userId/todos?page=1&limit=5&completed=true&sort=title')
    > router.get('/api/:userId/todos/:todoId')
* Admin
    * Can see all users
    > router.get('/api/user/getAllUsers')
    * Can edit / delete any user's post and todo
* Other Features
    * Authentication using JWT token saved using cookies (accessToken and refreshToken)
    * Pagination and querying
    * RBAC - admin and user
    * Caching
    * Rate Limiting
    * Test cases using Jest
    * Api security
    
> **_NOTE:_**  Deployed the app on cyclic. Url is https://nervous-wasp-suspenders.cyclic.app but api calls are failing due to private and public key for RS256 algorithm event though this works fine on my local machine. Error message is pasted below

```
{
    "message": {
        "msgBody": "Something went wrong",
        "msgErrorDesc": "Error: secretOrPrivateKey must be an asymmetric key when using RS256",
        "msgError": true
    }
}
```
I am currently trying to debug it. Sorry for the inconvenience.
