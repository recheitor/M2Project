const ratingScore = (recipe) => {
    let rating = 0
    recipe.ratings.forEach((eachFavorite) => {
        rating += eachFavorite.score
    })
    return Math.round((rating / recipe.ratings.length) * 10) / 10
}
module.exports = {
    ratingScore
}
