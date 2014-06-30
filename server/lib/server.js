/**
 * Created by sbegg on 29/06/2014.
 */

var http = require('http');
var url = require('url');
var tags = require('../node_modules/cltags/cltags');

var model = {};

var requestDetails;
var pathParts;

var status;
var contentType;
var response;

var targetModel;
var modelIndex;
var resource;

var port = 5656;

var options = tags.parse(process.argv);

if (options.hasOwnProperty('port')) {
    port = parseInt(options.port, 10);
}

var state = function (message) {
    console.log('-----: ' + message);
    console.log(model);
};

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function () {
    var serialisedModel = process.stdin.read();
    if (serialisedModel !== null) {
        model = JSON.parse(serialisedModel);
    }
    state('Initial model');
});

var findResource = function (resourceModel, resourcePathParts) {
    var findStatus = 200;
    var resource = resourceModel;
    var parent = resourceModel;
    var leaf = null;
    for (modelIndex = 1; modelIndex < resourcePathParts.length; modelIndex += 1) {
        if (resourcePathParts[modelIndex] !== '') {
            leaf = resourcePathParts[modelIndex];
            if (resource.hasOwnProperty(leaf)) {
                parent = resource;
                resource = resource[leaf];
            } else {
                findStatus = 404;
            }
        }
    }
    return { status: findStatus, targetModel: resource, leaf: leaf, parent: parent };
};

http.createServer(function (req, res) {

    requestDetails = url.parse(req.url, true);
    pathParts = requestDetails.pathname.split('/');

    status = 200;
    contentType = 'text/plain';
    response = '';
    switch (req.method) {
        case 'GET':
            // Find and return a resource.
            resource = findResource(model, pathParts);
            status = resource.status;
            if (status === 200) {
                response = JSON.stringify(resource.targetModel);
                contentType = 'application/json';
            }
            break;
        case 'POST':
            // Create a new resource.
            resource = findResource(model, pathParts);
            if (resource.status !== 404) {
                status = 409;  // HTTP status CONFLICT.
                response = 'CONFLICT: Resource already exists.'
            } else {
                targetModel = '';
                req.on('data', function (data) {
                    targetModel += data;
                });
                req.on('end', function () {
                    // TODO: Handle parse errors??
                    targetModel = JSON.parse(targetModel);
                    resource.targetModel[resource.leaf] = targetModel;
                });
            }
            break;
        case 'PUT':
            // Update an existing resource.
            resource = findResource(model, pathParts);
            status = resource.status;
            if (status === 200) {
                targetModel = '';
                req.on('data', function (data) {
                    targetModel += data;
                });
                req.on('end', function () {
                    // TODO: Handle parse errors??
                    targetModel = JSON.parse(targetModel);
                    resource.parent[resource.leaf] = targetModel;
                });
            }
            break;
        case 'DELETE':
            // Delete an existing resource.
            break;
        default:
            status = 501;
            contentType = 'text/plain';
            response = 'Unsupported method: "' + req.method + '".';
            break;
    }

    res.writeHead(status, {'Content-Type': contentType});
    res.end(response);

    state('Current model');

}).listen(port, '127.0.0.1');
console.log('Server running at http://127.0.0.1:' + port  + '/');