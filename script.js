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
document.addEventListener('DOMContentLoaded', function() {
    // Path to your CSV file
    const csvFilePath = 'play_area.csv';

    // Function to create an HTML table from CSV data
    function createTable(data) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Create table headers
        const headers = data[0];
        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Create table rows
        data.slice(1).forEach(rowData => {
            const row = document.createElement('tr');
            rowData.forEach(cellData => {
                const td = document.createElement('td');
                td.textContent = cellData;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        return table;
    }

    // Fetch and parse the CSV file
    fetch(csvFilePath)
        .then(response => response.text())
        .then(csvText => {
            // Parse CSV text using PapaParse
            const parsedData = Papa.parse(csvText, { header: true });
            const data = parsedData.data;

            // Check if data is not empty
            if (data.length > 0) {
                // Extract headers
                const headers = Object.keys(data[0]);

                // Prepare data array for table creation
                const tableData = [headers];
                data.forEach(row => {
                    tableData.push(headers.map(header => row[header]));
                });

                // Create and append the table to the container
                const table = createTable(tableData);
                document.getElementById('csv-table-container').appendChild(table);
            } else {
                document.getElementById('csv-table-container').textContent = 'No data available in CSV.';
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing CSV file:', error);
            document.getElementById('csv-table-container').textContent = 'Error loading data.';
        });
});
