var SCROLL_DURATION = 300; //*** used to determine scrollview page settle velocity and when to enable tab buttons
var ANIMATION_SPEED = 300; //*** used for modalview open/close animation

var LIGHTS_ON;
var MODAL_ON = false; //*** used to prevent click on tab buttons
var SCROLLING = false; //*** used to prevent click on tab buttons
var BTN_SCROLL; //*** used to determine if the scrollview page is changed via the pager button or swipe gesture


$(function () {
    
    bindTouchEvents();

});


$(window).load(function () {

    
    
});


function bindTouchEvents() {

    $('#home-canvas').on('touchstart', '.control-btn', function () {
        $(this).addClass('touched');
    });
    $('#home-canvas').on('touchend', '.control-btn', function () {
        $(this).removeClass('touched');
    });
    $('#home-canvas').on('touchstart', '.pager-btn', function () {
        $(this).addClass('touched');
    });
    $('#home-canvas').on('touchend', '.pager-btn', function () {
        $(this).removeClass('touched');
    });

    $('.load-btn').kendoTouch({
        tap: openTimersList
    });
    $('.start-btn').kendoTouch({
        tap: startTimer
    });
    $('.pause-btn').kendoTouch({
        tap: pauseTimer
    });
    $('.destroy-btn').kendoTouch({
        tap: destroyTimer
    });

    $('.prev-btn').kendoTouch({
        tap: scrollPage,
        doubleTapTimeout: 0 //*** cancel the delay to enable fast tapping.
    });
    $('.next-btn').kendoTouch({
        tap: scrollPage,
        doubleTapTimeout: 0 //*** cancel the delay to enable fast tapping.
    });

    //*** Simulate Tap On Inputs & Textarea
    $('.liFormElem').kendoTouch({
        tap: function (e) {
            var obj = e.sender.element[0];
            $(obj).css('background-color', '#f4f4f4');
        }
    });
    $('.liFormElem input, .liFormElem textarea').focus(function (e) {
        var elem = $(this).parents('li');
        elem.css('background-color', 'transparent');
        //*** do not allow the event exec more than once.
        //*** stops js from bubbling.
        e.stopImmediatePropagation();
    });

}


function initViewUISettings(e) {

    //*** EXECUTES:
    //*** on data-init for all views.
    //*** happens only ONCE for each view.

    //*** VIEW SPECIFIC UI SETTINGS ***//
    //******************************************//

    var viewId = e.sender.element.attr('id');
    // var view = e.view;
    // var viewId = view.params.id; // comes from querystring

    //*** 'ABOUT' view
    //*** write header navbar app title
    var viewTitle;
    if (viewId == 'xxx-view') {
        viewTitle = '<img src="img/logo.png" style="opacity: 0" />'; //hide logo from navbar
        //*** VERTICAL CENTER CONTENT
        //*** 127 px is the total height of (navbar(47px) + tabbar(59px) + status bar(20px))
        //*** 88 is the height of the aboutContainer (192) divided by 2
        var centerTopMargin = Math.ceil(((DEVICE_HEIGHT - 126) / 2) - 96);
        $('#aboutContainer').css('margin-top', centerTopMargin + 'px');
    } else {
        viewTitle = '<img src="img/logo.png" style="opacity: 1" />';
    }
    e.view.header.find('.km-view-title').eq(0).html(viewTitle); //*** apply only to the first navbar

    
    if (viewId == 'home-view') {

        //*** initiate scrollview on home view
        initScrollView(e);
        
    } else if (viewId == 'settings-view') {
        
        e.view.element.find('#settings-user-list').kendoMobileListView().kendoTouch({
            filter: ">li#userProfileEditorOpener",
            tap: openUserProfileEditor
        });

        e.view.element.find('#settings-user-list').kendoMobileListView().kendoTouch({
            filter: ">li#exportTestHistoryOpener",
            tap: openUserProfileEditor
        });
        
    }

    // $('.km-ios7 .km-header .km-navbar:nth-of-type(1)').css('border-top-left-radius', '6px');
    // $('.km-ios7 .km-header .km-navbar:nth-of-type(1)').css('border-top-right-radius', '6px');

    //******************************************//


    //*** UI SETTINGS THAT APPLY TO ALL VIEWS **//
    //******************************************//

    //if (DEVICE_VERSION >= 7.0) {
        //*** adds extra padding for status bar in iOS 7.*
        //$('.km-header').css('margin-top', '20px');
        //$('.km-navbar').css('padding-top', '20px');
    //}

    //*** re-position navbar title & buttons
    // $('.km-view .km-navbar .km-button').css('top', '2px');
    // $('.km-view .km-view-title').css('padding-top', '12px');

    //******************************************//

}


