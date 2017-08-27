/**
 * Created by nerds on 8/24/2017.
 */

function Annotation(sectionNumber, annotationIndex, highlightsList, eventCoordinator) {
    //==================================================
    // PRIVATE VARIABLES
    //==================================================
    var ec = eventCoordinator;

    var section = sectionNumber;
    var annotation = annotationIndex;
    var categories = [];
    var highlights = highlightsList;
    var remark = "";

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.save = function () {
        for (var i = 0; i < highlights.length; i++) {
            var start = highlights[i].getBeginningIndex();
            var end = highlights[i].getEndIndex();
            for (var j = start; j < end; j++) {
                var span = nthSingleWordSpan(j);
                makeHighlightPersistentOnSpan(span);
                onClickSelectEntireHighlight(span);
            }
        }
        saveAnnotationToDatabase();
    };

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
    function uniqueHighlightClass() {
        return "section-" + section + "-annotation-index-" + annotation + "-highlight";
    }

    function makeHighlightPersistentOnSpan(span) {
        span.classList.remove(TEMPORARILY_HIGHLIGHTED_CLASS());
        span.classList.add(uniqueHighlightClass());
    }

    function onClickSelectEntireHighlight(span) {
        span.addEventListener("click", function (event) {
            if (! ec.hKeyIsToggledOn()) {
                var highlightClassSelector = "." + uniqueHighlightClass();
                var spansInSameHighlight = getEbookIFrameDocument().querySelector(highlightClassSelector);
                for (var i = 0; i < spansInSameHighlight.length; i++) {
                    spansInSameHighlight[i].classList.add(ANNOTATION_SELECTED_CLASS());
                }
            }
        });
    }

    function saveAnnotationToDatabase() {
        console.log("Implement saveAnnotationToDatabase");
        // TODO: implement me!!!
    }
}