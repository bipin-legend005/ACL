const teams = [
    "Kolambe",
    "Shivanagar",
    "Matpady",
    "Chanthar",
    "Devabailu"
];

const STORAGE_KEY = "cricketTournamentState";

const defaultMatches = [
    { id: 1, team1: "Matpady", team2: "Shivanagar", status: "upcoming", date: "28 Aug", time: "6:00 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 2, team1: "Kolambe", team2: "Devabailu", status: "upcoming", date: "28 Aug", time: "6:30 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 3, team1: "Chanthar", team2: "Matpady", status: "upcoming", date: "28 Aug", time: "7:00 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 4, team1: "Shivanagar", team2: "Kolambe", status: "upcoming", date: "28 Aug", time: "7:30 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 5, team1: "Devabailu", team2: "Chanthar", status: "upcoming", date: "28 Aug", time: "8:00 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 6, team1: "Kolambe", team2: "Chanthar", status: "upcoming", date: "28 Aug", time: "8:30 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 7, team1: "Matpady", team2: "Kolambe", status: "upcoming", date: "28 Aug", time: "9:00 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 8, team1: "Shivanagar", team2: "Devabailu", status: "upcoming", date: "28 Aug", time: "9:30 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 9, team1: "Chanthar", team2: "Shivanagar", status: "upcoming", date: "28 Aug", time: "10:00 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 10, team1: "Devabailu", team2: "Matpady", status: "upcoming", date: "28 Aug", time: "10:30 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 11, team1: "1st", team2: "2nd", status: "upcoming", date: "29 Aug", time: "6:00 PM", location: "Online", score1: "", score2: "", winner: "", isPlayoff: true, label: "QUALIFIER 1" },
    { id: 12, team1: "3rd", team2: "4th", status: "upcoming", date: "29 Aug", time: "7:00 PM", location: "Online", score1: "", score2: "", winner: "", isPlayoff: true, label: "ELIMINATOR" },
    { id: 13, team1: "Loser Q1", team2: "Winner Eliminator", status: "upcoming", date: "30 Aug", time: "6:00 PM", location: "Online", score1: "", score2: "", winner: "", isPlayoff: true, label: "QUALIFIER 2" },
    { id: 14, team1: "Winner Q1", team2: "Winner Q2", status: "upcoming", date: "30 Aug", time: "8:00 PM", location: "Online", score1: "", score2: "", winner: "", isPlayoff: true, label: "FINAL" }
];

const adminCredentials = {
    username: "bipin",
    password: "cpl"
};

const teamSelector = document.getElementById("team");
const teamName = document.getElementById("team-name");
const resultMatchSelect = document.getElementById("result-match");
const team1ScoreInput = document.getElementById("team1-score");
const team2ScoreInput = document.getElementById("team2-score");
const openSiteBtn = document.getElementById("open-site-btn");
const adminToggleBtn = document.getElementById("admin-toggle-btn");
const adminLoginBox = document.getElementById("admin-login-box");
const adminLoginForm = document.getElementById("admin-login-form");
const resultForm = document.getElementById("result-form");
const authContainer = document.getElementById("auth-container");
const adminPanel = document.getElementById("admin-panel");
const siteMain = document.getElementById("site-main");
const scheduleList = document.getElementById("schedule-list");
const playoffList = document.getElementById("playoff-list");
const pointsTableBody = document.getElementById("points-table-body");
const matchCard = document.getElementById("match-card");

let matches = loadMatches();

function normalizeMatch(match, fallback) {
    if (!match || typeof match !== "object") return fallback;

    const normalized = { ...fallback, ...match };
    normalized.location = match.location || fallback.location || "Online";
    normalized.time = match.time || fallback.time || "6:00 PM";
    return normalized;
}

function loadMatches() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const fallbackMatches = JSON.parse(JSON.stringify(defaultMatches));

    if (!saved) {
        return fallbackMatches;
    }

    try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed) || !parsed.length) {
            return fallbackMatches;
        }

        return parsed.map((match) => {
            const fallback = fallbackMatches.find(item => item.id === match.id) || fallbackMatches[0];
            return normalizeMatch(match, fallback);
        });
    } catch (error) {
        return fallbackMatches;
    }
}

