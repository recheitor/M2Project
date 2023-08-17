module.exports = app => {
    const indexRoutes = require("./index.routes");
    app.use("/", indexRoutes);

    const authRoutes = require("./auth.routes");
    app.use("/auth", authRoutes);

    const userRoutes = require("./user.routes");
    app.use("/user", userRoutes);

    const recipesRoutes = require("./recipes.routes");
    app.use("/recipes", recipesRoutes);

    const eventsRoutes = require("./events.routes")
    app.use("/events", eventsRoutes);

    const apiRoutes = require("./api.routes")
    app.use("/api", apiRoutes)
}