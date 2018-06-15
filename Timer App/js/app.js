//*** GLOBAL VARIABLES
//*** track event listener status
var LISTENER_EVENT;

//*** global identifier for the current ajax call
var AJAX_REQUEST;

//*** used to show external website pop-up message only once.
// var EXTERNAL_WEBSITE_CONFIRMED;


//*** GLOBAL LISTENERS
document.addEventListener('DOMContentLoaded', domLoaded, false);
window.addEventListener('load', bodyLoaded, false);

//** HAPPENS FIRST
function domLoaded() {
    app.initialize();
    //alert('Dom Loaded');
}


//** HAPPENS SECOND AFTER DOM LOAD
function bodyLoaded() {
    //alert('Body Loaded');
}


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'resume', 'deviceready', 'offline', 'online', 'pause' and 'backbutton'(Android).
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
        document.addEventListener('online', this.onOnline, false);
        document.addEventListener('offline', this.onOffline, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //** HAPPENS THIRD AFTER DOM & BODY LOADS RESPECTIVELY IN THAT ORDER
        app.receivedEvent('deviceready');
    },
    // PAUSE Event Handler
    //
    onPause: function() {
        //*** what to do when app is put into the background
        app.receivedEvent('pause');
    },
    // RESUME Event Handler
    //
    onResume: function() {
        //*** what to do when app is loaded back
        app.receivedEvent('resume');
    },
    // OFFLINE Event Handler
    //
    onOffline: function() {
        //*** what happens when device goes offline
        app.receivedEvent('offline');
    },
    // ONLINE Event Handler
    //
    onOnline: function() {
        //*** what happens when device goes online
        app.receivedEvent('online');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        LISTENER_EVENT = id;

        if (id == 'deviceready') {

            //*** set device-specific variables
            DEVICE_UUID = getDeviceUUID();
            DEVICE_VERSION = parseFloat(getDeviceVersion());
            DEVICE_WIDTH = parseFloat(getDeviceWidth());
            DEVICE_HEIGHT = parseFloat(getDeviceHeight());

            //*** set GLOBAL vars
            // resetGlobalVars();

            //*** DEVICE FUNCS.
            // prepCamera();
            // checkDevice();

            //*** install plugins
            // initPlugins();

            //*** apply kendo UI
            initKendoUI();

            //*** UI settings
            bindTemplates(); //*** needs to happen after initKendoUI() is called.

            // initAppUISettings();
            // initKendoListviewTemplates(); //*** needs to happen after initKendoUI() is called.
            // resetUIObjects();
            // setAppDataFromLocal();

            execOnlineEvents('deviceReady', null);
            
        } else if (id == 'pause') {

            //*** used to briefly show the splashscreen on 'resume'
            // navigator.splashscreen.show();

            //*** bug fix: pop over window remains open on 'resume'
            // closeAllPopOvers();

        } else if (id == 'resume') {

            //*** set device-specific variables
            DEVICE_VERSION = parseFloat(getDeviceVersion());
            // resetGlobalVars();
            // resetUIObjects();
            execOnlineEvents('resume', null);
            
        } else if (id == 'offline') {
            
            // alert('You\'re Offline!');
            showErrorMsg('connection');
            
        } else if (id == 'online') {
            
            // alert('You\'re Online!');
            
        }

    }
};


function execOnlineEvents(eventID, param) {

    // console.log('*** EVENT: ' + eventID);

    if (checkConnection()) {

        // hideOfflineMsg();

        if (eventID == 'deviceReady') {

            // turnLightsOff();

            //getGeoLocation(); //*** set config.xml <preference name="EnableLocation"> value to 'true' if need to be used.

            //setAppDataFromServer();

            getUserProfile();
            getPresetTimers();
            getCustomTimers();

            //setTimeout(function() {
                navigator.splashscreen.hide();
                //turnLightsOn(0);
            //}, 1500);

        } else if (eventID == 'resume') {

            // turnLightsOff();

            // getGeoLocation(); //*** set config.xml <preference name="EnableLocation"> value to 'true' if need to be used.

            // if (USER_EMAIL.length == 0) {
            //    navigateTo('#register', 0);
            // }
            // setTimeout(function() {
            //     navigator.splashscreen.hide();
            //     turnLightsOn(0);
            // }, 1500);
            
        } else if (eventID == 'openChildBrowser') {

            // openChildBrowser(param); //*** this uses a 3rd party plugin : ChildBrowser.

        } else if (eventID == 'openInAppBrowser') {

            // openInAppBrowser(param); //*** this uses the built-in default InAppBrowser plugin.

        } else if (eventID == 'openSystemBrowser') {

            // openSystemBrowser(param); //*** this uses the built-in default InAppBrowser plugin.
 
        }

    } else {

        if (eventID == 'deviceReady' || eventID == 'resume') {

            //*** do not show offline message if offline and app is being launched or resumed.
            // getGeoLocation(); //*** set config.xml <preference name="EnableLocation"> value to 'true' if need to be used.
            navigator.splashscreen.hide();
            LIGHTS_ON = true;

        } else {

            showErrorMsg('connection');
            //showOfflineMsg(eventID, param);

        }

    }

}


