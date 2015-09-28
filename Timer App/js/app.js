//*** GLOBAL VARIABLES
//*** dirs
// var MASTER_URI_BASE = 'http://m.api.parexusa.com/'
// var SERVICE_URI_BASE = MASTER_URI_BASE +'Service.asmx/';
// var DOC_URI_BASE = MASTER_URI_BASE + 'docs/';
// var PHOTO_URI_BASE = 'photos/';
// var MAP_URI_BASE = MASTER_URI_BASE + 'map.aspx';
// var SINGLE_MAP_URI_BASE = MASTER_URI_BASE + 'map_single.html';

//*** api constants
// var API_TOKEN = 'Nh42O4r4cd8NonuzkuYzJT';
// var FUNC_APP_DATA = SERVICE_URI_BASE + 'GetAppDataFromServer';
// var FUNC_NEW_USER = SERVICE_URI_BASE + 'NewUser';
// var FUNC_SEND_PRODUCT = SERVICE_URI_BASE + 'SendProduct';
// var FUNC_NEW_INQUIRY = SERVICE_URI_BASE + 'NewSupportTicket';
// var FUNC_LOCATOR_REGIONAL_SEARCH = SERVICE_URI_BASE + 'SearchDistributorByRegion';
// var FUNC_FIND_STATE_BY_LATLNG = SERVICE_URI_BASE + 'GetStateFromLatLng';

//*** user data
// var USER_EMAIL = '';
// var USER_FIRSTNAME = '';
// var USER_LASTNAME = '';
// var USER_COMPANY = '';

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


// function cancelLoad(e) {

//     e.preventDefault(); //*** cancel the second click event

//     turnLightsOn(0);

//     if (AJAX_REQUEST !== null && AJAX_REQUEST !== undefined) {
//         AJAX_REQUEST.abort();
//     }

// }


// function setAppDataFromServer() {

//     //*** EXECUTES:
//     //*** - when app inits on (deviceready)

//     var params = {};
//     params.apiToken = API_TOKEN;
//     params.uuid = DEVICE_UUID;
//     params.timeStamp = getTimeStamp(); //*** !!! USE THIS IF YOU DO NOT WANT iOS TO CACHE YOUR RESULTS !!!!
    
//     //*** searialize params array to json
//     var jsonString = JSON.stringify(params);

//     AJAX_REQUEST = $.ajax({
//         //beforeSend: validateInquiryForm,
//         type: 'POST',
//         contentType: 'application/json; charset=utf-8',
//         dataType: 'json',
//         abortOnRetry: true,
//         async: true, //*** : false messes up things. showLoading() gets called after ajax callback.
//         url: FUNC_APP_DATA,
//         data: jsonString,
//         timeout: 30000, //*** try for 30 seconds only
//         success: function (data, textStatus, jqXhr) {

//             // console.log(data.d);
//             var dataObj = $.parseJSON(data.d); //convert JSON string into object
//             var i;

//             //*** Response
//             var response = dataObj[0].Response;

//             if (response == 'ok') {

//                 //*** User Info
//                 // console.log(dataObj[1].UserInfo);
//                 if (typeof dataObj[1].UserInfo[0] !== 'undefined') {
//                     USER_EMAIL = dataObj[1].UserInfo[0].Email;
//                     USER_FIRSTNAME = dataObj[1].UserInfo[0].FirstName;
//                     USER_LASTNAME = dataObj[1].UserInfo[0].LastName;
//                     USER_COMPANY = dataObj[1].UserInfo[0].Company;
//                     // console.log(USER_EMAIL);
//                 }
//                 if (USER_EMAIL.length == 0) {
//                     navigateTo('#register', 0)
//                 }

//                 //*** States
//                 // var locatorRegionUSASelect = $('#locatorRegionUSASelect');
//                 // var stateCode;
//                 // var stateName;
//                 // for (var i = 0; i <= dataObj[2].States.length - 1; i++) {
//                 //     stateCode = dataObj[2].States[i].StateCode;
//                 //     stateName = dataObj[2].States[i].StateName;
//                 //     locatorRegionUSASelect.append($("<option />").val(stateCode).text(stateName));
//                 // }
//                 // console.log(locatorRegionUSASelect.html());

