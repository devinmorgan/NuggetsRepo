/**
 * Created by nerds on 8/24/2017.
 */

function Annotation(sectionID, annotationID, rangesList, highlightedText, noteHTML, eventCoordinator, annotationTracker) {
    //==================================================
    // PRIVATE VARIABLES
    //==================================================
    var ec = eventCoordinator;
    var at = annotationTracker;

    var section = sectionID;
    var annotation = annotationID;
    var categories = noteHTML.dataset.categories.split(",");
    var remark = noteHTML.dataset.remark;
    var ranges = rangesList;
    var text = highlightedText;
    var element = noteHTML;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.init = function () {
        for (var i = 0; i < ranges.length; i++) {
            var start = ranges[i][0];
            var end = ranges[i][1];
            for (var j = start; j < end; j++) {
                var span = nthSingleWordSpan(j);
                makeHighlightPersistentOnSpan(span);
                onClickSelectEntireHighlight(span);
            }
        }
    };

    this.isWithinView = function () {
        console.log("ranges", ranges);
        var startingIndex = ranges[0][0];
        var startingSpan = nthSingleWordSpan(startingIndex);
        return elementIsCompletelyWithinIFrame(startingSpan);
    };

    this.getHTML = function () {
        return element;
    };

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
    function uniqueHighlightClass() {
        return "section-" + section + "-annotation-index-" + annotation + "-unique-highlight";
    }

    function makeHighlightPersistentOnSpan(span) {
        span.classList.remove(TEMPORARILY_HIGHLIGHTED_CLASS());
        span.classList.add(uniqueHighlightClass());
    }

    function onClickSelectEntireHighlight(span) {
        span.addEventListener("click", function (event) {
            if (! ec.hKeyIsToggledOn()) {
                at.unselectCurrentlySelectedAnnotation();
                var highlightClassSelector = "." + uniqueHighlightClass();
                var spansInSameHighlight = getEbookIFrameDocument().querySelectorAll(highlightClassSelector);
                for (var i = 0; i < spansInSameHighlight.length; i++) {
                    spansInSameHighlight[i].classList.add(ANNOTATION_SELECTED_CLASS());
                }
            }
        });
    }

    function updateAnnotationInDatabase() {
        // TODO: implement me!!!
    }
}