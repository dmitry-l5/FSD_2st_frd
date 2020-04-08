dropdownListInit();


function dropdownListInit(){
    let scripts=document.getElementsByTagName("script");
    let base = scripts[scripts.length-1].parentNode;

    base.childNodes[0].prepend(base.childNodes[1].firstChild);
    base.childNodes[1].style.visibility="hidden";

    base.onclick = function(event)
    {
        let dd = base.querySelector("[use_as=DdList_Dashboard]");
        console.log(dd);
        dd.style.visibility = (dd.style.visibility=="hidden")?"visible":"hidden";
    }

    base.onmouseleave=function(){
        console.log("OnBlur");
        let dd = base.querySelector("[use_as=DdList_Dashboard]");
        dd.style.visibility = "hidden";
    }


}