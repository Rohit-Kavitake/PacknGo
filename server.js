// PacknGo Main server
// Developer :- Rohit Kavitake

const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const DB = '' + process.env.database;
mongoose
    .connect(DB, {
        useNewUrlParser: true,
    })
    .then(() => console.log('Database connected Successfully!'))
    .catch((err) => console.log('Error Connecting Mongo : ' + err));

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`PacknGo Server Is Running on Port : ${PORT}`);
});
