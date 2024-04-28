Install requirements:
 - docker (https://docs.docker.com/get-docker/)

# Ronaldo's motorway test

Spin up the docker compose
```
docker-compose -f docker-compose.yml up --build
```

## Description
The API is composed of three endpoints
```
GET: api/vehicle/:vehicleId
POST: api/vehicle
POST: api/auth
```

Two instances are running behind a nginx on port 9999.

To test the main point, use the following request.
```
curl --location 'http://localhost:9999/api/vehicle/3?timestamp=2022-09-12%2010%3A00%3A00%2B00'
```

To test the `create` endpoint, you need to authenticate first, and then you can test using the following request.
```
curl --location 'http://localhost:8080/api/vehicle' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7fX0.sNFfJUwBtU_0Z3ZjzLAdoMX4GQFVZccpkn5cHLAEYug' \
--data '{
 "make": "Audi",
 "model": "A6",
 "state": "available"
}'
```
If you don't want to use port 8080, you need to change it on the docker-compose and in the nginx file.

## Changes on database
To make it easier to implement an insert endpoint (out of scope), I have added an identity column on the table, not the best way, but the easiest. A better way would be create a GUID on the API and send the ID generated already, then you can add this insert on an insert queue or make a bulk insert if the amount of request is high.

## New images on docker-compose
To simulate a real environment, I have introduced Nginx as the load balancer, Seq to make it easier to see the logs, and Redis as the cache. Also, I have limited the resources to be closer to a real environment.

## Logs
On this project, I have used Pino and Seq as sinks. You can access the logs using the following URL. I am a big fan of completion logs, so create one log per request with a lot of information, with a correlationId to correlate with other services. In this case, I kept it simple more because of time.
```
http://localhost:5341/#/events
```

## Auth
Not part of the scope, but I have added JWT with a create endpoint to introduce more things like middleware and bring this API closer to a real world API. There is no endpoint to register, so the user and password are defined by these two variables on docker-compose.yml
```
ADM_USER: user1
PASS_USER: pass123
```
Example request
```
curl --location 'http://localhost:9999/api/auth' \
--header 'Content-Type: application/json' \
--data '{
    "user": "user1",
    "password": "pass123"
}'
```
I didn't add an expiration to the token. You will need to create only once. On a real app we would add an expiration of two hours and create a refresh token with a longer expiration, so the token would need to be refreshed constantly, but the user still doesn't need to authenticate often.

## Validations
I have introduced the yup to make the validations. I have been using this library over the year on Node, React, and ReactNative. It works pretty well. I didn't validate everything, just the create request. It's also missing guard clauses on the models to make sure one object is created as it is required.

## Tests
For unit tests, I used the old good jest. Some unit tests and integration tests were added. As desired, the integration tests are tested from the entry point in the controller until the database and the unit tests test the code with mocks. 

## Formatters
I added lint and prettier to help keep the style code more standard. On a real app, we would also like to add `husky` to run tests and the formatters before commit. It will turn more simpler the code review process.