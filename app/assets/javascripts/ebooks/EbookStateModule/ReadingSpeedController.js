/**
 * Created by nerds on 8/19/2017.
 */

function ReadingSpeedController(eventCoordinator, ebookState) {
    //==================================================
    // PRIVATE VARIABLES
    //==================================================
    var READING_SPEED_INCREMENT = 1;
    var MAX_READING_SPEED = 10;
    var MIN_READING_SPEED = 1;

    var ec = eventCoordinator;
    var es = ebookState;
    var readingSpeed = 1;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.getReadingSpeed = function () {
        return readingSpeed;
    };

    this.addEventHandlersToBody = function () {
        document.body.addEventListener("keydown", sUpKeyIncreaseReadingSpeed);
        document.body.addEventListener("keydown", sDownKeyDecreaseReadingSpeed);
    };

    this.addEventHandlersToIFrameBody = function () {
        getEbookIFrameDocument().body.addEventListener("keydown", sUpKeyIncreaseReadingSpeed);
        getEbookIFrameDocument().body.addEventListener("keydown", sDownKeyDecreaseReadingSpeed);
    };

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
    function increaseReadingSpeed(displayElementID) {
        es.pause();
        var newReadingSpeed = readingSpeed + READING_SPEED_INCREMENT;
        if (newReadingSpeed > MAX_READING_SPEED) {
            newReadingSpeed = MAX_READING_SPEED;
        }
        setReadingSpeed(newReadingSpeed, displayElementID);
    }

    function decreaseReadingSpeed(displayElementID) {
        es.pause();
        var newReadingSpeed = readingSpeed - READING_SPEED_INCREMENT;
        if (newReadingSpeed < MIN_READING_SPEED) {
            newReadingSpeed = MIN_READING_SPEED;
        }
        setReadingSpeed(newReadingSpeed, displayElementID);
    }

    function setReadingSpeed(speed, displayID) {
        readingSpeed = speed;
        if (displayID) {
            var message = "Reading Speed: " + readingSpeed + "/10";
            var display = document.getElementById(displayID);
            display.innerHTML = message;
        }
    }

    //==================================================
    // EVENT HANDLERS
    //==================================================
    function sUpKeyIncreaseReadingSpeed(event) {
        if (ec.upKeyIsPressed() && ec.sKeyIsPressed()) {
            ebookState.increaseReadingSpeed('reading-speed');
            if (event.target === getEbookIFrameDocument().body || event.target === document.body) {
                event.preventDefault();
            }
        }
    }

    function sDownKeyDecreaseReadingSpeed(event) {
        if (ec.downKeyIsPressed() && ec.sKeyIsPressed()) {
            ebookState.decreaseReadingSpeed('reading-speed');
            if (event.target === getEbookIFrameDocument().body || event.target === document.body) {
                event.preventDefault();
            }
        }
    }
}