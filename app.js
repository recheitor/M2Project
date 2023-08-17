require("dotenv").config();

require("./db");

const express = require("express");
const app = express();

require("./config")(app);
require('./config/session.config')(app)

app.locals.appTitle = `ONLYPIZZAS`;

const { loggedUserViews } = require("./middlewares/logged-user-update")
app.use(loggedUserViews)

require('./routes')(app)
require("./error-handling")(app);

module.exports = app;
