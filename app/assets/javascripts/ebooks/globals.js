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

function addKeyDownHandlerToBody(handler) {
    document.body.addEventListener("keydown", handler);
}

function addKeyDownHandlerToIFrameBody(handler) {
    getEbookIFrameDocument().body.addEventListener("keydown", handler);
}