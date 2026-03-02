
const { DatabaseSync } = require('node:sqlite')
const database = new DatabaseSync('gvi.sqlite')
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


const FILENAMES = ["./N11.geojson", "./N12.geojson", "./N20.geojson"]

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




