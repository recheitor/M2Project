const express = require('express');
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard');
const uploaderMiddleware = require('../middlewares/uploader')
const router = express.Router();
const User = require("../models/User.model")
const Recipe = require("../models/Recipe.model")


router.get("/profile", isLoggedIn, (req, res) => {

    let isAdmin = false
    if (req.session.currentUser.role === 'ADMIN') {
        isAdmin = true
    }
    res.render("user/personalprofile", { isAdmin });
})

router.get('/list', isLoggedIn, (req, res, next) => {

    User
        .find()
        .then(users => res.render('user/profiles-list', { users }))
        .catch(err => next(err))
})

router.get('/my-recipes', isLoggedIn, (req, res, next) => {


    const { _id: author } = req.session.currentUser
    const myRecipes = true

    Recipe
        .find({ author })
        .populate('author')
        .then(recipes => res.render('recipes/recipes-list', { recipes, myRecipes }))
        .catch(err => next(err))
})

router.get('/:user_id', isLoggedIn, checkRoles('USER', "ADMIN"), (req, res, next) => {

    const { user_id } = req.params

    const userRoles = {
        isAdmin: req.session.currentUser?.role === 'ADMIN',
        isUserId: req.session.currentUser?._id === user_id
    }

    if (userRoles.isAdmin || userRoles.isUserId) {
        User
            .findById(user_id)
            .then(user => res.render('user/profiles', { user, userRoles }))
            .catch(err => next(err))
    }
    else
        res.redirect('/user/list')
})

router.get("/:user_id/edit", isLoggedIn, checkRoles('USER', 'ADMIN'), (req, res, next) => {

    const { user_id } = req.params

    User
        .findById(user_id)
        .then(user => res.render("user/edit", user))
        .catch(err => next(err))
})

router.post('/:user_id/edit', isLoggedIn, uploaderMiddleware.single('avatar'), (req, res, next) => {

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
        .catch(err => next(err))
})

router.post('/:user_id/delete', isLoggedIn, (req, res, next) => {

    const { user_id } = req.params

    User
        .findByIdAndDelete(user_id)
        .then(() => res.redirect('/'))
        .catch(err => next(err))
})



module.exports = router