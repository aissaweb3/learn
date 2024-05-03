require('dotenv').config();
const express = require("express");
const app = express();

//--------------cors
  const cors = require('cors');
  app.use(cors());
//--------------cors


//--------------bodyParser
  const bodyParser = require("body-parser");
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
//--------------bodyParser




//--------------routes
  const main = require('./routers/main');
  app.use('/', main);
//--------------routes




app.listen(3001, () => {
  console.log("running on 3001");
});
