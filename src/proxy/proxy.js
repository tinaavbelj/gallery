const express = require('express');
const request = require('request');

const app = express();

app.use('/', function (req, res) {
    const url = req.url.substring(1);
    console.log(`Request forwarded to ${url}`);

    res.set('Access-Control-Allow-Origin', '*');
    req.pipe(request({ uri: url })).pipe(res);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
});
