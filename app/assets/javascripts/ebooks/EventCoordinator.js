/**
 * Created by nerds on 8/18/2017.
 */

function EventCoordinator() {
    //==================================================
    // TRACKED KEYS
    //==================================================
    var SHIFT_KEY = 16;
    var SPACE_BAR_KEY = 32;
    var LEFT_KEY = 37;
    var RIGHT_KEY = 39;
    var UP_KEY = 38;
    var DOWN_KEY = 40;
    var S_KEY = 83;

    var trackedKeyPresses = {};
    trackedKeyPresses[SHIFT_KEY] = false;
    trackedKeyPresses[SPACE_BAR_KEY] = false;
    trackedKeyPresses[LEFT_KEY] = false;
    trackedKeyPresses[RIGHT_KEY] = false;
    trackedKeyPresses[UP_KEY] = false;
    trackedKeyPresses[DOWN_KEY] = false;
    trackedKeyPresses[S_KEY] = false;

    //==================================================
    // PRIVATE VARS
    //==================================================

    var SLOWER_NUM_WORDS = 1;
    var FASTER_NUM_WORDS = 10;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.addAllHandlers = function () {
        addKeyDownHandler(logKeyDownEvent, logKeyDownEvent);
        addKeyUpHandler(logKeyUpEvent, logKeyUpEvent);

        addKeyDownHandler(spacebarTogglePlayPause, spacebarTogglePlayPause);
        addKeyDownHandler(leftKeyRewind, leftKeyRewind);
        addKeyDownHandler(leftShiftKeyRewind, leftShiftKeyRewind);
        addKeyDownHandler(rightKeyRewind, rightKeyRewind);
        addKeyDownHandler(rightShiftKeyRewind, rightShiftKeyRewind);
        addKeyDownHandler(sUpKeyIncreaseReadingSpeed, sUpKeyIncreaseReadingSpeed);
        addKeyDownHandler(sDownKeyDecreaseReadingSpeed, sDownKeyDecreaseReadingSpeed);
    };

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
    function addKeyDownHandler(bodyHandle, iframeBodyHandle) {
        document.body.addEventListener("keydown", bodyHandle);
        getEbookIFrameDocument().body.addEventListener("keydown", iframeBodyHandle);
    }

    function addKeyUpHandler(bodyHandle, iframeBodyHandle) {
        document.body.addEventListener("keyup", bodyHandle);
        getEbookIFrameDocument().body.addEventListener("keyup", iframeBodyHandle);
    }

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
            section.togglePlayPause();
            if (event.target === getEbookIFrameDocument().body || event.target === document.body) {
                event.preventDefault();
            }
        }
    }

    function leftKeyRewind(event) {
        if (trackedKeyPresses[LEFT_KEY]) {
            section.rewind(SLOWER_NUM_WORDS);
        }
    }

    function leftShiftKeyRewind(event) {
        if (trackedKeyPresses[LEFT_KEY] && trackedKeyPresses[SHIFT_KEY]) {
            section.rewind(FASTER_NUM_WORDS);
        }
    }

    function rightKeyRewind(event) {
        if (trackedKeyPresses[RIGHT_KEY]) {
            section.fastForward(SLOWER_NUM_WORDS);
        }
    }

    function rightShiftKeyRewind(event) {
        if (trackedKeyPresses[RIGHT_KEY] && trackedKeyPresses[SHIFT_KEY]) {
            section.fastForward(FASTER_NUM_WORDS);
        }
    }

    function sUpKeyIncreaseReadingSpeed(event) {
        if (trackedKeyPresses[UP_KEY] && trackedKeyPresses[S_KEY]) {
            section.increaseReadingSpeed('reading-speed');
            if (event.target === getEbookIFrameDocument().body || event.target === document.body) {
                event.preventDefault();
            }
        }
    }

    function sDownKeyDecreaseReadingSpeed(event) {
        if (trackedKeyPresses[DOWN_KEY] && trackedKeyPresses[S_KEY]) {
            section.decreaseReadingSpeed('reading-speed');
            if (event.target === getEbookIFrameDocument().body || event.target === document.body) {
                event.preventDefault();
            }
        }
    }
}