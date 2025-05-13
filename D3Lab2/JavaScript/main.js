const coord = document.getElementById("coord");
const coordan = document.getElementById("coordan");
const size = document.getElementById("size");
const sizean = document.getElementById("sizean");
const turn = document.getElementById("turn");
const turnan = document.getElementById("turnan");


document.addEventListener("DOMContentLoaded", function() {
    const width = 600;
    const height = 600;      
    const svg = d3.select("svg")
       .attr("width", width)
	   .attr("height", height) ;


       toggleElements(document.getElementById("an").checked);
       toggleElements1(document.getElementById("forgraph").checked);
       
       document.querySelectorAll('.toggle.befanim').forEach(el => {
        el.style.display = 'none';
      });
})

let draw = (dataForm) => {
	const svg = d3.select("svg")
    let pict = drawSmile(svg)
    pict.attr("transform", `translate(${dataForm.cx.value},
                                      ${dataForm.cy.value}), 
                            scale(${dataForm.rx.value},${dataForm.ry.value}),
                            rotate(${dataForm.rt.value})`);
}

function cleara(){
    const svg = d3.select("svg");
    svg.selectAll('*').remove();
}

function toggleElements(checked) {
        document.querySelectorAll('.toggle').forEach(el => {
            el.style.display = checked ? 'inline-block' : 'none';
          });

    if(document.getElementById("graph").checked){
        document.querySelectorAll('.toggle.befanim').forEach(el => {
            el.style.display = 'none';
        });
    }
    if (checked){
        document.getElementById("drw").value = "Анимировать";
        document.getElementById("drw").setAttribute("onclick","runAnimation(this.form)");
        
    }else{
       
        document.getElementById("drw").value= "Нарисовать";
        document.getElementById("drw").setAttribute("onclick", "draw(this.form)");
    }

    document.getElementById("inter").style.display = checked ? 'inline-block' : 'none';
  }

  function toggleElements1(checked) {
        document.querySelectorAll('.befanim').forEach(el => {
            el.style.display = checked ? 'none' : 'inline-block';
          });
        document.getElementById("forgraph").style.display = checked ? 'inline-block' : 'none';
        if(!document.getElementById("an").checked){
            document.querySelectorAll('.toggle.befanim').forEach(el => {
                el.style.display = 'none';
            });
        }

  }


  let runAnimation = (dataForm) => {
    let rt = {
        0 : d3.easeLinear,
        1 : d3.easeElastic,
        2 : d3.easeBounce
    };
    const svg = d3.select("svg");
    let pict = drawSmile(svg);
    if (!dataForm.graph.checked){
    pict.attr("transform", `translate(${dataForm.cx.value}, ${dataForm.cy.value}) 
          scale(${dataForm.rx.value}, ${dataForm.ry.value}) 
          rotate(${dataForm.rt.value})`)
      .transition()
      .duration(6000)
      .ease(rt[dataForm.inter.value])
      .attr("transform", `translate(${dataForm.cx1.value}, ${dataForm.cy1.value}) 
          scale(${dataForm.rx1.value}, ${dataForm.ry1.value}) 
          rotate(${dataForm.rt1.value})`);
    }else{
        let path = drawPath(dataForm.forgraph.value);	
		pict.transition()
        .ease(rt[dataForm.inter.value]) 
        .duration(dataForm.timean.value)
        .attr("transform", 
          `scale(${dataForm.rx1.value}, ${dataForm.ry1.value}) 
          rotate(${dataForm.rt1.value})`)
        .attrTween('transform', translateAlong(path.node(), dataForm))
        
    }
  }


  