function initModalViewUISettings(e) {

    var viewId = e.sender.element.attr('id');

    var viewTitle;
    if (viewId == 'modalview-xxx') {
        viewTitle = '<img src="img/logo.png" style="opacity: 0" />'; //hide logo from navbar
    } else {
        viewTitle = '<img src="img/logo.png" style="opacity: 1" />';
    }
    $('#' + viewId + ' .km-header .km-navbar .km-view-title').eq(0).html(viewTitle); //*** apply only to the first navbar

    if (viewId == 'modalview-timers-list') {
        var listviews = this.element.find('ul.km-listview');
        $('#select-timer-type').kendoMobileButtonGroup({
            select: function (ee) {
                listviews.hide().eq(ee.index).show();
                scrollBarToTop_ModalView($('#modalview-timers-list'));
                // --- or ---
                //var selectedIndex = ee.index;
                //var selectedIndex = this.current().index();
                //console.log(selectedIndex);
            },
            index: 0
        });
    }

}


function initScrollView(e) {

    e.view.element.find('#scrollView').kendoMobileScrollView({
        //contentHeight: "200px",
        //template: 'scrollview-template',
        //emptyTemplate: 'scrollview-empty',
        page: 0, // which page to show (0-based index)
        pageSize: 1, // If the pageSize property is set to 0.5, the ScrollView will scroll by half of the widget width.
        velocityThreshold: 0.2, // less the number, faster the page scroll action kicks in.
        bounceVelocityThreshold: 5.0, // higher the number, less the bouncing effect.
        duration: SCROLL_DURATION, // the velocity threshold after which a swipe will settle the next page
        enablePager: true,
        changing: scrollChanging,
        change: scrollChanged
    });

    window.SCROLLER = $('#scrollView').data('kendoMobileScrollView');

}


function scrollChanging() {

    //*** disable tab buttons
    window.BTN_SCROLL = false;
    window.SCROLLING = true;

//    console.log(e);

//    var nextPage = e.nextPage + 1;
//    var currentPage = SCROLLER.page + 1;

//    if (nextPage >= 1 && nextPage <= 6) {

//        var changeDirection;
//        if (nextPage > currentPage) {
//            changeDirection = 'next';
//        } else {
//            changeDirection = 'prev';
//        }
//        console.log(changeDirection);

//        if (!window['timer' + nextPage].loaded) {
//            var nextSlot = findLoadedSlot(currentPage, changeDirection);
//            if (nextSlot > 0) {
//                SCROLLER.scrollTo(nextSlot);
//            } else {
//                e.preventDefault(); //prevent scrolling
//            }
//        }

//    }
    //    
    
}


function scrollChanged(e) {

    //*** enable tab buttons
    if (!BTN_SCROLL) { window.SCROLLING = false; }

    var page = e.page + 1;
    var timer = window['timer' + page];
    //console.log(timer);
    
    if (timer.loaded) {
        if (timer.running) {
            toggleControls('started');
        } else {
            toggleControls('paused');
        }
    } else {
        toggleControls('destroyed');
    }

    togglePager(e.page);

}


