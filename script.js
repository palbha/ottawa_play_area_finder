document.addEventListener("DOMContentLoaded", function () {
    const tableHeader = document.getElementById("tableHeader");
    const tableBody = document.querySelector("#playAreaTable tbody");
    const ageFilter = document.getElementById("ageFilter"); // Dropdown reference
    let allData = []; // Store full dataset

    fetch("https://raw.githubusercontent.com/palbha/ottawa_play_area_finder/main/play_area.csv")
        .then(response => {
            if (!response.ok) throw new Error("CSV file not found!");
            return response.text();
        })
        .then(data => {
            const rows = data.split("\n").map(row => row.split(","));
            if (rows.length < 2) return;

            const headers = rows[0]; // Get column names
            const playAreas = rows.slice(1); // Data rows

            // **SELECTED COLUMNS** - Ensure these match your CSV headers
             const selectedColumns = ['name', 'age_group', 'climbing', 'tire_swing',
       'swings_preschool_seats', 'swings_belt_seats', 'slides', 'see_saw',
       'sand_box', 'hopscotch', 'playhouse', 'spring_toy', 'other', 'fencing',
       'accessible', 'open', 'modified_date', 'created_date', 'parkname',
       'parkaddress']; 
            const selectedIndexes = selectedColumns.map(col => headers.indexOf(col)).filter(index => index !== -1);

            // Get Age Group column index
            const ageGroupIndex = headers.indexOf("AGE_GROUP");

            // Create table headers
            selectedColumns.forEach(header => {
                const th = document.createElement("th");
                th.textContent = header;
                tableHeader.appendChild(th);
            });

            // Store all data
            allData = playAreas.map(row => ({
                data: row,
                ageGroup: row[ageGroupIndex] ? row[ageGroupIndex].trim().toLowerCase() : ""
            }));

            // Function to render table
            function renderTable(filter = "all") {
                tableBody.innerHTML = ""; // Clear table
                allData.forEach(({ data, ageGroup }) => {
                    const displayAgeGroup = ageGroup.toLowerCase(); 
                    if (filter === "all" || displayAgeGroup === filter) {
                        const tr = document.createElement("tr");
                        selectedIndexes.forEach(index => {
                            const td = document.createElement("td");
                            td.textContent = data[index] ? data[index].trim() : "";
                            tr.appendChild(td);
                        });
                        tableBody.appendChild(tr);
                    }
                });
            }

            renderTable(); // Show all by default

            // Event listener for filter
            ageFilter.addEventListener("change", () => {
                renderTable(ageFilter.value.toLowerCase());
            });
        })
        .catch(error => console.error("Error loading CSV:", error));
});
