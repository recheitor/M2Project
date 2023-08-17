const express = require('express');
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard');
const uploaderMiddleware = require('../middlewares/uploader')
const router = express.Router();
const User = require("../models/User.model")
const Recipe = require("../models/Recipe.model");
const edamamApi = require('../services/edamam-service');
const { ratingScore } = require('../utils/rating')

router.get("/", isLoggedIn, (req, res, next) => {

    if (req.query.sort) {

        const sortingQuery = `nutriScore.${req.query.sort}`

        Recipe
            .find()
            .sort({ [sortingQuery]: 1 })
            .populate('author')
            .then(recipes => res.render("recipes/recipes-list", { recipes }))
            .catch(err => next(err))

    } else {

        Recipe
            .find()
            .populate('author')
            .then(recipes => res.render("recipes/recipes-list", { recipes }))
            .catch(err => next(err))

    }

})

router.get("/:user_id/favorites", isLoggedIn, (req, res, next) => {
    const { user_id: user } = req.params
    const myFavoriteRecipes = true
    User
        .findById(user)
        .populate('favs')
        .then(favorites => {
            const favoritesId = favorites.favs.map(favs => favs.id)
            return Recipe.find({ _id: favoritesId }).populate('author')
        })
        .then((recipes) => {
            res.render("recipes/recipes-list", { recipes, myFavoriteRecipes })
        })
        .catch(err => next(err))

})

router.get("/create", isLoggedIn, (req, res) => {
    res.render("recipes/new-recipe")
})

router.post('/create', isLoggedIn, uploaderMiddleware.single('recipeImg'), (req, res, next) => {
    const loggedUser = req.session.currentUser
    const { title, description } = req.body
    let ingredients
    let requiredFields = true

    if (!req.body.title) {
        return res.render("recipes/new-recipe", { errMessage: 'Fill Title Field' })
    }

    if (typeof req.body.ingrName !== 'string' || typeof req.body.ingrQuantity !== 'string') {
        req.body.ingrName.forEach(eachiIngrName => {
            if (!eachiIngrName.length) {
                requiredFields = false
            }

        })
        req.body.ingrQuantity.forEach(eachiIngrQuantity => {
            if (!eachiIngrQuantity.length) {
                requiredFields = false
            }
            if (!/\d/.test(req.body.ingrQuantity)) {
                requiredFields = false
            }

        })

    } else if (!req.body.ingrName) {
        return res.render("recipes/new-recipe", { errMessage: 'Fill Ingredient field' })
    } else if (!req.body.ingrQuantity) {
        return res.render("recipes/new-recipe", { errMessage: 'Fill Quantity field' })
    } else if (!/\d/.test(req.body.ingrQuantity)) {
        return res.render("recipes/new-recipe", { errMessage: 'Quantity field should contain a number' })
    }
    if (!requiredFields) {
        return res.render("recipes/new-recipe", { errMessage: 'All required fields should be filled' })
    }

    if (typeof req.body.ingrName !== 'string') {
        ingredients = req.body.ingrName.map((eachIngr, idx) => {
            return ({ ingrName: eachIngr, ingrQuantity: req.body.ingrQuantity[idx], ingrMeasureUnit: req.body.ingrMeasureUnit[idx] })
        });
    } else {
        ingredients = { ingrName: req.body.ingrName, ingrQuantity: req.body.ingrQuantity, ingrMeasureUnit: req.body.ingrMeasureUnit }
    }

    const RecipeData = { title, ingredients, description, author: loggedUser._id }

    if (req.file) {
        const { path: recipeImg } = req.file
        RecipeData.recipeImg = recipeImg
    }

    edamamApi
        .getIngredient(req.body.ingrQuantity, req.body.ingrMeasureUnit, req.body.ingrName)
        .then(apiResponse => {
            RecipeData.nutriScore = {
                ingrKcal: Math.round(apiResponse.data.totalNutrients.ENERC_KCAL.quantity),
                ingrFat: Math.round(apiResponse.data.totalNutrients.FAT.quantity),
                ingrCarbs: Math.round(apiResponse.data.totalNutrients.CHOCDF.quantity),
                ingrProtein: Math.round(apiResponse.data.totalNutrients.PROCNT.quantity)
            }
            return Recipe.create(RecipeData)
        })
        .then(() => res.redirect('/recipes'))
        .catch(err => next())
})

