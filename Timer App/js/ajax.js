//*** api constants
var API_TOKEN = 'Nh42O4r4cd8NonuzkuYzJT';
//var SERVICE_URI_BASE = 'http://localhost/empiricaltimer/MobileService.asmx/';
var SERVICE_URI_BASE = 'http://timerapp.empiricalbioscience.com.asp1-27.dfw1-2.websitetestlink.com/MobileService.asmx/';

var FUNC_GET_USER_BY_UUID = SERVICE_URI_BASE + 'GetUserByUUID';
var FUNC_NEW_USER_BY_UUID = SERVICE_URI_BASE + 'NewUserByUUID';
var FUNC_SET_USER_BY_UUID = SERVICE_URI_BASE + 'SetUserByUUID';
var FUNC_GET_APP_SETTINGS_BY_UUID = SERVICE_URI_BASE + 'GetAppSettingsByUUID';
var FUNC_SET_APP_SETTINGS_BY_UUID = SERVICE_URI_BASE + 'SetAppSettingsByUUID';

var FUNC_GET_PRESET_TIMERS = SERVICE_URI_BASE + 'GetPresetTimers';
var FUNC_GET_CUSTOM_TIMERS = SERVICE_URI_BASE + 'GetCustomTimersByUUID';
var FUNC_NEW_CUSTOM_TIMER = SERVICE_URI_BASE + 'NewCustomTimerByUUID';
var FUNC_SET_CUSTOM_TIMER_BY_ID = SERVICE_URI_BASE + 'SetCustomTimerById';
var FUNC_DELETE_CUSTOM_TIMER_BY_ID = SERVICE_URI_BASE + 'DeleteCustomTimerById';

//*** ajax constants
var AJAX_TYPE = 'POST'; //*** --- or --- GET
var AJAX_DATATYPE = 'json'; //*** 'jsonp' is required for cross-domain requests; use 'json' for same-domain requests
var AJAX_CONTENTTYPE = 'application/json; charset=utf-8';
var AJAX_TIMEOUT = 30000; //*** 30 seconds

function makeAjaxCall(url, requestJsonData) {

    return $.ajax({
        beforeSend: checkConnBeforeAjaxRequest,
        type: AJAX_TYPE,
        contentType: AJAX_CONTENTTYPE,
        dataType: AJAX_DATATYPE,
        timeout: AJAX_TIMEOUT,
        cache: false,
        abortOnRetry: true,
        url: url,
        data: requestJsonData,
        async: true
    });

}