function initKendoUI() {

    //*** EXECUTES:
    //*** on deviceready

    window.kendoMobileApplication = new kendo.mobile.Application($(document.body), {
        useNativeScrolling: false
        ,skin: "ios7"
        ,platform: {
            device: "iphone",     // Mobile device, can be "ipad", "iphone", "android", "fire", "blackberry", "wp", "meego"
            name: "ios",          // Mobile OS, can be "ios", "android", "blackberry", "wp", "meego"
            ios: true,            // Mobile OS name as a flag
            // majorVersion: 6,      // Major OS version
            // minorVersion: "0.0",  // Minor OS versions
            // flatVersion: "700",   // Flat OS version for easier comparison
            appMode: true,       // Whether running in browser or in AppMode/PhoneGap/Icenium.
            tablet: false        // If a tablet - tablet name or false for a phone.
        }
    });
    
}


function resetGlobalVars() {

    //*** EXECUTES:
    //*** - when app inits on (deviceready and resume)

    LISTENER_EVENT = null;
    // EXTERNAL_WEBSITE_CONFIRMED = false;
    AJAX_REQUEST = null;

    //*** device.js
    // GEO_LATITUDE = 0;
    // GEO_LONGITUDE = 0;
    // GEO_TIMESTAMP = null;
    // GEO_STATE_SHORT = null;
    // GEO_STATE_LONG = null;

    // console.log('*** RESET GLOBAL VARS ***');

}


function callPhoneNumber(e) {

    var data = e.button.data();
    var dataId = data.id; //*** comes from 'data-id', use to detect the origin of click event.
    
    window.location.href = 'tel:' + dataId;

}


function emailDistBtnClick(e) {

    var data = e.button.data();
    var dataId = data.id; //*** comes from 'data-id', use to detect the origin of click event.
    
    window.location.href = 'mailto:' + dataId;

}


function checkConnBeforeAjaxRequest() {

    var valid;

    if (checkConnection()) {
        valid = true;
    } else {
        vaild = false;
    }

    return valid;

}


function bindTemplates() {

    //    $('#custom-timers-list').kendoMobileListView({ //*** <li>s get added automatically to <ul>.
    //        template: $('#custom-timers-template').html() //*** template is in app.html.
    //        // ,dataSource: kendo.data.DataSource.create({data: data})
    //    });

    $('#preset-timers-list').kendoMobileListView({ //*** <li>s get added automatically to <ul>.
        template: $('#preset-timers-template').html() //*** template is in app.html.
        // ,dataSource: kendo.data.DataSource.create({data: data})
    });

    $('#custom-timers-list').kendoMobileListView({ //*** <li>s get added automatically to <ul>.
        template: $('#custom-timers-template').html() //*** template is in app.html.
        // ,dataSource: kendo.data.DataSource.create({data: data})
    });

    $('#custom-timers-grid').kendoMobileListView({ //*** <li>s get added automatically to <ul>.
        template: $('#custom-timers-grid-template').html() //*** template is in app.html.
        // ,dataSource: kendo.data.DataSource.create({data: data})
    });

}


function bindPresetTimersList() {

//    var presetTimersTemplate = kendo.template($('#preset-timers-template').html());
//    var execPresetTimersTemplate = presetTimersTemplate(PRESET_TIMERS_DATA); //*** execute the template
//    $('#preset-timers-list').html(execPresetTimersTemplate); //*** append the result

    $('#preset-timers-list').data('kendoMobileListView').dataSource.data(PRESET_TIMERS_DATA);

}


