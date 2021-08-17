require('dotenv').config();
require('./strategies/discord');
const express = require('express');
const passport = require('passport');
const app = express();
const PORT = process.env.PORT || 3002;
const routes = require('./routes');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');

mongoose.connect('mongodb://localhost/kanna', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.use(cors({
	origin: ['http://localhost:3000'],
	credentials: true,
}));
app.use(session({
	secret: process.env.SECRET,
	cookie: {
		maxAge: 8.64e+7,
	},
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({
		mongoUrl: 'mongodb://localhost/kanna',
	}),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', routes);

app.listen(PORT, () => console.log(`Running on port ${PORT}`));