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

    //==================================================
    // PRIVATE FIELDS
    //==================================================
    var that = this;
    var wordCount = getEbookIFrameDocument().querySelectorAll(SINGLE_WORD_SPAN_SELECTOR()).length;
    var intervalTimer = null;
    var isPaused = true;

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

    this.rewindByOneUnit = function () {

    };

    this.fastForwardByOneUnit = function () {

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
    }

    function play() {
        var interWordDelay = 1 / that.wordsPerMinute * 1000 * 60;
        intervalTimer = setInterval(function () {
            highlightNthSingleWordSpan(that.currentWordIndex++);
            if (that.currentWordIndex === wordCount) {
                clearTimeout(intervalTimer);
            }
        }, interWordDelay);
        isPaused = false;
    };

    function pause() {
        clearTimeout(intervalTimer);
        isPaused = true;
    };
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
    addKeyDownHandlerToBody(togglePausePlayOnSpacebar);
    addKeyDownHandlerToIFrameBody(togglePausePlayOnSpacebarForIFrame);

    //==================================================
    // CONSTANTS
    //==================================================
    var SPACE_BAR_KEY = 32;

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

    function togglePausePlayOnSpacebar(event) {
        if (event.keyCode === SPACE_BAR_KEY) {
            section.togglePlayPause();
        }
    }

    function togglePausePlayOnSpacebarForIFrame(event) {
        if (event.keyCode === SPACE_BAR_KEY) {
            section.togglePlayPause();
            if (event.target === getEbookIFrameDocument().body) {
                event.preventDefault();
            }
        }
    }
}
