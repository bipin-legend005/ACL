const teams = [
    "Kolambe",
    "Shivanagar",
    "Matpady",
    "Chanthar",
    "Devabailu"
];

const STORAGE_KEY = "cricketTournamentState";

const defaultMatches = [
    { id: 1, team1: "Matpady", team2: "Shivanagar", status: "upcoming", date: "28 Aug", time: "8:00 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 2, team1: "Kolambe", team2: "Devabailu", status: "upcoming", date: "28 Aug", time: "8:30 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 3, team1: "Chanthar", team2: "Matpady", status: "upcoming", date: "28 Aug", time: "9:00 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 4, team1: "Shivanagar", team2: "Kolambe", status: "upcoming", date: "28 Aug", time: "9:30 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 5, team1: "Devabailu", team2: "Chanthar", status: "upcoming", date: "28 Aug", time: "10:00 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 6, team1: "Kolambe", team2: "Chanthar", status: "upcoming", date: "29 Aug", time: "8:00 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 7, team1: "Matpady", team2: "Kolambe", status: "upcoming", date: "29 Aug", time: "8:30 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 8, team1: "Shivanagar", team2: "Devabailu", status: "upcoming", date: "29 Aug", time: "9:00 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 9, team1: "Chanthar", team2: "Shivanagar", status: "upcoming", date: "29 Aug", time: "9:30 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 10, team1: "Devabailu", team2: "Matpady", status: "upcoming", date: "29 Aug", time: "10:00 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 11, team1: "1st", team2: "2nd", status: "upcoming", date: "29 Aug", time: "10:30 PM", location: "Online", score1: "", score2: "", winner: "", isPlayoff: true, label: "QUALIFIER 1" },
    { id: 12, team1: "3rd", team2: "4th", status: "upcoming", date: "29 Aug", time: "11:00 PM", location: "Online", score1: "", score2: "", winner: "", isPlayoff: true, label: "ELIMINATOR" },
    { id: 13, team1: "Loser Q1", team2: "Winner Eliminator", status: "upcoming", date: "30 Aug", time: "8:00 PM", location: "Online", score1: "", score2: "", winner: "", isPlayoff: true, label: "QUALIFIER 2" },
    { id: 14, team1: "Winner Q1", team2: "Winner Q2", status: "upcoming", date: "30 Aug", time: "8:30 PM", location: "Online", score1: "", score2: "", winner: "", isPlayoff: true, label: "FINAL" }
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
const team1OversInput = document.getElementById("team1-overs");
const team2OversInput = document.getElementById("team2-overs");
const team1WicketsInput = document.getElementById("team1-wickets");
const team2WicketsInput = document.getElementById("team2-wickets");
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
    normalized.date = fallback.date;
    normalized.time = fallback.time || "8:00 PM";
    normalized.location = fallback.location || "Online";
    normalized.overs1 = match.overs1 || "";
    normalized.overs2 = match.overs2 || "";
    normalized.wickets1 = match.wickets1 ?? "";
    normalized.wickets2 = match.wickets2 ?? "";
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
        points: 0,
        runsFor: 0,
        runsAgainst: 0,
        ballsFaced: 0,
        ballsBowled: 0,
        nrr: 0
    }));

    matches
        .filter(match => !match.isPlayoff && match.status === "completed" && match.winner)
        .forEach(match => {
            const team1 = standings.find(item => item.team === match.team1);
            const team2 = standings.find(item => item.team === match.team2);

            if (!team1 || !team2) return;

            team1.played += 1;
            team2.played += 1;

            const overs1 = parseOvers(match.overs1);
            const overs2 = parseOvers(match.overs2);

            if (overs1 !== null && overs2 !== null) {
                team1.runsFor += Number(match.score1);
                team1.runsAgainst += Number(match.score2);
                team1.ballsFaced += overs1;
                team1.ballsBowled += overs2;
                team2.runsFor += Number(match.score2);
                team2.runsAgainst += Number(match.score1);
                team2.ballsFaced += overs2;
                team2.ballsBowled += overs1;
            }

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

    standings.forEach(team => {
        team.nrr = team.ballsFaced && team.ballsBowled
            ? (team.runsFor / (team.ballsFaced / 6)) - (team.runsAgainst / (team.ballsBowled / 6))
            : 0;
    });

    return standings.sort((a, b) => b.points - a.points || b.nrr - a.nrr || b.wins - a.wins || a.team.localeCompare(b.team));
}

function parseOvers(overs) {
    if (overs === "" || overs === null || overs === undefined) return null;

    const value = Number(overs);
    if (!Number.isFinite(value) || value <= 0) return null;

    const wholeOvers = Math.floor(value);
    const balls = Math.round((value - wholeOvers) * 10);
    if (balls > 5) return null;

    return wholeOvers * 6 + balls;
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
            <td>${team.nrr.toFixed(2)}</td>
        </tr>
    `).join("");
}

function getTeamInitials(team) {
    const words = team.split(" ");
    return (words.length > 1 ? words.map(word => word[0]).join("") : team.slice(0, 2)).toUpperCase();
}

function renderTournamentStats() {
    const totals = teams.map(team => ({ team, runs: 0, wickets: 0 }));

    matches
        .filter(match => !match.isPlayoff && match.status === "completed")
        .forEach(match => {
            const team1 = totals.find(item => item.team === match.team1);
            const team2 = totals.find(item => item.team === match.team2);
            if (!team1 || !team2) return;

            team1.runs += Number(match.score1) || 0;
            team2.runs += Number(match.score2) || 0;
            team1.wickets += Number(match.wickets2) || 0;
            team2.wickets += Number(match.wickets1) || 0;
        });

    const topRuns = [...totals].sort((a, b) => b.runs - a.runs)[0];
    const topWickets = [...totals].sort((a, b) => b.wickets - a.wickets)[0];
    document.getElementById("top-runs-team").textContent = topRuns.runs ? topRuns.team : "-";
    document.getElementById("top-runs-value").textContent = `${topRuns.runs} runs`;
    document.getElementById("top-wickets-team").textContent = topWickets.wickets ? topWickets.team : "-";
    document.getElementById("top-wickets-value").textContent = `${topWickets.wickets} wickets taken`;
}

function renderSchedule() {
    const selectedTeam = teamSelector.value;
    const isAdminView = adminPanel && !adminPanel.classList.contains("hidden");

    const leagueMatches = isAdminView
        ? matches.filter(match => !match.isPlayoff)
        : matches.filter(match => !match.isPlayoff && (match.team1 === selectedTeam || match.team2 === selectedTeam));

    const playoffMatches = isAdminView
        ? matches.filter(match => match.isPlayoff)
        : matches.filter(match => match.isPlayoff && (match.team1 === selectedTeam || match.team2 === selectedTeam));

    scheduleList.innerHTML = leagueMatches.length
        ? leagueMatches.map(match => {
            const isSelectedTeam = match.team1 === selectedTeam || match.team2 === selectedTeam;
            const resultText = match.status === "completed"
                ? `<small>${match.team1} ${match.score1} - ${match.score2} ${match.team2}</small>`
                : `<small>${match.date} • ${match.time || "8:00 PM"} • ${match.location || "Online"}</small>`;

            return `
                <div class="game ${isSelectedTeam ? "highlighted" : ""}">
                    <b>Match ${match.id}</b>
                    <span>${match.team1} vs ${match.team2}</span>
                    ${resultText}
                </div>
            `;
        }).join("")
        : `<div class="game"><b>No Matches</b><span>${selectedTeam}</span><small>No league matches scheduled for this team yet.</small></div>`;

    playoffList.innerHTML = playoffMatches.length
        ? playoffMatches.map(match => `
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
    document.getElementById("team-badge").textContent = getTeamInitials(team);

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

function getMatchTimestamp(match) {
    const [day, month] = match.date.split(" ");
    const [time, meridiem] = match.time.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    return new Date(`2026-${month === "Aug" ? "08" : "08"}-${day.padStart(2, "0")}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);
}

function renderMatchCenter(team) {
    const nextMatch = getTeamMatches(team).find(match => !match.isPlayoff && match.status === "upcoming") || matches.find(match => !match.isPlayoff && match.status === "upcoming");
    if (!nextMatch) return;

    document.getElementById("center-match-label").textContent = `MATCH ${nextMatch.id}`;
    document.getElementById("center-match-title").textContent = `${nextMatch.team1} vs ${nextMatch.team2}`;
    document.getElementById("center-match-meta").textContent = `${nextMatch.date} • ${nextMatch.time} • ${nextMatch.location}`;
    const isCompleted = nextMatch.status === "completed";
    document.getElementById("live-status").textContent = isCompleted ? "COMPLETED" : "UPCOMING";
    document.getElementById("live-status").classList.toggle("completed", isCompleted);
    updateCountdown(nextMatch);
}

function updateCountdown(match) {
    const countdown = document.getElementById("countdown");
    const update = () => {
        const remaining = getMatchTimestamp(match).getTime() - Date.now();
        if (remaining <= 0) {
            countdown.textContent = "MATCH DAY";
            return;
        }
        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        countdown.textContent = `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`;
    };
    update();
    clearInterval(window.cplCountdown);
    window.cplCountdown = setInterval(update, 1000);
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
    team1OversInput.value = selectedMatch.overs1 || "";
    team2OversInput.value = selectedMatch.overs2 || "";
    team1WicketsInput.value = selectedMatch.wickets1 ?? "";
    team2WicketsInput.value = selectedMatch.wickets2 ?? "";
}

function renderAll() {
    renderPointsTable();
    renderSchedule();
    populateMatchSelect();
    fillScoresForSelectedMatch();
    updateDashboard(teamSelector.value);
    renderTournamentStats();
    renderMatchCenter(teamSelector.value);
}

teamSelector.addEventListener("change", function () {
    updateDashboard(this.value);
    renderSchedule();
    renderMatchCenter(this.value);
});

openSiteBtn.addEventListener("click", function () {
    authContainer.classList.add("hidden");
    siteMain.classList.remove("hidden");
    adminPanel.classList.add("hidden");
    adminLoginBox.classList.add("hidden");
    adminToggleBtn.classList.add("hidden");
    document.querySelector(".team-selector").classList.remove("hidden");
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
        document.querySelector(".team-selector").classList.add("hidden");
        renderAll();
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
    document.querySelector(".team-selector").classList.remove("hidden");
    renderAll();
    openSiteBtn.focus();
});

resultForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const matchId = Number(resultMatchSelect.value);
    const selectedMatch = matches.find(match => match.id === matchId);
    const score1 = Number(team1ScoreInput.value);
    const score2 = Number(team2ScoreInput.value);
    const overs1 = team1OversInput.value;
    const overs2 = team2OversInput.value;
    const wickets1 = Number(team1WicketsInput.value);
    const wickets2 = Number(team2WicketsInput.value);

    if (!selectedMatch) {
        alert("Choose a valid match.");
        return;
    }

    if (Number.isNaN(score1) || Number.isNaN(score2) || score1 < 0 || score2 < 0 || score1 === score2 || parseOvers(overs1) === null || parseOvers(overs2) === null || !Number.isInteger(wickets1) || !Number.isInteger(wickets2) || wickets1 < 0 || wickets1 > 10 || wickets2 < 0 || wickets2 > 10) {
        alert("Enter valid scores, overs in cricket format (for example 19.4), and make sure one team wins.");
        return;
    }

    selectedMatch.score1 = score1;
    selectedMatch.score2 = score2;
    selectedMatch.overs1 = overs1;
    selectedMatch.overs2 = overs2;
    selectedMatch.wickets1 = wickets1;
    selectedMatch.wickets2 = wickets2;
    selectedMatch.status = "completed";
    selectedMatch.winner = score1 > score2 ? selectedMatch.team1 : selectedMatch.team2;

    saveMatches();
    renderAll();
    alert("Result saved successfully.");
});

resultMatchSelect.addEventListener("change", fillScoresForSelectedMatch);

renderAll();
