const { DatabaseSync } = require('node:sqlite')
const database = new DatabaseSync('mem.sqlite', { "readOnly": true })
const headers = { "Content-type": "application/json" }


const handler = async function (event, context) {
  ///console.log("params ", params)
  //console.log("preparing statement")
  try {
    //console.log("querying..")
    const query = database.prepare(`select mem.postcode, member_count, geojson from mem inner join geo on mem.postcode = geo.postcode`)
    var ret = query.all()
    
    //console.log("query success: ")
    //we create one single geojson object with all the postcodes in it, so that it can be rendered directly on a map
    const fc = {
      "type": "FeatureCollection",
      "features": []
    }

    //this holds the largest combined total (based on the formula below)
    let totalmembers = 0 

    //
    //console.log("making properties")
    for (r of ret) {
      newgeo = JSON.parse(r.geojson)
      newgeo.properties.member_count = r.member_count
      fc.features.push(newgeo)
      totalmembers += r.member_count
    }

    console.log("totalmembers ", totalmembers)
    // make sure that all the total members are a number between 1-100
    for (feature of fc.features) {
      feature.properties.member_percentage = (feature.properties.member_count / totalmembers) * 100
    }

    return {
      headers,
      statusCode: 200,
      body: JSON.stringify(fc)
    }

  } catch (e) {
    console.log(e)
    return {
      headers,
      statusCode: 400,
      body: JSON.stringify({ "ok": false, "message": "Unable to execute supplied sql" })
    }

  }
  //console.log (ret)

}


module.exports = {
  handler: handler
}