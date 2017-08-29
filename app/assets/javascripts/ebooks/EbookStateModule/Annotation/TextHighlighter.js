/**
 * Created by nerds on 8/23/2017.
 */

function TextHighlighter(eventCoordinator, ebookState) {
    //==================================================
    // PRIVATE VARIABLES
    //==================================================
    var SLOWER_NUM_WORDS = 1;
    var FASTER_NUM_WORDS = 10;
    var H_KEY = 72;

    var ec = eventCoordinator;
    var es = ebookState;

    var currentHighlights = [];

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.addEventHandlersToBody = function () {
        document.body.addEventListener("keydown", hKeyPressedToggleHighlightingMode);
        document.body.addEventListener("keydown", leftKeyUnhighlight);
        document.body.addEventListener("keydown", leftShiftKeyUnhighlight);
        document.body.addEventListener("keydown", rightKeyHighlight);
        document.body.addEventListener("keydown", rightShiftKeyHighlight);
        document.body.addEventListener("keydown", escapeKeyDeleteNewHighlight);
        document.body.addEventListener("keydown", enterKeySaveNewHighlight);
    };

    this.addEventHandlersToIFrameBody = function () {
        getEbookIFrameDocument().body.addEventListener("keydown", hKeyPressedToggleHighlightingMode);
        getEbookIFrameDocument().body.addEventListener("keydown", leftKeyUnhighlight);
        getEbookIFrameDocument().body.addEventListener("keydown", leftShiftKeyUnhighlight);
        getEbookIFrameDocument().body.addEventListener("keydown", rightKeyHighlight);
        getEbookIFrameDocument().body.addEventListener("keydown", rightShiftKeyHighlight);
        getEbookIFrameDocument().body.addEventListener("keydown", escapeKeyDeleteNewHighlight);
        getEbookIFrameDocument().body.addEventListener("keydown", enterKeySaveNewHighlight);
    };

    this.startNewHighlightAtIndex = function (index) {
        if (! indexIsInCurrentHighlight(index)) {
            var nextHighlight = new Highlight(index);
            nextHighlight.highlightFirstWord();
            currentHighlights.push(nextHighlight);
        }
    };

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
    function indicateHighlightingModeState() {
        var message = ec.hKeyIsToggledOn() ? "Highlighting Mode: True" : "Highlighting Mode: False";
        var displayElement = document.getElementById("highlighting-mode");
        displayElement.innerHTML = message;
    }

    function unhighlightLastNWords(n) {
        if (startedHighlighting()) {
            var mostRecentHighlight = currentHighlights[currentHighlights.length - 1];
            if (mostRecentHighlight.lengthInWords() < n) {
                mostRecentHighlight.delete();
                currentHighlights.pop();
            }
            else {
                mostRecentHighlight.unhighlightLastNWords(n);
            }
        }
    }

    function highlightNextNWords(n) {
        if (startedHighlighting()) {
            var mostRecentHighlight = currentHighlights[currentHighlights.length - 1];
            mostRecentHighlight.highlightNextNWords(n);
        }
    }

    function deleteCurrentHighlights() {
        for (var i = 0; i < currentHighlights.length; i++) {
            var highlight = currentHighlights[i];
            highlight.delete()
        }
        currentHighlights = [];
    }

    function indexIsInCurrentHighlight(index) {
        for (var i = 0; i < currentHighlights.length; i++) {
            var highlight = currentHighlights[i];
            if (highlight.getBeginningIndex() <= index
                && index < highlight.getEndIndex()) {
                console.log("its inside!!");
                return true;
            }
        }
        console.log("its outside!");
        return false;
    }

    function startedHighlighting() {
        return currentHighlights.length > 0;
    }

    function getRangesAsNestedList() {
        var ranges = [];
        for (var i = 0; i < currentHighlights.length; i++) {
            var start = currentHighlights[i].getBeginningIndex();
            var end = currentHighlights[i].getEndIndex();
            var range = [start,  end];
            ranges.push(range);
        }
        return ranges;
    }

    function getHighlightedTextAsString() {
        var highlightTexts = [];
        for (var i = 0; i < currentHighlights.length; i++) {
            var start = currentHighlights[i].getBeginningIndex();
            var end = currentHighlights[i].getEndIndex();
            var words = [];
            for (var j = start; j < end; j++) {
                var span = nthSingleWordSpan(j);
                words.push(span.innerText);
            }
            var text = words.join(" ");
            highlightTexts.push(text);
        }
        return highlightTexts.join("...");
    }

    //==================================================
    // EVENT HANDLERS
    //==================================================
    function hKeyPressedToggleHighlightingMode(event) {
        if (event.keyCode === H_KEY) {
            indicateHighlightingModeState();
        }
    }

    function leftKeyUnhighlight(event) {
        if (ec.leftKeyIsPressed() && ec.hKeyIsToggledOn()) {
            unhighlightLastNWords(SLOWER_NUM_WORDS);
        }
    }

    function leftShiftKeyUnhighlight(event) {
        if (ec.leftKeyIsPressed() && ec.shiftKeyIsPressed() && ec.hKeyIsToggledOn()) {
            unhighlightLastNWords(FASTER_NUM_WORDS);
        }
    }

    function rightKeyHighlight(event) {
        if (ec.rightKeyIsPressed() && ec.hKeyIsToggledOn()) {
            highlightNextNWords(SLOWER_NUM_WORDS);
        }
    }

    function rightShiftKeyHighlight(event) {
        if (ec.rightKeyIsPressed() && ec.shiftKeyIsPressed() && ec.hKeyIsToggledOn()) {
            highlightNextNWords(FASTER_NUM_WORDS);
        }
    }

    function escapeKeyDeleteNewHighlight(event) {
        if (ec.escapeKeyIsPressed() && ec.hKeyIsToggledOn()) {
            deleteCurrentHighlights();
        }
    }

    function enterKeySaveNewHighlight(event) {
        if (ec.enterKeyIsPressed() && ec.hKeyIsToggledOn()) {
            var ranges = getRangesAsNestedList();
            var text = getHighlightedTextAsString();
            es.createNewAnnotationFromHighlights(ranges, text);
            currentHighlights = [];
        }
    }
}