function bindCustomTimersList() {

//    var customTimersTemplate = kendo.template($('#custom-timers-template').html());
//    var execCustomTimersTemplate = customTimersTemplate(CUSTOM_TIMERS_DATA); //*** execute the template
//    $('#custom-timers-list').html(execCustomTimersTemplate); //*** append the result

    $('#custom-timers-list').data('kendoMobileListView').dataSource.data(CUSTOM_TIMERS_DATA);

}


function bindCustomTimersGrid() {

    //if (LIGHTS_ON) {

    for (var i = 0; i < CUSTOM_TIMERS_DATA.length; i++) {
        CUSTOM_TIMERS_DATA[i].onClickEvent = 'openTimerEditor(' + CUSTOM_TIMERS_DATA[i].id + ')';
    }

    //*** replace the existing data with modified array.
    //*** bug: this kills the loading indicator.
    //*** solution: check LIGHTS_ON to execute.
    $('#custom-timers-grid').data('kendoMobileListView').dataSource.data(CUSTOM_TIMERS_DATA);

    //}

}


function attachTimer(timerType, data) {

    var ix = TARGET_TIMER_IX; // ix - 1 is the page it gets attached to
    var page = ix - 1;
    
    // var targetDay = new Date();
    // console.log(targetDay);

    // targetDay = new Date(targetDay.getTime() + hours*3600000);
    // targetDay = new Date(targetDay.getTime() + minutes*60000);
    // targetDay = new Date(targetDay.getTime() + seconds*1000);
    // console.log(targetDay);

    // $('#timer-'+ix).countdown({
    //  until: targetDay,
    //  labels: ['Years', 'Months', 'Weeks', 'Days', 'H', 'M', 'S'],
    //  labels1: ['Years', 'Months', 'Weeks', 'Days', 'H', 'M', 'S'], 
    //  padZeroes: true, 
    //  format: 'HMS',
    //  timeSeparator: ':',
    //  compact: false,
    //  onTick: ticker
    // });

    // -- OR --
    
    if (ix >= 1 && ix <= 6) {

        window['timer' + ix].type = timerType;
        window['timer' + ix].sourceid = data.id;
        window['timer' + ix].loaded = true;

        setTimeout(function () {

            var timerTitle = data.title;
            $('#timer-title-' + ix).text(timerTitle);

            var timerDescr = data.descr;
            $('#timer-descr-' + ix).text(timerDescr);

            $('#timer-' + ix).countdown({
                until: data.seconds,
                labels: ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'],
                labels1: ['Years', 'Months', 'Weeks', 'Days', 'Hour', 'Minute', 'Second'],
                padZeroes: true,
                format: 'HMS',
                timeSeparator: ':',
                //description: 'Timer ' + ix,
                compact: false,
                onTick: ticker
            });

            //*** pause the timer after attaching / disable auto-start
            $('#timer-' + ix).countdown('pause');
            $('#timer-' + ix).removeClass('highlight');

            //*** hide TIMER X and show the attached timer
            $('.timer-container').eq(page).show();
            $('.empty-outer-box').eq(page).hide();

            //*** scroll to the page timer gets attached to
            SCROLLER.scrollTo(page);

            //*** change pager border to blue
            $('.km-pages li:nth-of-type(' + ix + ')').css('border-color', '#007AFF');

        }, 1200);

    }

}


function startTimer(e) {

    var obj = e.sender.element[0];
    
    if (!$(obj).hasClass('btn-off')) {

        var page = SCROLLER.page; //*** 0-based indexing
        var ix = page + 1;

        window['timer' + ix].running = true;
        toggleControls('started');
        $('#timer-' + ix).countdown('resume');

    }

}


function pauseTimer() {

    var page = SCROLLER.page; //*** 0-based indexing
    var ix = page + 1;

    //$('#timer-'+ix).countdown('option', 'onExpiry', timerDone(ix));
    window['timer' + ix].running = false;
    toggleControls('paused');
    $('#timer-' + ix).countdown('pause');

}


