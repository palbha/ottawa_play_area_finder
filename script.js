document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("playAreaTable");
    const tableHeader = document.getElementById("tableHeader");
    const tableBody = table.querySelector("tbody");

    // Load CSV data
    fetch("data/play_area.csv")
         .then(response => {
            if (!response.ok) throw new Error("CSV file not found!");
            return response.text();
        })
        .then(data => {
            const rows = data.split("\n").map(row => row.split(","));

            if (rows.length < 2) {
                errorMessage.style.display = "block";
                return;
            }

            const headers = rows[0]; // Get column names
            const playAreas = rows.slice(1); // Data rows

            // **SELECTED COLUMNS** - Change this array as per your needs
            const selectedColumns = ["PARK_ID","FACILITYID","NAME","CLASS","AGE_GROUP","CLIMBING","TIRE_SWING","SWINGS_PRESCHOOL_SEATS","SWINGS_BELT_SEATS","SLIDES","SEE_SAW","SAND_BOX","HOPSCOTCH","PLAYHOUSE","SPRING_TOY","OTHER","FENCING","ACCESSIBLE","OPEN","MODIFIED_DATE","CREATED_DATE","PARKNAME","PARKADDRESS"
]; 
            
            // Get the index of selected columns
            const selectedIndexes = selectedColumns.map(col => headers.indexOf(col)).filter(index => index !== -1);

            // Create table headers
            selectedColumns.forEach(header => {
                const th = document.createElement("th");
                th.textContent = header;
                tableHeader.appendChild(th);
            });

            // Add table rows
            playAreas.forEach(row => {
                const tr = document.createElement("tr");

                selectedIndexes.forEach(index => {
                    const td = document.createElement("td");
                    td.textContent = row[index] ? row[index].trim() : ""; // Avoid undefined values
                    tr.appendChild(td);
                });

                tableBody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Error loading CSV:", error);
            errorMessage.style.display = "block";
        });
});
