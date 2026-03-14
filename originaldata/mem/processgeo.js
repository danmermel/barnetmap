
const { DatabaseSync } = require('node:sqlite')
const database = new DatabaseSync('mem.sqlite')
const fs = require("fs");
const { features } = require('process');

//create table
// 
database.exec(`
  CREATE TABLE IF NOT EXISTS geo(
    postcode TEXT PRIMARY KEY,
    geojson TEXT
  ) STRICT
`);


const FILENAMES = ['./EN4.geojson',
'./EN5.geojson',
'./HA8.geojson',
'./N10.geojson',
'./N11.geojson',
'./N12.geojson',
'./N2.geojson',
'./N20.geojson',
'./N3.geojson',
'./NW11.geojson',
'./NW2.geojson',
'./NW4.geojson',
'./NW7.geojson',
'./NW9.geojson',]

for (file of FILENAMES) {

  let text = fs.readFileSync(file)
  let json = JSON.parse(text)
  for (feature of json.features) {
    postcode = feature.properties.mapit_code
    // write a row the database
    console.log("inserting ", postcode)
    const insert = database.prepare(`
    INSERT INTO geo (
      postcode,
      geojson )
       VALUES (?,?)`);
    insert.run(postcode, JSON.stringify(feature))

  }

}




