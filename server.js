const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Render deployment support
const PORT = process.env.PORT || 3000;

// Static files
app.use(express.static("public"));
app.use("/uploads", express.static("public/uploads"));

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    if (file.mimetype.startsWith("video")) {
      cb(null, "public/uploads/videos");
    } else {
      cb(null, "public/uploads/photos");
    }

  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Upload API
app.post("/upload", upload.single("file"), (req, res) => {

  res.json({
    success: true,
    file: req.file.filename
  });

});

// Gallery API
app.get("/api/gallery", (req, res) => {

  const photoDir = "public/uploads/photos";

  fs.readdir(photoDir, (err, files) => {

    if (err) {
      return res.json([]);
    }

    const images = files.map(file => ({
      src: `/uploads/photos/${file}`
    }));

    res.json(images);
  });

});

// Videos API
app.get("/api/videos", (req, res) => {

  const videoDir = "public/uploads/videos";

  fs.readdir(videoDir, (err, files) => {

    if (err) {
      return res.json([]);
    }

    const videos = files.map(file => {

      const fileName = path.parse(file).name;

      return {
        src: `/uploads/videos/${file}`,
        poster: `/uploads/thumbnails/${fileName}.png`,
        title: fileName
      };
    });

    res.json(videos);

  });

});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});