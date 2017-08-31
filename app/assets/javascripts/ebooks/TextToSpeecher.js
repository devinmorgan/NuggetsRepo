/**
 * Created by nerds on 8/21/2017.
 */

function TextToSpeecher(ebookController) {
    //==================================================
    // PRIVATE VARIABLES
    //==================================================
    var CHUNK_WORD_SIZE = 50;

    var that = this;
    var controller = ebookController;
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
        var startIndex = controller.getCurrentWordIndex();
        var endIndex = startIndex + CHUNK_WORD_SIZE;
        for (var i = startIndex; i < endIndex; i++) {
            var singleWordSpan = nthSingleWordSpan(i);
            if (singleWordSpan) {
                words.push(singleWordSpan.innerText);
            }
            else {
                break;
            }
        }
        var chunk = words.join(" ");
        return chunk;
    }

    function createUtteranceForNextChunk() {
        var textToBeSpoken = getNextChunkOfText();
        var utterance = new SpeechSynthesisUtterance(textToBeSpoken);
        utterance.lang = controller.getLanguage();
        // utterance.voice = es.getVoice();
        utterance.volume = controller.getVolume();
        utterance.rate = controller.getReadingSpeed();
        utterance.pitch = controller.getPitch();
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
            controller.advanceToNextWord();
        }
    }

    function readNextSentence() {
        that.play();
    }
}

