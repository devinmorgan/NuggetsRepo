/**
 * Created by nerds on 8/18/2017.
 */
var H_KEY = 72;
var trackToggledKeys = {};
trackToggledKeys[H_KEY] = false;
function EventCoordinator() {
    //==================================================
    // PRIVATE VARS
    //==================================================
    var SHIFT_KEY = 16;
    var SPACE_BAR_KEY = 32;
    var LEFT_KEY = 37;
    var RIGHT_KEY = 39;
    var UP_KEY = 38;
    var DOWN_KEY = 40;
    var S_KEY = 83;
    var F_KEY = 70;


    var trackedKeyPresses = {};
    trackedKeyPresses[SHIFT_KEY] = false;
    trackedKeyPresses[SPACE_BAR_KEY] = false;
    trackedKeyPresses[LEFT_KEY] = false;
    trackedKeyPresses[RIGHT_KEY] = false;
    trackedKeyPresses[UP_KEY] = false;
    trackedKeyPresses[DOWN_KEY] = false;
    trackedKeyPresses[S_KEY] = false;
    trackedKeyPresses[F_KEY] = false;



    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.shiftKeyIsPressed = function () {
        return trackedKeyPresses[SHIFT_KEY];
    };

    this.spacebarKeyIsPressed = function () {
        return trackedKeyPresses[SPACE_BAR_KEY];
    };

    this.leftKeyIsPressed = function () {
        return trackedKeyPresses[LEFT_KEY];
    };

    this.rightKeyIsPressed = function () {
        return trackedKeyPresses[RIGHT_KEY];
    };

    this.upKeyIsPressed = function () {
        return trackedKeyPresses[UP_KEY];
    };

    this.downKeyIsPressed = function () {
        return trackedKeyPresses[DOWN_KEY];
    };

    this.sKeyIsPressed = function () {
        return trackedKeyPresses[S_KEY];
    };

    this.fKeyIsPressed = function () {
        return trackedKeyPresses[F_KEY];
    };

    this.hKeyIsToggledOn = function () {
        return trackToggledKeys[H_KEY];
    };

    this.addEventHandlersToBody = function () {
        document.body.addEventListener("keydown", logKeyDownEvent);
        document.body.addEventListener("keyup", logKeyUpEvent);
        document.body.addEventListener("keydown", logToggledKeyEvent);
    };

    this.addEventHandlersToIFrameBody = function () {
        getEbookIFrameDocument().body.addEventListener("keydown", logKeyDownEvent);
        getEbookIFrameDocument().body.addEventListener("keyup", logKeyUpEvent);
        getEbookIFrameDocument().body.addEventListener("keydown", logToggledKeyEvent);
    };

    //==================================================
    // EVENT HANDLERS
    //==================================================
    function logKeyDownEvent(event) {
        if (event.keyCode in trackedKeyPresses) {
            trackedKeyPresses[event.keyCode] = true;
        }
    }

    function logKeyUpEvent(event) {
        if (event.keyCode in trackedKeyPresses) {
            trackedKeyPresses[event.keyCode] = false;
        }
    }

    function logToggledKeyEvent(event) {
        if (event.keyCode in trackToggledKeys) {
            trackToggledKeys[event.keyCode] = !trackToggledKeys[event.keyCode];
        }
    }
}