function renderTable(data, tableId) {
    const tableBody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ""; 
    
    data.forEach(entry => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = entry.number;
        row.insertCell(1).textContent = entry.name;
        entry.results.forEach(time => row.insertCell(-1).textContent = time);
        row.insertCell(-1).textContent = entry.avg;
    });
}