function destroyTimer(e) {

    var obj = e.sender.element[0];

    if (!$(obj).hasClass('btn-off')) {

        var page = SCROLLER.page; //*** 0-based indexing
        var ix = page + 1;

        //*** uncheck from checkbox list
        var timerType = window['timer' + ix].type;
        var sourceId = window['timer' + ix].sourceid;
//        var timerNumber = findSourceTimerNumber(timerType, sourceId);
//        var liId = timerType + '-' + timerNumber;
//        var checkbox = $('#' + liId).find('input[type="checkbox"]');

        var checkbox = $('ul.km-listview li label#' + timerType + '-' + sourceId).find('input[type="checkbox"]');
        $(checkbox).prop('checked', false);

        //*** reset timer object's properties
        window['timer' + ix].type = '';
        window['timer' + ix].sourceid = 0;
        window['timer' + ix].loaded = false;
        window['timer' + ix].running = false;

        //*** hide control buttons
        toggleControls('destroyed');

        //*** destroy timer
        $('#timer-' + ix).countdown('destroy');
        
        //*** empty / clear title & description
        $('#timer-title-' + ix).html('&nbsp;');
        $('#timer-descr-' + ix).html('&nbsp;');
        
        //*** hide timer and show the TIMER X text
        $('.timer-container').eq(page).hide();
        $('.empty-outer-box').eq(page).show();

        //*** change pager border back to grey
        $('.km-pages li:nth-of-type(' + ix + ')').css('border-color', '#A0A0A0');
    
    }

}


function timerDone(ix) {

    window['timer' + ix].running = false;
    console.log('Timer ' + ix + ' is done.');

}


function ticker(periods) {

    //console.log(periods[4] + ':' + pad(periods[5]) + ':' + pad(periods[6]))
    if ($.countdown.periodsToSeconds(periods) === 10) {
        $(this).addClass('highlight');
    }
    if ($.countdown.periodsToSeconds(periods) === 0) {
        var id = $(this).attr('id');
        var ix = id.substring(6, id.length); //** remove 'timer-' from id
        timerDone(ix);
    }
}


function findTimerIndexById(arr, id) {

    var ix = 0;

    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
            ix = i;
            break;
        }
    }

    return ix;

}


function findTargetTimerIndex(timerType, timerId) {

    var ix = 0;
    var timer;

    for (var i = 1; i <= 6; i++) {
        timer = window['timer' + i];
        if (timer.type == timerType && timer.sourceid == timerId) {
            ix = i - 1;
            break;
        };
    }

    return ix;

}


function findEmptySlot() {

    window.TARGET_TIMER_IX = 0;
    var timerLoaded;

    for (var i = 1; i <= 6; i++) {
        timerLoaded = window['timer' + i].loaded;
        if (!timerLoaded) {
            window.TARGET_TIMER_IX = i;
            break;
        };
    }

}


function deleteTimer(e) {

    //*** PREVENTS THE 2nd TAP
    e.preventDefault();

    turnLightsOff('Working...');

    var id = $('#customTimerID').val();
    if (parseInt(id) > 0) {

        var ix = findTimerIndexById(CUSTOM_TIMERS_DATA, id);

        var params = {};
        params.UUID = UUID;
        params.ID = id;
        var requestJsonData = JSON.stringify(params);

        var ajaxCall = makeAjaxCall(FUNC_DELETE_CUSTOM_TIMER_BY_ID, requestJsonData);
        ajaxCall.success(function (responseJsonData) {

            //console.log(responseJsonData);
            var dataLength = responseJsonData.d.length; //*** 1-based indexing
            if (dataLength > 0) {

                var dataArray = responseJsonData.d[0];

                if (dataArray.Server_Error) {

                    //*** used for debugging and authentication failure action
                    console.log(dataArray);

                } else if (dataArray.Server_Response == 'ok') {

                    //*** update local data array
                    CUSTOM_TIMERS_DATA.splice(ix, 1);

                    //*** apply changes to listviews
                    bindCustomTimersGrid();
                    bindCustomTimersList();
                    autoCheckLoadedTimers('custom');

                    //*** done
                    closeTimerEditor(e);
                    turnLightsOn();

                }

            } else {

                //*** ajax call returned nothing

            }

        });

    }    

}


