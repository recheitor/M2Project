const ratingScore = (recipe) => {
    let rating = 0
    recipe.favorites.forEach((eachFavorite) => {
        rating += eachFavorite.score
    })
    return Math.round((rating / recipe.favorites.length) * 10) / 10
}

module.exports = {
    ratingScore
}
