const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8989;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Makassar");
const { client } = require("./lib/mongo");
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const datetime = moment().format("DDMMYYYY");
const db = client.db(process.env.DB_NAME);

const urlCheck = (titik) => {
  if (titik == process.env.LT1) {
    return "lt1";
  }
  if (titik == process.env.LT2) {
    return "lt2";
  }
  if (titik == process.env.LT3) {
    return "lt3";
  } else {
    return undefined;
  }
};

async function store(data) {
  db.collection(datetime).insertOne(
    {
      lokasi: data.Lokasi,
      petugas: data.Petugas,
      tanggal: data.Tanggal,
    },
    (error, result) => {
      if (error) {
        console.log(error);
      }
      console.log(result);
    }
  );
}

app.get("/", (req, res) => {
  if (urlCheck(req.query.titik) == undefined) {
    return res.send("<h1>SCAN QRCODE!!</h1>");
  }
  res.sendFile(__dirname + "/_index.html");
});

app.post("/petugas", (req, res) => {
  lokasi = urlCheck(req.body.url);
  if (lokasi == undefined) {
    return res.send("<h1>SCAN QRCODE!!</h1>");
  }

  let data = {
    Lokasi: lokasi,
    Tanggal: moment().format("DD:mm:yyyy hh:mm:ss"),
    Petugas: req.body.petugas,
  };
  store(data);
  return res.redirect("/");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
