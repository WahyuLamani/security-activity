const express = require('express')
const app = express()
const port = 8989
const moment = require('moment'); 
const storage = require('node-sessionstorage')


app.get('/', (req, res) => {
    let rq = req.query;
    if(storage.getItem(rq.titik) == "undefined") {
        let data = {
            IP : req.socket.remoteAddress,
            Lokasi : rq.titik,
            Tanggal : moment().format('DD:mm:yyyy hh:mm:ss')
        }
        console.log(storage.setItem(rq.titik,data));
        res.sendFile(__dirname + '/index.html')
    }else {
        res.send('UDAH SUBMIT')
    }
})

app.get('/petugas', (req,res) => {
    let a = storage.getItem
    try{
        
        let store = storage.getItem();
        let data = {
            IP : store.IP,
            Lokasi : store.Lokasi,
            Tanggal : store.Tanggal,
            Petugas : req.query.petugas
        }
        console.log(data);
        storage.removeItem(rq.titik)
        res.send("<h1> OK !! </h1>")
    } catch(err) {
        console.log(err);
        res.send("<h1>SCAN ULANG BARCODE, HANYA BOLEH SATU KALI SUBMIT!!</h1>")
    }
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})