const musicModel = require("../models/music.model");
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

module.exports = { createMusic };