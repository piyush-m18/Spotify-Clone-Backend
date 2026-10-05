const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const {uploadFile} = require("../services/storage.service");
const jwt = require("jsonwebtoken");



async function createMusic(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if(decodedToken.role !== "artist") {
            return res.status(403).json({ message: "You do not have permission to create music" });
        }
        const {title} = req.body;
        const file = req.file;

        const result = await uploadFile(file.buffer.toString("base64"));

        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: decodedToken.id
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
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid" });
    }

    
}

async function createAlbum(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if(decodedToken.role !== "artist") {
            return res.status(403).json({ message: "You do not have permission to create album" });
        }

        const {title, musics} = req.body;
        
        const album = await albumModel.create({
            title,
            musics: musics,
            artist: decodedToken.id
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

    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid" });
    }
}

module.exports = { createMusic, createAlbum };