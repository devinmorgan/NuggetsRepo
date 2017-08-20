/**
 * Created by nerds on 8/18/2017.
 */

function EventCoordinator(ebookState) {
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

    var SLOWER_NUM_WORDS = 1;
    var FASTER_NUM_WORDS = 10;

    var keyDownHandlers = [
        logKeyDownEvent,
        spacebarTogglePlayPause,
        leftKeyRewind,
        leftShiftKeyRewind,
        rightKeyRewind,
        rightShiftKeyRewind,
        sUpKeyIncreaseReadingSpeed,
        sDownKeyDecreaseReadingSpeed,
        fUpKeyIncreaseFontSize,
        fDownKeyDecreaseFontSize
    ];

    var keyUpHandlers = [
        logKeyUpEvent
    ];

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.addAllEventHandlersToBody = function () {
        for (var i = 0; i < keyDownHandlers.length; i++) {
            document.body.addEventListener("keydown", keyDownHandlers[i]);
        }
        for (var j = 0; j < keyUpHandlers.length; j++) {
            document.body.addEventListener("keyup", keyUpHandlers[j]);
        }
    };

    this.addAllEventHandlersToIFrameBody = function () {
        for (var i = 0; i < keyDownHandlers.length; i++) {
            getEbookIFrameDocument().body.addEventListener("keydown", keyDownHandlers[i], false);
        }
        for (var j = 0; j < keyUpHandlers.length; j++) {
            getEbookIFrameDocument().body.addEventListener("keyup", keyUpHandlers[j], false);
        }
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

    function spacebarTogglePlayPause(event) {
        if (trackedKeyPresses[SPACE_BAR_KEY]) {
            console.log("hello world!!");
            ebookState.togglePlayPause();
            if (event.target === getEbookIFrameDocument().body || event.target === document.body) {
                event.preventDefault();
            }
        }
    }

    function leftKeyRewind(event) {
        if (trackedKeyPresses[LEFT_KEY]) {
            ebookState.rewind(SLOWER_NUM_WORDS);
        }
    }

    function leftShiftKeyRewind(event) {
        if (trackedKeyPresses[LEFT_KEY] && trackedKeyPresses[SHIFT_KEY]) {
            ebookState.rewind(FASTER_NUM_WORDS);
        }
    }

    function rightKeyRewind(event) {
        if (trackedKeyPresses[RIGHT_KEY]) {
            ebookState.fastForward(SLOWER_NUM_WORDS);
        }
    }

    function rightShiftKeyRewind(event) {
        if (trackedKeyPresses[RIGHT_KEY] && trackedKeyPresses[SHIFT_KEY]) {
            ebookState.fastForward(FASTER_NUM_WORDS);
        }
    }

    function sUpKeyIncreaseReadingSpeed(event) {
        if (trackedKeyPresses[UP_KEY] && trackedKeyPresses[S_KEY]) {
            ebookState.increaseReadingSpeed('reading-speed');
            if (event.target === getEbookIFrameDocument().body || event.target === document.body) {
                event.preventDefault();
            }
        }
    }

    function sDownKeyDecreaseReadingSpeed(event) {
        if (trackedKeyPresses[DOWN_KEY] && trackedKeyPresses[S_KEY]) {
            ebookState.decreaseReadingSpeed('reading-speed');
            if (event.target === getEbookIFrameDocument().body || event.target === document.body) {
                event.preventDefault();
            }
        }
    }

    function fUpKeyIncreaseFontSize(event) {
        if (trackedKeyPresses[UP_KEY] && trackedKeyPresses[F_KEY]) {
            ebookState.increaseFontSize('font-size');
            if (event.target === getEbookIFrameDocument().body || event.target === document.body) {
                event.preventDefault();
            }
        }
    }

    function fDownKeyDecreaseFontSize(event) {
        if (trackedKeyPresses[DOWN_KEY] && trackedKeyPresses[F_KEY]) {
            ebookState.decreaseFontSize('font-size');
            if (event.target === getEbookIFrameDocument().body || event.target === document.body) {
                event.preventDefault();
            }
        }
    }
}