# Movie Assistant
This application showcases how to build a conversational solution by using the [api.ai](https://api.ai/) service. The application allows users to converse with a virtual agent to search for current or upcoming movies by using [themoviedb.org](https://www.themoviedb.org/) database.

The application uses a conversational template that you can customize for your own application. This domain-independent template will help you to structure your dialogs according to how people naturally converse, thus helping you to bootstrap your future dialogs.

The UI of this application is inspired by IBM Watson [dialog service demo](https://github.com/watson-developer-cloud/movieapp-dialog). But this is a fully client-side app with no server-side component. It communicates directly with api.ai and tmdb APIs. 

## How the app works
Users talk in natural language to the system to find movies that match the search criteria they've specified. The system is built to understand natural language that relates to searching for and selecting movies to watch. For example, saying "I am looking for recent action movies" causes the system to search the movie DB and to return the names of some action movies that have been released in the last 60 days sorted by popularity score.

The system is designed to obtain the following types of information about movies from users before it searches the repository:

  * **Recency**: The system determines whether users want to know about now playing movies or upcoming movies.
  * **Genre**: The system understands movie genres, such as action, comedy and horror.

## Setup
To run this app, you need to set up an api.ai agent and get tmdb API key. 

### Set up api.ai agent
1. Create a new agent in api.ai dashboard. You can import the agent files available in `/agent_export` folder. This will automatically create all necessary [entities](https://docs.api.ai/docs/concept-entities), [intents](https://docs.api.ai/docs/concept-intents) and [contexts](https://docs.api.ai/docs/concept-contexts). 

2. Note the client access token associated with the agent. And put that in `/app/modules/dialog-service.js` file. 

### Get tmdb API key
1. Request an API key from [themoviedb.org](https://www.themoviedb.org/documentation/api): A user account is required before you request an API key from themoviedb.org.
2. Put the API key in `/app/modules/dialog-service.js` file. 

### Build, debug and deploy
Use the following commands: 
  1. `gulp`  -  build the client-side app ready for production. 
  2. `gulp --target=development`  -  build the client-side app for development and debugging purpose. 
  3. `gulp serve`  -  for running and debugging app locally with browser testing and live reloads provided by [browserSync](https://www.browsersync.io/). 
  4. The `/public` directory created after the build is ready to be deployed to any host which supports static files hosting. 


