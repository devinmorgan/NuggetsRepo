/**
 * Created by nerds on 6/25/2017.
 */
function getEbookIFrame() {
    return document.querySelector("#ebook-section");
}

function getEbookIFrameDocument() {
    var iframe = getEbookIFrame();
    return iframe.contentDocument || iframe.contentWindow.document;
}

function loadSection(direction) {
    var bookID = document.getElementById("ebook-console").dataset.bookId;
    $.ajax({
        url: "http://127.0.0.1:3000/ajax/ebook/" + bookID + "/new_section/" + direction,
        success: function(result){
            getEbookIFrame().src = result["new_url"];
        }
    });
}