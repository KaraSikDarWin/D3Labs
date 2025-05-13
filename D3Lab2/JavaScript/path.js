function createPathG() {
    const svg = d3.select("svg");
    const width = +svg.attr("width"); // Преобразуем в число
    const height = +svg.attr("height");

    let data = [];
    const padding = 100;
    const step = 5; // Шаг движения

    // Начальная точка (справа внизу)
    let posX = width - padding;
    let posY = height - padding;

    // Двигаемся влево
    while (posX > padding) {
        data.push({ x: posX, y: posY });
        posX -= step;
    }

    // Двигаемся вверх и вправо (диагональ)
    while (posX < width - padding && posY > padding) {
        data.push({ x: posX, y: posY });
        posX += step;
        posY -= step;
    }

    // Двигаемся влево
    while (posX > padding) {
        data.push({ x: posX, y: posY });
        posX -= step;
    }

    return data;
}

// создаем массив точек, расположенных по кругу
function createPathCircle() {
    const svg = d3.select("svg")
	const width = svg.attr("width")
	const height = svg.attr("height")
    let data = [];
    // используем параметрическую форму описания круга
    // центр расположен в центре svg-элемента, а радиус равен трети высоты/ширины
    for (let t = Math.PI ; t <= Math.PI * 2; t += 0.1) {
        data.push(
            {x: width / 2 + width / 3 * Math.sin(t),
             y: height / 2 + height / 3 * Math.cos(t)}
        );
    }
    return data
}

let drawPath =(typePath) => {
	// создаем массив точек
	const dataPoints = (typePath == 0)? createPathG() : createPathCircle();

	const line = d3.line()
		.x((d) => d.x)
		.y((d) => d.y);
    const svg = d3.select("svg")
	// создаем путь на основе массива точек	  
	const path = svg.append('path')
		.attr('d', line(dataPoints))
		.attr('stroke', 'none')
		.attr('fill', 'none');
		
	return path;	
}

function translateAlong(path, dataForm) {
    const length = path.getTotalLength();
    const { scaleXStart, scaleXEnd, scaleYStart, scaleYEnd, rotateStart, rotateEnd } = dataForm;
    
    return function() {
        return function(t) {
            const { x, y } = path.getPointAtLength(t * length);
            
           
            const scaleX = dataForm.rx.value * (1 - t) + dataForm.rx1.value * t;
            const scaleY = dataForm.ry.value * (1 - t) + dataForm.ry1.value * t;
            //const rotate = Math.abs(dataForm.rt.value + (dataForm.rt1.value - dataForm.rt.value) * t);
            const rotate = dataForm.rt.value * (1 - t) + dataForm.rt1.value * t;
            
            return `translate(${x},${y}) scale(${scaleX},${scaleY}) rotate(${rotate})`;
        };
    };
}