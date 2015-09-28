//*** GLOBAL VARIABLES
//*** used to specify which ios version is running the app
var DEVICE_UUID;
var DEVICE_VERSION;
var DEVICE_WIDTH;
var DEVICE_HEIGHT;

var GOT_CONNECTION;

//*** geolocation stuff
var GOT_LOCATION;
var GEO_LATITUDE;
var GEO_LONGITUDE;
var GEO_STATE_SHORT;
var GEO_STATE_LONG;
var GEO_TIMESTAMP;

//*** plugin references
var CHILD_BROWSER;


function initPlugins() {

    //*** PLUGIN REFERENCE:
    //*** https://github.com/phonegap/phonegap-facebook-plugin
    // FB.init({ appId: '147607915442025', nativeInterface: CDV.FB, useCachedDialogs: false });

    //*** PLUGIN REFERENCE:
    //*** https://github.com/alunny/ChildBrowser
    CHILD_BROWSER = window.plugins.childBrowser;
    // if(CHILD_BROWSER != null)
    // {
    //     CHILD_BROWSER.onLocationChange = function(loc) { 
    //         locChanged(loc); 
    //     };
    //     CHILD_BROWSER.onClose = function() {
    //         onCloseBrowser();
    //     };
    //     CHILD_BROWSER.onOpenExternal = function() {
    //         onOpenExternal();
    //     };
    // }

    //*** PLUGIN REFERENCE:
    //*** https://github.com/phonegap/phonegap-plugins/blob/master/iOS/LowLatencyAudio
    // preloadSoundFiles();

}


//*** CONNECTION ***//

function checkConnection() {

    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    
    if (networkState == Connection.UNKNOWN || networkState == Connection.NONE) {
        console.log('*** Connection Check: FALSE');
        GOT_CONNECTION = false;
        return false;
    }
    else {
        console.log('*** Connection Check: TRUE');
        GOT_CONNECTION = true;
        return true;
    }

    // var connectionInfo;
    // connectionInfo = 'Type: ' + states[networkState];
    // $('#connectionInfo').append(connectionInfo);

    // navigator.notification.alert('Connection type: ' + states[networkState]);
    
}


//*** GEO-LOCATION ***//

//*** set config.xml <preference name="EnableLocation"> value to 'true' if need to be used.
function getGeoLocation() {

    //*** EXECUTES:
    //*** - when app inits on (deviceready and resume)
    
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
    
}


function onGeoSuccess(position) {

    // var geoInfo;
    // geoInfo = '' +
    // 'Latitude: '           + position.coords.latitude              + '<br />' +
    // 'Longitude: '          + position.coords.longitude             + '<br />' +
    // 'Altitude: '           + position.coords.altitude              + '<br />' +
    // 'Accuracy: '           + position.coords.accuracy              + '<br />' +
    // 'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
    // 'Heading: '            + position.coords.heading               + '<br />' +
    // 'Speed: '              + position.coords.speed                 + '<br />' +
    // 'Timestamp: '          + position.timestamp                    + '<br />';
    
    // $('#geoInfo').append(geoInfo);

    GOT_LOCATION = true;
    GEO_LATITUDE = position.coords.latitude;
    GEO_LONGITUDE = position.coords.longitude;
    GEO_TIMESTAMP = position.timestamp;

    // getStateCodeFromLatLng();

    console.log('*** GEO_LATITUDE: '+ GEO_LATITUDE);
    console.log('*** GEO_LONGITUDE: '+ GEO_LONGITUDE);
    console.log('*** GEO_TIMESTAMP: '+ GEO_TIMESTAMP);
    
}


function onGeoError(error) {
    
    // var geoInfo = 'code: '    + error.code    + '<br />' + 'message: ' + error.message;
    // $('#geoInfo').append(geoInfo);

    GOT_LOCATION = false;

    // showGeoErrorMsg();
    
}


//*** DEVICE ***//

function checkDevice() {
    
    var deviceInfo;
    
    deviceInfo = 'Name: ' + device.name + ' .. ' +
    'Cordova: '  + device.cordova  + ' .. ' +
    'Platform: ' + device.platform + ' .. ' +
    'UUID: '     + device.uuid     + ' .. ' +
    'Model: '     + device.model     + ' .. ' +
    'Version: '  + device.version;
    
    // console.log(deviceInfo);
    
}


function getDeviceUUID() {

    var deviceUUID = window.device.uuid;
    
    console.log('*** DEVICE UUID: ' + deviceUUID + ' ***');

    return deviceUUID;

}


function getDeviceVersion() {

    //*** EXECUTES:
    //*** on deviceready

    var deviceVersion = window.device.version;
    
    console.log('*** DEVICE VERSION: ' + deviceVersion + ' ***');

    return deviceVersion;

}


function getDeviceWidth() {

    //*** EXECUTES:
    //*** on deviceready

    var windowWidth = window.innerWidth;

    console.log('*** DEVICE WIDTH: ' + windowWidth + 'px ***');

    return windowWidth;

}