function saveTimer(e) {

    //*** PREVENTS THE 2nd TAP
    e.preventDefault();

    var id = $('#customTimerID').val();
    var title = $('#timerTitle').val();
    var descr = $('#timerDescription').val();
    var hours = $('#timerHours').val();
    var minutes = $('#timerMinutes').val();
    var seconds = $('#timerSeconds').val();
    var totalSeconds = convertHHMMSStoSS(hours, minutes, seconds);

    //*** Validate Form ***//
    var formValid = true;
    
    if (title.length == 0 || 
        descr.length == 0 ||
        totalSeconds == 0) {
        formValid = false;
        showErrorMsg('form');
    }

    if (formValid) {

        turnLightsOff('Working...');

        var params = {};
        params.UUID = UUID;
        params.ID = id;
        params.Name = title;
        params.Description = descr;
        params.Hours = hours;
        params.Minutes = minutes;
        params.Seconds = seconds;
        var requestJsonData = JSON.stringify(params);

        var ajaxCall;
        var dataLength = 0;
        var dataArray;

        if (parseInt(id) > 0) { //*** update existing timer

            //*** update server
            ajaxCall = makeAjaxCall(FUNC_SET_CUSTOM_TIMER_BY_ID, requestJsonData);
            ajaxCall.success(function (responseJsonData) {

                //console.log(responseJsonData);
                dataLength = responseJsonData.d.length; //*** 1-based indexing
                if (dataLength > 0) {

                    dataArray = responseJsonData.d[0];

                    if (dataArray.Server_Error) {

                        //*** used for debugging and authentication failure action
                        console.log(dataArray);

                    } else if (dataArray.Server_Response == 'ok') {

                        //*** update local data array
                        var ix = findTimerIndexById(CUSTOM_TIMERS_DATA, id);
                        CUSTOM_TIMERS_DATA[ix].title = title;
                        CUSTOM_TIMERS_DATA[ix].descr = descr;
                        CUSTOM_TIMERS_DATA[ix].seconds = totalSeconds;

                        //*** apply changes to listviews
                        bindCustomTimersGrid();
                        bindCustomTimersList();
                        autoCheckLoadedTimers('custom');

                        //*** done
                        closeTimerEditor(e);
                        turnLightsOn();

                    }

                } else {

                    //*** ajax call returned nothing

                }

            });

        } else { //*** create new custom timer

            //*** update server
            ajaxCall = makeAjaxCall(FUNC_NEW_CUSTOM_TIMER, requestJsonData);
            ajaxCall.success(function (responseJsonData) {

                //console.log(responseJsonData);
                dataLength = responseJsonData.d.length; //*** 1-based indexing
                if (dataLength > 0) {

                    dataArray = responseJsonData.d[0];

                    if (dataArray.Server_Error) {

                        //*** used for debugging and authentication failure action
                        console.log(dataArray);

                    } else if (dataArray.Server_Response == 'ok') {

                        //*** update local data array
                        CUSTOM_TIMERS_DATA.push({
                            id: dataArray.ID,
                            title: title,
                            descr: descr,
                            seconds: totalSeconds,
                            date: convertDateTimetoDate(dataArray.CreateDate)
                        });

                        //*** apply changes to listviews
                        bindCustomTimersGrid();
                        bindCustomTimersList();
                        autoCheckLoadedTimers('custom');

                        //*** done
                        closeTimerEditor(e);
                        turnLightsOn();

                    }

                } else {

                    //*** ajax call returned nothing

                }

            });

        }

    }

}


function getUserProfile() {

    var params = {};
    params.UUID = UUID;
    var requestJsonData = JSON.stringify(params);
    
    var ajaxCall = makeAjaxCall(FUNC_GET_USER_BY_UUID, requestJsonData);
    ajaxCall.success(function (responseJsonData) {

        //console.log(responseJsonData);
        var dataLength = responseJsonData.d.length; //*** 1-based indexing
        alert(dataLength);
        if (dataLength > 0) {

            var dataArray = responseJsonData.d[0];

            if (dataArray.Server_Error) {

                console.log(dataArray); //*** used for debugging and authentication failure action

            } else if (dataArray.UUID) {

                window.NEW_USER = false;

                $('#userFirstName').val(dataArray.FirstName);
                $('#userLastName').val(dataArray.LastName);
                $('#userEmail').val(dataArray.Email);
                $('#userInstitution').val(dataArray.Institution);
                $('#userPosition').val(dataArray.Position);
                $('#userPhone').val(dataArray.Phone);

                getAppSettings();

            }

        } else {

            //*** ajax call returned nothing
            openUserProfileEditor();

        }

    });

}