//                 //*** International Regions
//                 // var locatorRegionINTSelect = $('#locatorRegionINTSelect');
//                 // var regionCode;
//                 // var regionName;
//                 // for (var i = 0; i <= dataObj[3].InternationalRegions.length - 1; i++) {
//                 //     regionCode = dataObj[3].InternationalRegions[i].RegionCode;
//                 //     regionName = dataObj[3].InternationalRegions[i].RegionName;
//                 //     locatorRegionINTSelect.append($("<option />").val(regionCode).text(regionName));
//                 // }
//                 // console.log(locatorRegionINTSelect.html());

//             } else if (response == 'error') {

//                 playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);

//                 $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//                 $('#modalviewResultHtml').html('Unsuccessful operation.<br />Please try again at a later time.');
//                 $('#modalviewResult').kendoMobileModalView('open');

//             } else if (response == 'blocked') {

//                 playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);

//                 $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//                 $('#modalviewResultHtml').html('Unsuccessful operation.<br />API request blocked.');
//                 $('#modalviewResult').kendoMobileModalView('open');

//             }

//             // setTimeout(function() {
//                 LIGHTS_ON = true;
//                 navigator.splashscreen.hide();
//             // }, 500);

//             // turnLightsOn(0);

//         },
//         error: function (result, textStatus, jqXhr) {
            
//             if (textStatus == 'timeout') {

//                 playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);
                
//                 $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//                 $('#modalviewResultHtml').html('Unsuccessful operation.<br />Please check your internet connectivity and try again.');
//                 $('#modalviewResult').kendoMobileModalView('open');

//             } else if (textStatus == 'error') {

//                 showAppErrorMsg();

//             }

//             turnLightsOn(0);

//         }
//     });

// }


// function setAppDataFromLocal() {

//     $('#listviewSystems').data('kendoMobileListView').dataSource.data(DATA_SYSTEMS);
//     $('#listviewSystemTypes').data('kendoMobileListView').dataSource.data(DATA_EIFS_SYSTEM_TYPES);
//     $('#listviewProductBrands').data('kendoMobileListView').dataSource.data(DATA_BRANDS);
//     $('#listviewProductCats').data('kendoMobileListView').dataSource.data(DATA_PRODUCT_CATS);

// }


// function registerFormSubmitBtnClick(e) {

//     e.preventDefault(); //*** cancel the second click event

//     turnLightsOff('Submitting registration form..');

//     //*** build params array
//     var params = {};
//     params.apiToken = API_TOKEN;
//     params.uuid = DEVICE_UUID;
//     params.firstName = $('#registerFormFirstName').val();
//     params.lastName = $('#registerFormLastName').val();
//     params.company = $('#registerFormCompany').val();
//     params.email = $('#registerFormEmail').val();

//     //*** searialize params array to json
//     var jsonString = JSON.stringify(params);
//     // console.log(jsonString);

//     //*** post/request data to/from server
//     AJAX_REQUEST = $.ajax({
//         beforeSend: validateRegisterForm,
//         type: 'POST',
//         contentType: 'application/json; charset=utf-8',
//         dataType: 'json',
//         abortOnRetry: true,
//         async: true, //*** : false messes up things. showLoading() gets called after ajax callback.
//         url: FUNC_NEW_USER,
//         data: jsonString,
//         timeout: 30000, //*** try for 30 seconds only
//         success: function (data, textStatus, jqXhr) {

//             // console.log(data.d);
//             var dataObj = $.parseJSON(data.d); //convert JSON string into object
//             var response = dataObj.Response;

//             if (response == 'ok') {

//                 USER_EMAIL = params.email;

//                 playMedia(SOUND_SUCCESS_FILE, SOUND_SUCCESS_DURATION);

//                 $('#modalviewResultIcon').attr('src', 'img/icons/profile1.png');
//                 $('#modalviewResultHtml').html('Thank you.<br />You\'ve successfully registered.');
//                 $('#modalviewResult').kendoMobileModalView('open');

//             } else if (response == 'error') {

//                 playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);

//                 $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//                 $('#modalviewResultHtml').html('Unsuccessful operation.<br />Please try again at a later time.');
//                 $('#modalviewResult').kendoMobileModalView('open');

//             } else if (response == 'blocked') {

//                 playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);

//                 $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//                 $('#modalviewResultHtml').html('Unsuccessful operation.<br />API request blocked.');
//                 $('#modalviewResult').kendoMobileModalView('open');

//             }

