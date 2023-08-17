const express = require('express');
const router = express.Router();
const Event = require("../models/Event.model")
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard');
const uploaderMiddleware = require('../middlewares/uploader')
const { formatDate, formatTime } = require('../utils/date-utils')


router.get("/", (req, res) => {
    const loggedUser = req.session.currentUser
    let isPM = false
    if (req.session.currentUser.role === 'ADMIN') {
        isPM = true
    }
    Event
        .find()
        .then(events => {
            res.render("events/list", { loggedUser, events, isPM });
        });
})

router.get("/:id/info", isLoggedIn, (req, res, next) => {
    const { id: event_id } = req.params
    const loggedUser = req.session.currentUser

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
            res.render('events/info', { event, isJoined })
        })
        .catch(err => next(err))
})



router.get("/add", isLoggedIn, (req, res) => {
    res.render("events/addevent", { loggedUser: req.session.currentUser })
})

router.post("/add", isLoggedIn, uploaderMiddleware.single('icon'), (req, res, next) => {
    const { title, icon, description, type, address, date } = req.body

    geocodingApi
        .getCoordenates(address)
        .then(response => {
            const location = {
                type: 'Point',
                coordenates: [response.data.results[0].geometry.location.lng, response.data.results[0].geometry.location.lat]
            }
            return location
        })
        .then(location => Event
            .create({ title, icon, description, type, address, location, date })
            .then(() => res.redirect('/events')))
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