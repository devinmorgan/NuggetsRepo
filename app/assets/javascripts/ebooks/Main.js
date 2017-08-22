/**
 * Created by nerds on 8/15/2017.
 */

function getEbookIFrame() {
    return document.querySelector("#ebook-section");
}

function getEbookIFrameDocument() {
    var iframe = getEbookIFrame();
    return iframe.contentDocument || iframe.contentWindow.document;
}

function getEbookIFrameWindow() {
    return getEbookIFrame().contentWindow || getEbookIFrame();
}

function SINGLE_WORD_SPAN_CLASS() {
    return "single-word";
}
function SINGLE_WORD_SPAN_SELECTOR() {
    return "." + SINGLE_WORD_SPAN_CLASS();
}

function CURRENT_WORD_SPAN_CLASS() {
    return "current-word";
}

function nthSingleWordSpanSelector(n) {
    return "span" + SINGLE_WORD_SPAN_SELECTOR() + "[data-word-index='" + n + "']";
}

function nthSingleWordSpan(n) {
    return getEbookIFrameDocument().querySelector(nthSingleWordSpanSelector(n));
}

function bodyInit() {
    var eC = new EventCoordinator();
    eC.addEventHandlersToBody();
    var eS = new EbookState(eC);
    eS.addEventHandlersToBody();
    var fSC = new FontSizeController(eC);
    fSC.addEventHandlersToBody();
    var rSC = new ReadingSpeedController(eC);
    rSC.addEventHandlersToBody();
    var eW = new EncapsulateWords(eS);
    return function() {
        eW.encapsulateWordsIntoSpans();
        eC.addEventHandlersToIFrameBody();
        eS.resetWordIndex();
        eS.addEventHandlersToIFrameBody();
        fSC.addEventHandlersToBody();
        rSC.addEventHandlersToIFrameBody();
    };
}
