const express = require('express');
const router = express.Router();


router.get("/", (req, res, next) => {
  const loggedUser = req.session.currentUser
  let isPM = false
  if (req.session.currentUser) {
    if (req.session.currentUser.role === 'ADMIN') {
      isPM = true
      res.render("index", { loggedUser, isPM })
      return
    }
  }
  res.render("index", { loggedUser })
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
