if(window.aux_counter_items == void 0){
    var aux_counter_items={
        protos:{
            item:{
                min:0,
                current:0,
                max:0,
                get:null,
                set:null,
                reset:null,
            },
            view:{
                base: null,
                decButton:null,
                counter:null,
                incButton:null,
                input:null,
            }
        },
        items:[],
        views:[],
        attr_name: {
            use_as: "aux-use_as",
            minValue:"aux-minValue",
            maxValue:"aux-maxValue",
            caseArr:"aux-wordCase",
            selfVisibility:"aux-visibility",
        },
        attr_values: {
            use_as: {
                base: "CounterItem_Base",
                decButton:"CounterItem_decButton",
                counter:"CounterItem_currentCount",
                incButton:"CounterItem_incButton",
            },
        },
        events:{
            counterItem_change:"counter_change",
            counterItem_reset:"reset",
            counterItem_accept:"accept",
        },
        //#region model method
        addItem(id){
            if(aux_counter_items.getData(id)!==null){ console.error("addItem(" + id + ") : item already exist"); return item; }
            let tmp={};
            tmp.__proto__ = (aux_counter_items.protos.item);
            tmp.id = id;
            aux_counter_items.items.push(tmp);
            return tmp;
            },
        setData( current, min, max, caseword){
            //console.warn("setData");
            if(current){this.current=current;}
            if(min){this.min=min;}
            if(max){this.max=max;}
            if(caseword){this.caseWords=caseword;}
            document.dispatchEvent(
                new CustomEvent(aux_counter_items.events.counterItem_change,{detail:{data:this}})
                );
            },
        resetData(id){
            let data = aux_counter_items.getData(id);
            let view = aux_counter_items.getView(id);
            aux_counter_items.setData.apply(data,[data.min,data.min,data.max,data.caseWords]);
            if(view!==null){
                view.input.value = data.current;
            }
        },
        getData(id) {
                for(var i = 0; i<this.items.length; i++){
                    if(this.items[i].id == id ){
                        return this.items[i];
                    }
                }
                return null;
            },
        incValue(){
            console.log("incValue");
            
            if (this.current < this.max) {
                //console.log(this);
                aux_counter_items.setData.apply(this,[this.current + 1, this.min,this.max]);
            }
        },
        decValue(){
            console.log("decValue");
            
            if (this.current > this.min) {
                //console.log(this);
                aux_counter_items.setData.apply(this, [this.current - 1,this.min,this.max]);
            }
        },
        acceptData(id){
            //console.log("acceptData");
            let data = aux_counter_items.getData(id);
            let view = aux_counter_items.getView(id);
            view.input.value = data.current;
        },
        //#endregion model method
        //#region view method
        addView(id){
            if(aux_counter_items.getView(id)!==null){ console.error("getView(" + id + ") : view already exist"); return item; }
            let tmp={};
            tmp.__proto__=(aux_counter_items.protos.view);
            tmp.id = id;
            tmp.base = document.getElementById(id);
            tmp.decButton = tmp.base.querySelector("[" +aux_counter_items.attr_name.use_as + "=" +aux_counter_items.attr_values.use_as.decButton +"]");
            tmp.decButton.setAttribute(aux_counter_items.attr_name.selfVisibility, "visible" );
            tmp.counter = tmp.base.querySelector("[" +aux_counter_items.attr_name.use_as + "=" +aux_counter_items.attr_values.use_as.counter +"]");
            tmp.incButton = tmp.base.querySelector("[" +aux_counter_items.attr_name.use_as + "=" +aux_counter_items.attr_values.use_as.incButton +"]");
            tmp.incButton.setAttribute(aux_counter_items.attr_name.selfVisibility, "visible" );
            aux_counter_items.views.push(tmp);
            tmp.input = tmp.base.querySelector("input");

            tmp.base.onclick = aux_counter_items.click_handler;
            return tmp;
        },
        getView(id){
            //console.log("getView(id)");
            for(var i = 0; i<this.views.length; i++){
                if(this.views[i].id == id ){
                    return this.views[i];
                }
            }
            return null;
        },
        showView(data) {
            this.input.value = data.current;
            this.counter.innerHTML = data.current;
            this.decButton.style.visibility = (data.min<data.current)? "" : "hidden";
            this.incButton.style.visibility = (data.max>data.current)? "" : "hidden";
        },
        //#endregion view method
        parseItem(item){
            let result = {};
            result.__proto__ =  aux_counter_items.protos.item;
            result.min = parseInt(item.getAttribute(aux_counter_items.attr_name.minValue));
            result.caseArr = parseArr(item.getAttribute(aux_counter_items.attr_name.caseArr));
            result.max = parseInt(item.getAttribute(aux_counter_items.attr_name.maxValue));
            return result;
        },
        changeDataListener(event){
            //console.log("changeDataListener()"); 
            let data = event.detail.data;
            let view = aux_counter_items.getView(data.id);
            if(view !==null){
            aux_counter_items.showView.apply(view, [data]);
            view.base.dispatchEvent( new CustomEvent("xulio",{detail:{view:view, item:data}}));
            }
        },
        click_handler(event) {
            //console.log("this.click_handler");
            let targetUseAs = event.target.getAttribute(aux_counter_items.attr_name.use_as);
            let item = aux_counter_items.getData(this.id);
            let view = aux_counter_items.getView(this.id); 


            switch(targetUseAs){
                case aux_counter_items.attr_values.use_as.incButton:
                    aux_counter_items.incValue.apply(item);
                    //console.log("aux_counter_items.attr_values.use_as.incButton:");
                break;
                case  aux_counter_items.attr_values.use_as.decButton:
                    aux_counter_items.decValue.apply(item);
                    //console.log("aux_counter_items.attr_values.use_as.decButton:");
                break;
                default:
                    //console.log(" aux_counter_items click_handler default");
                    break;
            }
        },
    }
}
function parseArr(str){
    result = str.replace("]","").replace("[","").replace(/ /g,"").replace(/"/g,"").split(",");
    return result;
}
function CounterItemInit(){
    let scripts = document.getElementsByTagName("script");
    let base = scripts[scripts.length-1].parentNode;
    let newData = aux_counter_items.addItem(base.id);
    newData.current=newData.min;
    
    let hz1 = aux_counter_items.parseItem(base);
    hz1.current=hz1.min;
    aux_counter_items.setData.apply(newData,[hz1.current, hz1.min,  hz1.max, hz1.caseArr]);//.apply(newData, 3, 3 , 10, [one,two,three,four]);
    let newView = aux_counter_items.addView(base.id);
    document.addEventListener(aux_counter_items.events.counterItem_change, aux_counter_items.changeDataListener);
    base.addEventListener(aux_counter_items.events.counterItem_reset,
        (event)=>{aux_counter_items.resetData(event.target.id);}
        );
    base.addEventListener(aux_counter_items.events.counterItem_accept,
        (event)=>{aux_counter_items.acceptData(event.target.id);}
        );
    base.dispatchEvent(new Event(aux_counter_items.events.counterItem_reset));
}

CounterItemInit();