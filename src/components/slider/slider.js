//alert("This is slider JS");
if (window.utility == void 0) {
    var utility = {
        isNumber(value) {
            return !isNaN(value) && isFinite(value);
        },
    }
}
if (window.aux_sliders == void 0) {

    var aux_sliders = {

        events_name: {
            sliders_change: "sliders_change",
        },
        protos:{
            item:{
                id: null,
                left: 0,
                right: 100,
                type: "step",
                points: "one",
                suffix: "suffix",
                stages: [],
            },
            view:{
                id : null,
                base : null,
                frame :null,
                preview : null,
                fst_mark : null,
                scd_mark : null,
                line : null,
                active_mark: null,
                label : null,
                direction: "horizontal",
            },
        },
        default: {
            slider_type: "step",
            points_count: "one",
            slider_suffix: "suffix",
        },
        attr_name: {
            use_as: "aux-use_as",
            type: "aux-slider_type",
            min: "aux-slider_minValue",
            max: "aux-slider_maxValue",
            stageRate: "aux-stage_rate",
            stageTitle: "aux-stage_title",
            stageValue: "aux-stage_value",
            stagePosition: "",
            stageIndex: "aux-stage_index",
            sliderType: "aux-slider_type",
            sliderCount: "aux-slider_count",
            sliderSuffix: "aux-slider_suffix",
            sliderDirection: "aux-slider_direction",
        },
        attr_values: {
            use_as: {
                base: "Slider_Base",
                frame: "Slider_Frame",
                preview: "Slider_Preview",
                stage: "Slider_Stage",
                low: "Slider_minPoint",
                hi: "Slider_maxPoint",
                min: "Slider_minLabel",
                max: "Slider_maxLabel",
                label: "Slider_Label",
                empty_line: "Slider_Empty_Line",
                fill_line: "Slider_Fill_Line",
            },
            sliderType: {
                typeStep: "step",
                typeSolid: "solid",
            },
            sliderCount: {
                single: "one",
                double: "two",
            },
            sliderDirection:{
                horizontal:"horizontal",
                vertical:"vertical",
            },
        },
        labelSplitter: " - ",

        current: {},
        views: [],
        items: [],

        pullToCurrent(id) {
            if (
                aux_sliders.current == null ||
                aux_sliders.current.item == null ||
                aux_sliders.current.view == null ||
                aux_sliders.current.item.id != id ||
                aux_sliders.current.view.id != id
            ) {
                //document.dispatchEvent(new Event("mouseup"));
                aux_sliders.current = {};
                let item = aux_sliders.getItem(id);
                let view = aux_sliders.getView(id);
                if(item == null || view == null){
                    //console.error("item");
                    //console.error(item);
                    //console.error("view");
                    //console.error(view);
                    return null;}
                aux_sliders.current.id = id;
                aux_sliders.current.item = item;
                aux_sliders.current.view = view;
            }
            return aux_sliders.current;
        },
        getItem(id) {
            for(let i = 0; i < aux_sliders.items.length; i++ ){
                if(aux_sliders.items[i].id==id){
                    return aux_sliders.items[i];
                }
            }
            //console.warn("getSliderData(" + id + ") : null");
            return null;
        },
        calcPercent(id, pos) {
            this.pullToCurrent(id);

            let res = (pos - this.current.view.frame.getBoundingClientRect().left) * 100 / (this.current.view.frame.offsetWidth);
            res = (res > 100) ? 100 : res;
            res = (res < 0) ? 0 : res;
            //console.log("calcPercent( " + id + ", " + pos + " ) = " + res);
            return res;
        },
        //#region Data interaction Methods  
        addData(id) {
            for(let i = 0; i < aux_sliders.items.length; i++){
                if(aux_sliders.items[i].id == id){
                    console.error("setSliderData(" + id + ") : already exist");
                    return null;
                }
            }
            let base = document.body.querySelector("[id=" + id + "]");
            let stages = base.querySelectorAll("[" + this.attr_name.use_as + "=" + this.attr_values.use_as.stage + "]");
            //#region ABRACADABRA
            let tmpStg = [];
            let tmpArr = [];
            let maxIndex = -Infinity;
            let minIndex = Infinity;
            
            for (let i = 0; i < stages.length; i++) {
                if (!utility.isNumber(stages[i].getAttribute(aux_sliders.attr_name.stageIndex))) {
                    console.error("aux_slider.addData( " + id + " ) : All elements of ' " + aux_sliders.attr_values.use_as.stage + " ' must have the numerical attribute of ' " + aux_sliders.attr_name.stageIndex + " '");
                    return;
                } else {
                    let currentIndex = parseInt(stages[i].getAttribute(aux_sliders.attr_name.stageIndex));
                    if (maxIndex < currentIndex) { maxIndex = currentIndex; }
                    if (minIndex > currentIndex) { minIndex = currentIndex; }
                    tmpArr[i] = stages[i];
                }
            }
            let partPerIndex = 100 / (maxIndex - minIndex);
            tmpArr.sort(function sortByIndex(fst, scd) {
                let fstIndex = parseInt(fst.getAttribute(aux_sliders.attr_name.stageIndex));
                let scdIndex = parseInt(scd.getAttribute(aux_sliders.attr_name.stageIndex));
                if (fstIndex > scdIndex) {
                    return 1;
                }
                if (fstIndex == scdIndex) {
                    return 0;
                }
                if (fstIndex < scdIndex) {
                    return -1;
                }
            });
            for (let i = 0; i < tmpArr.length; i++) {
                tmpStg.push(
                    {
                        rate: ((parseInt(tmpArr[i].getAttribute(aux_sliders.attr_name.stageIndex))) - minIndex) * partPerIndex,
                        moveWay: null,
                        //eage: stg[i].getAttribute(this.attr_name.stageRate) ? stg[i].getAttribute(this.attr_name.stageRate) : Math.round((i) * 100 / (stg.length - 1)),
                        title: tmpArr[i].getAttribute(aux_sliders.attr_name.stageTitle),
                        value: tmpArr[i].getAttribute(aux_sliders.attr_name.stageValue),
                    }
                )
            }
            //#endregion ABRACADABRA
            let item = Object.create(aux_sliders.protos.item);
        
            item.id = id,
            //item.    left: 0,
            //item.    right: 100,
            item.type = (base.getAttribute(this.attr_name.type) == null) ? this.default.slider_type : base.getAttribute(this.attr_name.type);
            item.points = (base.getAttribute(this.attr_name.sliderCount) == null) ? this.default.points_count :
                ((base.getAttribute(this.attr_name.sliderCount) == this.attr_values.sliderCount.double) ? this.attr_values.sliderCount.double : this.attr_values.sliderCount.single);
            item.suffix = (base.getAttribute(this.attr_name.sliderSuffix) == null) ? this.default.slider_suffix : base.getAttribute(this.attr_name.sliderSuffix);
            item.stages = tmpStg;
            aux_sliders.items.push(item);
            //console.error(aux_sliders.items[aux_sliders.items.length-1]);
        },
        getTrueState(id, pos) {
            //console.log("getTrueState( " + id + ", " + pos + " )");
            aux_sliders.pullToCurrent(id);
            let lab, loc;
            let stg = this.current.item.stages;
            for (let i = 0; i < stg.length; i++) {
                if (pos <= stg[i].rate) {
                    switch (this.current.item.type) {
                        case aux_sliders.attr_values.sliderType.typeStep:
                            loc = stg[i].rate;
                            lab = stg[i].value;
                            return { label: lab, location: loc };
                            break;
                        case aux_sliders.attr_values.sliderType.typeSolid:
                            loc = pos;
                            if (i == 0) { lab = stg[i].value; break; }
                            else {
                                let factor = (parseInt(stg[i].value) - parseInt(stg[i - 1].value)) / (parseInt(stg[i].rate) - parseInt(stg[i - 1].rate));
                                //lab = parseInt(stg[i].value);
                                lab = parseInt(stg[i - 1].value) + (parseInt(pos) - parseInt(stg[i - 1].rate)) * factor;
                            }
                            return { label: lab, location: loc };
                            break;
                        default:

                            break;
                    }
                }
            }
            return { label: lab, location: loc };
        },
        updateData(id, min, max) {
            this.pullToCurrent(id);
            //console.warn("updateData( " + id + ", " + min + ", " + max + " )");
            if (this.current == null) { console.error("aux_sliders.updateData(" + id + ") : element does't exist"); return; }
            if (max > 100) { max = 100; console.warn("aux_sliders : updateData(" + id + ", " + min + ", " + max + ") : max set as 100"); }
            if (min < 0) { min = 0; console.warn("aux_sliders : updateData(" + id + ", " + min + ", " + max + ") : min set as 0"); }
            if (min > max) {
                this.current.item.left = max;
                aux_sliders.current.view.active_mark =
                    (aux_sliders.current.view.active_mark ===
                        aux_sliders.current.view.fst_mark) ? aux_sliders.current.view.scd_mark : aux_sliders.current.view.fst_mark;
                this.current.item.right = min; 
                console.warn("aux_sliders : updateData(" + id + ", " + min + ", " + max + ") : min can't more then max - min set as " + max + ", max set as " + min + "");
            }
            else {
                this.current.item.left = min;
                this.current.item.right = max;
            }
            document.dispatchEvent(new CustomEvent(aux_sliders.events_name.sliders_change, { detail: { id: id } }));
            //document.dispatchEvent(new Event("mouseup"));
        },
        //#endregion Data interaction Methods          

        //#region View interaction Methods  
        addView(id) {
            aux_sliders.views.forEach(view => {
                if (view.id == id) { console.error("setSliderView(" + id + ") : already exist"); return view; }
            });
            let elem = document.body.querySelector("[id=" + id + "]");
            let stg = elem.querySelectorAll("[" + this.attr_name.use_as + "=" + this.attr_values.use_as.stage + "]");
            let view = Object.create(aux_sliders.protos.view);
            view.id = elem.id;
            view.base = elem;
            view.frame = elem.querySelector("[" + this.attr_name.use_as + "=" + this.attr_values.use_as.frame + "]");
            view.preview = elem.querySelector("[" + this.attr_name.use_as + "=" + this.attr_values.use_as.preview + "]");
            view.fst_mark = elem.querySelector("[" + this.attr_name.use_as + "=" + this.attr_values.use_as.low + "]");
            view.scd_mark = elem.querySelector("[" + this.attr_name.use_as + "=" + this.attr_values.use_as.hi + "]");
            view.line = elem.querySelector("[" + this.attr_name.use_as + "=" + this.attr_values.use_as.fill_line + "]");
            view.active_mark = null;
            view.label = elem.querySelector("[" + this.attr_name.use_as + "=" + this.attr_values.use_as.label + "]");
            let dir=elem.getAttribute(aux_sliders.attr_name.sliderDirection);
            if(dir){view.direction = dir;}
            
            
            this.views.push(view);
            aux_sliders.views[aux_sliders.views.length - 1].base.onselectstart = () => false;
            //aux_sliders.views[aux_sliders.views.length - 1].fst_mark.onselectstart = () => false;
            //aux_sliders.views[aux_sliders.views.length - 1].scd_mark.onselectstart = () => false;
            //aux_sliders.views[aux_sliders.views.length - 1].frame.onselectstart = () => false;
            aux_sliders.views[aux_sliders.views.length - 1].base.onmousedown =
                function (event) {
                    //console.error("function");
                    //console.error(this);
                    //console.error(event);
                    let target = event.target;
                    switch (target.getAttribute(aux_sliders.attr_name.use_as)) {
                        case aux_sliders.attr_values.use_as.hi:
                            //console.log("hi");
                            //console.log(this);
                            //console.log(event.target);
                            if (aux_sliders.pullToCurrent(this.id) == null) {
                                console.error("onmousedown -> pullToCurrent( " + this.id + ") : can't find this element in aux_sliders");
                            }
                            aux_sliders.current.view.active_mark = aux_sliders.current.view.scd_mark;

                            aux_sliders.locatePreview(this.id);

                            aux_sliders.showPreview(this.id);
                            aux_sliders.pullToCurrent(this.id);
                            document.addEventListener('mousemove', aux_sliders.move_handler);
                            break;
                        case aux_sliders.attr_values.use_as.low:
                            //console.log("low");
                            //console.log(this);
                            //console.log(event.target);
                            if (aux_sliders.pullToCurrent(this.id) == null) {
                                console.error("onmousedown -> pullToCurrent( " + this.id + ") : can't find this element in aux_sliders");
                            }
                            aux_sliders.current.view.active_mark = aux_sliders.current.view.fst_mark;

                            aux_sliders.locatePreview(this.id);
                            aux_sliders.showPreview(this.id);
                            aux_sliders.pullToCurrent(this.id);
                            document.addEventListener('mousemove', aux_sliders.move_handler);
                            break;
                        default:
                            //console.log("onmousedown : ");
                            //console.log(target);
                            //console.log("");
                            break;
                    }
                };
        },
        getView(id){
            for(let i = 0; i < aux_sliders.views.length; i++){
                if(aux_sliders.views[i].id == id){
                    return aux_sliders.views[i];
                }
            }
            return null;
        },
        updateView(id){
            //let item;
            //let view;
            //if(aux_sliders.current && aux_sliders.current.id == id){
            //    item = aux_sliders.current.item?aux_sliders.current.item:aux_sliders.getItem(id);
            //    view = aux_sliders.current.view?aux_sliders.current.view:aux_sliders.getView(id);
            //}
            //else{
            //    item = aux_sliders.getItem(id);
            //    view = aux_sliders.getView(id);
            //}

            let item = aux_sliders.getItem(id);
            let view = aux_sliders.getView(id);
            
            

            let p1, p2;
            //locate points
            let pxPerPercent;
            if(false){//view.direction == "vertical"

            }else{//view.direction == "horizontal"
                pxPerPercent = (view.frame.getBoundingClientRect().width - view.scd_mark.offsetWidth)/100;
                
                
                switch (item.points) {
                    case aux_sliders.attr_values.sliderCount.single:
                        
                            
                            
                            view.fst_mark.style.display = "none";
                            view.fst_mark.style.left = 0 + "px";
                            view.scd_mark.style.left = item.right * pxPerPercent + "px";
                            //update labels
                            
                            p2 = aux_sliders.getTrueState(item.id, item.right);
                            if (utility.isNumber(p2.label)) { p2.label= Math.round(p2.label); }
                            aux_sliders.changeLabel(item.id, p2.label);
                        break;
                    case aux_sliders.attr_values.sliderCount.double:
                            view.fst_mark.style.left = item.left  * pxPerPercent + "px";
                            view.scd_mark.style.left = item.right * pxPerPercent + "px";
                            //update labels
                            
                            p1 = aux_sliders.getTrueState(item.id, item.left);
                            p2 = aux_sliders.getTrueState(item.id, item.right);
                            if (utility.isNumber(p1.label)) { p1.label = Math.round(p1.label); }
                            if (utility.isNumber(p2.label)) { p2.label = Math.round(p2.label); }
                            aux_sliders.changeLabels(aux_sliders.current.id, p1.label, p2.label);
                        break;
                    default:
                        break;
                }
            }
            //change length fill line
            aux_sliders.updateLine(id);
        },
        //#endregion View interaction Methods
        showPreview(id) {
            this.pullToCurrent(id);
            this.current.view.preview.style.visibility = "visible";
        },
        hidePreview(id) {
            this.pullToCurrent(id);
            this.current.view.preview.style.visibility = "hidden";
        },
        locatePreview(id) {
            this.pullToCurrent(id);
            aux_sliders.current.view.preview.style.left = aux_sliders.current.view.active_mark.offsetLeft - aux_sliders.current.view.preview.offsetWidth / 2 + aux_sliders.current.view.active_mark.offsetWidth / 2 + "px";
            aux_sliders.current.view.preview.style.bottom = 5 + aux_sliders.current.view.active_mark.offsetHeight + "px";
        },
        loadPreview(id, mark) {
            this.pullToCurrent(id);
            this.current.view.preview.innerHTML = mark;
        },
        changeLabel(id, value) {
            this.pullToCurrent(id);
            this.current.view.label.innerHTML = value + " " + this.current.item.suffix;
        },
        changeLabels(id, min, max ) {
            this.pullToCurrent(id);
            this.current.view.label.innerHTML = min + " " + this.current.item.suffix + " " + aux_sliders.labelSplitter + " " + max + " " + this.current.item.suffix;
            //this.current.view.minLabel.innerHTML = min;
            //this.current.view.maxLabel.innerHTML = max;
        },
        updateLine(id) {
            this.pullToCurrent(id);
            switch (aux_sliders.current.item.type) {

                case aux_sliders.attr_values.sliderType.typeSolid:
                    aux_sliders.current.view.line.style.left = aux_sliders.current.view.fst_mark.offsetLeft + aux_sliders.current.view.fst_mark.offsetWidth / 2 + "px";
                    aux_sliders.current.view.line.style.width = aux_sliders.current.view.scd_mark.offsetLeft - aux_sliders.current.view.fst_mark.offsetLeft + "px";
                    break;
                case aux_sliders.attr_values.sliderType.typeStep:
                    aux_sliders.current.view.line.style.left = aux_sliders.current.view.fst_mark.offsetLeft + aux_sliders.current.view.fst_mark.offsetWidth / 2 + "px";
                    aux_sliders.current.view.line.style.width = aux_sliders.current.view.scd_mark.offsetLeft - aux_sliders.current.view.fst_mark.offsetLeft + "px";
                    break;
                default:
                    break;
            }
        },
        move_handler(event) {
            switch(aux_sliders.current.view.direction)
            {
                case aux_sliders.attr_values.sliderDirection.horizontal:
                    //console.log("horizontal");
                    //m_1.style.left = event.clientX + "px";
                    let truePos = aux_sliders.getTrueState(aux_sliders.current.id, aux_sliders.calcPercent(aux_sliders.current.id, event.clientX));
                    if (utility.isNumber(truePos.label)) { truePos.label = Math.round(truePos.label); }
                    aux_sliders.loadPreview(aux_sliders.current.id, truePos.label);
                    switch (aux_sliders.current.view.active_mark) {
                        case aux_sliders.current.view.fst_mark:
                                aux_sliders.locatePreview(aux_sliders.current.id);
                                aux_sliders.updateData(
                                    aux_sliders.current.id,
                                    truePos.location,
                                    aux_sliders.current.item.right,
                                );
                            break;
                        case aux_sliders.current.view.scd_mark:
                                aux_sliders.locatePreview(aux_sliders.current.id);
                                aux_sliders.updateData(
                                    aux_sliders.current.id,
                                    aux_sliders.current.item.left,
                                    truePos.location,
                                );
                            break;
                    }
                break;
                case aux_sliders.attr_values.sliderDirection.vertical:
                    //console.log("vertical");
                    //m_2.style.top = event.clientY + "px";
                break;
            }

        },
        resize_handler(){
            console.log("QWERTGFDSAZXCVB");
            console.log(aux_sliders.items[i]);
            for(var i = 0; i<aux_sliders.items.length; i++){
                aux_sliders.updateView(aux_sliders.items[i].id);
                console.log(aux_sliders.items[i]);
            }
            //aux_sliders.items.forEach(
            //    (item, i, arr)=>{
            //        
            //        //console.log(item);
            //        console.log(aux_sliders.items[i]);
            //        //console.log(arr);
            //        aux_sliders.updateView(aux_sliders.items[i].id);
            //    }
            //);
        },
        initSlider(base){
            if (base.getAttribute(aux_sliders.attr_name.use_as) == aux_sliders.attr_values.use_as.base) {
                aux_sliders.addData(base.id);
                aux_sliders.addView(base.id);
                document.dispatchEvent(new CustomEvent(aux_sliders.events_name.sliders_change, { detail: { id: base.id } }));
                aux_sliders.updateView(base.id);
            }
            else {
                console.error("Slider can't available, may be need add 'aux-use_as' attribute to parentNode");
            }
        }

    }
    function aux_sliders_finish(event) {
        document.removeEventListener('mousemove', aux_sliders.move_handler);
        if (aux_sliders.current) {
            aux_sliders.hidePreview(aux_sliders.current.id);
            aux_sliders.current = null;
        }
    }
    document.addEventListener('mouseup', this.aux_sliders_finish);
    window.addEventListener('resize', aux_sliders.resize_handler);
    document.addEventListener(aux_sliders.events_name.sliders_change, sliders_change_handler);
    function sliders_change_handler(event) {
        aux_sliders.pullToCurrent(event.detail.id);
        aux_sliders.updateView(event.detail.id);
    }
}
function getParent(){
    let scripts = document.getElementsByTagName('script');
    let base = scripts[scripts.length - 1].parentNode;
    return base;
}