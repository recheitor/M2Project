const express = require('express');
const router = express.Router();
const Event = require("../models/Event.model")
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard');
const uploaderMiddleware = require('../middlewares/uploader')


router.get("/", (req, res) => {
    const loggedUser = req.session.currentUser

    Event
        .find()
        .then(events => {
            res.render("events/list", { loggedUser, events });
        });
})

router.get("/:id/info", isLoggedIn, (req, res, next) => {
    const { id: event_id } = req.params
    const loggedUser = req.session.currentUser

    Event
        .findById(event_id)
        .then(event => res.render('events/info', { loggedUser, event }))
        .catch(err => console.log(err))
})



router.get("/add", isLoggedIn, (req, res) => {
    res.render("events/addevent", { loggedUser: req.session.currentUser })
})

router.post("/add", isLoggedIn, uploaderMiddleware.single('icon'), (req, res, next) => {

    const { title, icon, description, type, address, latitude, longitude, date } = req.body

    const newUserData = { title, icon, description, type, address, latitude, longitude, date }
    // const location = {
    //     type: 'Point',
    //     coordinates: [longitude, latitude]
    // }
    if (req.file) {
        const { path: icon } = req.file
        newUserData.icon = icon
    }

    Event
        .create({ title, icon, description, type, address, date })
        .then(() => res.redirect('/events'))
        .catch(err => next(err))

})


router.get("/:id/edit", isLoggedIn, (req, res) => {
    const { id: event_id } = req.params

    const loggedUser = req.session.currentUser

    Event
        .findById(event_id)
        .then(event => res.render("events/editevent", { loggedUser, event }))
        .catch(err => next(err))
})

router.post("/:id/edit", isLoggedIn, uploaderMiddleware.single('icon'), (req, res) => {
    const { id: event_id } = req.params
    const { title, icon, description, type, address, latitude, longitude, date } = req.body
    // const location = {
    //     type: 'Point',
    //     coordinates: [longitude, latitude]
    // }
    const newUserData = { title, icon, description, type, address, location, date }

    if (req.file) {
        const { path: icon } = req.file
        newUserData.icon = icon
    }

    Event
        .findByIdAndUpdate(event_id, newUserData)
        .then(() => res.redirect(`/events/${event_id}/info`))
        .catch(err => next(err))
})
//no se guarda la fecha asignada en el create, ni las coordenadas


router.get("/:id/delete", isLoggedIn, (req, res) => {
    const { id: event_id } = req.params

    Event
        .findByIdAndDelete(event_id)
        .then(() => res.redirect('/events'))
        .catch(err => next(err))
})



module.exports = router