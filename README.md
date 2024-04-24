# Build API with microservice architecture using nestjs
## Features of this example
This example is basically an API for basic list task manager application.
## Running the example with docker-compose
Execute `docker network create infrastructure && cp .env.example .env && docker-compose up -d` from the root of the repository
## Accessing the API itself and swagger docs for the API
- Once you launch the API it will be accessible on port 8000.
- Swagger docs for the API will be accessible locally via URI "**http://localhost:8000/api**"
## Brief architecture overview
This API showcase consists of the following parts:
- API gateway
- Tasks service - responsible for CRUD operations 
- The service interact via **TCP sockets**

This example uses a SINGLE database (MongoDB) instance for all microservices.

this example is based in https://github.com/Denrox/nestjs-microservices-example.git
