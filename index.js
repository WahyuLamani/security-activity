const express = require("express");
const app = express();
const port = 8989;
const moment = require("moment");
const storage = require("node-sessionstorage");
const { client } = require("./lib/mongo");
require("dotenv").config();

async function store(data) {
  const unique = moment().format("DDMMYYYY");
  //   const unique = "112232";
  client.connect((err, res) => {
    if (err) {
      console.log(err);
    }
    const db = client.db(process.env.DB_NAME);
    db.collection(unique).insertOne(
      {
        lokasi: "tes",
        petugas: "tes",
        tanggal: "test",
      },
      (error, result) => {
        if (error) {
          console.log(error);
        }
        console.log(result);
      }
    );
  });
}

app.get("/tes", (req, res) => {
  store();
});

app.get("/", (req, res) => {
  let rq = req.query;
  if (rq.titik == undefined) {
    res.send("<h1>SCAN QRCODE!!</h1>");
  }
  storage.setItem("loct", rq.titik);

  if (storage.getItem("loct") != rq.titik) {
    let data = {
      IP: req.socket.remoteAddress,
      Lokasi: rq.titik,
      Tanggal: moment().format("DD:mm:yyyy hh:mm:ss"),
    };
    res.sendFile(__dirname + "/index.html");
    // console.log(storage.setItem(rq.titik, data));
  }
});

app.post("/petugas", (req, res) => {
  let strg = storage.getItem(store());
  try {
    let store = storage.getItem(strg);
    let data = {
      Lokasi: store.Lokasi,
      Tanggal: store.Tanggal,
      Petugas: req.query.petugas,
    };
    console.log(data);
    // simpan data dibawah sini

    // end
    // storage.removeItem(strg);
    res.send("<h1> OK !! </h1>");
  } catch (err) {
    // storage.removeItem(strg)
    console.log(err);
    res.send("<h1>SCAN ULANG QRCODE, HANYA BOLEH SATU KALI SUBMIT!!</h1>");
  }
});

app.get("/clear", (req, res) => {
  let strg = storage.getItem(store());
  storage.removeItem(strg);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
