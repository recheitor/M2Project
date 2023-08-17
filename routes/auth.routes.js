const router = require("express").Router()
const bcrypt = require('bcryptjs')
const User = require("../models/User.model")
const { isLoggedOut } = require("../middlewares/route-guard")
const uploaderMiddleware = require('../middlewares/uploader')

const saltRounds = 10

router.get('/sign-up', isLoggedOut, (req, res, next) => res.render('auth/sign-up'))
router.post('/sign-up', isLoggedOut, uploaderMiddleware.single('avatar'), (req, res, next) => {

    const { email, userPwd, username, bio } = req.body
    const userData = { email, username, bio }

    if (req.file) {
        const { path: avatar } = req.file
        userData.avatar = avatar
    }

    if (!email.length) {
        const errorMessage = 'Email is requiered'
        res.render('auth/sign-up', { errorMessage })
        return
    }
    if (!username.length) {
        const errorMessage = 'Username is required'
        res.render('auth/sign-up', { errorMessage, email })
        return
    }

    if (userPwd.length < 8) {
        const errorMessage = 'Password must be at least 8 characters length'
        res.render('auth/sign-up', { errorMessage, email, username })
        return
    }

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(userPwd, salt))
        .then(hashedPassword => {
            userData.password = hashedPassword
            return User.create(userData)
        })

        .then((user) => {
            req.session.currentUser = user
            res.redirect('/')
        })
        .catch(error => next(error))
})

router.get('/login', isLoggedOut, (req, res, next) => res.render('auth/login'))
router.post('/login', isLoggedOut, (req, res, next) => {

    const { email, userPwd } = req.body

    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Email no registrado en la Base de Datos' })
                return
            } else if (bcrypt.compareSync(userPwd, user.password) === false) {
                res.render('auth/login', { errorMessage: 'La contraseña es incorrecta' })
                return
            } else {
                req.session.currentUser = user
                res.redirect('/')
            }
        })
        .catch(error => next(error))
})

router.get('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router