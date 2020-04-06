
var aux = aux_init();

function aux_init(){
    if(window.aux == void 0)
    {
        console.log("aux init");
        let aux = {
            i:1,
            //#region protos
            protos:{
                model:{

                    values:{}

                },
                inputElement : {
                    id: null,
                    getState: function(){console.error("aux.protos.inputElement.getState in aux_common.js, you need override this function before call ");},
                    setState: function(){console.error("aux.protos.inputElement.setState in aux_common.js, you need override this function before call ");},
                    getExempleString:function(){console.error("aux.protos.inputElement.getExempleString in aux_common.js, you need override this function before call ");},
                },
                list:{
                    id: null,
                    state:null,
                    heapLink:null,
                    childIds:[],
                }
            },
            //#endregion

            list:[{}],
            heap:[{}],

            addElement(arg){
                if(arg.prototype.isPrototypeOf(aux.protos.list))
                {
                    aux.list.push(arg);
                }
                else{console.error("aux.addElement element mast have aux.protos.list prototype")}
            },
        };

        console.log(aux);


        return aux;
    }
    return "nirabora-cho-to";

}

