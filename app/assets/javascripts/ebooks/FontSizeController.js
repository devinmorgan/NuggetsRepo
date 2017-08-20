/**
 * Created by nerds on 8/19/2017.
 */

function FontSizeController(eventCoordinator) {
    //==================================================
    // PRIVATE VARIABLES
    //==================================================
    var MIN_FONT_EM_SIZE = 1;
    var MAX_FONT_EM_SIZE = 1.5;
    var FONT_EM_INCREMENT = 0.05;

    var fontSizeInEMs = 1;
    var ec = eventCoordinator;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.getFontSizeInEMs = function () {
        return fontSizeInEMs;
    };

    this.addEventHandlersToBody = function () {
        document.body.addEventListener("keydown", fUpKeyIncreaseFontSize);
        document.body.addEventListener("keydown", fDownKeyDecreaseFontSize);
    };

    this.addEventHandlersToIFrameBody = function () {
        getEbookIFrameDocument().body.addEventListener("keydown", fUpKeyIncreaseFontSize);
        getEbookIFrameDocument().body.addEventListener("keydown", fDownKeyDecreaseFontSize);
    };

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
    function increaseFontSize() {
        var newFontSize = fontSizeInEMs + FONT_EM_INCREMENT;
        if (newFontSize > MAX_FONT_EM_SIZE) {
            newFontSize = MAX_FONT_EM_SIZE;
        }
        setIFrameFontSizeInEMs(newFontSize, displayElementID);
    }

    function decreaseFontSize() {
        var newFontSize = fontSizeInEMs - FONT_EM_INCREMENT;
        if (newFontSize < MIN_FONT_EM_SIZE) {
            newFontSize = MIN_FONT_EM_SIZE;
        }
        setIFrameFontSizeInEMs(newFontSize, displayElementID);
    }

    function setIFrameFontSizeInEMs(fontSize, displayID) {
        fontSizeInEMs = fontSize;
        getEbookIFrameDocument().body.style.fontSize = fontSizeInEMs + "em";
        if (displayID) {
            var message = "Font size: " + fontSizeInEMs.toPrecision(3) + "em";
            var display = document.getElementById(displayID);
            display.innerHTML = message;
        }
    }

    //==================================================
    // EVENT HANDLERS
    //==================================================
    function fUpKeyIncreaseFontSize(event) {
        if (ec.upKeyIsPressed() && ec.fKeyIsPressed()) {
            increaseFontSize('font-size');
            if (event.target === getEbookIFrameDocument().body || event.target === document.body) {
                event.preventDefault();
            }
        }
    }

    function fDownKeyDecreaseFontSize(event) {
        if (ec.downKeyIsPressed() && ec.fKeyIsPressed()) {
            decreaseFontSize('font-size');
            if (event.target === getEbookIFrameDocument().body || event.target === document.body) {
                event.preventDefault();
            }
        }
    }
}