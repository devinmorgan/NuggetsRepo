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

function addKeyDownHandler(bodyHandle, iframeBodyHandle) {
    document.body.addEventListener("keydown", bodyHandle);
    getEbookIFrameDocument().body.addEventListener("keydown", iframeBodyHandle);
}