//             var browserHistoryArray = browserHistory();
//             if (browserHistoryArray.length == 0) {
//                 navigateTo('#system', 0)
//             } else {
//                 window.kendoMobileApplication.navigate('#:back');
//                 // $('#body').data().kendoMobilePane.navigate('#:back');
//             }

//             turnLightsOn(0);
//         },
//         error: function (result, textStatus, jqXhr) {
            
//             if (textStatus == 'timeout') {

//                 playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);
                
//                 $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//                 $('#modalviewResultHtml').html('Unsuccessful operation.<br />Please check your internet connectivity and try again.');
//                 $('#modalviewResult').kendoMobileModalView('open');

//             } else if (textStatus == 'error') {

//                 if (GOT_CONNECTION) {
//                     showAppErrorMsg();
//                 } else {
//                     //showOfflineMsg(null, null);
//                     showErrorMsg('connection');
//                 }

//             }

//             turnLightsOn(0);

//         }
//     });

// }


// function validateRegisterForm() {

//     var valid = true;

//     if (checkConnection()) {

//         var firstName = $('#registerFormFirstName').val();
//         var lastName = $('#registerFormLastName').val();
//         var company = $('#registerFormCompany').val();
//         var email = $('#registerFormEmail').val();

//         if (firstName.length <= 1 
//             || lastName.length <= 1 
//             || company.length <= 1
//             || isEmail(email) == false) { //|| emailMe && email.length <= 5
//             valid = false;

//             playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);

//             $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//             $('#modalviewResultHtml').html('Please fill out all of the required fields.');
//             $('#modalviewResult').kendoMobileModalView('open');

//             turnLightsOn(0);
//         }

//     } else {

//         vaild = false;

//     }

//     return valid;
// }


// function btnSendClick(e) {

//     if (USER_EMAIL.length > 0) {

//         turnLightsOff('Sending product info to<br>' + USER_EMAIL);

//         var dataArray = window[$('#productDataArray').val()];
//         var dataItemValue = $('#productItemArray').val();

//         var params = {};
//         for (var i = 0; i <= dataArray.length - 1; i++) {
//             if (dataArray[i].Value == dataItemValue) {
//                 params.apiToken = API_TOKEN;
//                 params.userEmail = USER_EMAIL;
//                 params.productName = dataArray[i].Name;
//                 params.productDescription = dataArray[i].Description;
//                 params.productPhotoFile = dataArray[i].PhotoFile;
//                 params.productBrochures = dataArray[i].Brochures;
//                 params.productDataSheets = dataArray[i].DataSheets;
//                 params.productSafetyDataSheets = dataArray[i].SafetyDataSheets;
//                 break;
//             }
//         }

//         if (params.userEmail.length > 0) {

//             //*** searialize params array to json
//             var jsonString = JSON.stringify(params);
//             // console.log(jsonString);

//             //*** post/request data to/from server
//             AJAX_REQUEST = $.ajax({
//                 beforeSend: checkConnBeforeAjaxRequest,
//                 type: 'POST',
//                 contentType: 'application/json; charset=utf-8',
//                 dataType: 'json',
//                 abortOnRetry: true,
//                 async: true, //*** : false messes up things. showLoading() gets called after ajax callback.
//                 url: FUNC_SEND_PRODUCT,
//                 data: jsonString,
//                 timeout: 60000, //*** try for 60 seconds only
//                 success: function (data, textStatus, jqXhr) {

//                     // console.log(data.d);
//                     var dataObj = $.parseJSON(data.d); //convert JSON string into object
//                     var response = dataObj.Response;

//                     if (response == 'ok') {

//                         playMedia(SOUND_SUCCESS_FILE, SOUND_SUCCESS_DURATION);

//                         $('#modalviewResultIcon').attr('src', 'img/icons/email1.png');
//                         $('#modalviewResultHtml').html('Product information has been sent.');
//                         $('#modalviewResult').kendoMobileModalView('open');

//                     } else if (response == 'error') {

//                         playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);

//                         $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//                         $('#modalviewResultHtml').html('Unsuccessful operation.<br />Please try again at a later time.');
//                         $('#modalviewResult').kendoMobileModalView('open');

//                     } else if (response == 'blocked') {

//                         playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);

//                         $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//                         $('#modalviewResultHtml').html('Unsuccessful operation.<br />API request blocked.');
//                         $('#modalviewResult').kendoMobileModalView('open');

//                     }

//                     turnLightsOn(0);
//                 },
//                 error: function (result, textStatus, jqXhr) {
                    
