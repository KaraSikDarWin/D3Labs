document.addEventListener("DOMContentLoaded", function() {
    showTable('build', buildings);
 })

 function plotGraph(form){
    let meth = document.getElementById("dotted").selected ? 1 : 0; 
    cleara();
    let option;
    
    if (form.year.checked){
        option = "Год";
    }else{
        option = "Страна";
    }

    if(form.max.checked && form.min.checked){
        drawGraph(buildings, "both", option,meth);
    }else if(form.max.checked){
        drawGraph(buildings, "max", option,meth);
    }else if(form.min.checked){
        drawGraph(buildings, "min", option,meth);
    }else{
        alert("Не выбрано по чему строить график");
    }
 }

 function cleara(){
    const svg = d3.select("svg");
    svg.selectAll('*').remove();
}