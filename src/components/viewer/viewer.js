if (window.utility == void 0) {
    var utility = {
        isNumber(value) {
            return !isNaN(value) && isFinite(value);
        },
    }
}
if (window.aux_viewer == void 0) {
    var aux_viewer = {
        protos:{
            item:{
                id:null,
                images:[],
                number:0,
                isLuxe:false,
                cost:Infinity,
                stars:0,
                comments:0
            }
        },
        attr_name:{
            use_as: "aux-use_as",
        },
        attr_values: {
            use_as: {
                base: "Viewer_Base",
                referance: "Viewer_ReferanceShield",
                shield:"Viewer_Shield",
                imagesPanel:"Viewer_imagePanel",
                number:"Viewer_numberTarget",
                luxePanel:"Viewer_luxePanel",
                cost:"Viewer_costTarget",
                starsPanel:"Viewer_starsPanel",
                comment:"Viewer_comentTarget",
            },
        },
        base:null,
        refShield:null,
        items:[],
        views:[],

        //#region Item methods
        getItem(id){
            for(let i = 0; i < aux_viewer.items.length; i++ ){
                if(aux_viewer.items[i].id==id){
                    return aux_viewer.items[i];
                }
            }
            return null;
        },
        addItem(arg){
            let newItem = Object.create(aux_viewer.protos.item);
            newItem.id = arg.id;
            if(arg.images){newItem.images = arg.images;}
            if(arg.number){newItem.number = arg.number;}
            if(arg.isLuxe){newItem.isLuxe = arg.isLuxe;}
            if(arg.cost){newItem.cost = arg.cost;}
            if(arg.stars){newItem.stars = arg.stars;}
            console.error(arg.comments);
            if(arg.comments){newItem.comments = arg.comments;}
            aux_viewer.items.push(newItem);
        },
        resetItems(){
            aux_viewer.items = [];
        },
        //#endregion
        init(id){
            if(aux_viewer.base){
                console.error(`aux_viewer.init(${id}) : viewer already exist`);
                return;
            }
            let tmp = document.getElementById(id);
            if(!tmp){
                console.error(`aux_viewer.init(${id}) : can't find node with ID = ${id}`);
                return;
            }
            aux_viewer.base = tmp;
            aux_viewer.refShield = aux_viewer.base
                .querySelector(`[${aux_viewer.attr_name.use_as}=${aux_viewer.attr_values.use_as.referance}]`);
            if(!aux_viewer.refShield){
                console.error(`aux_viewer.init(${id}) : can't find referance node`);
                aux_viewer.base = null;
                aux_viewer.refShield = null;
                return;
            }
            aux_viewer.refShield.setAttribute("defaultDisplay" ,aux_viewer.refShield.style.display);
            aux_viewer.refShield.style.display = "none";
        },
        //#region View methods
        addReference(){
        },
        update(){
            let hz = aux_viewer.base.querySelectorAll(`[${aux_viewer.attr_name.use_as}=${aux_viewer.attr_values.use_as.shield}]`);
            for(let i = hz.length-1; !(i < 0); i--){hz[i].remove();}
            aux_viewer.items.forEach(
                (item, i, arr)=>{
                    let newNode = aux_viewer.refShield.cloneNode(true);
                    newNode.setAttribute(aux_viewer.attr_name.use_as, aux_viewer.attr_values.use_as.shield);
                    newNode.style.display = newNode.getAttribute("defaultDisplay");
                    //console.warn(newNode);
                    //document.body.append(newNode);
                    aux_viewer.base.append(newNode);
                    let part = newNode.querySelector(`[${aux_viewer.attr_name.use_as}=${aux_viewer.attr_values.use_as.imagesPanel}]`);
                    if(part){
                        let pics = newNode.querySelectorAll(`img`);
                        console.error(pics);
                        for(let i = 0; i< pics.length; i++){
                            pics[i].setAttribute("src", `http://localhost:80/resources/img/${item.number}/image${i+1}.jpg`);
                        }

                    }
                    part = newNode.querySelector(`[${aux_viewer.attr_name.use_as}=${aux_viewer.attr_values.use_as.number}]`);
                    if(part){ part.innerHTML = item.number; }
                    part = newNode.querySelector(`[${aux_viewer.attr_name.use_as}=${aux_viewer.attr_values.use_as.cost}]`);
                    if(part){ part.innerHTML = item.cost; }
                    part = newNode.querySelector(`[${aux_viewer.attr_name.use_as}=${aux_viewer.attr_values.use_as.starsPanel}]`);
                    if(part){
                        let chs = part.childNodes;
                        for(let f =0; f<5; f++){
                            if(f<item.stars){
                                part.childNodes[f].style.visibility = "visible";
                            }
                            else{chs[f].style.visibility = "hidden";}
                        }
                    }

                    part = newNode.querySelector(`[${aux_viewer.attr_name.use_as}=${aux_viewer.attr_values.use_as.luxePanel}]`);
                    //console.error(part);
                    if(part){ 
                        if(item.isLuxe){part.style.visibility = "visible";}
                        else{part.style.visibility = "hidden";} 
                    }

                    part = newNode.querySelector(`span[${aux_viewer.attr_name.use_as}=${aux_viewer.attr_values.use_as.comment}]`);
                    if(part){ part.innerHTML = item.comments; }
                    
                   
                    
                }
            );
        },
        //#endregion
        fillTestData(){
            aux_viewer.addItem({id:"s1", number:884, isLuxe:false, cost:3000, stars:5, comments:"123"});
            aux_viewer.addItem({id:"s2", number:885, isLuxe:true,  cost:4000, stars:4, comments:"312"});
            aux_viewer.addItem({id:"s3", number:886, isLuxe:false, cost:5000, stars:3, comments:"231"});
            aux_viewer.addItem({id:"s4", number:887, isLuxe:true,  cost:6000, stars:2, comments:"123"});
            aux_viewer.addItem({id:"s5", number:888, isLuxe:false, cost:7000, stars:1, comments:"312"});
            aux_viewer.addItem({id:"s6", number:889, isLuxe:true,  cost:8000, stars:5, comments:"231"});
        },
    }
}