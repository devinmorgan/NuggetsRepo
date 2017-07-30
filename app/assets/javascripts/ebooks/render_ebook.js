/**
 * Created by nerds on 6/25/2017.
 */
var iframe = null;
var iframeDocument = null;
function onloadHandler() {
    iframe = document.querySelector('#ebook-section');
    iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
}

function loadPreviousSection() {
    // 1) get the current section number from #ebook-console
    var current_section_number = document.getElementById("ebook-console").dataset.currentSection;
    console.log("Current Section Number: " + current_section_number);
}