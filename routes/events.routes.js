const express = require('express');
const router = express.Router();
const Event = require("../models/Event.model")
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard');
const uploaderMiddleware = require('../middlewares/uploader')
const { formatDate, formatTime } = require('../utils/date-utils')
const geocodingApi = require('../services/geocode.service')


router.get("/", (req, res, next) => {
    let isAdmin = false
    if (req.session.currentUser.role === 'ADMIN') {
        isAdmin = true
    }
    Event
        .find()
        .then(events => {
            res.render("events/list", { events, isAdmin });
        })
        .catch(err => next(err))
})


router.get("/:id/info", isLoggedIn, (req, res, next) => {
    const { id: event_id } = req.params
    const loggedUser = req.session.currentUser
    let isAdmin = false
    if (req.session.currentUser.role === 'ADMIN') {
        isAdmin = true
    }
    Event
        .findById(event_id)
        .populate('attender')
        .then(event => {
            event.formattedDate = formatDate(event.date)
            event.formattedTime = formatTime(event.date)

            let isJoined = false
            event.attender.forEach(eachAtt => {
                if (eachAtt._id.toHexString() === loggedUser._id) {
                    isJoined = true
                }
            })
            res.render('events/info', { event, isJoined, isAdmin })
        })
        .catch(err => next(err))
})


router.get("/add", isLoggedIn, (req, res) => {
    res.render("events/addevent")
})

router.post("/add", isLoggedIn, uploaderMiddleware.single('icon'), (req, res, next) => {
    const { title, description, type, address, date } = req.body
    const eventData = { title, description, type, address, date }
    if (req.file) {
        const { path: icon } = req.file
        eventData.icon = icon
    }
    geocodingApi
        .getCoordenates(address)
        .then(response => {
            location = {
                type: 'Point',
                coordinates: [response.data.results[0].geometry.location.lng, response.data.results[0].geometry.location.lat]
            }
            return eventData.location = location
        })
        .then(() => Event
            .create(eventData)
            .then(() => res.redirect('/events')))
        .catch(err => next(err))
})


router.get("/:id/edit", isLoggedIn, (req, res, next) => {
    const { id: event_id } = req.params

    Event
        .findById(event_id)
        .then(event => res.render("events/editevent", { event }))
        .catch(err => next(err))
})


router.post("/:id/edit", isLoggedIn, uploaderMiddleware.single('icon'), (req, res, next) => {
    const { id: event_id } = req.params
    const { title, icon, description, type, address, location, date } = req.body
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


router.get("/:id/delete", isLoggedIn, (req, res, next) => {
    const { id: event_id } = req.params

    Event
        .findByIdAndDelete(event_id)
        .then(() => res.redirect('/events'))
        .catch(err => next(err))
})


router.get("/:id/join-event", isLoggedIn, (req, res, next) => {
    const { id: event_id } = req.params
    const loggedUser = req.session.currentUser
    Event
        .findByIdAndUpdate(event_id, { $push: { attender: loggedUser._id } })
        .then(() => res.redirect(`/events/${event_id}/info`))
        .catch(err => next(err))
})

router.get("/:id/unjoin-event", isLoggedIn, (req, res, next) => {
    const { id: event_id } = req.params
    const loggedUser = req.session.currentUser
    Event
        .findByIdAndUpdate(event_id, { $pull: { attender: loggedUser._id } })
        .then(() => res.redirect(`/events/${event_id}/info`))
        .catch(err => next(err))
})



module.exports = router