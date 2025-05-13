function createArrGraph(data, key, mode, modeAVG) {
    // Группируем данные по ключу (например, по году)
    let groupObj = d3.group(data, d => d[key]);

    let arrGraph = [];
    for (let entry of groupObj) {
        let values = [];
        if (mode!="no"){
        let minMax = d3.extent(entry[1][0]['results']);
        
        if (mode === "max") {
            values.push({ value: minMax[1], type: "max" }); // Только максимальные
        }
        else if (mode === "min") {
            values.push({ value: minMax[0], type: "min" }); // Только минимальные
        }
        else if (mode === "both") { // Оба значения
            values.push({ value: minMax[1], type: "max" });
            values.push({ value: minMax[0], type: "min" });
            
        }else{
            values.push({ value: minMax[1], type: "max" });
            values.push({ value: entry[1][0]['avg'], type: "avg" });
            values.push({ value: minMax[0], type: "min" });
        }
    }
    if (modeAVG){
        values.push({ value: entry[1][0]['avg'], type: "avg" });
    }
        // Добавляем данные в массив для графика
        arrGraph.push({ labelX: entry[0], values: values });
    }
    //console.log(arrGraph);
    return arrGraph;
}

function drawGraph(data, mode, keyX, meth, modeAVG) {

    // Создаем массив для построения графика с учетом режима
    const arrGraph = createArrGraph(data, keyX, mode, modeAVG);
    //console.log(arrGraph);

    let svg = d3.select("svg");
    svg.selectAll('*').remove(); // Очищаем SVG перед рисованием

    // Создаем словарь с атрибутами области вывода графика
    let attr_area = {
        width: parseFloat(svg.style('width')),
        height: parseFloat(svg.style('height')),
        marginX: 50,
        marginY: 100
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
    let axisY = d3.axisLeft(scaleY).ticks(25);

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
    console.log(meth);
    //const pointSpacing = scaleX.bandwidth()/8; // Добавляем смещение для точек
    const pointSpacing = 0; // Добавляем смещение для точек

    // Преобразуем данные в удобный формат
    const pointsData = data.flatMap(d => d.values.map(v => ({
        labelX: d.labelX, 
        value: v.value, 
        type: v.type 
    })));

    if (meth==1){
        svg.selectAll(".bar")
    .data(pointsData)
    .enter()
    .append("circle")
    .attr("r", r)
    .attr("cx", d => {
        
        let baseX = scaleX(d.labelX) + scaleX.bandwidth() / 2;
        return d.type === "min" ? baseX - pointSpacing : baseX + pointSpacing;
    })
    .attr("cy", d => scaleY(d.value))
    .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
    .style("fill", d => colorColumn(d.type)) 
    
    }else if (meth==0){
    svg.selectAll(".bar")
    .data(pointsData)
    .enter()
    .append("rect")
    .attr("x", d => {
        if (mode == "both"){
    
        let baseX = scaleX(d.labelX) + scaleX.bandwidth() / 2.3;
        return d.type === "min" ? baseX - pointSpacing : baseX + pointSpacing;
    }else{
        return scaleX(d.labelX) + scaleX.bandwidth() / 2.3;
    }
    })
    .attr("y", d => scaleY(d.value)) 
    .attr("width", 5) 
    .attr("height", d => Math.abs(scaleY(d.value)- scaleY(min))) 
    .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
    .style("fill", d => colorColumn(d.type))
    
}else{
    const dataByType = {};
    pointsData.forEach(point => {
        if (!dataByType[point.type]) {
            dataByType[point.type] = [];
        }
        dataByType[point.type].push(point);
    });

    const lineGenerator = d3.line()
            .x(d => scaleX(d.labelX)) 
            .y(d => scaleY(d.value))
            

        Object.keys(dataByType).forEach(type => {
            let sortedData = [...dataByType[type]].sort((a, b) => scaleX(a.labelX) - scaleX(b.labelX));
            console.log(sortedData);
            svg.append("path")
                .datum(sortedData)
                .attr("d", lineGenerator)
                .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
                .style("stroke-width", "3")
                .style("stroke", colorColumn(type));
        });
}

}

function colorColumn(typeGraph){
    if (typeGraph == "avg"){
        return "yellow";
    }else if (typeGraph == "max"){
        return "red";
    }else if (typeGraph == "min"){
        return "blue";
    }
}

