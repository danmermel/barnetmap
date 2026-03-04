const { DatabaseSync } = require('node:sqlite')
const database = new DatabaseSync('gvi.sqlite', { "readOnly": true })
const headers = { "Content-type": "application/json" }


const handler = async function (event, context) {
  ///console.log("params ", params)
  //console.log("preparing statement")
  try {
    const query = database.prepare(`select gvi.postcode,  SUM(CASE WHEN green_voting_intention = 0 THEN 1 ELSE 0 END) AS gvi0, 
                                                          SUM(CASE WHEN green_voting_intention = 1 THEN 1 ELSE 0 END) AS gvi1, 
                                                          SUM(CASE WHEN green_voting_intention = 2 THEN 1 ELSE 0 END) AS gvi2, 
                                                          SUM(CASE WHEN green_voting_intention = 3 THEN 1 ELSE 0 END) AS gvi3, 
                                                          SUM(CASE WHEN green_voting_intention = 4 THEN 1 ELSE 0 END) AS gvi4, 
                                                          SUM(CASE WHEN green_voting_intention = 5 THEN 1 ELSE 0 END) AS gvi5, 
                                                          geojson from gvi join geo on geo.postcode = gvi.postcode group by 1`)
    var ret = query.all()

    //we create one single geojson object with all the postcodes in it, so that it can be rendered directly on a map
    const fc = {
      "type": "FeatureCollection",
      "features": []
    }

    let maxcombined = 0 

    //to every returned postcode geojson add the count of gvi as a property and then push it into the above geojson collection
    // not returning 0, 4, 5 in the properties
    for (r of ret) {
      newgeo = JSON.parse(r.geojson)
      newgeo.properties.gvi1 = r.gvi1
      newgeo.properties.gvi2 = r.gvi2
      newgeo.properties.gvi3 = r.gvi3
      newgeo.properties.combinedgvi = r.gvi1 * 10 + r.gvi2 * 5 //+ r.gvi3 
      maxcombined = newgeo.properties.combinedgvi > maxcombined ? newgeo.properties.combinedgvi : maxcombined 
      fc.features.push(newgeo)
    }
    // make sure that all the combined gvis are a number between 1-100
    for (feature of fc.features) {
      feature.combinedgvi = (feature.combinedgvi / maxcombined) * 100
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