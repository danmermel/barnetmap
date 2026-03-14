#!/bin/bash

## The whole process is to fetch the geojson boundary data from here https://longair.net/blog/2021/08/23/open-data-gb-postcode-unit-boundaries/ and extract the postcode units we want and delete the rest
## Then we have to run the process files that create the sqlite db and insert geo and voter data
## Then we have to mvoe the resulting sqlite db to the lambda folder to be zipped up for the lambda function


tar -xf gb-postcodes-v5.tar.bz2

# move data to the gvi folder and process the data
cd gb-postcodes-v5/units
cp N11.geojson N12.geojson N20.geojson ../../gvi
cd ../../gvi
node processgvi.js
node processgeo.js
mv gvi.sqlite ../../lambda

#now move data to the mem folder and process

cd ../gb-postcodes-v5/districts
cp EN4.geojson  EN5.geojson HA8.geojson N10.geojson N11.geojson N12.geojson N2.geojson N20.geojson N3.geojson NW11.geojson NW2.geojson NW4.geojson NW7.geojson NW9.geojson ../../mem
cd ../../mem
node processmem.js
node processgeo.js

mv mem.sqlite ../../lambda

#now you could remove all the stuff if you want to
# cd ../../
# rm -rf gb-postcodes-v5
# rm *.bz2


