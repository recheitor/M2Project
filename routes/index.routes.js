const express = require('express');
const router = express.Router();


router.get("/", (req, res, next) => {
  res.render("index")
})

router.get("/restaurants", (req, res, next) => {

  if (req.session.currentUser) {
    const loggedUser = req.session.currentUser
    res.render("restaurants", { loggedUser });
  } else {
    res.render("restaurants");
  }
});
module.exports = router;
