require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require('morgan');
const { PORT = 3000 } = process.env;

const v1Router = require("./routes/v1/endPointV1");

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Selamat Datang di API Bank Purno",
    data: null,
  });
});

app.use("/api/v1", v1Router);

// 404 error handling
app.use((req, res, next) => {
  res.status(404).json({
      status: false,
      message: 'Not Found',
      data: null
  });
});

// 500 error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      data: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;