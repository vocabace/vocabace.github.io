/*
* Author: Adam Lacey / Arturas Lebedevas
* Assignment: Minor Project – VocabAce
* Student ID: Adam: D14126301 Arturas:D14126309
* Date  : 2015/01/25
* Ref:  jQuery: http://jquery.com/
        jQuery.Ajax: http://api.jquery.com/jquery.ajax/
*/


document.addEventListener('DOMContentLoaded', initialise);

function initialise () {

  // Code reuse
  // Ref: http://api.jquery.com/jquery.ajax/

  $.ajax({
    dataType: 'json',
    url: '/questions.json'
  }).done(startGame);
}

function startGame (data) {
  var gameSession = new Session(data, '#game');
  gameSession.displayQuestion();
  $.ajax({
    dataType: 'json',
    url: '/questions.json'
  }).done(startGame);
}

function startGame (data) {
  var gameSession = new Session(data, '#game');
  gameSession.displayQuestion();
};
