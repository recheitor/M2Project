const express = require('express');
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard');
const uploaderMiddleware = require('../middlewares/uploader')
const router = express.Router();
const User = require("../models/User.model")
const Recipe = require("../models/Recipe.model")


router.get("/profile", isLoggedIn, (req, res) => {
    let isPM = false
    if (req.session.currentUser.role === 'ADMIN') {
        isPM = true
    }
    res.render("user/personalprofile", { loggedUser: req.session.currentUser, isPM });
})

router.get('/list', isLoggedIn, (req, res) => {

    User
        .find()
        .then(users => res.render('user/profiles-list', { users, loggedUser: req.session.currentUser }))
        .catch(err => console.log(err))
})

router.get('/my-recipes', isLoggedIn, (req, res) => {
    const loggedUser = req.session.currentUser
    const myRecipes = true

    Recipe
        .find({ author: req.session.currentUser._id })
        .populate('author')
        .then(recipes => res.render('recipes/recipes-list', { loggedUser, recipes, myRecipes })
        )
        .catch(err => console.log(err))
})

router.get('/:user_id', isLoggedIn, checkRoles('USER', "ADMIN"), (req, res) => {
    const loggedUser = req.session.currentUser
    const { user_id } = req.params

    const userRoles = {
        isPm: req.session.currentUser?.role === 'ADMIN',
        isUserId: req.session.currentUser?._id === user_id
    }
    if (userRoles.isPm || userRoles.isUserId) {
        User
            .findById(user_id)
            .then(user => res.render('user/profiles', { user, userRoles, loggedUser }))
            .catch(err => console.log(err))
    }
    else
        res.redirect('/user/list')
})

router.get("/:user_id/edit", isLoggedIn, checkRoles('USER', 'ADMIN'), (req, res) => {
    const loggedUser = req.session.currentUser
    const { user_id } = req.params

    User
        .findById(user_id)
        .then(user => res.render("user/edit", { user, loggedUser }))
        .catch(err => console.log(err))
})

router.post('/:user_id/edit', isLoggedIn, uploaderMiddleware.single('avatar'), (req, res) => {
    const { user_id } = req.params
    const { email, userPwd, username, bio } = req.body
    const newUserData = { email, userPwd, username, bio }
    if (req.file) {
        const { path: avatar } = req.file
        newUserData.avatar = avatar
    }
    User
        .findByIdAndUpdate(user_id, newUserData)
        .then(user => res.redirect(`/user/${user._id}`))
        .catch(err => console.log(err))
})

router.post('/:user_id/delete', isLoggedIn, (req, res) => {
    const { user_id } = req.params

    User
        .findByIdAndDelete(user_id)
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
})



module.exports = router