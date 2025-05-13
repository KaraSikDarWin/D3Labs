document.addEventListener("DOMContentLoaded", function() {
    renderTable(data, 'list');
   // drawGraph(data, "min", "name",1, 1);
})

function plotGraph(form){
   //let meth = document.getElementById("dotted").selected ? 1 : 0; 
   let meth = document.getElementById("dotted").selected ? 1 : document.getElementById("gisto").selected ? 0 : 2; 
    //let meth = 0;
    cleara();
    let option = "name";
    let modeAVG = form.avg.checked ? 1 : 0;

    

    if (form.max.checked && form.min.checked && form.avg.checked){
        drawGraph(data, "triple", option,meth, 0);
    }else if(form.max.checked && form.min.checked){
        drawGraph(data, "both", option,meth, modeAVG);
    }else if(form.max.checked){
        drawGraph(data, "max", option,meth, modeAVG);
    }else if(form.min.checked){
        drawGraph(data, "min", option,meth, modeAVG);
    }else if (modeAVG){
        drawGraph(data,"no",option,meth,modeAVG);
    }else{
        alert("Не выбрано по чему строить график");
    }
 }

 function cleara(){
    const svg = d3.select("svg");
    svg.selectAll('*').remove();
 }