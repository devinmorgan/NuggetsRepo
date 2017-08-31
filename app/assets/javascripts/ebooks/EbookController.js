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

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.onIFrameLoad = function () {
        ap.init();
        at.init();
        addEventHandlersToIFrameBody();
    };

    this.onBodyLoad = function () {
        addEventHandlersToBody();
    };

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
    function addEventHandlersToBody() {
        ec.addEventHandlersToBody();
        ap.addEventHandlersToBody();
        at.addEventHandlersToBody();
        fsc.addEventHandlersToBody();
    }

    function addEventHandlersToIFrameBody() {
        ec.addEventHandlersToIFrameBody();
        ap.addEventHandlersToIFrameBody();
        at.addEventHandlersToIFrameBody();
        fsc.addEventHandlersToIFrameBody();
    }
}
