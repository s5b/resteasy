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
