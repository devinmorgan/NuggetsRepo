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

function CURRENT_WORD_SPAN_SELECTOR() {
    return "." + CURRENT_WORD_SPAN_CLASS();
}

function bodyInit() {
    var ebookState = new EbookState();
    (new EventCoordinator(ebookState)).addAllEventHandlersToBody();

    return function() {
        (new EncapsulateWords(ebookState)).encapsulateWordsIntoSpans();
        ebookState.resetWordIndex();
        ebookState.decreaseFontSize();
        (new EventCoordinator(ebookState)).addAllEventHandlersToIFrameBody();
    };
}