function getDeviceHeight() {

    //*** EXECUTES:
    //*** on deviceready

    var windowHeight = window.innerHeight;

    console.log('*** DEVICE HEIGHT: ' + windowHeight + 'px ***');

    return windowHeight;

}


//*** CAMERA ***//

var pictureSource;   // picture source
var destinationType; // sets the format of returned value

function prepCamera() {

    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;

}


function capturePhoto() {

    navigator.camera.getPicture(
        onPhotoDataSuccess, 
        onPhotoFail, 
        { 
            quality: 50
            ,destinationType: Camera.DestinationType.DATA_URL
            ,sourceType: Camera.PictureSourceType.CAMERA
            ,allowEdit: true
            ,targetWidth: 600 //135
            ,targetHeight: 600 //200
            ,saveToPhotoAlbum: true
            ,encodingType: Camera.EncodingType.JPEG
            ,mediaType: Camera.MediaType.PICTURE
            ,correctOrientation: true
        }
    );
    
}


function getPhoto() {

    // Retrieve image file location from specified source
    navigator.camera.getPicture(
        onPhotoDataSuccess, 
        onPhotoFail, 
        { 
            quality: 50
            ,destinationType: destinationType.DATA_URL //use FILE_URI if not base64
            ,sourceType: pictureSource.PHOTOLIBRARY
            ,targetWidth: 600 //135
            ,targetHeight: 600 //200
            ,encodingType: Camera.EncodingType.JPEG
            ,mediaType: Camera.MediaType.PICTURE
            ,correctOrientation: true
            ,allowEdit: true
        }
    );
    
}


function onPhotoFail(message) {
    
    //navigator.notification.alert('Failed because: ' + message);
    
}


function onPhotoDataSuccess(imageData) {
                
    $('#photoCanvas')
        .attr('src', 'data:image/jpeg;base64,' + imageData)
        .css('display', 'block')
        .corner('10px');
    
    $('.divNewPhotoCtrls').hide();
    $('.divPhotoCanvas').show();
    $('#divNewPhotoBtnStrip').show();
    
}


//*** PLUGINS ***//

function openChildBrowser(url) {
                
    try {
        if (CHILD_BROWSER != null) {
            CHILD_BROWSER.showWebPage(
                encodeURI(url)
                ,{ 
                    //*** ALL OF THESE NEED TO BE TRUE !!!
                    showLocationBar: true //*** show/hide a location bar in the generated browser
                    ,showNavigationBar: true //*** show/hide the entire navigation bar. 
                                             //*** Important: since there is no "Done"-Button anymore, 
                                             //*** the ChildBrowser can only be closed with the api call close()
                    ,showAddress: true //*** show/hide the address bar in the generated browser
                }
            );
        } else {
            navigator.notification.confirm("Cannot access remote page.", function(button) {}, 'Error', ['OK']);
        }
    }
    catch (err) {
        navigator.notification.confirm("Cannot access remote page.", function(button) {}, 'Error', ['OK']);
    }
    
}


//*** this uses the built-in default InAppBrowser plugin.
// function openInAppBrowser(url) {

//     var ref = window.open(
//         encodeURI(url),
//         '_blank',
//         'location=no,presentationstyle=fullscreen,transitionstyle=coververtical'
//     );
//     ref.addEventListener('loadstart', function() {
//         // window.kendoMobileApplication.showLoading();
//     });
//     ref.addEventListener('loadstop', function() {
//         // window.kendoMobileApplication.hideLoading();
//     });
//     ref.addEventListener('exit', function() {
//         // window.kendoMobileApplication.hideLoading();
//     });

// }


//*** this uses the built-in default InAppBrowser plugin.
// function openSystemBrowser(url) {

//     var ref = window.open(
//         encodeURI(url),
//         '_system',
//         'location=no'
//     );
//     ref.addEventListener('loadstart', function() {
//         // window.kendoMobileApplication.showLoading();
//     });
//     ref.addEventListener('loadstop', function() {
//         // window.kendoMobileApplication.hideLoading();
//     });
//     ref.addEventListener('exit', function() {
//         // window.kendoMobileApplication.hideLoading();
//     });

// }


function playMedia(url, duration) {

    var my_media = new Media(url);

    my_media.play();
    //my_media.setVolume('0.5');

    setTimeout(function () {
        my_media.stop();
        my_media.release();
    }, duration);

}


// function preloadSoundFiles() {

//     var soundsDir = 'audio/';

//     //*** PLUGIN REFERENCE:
//     //*** https://github.com/phonegap/phonegap-plugins/blob/master/iOS/LowLatencyAudio
//     LowLatencyAudio.preloadFX('wrongAnswer', soundsDir + 'drum.mp3', audioSuccessHandler, audioErrorHandler);
//     LowLatencyAudio.preloadFX('correctAnswer', soundsDir + 'string.wav', audioSuccessHandler, audioErrorHandler);

// }


// function playSound(soundId) {

//     //*** play audio file
//     LowLatencyAudio.play(soundId, audioSuccessHandler, audioErrorHandler);

// }


// function audioSuccessHandler (result) {
    
//     //console.log(result);

// }


// function audioErrorHandler (error) {

//     //console.log(error);

// }