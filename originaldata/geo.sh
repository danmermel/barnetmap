#!/bin/bash

tar -xf gb-postcodes-v5.tar.bz2
cd gb-postcodes-v5/units
mv N11.geojson N12.geojson N20.geojson ../../
cd ../..
rm -rf gb-postcodes-v5
rm *.bz2