function scrollPage(e) {

    var obj = e.sender.element[0];

    if (!$(obj).hasClass('btn-off')) {

        //*** disable tab buttons
        window.BTN_SCROLL = true;
        window.SCROLLING = true;
        setTimeout(function () {
            //*** enable tab buttons
            window.SCROLLING = false;
        }, (SCROLL_DURATION + 100));
        
        var pageIndex = 0;
        if ($(obj).hasClass('next-btn')) {
            pageIndex = SCROLLER.page + 1;
        } else if ($(obj).hasClass('prev-btn')) {
            pageIndex = SCROLLER.page - 1;
        }
        
        SCROLLER.scrollTo(pageIndex);
    }
    
}


function togglePager(ix) {

    //console.log(ix);
    
    if (ix == 0) {
        $('.prev-btn').addClass('btn-off');
    } else {
        $('.prev-btn').removeClass('btn-off');
    }
    
    if (ix == 5) {
        $('.next-btn').addClass('btn-off');
    } else {
        $('.next-btn').removeClass('btn-off');
    }

}


function toggleControls(op) {

    switch (op) {
        case 'started':
            $('.start-btn').hide();
            $('.pause-btn').show();
            $('.destroy-btn').removeClass('btn-off');
            break;
        case 'paused':
            $('.pause-btn').hide();
            $('.start-btn').show();
            $('.start-btn').removeClass('btn-off');
            $('.destroy-btn').removeClass('btn-off');
            break;
        case 'destroyed':
            $('.pause-btn').hide();
            $('.start-btn').show();
            $('.start-btn').addClass('btn-off');
            $('.destroy-btn').addClass('btn-off');
            break;
    }

}


//function simButtonTouch(obj, timeout) {

//    $(obj).addClass('touched');

//    setTimeout(function () {
//        $('.touched').removeClass('touched');
//    }, timeout);

//}


function openTimersList(e) {

    var obj = e.sender.element[0];
    //console.log($(obj));
    
    if (!$(obj).hasClass('btn-off')) {
        
        findEmptySlot();
        console.log('Target Timer Index: ' + TARGET_TIMER_IX);

        if (TARGET_TIMER_IX >= 1 && TARGET_TIMER_IX <= 6) {

            //*** PREVENTS THE TAP ON MODALVIEW LISTVIEW
            e.preventDefault();

            //*** open the modalview
            scrollBarToTop_ModalView($('#modalview-timers-list'));
            openModalViewWithAnimation($('#modalview-timers-list'));
            // -- or --
            //$('#modalview-timers-list').kendoMobileModalView('open');
            
            window.MODAL_ON = true;
        }

    }

}


function selectPresetTimerOnChange(checkbox, dataId) {
    
    //*** attach timer
    window.SOURCE_TIMER_IX = findTimerIndexById(PRESET_TIMERS_DATA, dataId);
    attachTimer('preset', PRESET_TIMERS_DATA[window.SOURCE_TIMER_IX]);
    //console.log('Source Timer Index: ' + window.SOURCE_TIMER_IX);

    //*** check the box if unchecked
    var checked = checkbox.checked;
    if (!checked) { $(checkbox).prop('checked', true); }

    //*** close modalview
    setTimeout(function () {
        $('#modalview-timers-list').kendoMobileModalView('close');
        window.MODAL_ON = false;
    }, 400);

}


function selectCustomTimerOnChange(checkbox, dataId) {

    //*** attach timer
    window.SOURCE_TIMER_IX = findTimerIndexById(CUSTOM_TIMERS_DATA, dataId);
    attachTimer('custom', CUSTOM_TIMERS_DATA[window.SOURCE_TIMER_IX]);
    //console.log('Source Timer Index: ' + window.SOURCE_TIMER_IX);

    //*** check the box if unchecked
    var checked = checkbox.checked;
    if (!checked) { $(checkbox).prop('checked', true); }

    //*** close modalview
    setTimeout(function () {
        $('#modalview-timers-list').kendoMobileModalView('close');
        window.MODAL_ON = false;
    }, 400);

}


