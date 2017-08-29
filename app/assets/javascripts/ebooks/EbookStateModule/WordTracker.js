/**
 * Created by nerds on 8/21/2017.
 */

function WordTracker(ebookState) {
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
            singleWordSpan.classList.remove(CURRENT_WORD_SPAN_CLASS());
        }
    }

    function selectSingleWordSpan(singleWordSpan) {
        if (singleWordSpan) {
            singleWordSpan.classList.add(CURRENT_WORD_SPAN_CLASS());
        }
    }

    function scrollWordToTopOfIFrame(span) {
        var spanTop = span.getBoundingClientRect().top;
        var windowTop = getEbookIFrameWindow().pageYOffset;
        var oneLineBuffer = -1*span.getBoundingClientRect().height;
        var newWindowTop = windowTop + spanTop + oneLineBuffer;
        getEbookIFrameWindow().scrollTo(0, newWindowTop);
    }

    function highlightNthSingleWordSpan(index) {
        unselectSingleWordSpan(currentlySelectedWord());
        var newWord = nthSingleWordSpan(index);
        selectSingleWordSpan(newWord);
        if (! elementIsCompletelyWithinIFrame(newWord)) {
            scrollWordToTopOfIFrame(newWord);
        }
    }
}