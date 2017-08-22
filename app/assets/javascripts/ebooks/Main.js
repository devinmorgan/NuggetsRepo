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

function getWordFromTextAtCharIndex(index, text) {
    var words = text.split(" ");
    var charCount = 0;
    for (var i = 0; i < words.length; i++) {
        if (charCount === index) {
            return words[i];
        }
        charCount += words[i].length + 1;
    }
    return null;
}

function getDebugInfoForTextAndIndex(index, text) {
    var sentencePos = "sentence[" + event.charIndex + "]\t\t\t";
    var currentWord = "reading: " + getWordFromTextAtCharIndex(event.charIndex, event.utterance.text) + "\t\t\t";
    labeledText = "text: " + text;
    console.log(sentencePos, currentWord, labeledText);
}

function bodyInit() {
    var es = new EbookState();
    es.onBodyLoad();

    return function() {
        es.onIFrameLoad();
    };
}
