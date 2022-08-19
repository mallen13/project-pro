#Project Pro
Create Projects. Add Tasks. Get Organized.  

## About
   Fullstack CRUD web application built for creating and saving multiple lists of items. The lists can be deleted, and list items can be created or removed as needed. The frontend was created with React and the backend was build using Node/Express and MySQL.

   The app can also be added to homescreen to be used as online-only PWA.

   View the live application here: https://mallen13.github.io/project-pro/

## Development
   The development lifecycle started with a simple mockup done in Figma along with a brainstorming session of app requirements and the technologies that would be needed to accomplish the application goals. 

   After design, the app was quickly developed. The focus was on creating a minimum viable product that could be perfected later on. Code follows DRY principles and components include comments and were kept as small as possible by separating login and view components.

   While coding, automated tests were writted as components were created. 100% code coverage was initially achieved on the frontend. 

   The backend api was first implemented and tested locally using Postman before going live. Database schema was carefully considered before implementing as well. 

   After developemnt was complete, the application frontend and backend were each deployed and the codebase stored on GH.

## Technologies
   React was used to allow for easy and reusable frontend components. Due to minimal stying, css modules were used. A library or framework was not necessary. CSS was imported as modules instead of regular CSS to avoid namespace collisions. 

   The backend is build using Node and Express for the API routes. MySQL was used as the database for persistent data. MySQL was chosen over PostgreSQL due to the simplicity of backend operations.

## Roadmap
   Over time, the application will continue to be improved as far as both function and style. Some future goals and ideas are:
   
   -implement lightmode and dark mode
   -storing of tokens for persistent logins
   -use context or another state management tool to store auth instead of prop drilling
   -implementing refresh tokens
   -seek user confirmation before deleting lists to avoid accidents  
   -implement frontend caching of lists in browser storage to reduce api calls  
   -allow users to update list names  
   -allow users sort/ filter lists  
   -add additional PWA features
