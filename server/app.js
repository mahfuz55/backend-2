const express = require("express");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const PORT = 5000;
require("./model");
const File = mongoose.model("file");
const router = express.Router();

const storage = multer.diskStorage({
  destination: "./public/",
  filename: function(req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
}).single("myfile");

const obj = (req, res) => {
  console.log("nigga");
  upload(req, res, () => {
    console.log("Request ---", req.body);
    console.log("Request file ---", req.file); //Here you get file.
    const file = new File();
    file.meta_data = req.file;
    file.save().then(() => {
      res.send({ message: "uploaded successfully" });
    });
    /*Now do where ever you want to do*/
  });
};

router.post("/upload", obj);

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization"
  );

  next();
});
app.use(router);

app.get("/", (req, res) => {
  return res.send("<p>hello!</p>");
});

mongoose
  // type our own mongodb link here;
  .connect(
    "mongodb+srv://mahfuz:vbUWRvDgHzSxaYCw@cluster0.vue3q.mongodb.net/backend1?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    console.log("DB is connected");
  });

app.listen(PORT, () => {
  console.log(
    "\u{1F525}\u{1F680} app listen on port",
    PORT,
    "\u{1F525}\u{1F680}"
  );
});
