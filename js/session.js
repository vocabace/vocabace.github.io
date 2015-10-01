/*
* Author: Adam Lacey / Arturas Lebedevas
* Assignment: Minor Project – VocabAce
* Student ID: Adam: D14126301 Arturas:D14126309
* Date  : 2015/01/25
* Ref:  jQuery: http://jquery.com/
*/

function Session(questions, elementId, lives, score){
  this.lives = lives || 3;
  this.totalLives = this.lives;
  this.score = score || 0;
  this.questions = questions;
  this.elementId = elementId;
}

Session.prototype.displayQuestion = function () {
  var data = this.questions;
  var question = getRandomQuestion(data);

  this._result = document.createElement('div');
  this._result.className = 'row result';

  var wordEl, audioEl, audio, audioURL;
  if (question.word.length !== 0) {
    audioURL = '/sounds/' + question.word.toLowerCase() + '.mp3';
    wordEl = document.createTextNode(question.word);

    // Check if Audio API is available
    audio = (typeof Audio !== 'undefined') ? new Audio(audioURL) : null;

    if (audio && audio.canPlayType('audio/mpeg') === 'probably') {
      audioEl = document.createElement('img');
      audioEl.src = '/image/audio.png';
      audioEl.className = 'audio-icon';
      audioEl.addEventListener('click', audio.play.bind(audio));
    }
  }

  var wordRow = createRow({
    'col-xs-12 word word-heading': [audioEl, wordEl]
  });

  // Create a titleBar using a private method
  var titleBar = _createTitleBar.call(this, question);
  var introductionEl = document.createElement('div');
  introductionEl.className = 'row introduction'
  introductionEl.innerHTML = question.introduction;

  // Create answer options
  this.answerOptions = _createOptionsDOM.call(this, question);


  var nextQuestionButton = document.createElement('button');
  nextQuestionButton.innerHTML = 'Next Question';
  nextQuestionButton.className = 'btn functionButton';
  nextQuestionButton.addEventListener("click", this.displayQuestion.bind(this));

  this.nextQuestion = createRow({
    'col-xs-12 col-md-8 col-md-offset-2': nextQuestionButton
  });
  this.nextQuestion.style.display = 'none';
  // this.nextQuestion.appendChild(nextQuestionButton);
  // nextQuestionContainer.appendChild(this.nextQuestion);

  // Create explanation element
  this.explanation = document.createElement ('div');
  this.explanation.innerHTML = question.explanation;
  this.explanation.style.display = "none";
  this.explanation.className = "row explanationCall"

  $(this.elementId).html([
    this._result,
    wordRow,
    titleBar,
    introductionEl,
    this.explanation,
    this.answerOptions,
    this.nextQuestion
  ]);
};

Session.prototype.updateScore = function (score) {
  this.score += score;
  this._scoreElement.innerHTML = this.score;
};

Session.prototype.updateLives = function (lives) {
  this.lives += lives;

  var icons = [];

  for (var i = this.lives; i > 0; i--) {
    icons.push(createLifeIcon(true));
  }

  for (var i = 0; i < (this.totalLives - this.lives); i++) {
    icons.push(createLifeIcon(false));
  }

  $(this._livesElement).html(icons);
};

Session.prototype.endGame = function () {
  var heading = document.createElement('div');
  heading.innerHTML = 'Great effort. Well Done!';
  heading.className = 'row scoreBanner';

  var scoreContainer = document.createElement('div');
  scoreContainer.className = 'row text-center';

  var scoreBox = document.createElement('div');
  scoreBox.className = 'scoreBox';
  scoreContainer.appendChild(scoreBox);

  var score = document.createElement('div');
  score.className = 'score';
  score.innerHTML = this.score;
  scoreBox.appendChild(score);

  var message = document.createElement('div');
  message.innerHTML = 'You answered ' + this.score.toString();
  message.innerHTML += ' questions correctly';
  scoreBox.appendChild(message);

  var playAgain = document.createElement('a');
  playAgain.innerHTML = 'PLAY AGAIN';
  playAgain.className = "btn btn-lg nav-link functionButton";
  playAgain.href = '/play';

  var playAgainRow = createRow({
    'col-xs-12 col-md-8 col-md-offset-2': playAgain
  });

  $(this.elementId).html([
    heading,
    scoreContainer,
    playAgainRow
  ]);
};

