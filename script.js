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

            // Column indexes
            const columnIndexes = {};
            selectedColumns.forEach(col => {
                columnIndexes[col] = headers.indexOf(col);
            });

            // Store all data
            allData = playAreas.map(row => {
                const rowData = { data: row };
                selectedColumns.forEach(col => {
                    rowData[col] = row[columnIndexes[col]] ? row[columnIndexes[col]].trim().toLowerCase() : "";
                });
                return rowData;
            });

            // Create table headers dynamically
            selectedColumns.forEach(header => {
                const th = document.createElement("th");
                th.textContent = header.replace('_', ' '); // Format header
                tableHeader.appendChild(th);
            });

            // Function to render table with filters
            function renderTable() {
                tableBody.innerHTML = ""; // Clear table
                const ageFilterValue = ageFilter.value.toLowerCase();

                allData.forEach(rowObj => {
                    const row = rowObj.data;
                    let showRow = true;

                    if (ageFilterValue !== "all" && rowObj.age_group !== ageFilterValue) {
                        showRow = false;
                    }

                    // Apply feature filters
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
