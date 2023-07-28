const express = require("express");
const app = express();
const port = 8989;
const moment = require("moment");
const storage = require("node-sessionstorage");
const { client } = require("./lib/mongo");
require("dotenv").config();

const datetime = moment().format("DDMMYYYY");

async function store(data) {
  const db = client.db(process.env.DB_NAME);
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
      return "oke";
    }
  );
}

app.get("/tes", (req, res) => {
  store();
});

app.get("/", (req, res) => {
  let rq = req.query;
  if (rq.titik == undefined) {
    res.send("<h1>SCAN QRCODE!!</h1>");
  }
  console.log(storage.getItem(datetime) + "root");
  storage.setItem(datetime, rq.titik);
  res.sendFile(__dirname + "/index.html");
});

app.get("/petugas", (req, res) => {
  return console.log(req);
  let data = {
    Lokasi: storage.getItem(datetime),
    Tanggal: moment().format("DD:mm:yyyy hh:mm:ss"),
    Petugas: req.query.petugas,
  };
  store(data);
  res.sendFile("<h1> Berhasil! </h1>");
});

app.get("/clear", (req, res) => {
  storage.removeItem(datetime);
  console.log(storage.getItem(datetime) + " clear");
  res.send("<h1> Berhasil Di delete </h1>");
});

app.listen(port, () => {
  client.connect((err, res) => {
    if (err) {
      return console.log(err);
    }
    console.log("berhasil koneksi ke database");
  });
  console.log(`Example app listening on port ${port}`);
});
