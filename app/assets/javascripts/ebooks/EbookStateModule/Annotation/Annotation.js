/**
 * Created by nerds on 8/24/2017.
 */

function Annotation(sectionNumber, annotationIndex, rangesAsString, highlightedText, categoriesAsString, textRemark, eventCoordinator) {
    //==================================================
    // PRIVATE VARIABLES
    //==================================================
    var ec = eventCoordinator;

    var section = sectionNumber;
    var annotation = annotationIndex;
    var categories = categoriesAsString.split(",");
    var ranges = rangesAsString.split(",");
    var text = highlightedText;
    var remark = textRemark;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.init = function () {
        for (var i = 0; i < ranges.length; i++) {
            var start = ranges[i].split("-")[0];
            var end = ranges[i].split("-")[1];
            for (var j = start; j < end; j++) {
                var span = nthSingleWordSpan(j);
                makeHighlightPersistentOnSpan(span);
                onClickSelectEntireHighlight(span);
            }
        }
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

    function saveUpdatedAnnotationToDatabase() {
        console.log("Implement saveUpdatedAnnotationToDatabase");
        // TODO: implement me!!!
    }
}