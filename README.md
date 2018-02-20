# MyBlog
Website to blog technical learnings

Technical Stack:  
Client:  
-> ReactJS  
-> Semantic UI with ReactJS  

Server:  
-> NodeJS  
-> ExpressJS  
-> Mongodb  

Setup Instructions:  
1.Install nodejs  
2.Install Mongodb  
3.Run npm install on package.json  
4.Start DB server  
5.Build the application using - yarn build.  
6.Start node server using - node server.js  
7.Application can be launched from localhost.  

Implementation Details:  
Client is on Single Page Application using react DOM.  
UI is built using Semantic.  

Client comprises following screens.  
1.Home page To list Blogs posted by all users.  
2.Page to Register a new user.  
3.Page to Login existing user.  
4.Page to post blog details.  
5.Page to display individual blog.  

Server has following end points.  

1.registerUser - Register new user.  
2.authUser - authenticate existing user.  
3.postBlog - save a blog posted by user.  
4.fetchBlog - fetch particular blog.  
5.fetchBlogList - fetch list of blogs updated by all users.  



