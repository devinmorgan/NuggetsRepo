/**
 * Created by nerds on 6/25/2017.
 */

function EbookState() {
    //==================================================
    // PUBLIC FIELDS
    //==================================================
    this.currentWordIndex = 0;
    this.wordsPerMinute = 200;
    this.fontSizeInEMs = 1;

    //==================================================
    // PRIVATE FIELDS
    //==================================================
    var that = this;
    var wordCount = getEbookIFrameDocument().querySelectorAll(SINGLE_WORD_SPAN_SELECTOR()).length;
    var intervalTimer = null;
    var isPaused = true;

    var MIN_FONT_EM_SIZE = 1;
    var MAX_FONT_EM_SIZE = 1.5;
    var FONT_EM_INCREMENT = 0.05;
    var READING_SPEED_INCREMENT = 5;
    var MAX_READING_SPEED = 700;
    var MIN_READING_SPEED = 150;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.togglePlayPause = function () {
        isPaused ? play() : pause();
    };

    this.playFromWordIndex = function (index) {
        clearTimeout(intervalTimer);
        that.currentWordIndex = index;
        play();
    };

    this.wordCount = function () {
        return wordCount;
    };

    this.rewind = function (numWords) {
        pause();
        var newIndex = that.currentWordIndex - numWords;
        if (newIndex < 0) {
           newIndex = 0;
        }
        that.currentWordIndex = newIndex;
        highlightCurrentWordSpan();
    };

    this.fastForward = function (numWords) {
        pause();
        var newIndex = that.currentWordIndex + numWords;
        if (newIndex >= wordCount) {
            newIndex = wordCount - 1;
        }
        that.currentWordIndex = newIndex;
        highlightCurrentWordSpan();
    };

    this.increaseFontSize = function (displayElementID) {
        var newFontSize = that.fontSizeInEMs + FONT_EM_INCREMENT;
        if (newFontSize > MAX_FONT_EM_SIZE) {
            newFontSize = MAX_FONT_EM_SIZE;
        }
        setIFrameFontSizeInEMs(newFontSize, displayElementID);
    };

    this.decreaseFontSize = function (displayElementID) {
        var newFontSize = that.fontSizeInEMs - FONT_EM_INCREMENT;
        if (newFontSize < MIN_FONT_EM_SIZE) {
            newFontSize = MIN_FONT_EM_SIZE;
        }
        setIFrameFontSizeInEMs(newFontSize, displayElementID);
    };

    this.increaseReadingSpeed = function (displayElementID) {
        pause();
        var newReadingSpeed = that.wordsPerMinute + READING_SPEED_INCREMENT;
        if (newReadingSpeed > MAX_READING_SPEED) {
            newReadingSpeed = MAX_READING_SPEED;
        }
        setReadingSpeed(newReadingSpeed, displayElementID);
    };

    this.decreaseReadingSpeed = function (displayElementID) {
        pause();
        var newReadingSpeed = that.wordsPerMinute - READING_SPEED_INCREMENT;
        if (newReadingSpeed < MIN_READING_SPEED) {
            newReadingSpeed = MIN_READING_SPEED;
        }
        setReadingSpeed(newReadingSpeed, displayElementID);
    };

    this.nextSection = function () {

    };

    this.prevSection = function () {

    };

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
    function unselectSingleWordSpan(singleWordSpan) {
        if (singleWordSpan) {
            singleWordSpan.className = SINGLE_WORD_SPAN_CLASS();
        }
    }

    function selectSingleWordSpan(singleWordSpan) {
        if (singleWordSpan) {
            singleWordSpan.className = SINGLE_WORD_SPAN_CLASS() + " " + CURRENT_WORD_SPAN_CLASS();
        }
    }

    function nthSingleWordSpanSelector(n) {
        return "span" + SINGLE_WORD_SPAN_SELECTOR() + "[data-word-index='" + n + "']";
    }

    function highlightNthSingleWordSpan(index) {
        var currentWord = getEbookIFrameDocument().querySelector(CURRENT_WORD_SPAN_SELECTOR());
        unselectSingleWordSpan(currentWord);
        var newWord = getEbookIFrameDocument().querySelector(nthSingleWordSpanSelector(index));
        selectSingleWordSpan(newWord);
        if (! elementIsCompletelyWithinIFrame(newWord)) {
            scrollWordToTopOfIFrame(newWord);
        }
    }

    function highlightCurrentWordSpan() {
        highlightNthSingleWordSpan(that.currentWordIndex);
    }

    function play() {
        var interWordDelay = 1 / that.wordsPerMinute * 1000 * 60;
        intervalTimer = setInterval(function () {
            highlightCurrentWordSpan();
            that.currentWordIndex++;
            if (that.currentWordIndex === wordCount) {
                clearTimeout(intervalTimer);
            }
        }, interWordDelay);
        isPaused = false;
    }

    function pause() {
        clearTimeout(intervalTimer);
        isPaused = true;
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

    function setIFrameFontSizeInEMs(fontSize, displayID) {
        that.fontSizeInEMs = fontSize;
        getEbookIFrameDocument().body.style.fontSize = fontSize + "em";
        if (displayID) {
            var message = "Font size: " + that.fontSizeInEMs.toPrecision(3) + "em";
            var display = document.getElementById(displayID);
            display.innerHTML = message;
        }
    }

    function setReadingSpeed(speed, displayID) {
        that.wordsPerMinute = speed;
        if (displayID) {
            var message = "Words Per Minute: " + speed + "wpm";
            var dispaly = document.getElementById(displayID);
            dispaly.innerHTML = message;
        }
    }
}
