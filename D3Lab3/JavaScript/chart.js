function createArrGraph(data, key, mode) {
    // Группируем данные по ключу (например, по году)
    let groupObj = d3.group(data, d => d[key]);
    
    let arrGraph = [];
    for (let entry of groupObj) {
        // Находим минимальную и максимальную высоту в группе
        let minMax = d3.extent(entry[1].map(d => d['Высота']));
        
        // Логика выбора данных в зависимости от режима
        let values = [];
        if (mode === "max") {
            values.push({ value: minMax[1], type: "max" }); // Только максимальные
        }
        else if (mode === "min") {
            values.push({ value: minMax[0], type: "min" }); // Только минимальные
        }
        else if (mode === "both") { // Оба значения
            values.push({ value: minMax[0], type: "min" });
            values.push({ value: minMax[1], type: "max" });
        }

        // Добавляем данные в массив для графика
        arrGraph.push({ labelX: entry[0], values: values });
    }
    
    return arrGraph;
}

function drawGraph(data, mode, keyX, meth) {

    // Создаем массив для построения графика с учетом режима
    const arrGraph = sortArrayByKey(createArrGraph(data, keyX, mode), "labelX");
    console.log(arrGraph);

    let svg = d3.select("svg");
    svg.selectAll('*').remove(); // Очищаем SVG перед рисованием

    // Создаем словарь с атрибутами области вывода графика
    let attr_area = {
        width: parseFloat(svg.style('width')),
        height: parseFloat(svg.style('height')),
        marginX: 50,
        marginY: 50
    };

    // Создаем шкалы преобразования и оси
    const [scX, scY, min] = createAxis(svg, arrGraph, attr_area, mode);

    // Рисуем график
    createChart(svg, arrGraph, scX, scY, attr_area, mode, meth, min);
}

function createAxis(svg, data, attr_area, mode) {
    // Собираем все значения, которые будем отображать
    let allValues = data.flatMap(d => d.values.map(v => v.value));

    // Находим глобальные минимальное и максимальное значение
    const [min, max] = d3.extent(allValues);

    // Создаем шкалы преобразования
    let scaleX = d3.scaleBand()
                   .domain(data.map(d => d.labelX))
                   .range([0, attr_area.width - 2 * attr_area.marginX]);

    let scaleY = d3.scaleLinear()
                   .domain([min * 0.85, max * 1.1])
                   .range([attr_area.height - 2 * attr_area.marginY, 0]);

    // Создаем оси
    let axisX = d3.axisBottom(scaleX);
    let axisY = d3.axisLeft(scaleY);

    // Отрисовка осей
    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.height - attr_area.marginY})`)
        .call(axisX)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .call(axisY);
    
    return [scaleX, scaleY, min * 0.85];
}

function createChart(svg, data, scaleX, scaleY, attr_area, mode, meth, min) {
    const r = 4;
    const pointSpacing = scaleX.bandwidth()/8; // Добавляем смещение для точек

    // Преобразуем данные в удобный формат
    const pointsData = data.flatMap(d => d.values.map(v => ({
        labelX: d.labelX, 
        value: v.value, 
        type: v.type 
    })));

    if (meth){
        svg.selectAll(".bar")
    .data(pointsData)
    .enter()
    .append("circle")
    .attr("r", r)
    .attr("cx", d => {
        // Добавляем смещение в зависимости от типа точки
        let baseX = scaleX(d.labelX) + scaleX.bandwidth() / 2;
        return d.type === "min" ? baseX - pointSpacing : baseX + pointSpacing;
    })
    .attr("cy", d => scaleY(d.value))
    .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
    .style("fill", d => d.type === "min" ? "blue" : "red") // Цвет в зависимости от типа
    
    }else{
    svg.selectAll(".bar")
    .data(pointsData)
    .enter()
    .append("rect")
    .attr("x", d => {
        if (mode == "both"){
        // Определяем положение по оси X
        let baseX = scaleX(d.labelX) + scaleX.bandwidth() / 2.5;
        return d.type === "min" ? baseX - pointSpacing : baseX + pointSpacing;
    }else{
        return scaleX(d.labelX) + scaleX.bandwidth() / 2.5;
    }
    })
    .attr("y", d => scaleY(d.value)) 
    .attr("width", 5) 
    .attr("height", d => Math.abs(scaleY(d.value)-scaleY(min - 1))) // Высота (можно адаптировать)
    .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
    .style("fill", d => d.type === "min" ? "blue" : "red") // Цвет в зависимости от типа
    
}

}

function sortArrayByKey(data, key) {
    return data.sort((a, b) => Number(a[key]) - Number(b[key]));
}
