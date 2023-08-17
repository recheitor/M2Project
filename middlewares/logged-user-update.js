const loggedUserViews = (req, res, next) => {
    req.app.locals.loggedUser = req.session.currentUser
    next()
}

module.exports = {
    loggedUserViews
}