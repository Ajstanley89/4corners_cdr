const map = L.map('map').setView([36.5, -108.5], 7);

// Tile layer
const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Layer definitions

const facilityCoords = [36.8, -108.0];
const geostorageCoords = [36.65, -108.15];

const dacsLayer = L.layerGroup([
  L.marker(facilityCoords).bindPopup("Hypothetical DAC Facility"),
  L.polyline([facilityCoords, geostorageCoords], { color: 'red' }).bindPopup("Hypothetical CO₂ Pipeline"),
  L.circle([36.6, -108.1], { radius: 2000, color: 'blue' }).bindPopup("Water Source"),
  L.circle(geostorageCoords, { radius: 3000, color: 'green' }).bindPopup("Hypothertical CO<sub>2</sub> Injection Point.<br>Why does ChatGPT want to inject CO<sub>2</sub> here?")
]);

const shiprockCoords = [36.7, -108.7];
const communityLayer = L.layerGroup([
  L.marker([36.4, -108.3]).bindPopup("Community Meeting: Cortez"),
  L.marker(shiprockCoords).bindPopup("Community Meeting: Shiprock")
]);

const tribalGeoJSON = new L.GeoJSON.AJAX('https://data.source.coop/cboettig/us-boundaries/tribal-lands.geojson', function(data) {
  L.geoJSON(data, {
    onEachFeature: onEachFeature
  }).addTo(map)
  console.log(data)
})

// tribalGeoJSON.addTo(map)
// console.log('tribes', tribalGeoJSON)

// const tribalLayer = L.geoJSON(tribalGeoJSON, {
//   style: { color: '#9944cc', weight: 2 }
// });

// fetch('https://native-land.ca/api/index.php?maps=territories')
//   .then(res => res.json())
//   .then(data => tribalLayer.addData(data));

const dataOverlay = L.layerGroup([
  L.circleMarker([36.5, -108.5], { color: 'orange' }).bindPopup("PM2.5 Concentration"),
  L.circleMarker([36.3, -108.6], { color: 'orange' }).bindPopup("Land Use: Agricultural")
]);

// Description updater
const descriptions = {
  dacs: "<strong>DACS Project:</strong> This view highlights the CO₂ removal facility, underground storage area, pipeline route, and water source supporting the project.",
  community: "<strong>Community Meetings:</strong> Locations where community engagement sessions have been hosted to inform and involve the public.",
  tribal: "<strong>Tribal Boundaries:</strong> Outlines of Native American reservations in proximity to the DACS infrastructure.",
  data: "<strong>Data Overlay:</strong> Environmental and land use data relevant to assessing project impact and siting decisions."
};

function showLayer(name) {
  map.invalidateSize()
  // Remove all layers except base
  map.eachLayer(layer => {
    if (layer !== baseLayer) map.removeLayer(layer);
  });
  baseLayer.addTo(map); // re-add tile layer

  // Add selected layer
  switch (name) {
    case 'dacs':
      dacsLayer.addTo(map);
      tribalGeoJSON.addTo(map)
      map.setView(facilityCoords)
      break;
    case 'community':
      communityLayer.addTo(map); 
      map.setView(shiprockCoords)
      break;
    case 'tribal':
      tribalGeoJSON.addTo(map)
      // tribalLayer.addTo(map);
      break;
    case 'data':
      dataOverlay.addTo(map); break;
  }

  // Update description
  document.getElementById('map-description').innerHTML = `<p>${descriptions[name]}</p>`;
}

function onEachFeature(feature, layer) {
  console.log(feature, layer)
  if (feature.properties && feature.properties.LARNAME){
    layer.bindPopup(feature.properties.LARNAME)
  }
}
// Initial load
showLayer('dacs');

