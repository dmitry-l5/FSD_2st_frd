var scripts = document.getElementsByTagName("script");
var base = scripts[scripts.length-1].parentNode;


if(window.aux == void 0)
{
    console.error("Can't find window.aux. Try to include aux_common.js(from src/components/common/aux_common.js) the script and call the aux_init() function.");
}else{

    var hz = {
        __proto__:aux.protos.inputElement,
        model:{
            __proto__:aux.protos.model,
        },
        view:{},
        getState: function(){
            console.log("***********************************");
        },

        viewInit(){

        },
        modelInit(){

        },
    }
    hz.getState();
}