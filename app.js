require("dotenv").config();

require("./db");

const express = require("express");


const hbs = require("hbs");

const app = express();

require("./config")(app);
require('./config/session.config')(app)



app.locals.appTitle = `ONLYPIZZAS`;

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/user", userRoutes);

const recipesRoutes = require("./routes/recipes.routes");
app.use("/recipes", recipesRoutes);

const eventsRoutes = require("./routes/events.routes")
app.use("/events", eventsRoutes);

require("./error-handling")(app);

module.exports = app;
