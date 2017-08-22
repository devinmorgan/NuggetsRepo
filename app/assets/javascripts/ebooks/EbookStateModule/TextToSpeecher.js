/**
 * Created by nerds on 8/21/2017.
 */

function TextToSpeecher(ebookState) {
    //==================================================
    // PRIVATE VARIABLES
    //==================================================
    var CHUNK_WORD_SIZE = 50;

    var that = this;
    var es = ebookState;
    var ss = window.speechSynthesis;
    var currentUtterance = null;
    var boundaryCount = -1;

    //==================================================
    // PUBLIC FUNCTIONS
    //==================================================
    this.play = function () {
        ss.cancel();
        currentUtterance = createUtteranceForNextChunk();
        ss.speak(currentUtterance);
        ss.pause();
        ss.resume();
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
        var chunk = words.join(" ");
        return chunk;
    }

    function createUtteranceForNextChunk() {
        var textToBeSpoken = getNextChunkOfText();
        var utterance = new SpeechSynthesisUtterance(textToBeSpoken);
        utterance.lang = es.getLanguage();
        // utterance.voice = es.getVoice();
        utterance.volume = es.getVolume();
        utterance.rate = es.getReadingSpeed();
        utterance.pitch = es.getPitch();
        utterance.onboundary = readNextWord;
        utterance.on
        return utterance;
    }

    function readNextWord(event) {
        if (event.name === "sentence") {
            var isNotBeginningOfSentence = event.charIndex !== 0;
            if (isNotBeginningOfSentence) {
                readNextSentence();
            }
        }
        else if (event.name === "word") {
            es.advanceToNextWord();
        }
    }

    function readNextSentence() {
        that.play();
    }
}

