
var scripts = document.getElementsByTagName('script');
var base = scripts[scripts.length - 1].parentNode;
clear(base);

base.onclick = function (event) {

    let rows = null;
    let result = 0;
    let target = event.target;
    let panel = this.querySelector("[name=dropdown]");
    let rowDate = {};

    console.log(target.getAttribute("name"));
    console.log(this);


    switch (target.getAttribute("name")) { 
        case "base":
            break;
        case "target":

            panel.style.display = (panel.style.display == "none") ? "block" : "none";

            break;
        case "reset":
            clear(this);
            break;
        case "accept":
            inputUpdate(this);
            break;
        case "decButton":
            rowDate = getRowData(target.parentNode.parentNode.parentNode.parentNode);
            if (rowDate.current > rowDate.min) {
                target.parentNode.parentNode.parentNode.parentNode.setAttribute("data-current", rowDate.current - 1);
            }
            listUpdate(panel);
            break;
        case "currentCount":

            break;
        case "incButton":
            rowDate = getRowData(target.parentNode.parentNode.parentNode.parentNode);
            if (rowDate.current < rowDate.max) {
                target.parentNode.parentNode.parentNode.parentNode.setAttribute("data-current", rowDate.current + 1);
            }
            listUpdate(panel);
            break;
        default:
            console.log("default");
            break;
    }
}

function getRowData(row) {
    return data = {
        min: parseInt(row.getAttribute("data-min")),
        current: parseInt(row.getAttribute("data-current")),
        max: parseInt(row.getAttribute("data-max"))
    };
}

function listUpdate(panel) {
    let rows = panel.children;
    let result = 0;
    for (let i = 0; i < rows.length - 1; i++) {
        let data = getRowData(rows[i]);
        console.log(rows[i]);
        console.log(data);
        console.log((data.current < data.max));
        console.log((data.current > data.min));
        rows[i].querySelector("[name=currentCount]").innerHTML = data.current;
        rows[i].querySelector("[name=incButton]").style.visibility =
            (data.current < data.max) ? "visible" : "hidden";
        rows[i].querySelector("[name=decButton]").style.visibility =
            (data.current > data.min) ? "visible" : "hidden";
    }
}

function inputUpdate(base) {
    let mainInput = base.querySelector("[name=target]");
    let panel = base.querySelector("[name=dropdown]");
    let rows = panel.children;
    let count = 0;
    let result = 0;

    console.log(rows);
    mainInput.setAttribute("data-fullList", "");
    for (let i = 0; i < rows.length - 1; i++) {
        result += parseInt(rows[i].getAttribute("data-current"));
        mainInput.setAttribute("data-fullList", mainInput.getAttribute("data-fullList") +
            rows[i].querySelector("[name=title]").getAttribute("data-title") + ":" +
            rows[i].getAttribute("data-current") + ";");
    }

    base.querySelector("[name=target]").value = getCustomTitle({ result });

}

function clear(base) {
    console.log(base);
    let mainInput = base.querySelector("[name=target]");
    let panel = base.querySelector("[name=dropdown]");
    let rows = panel.children;
    mainInput.setAttribute("data-fullList", "nothing");
    mainInput.value = getCustomTitle({ result: "default" });
    for (let i = 0; i < rows.length - 1; i++) {
        rows[i].setAttribute("data-current", rows[i].getAttribute("data-min"));
    }
    listUpdate(panel);
}



//function accept(base) {

//}
function getCustomTitle(args) {
    if (args.result == "default") { return "Сколько гостей"; }
    if (args.result  == 0 || args.result > 4) {
        return args.result  + " Гостей";
    }
    else {
        return args.result  + " Гостя";
    }
}