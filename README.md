# General Assembly Feud ReadMe 

**Rules**
1. Teams
Two teams (usually families) compete against each other, with each team consisting of at least 5 players.

2. The Rounds
The game consists of three rounds. No "Fast Money" round in this version unfortunately

3. The Face-Off
One member from each team participates. The host asks a question, and the first person to buzz in answers. The team with the highest-ranking answer can choose to play or pass.

4. The Main Round
The team that chooses to play takes turns guessing the remaining answers.
Each incorrect answer results in a strike.
If a team gets three strikes, the opposing team gets a chance to steal.
5. Stealing
The opposing team can guess one correct answer that hasn’t been guessed. If they guess correctly, they steal the points.

6. Points System
Points are awarded based on the number of people who gave that answer in the survey. Some rounds have double or triple points.




```
  jsonLoaded: function (data) {
    console.clear();
    app.allData = data;
    app.questions = Object.keys(data);
    app.shuffle(app.questions);
    app.makeQuestion(app.currentQ);
    $("body").append(app.board);
    console.log(app);
  },
```
