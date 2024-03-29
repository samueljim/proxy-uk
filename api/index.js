const express = require('express');
const cors = require('cors')
const request = require('request').defaults({ encoding: null });

const app = express();
app.use(cors());

const asyncMiddleware = fnc =>
    (req, res, next) => {
        Promise.resolve(fnc(req, res, next))
            .catch(next);
    };

// app.get('*:url', asyncMiddleware(async (req, res, next) => {
//     try {
//         (req.params.url) ? request(req.params.url).pipe(res) : next('No url');
//     } catch (err) { next(err); }
// }));

// app.get('/:url', asyncMiddleware(async (req, res, next) => {
//     try {
//         (req.params.url) ? request(req.params.url).pipe(res) : next('No url');
//     } catch (err) { next(err); }
// }));

app.get('*', asyncMiddleware(async (req, res, next) => {
    try {
        (req.query.url) ? request(req.query.url).pipe(res) : res.send('bad url please send a request (?url=https://www.google.com/)');
    } catch (err) { next(err); }
}));

// if there's an error in routing then this will happen
app.use(function (err, req, res, next) {
    res.send({'error': err});
});

module.exports = app

// var http = require('http');
// module.exports = (request, response) => {
//     var proxy = http.createClient(80, request.headers['host'])
//     var proxy_request = proxy.request(request.method, request.url, request.headers);
//     proxy_request.addListener('response', function (proxy_response) {
//       proxy_response.addListener('data', function(chunk) {
//         response.write(chunk, 'binary');
//       });
//       proxy_response.addListener('end', function() {
//         response.end();
//       });
//       response.writeHead(proxy_response.statusCode, proxy_response.headers);
//     });
//     request.addListener('data', function(chunk) {
//       proxy_request.write(chunk, 'binary');
//     });
//     request.addListener('end', function() {
//       proxy_request.end();
//     });
// }