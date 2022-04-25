const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');

//express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//removes requirement to add "api" in the api requests.
//use anything starting with "/api"
app.use('/api', apiRoutes);

//default response for any other request (not found)
app.use((req, res) => {
    res.status(404).end();
})

//start server after db connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
})