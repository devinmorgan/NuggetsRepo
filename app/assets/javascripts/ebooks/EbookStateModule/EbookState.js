/**
 * Created by nerds on 6/25/2017.
 */

function EbookState() {
    //==================================================
    // PRIVATE FIELDS
    //==================================================
    var SLOWER_NUM_WORDS = 1;
    var FASTER_NUM_WORDS = 10;

    var that = this;
    var ew = new EncapsulateWords();
    var ec = new EventCoordinator();
    var rsc = new ReadingSpeedController(ec,  this);
    var tts = new TextToSpeecher(this);
    var wt = new WordTracker(this);
    var fsc = new FontSizeController(ec);
    var th = new TextHighlighter(ec);

    var isPaused = true;
    var currentWordIndex = 0;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.onIFrameLoad = function () {
        that.pause();
        ew.encapsulateWordsIntoSpans();
        indexSingleWordSpans();
        addEventHandlersToIFrameBody();
        resetWordIndex();
    };

    this.onBodyLoad = function () {
        addEventHandlersToBody();
    };

    this.playFromWordIndex = function (index) {
        that.pause();
        currentWordIndex = index;
        that.play();
    };

    this.getCurrentWordIndex = function () {
        return currentWordIndex;
    };

    this.getLanguage = function () {
        return "en-US";
    }

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

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
    function addEventHandlersToBody() {
        ec.addEventHandlersToBody();
        document.body.addEventListener("keydown", spacebarTogglePlayPause);
        document.body.addEventListener("keydown", leftKeyRewind);
        document.body.addEventListener("keydown", leftShiftKeyRewind);
        document.body.addEventListener("keydown", rightKeyRewind);
        document.body.addEventListener("keydown", rightShiftKeyRewind);
        rsc.addEventHandlersToBody();
        fsc.addEventHandlersToBody();
        th.addEventHandlersToBody();
    }

    function addEventHandlersToIFrameBody() {
        ec.addEventHandlersToIFrameBody();
        getEbookIFrameDocument().body.addEventListener("keydown", spacebarTogglePlayPause);
        getEbookIFrameDocument().body.addEventListener("keydown", leftKeyRewind);
        getEbookIFrameDocument().body.addEventListener("keydown", leftShiftKeyRewind);
        getEbookIFrameDocument().body.addEventListener("keydown", rightKeyRewind);
        getEbookIFrameDocument().body.addEventListener("keydown", rightShiftKeyRewind);
        rsc.addEventHandlersToIFrameBody();
        fsc.addEventHandlersToIFrameBody();
        th.addEventHandlersToBody();
    }

    function indexSingleWordSpans() {
        var spans = getEbookIFrameDocument().querySelectorAll(SINGLE_WORD_SPAN_SELECTOR());
        for (var i = 0; i < spans.length; i++) {
            (function (ii) {
                spans[ii].dataset.wordIndex = ii;
                spans[ii].addEventListener("dblclick", function () {
                    that.playFromWordIndex(ii);
                });
            }(i));
        }
    }

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
        wt.highlightCurrentWordSpan();
    }

    function fastForward(numWords) {
        that.pause();
        var newIndex = currentWordIndex + numWords;
        if (newIndex >= wordCount()) {
            newIndex = wordCount() - 1;
        }
        currentWordIndex = newIndex;
        wt.highlightCurrentWordSpan();
    }

    function resetWordIndex () {
        currentWordIndex = 0;
    }

    //==================================================
    // EVENT HANDLERS
    //==================================================
    function spacebarTogglePlayPause(event) {
        if (ec.spacebarKeyIsPressed()) {
            console.log("Spacebar pressed down");
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
