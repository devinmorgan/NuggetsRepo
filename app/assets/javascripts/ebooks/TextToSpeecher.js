/**
 * Created by nerds on 8/21/2017.
 */

function TextToSpeecher(ebookState) {
    //==================================================
    // PRIVATE VARIABLES
    //==================================================
    var CHUNK_WORD_SIZE = 100;

    var that = this;
    var es = ebookState;
    var ss = window.speechSynthesis;
    var currentUtterance = null;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.play = function () {
        currentUtterance = createUtteranceForNextChunk();
        ss.speak(currentUtterance);
    };

    this.pause = function () {
        ss.cancel();
        currentUtterance = null;
    };

    //==================================================
    // PRIVATE FUNCTIONS
    //==================================================
    function getNextChunkOfText() {
        var words = [];
        var startIndex = es.getCurrentWordIndex();
        var endIndex = startIndex + CHUNK_WORD_SIZE;
        for (var i = startIndex; i < endIndex; i++) {
            var singleWordSpan = nthSingleWordSpan(i);
            words.push(singleWordSpan.innerText);
        }
        return words.join(" ");
    }

    function createUtteranceForNextChunk() {
        var textToBeSpoken = getNextChunkOfText();
        var utterance = new SpeechSynthesisUtterance(textToBeSpoken);
        utterance.voice = es.getVoice();
        utterance.volume = es.getVolume();
        utterance.rate = es.getReadingSpeed();
        utterance.pitch = es.getPitch();
        utterance.onboundary = readAWord();
        utterance.onend = readNextChunk();
        utterance.onpause = that.pause();
        return utterance;
    }
    
    function readAWord() {
        es.advanceToNextWord();
    }

    function readNextChunk() {
        that.play();
    }
}