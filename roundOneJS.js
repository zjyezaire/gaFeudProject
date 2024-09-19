const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".close-button");
const modalDisplay = document.querySelector("#modalMessage");

const modalX = document.querySelector("#xModal");
const closeBtnX = document.querySelector(".close-buttonX");
const modalDisplayX = document.querySelector("#modalX");
let numberOfXs = "";
 

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

closeBtnX.addEventListener("click", () => {
  modalX.style.display = "none";
});

const app = {
  version: 1,
  currentQ: 0,
  totalRounds: 3, 
  currentRound: 0, 
  jsonFile: "gameQuestions.json",
  soundEffect: new Audio("ffDingSound.mp3"), 
  closeSound: new Audio("ffBuzzerSound.mp3"), 
  board: $(
    "<div class='gameBoard'>" +
      "<!--- Scores --->" +
      "<div class='score' id='boardScore'>0</div>" +
      "<div class='score' id='team1'>0</div>" +
      "<div class='score' id='team2'>0</div>" +
      "<!--- Question --->" +
      "<div class='questionHolder'>" +
      "<span class='question'></span>" +
      "</div>" +
      "<!--- Answers --->" +
      "<div class='colHolder'>" +
      "<div class='col1'></div>" +
      "<div class='col2'></div>" +
      "</div>" +
      "<!--- Buttons --->" +
      "<div class='btnHolder'>" +
      "<div id='awardTeam1' data-team='1' class='button'>Award Team 1</div>" +
      "<div id='newQuestion' class='button'>New Question</div>" +
      "<div id='awardTeam2' data-team='2' class='button'>Award Team 2</div>" +
      "<button class='xButton'>X</button>" + // Add the X button here
      "</div>" +
      "</div>"
  ),

  // Utility functions
  shuffle: function (array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  },

  jsonLoaded: function (data) {
    console.clear();
    app.allData = data;
    app.questions = Object.keys(data);
    app.shuffle(app.questions);
    app.makeQuestion(app.currentQ);
    $("body").append(app.board);
    console.log(app);
  },

  // Action functions
  makeQuestion: function (qNum) {
    const qText = app.questions[qNum];
    const qAnswr = app.allData[qText];

    let qNumAnswr = qAnswr.length;
    qNumAnswr = qNumAnswr < 8 ? 8 : qNumAnswr;
    qNumAnswr = qNumAnswr % 2 !== 0 ? qNumAnswr + 1 : qNumAnswr;

    const boardScore = app.board.find("#boardScore");
    const question = app.board.find(".question");
    const col1 = app.board.find(".col1");
    const col2 = app.board.find(".col2");

    boardScore.html(0);
    question.html(qText.replace(/&x22;/gi, '"'));
    col1.empty();
    col2.empty();

    for (let i = 0; i < qNumAnswr; i++) {
      let aLI;
      if (qAnswr[i]) {
        aLI = $(
          "<div class='cardHolder'>" +
            "<div class='card'>" +
            "<div class='front'>" +
            "<span class='DBG'>" +
            (i + 1) +
            "</span>" +
            "</div>" +
            "<div class='back DBG'>" +
            "<span>" +
            qAnswr[i][0] +
            "</span>" +
            "<b class='LBG'>" +
            qAnswr[i][1] +
            "</b>" +
            "</div>" +
            "</div>" +
            "</div>"
        );
      } else {
        aLI = $("<div class='cardHolder empty'><div></div></div>");
      }
      const parentDiv = i < qNumAnswr / 2 ? col1 : col2;
      $(aLI).appendTo(parentDiv);
    }

    const cardHolders = app.board.find(".cardHolder");
    const cards = app.board.find(".card");
    const backs = app.board.find(".back");
    const cardSides = app.board.find(".card>div");

    TweenLite.set(cardHolders, { perspective: 800 });
    TweenLite.set(cards, { transformStyle: "preserve-3d" });
    TweenLite.set(backs, { rotationX: 180 });
    TweenLite.set(cardSides, { backfaceVisibility: "hidden" });

    cards.data("flipped", false);

    function showCard() {
      const card = $(".card", this);
      let flipped = $(card).data("flipped");
      const cardRotate = flipped ? 0 : -180;

      // Play the sound effect when the card is clicked
      app.soundEffect.play();

      TweenLite.to(card, 1, { rotationX: cardRotate, ease: Back.easeOut });
      flipped = !flipped;
      $(card).data("flipped", flipped);
      app.getBoardScore();
    }
    cardHolders.on("click", showCard);
  },

  getBoardScore: function () {
    const cards = app.board.find(".card");
    const boardScore = app.board.find("#boardScore");
    const currentScore = { var: boardScore.html() };
    let score = 0;

    function tallyScore() {
      if ($(this).data("flipped")) {
        const value = $(this).find("b").html();
        score += parseInt(value);
      }
    }

    $.each(cards, tallyScore);

    TweenMax.to(currentScore, 1, {
      var: score,
      onUpdate: function () {
        boardScore.html(Math.round(currentScore.var));
      },
      ease: Power3.easeOut,
    });
  },

  awardPoints: function () {
    const num = $(this).attr("data-team");
    const boardScore = app.board.find("#boardScore");
    const currentScore = { var: parseInt(boardScore.html()) };
    const team = app.board.find("#team" + num);
    const teamScore = { var: parseInt(team.html()) };
    const teamScoreUpdated = teamScore.var + currentScore.var;

    TweenMax.to(teamScore, 1, {
      var: teamScoreUpdated,
      onUpdate: function () {
        team.html(Math.round(teamScore.var));
      },
      ease: Power3.easeOut,
    });

    TweenMax.to(currentScore, 1, {
      var: 0,
      onUpdate: function () {
        boardScore.html(Math.round(currentScore.var));
      },
      ease: Power3.easeOut,
    });
  },

  checkWinner: function () {
    if (app.currentRound >= app.totalRounds) {
      const team1Score = parseInt(app.board.find("#team1").html());
      const team2Score = parseInt(app.board.find("#team2").html());

      if (team1Score > team2Score) {
        modalDisplay.innerText = "Team 1 wins with " + team1Score + " points!";
        modal.style.display = "block";
      } else if (team2Score > team1Score) {
        modalDisplay.innerText = "Team 2 wins with " + team2Score + " points!";
        modal.style.display = "block";
      } else {
        modalDisplay.innerText =
          "It's a tie! Both teams have " + team1Score + " points!";
        modal.style.display = "block";
      }

      app.board
        .find("#newQuestion, #awardTeam1, #awardTeam2, .xButton")
        .off("click");
    }
  },

  changeQuestion: function () {
    app.currentQ++;
    app.currentRound++;

    if (app.currentRound <= app.totalRounds) {
      app.makeQuestion(app.currentQ);
    }

    app.checkWinner();
  },

  init: function () {
    $.getJSON(app.jsonFile, app.jsonLoaded);
    app.board.find("#newQuestion").on("click", app.changeQuestion);
    app.board.find("#awardTeam1").on("click", app.awardPoints);
    app.board.find("#awardTeam2").on("click", app.awardPoints);
    app.board.find(".xButton").on("click", function () {
      numberOfXs += "X";

      app.closeSound.play()

      if (numberOfXs.length >= 3) {
        modalDisplayX.innerText = "Your turn is over!! " + numberOfXs;
      } else {
        modalDisplayX.innerText = numberOfXs;
      }

      modalX.style.display = "block";
    });
  },
};

app.init();
