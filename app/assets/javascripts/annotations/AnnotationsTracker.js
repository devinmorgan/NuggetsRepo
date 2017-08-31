/**
 * Created by nerds on 8/28/2017.
 */

function AnnotationsTracker(eventCoordinator) {
    //==================================================
    // PRIVATE VARIABLES
    //==================================================
    var that = this;
    var ec = eventCoordinator;
    var ht = new HighlightsTracker(ec);

    var annotations = [];
    var notesColumn = null;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.init = function () {
        ht.init()
        loadSectionAnnotationsFromDatabase();
    };

    this.addEventHandlersToBody = function () {
        ht.addEventHandlersToBody();
        document.body.addEventListener("click", unselectAnnotationOnClickAway);
    };

    this.addEventHandlersToIFrameBody = function () {
        ht.addEventHandlersToIFrameBody();
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

    this.unselectCurrentlySelectedAnnotation = function() {
        var elements = currentlySelectedAnnotationElements();
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove(ANNOTATION_SELECTED_CLASS());
        }
    };

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
    function loadSectionAnnotationsFromDatabase() {
        // TODO: implement me!!!
    }

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
        var node = event.target;
        var clickedAway = true;
        while (node) {
            if (node.classList.contains(ANNOTATION_SELECTED_CLASS())) {
                clickedAway = false;
            }
            node = node.parentElement;
        }
        if (clickedAway) {
            that.unselectCurrentlySelectedAnnotation();
        }
    }


}