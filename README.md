# REST easy

This is a simple RESTful server built with ```nodejs``` that supports:

* Configuration of the listening port;
* Setting the initial model content, to seed the application model using JSON;
* HTTP verbs:
  * ```GET```: Retrieve a resource;
  * ```PUT```: Update a resource; and
  * ```POST```: Create a resource.
* Displays the state of the model (in JSON) after each request. This allows you to save the model representation to reseed the application the next time you start it.

## Running the application

To run the application you will need to have ```nodejs``` installed.

You can start the application using the following command line from the project *root*. This command line shows all the options; setting the listening port, and seeding the model from ```stdin```:

    cd server
    node ./lib/server --port 5657 <./data/simple.json
    
If you omit the:
* ```--port``` command then the port will default to ```5656```;
* ```stdin``` input then the model will be empty.

## Interacting with the application

You can use a browser or a tool like ```curl``` to interact with the server for testing and exploration.

### Retrieving data

For example, using the defaults, the following command will return the complete model:

    curl localhost:5656/

From the results of the previous request you can refine the URL to retrieve specific subsets of the model. For example, using the advertisers seed data, you can retrieve all advertisers with the following command:

    curl localhost:5656/advertisers

### Modifying data

You can also use curl to modify the model using ```PUT``` to change existing values, and ```POST``` to create new values. For example, to change the name of advertiser with id "17":

    curl -X PUT --data "\"Symmetry Investments\"" localhost:5656/advertisers/17/name
