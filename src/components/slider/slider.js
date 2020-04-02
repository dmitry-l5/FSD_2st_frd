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
        },
        attr_values: {
            use_as: {
                base: "Slider_Base",
                frame: "Slider_Frame",
                preview: "Slider_Preview",
                stage: "Slider_Stage",
                low: "Slider_minPoint",
                hi: "Slider_maxPoint",
                empty_line: "",
                fill_line: "Slider_Fill_Line",
            },
            sliderType: {
                typeStep: "step",
                typeSolid: "solid",
            },
            sliderCount: {
                single: "one",
                double: "two",
            }
        },
        labelSplitter: " - ",
        default: {
            slider_type: "solid",/* solid:step*/
            points_count: "one",
            slider_suffix: "Ъ",

        },
        current: {},
        views: [],
        items: [],

        pullToCurrent(id) {
            if (
                this.current == null ||
                this.current.item == null ||
                this.current.view == null ||
                this.current.item.id != id ||
                this.current.view.id != id
            ) {
                //document.dispatchEvent(new Event("mouseup"));
                this.current = null;
                for (let i = 0; i < this.items.length; i++) {
                    if (this.items[i].id == id) {
                        this.current = {};
                        this.current.item = this.items[i];
                        for (let i = 0; i < this.views.length; i++) {
                            if (this.views[i].id == id) {
                                this.current.id = id;
                                this.current.view = this.views[i];
                                return this.current;
                            }
                        }
                        break;
                    }
                }
            }
            return this.current;
        },
        getData(id) {
            //console.log(this.pullToCurrent(id));
            return this.pullToCurrent(id);
            //aux_sliders.items.forEach(item => {
            //    if (item.id == id) { console.log("getSliderData(" + id + ") : find"); return item; }
            //    else { console.log("getSliderData(" + id + ") : null"); return null; }
            //});
        },
        calcPercent(id, pos) {
            this.pullToCurrent(id);

            let res = (pos - this.current.view.frame.getBoundingClientRect().left - this.current.view.scd_mark.offsetWidth) * 100 / this.current.view.frame.offsetWidth;
            res = (res > 100) ? 100 : res;
            res = (res < 0) ? 0 : res;
            //console.log("calcPercent( " + id + ", " + pos + " ) = " + res);
            return res;
        },
        //#region Data interaction Methods  
        addData(id) {
            aux_sliders.items.forEach(item => {
                if (item.id == id) { console.warn("setSliderData(" + id + ") : already exist"); return item; }
            });
            let elem = document.body.querySelector("[id=" + id + "]");
            let stg = elem.querySelectorAll("[" + this.attr_name.use_as + "=" + this.use_as.stage + "]");

            //#region ABRACADABRA
            let tmpStg = [];
            let tmpArr = [];
            let hasRate = [];
            let onePart = 100 / stg.length;
            let stageCount = stg.length;
            let maxIndex = 0;
            let minIndex = Infinity;
            let parttsCount = 0;
            let withIndex = [];
            for (let i = 0; i < stg.length; i++) {
                if (!utility.isNumber(stg[i].getAttribute(aux_sliders.attr_name.stageIndex))) {
                    console.error("aux_slider.addData( " + id + " ) : All elements of ' " + aux_sliders.use_as.stage + " ' must have the numerical attribute of ' " + aux_sliders.attr_name.stageIndex + " '");
                    return;
                } else {
                    if (maxIndex < parseInt(stg[i].getAttribute(aux_sliders.attr_name.stageIndex))
                    ) {
                        maxIndex = parseInt(stg[i].getAttribute(aux_sliders.attr_name.stageIndex));
                    }
                    if (minIndex > parseInt(stg[i].getAttribute(aux_sliders.attr_name.stageIndex))
                    ) {
                        minIndex = parseInt(stg[i].getAttribute(aux_sliders.attr_name.stageIndex));
                    }
                    tmpArr[i] = stg[i];
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
            //tmpArr.forEach(item => console.log(item.getAttribute(aux_sliders.attr_name.stageIndex)));
            for (let i = 0; i < tmpArr.length; i++) {
                tmpStg.push(
                    {
                        rate: ((parseInt(tmpArr[i].getAttribute(aux_sliders.attr_name.stageIndex))) - minIndex) * partPerIndex,
                        moveWay: null,
                        //eage: stg[i].getAttribute(this.attr_name.stageRate) ? stg[i].getAttribute(this.attr_name.stageRate) : Math.round((i) * 100 / (stg.length - 1)),
                        title: tmpArr[i].getAttribute(this.attr_name.stageTitle),
                        value: tmpArr[i].getAttribute(this.attr_name.stageValue),
                    }
                )
            }
            //#endregion ABRACADABRA
            console.log(" After ABRACADABRA ");
            console.log(elem.getAttribute(this.attr_name.type));
            aux_sliders.items.push({
                id: id,
                left: 0,
                right: 100,
                type: (elem.getAttribute(this.attr_name.type) == null) ? this.default.slider_type : elem.getAttribute(this.attr_name.type),
                points: (elem.getAttribute(this.attr_name.sliderCount) == null) ? this.default.points_count :
                    ((elem.getAttribute(this.attr_name.sliderCount) == this.attr_values.sliderCount.double) ? this.attr_values.sliderCount.double : this.attr_values.sliderCount.single),
                min: tmpStg[0].value ? tmpStg[0].value : 0,
                max: tmpStg[tmpStg.length - 1].value ? tmpStg[tmpStg.length - 1].value : 100,
                suffix: (elem.getAttribute(this.attr_name.suffix) == null) ? this.default.slider_suffix : elem.getAttribute(this.attr_name.suffix),
                stages: tmpStg,
            });
        },
        getTrueState(id, pos) {
            console.log("getTrueState( " + id + ", " + pos + " )");
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
        updateData(id, left, right) {
            this.pullToCurrent(id);
            console.warn("updateData( " + id + ", " + left + ", " + right + " )");
            if (this.current == null) { console.error("aux_sliders.updateData(" + id + ") : element does't exist"); return; }
            if (right > 100) { right = 100; console.warn("aux_sliders : updateData(" + id + ", " + left + ", " + right + ") : right set as 100"); }
            if (left < 0) { left = 0; console.warn("aux_sliders : updateData(" + id + ", " + left + ", " + right + ") : left set as 0"); }
            if (left > right) {
                this.current.item.left = right;
                aux_sliders.current.view.active_mark =
                    (aux_sliders.current.view.active_mark ===
                        aux_sliders.current.view.fst_mark) ? aux_sliders.current.view.scd_mark : aux_sliders.current.view.fst_mark;
                this.current.item.right = left; console.warn("aux_sliders : updateData(" + id + ", " + left + ", " + right + ") : left can't more then right - left set as " + right + ", right set as " + left + "");
            }
            else {
                this.current.item.left = left;
                this.current.item.right = right;
            }
            document.dispatchEvent(new CustomEvent(aux_sliders.events_name.sliders_change, { detail: { id: id } }));
        },
        //#endregion Data interaction Methods          

        //#region View interaction Methods  
        addView(id) {
            aux_sliders.views.forEach(view => {
                if (view.id == id) { console.warn("setSliderView(" + id + ") : already exist"); return view; }
            });
            let elem = document.body.querySelector("[id=" + id + "]");
            let stg = elem.querySelectorAll("[" + this.attr_name.use_as + "=" + this.use_as.stage + "]");

            this.views.push({
                id: elem.id,
                base: elem,
                frame: elem.querySelector("[" + this.attr_name.use_as + "=" + this.use_as.frame + "]"),
                preview: elem.querySelector("[" + this.attr_name.use_as + "=" + this.use_as.preview + "]"),
                fst_mark: elem.querySelector("[" + this.attr_name.use_as + "=" + this.use_as.low + "]"),
                scd_mark: elem.querySelector("[" + this.attr_name.use_as + "=" + this.use_as.hi + "]"),
                line: elem.querySelector("[" + this.attr_name.use_as + "=" + this.attr_values.use_as.fill_line + "]"),
                active_mark: null,
                //minLabel: elem.querySelector("[" + this.attr_name.use_as + "=" + this.use_as.min + "]"),
                //maxLabel: elem.querySelector("[" + this.attr_name.use_as + "=" + this.use_as.max + "]"),
                label: elem.querySelector("[" + this.attr_name.use_as + "=" + this.use_as.label + "]"),
            });
            aux_sliders.views[aux_sliders.views.length - 1].base.onselectstart = () => false;
            //aux_sliders.views[aux_sliders.views.length - 1].fst_mark.onselectstart = () => false;
            //aux_sliders.views[aux_sliders.views.length - 1].scd_mark.onselectstart = () => false;
            //aux_sliders.views[aux_sliders.views.length - 1].frame.onselectstart = () => false;
            aux_sliders.views[aux_sliders.views.length - 1].base.onmousedown =
                function (event) {
                    let target = event.target;
                    switch (target.getAttribute(aux_sliders.attr_name.use_as)) {

                        case aux_sliders.use_as.hi:
                            //console.log("hi");
                            //console.log(this);
                            //console.log(event.target);
                            if (aux_sliders.pullToCurrent(this.id) == null) {
                                console.error("onmousedown -> pullToCurrent( " + this.id + ") : can't find this element in aux_sliders");
                            }
                            aux_sliders.current.view.active_mark = aux_sliders.current.view.scd_mark;

                            aux_sliders.locatePreview(this.id);

                            aux_sliders.showPreview(aux_sliders.current.id);
                            document.addEventListener('mousemove', aux_sliders.move_handler);



                            break;
                        case aux_sliders.use_as.low:
                            //console.log("low");
                            //console.log(this);
                            //console.log(event.target);
                            if (aux_sliders.pullToCurrent(this.id) == null) {
                                console.error("onmousedown -> pullToCurrent( " + this.id + ") : can't find this element in aux_sliders");
                            }
                            aux_sliders.current.view.active_mark = aux_sliders.current.view.fst_mark;

                            aux_sliders.locatePreview(this.id);

                            aux_sliders.showPreview(aux_sliders.current.id);
                            document.addEventListener('mousemove', aux_sliders.move_handler);
                            break;
                        default:
                            console.log("onmousedown : ");
                            console.log(target);
                            console.log("");
                            break;
                    }
                };
        },
        showView(id, minValueInt, maxValueInt) {
            this.showView_Pc(id, minValueInt, maxValueInt);
            if (this.views[i].id == id) {
                let fullWidth = frame.getBoundingClientRect().width - this.views[i].max.offsetWidth;
                let percent = fullWidth / 100;
                //alert(id);
                //console.log(this.views[i]);
                this.views[i].min.style.left = minValueInt * percent + "px";
                //this.views[id].min.style.position = "absolute";
                //this.views[id].max.style.position = "absolute";
                this.views[i].max.style.left = maxValueInt * percent + "px";

            }
        },
        showView_current() {
            if (this.current.view == null || this.current.item == null) { console.error("showView_current : this.current = null"); return; }
            let fullWidth = this.current.view.frame.getBoundingClientRect().width;// - this.current.view.max.offsetWidth;
            let percent = fullWidth / 100;

            switch (this.current.item.points) {
                case aux_sliders.attr_values.sliderCount.single:
                    this.current.view.fst_mark.style.display = "none";
                    this.current.view.fst_mark.style.left = 0 + "px";
                    this.current.view.scd_mark.style.left = this.current.item.right * percent + "px";
                    break;
                case aux_sliders.attr_values.sliderCount.double:
                    this.current.view.fst_mark.style.left = this.current.item.left * percent + "px";
                    this.current.view.scd_mark.style.left = this.current.item.right * percent + "px";
                    break;
                default:
                    break;
            }

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
            //console.log("aux_sliders.current.view.active_mark");
            //console.log(aux_sliders.current.view.active_mark);
            //console.log("aux_sliders.current.view.active_mark.style.left");
            //console.log(aux_sliders.current.view.active_mark.offsetLeft);
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
                    console.log("updateLine( " + id + " )");
                    console.log(aux_sliders.current.item.type);
                    break;
            }





        },
        finish(event) {
            //console.log(event);
            //clear current


            this.current = null;

        },

        move_handler(event) {
            console.log("move_handler( " + event + " )");
            console.log("aux_sliders.calcPercent(aux_sliders.current.id, event.clientX)");
            console.log(aux_sliders.calcPercent(aux_sliders.current.id, event.clientX));
            let truePos = aux_sliders.getTrueState(aux_sliders.current.id, aux_sliders.calcPercent(aux_sliders.current.id, event.clientX));

            if (utility.isNumber(truePos.label)) { truePos.label = Math.round(truePos.label); }
            aux_sliders.loadPreview(aux_sliders.current.id, truePos.label);
            switch (aux_sliders.current.view.active_mark) {
                case aux_sliders.current.view.fst_mark:
                    aux_sliders.locatePreview(aux_sliders.current.id);
                    aux_sliders.updateData(
                        aux_sliders.current.id,
                        truePos.location,
                        //aux_sliders.calcPercent(aux_sliders.current.id, event.clientX),
                        aux_sliders.current.item.right,
                    );
                    break;
                case aux_sliders.current.view.scd_mark:
                    aux_sliders.locatePreview(aux_sliders.current.id);
                    aux_sliders.updateData(
                        aux_sliders.current.id,
                        aux_sliders.current.item.left,
                        truePos.location,
                        //aux_sliders.calcPercent(aux_sliders.current.id, event.clientX),
                    );
                    break;
            }
            aux_sliders.updateLine(aux_sliders.current.id);


        },
    }



    function aux_sliders_finish(event) {
        if (aux_sliders.current) {
            document.removeEventListener('mousemove', aux_sliders.move_handler);
            aux_sliders.hidePreview(aux_sliders.current.id);
            let p1, p2;
            switch (aux_sliders.current.item.points) {
                case aux_sliders.attr_values.sliderCount.single:
                    p2 = aux_sliders.getTrueState(aux_sliders.current.id, aux_sliders.current.item.right);
                    if (utility.isNumber(p2.label)) { p2.label= Math.round(p2.label); }
                    console.log(utility.isNumber(p2.label));
                    console.log(Math.round(p2.label));
                    aux_sliders.changeLabel(aux_sliders.current.id, p2.label);
                    break;
                case aux_sliders.attr_values.sliderCount.double:
                    p1 = aux_sliders.getTrueState(aux_sliders.current.id, aux_sliders.current.item.left);
                    p2 = aux_sliders.getTrueState(aux_sliders.current.id, aux_sliders.current.item.right);
                    if (utility.isNumber(p1.label)) { p1.label = Math.round(p1.label); }
                    aux_sliders.changeLabels(aux_sliders.current.id, p1.label, p2.label);
                    break;
                default:
                    break;
            }
            aux_sliders.current = null;
        }
    }
    document.addEventListener('mouseup', this.aux_sliders_finish);
    document.addEventListener(aux_sliders.events_name.sliders_change, sliders_change_handler);
    function sliders_change_handler(event) {
        aux_sliders.pullToCurrent(event.detail.id);
        //console.log(aux_sliders.current);

        aux_sliders.showView_current();
    }
}



var scripts = document.getElementsByTagName('script');
var base = scripts[scripts.length - 1].parentNode;

if (base.getAttribute(aux_sliders.attr_name.use_as) == aux_sliders.use_as.base) {
    aux_sliders.addData(base.id);
    aux_sliders.addView(base.id);
    document.dispatchEvent(new CustomEvent(aux_sliders.events_name.sliders_change, { detail: { id: base.id } }));
    //aux_sliders.updateView(base.id);
}
else {
    console.error("Slider can't available, may be need add 'aux-use_as' attribute to parentNode");
}
