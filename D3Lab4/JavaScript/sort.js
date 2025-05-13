let originalHTML;

function updateSelectOptions(select, excludeValues, currentValue) {
    const options = ["Нет", "Имя Фамилия", "Среднее время", "Лучшее время"];
    select.innerHTML = "";

    let foundCurrent = false;

    options.forEach((option, index) => {
        if (index === 0 || !excludeValues.includes(option)) {
            const opt = document.createElement("option");
            opt.value = index;
            opt.textContent = option;
            if (option === currentValue) {
                opt.selected = true;
                foundCurrent = true;
            }
            select.appendChild(opt);
        }
    });

    if (!foundCurrent) {
        select.value = "0";
    }
}

window.selChang = function() {  
    const firstValue = firstLevel.options[firstLevel.selectedIndex].text;
    const secondValue = secondLevel.options[secondLevel.selectedIndex]?.text || "Нет";
    const thirdValue = thirdLevel.options[thirdLevel.selectedIndex]?.text || "Нет";

    if (firstLevel.value !== "0") {
        secondLevel.disabled = false;
        updateSelectOptions(secondLevel, [firstValue], secondValue);
    } else {
        secondLevel.value = "0";
        secondLevel.disabled = true;
        thirdLevel.value = "0";
        thirdLevel.disabled = true;
        return;
    }

    if (secondLevel.value !== "0") {
        thirdLevel.disabled = false;
        updateSelectOptions(thirdLevel, [firstValue, secondValue], thirdValue);
    } else {
        thirdLevel.value = "0";
        thirdLevel.disabled = true;
    }
};

function sortTable() {
    const table = document.getElementById("list");
    const tbody = table.getElementsByTagName("tbody")[0];
    originalHTML = tbody.innerHTML;
    const rows = Array.from(tbody.rows);
    console.log(rows);
    const sortOptions = [
        {
            key: document.getElementById("firstLevel").value,
            desc: document.getElementById("fieldsFirstDesc").checked
        },
        {
            key: document.getElementById("secondLevel").value,
            desc: document.getElementById("fieldsSecondDesc").checked
        },
        {
            key: document.getElementById("thirdLevel").value,
            desc: document.getElementById("fieldsThirdDesc").checked
        }
    ];

    const activeSorts = sortOptions.filter(option => option.key !== "0");
    if (activeSorts.length === 0) return;

    function getValue(row, key) {
        switch (key) {
            case "1": return row.cells[1].textContent.toLowerCase(); // Имя Фамилия
            case "2": return parseFloat(row.cells[row.cells.length - 1].textContent); // Среднее время
            case "3": return Math.min(...Array.from(row.cells).slice(2, -1).map(cell => parseFloat(cell.textContent))); // Лучшее время
            default: return null;
        }
    }

    rows.sort((rowA, rowB) => {
        for (const { key, desc } of activeSorts) {
            const valueA = getValue(rowA, key);
            const valueB = getValue(rowB, key);
            let result;
            if (typeof valueA === "string") {
                result = valueA.localeCompare(valueB);
            } else {
                result = valueA - valueB;
            }
            if (desc) result = -result;
            if (result !== 0) return result;
        }
        return 0;
    });

    tbody.innerHTML = "";
    rows.forEach(row => tbody.appendChild(row));
}

function resetSorting() {
    document.getElementById("firstLevel").value = "0";
    document.getElementById("fieldsFirstDesc").checked = false;
    document.getElementById("secondLevel").value = "0";
    document.getElementById("fieldsSecondDesc").checked = false;
    document.getElementById("thirdLevel").value = "0";
    document.getElementById("fieldsThirdDesc").checked = false;
    document.getElementById("secondLevel").disabled = true;
    document.getElementById("thirdLevel").disabled = true;
    document.getElementById("list").getElementsByTagName("tbody")[0].innerHTML = originalHTML;
}