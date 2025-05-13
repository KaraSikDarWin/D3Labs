function deldel() {
    d3.selectAll("div").each(function() {
      const div = d3.select(this);
      const children = div.selectAll("*");
      if (!children.empty()) {
        div.select(":first-child").remove();
        const remChildren = div.selectAll("*");
        if (!remChildren.empty()) {
          div.select(":last-child").remove();
        }
      }
    });
    
  }