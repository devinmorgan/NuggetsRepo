/**
 * Created by nerds on 8/23/2017.
 */

function HighlightsTracker(eventCoordinator, ebookController) {
    //==================================================
    // PRIVATE VARIABLES
    //==================================================
    var SLOWER_NUM_WORDS = 1;
    var FASTER_NUM_WORDS = 10;

    var ec = eventCoordinator;
    var controller = ebookController;

    var highlights = [];
    var currentHighlight = null;
    var highlightAreFromExistingAnnotation = false;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.addEventHandlersToBody = function () {
        document.body.addEventListener("keydown", leftKeyUnhighlight);
        document.body.addEventListener("keydown", leftShiftKeyUnhighlight);
        document.body.addEventListener("keydown", rightKeyHighlight);
        document.body.addEventListener("keydown", rightShiftKeyHighlight);
        document.body.addEventListener("keydown", escapeKeyDeleteNewHighlight);
        document.body.addEventListener("keydown", enterKeySaveNewHighlight);
    };

    this.addEventHandlersToIFrameBody = function () {
        getEbookIFrameDocument().body.addEventListener("keydown", leftKeyUnhighlight);
        getEbookIFrameDocument().body.addEventListener("keydown", leftShiftKeyUnhighlight);
        getEbookIFrameDocument().body.addEventListener("keydown", rightKeyHighlight);
        getEbookIFrameDocument().body.addEventListener("keydown", rightShiftKeyHighlight);
        getEbookIFrameDocument().body.addEventListener("keydown", escapeKeyDeleteNewHighlight);
        getEbookIFrameDocument().body.addEventListener("keydown", enterKeySaveNewHighlight);
    };

    this.init = function () {
        var spans = getEbookIFrameDocument().querySelectorAll(SINGLE_WORD_SPAN_SELECTOR());
        for (var i = 0; i < spans.length; i++) {
            (function (ii) {
                spans[ii].addEventListener("dblclick", function (event) {
                    if (ec.hKeyIsToggledOn()) {
                        startNewHighlightAtIndex(ii);
                    }
                });
            })(i);
        }
    };

    this.trackHighlightsForAnnotations = function(annotation) {
        highlightAreFromExistingAnnotation = true;
        // TODO: implement me!!!
    };

    this.selectHighlight = function (highlight) {
        unselectCurrentlySelectedHighlight();
        for (var i = highlight.getBeginningIndex(); i < highlight.getEndIndex(); i++) {
            var span = nthSingleWordSpan(i);
            span.classList.add("selected-highlight");
        }
        currentHighlight = highlight;
    };

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
    function startNewHighlightAtIndex(index) {
        if (! indexIsInCurrentHighlight(index)) {
            var newHighlight = new Highlight(index);
            newHighlight.highlightFirstWord();
            highlights.push(newHighlight);
            currentHighlight = newHighlight;
        }
    }

    function unselectCurrentlySelectedHighlight() {
        if (startedHighlighting()) {
            for (var i = currentHighlight.getBeginningIndex(); i < currentHighlight.getEndIndex(); i++) {
                var span = nthSingleWordSpan(i);
                span.classList.remove("selected-highlight");
            }
        }
    }

    function unhighlightLastNWords(n) {
        if (currentHighlight.lengthInWords() < n) {
            deleteCurrentHighlight();
        }
        else {
            currentHighlight.unhighlightLastNWords(n);
        }
    }

    function highlightNextNWords(n) {
        currentHighlight.highlightNextNWords(n);
    }

    function deleteCurrentHighlight() {
        highlights = highlights.filter(function (h) {
            return h !== currentHighlight;
        });
        currentHighlight.delete();
        var newCurrentHighlight = highlights[highlights.length - 1];
        currentHighlight =  newCurrentHighlight ? newCurrentHighlight : null;
    }

    function deleteHighlights() {
        for (var i = 0; i < highlights.length; i++) {
            var highlight = highlights[i];
            highlight.delete()
        }
        highlights = [];
    }

    function indexIsInCurrentHighlight(index) {
        for (var i = 0; i < highlights.length; i++) {
            var highlight = highlights[i];
            if (highlight.getBeginningIndex() <= index && index < highlight.getEndIndex()) {
                return true;
            }
        }
        return false;
    }

    function startedHighlighting() {
        return !!currentHighlight;
    }

    function minimalRangesInAscendingOrderByStartIndex(rangesList) {
        // TODO: implement me!!!
    }

    function getRangesAsNestedList() {
        var ranges = [];
        for (var i = 0; i < highlights.length; i++) {
            var start = highlights[i].getBeginningIndex();
            var end = highlights[i].getEndIndex();
            var range = [start,  end];
            ranges.push(range);
        }
        return minimalRangesInAscendingOrderByStartIndex(ranges);
    }

    function getHighlightedTextAsString() {
        var highlightTexts = [];
        for (var i = 0; i < highlights.length; i++) {
            var start = highlights[i].getBeginningIndex();
            var end = highlights[i].getEndIndex();
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
    function leftKeyUnhighlight(event) {
        if (ec.leftKeyIsPressed() && startedHighlighting()) {
            unhighlightLastNWords(SLOWER_NUM_WORDS);
        }
    }

    function leftShiftKeyUnhighlight(event) {
        if (ec.leftKeyIsPressed() && ec.shiftKeyIsPressed() && startedHighlighting()) {
            unhighlightLastNWords(FASTER_NUM_WORDS);
        }
    }

    function rightKeyHighlight(event) {
        if (ec.rightKeyIsPressed() && startedHighlighting()) {
            highlightNextNWords(SLOWER_NUM_WORDS);
        }
    }

    function rightShiftKeyHighlight(event) {
        if (ec.rightKeyIsPressed() && ec.shiftKeyIsPressed() && startedHighlighting()) {
            highlightNextNWords(FASTER_NUM_WORDS);
        }
    }

    function escapeKeyDeleteNewHighlight(event) {
        if (ec.escapeKeyIsPressed() && ec.hKeyIsToggledOn()) {
            deleteHighlights();
        }
    }

    function enterKeySaveNewHighlight(event) {
        if (ec.enterKeyIsPressed() && ec.hKeyIsToggledOn()) {
            var ranges = getRangesAsNestedList();
            var text = getHighlightedTextAsString();
            controller.createNewAnnotationFromHighlights(ranges, text);
            highlights = [];
        }
    }
}