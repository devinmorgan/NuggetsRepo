/**
 * Created by nerds on 6/25/2017.
 */

function EbookState(eventCoordinator, readingSpeedController) {
    //==================================================
    // PRIVATE FIELDS
    //==================================================
    var SLOWER_NUM_WORDS = 1;
    var FASTER_NUM_WORDS = 10;

    var that = this;
    var ec = eventCoordinator;
    var rsc = readingSpeedController;
    var tts = new TextToSpeecher();
    var wh = new WordHighlighter();

    var isPaused = true;
    var currentWordIndex = 0;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.playFromWordIndex = function (index) {
        that.pause();
        currentWordIndex = index;
        that.play();
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

    this.getCurrentWordIndex = function () {
        return currentWordIndex;
    };

    this.getVolume = function () {
        return 1; // [0 - 1]
    };

    this.getReadingSpeed = function () {
        return rsc.getReadingSpeed(); // [0.1 - 10]
    };

    this.getPitch = function () {
        return 1; // [1 - 2]
    };

    this.getVoice = function () {
        var voices = window.speechSynthesis.getVoices();
        var defaultVoice = voices.filter(
            function(voice) {
                return voice.name === "Google US English";
            })[0];
        return defaultVoice;
    };

    this.advanceToNextWord = function () {
        currentWordIndex++;
        wh.highlightCurrentWordSpan();
    };

    this.play = function() {
        tts.play(currentWordIndex);
    };

    this.pause = function() {
        tts.pause();
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
        isPaused ? that.play() : that.pause();
    }

    function rewind(numWords) {
        that.pause();
        var newIndex = currentWordIndex - numWords;
        if (newIndex < 0) {
            newIndex = 0;
        }
        currentWordIndex = newIndex;
        ws.highlightCurrentWordSpan();
    }

    function fastForward(numWords) {
        that.pause();
        var newIndex = currentWordIndex + numWords;
        if (newIndex >= wordCount()) {
            newIndex = wordCount() - 1;
        }
        currentWordIndex = newIndex;
        ws.highlightCurrentWordSpan();
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