function saveMatches() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
}

function getTeamMatches(team) {
    return matches.filter(match => match.team1 === team || match.team2 === team);
}

function calculateStandings() {
    const standings = teams.map(team => ({
        team,
        played: 0,
        wins: 0,
        losses: 0,
        points: 0
    }));

    matches
        .filter(match => !match.isPlayoff && match.status === "completed" && match.winner)
        .forEach(match => {
            const team1 = standings.find(item => item.team === match.team1);
            const team2 = standings.find(item => item.team === match.team2);

            if (!team1 || !team2) return;

            team1.played += 1;
            team2.played += 1;

            if (match.winner === match.team1) {
                team1.wins += 1;
                team1.points += 2;
                team2.losses += 1;
            } else if (match.winner === match.team2) {
                team2.wins += 1;
                team2.points += 2;
                team1.losses += 1;
            }
        });

    return standings.sort((a, b) => b.points - a.points || b.wins - a.wins || a.team.localeCompare(b.team));
}

function renderPointsTable() {
    const standings = calculateStandings();

    pointsTableBody.innerHTML = standings.map((team, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${team.team}</td>
            <td>${team.played}</td>
            <td>${team.wins}</td>
            <td>${team.losses}</td>
            <td>${team.points}</td>
        </tr>
    `).join("");
}

function renderSchedule() {
    const selectedTeam = teamSelector.value;
    const teamLeagueMatches = matches.filter(match => !match.isPlayoff && (match.team1 === selectedTeam || match.team2 === selectedTeam));
    const teamPlayoffMatches = matches.filter(match => match.isPlayoff && (match.team1 === selectedTeam || match.team2 === selectedTeam));

    scheduleList.innerHTML = teamLeagueMatches.length
        ? teamLeagueMatches.map(match => {
            const resultText = match.status === "completed"
                ? `<small>${match.team1} ${match.score1} - ${match.score2} ${match.team2}</small>`
                : `<small>${match.date} • ${match.time || "6:00 PM"} • ${match.location || "Online"}</small>`;

            return `
                <div class="game highlighted">
                    <b>Match ${match.id}</b>
                    <span>${match.team1} vs ${match.team2}</span>
                    ${resultText}
                </div>
            `;
        }).join("")
        : `<div class="game"><b>No Matches</b><span>${selectedTeam}</span><small>No league matches scheduled for this team yet.</small></div>`;

    playoffList.innerHTML = teamPlayoffMatches.length
        ? teamPlayoffMatches.map(match => `
            <div class="playoff ${match.label === "FINAL" ? "final" : ""}">
                <h3>${match.label}</h3>
                <p>${match.team1} vs ${match.team2}</p>
                <small>${match.date}</small>
                ${match.status === "completed" ? `<small>Result: ${match.winner} won</small>` : `<small>Winner → ${match.label === "QUALIFIER 1" ? "Final" : match.label === "ELIMINATOR" ? "Qualifier 2" : "Final"}</small>`}
            </div>
        `).join("")
        : `<div class="playoff"><h3>No Playoff Match</h3><p>${selectedTeam}</p><small>No playoff match is assigned to this team yet.</small></div>`;
}

function updateDashboard(team) {
    teamName.textContent = team.toUpperCase();

    const standings = calculateStandings();
    const teamStats = standings.find(item => item.team === team) || { played: 0, wins: 0, losses: 0, points: 0 };
    const statBoxes = document.querySelectorAll(".stats div");

    statBoxes[0].querySelector("strong").textContent = teamStats.played;
    statBoxes[1].querySelector("strong").textContent = teamStats.wins;
    statBoxes[2].querySelector("strong").textContent = teamStats.losses;
    statBoxes[3].querySelector("strong").textContent = teamStats.points;

    updateNextMatch(team);
    highlightTeamMatches(team);
}

function updateNextMatch(team) {
    const teamMatches = getTeamMatches(team)
        .filter(match => !match.isPlayoff)
        .find(match => match.status === "upcoming");

    if (!teamMatches) {
        matchCard.innerHTML = `
            <h2>🏆 NO UPCOMING MATCH</h2>
            <p>${team} has completed all league matches.</p>
        `;
        return;
    }

    const opponent = teamMatches.team1 === team ? teamMatches.team2 : teamMatches.team1;

    matchCard.innerHTML = `
        <p>MATCH ${teamMatches.id}</p>
        <h2>${team} <span>VS</span> ${opponent}</h2>
        <div class="match-details">
            <span>📅 ${teamMatches.date}</span>
            <span>⏰ ${teamMatches.time || "6:00 PM"}</span>
            <span>📍 ${teamMatches.location || "Online"}</span>
        </div>
        <button type="button">View Match</button>
    `;
}

function highlightTeamMatches(team) {
    const games = document.querySelectorAll(".game");

    games.forEach(game => {
        const isTeamMatch = game.textContent.includes(team);
        game.style.border = isTeamMatch ? "2px solid #f5c542" : "none";
        game.style.opacity = isTeamMatch ? "1" : "0.45";
    });
}

function populateMatchSelect() {
    resultMatchSelect.innerHTML = matches.map(match => `
        <option value="${match.id}">${match.isPlayoff ? match.label : `Match ${match.id}`} - ${match.team1} vs ${match.team2}</option>
    `).join("");
}

function fillScoresForSelectedMatch() {
    const selectedMatch = matches.find(match => match.id === Number(resultMatchSelect.value));

    if (!selectedMatch) return;

    team1ScoreInput.value = selectedMatch.score1 || "";
    team2ScoreInput.value = selectedMatch.score2 || "";
}

function renderAll() {
    renderPointsTable();
    renderSchedule();
    populateMatchSelect();
    fillScoresForSelectedMatch();
    updateDashboard(teamSelector.value);
}

teamSelector.addEventListener("change", function () {
    updateDashboard(this.value);
    renderSchedule();
});

openSiteBtn.addEventListener("click", function () {
    authContainer.classList.add("hidden");
    siteMain.classList.remove("hidden");
    adminPanel.classList.add("hidden");
    adminLoginBox.classList.add("hidden");
    adminToggleBtn.classList.add("hidden");
});

adminToggleBtn.addEventListener("click", function () {
    adminLoginBox.classList.toggle("hidden");
});

adminLoginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("admin-username").value.trim();
    const password = document.getElementById("admin-password").value.trim();

    if (username === adminCredentials.username && password === adminCredentials.password) {
        authContainer.classList.add("hidden");
        siteMain.classList.remove("hidden");
        adminPanel.classList.remove("hidden");
        adminLoginBox.classList.add("hidden");
        adminLoginForm.reset();
    } else {
        alert("Invalid admin username or password.");
    }
});

document.getElementById("logout-btn").addEventListener("click", function () {
    adminPanel.classList.add("hidden");
    siteMain.classList.add("hidden");
    authContainer.classList.remove("hidden");
    adminLoginBox.classList.add("hidden");
    adminToggleBtn.classList.remove("hidden");
    adminLoginForm.reset();
    openSiteBtn.focus();
});

resultForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const matchId = Number(resultMatchSelect.value);
    const selectedMatch = matches.find(match => match.id === matchId);
    const score1 = Number(team1ScoreInput.value);
    const score2 = Number(team2ScoreInput.value);

    if (!selectedMatch) {
        alert("Choose a valid match.");
        return;
    }

    if (Number.isNaN(score1) || Number.isNaN(score2) || score1 === score2) {
        alert("Please enter valid scores and make sure one team wins.");
        return;
    }

    selectedMatch.score1 = score1;
    selectedMatch.score2 = score2;
    selectedMatch.status = "completed";
    selectedMatch.winner = score1 > score2 ? selectedMatch.team1 : selectedMatch.team2;

    saveMatches();
    renderAll();
    alert("Result saved successfully.");
});

resultMatchSelect.addEventListener("change", fillScoresForSelectedMatch);

renderAll();
