import express from 'express'
import fs from 'fs'
const app = express()

import mysql from 'mysql2'
const connection = mysql.createConnection({
  host: "localhost",
  user: "u737868109_xtc_dum",
  password: "u737868109_XTCdum",
  database: "u737868109_xtc_dummy"
})

connection.connect(err => {
  if (err) throw err
  console.log("Connection to mysql database")
})

app.post('/', (req, res) => {
  const queryResult = []
  const jsonData = fs.readFileSync('../kelurahan.json', 'utf-8')
  let data = JSON.parse(jsonData)
  console.log(data)
  console.log(typeof data)

  data.map(kel => {
    connection.query('INSERT INTO ref_kelurahan (id, kelurahan, kecamatan_id, kd_pos) VALUES (?, ?, ?, ?)', [kel.id, kel.name, kel.district_id, null], (err, result) => {
      if (err) {
        queryResult.push({id: kel.id, r: false})
      } else {
        queryResult.push({id: kel.id, r: true})
      }
    })
  })
  res.json(queryResult)
})

app.get('/kelurahan/:id/:count', async (req, res) => {
  const id = req.params.id // id kabupaten
  const count = req.params.count
  for (let i = 1; i <= count; i++) {
    console.log(i, count)
    const res = await fetch(`https://ibnux.github.io/data-indonesia/kelurahan/${id}0${i}.json`)
    const data = await res.json()
    if (!data) {res.send('failed'); return}
    console.log(data)
    data.map(kel => {
      connection.query('INSERT INTO ref_kelurahan (id, kelurahan, kecamatan_id, kd_pos) VALUES (?, ?, ?, null)', [kel.id, kel.nama, `${id}0${count}`], (err) => {console.log('err :', err)})
    })
  }
  res.send('success')
})

app.listen(8080, () => {console.log('port 8080')})
