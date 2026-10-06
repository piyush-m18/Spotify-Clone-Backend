const express = require("express");
const musicController = require("../controllers/music.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");
const {
    createMusicValidationRules,
    createAlbumValidationRules,
    getAlbumValidationRules
} = require("../middlewares/validation.middleware");

const upload = multer({ 
    storage: multer.memoryStorage() 
});

const router = express.Router();



router.post(
    "/upload",
    authMiddleware.authArtist,
    upload.single("music"),
    createMusicValidationRules,
    musicController.createMusic
);

router.post(
    "/album",
    authMiddleware.authArtist,
    createAlbumValidationRules,
    musicController.createAlbum
);

router.get("/", authMiddleware.authUser, musicController.getAllMusic);

router.get("/albums", authMiddleware.authUser, musicController.getAllAlbums); 

router.get(
    "/albums/:id",
    authMiddleware.authUser,
    getAlbumValidationRules,
    musicController.getAlbumById
);

module.exports = router;