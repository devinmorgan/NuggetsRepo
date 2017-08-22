/**
 * Created by nerds on 8/21/2017.
 */

function WordHighlighter(ebookState) {
    //==================================================
    // PRIVATE VARIABLES
    //==================================================
    var es = ebookState;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.highlightCurrentWordSpan = function() {
        highlightNthSingleWordSpan(es.getCurrentWordIndex());
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

    function highlightNthSingleWordSpan(index) {
        var currentWord = nthSingleWordSpan(es.getCurrentWordIndex());
        unselectSingleWordSpan(currentWord);
        var newWord = nthSingleWordSpan(index);
        selectSingleWordSpan(newWord);
        if (! elementIsCompletelyWithinIFrame(newWord)) {
            scrollWordToTopOfIFrame(newWord);
        }
    }
}