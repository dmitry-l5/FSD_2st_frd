//alert("This is slider JS");
if (window.utility == void 0) {
    var utility = {
        isNumber(value) {
            return !isNaN(value) && isFinite(value);
        },
    }
}

if (window.aux_calendars == void 0) {
    //#region  aux_calendars
    var aux_calendars = {
        protos:{
            item:{
                id: function(){ console.error("aux_calendars.protos.item.id : variable not set")},
                date: { 
                    in: function(){ console.error("aux_calendars.protos.item.date.in : variable not set")},
                    out:function(){  console.error("aux_calendars.protos.item.date.out : variable not set")},
                    current:function(){ console.error("aux_calendars.protos.item.date.current : variable not set")}},
                isOpen: 0,
                set: function(){ console.error("aux_calendars.protos.item.date.set : variable not set")},
                reset:function(){  console.error("aux_calendars.protos.item.reset : variable not set")},
                get: function(){ console.error("aux_calendars.protos.item.get : variable not set")},
            },
            view:{},
        },
        events_name: {
            calendars_change: "calendars_change",
            calendars_accept: "calendars_accept",
            calendars_clear: "calendars_clear",
        },
        use_as: {
            base: "Calendar_Base",

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
                base: "Calendar_Base",
                month: "Calendar_monthTitle",
                year: "Calendar_yearTitle",
                days: "Calendar_daysArea",
                day:    "Calendar_dayCell",
                cells: "Calendar_cells",
                incMonth: "Calendar_incMonthBtn",
                decMonth: "Calendar_decMonthBtn",
                decMonth: "Calendar_decMonthBtn",
                weekTitle: "Calendar_weekTitle",
                arrival: "Calendar_arrivalDate",
                departure: "Calendar_departureDate",
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
        monthName : [
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь"
        ],
        labelSplitter: " - ",
        default: {
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
                        console.log("item find");
                        for (let i = 0; i < this.views.length; i++) {
                            if (this.views[i].id == id) {
                                this.current.id = id;
                                this.current.view = this.views[i];
                                console.log("view find");
                                this.current.handler = aux_calendars.fun;
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
            for(var i = 0; i<aux_calendars.items.length; i++){
                if(aux_calendars.items[i].id == id ){
                    return aux_calendars.items[i];
                }
            }
            return null;
        },
        //#region Data interaction Methods  
        addData(id) {
            if(this.getData(id)!==null){ console.error("setCalendarData(" + id + ") : already exist"); return item; }
            aux_calendars.items.push(
                {
                    id: id,
                    date: { in: null, out: null, current: new Date() },
                    isOpen: 0,
                    set: aux_calendars.setData,
                    reset: aux_calendars.resetData,
                    get: aux_calendars.getData,
                }
            );
        },
        setData(datein, dateOut, dateCurrent){
            this.date.in = datein;
            this.date.out = dateOut;
            this.date.current = dateCurrent;
            document.dispatchEvent(new CustomEvent(aux_calendars.events_name.calendars_change, {detail:{ item: this }}))
        },
        resetData(){
            console.log(this);
            this.date.in =null;
            this.date.out =null;
            this.date.current = new Date();
            document.dispatchEvent(new CustomEvent(aux_calendars.events_name.calendars_change, {detail:{ item: this }}))
        },
        decMonth(date) {
            if (date.getMonth() == 0) { 
                return new Date(date.getFullYear() - 1, 11, date.getDate()); 
            }
            return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
        },
        incMonth(date){
            if (date.getMonth() == 11) { 
                return new Date(date.getFullYear() + 1, 0, date.getDate()); 
            }
            return new Date(date.getFullYear(), date.getMonth()+1, date.getDate());
        },
        //#endregion Data interaction Methods          

        //#region View interaction Methods  
        addView(id) {
            aux_calendars.views.forEach(view => {
                if (view.id == id) { console.error("setCalendarView(" + id + ") : already exist"); return view; }
            });
            let base = document.getElementById(id);
            let tmpDays =  base.querySelector("["+ aux_calendars.attr_name.use_as+"="+ aux_calendars.attr_values.use_as.days+"]");
            let tmp = {
                id : id,
                bese: base,
                month: base.querySelector("["+ aux_calendars.attr_name.use_as+"="+ aux_calendars.attr_values.use_as.month+"]"),
                year: base.querySelector("["+ aux_calendars.attr_name.use_as+"="+ aux_calendars.attr_values.use_as.year+"]"),
                days: tmpDays,
                cells: tmpDays.querySelectorAll("td"),
                arrival : base.querySelector("["+ aux_calendars.attr_name.use_as+"="+ aux_calendars.attr_values.use_as.arrival+"]"),
                departure : base.querySelector("["+ aux_calendars.attr_name.use_as+"="+ aux_calendars.attr_values.use_as.departure+"]"),
            };
            aux_calendars.views.push(tmp);
        },
        showView(data) {
            let tData;
            console.log(data);
            if(data==null||
                data.id !== this.id){
                    tData = aux_calendars.getData(this.id);
                }
                else {tData = data}
            if(tData == null){console.error("showVIew( "+data+" )"); return;}
            let today = new Date();
            let tmpDate = new Date(
                tData.date.current.getFullYear(), 
                tData.date.current.getMonth(), 
                1);
            let areaData = {
                today: null,
                lastDaysCount: null,
                currentDaysCount: null,
                firstCurrentDay: null,
                firstMark: null,
                secondMark: null,
                firstEadge: null,
                secondEadge: null
            }
            this.year.innerHTML =  tData.date.current.getFullYear();
            this.month.innerHTML = aux_calendars.monthName[tData.date.current.getMonth()];
            areaData.currentDaysCount = aux_calendars.daysInMonth(tData.date.current.getFullYear(), tData.date.current.getMonth());
            areaData.lastDaysCount = aux_calendars.daysInMonth(tData.date.current.getFullYear(), tData.date.current.getMonth() - 1);
            areaData.firstCurrentDay = aux_calendars.getTrueDay(tmpDate);
            if (
                today.getFullYear() == tData.date.current.getFullYear() &&
                today.getMonth() == tData.date.current.getMonth()
            ) {
                console.log("today.getDate() : " + today.getDate());
                areaData.today = today.getDate() + areaData.firstCurrentDay-1;
            }
            if (tData.date.in !== null) {
                if (
                    tData.date.current.getFullYear() == tData.date.in.getFullYear() &&
                    tData.date.current.getMonth() == tData.date.in.getMonth()
                ) {
                    areaData.firstMark = tData.date.in.getDate() + areaData.firstCurrentDay -1;
                }
                if (tData.date.out !== null) {
                    if (
                        tData.date.current.getFullYear() == tData.date.out.getFullYear() &&
                        tData.date.current.getMonth() == tData.date.out.getMonth()
                    ) {
                        areaData.secondMark = tData.date.out.getDate() + areaData.firstCurrentDay - 1;
                    }
                    let temp_1 = (tData.date.current.getFullYear() * 12 + tData.date.current.getMonth())
                        - (tData.date.in.getFullYear() * 12 + tData.date.in.getMonth())
                    console.log("temp_1 = " + temp_1);

                    if (temp_1 > 0) {
                        areaData.firstEadge = areaData.firstCurrentDay-1;
                    }
                    else if (temp_1 == 0) {
                        areaData.firstEadge = areaData.firstMark;
                    }
                    let temp_2 = (tData.date.current.getFullYear() * 12 + tData.date.current.getMonth())
                        - (tData.date.out.getFullYear() * 12 + tData.date.out.getMonth())
                    console.log("temp_2 = " + temp_2);
                    if (temp_2 < 0) {
                        areaData.secondEadge = areaData.firstCurrentDay + areaData.currentDaysCount;
                    } else if (temp_2 == 0) {
                        areaData.secondEadge = areaData.secondMark;
                    }
                }
            }
            let cells = this.cells;
            aux_calendars.drawMonth(cells, areaData);
        },
        showView_current() {
           
        },
        drawMonth(cells, areaData) {
            for (var v = 0, b = 0, n = 1; v < 42; v++) {
                if (v < areaData.firstCurrentDay) {
                    cells[v].innerHTML = areaData.lastDaysCount - areaData.firstCurrentDay + v + 1;
                    cells[v].className = "calendar__normalCells calendar__mutedCells";
                }
                else
                    if (v >= areaData.firstCurrentDay && v < (areaData.currentDaysCount + areaData.firstCurrentDay)) {
                        cells[v].innerHTML = v + 1 - areaData.firstCurrentDay;
                        cells[v].className = "calendar__normalCells";
                    }
                    else
                        if (v >= (areaData.currentDaysCount + areaData.firstCurrentDay)) {
                            cells[v].innerHTML = v + 1 - areaData.currentDaysCount - areaData.firstCurrentDay;
                            cells[v].className = "calendar__normalCells calendar__mutedCells";
                        }
                if (v == areaData.today) { cells[v].className = "calendar__normalCells calendar__greenCells" }
                if (v == areaData.firstMark || v == areaData.secondMark) { cells[v].className = "calendar__normalCells calendar__blueCells" }
                if (areaData.firstEadge != null && areaData.secondEadge != null &&
                    v > areaData.firstEadge && v < areaData.secondEadge) { cells[v].className = "calendar__middleCells" }
            }
        },
        //#endregion View interaction Methods

        daysInMonth(year, month) {
            return new Date(year, month+1, 0).getDate();
        },
        getTrueDay(date) {
            let result = date.getDay();
            return (result == 0) ? 6 : result-1;
        },
        getView(id){
            for(var i = 0; i<aux_calendars.views.length; i++)
            {
                if(aux_calendars.views[i].id == id )
                {
                    return aux_calendars.views[i];
                }
            }
            return null;
        },
        updateDataLitener(event){
            console.log("updateDataLitener");
            let tmp = aux_calendars.getView(event.detail.item.id)
            console.log(event.detail.item.id);
            console.log(tmp);
            if(tmp == null){return;}
            aux_calendars.showView.apply(tmp, [event.detail])
            console.log("updateDataLitener");
            console.log(event.detail);
        },
        click_handler(event) {
            console.log(event.target.getAttribute(aux_calendars.attr_name.use_as));
            let tc = aux_calendars.pullToCurrent(this.id);
            let tItem = tc.item;
            let tView = tc.view;
            switch(event.target.getAttribute(aux_calendars.attr_name.use_as)){
                case aux_calendars.attr_values.use_as.base:
                    break;
                case aux_calendars.attr_values.use_as.incMonth:
                    aux_calendars.setData.apply(tItem,[tItem.date.in, tItem.date.out, aux_calendars.incMonth(tItem.date.current)]);
                    break;
                case aux_calendars.attr_values.use_as.decMonth:
                    aux_calendars.setData.apply(tItem,[tItem.date.in, tItem.date.out, aux_calendars.decMonth(tItem.date.current)]);
                    break;
                case aux_calendars.attr_values.use_as.day:
                    let cells = tView.cells;
                    let index = (Array.prototype.slice.call(cells)).indexOf(event.target);
                    let tmpDate = index -
                        (new Date(
                            tItem.date.current.getFullYear(),
                            tItem.date.current.getMonth(), 1)).
                        getDay() ;
                    let activeDay = index + 1 - aux_calendars.getTrueDay(new Date(tItem.date.current.getFullYear(), tItem.date.current.getMonth(), 1));
                    console.log("activeDay = " + activeDay);
                    if (activeDay > 0 && activeDay < aux_calendars.daysInMonth(tItem.date.current.getFullYear(), tItem.date.current.getMonth())) {
                        if (tItem.date.in == null) {
                            tItem.date.in = new Date(tItem.date.current.getFullYear(), tItem.date.current.getMonth(), activeDay);
                            console.log("DATA IN = " + tItem.date.in);
                        } else if (tItem.date.out == null) {
                            tItem.date.out = new Date(tItem.date.current.getFullYear(), tItem.date.current.getMonth(), activeDay);
                            console.log("DATA OUT = " + tItem.date.out);
                        }
                    }
                    aux_calendars.setData.apply(tItem,[tItem.date.in, tItem.date.out, tItem.date.current]);
                    break;
                default:
                    break;
            }
        },
        acceptDataLitener(event){
            let x = aux_calendars.getData(event.target.id);
            let y = aux_calendars.getView(event.target.id);
            if(x == null||y==null){ console.error("acceptDataLitener : NULL"); return;}
            y.arrival.value = x.date.in;
            y.departure.value = x.date.out;
        },
        clearDataLitener(){
            let x = aux_calendars.getData(event.target.id);
            if(x == null){onsole.error("acceptDataLitener : NULL"); return;}
            aux_calendars.resetData.apply(x);
        },
    }
    //#endregion  aux_calendars
    document.addEventListener(aux_calendars.events_name.calendars_change, aux_calendars.updateDataLitener)
    document.addEventListener(aux_calendars.events_name.calendars_accept, aux_calendars.acceptDataLitener)
    document.addEventListener(aux_calendars.events_name.calendars_clear, aux_calendars.clearDataLitener)
}

function calendarInit(){
    let sripts= document.getElementsByTagName("script");
    let base = scripts[scripts.length-1].parentNode;
    if(base.getAttribute(aux_calendars.attr_name.use_as) == aux_calendars.use_as.base)
    {
        aux_calendars.addData(base.id);
        aux_calendars.addView(base.id);
        aux_calendars.pullToCurrent(base.id);
        aux_calendars.showView.apply(aux_calendars.current.view,[ aux_calendars.current.item]);
        base.onclick = aux_calendars.click_handler;
        base.addEventListener(
            "clear",
            aux_calendars.clearDataLitener
            );
        base.addEventListener(
            "accept", 
            aux_calendars.acceptDataLitener
        );
    }
    else{
        console.error("calendarInit() : atrribute - " + aux_calendars.attr_name.use_as  + 
        ", must be equal - " + aux_calendars.use_as.base );
    }
}




calendarInit();
