/**
 * Created by nerds on 6/25/2017.
 */

function encapsulateWordsIntoSpans() {
    var textNodes = getAllTextNodes();
    for (var i = 0; i < textNodes.length; i++) {
        var spans = extractSingleWordSpansFromTextNode(textNodes[i]);
        replaceTextNodeWithSingleWordSpans(textNodes[i], spans);
    }
}

function getAllTextNodes() {
    var iFrameBody = getEbookIFrameDocument().body;
    var textNodesOnlyFilter = NodeFilter.SHOW_TEXT;
    var filterOutEmptyTextNodes = function (node) {
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
        filterOutEmptyTextNodes,
        dontDiscardSubTreeIfRejected
    );
    var node;
    var textNodeArray = [];
    while(node = treeWalker.nextNode()) {
        textNodeArray.push(node);
    }
    return textNodeArray;
}

function replaceTextNodeWithSingleWordSpans(textNode, spans) {
    var parent = textNode.parentNode;
    var refNode = textNode;
    for (var i = spans.length - 1; i >= 0; i--) {
        refNode = parent.insertBefore(spans[i], refNode);
    }
    parent.removeChild(textNode);
}

function extractSingleWordSpansFromTextNode(textNode) {
    var words = textNode.textContent.split(" ");
    var singleWordSpans = [];
    for (var i = 0; i < words.length; i++) {
        var newSpan = createSingleWordSpan(words[i]);
        singleWordSpans.push(newSpan);
    }
    return singleWordSpans;
}
function createSingleWordSpan(word) {
    var span = document.createElement("span");
    span.className = "single-word";
    var newTextNode = document.createTextNode(word);
    span.appendChild(newTextNode);
    return span;
}

