dropdownListInit();


function dropdownListInit(){
    let scripts=document.getElementsByTagName("script");
    let base = scripts[scripts.length-1].parentNode;
    base.childNodes[0].prepend(base.childNodes[1].firstChild);
    ///////////////////base.childNodes[1].style.visibility="hidden";
    //console.log("dropdownListInit");
    //console.log(base);
    //console.log((base.childNodes));
    //console.log((base.childNodes[0]));
    //console.log((base.childNodes[1]));
    //console.log((base.childNodes[1].firstChild));
    base.onclick = function(event)
    {
        let dd = base.querySelector("[use_as=Dropdown_Dashboard]");
        dd.style.visibility = "visible";
        //dd.style.visibility = (dd.style.visibility=="hidden")?"visible":"hidden";
    }

    base.onmouseleave=function(event){
        if( base.querySelector("[use_as=Dropdown_Dashboard]").style.visibility=="visible")
        {
            let dd = base.querySelector("[use_as=Dropdown_Dashboard]");
            //////////////dd.style.visibility = "hidden";
        }
    }
}