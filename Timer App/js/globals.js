/*** USED FOR DEBUGGING ONLY ****/
window.onerror = function (message, url, lineNumber) {
    var n = url.lastIndexOf("/") + 1;
    var fileName = url.substring(n, url.length);
    alert("\"" + message + "\" on line " + lineNumber + " in \"" + fileName + "\"");
};
/*******************************/

//*** application constants
var UUID = '234234-23423';
var NEW_USER = true;
var PRESET_TIMERS_DATA = [];
var CUSTOM_TIMERS_DATA = [];

var TARGET_TIMER_IX = 0; //*** 1-Based Indexing
var SOURCE_TIMER_IX = 0; //*** 0-Based Indexing
var SCROLLER; //*** serves KENDO scrollView object

var timer1 = {};
timer1.sourceid = 0;
timer1.type = '';
timer1.loaded = false;
timer1.running = false;

var timer2 = {};
timer2.sourceid = 0;
timer2.type = '';
timer2.loaded = false;
timer2.running = false;

var timer3 = {};
timer3.sourceid = 0;
timer3.type = '';
timer3.loaded = false;
timer3.running = false;

var timer4 = {};
timer4.sourceid = 0;
timer4.type = '';
timer4.loaded = false;
timer4.running = false;

var timer5 = {};
timer5.sourceid = 0;
timer5.type = '';
timer5.loaded = false;
timer5.running = false;

var timer6 = {};
timer6.sourceid = 0;
timer6.type = '';
timer6.loaded = false;
timer6.running = false;


String.prototype.toHHMMSS = function() {

    var secNum = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(secNum / 3600);
    var minutes = Math.floor((secNum - (hours * 3600)) / 60);
    var seconds = secNum - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    //var time = hours + ':' + minutes + ':' + seconds;
    var time = { };
    time.hours = hours;
    time.minutes = minutes;
    time.seconds = seconds;

    return time;

};


function convertHHMMSStoSS(hours, minutes, seconds) {

    var totalSeconds = 0;

    totalSeconds += (parseInt(hours) * 3600);
    totalSeconds += (parseInt(minutes) * 60);
    totalSeconds += parseInt(seconds);

    return totalSeconds;

}


function convertDateTimetoDate(dateTime) {

    var d = new Date(dateTime);

    var currDate = d.getDate();
    var currMonth = d.getMonth();
    currMonth++;
    var currYear = d.getFullYear();

    var date = currMonth + "/" + currDate + "/" + currYear;

    return date;

}