//                     if (textStatus == 'timeout') {

//                         playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);
                        
//                         $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//                         $('#modalviewResultHtml').html('Unsuccessful operation.<br />Please check your internet connectivity and try again.');
//                         $('#modalviewResult').kendoMobileModalView('open');

//                     } else if (textStatus == 'error') {

//                         if (GOT_CONNECTION) {
//                             showAppErrorMsg();
//                         } else {
//                             //showOfflineMsg(null, null);
//                             showErrorMsg('connection');
//                         }

//                     }

//                     turnLightsOn(0);

//                 }
//             });

//         } else {

//             turnLightsOn(0);

//             $('#modalviewResultIcon').attr('src', 'img/icons/not-connected.png');
//             $('#modalviewResultHtml').html('Oops!<br>Something went wrong.');
//             $('#modalviewResult').kendoMobileModalView('open');

//         }

//     } else {

//         navigateTo('#register', 0);
//         $('#registerForwardBtn').css('visibility', 'hidden');
//         $('#registerFormSubmitBtn').css('visibility', 'hidden');
//         $('#registerBackBtn').css('visibility', 'visible');

//         $('#modalviewResultIcon').attr('src', 'img/icons/profile1.png');
//         $('#modalviewResultHtml').html('Please register your email address to use this functionality.');
//         $('#modalviewResult').kendoMobileModalView('open');

//     }

// }


// function submitInquiryForm(e) {

//     e.preventDefault(); //*** cancel the second click event

//     turnLightsOff('Submitting inquiry form..');

//     //*** build params array
//     var params = {};
//     params.apiToken = API_TOKEN;
//     params.photoBase64 = $('#photoCanvas').attr('src');
//     params.photoImgType = 'image/jpeg';
//     params.message = $('#inquiryFormMsg').val();
//     params.phoneNum = $('#inquiryFormTelNo').val();
//     params.callMe = $('#inquiryFormCallMe').prop('checked');
//     params.email = $('#inquiryFormEmail').val();
//     if (params.email.length <= 5) {
//         params.emailMe = false; //$('#inquiryFormEmailMe').prop('checked'); //*** sends email to the entered address
//     } else {
//         params.emailMe = true;
//     }

//     //*** searialize params array to json
//     var jsonString = JSON.stringify(params);
//     // console.log(jsonString);

//     //*** post/request data to/from server
//     AJAX_REQUEST = $.ajax({
//         beforeSend: validateInquiryForm,
//         type: 'POST',
//         contentType: 'application/json; charset=utf-8',
//         dataType: 'json',
//         abortOnRetry: true,
//         async: true, //*** : false messes up things. showLoading() gets called after ajax callback.
//         url: FUNC_NEW_INQUIRY,
//         data: jsonString,
//         timeout: 30000, //*** try for 30 seconds only
//         success: function (data, textStatus, jqXhr) {

//             // console.log(data.d);
//             var dataObj = $.parseJSON(data.d); //convert JSON string into object
//             var id = dataObj.Id;
//             var guid = dataObj.Guid;
//             var response = dataObj.Response;

//             if (response == 'ok') {

//                 playMedia(SOUND_SUCCESS_FILE, SOUND_SUCCESS_DURATION);

//                 $('#modalviewResultIcon').attr('src', 'img/icons/archive.png');
//                 $('#modalviewResultHtml').html('Thank you.<br />Your inquiry has been recieved and archived.');
//                 $('#modalviewResult').kendoMobileModalView('open');

//                 resetInquiryForm();

//             } else if (response == 'error') {

//                 playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);

//                 $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//                 $('#modalviewResultHtml').html('Unsuccessful operation.<br />Please try again at a later time.');
//                 $('#modalviewResult').kendoMobileModalView('open');

//             } else if (response == 'blocked') {

//                 playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);

//                 $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//                 $('#modalviewResultHtml').html('Unsuccessful operation.<br />API request blocked.');
//                 $('#modalviewResult').kendoMobileModalView('open');

//             }

//             turnLightsOn(0);
//         },
//         error: function (result, textStatus, jqXhr) {
            
//             if (textStatus == 'timeout') {

//                 playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);
                
//                 $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//                 $('#modalviewResultHtml').html('Unsuccessful operation.<br />Please check your internet connectivity and try again.');
//                 $('#modalviewResult').kendoMobileModalView('open');

//             } else if (textStatus == 'error') {

