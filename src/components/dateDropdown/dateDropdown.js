let scripts = document.getElementsByTagName("script");
var base = scripts[scripts.length - 1].parentNode;
var tergetIn = base.querySelector("[name=dateIn]").querySelector("[name=target]");
var tergetOut = base.querySelector("[name=dateOut]").querySelector("[name=target]");
var monthTitle = base.querySelector("[name=monthTitle]");
var yearTitle = base.querySelector("[name=yearTitle]");

if (window.calendarsData ==void 0) {
    console.log("calendarsData == undefined")
    var calendarsData = [];
    var monthName = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
}

calendarsData.push(
    {
        id: base.id,
        date: { in: null, out: null, current: new Date() },
        isOpen: 0
    }
);
console.log(calendarsData);



base.onclick = function (event) {
    //monthTitle.innerHTML = tmp.getMonth();
    let target = event.target;
    //console.log(monthTitle.className);
    //console.log(this);
    let calendarData = getCalendarData(this.id);
    let daysCells = this.querySelector("[name=daysArea]");
    switch (event.target.getAttribute("name")) {
        case "next":
            calendarData.date.current = incMonth(calendarData.date.current);

            break;
        case "prev":
            calendarData.date.current = decMonth(calendarData.date.current);
            break;
        case "reset":
            resetCalendar(this.id);
            break;
        case "cell":

            let cells = daysCells.querySelectorAll("td");
            let index = (Array.prototype.slice.call(cells)).indexOf(event.target);


            let tmpDate = index -
                (new Date(
                    calendarData.date.current.getFullYear(),
                    calendarData.date.current.getMonth(), 1)).
                getDay() ;

            console.log(index);
            let activeDay = index + 1 - getTrueDay(new Date(calendarData.date.current.getFullYear(), calendarData.date.current.getMonth(), 1));
            console.log("activeDay = " + activeDay);
            if (activeDay > 0 && activeDay < daysInMonth(calendarData.date.current.getFullYear(), calendarData.date.current.getMonth())) {
                if (calendarData.date.in == null) {
                    calendarData.date.in = new Date(calendarData.date.current.getFullYear(), calendarData.date.current.getMonth(), activeDay);
                    console.log("DATA IN = " + calendarData.date.in);
                } else if (calendarData.date.out == null) {
                    calendarData.date.out = new Date(calendarData.date.current.getFullYear(), calendarData.date.current.getMonth(), activeDay);
                    console.log("DATA OUT = " + calendarData.date.out);
                }
            }
            break;
        default:
            console.log(event.target.getAttribute("name"));
            break;   
    }
    
    drawCalendar(this);
}
function getTrueDay(date) {
    let result = date.getDay();
    return (result == 0) ? 6 : result-1;
}
function resetCalendar(id) {
    let calendarData = getCalendarData(id);
    calendarData.date.in = null;
    calendarData.date.out = null;
    calendarData.date.current = new Date();
}
function incMonth(date) {
    if (date.getMonth() == 11) { return new Date(date.getFullYear() + 1, 0, date.getDate()); }
    return new Date(date.getFullYear(), date.getMonth()+1, date.getDate());
}
function decMonth(date) {
    if (date.getMonth() == 0) { return new Date(date.getFullYear() - 1, 11, date.getDate()); }
    return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
}
function getCalendarData(id) {
    for (var i = 0; i < calendarsData.length; i++) {
        if (calendarsData[i].id == id) {
            return calendarsData[i];
        }
    }
}

function drawCalendar(tmp) {

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
    let data = getCalendarData(tmp.id);
    let today = new Date();
    let tmpDate = new Date(data.date.current.getFullYear(), data.date.current.getMonth(), 1);
    let monthTitle = tmp.querySelector("[name=monthTitle]");
    let yearTitle = tmp.querySelector("[name=yearTitle]");
    let daysCells = tmp.querySelector("[name=daysArea]");
    monthTitle.innerHTML = monthName[data.date.current.getMonth()];
    yearTitle.innerHTML = data.date.current.getFullYear();



    areaData.currentDaysCount = daysInMonth(data.date.current.getFullYear(), data.date.current.getMonth());
    areaData.lastDaysCount = daysInMonth(data.date.current.getFullYear(), data.date.current.getMonth() - 1);
    areaData.firstCurrentDay = getTrueDay(tmpDate);
    if (
        today.getFullYear() == data.date.current.getFullYear() &&
        today.getMonth() == data.date.current.getMonth()
    ) {
        console.log("today.getDate() : " + today.getDate());
        areaData.today = today.getDate() + areaData.firstCurrentDay-1;
    }
    if (data.date.in !== null) {
        if (
            data.date.current.getFullYear() == data.date.in.getFullYear() &&
            data.date.current.getMonth() == data.date.in.getMonth()
        ) {
            areaData.firstMark = data.date.in.getDate() + areaData.firstCurrentDay -1;
        }
        if (data.date.out !== null) {
            if (
                data.date.current.getFullYear() == data.date.out.getFullYear() &&
                data.date.current.getMonth() == data.date.out.getMonth()
            ) {
                areaData.secondMark = data.date.out.getDate() + areaData.firstCurrentDay - 1;
            }
            let temp_1 = (data.date.current.getFullYear() * 12 + data.date.current.getMonth())
                - (data.date.in.getFullYear() * 12 + data.date.in.getMonth())
            console.log("temp_1 = " + temp_1);
            if (temp_1 > 0) {
                areaData.firstEadge = areaData.firstCurrentDay-1;
            }
            else if (temp_1 == 0) {
                areaData.firstEadge = areaData.firstMark;
            }
            let temp_2 = (data.date.current.getFullYear() * 12 + data.date.current.getMonth())
                - (data.date.out.getFullYear() * 12 + data.date.out.getMonth())
            console.log("temp_2 = " + temp_2);
            if (temp_2 < 0) {
                areaData.secondEadge = areaData.firstCurrentDay + areaData.currentDaysCount;
            } else if (temp_2 == 0) {
                areaData.secondEadge = areaData.secondMark;
            }
        }
    }
    let cells = daysCells.getElementsByTagName("td");
    drawMonth(cells, areaData);

    }
function drawMonth(cells, areaData) {
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
}

function daysInMonth(year, month) {
    return new Date(year, month+1, 0).getDate();
} 



function buildCalendar() {
    let backplane = document.createElement("div");
    backplane.name = "calendar";
    backplane.className = "calendar";
    base.append(backplane);

    let tab = document.createElement("table");
    tab.name = "header";
    tab.className = "calendar__header";
    backplane.append(tab);


}
