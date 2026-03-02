#!/bin/bash

## The whole process is to fetch the geojson boundary data and extract the postcode units we want and delete the rest
## Then we have to run the process files that create the sqlite db and insert geo and voter data
## Then we have to mvoe the resulting sqlite db to the lambda folder to be zipped up for the lambda function


tar -xf gb-postcodes-v5.tar.bz2
cd gb-postcodes-v5/units
mv N11.geojson N12.geojson N20.geojson ../../
cd ../..
rm -rf gb-postcodes-v5
rm *.bz2

node processgvi.js
node processgeo.js
mv gvi.sqlite ../lambda
 