//                 if (GOT_CONNECTION) {
//                     showAppErrorMsg();
//                 } else {
//                     //showOfflineMsg(null, null);
//                     showErrorMsg('connection');
//                 }

//             }

//             turnLightsOn(0);

//         }
//     });

// }


// function validateInquiryForm() {

//     var valid = true;

//     if (checkConnection()) {

//         var message = $('#inquiryFormMsg').val();
//         var phoneNum = $('#inquiryFormTelNo').val();
//         var callMe = $('#inquiryFormCallMe').prop('checked');
//         var email = $('#inquiryFormEmail').val();
//         // var emailMe = $('#inquiryFormEmailMe').prop('checked');

//         if (message.length <= 1 || callMe && phoneNum.length < 10) { //|| emailMe && email.length <= 5

//             valid = false;

//             playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);

//             $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//             $('#modalviewResultHtml').html('Please fill out all of the required fields.');
//             $('#modalviewResult').kendoMobileModalView('open');

//             turnLightsOn(0);

//         }

//         if (email.length >= 5 && isEmail(email) == false) {

//             valid = false;

//             playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);

//             $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//             $('#modalviewResultHtml').html('Incorrect Email Address.');
//             $('#modalviewResult').kendoMobileModalView('open');

//             turnLightsOn(0);

//         }

//     } else {

//         vaild = false;

//     }

//     return valid;
// }


// function getStateCodeFromLatLng() {

//     //*** EXECUTES:
//     //*** - when app inits on (deviceready and resume)

//     if (GOT_LOCATION) {

//         var params = {};
//         params.apiToken = API_TOKEN;
//         params.Lat = GEO_LATITUDE;
//         params.Lng = GEO_LONGITUDE;
//         params.timeStamp = getTimeStamp(); //*** !!! USE THIS IF YOU DO NOT WANT iOS TO CACHE YOUR RESULTS !!!!

//         var jsonString = JSON.stringify(params);

//         //*** post/request data to/from server
//         AJAX_REQUEST = $.ajax({
//             // beforeSend: ,
//             type: 'POST',
//             contentType: 'application/json; charset=utf-8',
//             dataType: 'json',
//             cache: false,
//             abortOnRetry: true,
//             async: true, //*** : false messes up things. showLoading() gets called after ajax callback.
//             url: FUNC_FIND_STATE_BY_LATLNG,
//             data: jsonString,
//             timeout: 30000, //*** try for 30 seconds only
//             success: function (data, textStatus, jqXhr) {

//                 console.log(data.d);
//                 var dataObj = $.parseJSON(data.d); //convert JSON string into object

//                 var response = dataObj[0].Response;

//                 if (response == 'ok') {

//                     GEO_STATE_SHORT = dataObj[0].ShortName;
//                     GEO_STATE_LONG = dataObj[0].LongName;
//                     console.log('*** GEO_STATE_SHORT: '+ GEO_STATE_SHORT);
//                     console.log('*** GEO_STATE_LONG: '+ GEO_STATE_LONG);

//                 } else if (response == 'error') {

                    

//                 } else if (response == 'blocked') {

//                     playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);

//                     $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//                     $('#modalviewResultHtml').html('Unsuccessful operation.<br />API request blocked.');
//                     $('#modalviewResult').kendoMobileModalView('open');

//                 }
//             },
//             error: function (result, textStatus, jqXhr) {
                
//                 if (textStatus == 'timeout') {

//                     // playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);
                    
//                     // $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//                     // $('#modalviewResultHtml').html('Unsuccessful operation.<br />Please check your internet connectivity and try again.');
//                     // $('#modalviewResult').kendoMobileModalView('open');

//                 } else if (textStatus == 'error') {

//                     if (GOT_CONNECTION) {
//                         showAppErrorMsg();
//                     } else {
//                         //showOfflineMsg(null, null);
//                         showErrorMsg('connection');
//                     }

//                 }

//                 // turnLightsOn(0);

//             }
//         });

//     }

// }


// function locatorNearbyBtnClick(e) {

//     // if (checkConnection()) {

//         if (GOT_LOCATION) {

//             /*** 
//             inAppBrowser OPTIONS:
//                 transitionstyle=*LEAVE BLANK* (default) : UIModalTransitionStyleCoverVertical
//                 transitionstyle=crossdissolve
//                 transitionstyle=fliphorizontal

