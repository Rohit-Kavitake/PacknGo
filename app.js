// PacknGo Main server
// Developer :- Rohit Kavitake

//Requiring modules
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');

const app = express();

//MiddleWares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/assets`))

app.use((req, res, next) => {
    console.log('Hello from my Middleware🙋‍♂️');
    next();
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.get('/', (req, res) => {
    res.send('Hello From PacknGo Server');
});

//exporting Express app
module.exports = app;
