/**
 * Created by nerds on 8/23/2017.
 */

function TextHighlighter(eventCoordinator) {
    //==================================================
    // PRIVATE VARIABLES
    //==================================================
    var H_KEY = 72;
    var ec = eventCoordinator;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.addEventHandlersToBody = function () {
        document.body.addEventListener("keydown", hKeyPressedToggleHighlightingMode);
    };

    this.addEventHandlersToIFrameBody = function () {
        getEbookIFrameDocument().body.addEventListener("keydown", hKeyPressedToggleHighlightingMode);
    };

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
    function indicateHighlightingModeState() {
        var message = ec.hKeyIsToggledOn() ? "Highlighting Mode: True" : "Highlighting Mode: False";
        var displayElement = document.getElementById("highlighting-mode");
        displayElement.innerHTML = message;
    }

    //==================================================
    // EVENT HANDLERS
    //==================================================
    function hKeyPressedToggleHighlightingMode(event) {
        if (event.keyCode === H_KEY) {
            indicateHighlightingModeState();
        }
    }
}