//                 presentationstyle=*LEAVE BLANK* (default) : UIModalPresentationFullScreen
//                 presentationstyle=pagesheet (option)
//                 presentationstyle=formsheet (option)
//             ***/


//             //*** MAP - Development ***//

//             //* ChildBrowser version *//
//             // openChildBrowser(MAP_URI_BASE + '?lat=37.785834&long=-122.406417&osName=ios&osVersion=' + DEVICE_VERSION);

//             //* inAppBrowser version *//
//             //var ref = window.open(MAP_URI_BASE + '?lat=37.785834&long=-122.406417&osName=ios&osVersion=' + DEVICE_VERSION, '_blank', 'location=no');


//             //*** DOCS - Development ***//

//             //* ChildBrowser version *//
//             // openChildBrowser(DOC_URI_BASE + 'datasheets/Fiber 47 Armourwall Scratch & Brown Sanded.pdf'); //.pdf?ts=' + getTimeStamp()

//             //* inAppBrowser version *//
//             // var ref = window.open(
//             //     DOC_URI_BASE + 'datasheets/Fiber 47 Armourwall Scratch & Brown Sanded.pdf'
//             //     , '_blank' 
//             //     , 'location=yes,closebuttoncaption=Done,transitionstyle=fliphorizontal'
//             // );


//             //*** MAP - Production ***//

//             //* ChildBrowser version *//
//             execOnlineEvents(
//                 'openChildBrowser'
//                 ,MAP_URI_BASE + '?lat=' + GEO_LATITUDE + '&long=' + GEO_LONGITUDE + '&osName=ios&osVersion=' + DEVICE_VERSION
//             );
            
//             //* inAppBrowser version *//
//             // var ref = window.open(
//             //     MAP_URI_BASE + '?lat=' + GEO_LATITUDE + '&long=' + GEO_LONGITUDE + '&osName=ios&osVersion=' + DEVICE_VERSION
//             //     , '_blank' 
//             //     , 'location=yes,closebuttoncaption=Done,transitionstyle=fliphorizontal'
//             // );


//             //*** DOCS - Production ***//


//         } else {

//             showGeoErrorMsg();

//         }

//     // } else {

//     //     showOfflineMsg(null, null);

//     // }

// }


// function locatorRegionSearchBtnClick(e) {

//     e.preventDefault(); //*** cancel the second click event

//     var checkedUSA = $('#locatorRegionUSAChk').prop('checked');
//     var checkedINT = $('#locatorRegionINTChk').prop('checked');
//     var selectedRegionText;

//     if (checkedUSA) {
//         selectedRegionText = $('#locatorRegionUSASelect option:selected').text();
//     } else if (checkedINT) {
//         selectedRegionText = $('#locatorRegionINTSelect option:selected').text();
//     }

//     turnLightsOff('Performing search in<br>' + selectedRegionText + '..');

//     var params = {};
//     params.apiToken = API_TOKEN;
//     if (checkedUSA) {
//         params.parentRegionCode = 'USA';
//         params.childRegionCode = $('#locatorRegionUSASelect').val();
//     } else if (checkedINT) {
//         params.parentRegionCode = 'INT';
//         params.childRegionCode = $('#locatorRegionINTSelect').val();
//     }
//     params.timeStamp = getTimeStamp(); //*** !!! USE THIS IF YOU DO NOT WANT iOS TO CACHE YOUR RESULTS !!!!

//     var jsonString = JSON.stringify(params);

//     //*** post/request data to/from server
//     AJAX_REQUEST = $.ajax({
//         beforeSend: checkConnBeforeAjaxRequest,
//         type: 'POST',
//         contentType: 'application/json; charset=utf-8',
//         dataType: 'json',
//         cache: false,
//         abortOnRetry: true,
//         async: true, //*** : false messes up things. showLoading() gets called after ajax callback.
//         url: FUNC_LOCATOR_REGIONAL_SEARCH,
//         data: jsonString,
//         timeout: 30000, //*** try for 30 seconds only
//         success: function (data, textStatus, jqXhr) {

//             // console.log(data.d);
//             var dataObj = $.parseJSON(data.d); //convert JSON string into object
//             var response = dataObj[0].Response;

//             if (response == 'ok') {

//                 $('#listviewDistributors').data('kendoMobileListView').dataSource.data(dataObj);

//             } else if (response == 'norow') {