router.get('/:user_id', isLoggedIn, (req, res, next) => {

    const { user_id: author } = req.params
    const myRecipes = true

    Recipe
        .find({ author })
        .populate('author')
        .then(recipes => res.render('recipes/recipes-list', { recipes, myRecipes }))
        .catch(err => next(err))
})

router.get("/:id/details", isLoggedIn, (req, res, next) => {
    const { id: recipe_id } = req.params
    let isVoted = false

    Recipe
        .findById(recipe_id)
        .populate('author')
        .then(recipe => {
            recipe.ratings.forEach((eachFavorite) => {
                if (eachFavorite.userId.includes(req.session.currentUser._id)) {
                    isVoted = true
                }
            })
            recipe.rating = ratingScore(recipe)

            let isFavorite = false
            req.session.currentUser.favs.forEach(eachFav => {
                if (eachFav === recipe_id) {
                    isFavorite = true
                }
            })

            if (req.session.currentUser._id === recipe.author[0].id || req.session.currentUser.role === 'ADMIN') {
                isOwner = true
                res.render("recipes/recipe-details", { recipe, isOwner, isVoted, isFavorite })
                return
            }
            res.render("recipes/recipe-details", { recipe, isVoted, isFavorite })
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
                req.session.currentUser.favs.push(recipe_id)
            }
            return User.findByIdAndUpdate(loggedUser._id, { favs: user.favs })
        })
        .then(() => {
            res.redirect(`/recipes/${recipe_id}/details`)
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
            const indexCurrent = req.session.currentUser.favs.indexOf(recipe_id)
            req.session.currentUser.favs.splice(indexCurrent, 1)

            return User.findByIdAndUpdate(loggedUser._id, { favs: user.favs })
        })
        .then(() => {
            res.redirect(`/recipes/${recipe_id}/details`)
        })
        .catch(err => next(err))
})

router.get("/:id/edit", isLoggedIn, (req, res, next) => {
    const { id: recipe_id } = req.params

    Recipe
        .findById(recipe_id)
        .then(recipe => res.render("recipes/edit-recipe", { recipe }))
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

    edamamApi
        .getIngredient(req.body.ingrQuantity, req.body.ingrMeasureUnit, req.body.ingrName)
        .then(apiResponse => {
            newRecipeData.nutriScore = {
                ingrKcal: Math.round(apiResponse.data.totalNutrients.ENERC_KCAL.quantity),
                ingrFat: Math.round(apiResponse.data.totalNutrients.FAT.quantity),
                ingrCarbs: Math.round(apiResponse.data.totalNutrients.CHOCDF.quantity),
                ingrProtein: Math.round(apiResponse.data.totalNutrients.PROCNT.quantity)
            }
            return Recipe.findByIdAndUpdate(recipe_id, newRecipeData)
        })
        .then(() => res.redirect(`/recipes/${recipe_id}/details`))
        .catch(err => next(err))
})

router.get("/:id/delete", isLoggedIn, (req, res, next) => {
    const { id: recipe_id } = req.params
    Recipe
        .findByIdAndDelete(recipe_id)
        .then(() => res.redirect('/recipes'))
        .catch(err => next(err))
})

router.post('/:id/score', isLoggedIn, (req, res, next) => {

    const { id: recipe_id } = req.params
    const { score } = req.body
    const { _id: userId } = req.session.currentUser

    const ratings = { score, userId }

    Recipe
        .findByIdAndUpdate(recipe_id, { $push: { ratings } })
        .then(() => res.redirect(`/recipes/${recipe_id}/details`))
        .catch(err => next(err))
})

module.exports = router


