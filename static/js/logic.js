// Create the map with zoom uin north america similar to the one in the Challenge Example
let map = L.map('map').setView([40.7128, -94.0060], 4);

// Add layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18
}).addTo(map);

// Define the color scale
let colorScale = d3.scaleLinear()
  .domain([10,50,90])
  .range(['green','yellow','red']);

// Get earthquake data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    // Loop through the features in the data
    data.features.forEach(function(feature) {
      // Get coordinates and properties
      let coordinates = feature.geometry.coordinates;
      let magnitude = feature.properties.mag;
      let depth = coordinates[2];

      // Circle marker for each earthquake
      let circle = L.circle([coordinates[1], coordinates[0]], {
        radius: magnitude * 20000,
        color: colorScale(depth),
        fillOpacity: 0.2
      }).addTo(map);

      // Ppup with additional information
      circle.bindPopup(`<strong>Magnitude: ${magnitude}</strong><br>Depth: ${depth} km`);
    });

    // Legend
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(map) {
      let div = L.DomUtil.create('div', 'info legend');
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';

      let grades = [-10, 10, 30, 50, 70, 90];
      let labels = [];

      // Loop through the depth intervals
      for (let i = 0; i < grades.length; i++) {
        let depthRange = grades[i] + (grades[i + 1] ? '&ndash;' + (grades[i + 1] - 1) : '+');

        // Create a color box with the corresponding depth range
        let colorBox = '<span class="color-box" style="background:' + colorScale(grades[i]) + '"></span>';
        let depthLabel = '<span class="depth-label">' + depthRange + '</span>';

        // Combine the color box and depth label into a legend item
        let legendItem = '<div>' + colorBox + depthLabel + '</div>';

        div.innerHTML += legendItem;
      }

      return div;
    };

    legend.addTo(map);
  });



