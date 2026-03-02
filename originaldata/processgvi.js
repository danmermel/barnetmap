//remove the db file if it exsits

const fs = require('fs')
try {
  fs.unlinkSync("./gvi.sqlite")
} catch (e) {
  //do nothing
}


// create the gvi database

const { DatabaseSync } = require('node:sqlite')
const database = new DatabaseSync('gvi.sqlite')


const types = {
  id: 'TEXT',
  postcode: 'TEXT',
  last_canvassed_date: 'TEXT',
  green_voting_intention: 'INTEGER',
  usual_party: 'TEXT'
}



// Execute SQL statements from strings.
database.exec(`
  CREATE TABLE IF NOT EXISTS gvi(
    id TEXT PRIMARY KEY,
    postcode TEXT,
    last_canvassed_date TEXT,
    green_voting_intention INTEGER,
    usual_party TEXT
  ) STRICT
`);

const str = fs.readFileSync('./data.csv', { encoding: 'utf8' })
const lines = str.split('\n')
// extract headings by splitting the first line by , - 
// ignoring blank column headings
headings = lines[0].split(',').map((s) => {
  return s.toLowerCase()
}).filter((s) => {
  if (s.length > 0) {
    return true
  }
}).map((s) => {
  return s.replace(/^"/, "").replace(/"$/, "")
})

// for each line in the file
for (i = 1; i < lines.length; i++) {
  //console.log('Processing line ', i)
  let l = lines[i]
  if (l.length === 0) {
    continue
  }

  // find double-quoted strings
  const matches = l.match(/"[^"]+"/g)
  // get rid of commas in double-quoted strings
  for (m in matches) {
    l = l.replace(matches[m], matches[m].replace(",", ""))
  }

  // split the line into columns
  const cols = l.split(',')
  if (cols.length != headings.length) {
    console.log("found shonky line... skipping", i)
    continue
  }
  // loop through each column
  const obj = {}
  for (h in headings) {
    // find the column heading
    const heading = headings[h]

    // process each column value to remove pound signs & quotes
    let v = cols[h]
    v = v.replace(/"/g, '')

    // parse as float or integer if numeric
    if (v.match(/^[0-9\.]+$/) && v.indexOf('.') > -1) {
      v = parseFloat(v)
    } else if (v.match(/^[0-9]+$/)) {
      v = parseInt(v)
    } else if (v === 'TRUE') {
      v = 1
    } else if (v === 'FALSE') {
      v = 0
    }
    obj[heading] = v


    // knowing the type of each column, make sure
    // we don't put a empty string in a numeric field
    const t = types[heading]
    if (t === 'INTEGER' || t === 'REAL') {
      if (typeof obj[heading] === 'string') {
        obj[heading] = 0
      }
    }
  }

  //special case for <NO RECORD> in the GVI column
  const GVI = 'barnet london borough council election (2026-may-07) most recent data - gvi'
  //console.log(obj[GVI])

  if (typeof obj[GVI] === 'string' ) {
    obj[GVI] = 0
    }

  // write a row the database
  const insert = database.prepare(`
    INSERT INTO gvi (
      id,
      postcode,
      last_canvassed_date,
      green_voting_intention,
      usual_party )
  VALUES (?,?,?,?,?)`);
  insert.run(obj["voter number"], obj["post code"].replace(/ /g,""), obj["most recent attempt - date"], obj[GVI], obj["barnet london borough council election (2026-may-07) most recent data - usual party"] )
}