//***********************************************
//*** ADD data-click="selectPresetTimer" 
//*** TO <ul id="preset-timers-list">
//*** TO MAKE THIS WORK
//***********************************************
//function selectPresetTimer(e) {
//    
//    //var liId = e.item.context.id; //** gets li's id
//    var labelId = e.target.context.id; //** gets label's id
//    var dataId = labelId.substring(7, labelId.length); //** remove 'preset-' from label id
//    window.SOURCE_TIMER_IX = findTimerIndexById(PRESET_TIMERS_DATA, dataId);
//    
//    console.log('Source Timer Index: ' + window.SOURCE_TIMER_IX);

//    var checkboxList = this.element.find('input[type="checkbox"]');
//    var checkbox = checkboxList[window.SOURCE_TIMER_IX];
//    var checked = !checkbox.checked;
//    //console.log(checked);

//    if (checked) {

//        attachTimer('preset', PRESET_TIMERS_DATA[window.SOURCE_TIMER_IX]);

//    } else {

//        var sourceTimerId = PRESET_TIMERS_DATA[window.SOURCE_TIMER_IX].id;
//        var targetTimerPageIndex = findTargetTimerIndex('preset', sourceTimerId); //*** 0-based indexing
//        setTimeout(function () {
//            SCROLLER.scrollTo(targetTimerPageIndex);
//            $(checkbox).prop('checked', true);
//        }, 1200);

//    }

//    closeTimersList_OnSelect(e);
//    
//}


//***********************************************
//*** ADD data-click="selectCustomTimer" 
//*** TO <ul id="custom-timers-list">
//*** TO MAKE THIS WORK
//***********************************************
//function selectCustomTimer(e) {

//    //var liId = e.item.context.id; //** gets li's id
//    var labelId = e.target.context.id; //** gets label's id
//    var dataId = labelId.substring(7, labelId.length); //** remove 'custom-' from label id
//    window.SOURCE_TIMER_IX = findTimerIndexById(CUSTOM_TIMERS_DATA, dataId);
//    
//    console.log('Source Timer Index: ' + window.SOURCE_TIMER_IX);

//    var checkboxList = this.element.find('input[type="checkbox"]');
//    var checkbox = checkboxList[window.SOURCE_TIMER_IX];
//    var checked = !checkbox.checked;
//    //console.log(checked);

//    if (checked) {
//        
//        attachTimer('custom', CUSTOM_TIMERS_DATA[window.SOURCE_TIMER_IX]);

//    } else {

//        var sourceTimerId = CUSTOM_TIMERS_DATA[window.SOURCE_TIMER_IX].id;
//        var targetTimerPageIndex = findTargetTimerIndex('custom', sourceTimerId); //*** 0-based indexing
//        setTimeout(function() {
//            SCROLLER.scrollTo(targetTimerPageIndex);
//            $(checkbox).prop('checked', true);
//        }, 1200);
//        
//    }

//    closeTimersList_OnSelect(e);
//    
//}


//function closeTimersList_OnSelect(e) {

//    setTimeout(function () {
//        //*** PREVENTS THE 2nd TAP
//        e.preventDefault();
//        $('#modalview-timers-list').kendoMobileModalView('close');
//        window.MODAL_ON = false;
//    }, 600);

//}


function closeTimersList_OnCancel(e) {

    //*** PREVENTS THE 2nd TAP
    e.preventDefault();

    $('#modalview-timers-list').kendoMobileModalView('close');
    
    setTimeout(function () {    
        window.MODAL_ON = false;
    }, 600);

}


