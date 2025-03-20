// Function to add markers to the map
function addMarkers(data) {
  data.forEach(function(row) {
    if (row.LATITUDE && row.LONGITUDE) {
      // Create a marker for each play area
      var marker = L.marker([row.LATITUDE, row.LONGITUDE])
        .bindPopup('<b>' + row.NAME + '</b><br>' + row.PARKADDRESS);
      markers.addLayer(marker);
    }
  });
  map.addLayer(markers);
}

// Function to filter data based on the checkbox
function filterData(data) {
  var filterSwings = document.getElementById('filterSwings').checked;
  if (filterSwings) {
    return data.filter(function(row) {
      return row.SWINGS_PRESCHOOL_SEATS && row.SWINGS_PRESCHOOL_SEATS.toLowerCase() === 'yes';
    });
  }
  return data;
}

// Load and process the CSV data
d3.csv('play_area.csv').then(function(data) {
  // Initial addition of markers
  addMarkers(filterData(data));

  // Add event listener to the checkbox
  document.getElementById('filterSwings').addEventListener('change', function() {
    // Clear existing markers
    markers.clearLayers();
    // Add filtered markers
    addMarkers(filterData(data));
  });
});
