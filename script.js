document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("playAreaTable");
    const tableHeader = document.getElementById("tableHeader");
    const tableBody = table.querySelector("tbody");

    // Load CSV data
    fetch("play_area.csv")
        .then(response => response.text())
        .then(data => {
            const rows = data.split("\n").map(row => row.split(","));
            const headers = rows[0]; // Extract headers
            const playAreas = rows.slice(1); // Remove header row

            // Populate headers
            headers.forEach(header => {
                const th = document.createElement("th");
                th.textContent = header;
                tableHeader.appendChild(th);
            });

            // Populate table rows
            playAreas.forEach(row => {
                const tr = document.createElement("tr");
                row.forEach(cell => {
                    const td = document.createElement("td");
                    td.textContent = cell;
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error("Error loading CSV:", error));
});