// Private methods
function _createTitleBar (question) {
  // Create elements to display score
  var scoreLabel = document.createElement('span');
  scoreLabel.className = 'scoreLabel'
  scoreLabel.innerHTML = 'Your score';

  this._scoreElement = document.createElement('span');
  this._scoreElement.className = "score score-small";
  this.updateScore(0);

  // Create elements to display lives
  var livesLabel = document.createElement('span');
  livesLabel.className = 'livesLabel';
  livesLabel.innerHTML = 'Lifelines';

  this._livesElement = document.createElement('span');
  this._livesElement.className = 'lives';
  this.updateLives(0);

  var titleBar = createRow({
    'col-xs-6 text-center scores': [scoreLabel, this._scoreElement],
    'col-xs-6 text-center lifes': [livesLabel, this._livesElement]
  });

  return titleBar;
}

function _createOptionsDOM (question) {
  var list = document.createElement('ul');
  list.className = 'answers';

  var listContainer = createRow({
    'col-xs-12 col-md-8 col-sm-8 col-sm-offset-2 col-md-offset-2': list
  });

  var buttons = question.options.forEach(function (option, idx) {
    var listItem = document.createElement('li');

    var button = document.createElement('button');
    button.className = 'btn btn-default answer';
    button.innerHTML = option;
    button.addEventListener('click', _checkAnswer.bind(this, question, idx));

    listItem.appendChild(button);
    list.appendChild(listItem);
  }.bind(this));

  return listContainer;
}

function _checkAnswer (question, answerId) {
  var isCorrect = (question.correctAnswerId === answerId);

  this.answerOptions.style.display = "none";
  this.nextQuestion.style.display = "block";
  this.explanation.style.display = "block";

  if (isCorrect) {
    this.updateScore(1)
    var correctAnswerIcon = document.createElement('img');
    correctAnswerIcon.src = '/image/correct_answer.png';

    $(this._result).html([
      correctAnswerIcon,
      'Correct'
    ]);
  } else {
    this.updateLives(-1);
    var incorrectAnswerIcon = document.createElement('span');
    incorrectAnswerIcon.className = 'incorrect-icon';
    incorrectAnswerIcon.innerHTML = 'X';

    $(this._result).html([
      incorrectAnswerIcon,
      'Incorrect'
    ]);
  }

  var questionIdx = this.questions.indexOf(question);
  this.questions.splice(questionIdx, 1);

  var isGameOver = (this.questions.length <= 0 || this.lives <= 0);
  if (isGameOver) {
    return this.endGame();
  }
}

// Utility functions
function createRow (config) {
  var keys = Object.keys(config);

  var row = document.createElement('div');
  row.className = 'row';

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (config.hasOwnProperty(key)) {
      var column = document.createElement('div');
      var value = config[key];

      column.className = key;
      if (value instanceof Array) {
        for (var x = 0; x < value.length; x++) {
          if (value[x]) {
            column.appendChild(value[x]);
          }
        }
      } else {
        column.appendChild(value);
      }
      row.appendChild(column);
    }
  }

  return row;
}

function createLifeIcon (isFull) {
  var icon = document.createElement('img');
  icon.src = '/image/' + (isFull ? 'life_full.png' : 'life_hollow.png');
  icon.className = 'life';
  return icon;
}

function getRandomQuestion (questions) {
  var randomNo = Math.floor(Math.random()*questions.length);
  return questions[randomNo];
}
