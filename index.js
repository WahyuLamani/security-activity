const express = require('express')
const app = express()
const port = 8989
const moment = require('moment'); 
const storage = require('node-sessionstorage')


app.get('/', (req, res) => {
    let rq = req.query;
    storage.setItem('request', rq.titik);
    if(storage.getItem(rq.titik) == undefined) {
        let data = {
            IP : req.socket.remoteAddress,
            Lokasi : rq.titik,
            Tanggal : moment().format('DD:mm:yyyy hh:mm:ss')
        }
        res.sendFile(__dirname + '/index.html')
        console.log(storage.setItem(rq.titik,data));
    }else {
        res.send('<h1>SCAN ULANG BARCODE, HANYA BOLEH SATU KALI SUBMIT!!</h1>')
    }
})

app.get('/petugas', (req,res) => {
    let strg = storage.getItem('request');
    try{
        let store = storage.getItem(strg);
        let data = {
            IP : store.IP,
            Lokasi : store.Lokasi,
            Tanggal : store.Tanggal,
            Petugas : req.query.petugas
        }
        console.log(data);
        // simpan data dibawah sini

        // end
        storage.removeItem(strg)
        res.send("<h1> OK !! </h1>")
    } catch(err) {
        // storage.removeItem(strg)
        res.send("<h1>SCAN ULANG BARCODE, HANYA BOLEH SATU KALI SUBMIT!!</h1>")
    }
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})