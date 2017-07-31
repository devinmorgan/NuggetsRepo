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

function getAllTextNodes() {
    var iFrameBody = getEbookIFrameDocument().body;
    var textNodesOnlyFilter = NodeFilter.SHOW_TEXT;
    var filterOutEmptyNodes = function (node) {
        var onlyContainsWhitespace = new RegExp("^\\s*$");
        if ( onlyContainsWhitespace.test(node.data) ) {
            return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
    };
    var dontDiscardSubTreeIfRejected = false;
    var treeWalker = document.createTreeWalker(
        iFrameBody,
        textNodesOnlyFilter,
        filterOutEmptyNodes,
        dontDiscardSubTreeIfRejected
    );

    var node;
    var array = [];

    while(node = treeWalker.nextNode()) {
        // array.push(node);
        console.log(node.textContent);
    }
    // console.log(array);
}

// function(root,whatToShow,filter,entityReferenceExpansion) {};