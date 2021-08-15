// PacknGo Main server
// Developer :- Rohit Kavitake

const app = require('./app');

const PORT = 8080;
app.listen(PORT, () => {
    console.log(
        `PacknGo Server Is Running on Port : ${PORT}`
    );
});
