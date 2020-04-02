var scripts = document.getElementsByTagName('script');
var base = scripts[scripts.length - 1].parentNode;

base.onclick=function(event)
{
    let rows = null;
    let result = 0;
    let target = event.target;
    target.blur();
    let panel = this.querySelector("[name=dropdown]");
    let rowDate = {};
    //console.log(target.getAttribute("name"));


    switch (target.getAttribute("name")) {
        //case "base":
        //    break;
        case "target":
            
            panel.style.display = (panel.style.display == "none") ? "block" : "none";
            target.innerHTML = "";
            break;
        case "clear":
            
            clear(this);
            break;
        case "accept":
            inputDraw(this);
            panel.style.display = (panel.style.display == "none") ? "block" : "none";
            break;
        case "decButton":
            if (parseInt(target.parentNode.getAttribute("data-current")) > parseInt(target.parentNode.getAttribute("data-min"))) {
                target.parentNode.setAttribute("data-current", parseInt(target.parentNode.getAttribute("data-current")) - 1);
            }
            listItemDraw(target.parentNode);
            break;
        case "currentCount":

            break;
        case "incButton":
            if (parseInt(target.parentNode.getAttribute("data-current")) < parseInt(target.parentNode.getAttribute("data-max"))) {
                target.parentNode.setAttribute("data-current", parseInt(target.parentNode.getAttribute("data-current")) + 1);
            }
            listItemDraw(target.parentNode);
            break;
        default:
            //console.log("default");
            break;
    }
}

function listItemDraw(item) {
    let min = parseInt(item.getAttribute("data-min"));
    let current = parseInt(item.getAttribute("data-current"));
    let max = parseInt(item.getAttribute("data-max"));

    item.querySelector("[name=currentCount]").innerHTML = current;
    item.querySelector("[name=incButton]").style.visibility = 
        (current < max) ? "visible" : "hidden";
    item.querySelector("[name=decButton]").style.visibility =
        (current > min) ? "visible" : "hidden";
}
function clear(base) {
    let target = base.querySelector("[name=target]");
    let items = base.querySelector("[name=dropdown]").querySelectorAll("[name=row]");
    base.setAttribute("data-query", base.getAttribute("data-queryTitle") + ":null");

    for (var i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.getAttribute("name") == "ACPanel") { continue; }
        item.setAttribute("data-current", item.getAttribute("data-min"));
        item.querySelector("[name=currentCount]").innerHTML = item.getAttribute("data-min");
    }
    
    target.setAttribute("value", target.getAttribute("data-defaultValue"));

}
function inputDraw(base) {
    let target = base.querySelector("[name=target]");
    let items = base.querySelector("[name=dropdown]").querySelectorAll("[name=row]");
    let query = "";
    let count = 0;

    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        if (item.getAttribute("name") == "ACPanel") { continue; }
        count += parseInt(item.getAttribute("data-current"));
    }
    let tmpTitle = base.getAttribute("data-info");
    let tmp_1 = tmpTitle.split(";");
    if (tmp_1.length >= 4) {
        if (count == 0) { baseTitle = tmp_1[0]; }
        else if (count == 1) { baseTitle = tmp_1[1]; }
        else if (count > 1 && count < 5) { baseTitle = tmp_1[2]; }
        else { baseTitle = tmp_1[3]; }
    } else { baseTitle = "errror"; console.log("set 'info' atribute into 'dropdownContainer' as:'samp_1;samp_2;samp_3;samp_4;'"); }

    target.setAttribute("value", count  + " " + baseTitle);

    query = base.getAttribute("data-queryTitle") + ":";


    let itemsValue = "";
    for (var item of items) {
        
        //if (item.getAttribute("[name=ACPanel]")) { continue; }

        count_2 = parseInt(item.getAttribute("data-current"));

        let tmp_IT = item.getAttribute("data-info");
        let tmp_2 = tmp_IT.split(";");
        if (tmp_2.length >= 4) {
            if (count_2 == 0) { continue; itemsValue = tmp_2[0]; }
            else if (count_2 == 1) { itemsValue = tmp_2[1]; }
            else if (count_2 > 1 && count_2 < 5) { itemsValue = tmp_2[2]; }
            else { itemsValue = tmp_2[3]; }
        } else { itemsValue = "errror"; console.log("set 'info' atribute into 'dropdownItem' as:'samp_1;samp_2;samp_3;samp_4;'"); }
        let lastValue = target.getAttribute("value");
        target.setAttribute("value", lastValue + "," + count_2 + " " + itemsValue);
        query += item.getAttribute("data-queryTitle") + "-" + count_2 + ";";
        
    }
    base.setAttribute("data-query", query);
}