let team1Score = 0;
let team2Score = 0;

document.querySelectorAll('.answer').forEach(answer => {
    answer.addEventListener('click', function () {
        if (!this.classList.contains('revealed')) {
            this.classList.add('revealed');
        }
    });
});

function awardPoints(team) {
    let revealedAnswers = document.querySelectorAll('.answer.revealed');
    let points = 0;

    revealedAnswers.forEach(answer => {
        points += parseInt(answer.getAttribute('data-points'));
    });

    if (team === 1) {
        team1Score += points;
        document.getElementById('team1Score').textContent = `Team 1: ${team1Score}`;
    } else {
        team2Score += points;
        document.getElementById('team2Score').textContent = `Team 2: ${team2Score}`;
    }

    // Reset the board score
    revealedAnswers.forEach(answer => {
        answer.classList.remove('revealed');
    });
}

function newQuestion() {
    alert('New Question Coming Soon!');
    // Implement the logic for loading a new question here
}
