/**
 * Created by nerds on 8/28/2017.
 */

function AnnotationsTracker(eventCoordinator) {
    //==================================================
    // PRIVATE VARIABLES
    //==================================================
    var that = this;
    var ec = eventCoordinator;

    var annotations = [];
    var notesColumn = null;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.addEventHandlersToBody = function () {
        document.body.addEventListener("click", unselectAnnotationOnClickAway);
    };

    this.addEventHandlersToIFrameBody = function () {
        getEbookIFrameDocument().body.addEventListener("scroll", displayNotesForCurrentView);
        getEbookIFrameDocument().body.addEventListener("click", unselectAnnotationOnClickAway);
    };

    this.addAnnotation = function (sectionID, annotationID, rangesList, highlightedText, noteHTML) {
        var annotation = new Annotation(sectionID, annotationID, rangesList, highlightedText, noteHTML, ec, this);
        annotation.init();
        annotations.push(annotation);
        displayNotesForCurrentView();
    };

    this.createNewAnnotation = function(ebookID, sectionID, rangesList, highlightedText) {
        $.ajax({
            url: "http://127.0.0.1:3000/ajax/annotation/new_annotation",
            data: {
                'ebook_id': ebookID,
                'section_id': sectionID,
                'highlight_ranges': JSON.stringify(rangesList),
                'highlighted_text': highlightedText
            },
            success: function(newNoteString){
                var newNoteElement = createHTMLElementFromString(newNoteString);
                var annotationID = annotations.length;
                that.addAnnotation(sectionID, annotationID, rangesList, highlightedText, newNoteElement);
            }
        });
    };

    this.loadSectionAnnotationsFromDatabase = function() {
        // TODO: implement me!!!

    };

    this.unselectCurrentlySelectedAnnotation = function() {
        var selectedSpans = currentlySelectedAnnotationSpans();
        for (var i = 0; i < selectedSpans.length; i++) {
            selectedSpans[i].classList.remove(ANNOTATION_SELECTED_CLASS());
        }
    };

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
    function getNotesColumn() {
        if (!notesColumn) {
            notesColumn = document.querySelector("#notes-column");
        }
        return notesColumn;
    }

    function clearNotesColumn() {
        while (getNotesColumn().lastChild) {
            getNotesColumn().removeChild(getNotesColumn().lastChild);
        }
    }

    //==================================================
    // EVENT HANDLERS
    //==================================================
    function displayNotesForCurrentView(event) {
        clearNotesColumn();
        for (var i = 0; i < annotations.length; i++) {
            var annotation = annotations[i];
            if (annotation.isWithinView()) {
                getNotesColumn().appendChild(annotation.getHTML());
            }
        }
    }

    function unselectAnnotationOnClickAway(event) {
        // TODO: implement me!!!
        if (! event.target.classList.contains(ANNOTATION_SELECTED_CLASS())) {
            that.unselectCurrentlySelectedAnnotation();
        }
    }


}