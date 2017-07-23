# NodeJS resource api Proof-Of-Concept (PoC)

## Requirements

* NodeJS >= 7.6
* MongoDB

## Installing

* clone this repo
* cd path/to/this/repo && npm install

## Configuring

Create a .env file with the following options:

```
# server
NODE_ENV=(development|production)
NODE_PORT=8081 # port where the server will listen

# Throttle feature
THROTTLE_FEATURE=(any value to enable)
THROTTLED_DEVICES=12jHUD7890,jjKhdg887 #comma separated devices id, it will be used only if throttle feature is enabled

# database (all required)
MONGO_HOST=
MONGO_PORT=
MONGO_DB_NAME=

```

## Running with docker

* docker-compose up

## Running without docker

* npm start

---

The goal of this test is to apply some basic concepts of a resource API using NodeJS stack.

## PoC Goal requirements

Build a REST API that works with a resource called "devices" and supports the following operations:
* POST /devices
* GET /devices
* GET /devices/:id
* POST /positions/:deviceId

As a data store, the API must use a NoSQL database. As a main database/datastore you are free to choose anyone you are comfortable to work with.

Before you start to work, it is strongly recommended to fork this repo. You are going to need that in order to send your code for analysis.

## Stack details
* NodeJS (choose any version);
* NPM packages (feel free to use those you like more);
* NoSQL database (just pick anyone);

## Application Architecture specifics

You are free to organize your project the way you like to do and use the packages you want as soon as it attends the goals implementing exactly what we are describing on this doc.

Below you are going to find the description of the endpoints of our rest api.

### DEVICE resource

The device resource is a JSON document because the entire API must support JSON. It contains exactly the same properties as the example below:
```
  {
    "_id": "b55ee146-217b-4696-b9ef-b61581dad7ef",
    "serialNumber": "1234XPTO",
    "deviceId": "NDTSTSMID0001-1000",
    "name": "my device"
  }
```

When creating documents you may have missing information, but you can't have properties that don't respect the schema above.

### POST /devices

Creates one or more resources. One if receiving an object or many if receiving an array. When post data to this API the application the expectation is:
* application is going to validate the body payload and reply with errors when they do not respect the data schema;
* the data sent to the endpoint is going to be inserted into nosql database;
* the api returns HTTP 200 if having success;
* the api returns HTTP 400 if payload doesn't match with the schema;
* the api returns HTTP 500 in case of unexpected error;
* the api must return an error when the deviceId is not unique in the database.

### GET /devices

Returns all people documents. When sending a GET request to this endpoint:
* the api returns all documents of people collection
* the api returns null if database is empty
* the api returns HTTP 200 if having success;
* the api returns HTTP 500 in case of unexpected error.

### GET /devices/:id

Returns a single document by id. When sending a GET request to this endpoint:
* the api returns a single document matching with the id passed on the uri;
* the api returns HTTP 200 if having success;
* the api returns HTTP 404 if no document is found;
* the api returns HTTP 500 in case of unexpected error.

### POST /positions/:deviceId endpoint

The position endpoint payload is a JSON document because the entire API must support JSON. It contains exactly the same properties as the example below:
```
  {
    "latitude": 19.199843,
    "longitude": 129.606578
  }
```

It needs to be prepared for a single document or an array. When receiving data, it needs to:
* insert the data into a collection in the database and return HTTP 200 in case of success;
* return HTTP 404 in case the device with the informed device ID does not exist in the database;
* return HTTP 500 in case of unexpected error;
* return HTTP 403 in case of throtling (please check the item below).

The data saved in the database through this endpoint is the payload + serialNumber as specified below:
```
  {
    "latitude": 19.199843,
    "longitude": 129.606578,
    "deviceSN": "1234XPTO"
  }
```


### Throttling devices

The goal of building this rest api is the opportunity to provide a throttling feature. When ENABLED, all data posted to `/positions` are going to be verified. If the deviceId informed in the url matches with a list of "blocked" devices, it returns HTTP 403 and prevent the data to be saved in the main datastore. Of course, if disabled, it ignores the blacklist and everything should work fine.

## Things you can't do when building your application
* We don't want additional features. Plese, stay focused on what is being requested;
* If you are not able to implement all features, please implement what you can. Few features with quality are more valuable than all features with failures.
* We want a human readable code. No need to have a full documentation, but some comments and clear coding are good practices;

## Things we would love to find in your project (aka - plus features)
* Some ES6;
* The expected node version specified at some place (package.json, .nvmrc file);
* Some unit or functional test (but only if you have time);
* Some lint check to show use you are worried about standards;
* App running inside a docker container OR a docker-compose file containing the dependencies to run it.

## Releasing your PoC
* This task should not take more than 3 days (but in case of issues or taking more time than usual, send that adding your comments about what happened);
* The release is simple. You just need to submit a PULL REQUEST (PR) to this repo with your changes and add a comment telling us you are done;
* Some comments may be added to your PR. Please stay tuned to reply them as needed.

## FAQ

In case of any question just send an e-mail to: vinicius.linck@e-core.com
