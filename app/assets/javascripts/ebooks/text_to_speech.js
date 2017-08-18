/**
 * Created by nerds on 6/25/2017.
 */

function SINGLE_WORD_SPAN_CLASS() {
    return "single-word";
}
function SINGLE_WORD_SPAN_SELECTOR() {
    return "." + SINGLE_WORD_SPAN_CLASS();
}

function CURRENT_WORD_SPAN_CLASS() {
    return "current-word";
}

function CURRENT_WORD_SPAN_SELECTOR() {
    return "." + CURRENT_WORD_SPAN_CLASS();
}

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
        var newReadingSpeed = that.wordsPerMinute + 5;
        if (newReadingSpeed > MAX_READING_SPEED) {
            newReadingSpeed = MAX_READING_SPEED;
        }
        setReadingSpeed(newReadingSpeed, displayElementID);
    };

    this.decreaseReadingSpeed = function (displayElementID) {
        pause();
        var newReadingSpeed = that.wordsPerMinute - 5;
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
































var section = null;
function processNewSection() {
    //==================================================
    // MAIN LOGIC
    //==================================================
    (function encapsulateWordsIntoSpans() {
        var textNodes = getAllTextNodes();
        for (var i = 0; i < textNodes.length; i++) {
            var spans = extractSingleWordSpansFromTextNode(textNodes[i]);
            replaceTextNodeWithSingleWordSpans(textNodes[i], spans);
        }
        indexSingleWordSpans();
    })();
    section = new EbookState();
    addKeyDownHandler(spacebarTogglePlayPause, spacebarTogglePlayPauseIFrame);
    addKeyDownHandler(leftKeyRewind, leftKeyRewind);
    addKeyDownHandler(leftShiftKeyRewind, leftShiftKeyRewind);
    addKeyDownHandler(rightKeyRewind, rightKeyRewind);
    addKeyDownHandler(rightShiftKeyRewind, rightShiftKeyRewind);
    section.decreaseFontSize();

    //==================================================
    // CONSTANTS
    //==================================================
    var SPACE_BAR_KEY = 32;
    var LEFT_KEY = 37;
    var RIGHT_KEY = 39;
    var SLOWER_NUM_WORDS = 1;
    var FASTER_NUM_WORDS = 10;

    //==================================================
    // HELPER FUNCTIONS
    //==================================================
    function indexSingleWordSpans() {
        var spans = getEbookIFrameDocument().querySelectorAll(SINGLE_WORD_SPAN_SELECTOR());
        for (var i = 0; i < spans.length; i++) {
            (function (ii) {
                spans[ii].dataset.wordIndex = ii;
                spans[ii].addEventListener("dblclick", function () {
                    section.playFromWordIndex(ii);
                });
            }(i));
        }
    }

    function getAllTextNodes() {
        var iFrameBody = getEbookIFrameDocument().body;
        var textNodesOnlyFilter = NodeFilter.SHOW_TEXT;
        var filterOutEmptyTextNodes = function (node) {
            var onlyContainsWhitespace = new RegExp("^\\s*$");
            if (onlyContainsWhitespace.test(node.data)) {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        };
        var dontDiscardSubTreeIfRejected = false;
        var treeWalker = document.createTreeWalker(
            iFrameBody,
            textNodesOnlyFilter,
            filterOutEmptyTextNodes,
            dontDiscardSubTreeIfRejected
        );
        var node;
        var textNodeArray = [];
        while (node = treeWalker.nextNode()) {
            textNodeArray.push(node);
        }
        return textNodeArray;
    }

    function replaceTextNodeWithSingleWordSpans(textNode, spans) {
        var parent = textNode.parentNode;
        var refNode = textNode;
        for (var i = spans.length - 1; i >= 0; i--) {
            refNode = parent.insertBefore(spans[i], refNode);
        }
        parent.removeChild(textNode);
    }

    function extractSingleWordSpansFromTextNode(textNode) {
        var words = textNode.textContent.split(" ");
        var singleWordSpans = [];
        for (var i = 0; i < words.length; i++) {
            if (words[i] !== "") {
                var newSpan = createSingleWordSpan(words[i]);
                singleWordSpans.push(newSpan);
            }
        }
        return singleWordSpans;
    }

    function createSingleWordSpan(word) {
        var span = document.createElement("span");
        span.className = SINGLE_WORD_SPAN_CLASS();
        var newTextNode = document.createTextNode(word);
        span.appendChild(newTextNode);
        return span;
    }

    //==================================================
    // EVENT HANDLERS
    //==================================================
    function spacebarTogglePlayPause(event) {
        if (event.keyCode === SPACE_BAR_KEY) {
            section.togglePlayPause();
        }
    }

    function spacebarTogglePlayPauseIFrame(event) {
        if (event.keyCode === SPACE_BAR_KEY) {
            section.togglePlayPause();
            if (event.target === getEbookIFrameDocument().body) {
                event.preventDefault();
            }
        }
    }

    function leftKeyRewind(event) {
        if (event.keyCode === LEFT_KEY) {
            section.rewind(SLOWER_NUM_WORDS);
        }
    }

    function leftShiftKeyRewind(event) {
        if (event.keyCode === LEFT_KEY && event.shiftKey) {
            section.rewind(FASTER_NUM_WORDS);
        }
    }

    function rightKeyRewind(event) {
        if (event.keyCode === RIGHT_KEY) {
            section.fastForward(SLOWER_NUM_WORDS);
        }
    }

    function rightShiftKeyRewind(event) {
        if (event.keyCode === RIGHT_KEY && event.shiftKey) {
            section.fastForward(FASTER_NUM_WORDS);
        }
    }
}