function getAppSettings() {

    var params = {};
    params.UUID = UUID;
    var requestJsonData = JSON.stringify(params);

    var ajaxCall = makeAjaxCall(FUNC_GET_APP_SETTINGS_BY_UUID, requestJsonData);
    ajaxCall.success(function (responseJsonData) {

        //console.log(responseJsonData);
        var dataLength = responseJsonData.d.length; //*** 1-based indexing
        if (dataLength > 0) {

            var dataArray = responseJsonData.d[0];

            if (dataArray.Server_Error) {

                console.log(dataArray); //*** used for debugging and authentication failure action

            } else {

                if (dataArray.SoundAlerts == 'True') {
                    $('#settingsSoundAlerts').prop('checked', true);
                } else {
                    $('#settingsSoundAlerts').prop('checked', false);
                }

                if (dataArray.ConfirmationDialogs == 'True') {
                    $('#settingsConfirmDialogs').prop('checked', true);
                } else {
                    $('#settingsConfirmDialogs').prop('checked', false);
                }

            }

        } else {

            //*** ajax call returned nothing
            $('#settingsSoundAlerts').prop('checked', true);
            $('#settingsConfirmDialogs').prop('checked', true);

        }

    });

}


function setAppSettings(e) {

    //console.log(e.checked); //true of false

    var params = {};
    params.UUID = UUID;
    params.SoundAlerts = $('#settingsSoundAlerts').prop('checked');
    params.ConfirmationDialogs = $('#settingsConfirmDialogs').prop('checked');
    var requestJsonData = JSON.stringify(params);

    var ajaxCall = makeAjaxCall(FUNC_SET_APP_SETTINGS_BY_UUID, requestJsonData);
    ajaxCall.success(function (responseJsonData) {

        //console.log(responseJsonData);
        var dataLength = responseJsonData.d.length; //*** 1-based indexing
        if (dataLength > 0) {

            var dataArray = responseJsonData.d[0];

            if (dataArray.Server_Error) {

                //*** used for debugging and authentication failure action
                console.log(dataArray);

            } else if (dataArray.Server_Response == 'ok') {

                //console.log('UPDATED PROFILE!!');

            }

        } else {

            //*** ajax call returned nothing

        }

    });

}


function newUserProfile(e) {

    //*** PREVENTS THE 2nd TAP
    e.preventDefault();

    var email = $('#userEmail').val();
    var firstName = $('#userFirstName').val();
    var lastName = $('#userLastName').val();
    var institution = $('#userInstitution').val();
    var position = $('#userPosition').val();
    var phone = $('#userPhone').val();

    //*** Validate Form ***//
    var formValid = true;

    if (email.length == 0 ||
        firstName.length == 0 ||
        lastName.length == 0 ||
        institution.length == 0 ||
        position.length == 0 ||
        phone.length == 0) {
        formValid = false;
        showErrorMsg('form');
    }

    if (formValid) {

        turnLightsOff('Working...');

        var params = {};
        params.UUID = UUID;
        params.Email = email;
        params.FirstName = firstName;
        params.LastName = lastName;
        params.Institution = institution;
        params.Position = position;
        params.Phone = phone;
        var requestJsonData = JSON.stringify(params);

        var ajaxCall = makeAjaxCall(FUNC_NEW_USER_BY_UUID, requestJsonData);
        ajaxCall.success(function (responseJsonData) {

            //console.log(responseJsonData);
            var dataLength = responseJsonData.d.length; //*** 1-based indexing
            if (dataLength > 0) {

                var dataArray = responseJsonData.d[0];

                if (dataArray.Server_Error) {

                    //*** used for debugging and authentication failure action
                    console.log(dataArray);

                } else if (dataArray.Server_Response == 'ok') {

                    //console.log('UPDATED PROFILE!!');
                    window.NEW_USER = false;
                    closeUserProfileEditor(e);
                    turnLightsOn();

                }

            } else {

                //*** ajax call returned nothing

            }

        });

    }

}


