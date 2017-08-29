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

function TEMPORARILY_HIGHLIGHTED_CLASS() {
    return "temporarily-highlighted";
}

function ANNOTATION_SELECTED_CLASS() {
    return "annotation-selected";
}

function currentlySelectedAnnotationSpans() {
    var selectedAnnotationSelector = "." + ANNOTATION_SELECTED_CLASS();
    return getEbookIFrameDocument().body.querySelectorAll(selectedAnnotationSelector);
}

function currentlySelectedWord() {
    var currentlySelectedWordSelector = "." + CURRENT_WORD_SPAN_CLASS();
    return getEbookIFrameDocument().querySelector(currentlySelectedWordSelector);
}

function nthSingleWordSpanSelector(n) {
    return "span" + SINGLE_WORD_SPAN_SELECTOR() + "[data-word-index='" + n + "']";
}

function nthSingleWordSpan(n) {
    return getEbookIFrameDocument().querySelector(nthSingleWordSpanSelector(n));
}

function createHTMLElementFromString(string) {
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML = string;
    return htmlObject.firstChild;
}

function elementIsCompletelyWithinIFrame(element) {
    var elemTop = element.getBoundingClientRect().top;
    var elemBottom = element.getBoundingClientRect().bottom;
    return (elemTop >= 0) && (elemBottom <= getEbookIFrameWindow().innerHeight);
}

function bodyInit() {
    var es = new EbookState();
    es.onBodyLoad();

    return function() {
        es.onIFrameLoad();
    };
}
