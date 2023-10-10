require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { PORT = 3000 } = process.env;

const v1Router = require("./routes/v1/endPointV1") 

const app = express();
app.use(bodyParser.json());

app.use('/api/v1', v1Router);



app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