function updateUserProfile(e) {

    //*** PREVENTS THE 2nd TAP
    e.preventDefault();

    var email = $('#userEmail').val();
    var firstName = $('#userFirstName').val();
    var lastName = $('#userLastName').val();
    var institution = $('#userInstitution').val();
    var position = $('#userPosition').val();
    var phone = $('#userPhone').val();
    
    //*** Validate Form ***//
    var formValid = true;

    if (email.length == 0 ||
        firstName.length == 0 ||
        lastName.length == 0 ||
        institution.length == 0 ||
        position.length == 0 ||
        phone.length == 0) {
        formValid = false;
        showErrorMsg('form');
    }

    if (formValid) {

        turnLightsOff('Updating...');

        var params = {};
        params.UUID = UUID;
        params.Email = $('#userEmail').val();
        params.FirstName = $('#userFirstName').val();
        params.LastName = $('#userLastName').val();
        params.Institution = $('#userInstitution').val();
        params.Position = $('#userPosition').val();
        params.Phone = $('#userPhone').val();
        var requestJsonData = JSON.stringify(params);

        var ajaxCall = makeAjaxCall(FUNC_SET_USER_BY_UUID, requestJsonData);
        ajaxCall.success(function (responseJsonData) {

            //console.log(responseJsonData);
            var dataLength = responseJsonData.d.length; //*** 1-based indexing
            if (dataLength > 0) {

                var dataArray = responseJsonData.d[0];

                if (dataArray.Server_Error) {

                    //*** used for debugging and authentication failure action
                    console.log(dataArray);

                } else if (dataArray.Server_Response == 'ok') {

                    //console.log('UPDATED PROFILE!!');
                    closeUserProfileEditor(e);
                    turnLightsOn();

                }

            } else {

                //*** ajax call returned nothing

            }

        });

    }

}


function getPresetTimers() {

    var params = {};
    var requestJsonData = JSON.stringify(params);

    var ajaxCall = makeAjaxCall(FUNC_GET_PRESET_TIMERS, requestJsonData);
    ajaxCall.success(function (responseJsonData) {

        //console.log(responseJsonData);
        var dataLength = responseJsonData.d.length; //*** 1-based indexing
        if (dataLength > 0) {

            var dataArray = responseJsonData.d;

            if (dataArray[0].Server_Error) {

                //*** used for debugging and authentication failure action
                console.log(dataArray);

            } else {

                //*** populate data array
                window.PRESET_TIMERS_DATA = []; //*** clean up
                for (var i = 0; i < dataLength; i++) {
                    //console.log(dataArray[i].Name);
                    PRESET_TIMERS_DATA.push({
                        id: dataArray[i].ID,
                        title: dataArray[i].Name,
                        descr: dataArray[i].Description,
                        seconds: convertHHMMSStoSS(dataArray[i].Hours, dataArray[i].Minutes, dataArray[i].Seconds)
                    });
                }

                //*** bind data array to listviews
                bindPresetTimersList();

            }

        } else {

            //*** ajax call returned nothing

        }

    });

}


function getCustomTimers() {

    var params = {};
    params.UUID = UUID;
    var requestJsonData = JSON.stringify(params);

    var ajaxCall = makeAjaxCall(FUNC_GET_CUSTOM_TIMERS, requestJsonData);
    ajaxCall.success(function (responseJsonData) {

        //console.log(responseJsonData);
        var dataLength = responseJsonData.d.length; //*** 1-based indexing
        if (dataLength > 0) {
            
            var dataArray = responseJsonData.d;
            
            if (dataArray[0].Server_Error) {

                //*** used for debugging and authentication failure action
                console.log(dataArray);
                
            } else {

                //*** populate data array
                window.CUSTOM_TIMERS_DATA = []; //*** clean up
                for (var i = 0; i < dataLength; i++) {
                    //console.log(dataArray[i].Name);
                    CUSTOM_TIMERS_DATA.push({
                        id: dataArray[i].ID,
                        title: dataArray[i].Name,
                        descr: dataArray[i].Description,
                        seconds: convertHHMMSStoSS(dataArray[i].Hours, dataArray[i].Minutes, dataArray[i].Seconds),
                        date: convertDateTimetoDate(dataArray[i].CreateDate)
                    });
                }
                
                //*** bind data array to listviews
                bindCustomTimersList();
                bindCustomTimersGrid();

            }
            
        } else {

            //*** ajax call returned nothing
            
        }

    });

}
