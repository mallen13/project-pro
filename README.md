# Lists App

## About
   Fullstack CRUD web application built for creating and saving multiple lists of items. The lists can be deleted, and list items can be created or removed as needed. The frontend was created with React and the backend was build using Node/Express and MySQL. 

   View the live application here: https://mallen13.github.io/list-app/

## Development
   The development lifecycle started with a simple mockup done in Figma along with a brainstorming session of app requirements and the technologies that would be needed to accomplish the application goals. 

   After design, the app was quickly developed. The focus was on creating a minimum viable product that could be perfected later on. Code follows DRY principles and components include comments and were kept as small as possible by separating login and view components.

   While coding, automated tests were writted as components were created. 100% code coverage was initially achieved on the frontend. 

   Backend was first implemented and tested locally using Postman before going live. Database schema was carefully considered before implementing as well. 

   After developemnt was complete, the application frontend and backend were each deployed and the codebase stored on GH.

## Technologies
   Due to the small nature of the app, technologies were carefully considered to avoid over-engineering. 

   React was used to allow for easy and reusable frontend components. Due to minimal stying, css modules were used. A library or framework was not necessary. CSS was imported as modules instead of regular CSS to avoid namespace collisions. 

   The backend as build using Node and Express for the API routes. MySQL was used as the database for persistent data. MySQL was chosen over PostgreSQL due to the simplicity of backend operations. The current backend host does not support no-SQL databases. 

## Roadmap
   Over time, the application will continue to be improved as far as both function and style. Some future goals and ideas are:

   -update app state on list changes instead of pulling lists from api each time  
   -include icons for the buttons
   -seek user confirmation before deleting lists to avoid accidents  
   -implement frontend caching of lists in browser storage to reduce api calls  
   -allow users to update list names  
   -allow users sort/ filter lists  
   -add PWA features