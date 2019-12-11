const fs = require('fs')
const start_lock="/tmp/startup.lock"
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

var express = require('express'),
    app     = express(),
    bodyParser = require('body-parser'),
    os = require('os'),
    hostname = os.hostname();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var route = express.Router();

app.use('/', route);

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
route.get('/ready', function(req, res) {
    if (is_ready()) {
        res.send('READY\n');
    } else {
        res.statusMessage = "Service Not ready";
        res.statusCode = 503;
        res.send('NOT READY\n');
    }

});


// A route used for health check in openshift
route.get('/health', function(req, res) {
    res.send('OK\n');
});


app.listen(port, ip);
console.log('nodejs server running on http://%s:%s', ip, port);

module.exports = app;

