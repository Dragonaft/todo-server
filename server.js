const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const user_lostRouters = require('./app/routes/User_listRoutes');
const todolist_lostRouters = require('./app/routes/todo-listRoutes');
const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

/* DB */
const db = require('./models');
db.sequelize.sync();

// drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//     console.log('Drop and re-sync db.');
// });

app.all('/*', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    next();
});

app.use('/user_lists', user_lostRouters);
app.use('/todolist', todolist_lostRouters);
app.get('/', (req, res) => {
    res.json({message: 'Welcome to application.'});
});


// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
