/**
 * Created by nerds on 8/15/2017.
 */

function loadSection(direction) {
    var bookID = document.getElementById("ebook-console").dataset.bookId;
    $.ajax({
        url: "http://127.0.0.1:3000/ajax/ebook/" + bookID + "/new_section/" + direction,
        success: function(result){
            getEbookIFrame().src = result["new_url"];
        }
    });
}