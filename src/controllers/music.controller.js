const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const {uploadFile} = require("../services/storage.service");
const jwt = require("jsonwebtoken");



async function createMusic(req, res) {
    
    const {title} = req.body;
    const file = req.file;

    const result = await uploadFile(file.buffer.toString("base64"));

    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: req.user.id
    });

    res.status(201).json({
        message: "Music created successfully",
        music: {
            id: music._id,
            uri: music.uri,
            title: music.title,
            artist: music.artist
        }
    });
    
}

async function createAlbum(req, res) {
    const {title, musics} = req.body;
        
    const album = await albumModel.create({
        title,
        musics: musics,
        artist: req.user.id
    });

    res.status(201).json({
        message: "Album created successfully",
        album: {
            id: album._id,
            title: album.title,
            musics: album.musics,
            artist: album.artist
        }
    });
}

async function getAllMusic(req, res) {
    const musics = await musicModel.find().populate("artist","username email");
    res.status(200).json({
        message: "All music retrieved successfully",
        musics: musics
    });
}

async function getAllAlbums(req, res) {
    const albums = await albumModel
    .find()
    .skip(0) //req.query.page ? (req.query.page - 1) * 10 : 0
    .limit(10)
    .select("title artist").populate("artist","username email");

    res.status(200).json({
        message: "All albums retrieved successfully",
        albums: albums
    });
}

async function getAlbumById(req, res) {
    const albumId = req.params.id;
    const album = await albumModel.findById(albumId).populate("artist","username email").populate("musics","title uri");
    res.status(200).json({
        message: "Album retrieved successfully",
        album: album
    });
}

module.exports = { createMusic, createAlbum, getAllMusic, getAllAlbums, getAlbumById };