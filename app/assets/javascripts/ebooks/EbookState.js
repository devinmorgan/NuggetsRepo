/**
 * Created by nerds on 6/25/2017.
 */

function EbookState(eventCoordinator) {
    //==================================================
    // PRIVATE FIELDS
    //==================================================
    var SLOWER_NUM_WORDS = 1;
    var FASTER_NUM_WORDS = 10;
    var isPaused = true;
    var currentWordIndex = 0;
    var ec = eventCoordinator;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.playFromWordIndex = function (index) {
        pause();
        currentWordIndex = index;
        play();
    };

    this.addEventHandlersToBody = function () {
        document.body.addEventListener("keydown", spacebarTogglePlayPause);
        document.body.addEventListener("keydown", leftKeyRewind);
        document.body.addEventListener("keydown", leftShiftKeyRewind);
        document.body.addEventListener("keydown", rightKeyRewind);
        document.body.addEventListener("keydown", rightShiftKeyRewind);
    };

    this.addEventHandlersToIFrameBody = function () {
        getEbookIFrameDocument().body.addEventListener("keydown", spacebarTogglePlayPause);
        getEbookIFrameDocument().body.addEventListener("keydown", leftKeyRewind);
        getEbookIFrameDocument().body.addEventListener("keydown", leftShiftKeyRewind);
        getEbookIFrameDocument().body.addEventListener("keydown", rightKeyRewind);
        getEbookIFrameDocument().body.addEventListener("keydown", rightShiftKeyRewind);
    };

    this.resetWordIndex = function () {
        currentWordIndex = 0;
    };

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
    function wordCount() {
        if (! wordCount) {
            wordCount = getEbookIFrameDocument().querySelectorAll(SINGLE_WORD_SPAN_SELECTOR()).length;
        }
        return wordCount;
    }

    function togglePlayPause() {
        isPaused ? play() : pause();
    }

    function rewind(numWords) {
        pause();
        var newIndex = currentWordIndex - numWords;
        if (newIndex < 0) {
            newIndex = 0;
        }
        currentWordIndex = newIndex;
        highlightCurrentWordSpan();
    }

    function fastForward(numWords) {
        pause();
        var newIndex = currentWordIndex + numWords;
        if (newIndex >= wordCount()) {
            newIndex = wordCount() - 1;
        }
        currentWordIndex = newIndex;
        highlightCurrentWordSpan();
    }

    function elementIsCompletelyWithinIFrame(element) {
        var elemTop = element.getBoundingClientRect().top;
        var elemBottom = element.getBoundingClientRect().bottom;
        return (elemTop >= 0) && (elemBottom <= getEbookIFrameWindow().innerHeight);
    }

    function scrollWordToTopOfIFrame(span) {
        var spanTop = span.getBoundingClientRect().top;
        var windowTop = getEbookIFrameWindow().pageYOffset;
        var oneLineBuffer = -1*span.getBoundingClientRect().height;
        var newWindowTop = windowTop + spanTop + oneLineBuffer;
        getEbookIFrameWindow().scrollTo(0, newWindowTop);
    }

    //==================================================
    // EVENT HANDLERS
    //==================================================
    function spacebarTogglePlayPause(event) {
        if (ec.spacebarKeyIsPressed()) {
            console.log("hello world!!");
            togglePlayPause();
            if (event.target === getEbookIFrameDocument().body || event.target === document.body) {
                event.preventDefault();
            }
        }
    }

    function leftKeyRewind(event) {
        if (ec.leftKeyIsPressed()) {
            rewind(SLOWER_NUM_WORDS);
        }
    }

    function leftShiftKeyRewind(event) {
        if (ec.leftKeyIsPressed() && ec.shiftKeyIsPressed()) {
            rewind(FASTER_NUM_WORDS);
        }
    }

    function rightKeyRewind(event) {
        if (ec.rightKeyIsPressed()) {
            fastForward(SLOWER_NUM_WORDS);
        }
    }

    function rightShiftKeyRewind(event) {
        if (ec.rightKeyIsPressed() && ec.shiftKeyIsPressed()) {
            fastForward(FASTER_NUM_WORDS);
        }
    }
}
