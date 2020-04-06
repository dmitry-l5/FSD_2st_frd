var scripts = document.getElementsByTagName("script");
var element = scripts[scripts.length-1].parentNode;
var cbox = element.querySelector("[use_as=checkbox]");
//console.log(cbox);




element.onclick=function(event){
    if(!(event.target.getAttribute("use_as")=="checkbox") ){
    cbox.checked  = cbox.checked?false:true;
    }
}



if(window.aux_heap == void 0)
{
    console.error("Can't find window.aux_heap. Try to include aux_common.js(from src/components/common/aux_common.js) the script and call the aux_init() function.");
    var aux_heap = [];
}



{
    let item ={
        id:element.getAttribute("id")?element.getAttribute("id"):console.error("need 'id' attribute in checkbox"),
        parentId:element.getAttribute("parentId")?element.getAttribute("parentId")
                :console.error("need 'parentId' attribute in checkbox"),
        element:element,
        data:{
            checkbox:element.getAttribute("aux_checked")==true?true:false,

        },
        view:{
            checkbox:element.querySelector("[use_as=checkbox]")?element.querySelector("[use_as=checkbox]")
                    :console.error("checkboxItem: Can't find checkbox with attribute '[use_as=checkbox]' "),
            
            setView(dataIn){
                this.checkbox.checked = dataIn.checkbox;
                console.log("=====this.checkbox=====");
                console.log(this.checkbox);
            }
        },
        getState:cbItemGet,
        cbItemGet,
        cbItemSet,
        toogle,
        

    }
    console.log("888888888888888888888888888888888888888888888888888888888888888888");
    //item.prototype.wer = cbItemGet;
    aux_heap.push(item);
    console.log(aux_heap);
    console.log(item);

}
function cbParseView(){
    console.log(" cbParseView +++++++++++++++++++++++++++ cbParseView");
    console.log(this);
    console.log(this);
}
function toogle()
{
    let g = this.view.checkbox==true?false:true;
    this.view.setView({checkbox:!this.view.checkbox  })
}
function cbItemGet(arg){

    console.log(arg);
    console.log("cbItemGet");
    console.log("cbItemGet");
    console.log("cbItemGet");
    console.log("cbItemGet");
    console.log(this);
    console.log(this.element);
}

function cbItemSet(){
    console.log(" +++++++++++++++++++++++++++ cbItemSet");

}