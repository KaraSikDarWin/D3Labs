// Функция для отрисовки самолета
function drawSmile(svg) {
    let airplane = svg.append("g")
        .style("stroke", "black")
        .style("stroke-width", 2)
        .style("fill", "gray");
    
    // Корпус самолета (основной прямоугольник)
    airplane.append("rect") 
        .attr("x", -50)
        .attr("y", -10)
        .attr("width", 100)
        .attr("height", 20)
        .style("fill", "silver");
    
    // Левое крыло
    airplane.append("polygon") 
        .attr("points", "-40,-10 -90,-30 -70,-10")
        .style("fill", "darkgray");
    
    // Правое крыло
    airplane.append("polygon") 
        .attr("points", "40,-10 90,-30 70,-10")
        .style("fill", "darkgray");
    
    // Хвост самолета
    airplane.append("polygon") 
        .attr("points", "-50,-10 -50,-40 -30,-10")
        .style("fill", "gray");
    
    // Нос самолета
    airplane.append("polygon") 
        .attr("points", "50,-10 70,0 50,10")
        .style("fill", "darkgray");
    
    // Дополнительные элементы
    // Иллюминаторы (три круга)
    airplane.append("circle")
        .attr("cx", -20)
        .attr("cy", 0)
        .attr("r", 5)
        .style("fill", "black");
    
    airplane.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 5)
        .style("fill", "black");
    
    airplane.append("circle")
        .attr("cx", 20)
        .attr("cy", 0)
        .attr("r", 5)
        .style("fill", "black");
    
    return airplane;  
}