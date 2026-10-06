const { body, param, validationResult } = require("express-validator");

function validateRequest(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array()
        });
    }

    next();
}

const registerUserValidationRules = [
    body("username")
        .isString()
        .withMessage("Username must be a string")
        .bail()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be between 3 and 20 characters"),
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    body("password")
        .isString()
        .withMessage("Password must be a string")
        .bail()
        .isLength({ min: 6, max: 100 })
        .withMessage("Password must be between 6 and 100 characters"),
    body("role")
        .optional()
        .isIn(["user", "artist"])
        .withMessage("Role must be either user or artist"),
    validateRequest
];

const loginUserValidationRules = [
    body("username")
        .optional()
        .isString()
        .withMessage("Username must be a string")
        .bail()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be between 3 and 20 characters"),
    body("email")
        .optional()
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    body("password")
        .isString()
        .withMessage("Password must be a string")
        .bail()
        .notEmpty()
        .withMessage("Password is required"),
    body().custom((_, { req }) => {
        if (!req.body.username && !req.body.email) {
            throw new Error("Username or email is required");
        }

        return true;
    }),
    validateRequest
];

const createMusicValidationRules = [
    body("title")
        .isString()
        .withMessage("Title must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 100 })
        .withMessage("Title must be at most 100 characters"),
    body().custom((_, { req }) => {
        if (!req.file) {
            throw new Error("Music file is required");
        }

        return true;
    }),
    validateRequest
];

const createAlbumValidationRules = [
    body("title")
        .isString()
        .withMessage("Title must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 100 })
        .withMessage("Title must be at most 100 characters"),
    body("musics")
        .isArray()
        .withMessage("Musics must be an array"),
    body("musics.*")
        .isMongoId()
        .withMessage("Each music ID must be valid"),
    validateRequest
];

const getAlbumValidationRules = [
    param("id")
        .isMongoId()
        .withMessage("Album ID must be valid"),
    validateRequest
];

module.exports = {
    validateRequest,
    registerUserValidationRules,
    loginUserValidationRules,
    createMusicValidationRules,
    createAlbumValidationRules,
    getAlbumValidationRules
};