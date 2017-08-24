/**
 * Created by nerds on 8/23/2017.
 */

function Highlight(startIndex) {
    var beginning = startIndex;
    var end = startIndex;

    var that = this;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.highlightNextNWords = function (n) {
        var start = end;
        end += n;
        for (var i = start; i < end; i++) {
            highlightWordAtIndex(i);
        }
    };

    this.unhighlightLastNWords = function (n) {
        var start = end;
        end = start - n;
        for (var i = start; i >= end; i--) {
            unhighlightWordAtIndex(i);
        }
    };

    this.delete = function () {
        var start = end - 1;
        end = beginning;
        for (var i = start; i >= end; i--) {
            unhighlightWordAtIndex(i);
        }
    };

    this.getBeginningIndex = function () {
        return beginning;
    };

    this.getEndIndex = function () {
        return end;
    };

    this.highlightFirstWord = function () {
        that.highlightNextNWords(1);
    };

    this.lengthInWords = function () {
        return end - beginning;
    };

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
    function highlightWordAtIndex(index) {
        var singleWordSpan = nthSingleWordSpan(index);
        singleWordSpan.classList.add("highlighted");
    }

    function unhighlightWordAtIndex(index) {
        var singleWordSpan = nthSingleWordSpan(index);
        singleWordSpan.classList.remove("highlighted");
    }
}