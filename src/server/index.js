const express = require('express');
const app = express();

// serve webpack bundle
app.use(express.static('dist'));

app.listen(8080, () => console.log('Listening on port 8080!'));
