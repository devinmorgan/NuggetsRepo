function AudioPlayer(eventController) {
    //==================================================
    // PRIVATE FIELDS
    //==================================================
    var SLOWER_NUM_WORDS = 1;
    var FASTER_NUM_WORDS = 10;

    var that = this;
    var ew = new EncapsulateWords();
    var ec = eventController;
    var rsc = new ReadingSpeedController(ec, this);
    var tts = new TextToSpeecher(this);
    var wt = new WordTracker(this);

    var isPaused = true;
    var currentWordIndex = 0;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.addEventHandlersToBody = function () {
        document.body.addEventListener("keydown", spacebarTogglePlayPause);
        document.body.addEventListener("keydown", leftKeyRewind);
        document.body.addEventListener("keydown", leftShiftKeyRewind);
        document.body.addEventListener("keydown", rightKeyFastForward);
        document.body.addEventListener("keydown", rightShiftKeyFastForward);
        rsc.addEventHandlersToBody();
    };

    this.addEventHandlersToIFrameBody = function () {
        getEbookIFrameDocument().body.addEventListener("keydown", spacebarTogglePlayPause);
        getEbookIFrameDocument().body.addEventListener("keydown", leftKeyRewind);
        getEbookIFrameDocument().body.addEventListener("keydown", leftShiftKeyRewind);
        getEbookIFrameDocument().body.addEventListener("keydown", rightKeyFastForward);
        getEbookIFrameDocument().body.addEventListener("keydown", rightShiftKeyFastForward);
        rsc.addEventHandlersToIFrameBody();
    };

    this.init = function () {
        that.pause();
        ew.encapsulateWordsIntoSpans();
        doubleClickWordsToStartReadingFromThere();
        resetWordIndex();
    };

    this.playFromWordIndex = function (index) {
        that.pause();
        currentWordIndex = index;
        that.play();
    };

    this.advanceToNextWord = function () {
        wt.highlightCurrentWordSpan();
        currentWordIndex++;
    };

    this.play = function() {
        isPaused = false;
        tts.play(currentWordIndex);
    };

    this.pause = function() {
        isPaused = true;
        tts.pause();
    };

    this.getCurrentWordIndex = function () {
        return currentWordIndex;
    };

    this.getLanguage = function () {
        return "en-US";
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

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
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
        wt.highlightCurrentWordSpan();
    }

    function fastForward(numWords) {
        that.pause();
        var newIndex = currentWordIndex + numWords;
        if (newIndex >= ew.wordCount()) {
            newIndex = ew.wordCount() - 1;
        }
        currentWordIndex = newIndex;
        wt.highlightCurrentWordSpan();
    }

    function doubleClickWordsToStartReadingFromThere() {
        var spans = getEbookIFrameDocument().querySelectorAll(SINGLE_WORD_SPAN_SELECTOR());
        for (var i = 0; i < spans.length; i++) {
            (function (ii) {
                spans[ii].dataset.wordIndex = ii;
                spans[ii].addEventListener("dblclick", function (event) {
                    if (! ec.hKeyIsToggledOn()) {
                        that.playFromWordIndex(ii);
                    }
                });
            }(i));
        }
    }

    function resetWordIndex () {
        currentWordIndex = 0;
    }

    //==================================================
    // EVENT HANDLERS
    //==================================================
    function spacebarTogglePlayPause(event) {
        if (ec.spacebarKeyIsPressed() && !ec.hKeyIsToggledOn()) {
            togglePlayPause();
            if (event.target === getEbookIFrameDocument().body || event.target === document.body) {
                event.preventDefault();
            }
        }
    }

    function leftKeyRewind(event) {
        if (ec.leftKeyIsPressed() && !ec.hKeyIsToggledOn()) {
            rewind(SLOWER_NUM_WORDS);
        }
    }

    function leftShiftKeyRewind(event) {
        if (ec.leftKeyIsPressed() && ec.shiftKeyIsPressed() && !ec.hKeyIsToggledOn()) {
            rewind(FASTER_NUM_WORDS);
        }
    }

    function rightKeyFastForward(event) {
        if (ec.rightKeyIsPressed() && !ec.hKeyIsToggledOn()) {
            fastForward(SLOWER_NUM_WORDS);
        }
    }

    function rightShiftKeyFastForward(event) {
        if (ec.rightKeyIsPressed() && ec.shiftKeyIsPressed() && !ec.hKeyIsToggledOn()) {
            fastForward(FASTER_NUM_WORDS);
        }
    }
}