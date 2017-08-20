/**
 * Created by nerds on 8/18/2017.
 */

// var utterance = new SpeechSynthesisUtterance();
// var wordIndex = 0;
// var global_words = [];
// utterance.lang = 'en-US';
// utterance.rate = 10;
// var message = tts.getNextMessage("Guess who’s coming to dinner,”" +
//         " Woodell said. He wheeled into my office and handed me the " +
//         "telex. Ki-tami had accepted my invitation. He was coming to" +
//         " Portland to spend a few days.");
//
// function play(){
//     var text    = document.getElementById('textarea').value;
//     var words   = text.split(" ");
//     global_words = words;
//     // Draw the text in a div
//     drawTextInPanel(words);
//     spokenTextArray = words;
//     utterance.text = text;
//     speechSynthesis.speak(utterance);
// };
//
// utterance.onboundary = function(event){
//     var e = document.getElementById('textarea');
//     var word = getWordAt(e.value,event.charIndex);
//     // Show Speaking word : x
//     document.getElementById("word").innerHTML = word;
//     //Increase index of span to highlight
//     console.info(global_words[wordIndex]);
//
//     try{
//         document.getElementById("word_span_"+wordIndex).style.color = "blue";
//     }catch(e){}
//
//     wordIndex++;
// };
//
// utterance.onend = function(){
//     document.getElementById("word").innerHTML = "";
//     wordIndex = 0;
//     document.getElementById("panel").innerHTML = "";
// };
//
// // Get the word of a string given the string and the index
// function getWordAt(str, pos) {
//     // Perform type conversions.
//     str = String(str);
//     pos = Number(pos) >>> 0;
//
//     // Search for the word's beginning and end.
//     var left = str.slice(0, pos + 1).search(/\S+$/),
//         right = str.slice(pos).search(/\s/);
//
//     // The last word in the string is a special case.
//     if (right < 0) {
//         return str.slice(left);
//     }
//     // Return the word, using the located bounds to extract it from the string.
//     return str.slice(left, right + pos);
// }
//
// function drawTextInPanel(words_array){
//     console.log("Dibujado");
//     var panel = document.getElementById("panel");
//     for(var i = 0;i < words_array.length;i++){
//         var html = '<span id="word_span_'+i+'">'+words_array[i]+'</span>&nbsp;';
//         panel.innerHTML += html;
//     }
// }
//
// // function TextToSpeech() {
// //     var that = this;
// //     // Fetch the available voices.
// //     this.volume = 1; // [0 - 1]
// //     this.rate = 1; // [0.1 - 10]
// //     this.pitch = 1; // [1 - 2]
// //     var voice = speechSynthesis.getVoices().filter(
// //         function(voice) {
// //             return voice.name === "Google US English";
// //         })[0];
// //
// //     this.getNextMessage = function(text) {
// //         var msg = new SpeechSynthesisUtterance();
// //         msg.text = text;
// //         msg.volume = that.volume;
// //         msg.rate = that.rate;
// //         msg.pitch = that.pitch;
// //         msg.voice = voice;
// //         return msg;
// //     };
// // }
// //
// // function wholeSentence() {
// //     var tts = new TextToSpeech();
// //     var message = tts.getNextMessage("Guess who’s coming to dinner,”" +
// //         " Woodell said. He wheeled into my office and handed me the " +
// //         "telex. Ki-tami had accepted my invitation. He was coming to" +
// //         " Portland to spend a few days.");
// //     window.speechSynthesis.speak(message);
// // }
// //
// // function synthesizedSentence() {
// //     var tts = new TextToSpeech();
// //     var messages = [
// //         tts.getNextMessage("Geuss"),
// //         tts.getNextMessage("who's"),
// //         tts.getNextMessage("coming"),
// //         tts.getNextMessage("to"),
// //         tts.getNextMessage("dinner,"),
// //         tts.getNextMessage("Woodell"),
// //         tts.getNextMessage("said."),
// //         tts.getNextMessage("He"),
// //         tts.getNextMessage("wheeled"),
// //         tts.getNextMessage("into"),
// //         tts.getNextMessage("my"),
// //         tts.getNextMessage("office"),
// //         tts.getNextMessage("and"),
// //         tts.getNextMessage("handed"),
// //         tts.getNextMessage("me"),
// //         tts.getNextMessage("the"),
// //         tts.getNextMessage("telex."),
// //         tts.getNextMessage("Ki-tami"),
// //         tts.getNextMessage("had"),
// //         tts.getNextMessage("accepted"),
// //         tts.getNextMessage("my"),
// //         tts.getNextMessage("invitation."),
// //         tts.getNextMessage("He"),
// //         tts.getNextMessage("was"),
// //         tts.getNextMessage("coming"),
// //         tts.getNextMessage("to"),
// //         tts.getNextMessage("Portland"),
// //         tts.getNextMessage("to"),
// //         tts.getNextMessage("spend"),
// //         tts.getNextMessage("a"),
// //         tts.getNextMessage("few"),
// //         tts.getNextMessage("days.")
// //     ];
// //     for (var i = 0; i < messages.length; i++) {
// //         window.speechSynthesis.speak(messages[i]);
// //     }
// // }
