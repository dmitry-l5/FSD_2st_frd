var aux_masked = {
    protos:{
        item:{
            id:null,
            value:"default value",
            set:()=>{console.log("aux_masked.item->set : set mast be override")},
        },
        view:{
            id:null,
            base:null,
            output:null,
            update:()=>{console.warn("aux_masked.view->update : update mast be override")},
        }
    },
    attr_name:{
        use_as:"aux-use_as",
    },
    attr_value:{
        use_as:{
            base:"Masked_Base",
            output:"Masked_Output",
        }
    },
    items:[],
    views:[],
    addItem(id){
        let newItem= Object.create(aux_masked.protos.item);
        newItem.id = id;
        this.items.push(newItem);
        return newItem;
    },
    addView(id){
        let newView = Object.create(aux_masked.protos.view);
        let base = document.getElementById(id);
        newView.id = id;
        newView.base = base;
        let qwerty = base.querySelector("["+
            aux_masked.attr_name.use_as +
            "="+
             aux_masked.attr_value.use_as.output+"]"
             );
        newView.output = qwerty;
        aux_masked.views.push(newView);
    },
    getItem(id){
        for(let i = 0; i < aux_masked.items.length; i++){
            if(aux_masked.items[i].id == id){
                return aux_masked.items[i];
            }
        }
        return null;
    },
    getView(id){
        for(let i = 0; i < aux_masked.views.length; i++){
            if(aux_masked.views[i].id == id){
                return aux_masked.views[i];
            }
        }
        return null;
    },
    setById(id, value){
        let tmp = aux_masked.getItem(id);
        aux_masked.set.apply(tmp,[value]);
        aux_masked.updateView(id);
    },
    set(value){
        console.warn("set");
        console.warn(value);
        this.value = value;
        //this.innerHTML = value;
    },
    updateView(id){
        let item = aux_masked.getItem(id);
        let view = aux_masked.getView(id);
        view.output.innerHTML = item.value;
    }
}