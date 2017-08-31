/**
 * Created by nerds on 6/25/2017.
 */

function EbookController() {
    //==================================================
    // PRIVATE FIELDS
    //==================================================
    var ec = new EventCoordinator();
    var ap = new AudioPlayer(ec);
    var at = new AnnotationsTracker(ec);
    var fsc = new FontSizeController(ec);

    var ebookID = -1;
    var sectionID = -1;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.onIFrameLoad = function () {
        ebookID = getEbookIFrame().dataset.ebookId;
        sectionID = getEbookIFrame().dataset.sectionNumber;

        ap.init();
        at.init();
        addEventHandlersToIFrameBody();
    };

    this.onBodyLoad = function () {
        addEventHandlersToBody();
    };

    this.createNewAnnotationFromHighlights = function (rangesList, highlightedText) {
        at.createNewAnnotation(ebookID, sectionID, rangesList, highlightedText);
    };

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
    function addEventHandlersToBody() {
        ec.addEventHandlersToBody();
        ap.addEventHandlersToBody();
        fsc.addEventHandlersToBody();
        at.addEventHandlersToBody();
    }

    function addEventHandlersToIFrameBody() {
        ec.addEventHandlersToIFrameBody();
        ap.addEventHandlersToIFrameBody();
        fsc.addEventHandlersToIFrameBody();
        at.addEventHandlersToIFrameBody();
    }
}
