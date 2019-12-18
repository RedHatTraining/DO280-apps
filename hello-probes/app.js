const fs = require('fs')
const start_lock="/tmp/startup.lock"
const degraded_state_file="/tmp/degraded"
const DEFAULT_SLEEP_SECONDS = 60;

var INIT_SLEEP = 0;

// Parse the sleep interval
try {
    INIT_SLEEP = Number(process.env.INIT_SLEEP_SECONDS);
} catch(e) {
    console.log("Unable to convert sleep parameter; falling back to default value...");
    INIT_SLEEP = DEFAULT_SLEEP_SECONDS;
}
if (isNaN(INIT_SLEEP)) {
    INIT_SLEEP = DEFAULT_SLEEP_SECONDS;
}
console.log("Initial sleep interval: " + Number(INIT_SLEEP));


// If a lock file doesn't exist, create a new lock file with the current timestamp.
if (! fs.existsSync(start_lock)) {
    console.log("Application starting...");
    fs.writeFileSync(start_lock, Date.now());
}

function is_ready() {
    var startTime = Number(fs.readFileSync(start_lock));
    var nowTime = Date.now();
    var difference = nowTime - startTime;

    if (difference < INIT_SLEEP*1000 ) {
        return false;
    }
    return true;
}

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000,
    admin_port = process.env.ADMIN_PORT   || process.env.OPENSHIFT_NODEJS_ADMIN_PORT || 3001,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var express = require('express'),
    app     = express(),
    admin_app     = express(),
    bodyParser = require('body-parser'),
    os = require('os'),
    hostname = os.hostname();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var route = express.Router();
app.use('/', route);

admin_app.use(bodyParser.urlencoded({ extended: true }));
admin_app.use(bodyParser.json());


// Start defining routes for our app/microservice

// A route that dumps hostname information from pod
route.get('/', function(req, res) {
    if (is_ready()) {
        res.send('Hi! I am running on host -> ' + hostname + '\n');
    } else {
        res.statusMessage = "Service Not ready";
        res.statusCode = 503;
        res.send('Server Error\n');
    }
});

// A route used for the readiness probe in openshift
admin_app.get('/ready', function(req, res) {
    if (is_ready()) {
        res.send(hostname + ' is READY\n');
    } else {
        res.statusMessage = "Service Not ready";
        res.statusCode = 503;
        res.send(hostname + ' is NOT READY\n');
    }

});


// A route used for health check in openshift
admin_app.get('/health', function(req, res) {
    if (fs.existsSync(degraded_state_file)) {
        res.statusMessage = "Degraded State"
        res.statusCode = 500
        res.send('The ' + hostname + ' host is experiencing unusual load.\n' + 
                 'Please return at a later time.');
        return
    } else {
        res.send(hostname + ' is healthy.\n');
    }
});


admin_app.listen(admin_port, ip);
app.listen(port, ip);
console.log('nodejs server running on http://%s:%s', ip, port);
console.log('nodejs admin server running on http://%s:%s', ip, admin_port);


module.exports = {
    app,
    admin_app
};
