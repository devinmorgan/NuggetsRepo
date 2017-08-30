/**
 * Created by nerds on 8/24/2017.
 */

function Annotation(sectionID, annotationID, rangesList, highlightedText, noteHTML, eventCoordinator, annotationTracker) {
    //==================================================
    // PRIVATE VARIABLES
    //==================================================
    var ec = eventCoordinator;
    var at = annotationTracker;
    var hu = new HighlightUpdater();

    var section = sectionID;
    var annotation = annotationID;
    var categories = noteHTML.dataset.categories.split(",");
    var remark = noteHTML.dataset.remark;
    var ranges = rangesList;
    var text = highlightedText;

    var isEditing = false;
    var isSelected = false;

    var element = noteHTML;
    var categoriesP = element.querySelector("p.notes-categories");
    var categoriesTA = element.querySelector("textarea.notes-categories");
    var remarkP = element.querySelector("p.notes-remark");
    var remarkTA = element.querySelector("textarea.notes-remark");
    var editButton = element.querySelector("span.edit-option");
    var saveButton = element.querySelector("span.save-option");
    var deleteButton = element.querySelector("span.delete-option");

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
                span.addEventListener("click", clickedHighlight);
            }
        }
        element.addEventListener("click", clickedNote);
        saveButton.addEventListener("click", updateAndSaveAnnotation);
        editButton.addEventListener("click", enableAnnotationEditMode);
        deleteButton.addEventListener("click", deleteAnnotation);
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

    function updateCategoriesAndRemark(categories, remark) {
        // TODO: implement me!!!
        // perform an AJAX call and update this annotation in the database
    }

    function selectAnnotation() {
        var highlightClassSelector = "." + uniqueHighlightClass();
        var spansInSameHighlight = getEbookIFrameDocument().querySelectorAll(highlightClassSelector);
        for (var i = 0; i < spansInSameHighlight.length; i++) {
            spansInSameHighlight[i].classList.add(ANNOTATION_SELECTED_CLASS());
        }
        element.classList.add(ANNOTATION_SELECTED_CLASS());
    }

    //==================================================
    // EVENT HANDLERS
    //==================================================
    function clickedNote(event) {
        if (! ec.hKeyIsToggledOn()) {
            at.unselectCurrentlySelectedAnnotation();
            selectAnnotation();
        }
    }

    function clickedHighlight(event) {
        if (! ec.hKeyIsToggledOn()) {
            if (isEditing) {
                deselectOtherHighlights();
                selectThisHighlightForUpdating(event);
            }
            else {
                at.unselectCurrentlySelectedAnnotation();
                selectAnnotation();
            }
        }
    }

    function updateAndSaveAnnotation(event) {
        var newCategories = categoriesTA.value;
        categoriesP.innerHTML = newCategories;
        var newRemark = remarkTA.value;
        remarkP.innerHTML = newRemark;
        updateCategoriesAndRemark(newCategories, newRemark);
    }

    function enableAnnotationEditMode(event) {
        // TODO: implement me!!!
        // 1) hide the edit button
        // 2) show the save button
        // 3) hide the categories and remark p-tags
        // 4) show the categories and remark textareas
    }

    function deleteAnnotation(event) {
        // TODO: implement me!!!
        // 1) unhighlight all the single-word spans for this annotation
        // 2) delete the note from the note column
        // 3) remove this annotation from the annotations list in the AnnotationTracker
        // 4) perform an AJAX call and delete this annotation from the database
    }
}