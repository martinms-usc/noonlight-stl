const express = require('express');

const app = express();

// serve webpack bundle
app.use(express.static('dist'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Listening on port 8080'));
