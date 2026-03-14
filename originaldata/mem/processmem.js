//remove the db file if it exsits

const fs = require('fs')
try {
  fs.unlinkSync("./mem.sqlite")
} catch (e) {
  //do nothing
}


// create the mem database

const { DatabaseSync } = require('node:sqlite')
const database = new DatabaseSync('mem.sqlite')


const { features } = require('process');

//create table
// 
database.exec(`
  CREATE TABLE IF NOT EXISTS mem(
    postcode TEXT PRIMARY KEY,
    member_count INTEGER
  ) STRICT
`);


const types = {
  postcode: 'TEXT',
  member_count: 'TEXT'
}


//load file
const str = fs.readFileSync('./barnetmembers.csv', { encoding: 'utf8' })
const lines = str.split('\n')
//remove the first line because those are the headings
lines.shift()


//in this file the last element is the postcode, so in theory I just need to get the last element of each line array
let obj = {}

for (line of lines) {
  const elements = line.split(",")
  const pcs = elements[elements.length - 1].split(" ") //just need the first part of the postcode
  if (pcs.length > 1) {
    //try to avoid blanks
    const pc = pcs[0]
    //console.log(pc)
    if (obj[pc]) {
      obj[pc]++
    } else {
      obj[pc] = 1
    }
  } else {
    console.log("blank", elements )
  }
}

//now iterate through the object and add to the table
for (let key in obj) {
  // write a row the database
  //console.log("inserting", obj)
  const insert = database.prepare(`
    INSERT INTO mem (
      postcode,
      member_count )
  VALUES (?,?)`);
  try {
    insert.run(key, obj[key])
  } catch (e) {
    console.log("error inserting..", e)
    console.log("tried  ", key, obj[key])

  }
}