const express = require("express");
const authController = require("../controllers/auth.controller");
const {
    registerUserValidationRules,
    loginUserValidationRules
} = require("../middlewares/validation.middleware");

const router = express.Router();

router.post(
    "/register",
    registerUserValidationRules,
    authController.registerUser
);
router.post(
    "/login",
    loginUserValidationRules,
    authController.loginUser
);
router.post("/logout", authController.logoutUser);

module.exports = router;