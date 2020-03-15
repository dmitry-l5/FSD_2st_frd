var scripts = document.getElementsByTagName('script');
var base = scripts[scripts.length - 1].parentNode;

base.onclick=function(event)
{
    let rows = null;
    let result = 0;
    let target = event.target;
    let panel = this.querySelector("[name=dropdown]");
    let rowDate = {};
    console.log(target.getAttribute("name"));


    switch (target.getAttribute("name")) {
        //case "base":
        //    break;
        case "target":
            panel.style.display = (panel.style.display == "none") ? "block" : "none";
            break;
        //case "reset":
        //    clear(this);
        //    break;
        //case "accept":
        //    inputUpdate(this);
        //    break;
        //case "decButton":
        //    rowDate = getRowData(target.parentNode.parentNode.parentNode.parentNode);
        //    if (rowDate.current > rowDate.min) {
        //        target.parentNode.parentNode.parentNode.parentNode.setAttribute("data-current", rowDate.current - 1);
        //    }
        //    listUpdate(panel);
        //    break;
        //case "currentCount":

        //    break;
        //case "incButton":
        //    rowDate = getRowData(target.parentNode.parentNode.parentNode.parentNode);
        //    if (rowDate.current < rowDate.max) {
        //        target.parentNode.parentNode.parentNode.parentNode.setAttribute("data-current", rowDate.current + 1);
        //    }
        //    listUpdate(panel);
        //    break;
        default:
            console.log("default");
            break;
    }
}