function openTimerEditor(timerId) {

    //console.log(timerId);
    var ix = findTimerIndexById(CUSTOM_TIMERS_DATA, timerId);
    
    //*** fill the form with values
    $('#customTimerID').val(CUSTOM_TIMERS_DATA[ix].id);

    $('#timerTitle').val(CUSTOM_TIMERS_DATA[ix].title);
    $('#timerDescription').val(CUSTOM_TIMERS_DATA[ix].descr);
            
    var time = String(CUSTOM_TIMERS_DATA[ix].seconds).toHHMMSS();
    $('#timerHours').val(time.hours);
    $('#timerMinutes').val(time.minutes);
    $('#timerSeconds').val(time.seconds);

    //*** show delete timer button
    $('#deleteTimerBtn').css('visibility', 'visible');

    //*** open the modalview
    scrollBarToTop_ModalView($('#modalview-add-edit-timer'));
    openModalViewWithAnimation($('#modalview-add-edit-timer'));
    // -- or --
    //$('#modalview-add-edit-timer').kendoMobileModalView('open');
    
    window.MODAL_ON = true;

}


function openNewTimerEditor(e) {

    //*** clear form fields
    $('#customTimerID').val('0');
    $('#timerTitle').val('');
    $('#timerDescription').val('');
    $('#timerHours').val('00');
    $('#timerMinutes').val('00');
    $('#timerSeconds').val('00');

    //*** hide the delete button
    $('#deleteTimerBtn').css('visibility', 'hidden');

    //*** PREVENTS THE TAP ON MODALVIEW LISTVIEW
    e.preventDefault();

    //*** open the modalview
    scrollBarToTop_ModalView($('#modalview-add-edit-timer'));
    openModalViewWithAnimation($('#modalview-add-edit-timer'));
    // -- or --
    //$('#modalview-add-edit-timer').kendoMobileModalView('open');
    
    window.MODAL_ON = true;

}


function closeTimerEditor(e) {

    //*** PREVENTS THE 2nd TAP
    e.preventDefault();

    $('#modalview-add-edit-timer').kendoMobileModalView('close');

    setTimeout(function () {
        window.MODAL_ON = false;
    }, 600);

}


function autoCheckLoadedTimers(timerType) {

    var timer;
    var checkbox;

    for (var i = 1; i <= 6; i++) {
        timer = window['timer' + i];
        if (timer.type == timerType && timer.loaded) {
            //console.log('found custom timer : ' + timer.sourceid);
            checkbox = $('ul.km-listview li label#' + timerType + '-' + timer.sourceid).find('input[type="checkbox"]');
            $(checkbox).prop('checked', true);
        };
    }

}


//function findLoadedSlot(startIndex, direction) {

//    var timerLoaded;
//    var foundIndex = 0;

//    for (var i = startIndex; i <= 6; i++) {
//        timerLoaded = window['timer' + i].loaded;
//        if (timerLoaded) {
//            foundIndex = i;
//            break;
//        };
//    }

//    return foundIndex;

//}


//function timersListViewInit() {

//    var listviews = this.element.find('ul.km-listview');

//    $('#select-timer-type').kendoMobileButtonGroup({
//        select: function (e) {
//            
//            listviews.hide().eq(e.index).show();
//            scrollBarToTop_ModalView($('#modalview-timers-list'));
//            
//            //var selectedIndex = e.index;
//            // --- or ---
//            //var selectedIndex = this.current().index();
//            //console.log(selectedIndex);
//        },
//        index: 0
//    });

//}


function openUserProfileEditor(e) {

    if (e) { //*** current user
        e.preventDefault(); //*** PREVENTS THE TAP ON MODALVIEW LISTVIEW
        $('#closeProfileEditorBtn').css('visibility', 'visible');
    } else { //*** new user
        $('#closeProfileEditorBtn').css('visibility', 'hidden');
    }
    
    //*** attach events and set button text
    setUserProfileFormButton();

    //*** open the modalview
    scrollBarToTop_ModalView($('#modalview-user-profile-editor'));
    openModalViewWithAnimation($('#modalview-user-profile-editor'));
    // -- or --
    //$('#modalview-user-profile-editor').kendoMobileModalView('open');
    
    window.MODAL_ON = true;

}


function closeUserProfileEditor(e) {

    //*** PREVENTS THE 2nd TAP
    e.preventDefault();

    $('#modalview-user-profile-editor').kendoMobileModalView('close');

    setTimeout(function () {
        window.MODAL_ON = false;
    }, 600);

}


