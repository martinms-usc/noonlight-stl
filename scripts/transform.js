const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const co = require('co');
const GeoJsonGeometriesLookup = require('geojson-geometries-lookup');
const csv2 = require('csv2');
const through2 = require('through2');

function Point(lat, long) {
  this.type = 'Point';
  this.coordinates = [long, lat].map(Number);
}

// read and modify multiPoly geoJson to poly
function multiPolygonToPolygonGeometry(data) {
  const features = [];
  let count = 0;
  data.features[0].geometry.coordinates.forEach((geoArray) => {
    const feature = {
      type: 'Feature',
      id: count,
      geometry: {
        type: 'Polygon',
        coordinates: geoArray
      }
    };
    features.push(feature);
    count++;
  });
  return features;
}


// read in geofence layer and reformat for filtering later
async function transformGeofenceLayer() {
  let geoData;
  try {
    // TODO: input the relative path to the geofence layer
    geoData = await readFileAsync(path.resolve(__dirname, '../src/data/geofence.json'), 'utf8');
    geoData = JSON.parse(geoData);
  } catch (error) {
    console.log(error);
  }
  // transform geofence layer to usable format for point lookups later
  const features = multiPolygonToPolygonGeometry(geoData);
  const geoJson = {
    type: 'FeatureCollection',
    features
  };
  try {
    await writeFileAsync(path.resolve(__dirname, '../src/data/geoFeatures.json'), JSON.stringify(geoJson));
    console.log('geofence transform to Polygon complete');
  } catch (error) {
    console.log(error);
  }
}


// add boolean field to each trip for if it is contained in geofence layer
async function updateCsvDataWithGeoFenceContains() {
  // read in geofence layer
  let geoJson;
  try {
    const data = await readFileAsync(path.resolve(__dirname, '../src/data/geoFeatures.json'), 'utf8');
    geoJson = JSON.parse(data);
  } catch (e) {
    console.log('ERROR with geoFeatures');
  }

  // TODO: input the relative path to the original noonlight trips in line 74
  const input = fs.createReadStream(path.resolve(__dirname, '../src/data/safetrekEvents.csv'));
  const output = fs.createWriteStream(path.resolve(__dirname, '../src/data/updatedSafetrekEvents.csv'));
  const glookup = new GeoJsonGeometriesLookup(geoJson);

  // stream trips and lookup each point in geofence layer
  input
    .pipe(csv2())
    .pipe(through2.obj((chunk, encoding, cb) => {
      const p = new Point(chunk[5], chunk[6]);
      const contains = glookup.hasContainers(p);
      const line = [...chunk, contains];
      const result = `${line.join(',')}\n`;
      console.log(result);
      cb(null, result);
    }))
    .pipe(output)
    .on('error', (e) => {
      console.log(e);
    })
    .on('finish', () => {
      console.log('__ done __');
    });
}

// if the geofence layer is already in 'Polygon' geometry format, no need to transofrm
// if geofence layer is in 'MultiPolygon' geometry format, transform then run update
co(function* main() {
  // transform geofence layer from Multi-Polygon to Polygon
  // make sure correct filename is used in line 42 (should point to geofence layer)
  yield transformGeofenceLayer();

  // add geo filtering ability to trips data
  // make sure correct filename is used in line 74 (should point to original Noonlight trips data)
  yield updateCsvDataWithGeoFenceContains();
});