//                 var norowData = [{
//                     Id: 0
//                     ,Name: 'None listed in this region.'
//                     ,AddressLine1: ''
//                     ,AddressLine2: ''
//                     ,State: ''
//                     ,Email: ''
//                     ,Phone: ''
//                     ,Lat: 0
//                     ,Long: 0
//                     ,CallBtn: false
//                     ,EmailBtn: false
//                     ,MapBtn: false
//                     ,GroupBy: ''
//                 }];
//                 $('#listviewDistributors').data('kendoMobileListView').dataSource.data(norowData);

//             } else if (response == 'error') {

//                 playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);

//                 $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//                 $('#modalviewResultHtml').html('Unsuccessful operation.<br />Please try again at a later time.');
//                 $('#modalviewResult').kendoMobileModalView('open');

//             } else if (response == 'blocked') {

//                 playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);

//                 $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//                 $('#modalviewResultHtml').html('Unsuccessful operation.<br />API request blocked.');
//                 $('#modalviewResult').kendoMobileModalView('open');

//             }

//             $('#regionalSearchRegionSpan').text(selectedRegionText);
//             navigateTo('#locatorRegionalSearch_List', 0);
//             turnLightsOn(0);
//         },
//         error: function (result, textStatus, jqXhr) {
            
//             if (textStatus == 'timeout') {

//                 playMedia(SOUND_ERROR_FILE, SOUND_ERROR_DURATION);
                
//                 $('#modalviewResultIcon').attr('src', 'img/icons/warn.png');
//                 $('#modalviewResultHtml').html('Unsuccessful operation.<br />Please check your internet connectivity and try again.');
//                 $('#modalviewResult').kendoMobileModalView('open');

//             } else if (textStatus == 'error') {

//                 if (GOT_CONNECTION) {
//                     showAppErrorMsg();
//                 } else {
//                     //showOfflineMsg(null, null);
//                     showErrorMsg('connection');
//                 }

//             }

//             turnLightsOn(0);

//         }
//     });

// }


// function mapDistBtnClick(e) {

//     var data = e.button.data();
//     var dataIds = data.id; //*** comes from 'data-id', use to detect the origin of click event.
//     var dataId = dataIds.split(',');

//     var lat = dataId[0];
//     var lng = dataId[1];

//     console.log('*** SEND LATITUDE: ' + lat);
//     console.log('*** SEND LONGITUDE: ' + lng);
//     console.log('*** DEVICE VERSION: ' + DEVICE_VERSION);

//     // var ref = window.open('http://maps.google.com/?q=' + dataId, '_blank', 'location=no');
//     //var ref = window.open(MAP_URI_BASE + '?lat=' + dataId[0] + '&long=' + dataId[1], '_blank', 'location=no');

//     execOnlineEvents(
//         'openChildBrowser'
//         ,SINGLE_MAP_URI_BASE + '?lat=' + lat + '&long=' + lng + '&osName=ios&osVersion=' + DEVICE_VERSION
//     );

// }


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


// function moreInfoButtonClick(infoURI) {

    // if (EXTERNAL_WEBSITE_CONFIRMED) {

    //     execOnlineEvents('openChildBrowser', infoURI);

    // } else {

    //     var question = 'You\'ll be forwarded to an external website. Do you wish to continue?';
    //     navigator.notification.confirm(
    //         question                            // message
    //         ,function(button) {                 // callback to invoke with index of button pressed
    //             if (button == 2) {              // if user wants to load the new question
    //                 EXTERNAL_WEBSITE_CONFIRMED = true;
    //                 execOnlineEvents('openChildBrowser', infoURI);
    //             } else {
    //                 //*** show a landing page with a 'load latest question' button
    //             }
    //         }
    //         ,'Confirmation'                     // pop-up title
    //         ,['Cancel','Continue']              // buttonLabels
    //     );

    // }
    
// }


function checkConnBeforeAjaxRequest() {

    var valid;

    if (checkConnection()) {
        valid = true;
    } else {
        vaild = false;
    }

    return valid;

}




// ************************************************************************************** //
// ************************************************************************************** //
// ************************************************************************************** //
// ************************************************************************************** //
// ************************************************************************************** //
// ************************************************************************************** //
// ************************************************************************************** //
// ************************************************************************************** //
// ************************************************************************************** //
// ************************************************************************************** //
// ************************************************************************************** //
// ************************************************************************************** //
// ************************************************************************************** //
// ************************************************************************************** //
// ************************************************************************************** //
// ************************************************************************************** //
// ************************************************************************************** //





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
