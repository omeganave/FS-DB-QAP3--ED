const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const app = express();
const port = 3000;

app.use(session({
    // Move this to another file, same as database login credentials
    secret: 'mysecretpassword',
    resave: false,
    saveUninitialized: false
}))

app.use((req, res, next) => {
    console.log(`Received ${req.method} request at ${req.url}`);
    next();
})

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(methodOverride('_method'));

const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

app.listen(port, () => {
    console.log(`Server is now listening on port ${port}!`);
});