function scrollBarToTop_ModalView($elem) {

    //*** this avoids a problem that arises from switching from a tall to a short content.
    //*** resets the scroll position of the view container to point 0.
    
    var $scrollbar = $elem.find('.km-scroll-container');
    $scrollbar.css('-webkit-transform', '');

}


function scrollBarToTop_View(e) {

    //*** call function from views data-show event
    //*** resets the scroll position of the view container to point 0.
    //*** this avoids a problem that arises from switching from a tall to a short content.

    //*** this is used when useNativeScrolling: false
    var scrollbar = e.view.scroller;
    scrollbar.reset();

    //*** this is used when useNativeScrolling: true
    // window.scrollTo(0, 0);

}


function tabBtnClick(e) {

    if (MODAL_ON || SCROLLING) {

        /* AVOID TAB BUTTON CLICK ON MODAL'S CANCEL BUTTON CLICK */
        e.preventDefault();

    } else {

        // playMedia(SOUND_TAP_FILE, SOUND_TAP_DURATION);

        // var prevTabIndex = this.currentItem().index();
        // var selectedTabName = e.item.text()

        // console.log('*** TAB BUTTON CLICK NAME: ' + selectedTabName);

        // var screenToNavigate;
        // var tabId;

        // switch (selectedTabName) {
        //     case 'Locator':
        //         screenToNavigate = '#dist';
        //         tabId = '#tabBtnDist';
        //         break;
        // }

        // if (screenToNavigate != null && tabId != null) {

        //     navigateTo(screenToNavigate, 0);

        //     $(tabId).attr('href', screenToNavigate);
        //     var tabStrip = window.kendoMobileApplication.view().footer.find('.km-tabstrip').data('kendoMobileTabStrip');
        //     tabStrip.switchTo(screenToNavigate);

        // }

    }

}


function openModalViewWithAnimation($elem) {

    var mv = $elem.data('kendoMobileModalView');
    mv.shim.popup.options.animation.open.duration = ANIMATION_SPEED;
    mv.shim.popup.options.animation.open.effects = 'slideIn:up';
    mv.shim.popup.options.animation.close.duration = ANIMATION_SPEED;
    mv.open();

}


function turnLightsOff(msg) {

    $('.km-loader h1').text(msg);
    window.kendoMobileApplication.showLoading();

}


function turnLightsOn() {

    window.kendoMobileApplication.hideLoading();

}


function setUserProfileFormButton() {

    //*** detach previous events
    $('#submitProfileInfoBtn').data('kendoMobileButton').destroy();

    if (NEW_USER) {
        $('#submitProfileInfoBtn').kendoMobileButton({ click: newUserProfile });
        $('#submitProfileInfoBtn span.km-text').text('Start');
    } else {
        $('#submitProfileInfoBtn').kendoMobileButton({ click: updateUserProfile });
        $('#submitProfileInfoBtn span.km-text').text('Done');
    }

}


//function simulateTapOnInput(e) {

//    var obj = e.sender.element[0];
//    
//    $(obj).css('background-color', '#f4f4f4');
//    setTimeout(function () {
//        $(obj).css('background-color', 'transparent');
//    }, 300);

//}


function showErrorMsg(errorType) {

    var iconFile = '';
    var msg = '';

    switch (errorType) {
        case 'form':
            iconFile = 'icons/warn-2.png';
            msg = 'Please make sure that you fill all fields correctly and try again.';
            break;
        case 'connection':
            iconFile = 'icons/not-connected.png';
            msg = 'Internet connectivity is required. Please check connection and try again.';
            break;
    }

    $('#modalviewResultIcon').attr('src', iconFile);
    $('#modalviewResultHtml').html(msg);
    $('#modalviewResult').kendoMobileModalView('open');

}


function closeModalViewResult(e) {

    e.preventDefault(); //*** cancel the second click event

    $('#modalviewResult').kendoMobileModalView('close');
    $('#modalviewResultIcon').attr('src', transparentImg);

}