document.addEventListener("DOMContentLoaded", function () {
    const tableHeader = document.getElementById("tableHeader");
    const tableBody = document.querySelector("#playAreaTable tbody");
    const ageFilter = document.getElementById("ageFilter");

    // List of feature filters
    const featureFilters = {};
    const featureColumns = ['climbing', 'tire_swing', 'swings_preschool_seats', 'swings_belt_seats', 
                            'slides', 'see_saw', 'sand_box', 'hopscotch', 'playhouse', 'spring_toy', 
                            'other', 'fencing', 'accessible', 'open'];

    featureColumns.forEach(feature => {
        featureFilters[feature] = document.getElementById(`${feature}Filter`);
    });

    let allData = [];

    // Initialize Leaflet Map
    const map = L.map('map').setView([45.4215, -75.6972], 13); // Default to Ottawa coordinates

    // Add OpenStreetMap tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Function to geocode address using OpenStreetMap Nominatim API
    async function geocodeAddress(address) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon)
            };
        }
        return null; // No result found
    }

    fetch("https://raw.githubusercontent.com/palbha/ottawa_play_area_finder/main/play_area.csv")
        .then(response => {
            if (!response.ok) throw new Error("CSV file not found!");
            return response.text();
        })
        .then(data => {
            const rows = data.split("\n").map(row => row.split(","));
            if (rows.length < 2) return;

            const headers = rows[0];
            const playAreas = rows.slice(1);

            const selectedColumns = ['name', 'age_group', 'climbing', 'tire_swing', 'swings_preschool_seats', 
                                     'swings_belt_seats', 'slides', 'see_saw', 'sand_box', 'hopscotch', 
                                     'playhouse', 'spring_toy', 'other', 'fencing', 'accessible', 
                                     'open', 'modified_date', 'created_date', 'parkname', 'parkaddress'];

            const selectedIndexes = selectedColumns.map(col => headers.indexOf(col)).filter(index => index !== -1);

            const columnIndexes = {};
            selectedColumns.forEach(col => {
                columnIndexes[col] = headers.indexOf(col);
            });

            // Function to format column names (replace "_" with space and capitalize)
            function formatColumnName(columnName) {
                return columnName
                    .replace(/_/g, " ")  // Replace underscores with spaces
                    .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
            }

            // Store all data
            allData = playAreas.map(row => {
                const rowData = { data: row };
                selectedColumns.forEach(col => {
                    rowData[col] = row[columnIndexes[col]] ? row[columnIndexes[col]].trim().toLowerCase() : "";
                });
                return rowData;
            });

            // Create table headers dynamically with formatted column names
            selectedColumns.forEach(header => {
                const th = document.createElement("th");
                th.textContent = formatColumnName(header); // Format header names
                tableHeader.appendChild(th);
            });

            // Function to render table with filters
            function renderTable() {
                tableBody.innerHTML = ""; // Clear table
                const ageFilterValue = ageFilter.value.toLowerCase();

                // Clear map markers before re-rendering
                map.eachLayer(layer => {
                    if (layer instanceof L.Marker) {
                        map.removeLayer(layer);
                    }
                });

                allData.forEach(async rowObj => {
                    const row = rowObj.data;
                    let showRow = true;

                    // Apply age group filter
                    if (ageFilterValue !== "all" && rowObj.age_group !== ageFilterValue) {
                        showRow = false;
                    }

                    // Apply feature filters (Yes/Anything)
                    featureColumns.forEach(feature => {
                        const filterValue = featureFilters[feature].value.toLowerCase();
                        if (filterValue === "yes" && rowObj[feature] !== "yes") {
                            showRow = false;
                        }
                    });

                    if (showRow) {
                        const tr = document.createElement("tr");
                        selectedIndexes.forEach(index => {
                            const td = document.createElement("td");
                            td.textContent = row[index] ? row[index].trim() : "";
                            tr.appendChild(td);
                        });
                        tableBody.appendChild(tr);

                        // Geocode the park address and add marker to map
                        const address = row[columnIndexes["parkaddress"]];
                        const geoLocation = await geocodeAddress(address);
                        if (geoLocation) {
                            L.marker([geoLocation.lat, geoLocation.lon]).addTo(map)
                                .bindPopup(`<b>${row[columnIndexes["parkname"]]}</b><br>${address}`);
                        }
                    }
                });
            }

            renderTable(); // Initial render

            // Event Listeners for Filters
            ageFilter.addEventListener("change", renderTable);
            Object.values(featureFilters).forEach(filter => {
                filter.addEventListener("change", renderTable);
            });
        })
        .catch(error => console.error("Error loading CSV:", error));
});
