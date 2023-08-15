const express = require('express');
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard');
const uploaderMiddleware = require('../middlewares/uploader')
const router = express.Router();
const User = require("../models/User.model")
const Recipe = require("../models/Recipe.model");
const edamamApi = require('../services/edamam-service');

router.get("/", isLoggedIn, (req, res) => {
    const loggedUser = req.session.currentUser

    Recipe
        .find()
        .populate('author')
        .then(recipes => {
            res.render("recipes/recipes-list", { loggedUser, recipes });
        })
})

router.get("/favorites", isLoggedIn, (req, res) => {
    const loggedUser = req.session.currentUser

    User
        .findById(loggedUser._id)
        .populate('favs')
        .then(favorites => {
            const favoritesId = favorites.favs.map(favs => favs.id)
            return Recipe.find({ _id: favoritesId })
        })
        .then((recipes) => {
            res.render("recipes/recipes-fav", { loggedUser, recipes })
        }
        )
})

router.get("/create", isLoggedIn, (req, res) => {
    res.render("recipes/new-recipe", { loggedUser: req.session.currentUser })
})

router.post('/create', isLoggedIn, uploaderMiddleware.single('recipeImg'), (req, res, next) => {
    const { title, description } = req.body

    let ingredients
    if (typeof req.body.ingrName !== 'string') {
        ingredients = req.body.ingrName.map((eachIngr, idx) => {
            return ({ ingrName: eachIngr, ingrQuantity: req.body.ingrQuantity[idx], ingrMeasureUnit: req.body.ingrMeasureUnit[idx] })
        });
    } else {
        ingredients = { ingrName: req.body.ingrName, ingrQuantity: req.body.ingrQuantity, ingrMeasureUnit: req.body.ingrMeasureUnit }
    }

    const RecipeData = { title, ingredients, description, author: req.session.currentUser._id }
    if (req.file) {
        const { path: recipeImg } = req.file
        RecipeData.recipeImg = recipeImg
    }

    Recipe
        .create(RecipeData)
        .then(() => res.redirect('/recipes'))

})

router.get("/:id/details", isLoggedIn, (req, res, next) => {
    const { id: recipe_id } = req.params
    let isVoted = false

    Recipe
        .findById(recipe_id)
        .populate('author')
        .then(recipe => {
            recipe.favorites.forEach((eachFavorite) => {
                if (eachFavorite.userId.includes(req.session.currentUser._id)) {
                    isVoted = true
                }
            })

            if (req.session.currentUser._id === recipe.author[0].id || req.session.currentUser.role === 'ADMIN') {
                isOwner = true
                res.render("recipes/recipe-details", { loggedUser: req.session.currentUser, recipe, isOwner, isVoted })
                return
            }
            res.render("recipes/recipe-details", { loggedUser: req.session.currentUser, recipe, isVoted })
        })
        .catch(err => next(err))
})

router.get("/:id/add-favorite", isLoggedIn, (req, res, next) => {
    const { id: recipe_id } = req.params
    const loggedUser = req.session.currentUser
    User
        .findById(loggedUser._id)
        .then(user => {
            if (!user.favs.includes(recipe_id)) {
                user.favs.push(recipe_id)
            }
            return User.findByIdAndUpdate(loggedUser._id, { favs: user.favs })
        })
        .then(() => {
            res.redirect("/recipes")

        })
        .catch(err => next(err))
})

router.get("/:id/delete-favorite", isLoggedIn, (req, res, next) => {
    const { id: recipe_id } = req.params
    const loggedUser = req.session.currentUser
    User
        .findById(loggedUser._id)
        .then(user => {
            const index = user.favs.indexOf(recipe_id)
            user.favs.splice(index, 1)

            return User.findByIdAndUpdate(loggedUser._id, { favs: user.favs })
        })
        .then(() => {
            res.redirect("/recipes/favorites")
        })
        .catch(err => next(err))
})

router.get("/:id/edit", isLoggedIn, (req, res, next) => {
    const { id: recipe_id } = req.params

    Recipe
        .findById(recipe_id)
        .then(recipe => res.render("recipes/edit-recipe", { loggedUser: req.session.currentUser, recipe }))
        .catch(err => next(err))
})

router.post("/:id/edit", isLoggedIn, uploaderMiddleware.single('recipeImg'), (req, res, next) => {
    const { id: recipe_id } = req.params
    const { title, description } = req.body
    let ingredients

    if (typeof req.body.ingrName !== 'string') {
        ingredients = req.body.ingrName.map((eachIngr, idx) => {
            return ({ ingrName: eachIngr, ingrQuantity: req.body.ingrQuantity[idx], ingrMeasureUnit: req.body.ingrMeasureUnit[idx] })
        });
    } else {
        ingredients = { ingrName: req.body.ingrName, ingrQuantity: req.body.ingrQuantity, ingrMeasureUnit: req.body.ingrMeasureUnit }
    }

    const newRecipeData = { title, description, ingredients }

    if (req.file) {
        const { path: recipeImg } = req.file
        newRecipeData.recipeImg = recipeImg
    }

    Recipe
        .findByIdAndUpdate(recipe_id, newRecipeData)
        .then(() => res.redirect(`/recipes/${recipe_id}/details`))
        .catch(err => next())
})

router.get("/:id/delete", isLoggedIn, (req, res, next) => {
    const { id: recipe_id } = req.params
    Recipe
        .findByIdAndDelete(recipe_id)
        .then(() => res.redirect('/recipes'))
        .catch(err => next(err))
})

router.post('/:id/score', isLoggedIn, (req, res) => {

    const { id: recipe_id } = req.params
    const favorites = { score: req.body.score, userId: req.session.currentUser._id }

    Recipe
        .findByIdAndUpdate(recipe_id, { $push: { favorites: favorites } })
        .then(() => res.redirect(`/recipes/${recipe_id}/details`))
        .catch(err => console.log(err))
})

module.exports = router


//for each para obtener todas las puntuaciones, hacer media y trasferir el valor al file hbs {{average}??}