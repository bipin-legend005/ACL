const teams = [
    "Kolambe",
    "Shivajinagar",
    "Matpady",
    "Chanthar",
    "Devabailu"
];

const teamColors = {
    Kolambe: "#00f5d4",
    Shivajinagar: "#ff4ecd",
    Matpady: "#b8ff3d",
    Chanthar: "#ff9f1c",
    Devabailu: "#9b5cff"
};

const STORAGE_KEY = "cricketTournamentState";
const NEWS_KEY = "cplOrganizerNews";

const defaultMatches = [
    { id: 1, team1: "Matpady", team2: "Shivajinagar", status: "upcoming", date: "28 Aug", time: "8:00 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 2, team1: "Kolambe", team2: "Devabailu", status: "upcoming", date: "28 Aug", time: "8:30 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 3, team1: "Chanthar", team2: "Matpady", status: "upcoming", date: "28 Aug", time: "9:00 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 4, team1: "Shivajinagar", team2: "Kolambe", status: "upcoming", date: "28 Aug", time: "9:30 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 5, team1: "Devabailu", team2: "Chanthar", status: "upcoming", date: "28 Aug", time: "10:00 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 6, team1: "Kolambe", team2: "Chanthar", status: "upcoming", date: "29 Aug", time: "8:00 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 7, team1: "Matpady", team2: "Kolambe", status: "upcoming", date: "29 Aug", time: "8:30 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 8, team1: "Shivajinagar", team2: "Devabailu", status: "upcoming", date: "29 Aug", time: "9:00 PM", location: "Online", score1: "", score2: "", winner: "" },
    { id: 9, team1: "Chanthar", team2: "Shivajinagar", status: "upcoming", date: "29 Aug", time: "9:30 PM", location: "Online", score1: "", score2: "", winner: "" },
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
const formTeamLabel = document.getElementById("form-team-label");
const formTrack = document.getElementById("form-track");
const formStats = document.getElementById("form-stats");
const formSummary = document.getElementById("form-summary");
const resultMatchSelect = document.getElementById("result-match");
const resultOutcomeSelect = document.getElementById("result-outcome");
const team1ScoreInput = document.getElementById("team1-score");
const team2ScoreInput = document.getElementById("team2-score");
const team1OversInput = document.getElementById("team1-overs");
const team2OversInput = document.getElementById("team2-overs");
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
const newsList = document.getElementById("news-list");
const newsForm = document.getElementById("news-form");
const newsIdInput = document.getElementById("news-id");
const newsTitleInput = document.getElementById("news-title");
const newsMessageInput = document.getElementById("news-message");
const newsSubmit = document.getElementById("news-submit");
const newsCancel = document.getElementById("news-cancel");
const adminNewsList = document.getElementById("admin-news-list");
const playerOnlySections = [
    document.getElementById("team-selector-section"),
    document.getElementById("team-dashboard-section"),
    document.getElementById("next-match-section")
];

let matches = loadMatches();
let organizerNews = loadJSON(NEWS_KEY, []);

function loadJSON(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
        return fallback;
    }
}

function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function normalizeMatch(match, fallback) {
    if (!match || typeof match !== "object") return fallback;

    const normalized = { ...fallback, ...match };
    normalized.team1 = normalized.team1 === "Shivanagar" ? "Shivajinagar" : normalized.team1;
    normalized.team2 = normalized.team2 === "Shivanagar" ? "Shivajinagar" : normalized.team2;
    normalized.winner = normalized.winner === "Shivanagar" ? "Shivajinagar" : normalized.winner;
    normalized.date = fallback.date;
    normalized.time = fallback.time || "8:00 PM";
    normalized.location = fallback.location || "Online";
    normalized.overs1 = match.overs1 || "";
    normalized.overs2 = match.overs2 || "";
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

        const savedById = new Map(parsed.map(match => [match.id, match]));
        return fallbackMatches.map(fallback => normalizeMatch(savedById.get(fallback.id), fallback));
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

function getTeamColor(team) {
    return teamColors[team] || "#7af6ff";
}

function getTeamForm(team) {
    return matches
        .filter(match => !match.isPlayoff && (match.team1 === team || match.team2 === team))
        .sort((a, b) => a.id - b.id)
        .map(match => {
            if (match.status !== "completed") return { match, result: "—", className: "not-played" };
            if (!match.winner) return { match, result: "NR", className: "no-result" };
            return {
                match,
                result: match.winner === team ? "W" : "L",
                className: match.winner === team ? "win" : "loss"
            };
        });
}

function renderFormGuide(team) {
    const form = getTeamForm(team);
    const standings = calculateStandings();
    const stats = standings.find(item => item.team === team) || { played: 0, wins: 0, losses: 0, points: 0 };
    const completedForm = form.filter(item => item.result !== "—");
    const lastTwo = completedForm.slice(-2).map(item => item.result);

    formTeamLabel.textContent = `${team.toUpperCase()} — FORM`;
    formTrack.innerHTML = form.map(item => `
        <span class="form-result ${item.className}" title="Match ${item.match.id}">${item.result}</span>
    `).join("");
    formStats.innerHTML = `
        <span>Matches Played: <strong>${stats.played}</strong></span>
        <span>Wins: <strong>${stats.wins}</strong></span>
        <span>Losses: <strong>${stats.losses}</strong></span>
        <span>Points: <strong>${stats.points}</strong></span>
    `;

    if (!stats.played) {
        formSummary.textContent = "🆕 No matches played yet.";
    } else if (lastTwo.length === 2 && lastTwo.every(result => result === "W")) {
        formSummary.textContent = "📈 Strong finish — won the last 2 matches.";
    } else if (lastTwo.length === 2 && lastTwo.every(result => result === "L")) {
        formSummary.textContent = "⚠️ Needs a turnaround — lost the last 2 matches.";
    } else if (stats.wins >= 3) {
        formSummary.textContent = `🔥 Excellent form — ${stats.wins} wins from ${stats.played} matches.`;
    } else {
        formSummary.textContent = `${stats.wins ? "📊 Building momentum" : "🟡 Still searching for a win"} — ${stats.wins} wins from ${stats.played} matches.`;
    }
}

function formatNewsDate(date = new Date()) {
    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function getAutomaticNews() {
    const standings = calculateStandings();
    const news = [];
    const winCounts = Object.fromEntries(teams.map(team => [team, 0]));
    const completedLeagueMatches = matches.filter(match => !match.isPlayoff && match.status === "completed");

    completedLeagueMatches.forEach(match => {
        if (!match.winner) return;
        winCounts[match.winner] += 1;
        const loser = match.winner === match.team1 ? match.team2 : match.team1;
        const firstWin = winCounts[match.winner] === 1;
        news.push({
            type: firstWin ? "TOURNAMENT UPDATE" : "MATCH UPDATE",
            title: firstWin ? `🆕 ${match.winner} record their first-ever tournament victory!` : `🔥 ${match.winner} defeat ${loser}!`,
            date: `${match.date} 2026`,
            key: `win-${match.id}`
        });
    });

    standings.forEach(team => {
        if (team.qualification === "QUALIFIED") {
            news.push({ type: "PLAYOFF RACE", title: `🟢 ${team.team} have qualified for the playoffs!`, date: formatNewsDate(), key: `qualified-${team.team}` });
        } else if (team.qualification === "ELIMINATED") {
            news.push({ type: "PLAYOFF RACE", title: `🔴 ${team.team} have been eliminated from playoff contention.`, date: formatNewsDate(), key: `eliminated-${team.team}` });
        }
    });

    const leagueMatches = matches.filter(match => !match.isPlayoff);
    if (leagueMatches.length && leagueMatches.every(match => match.status === "completed")) {
        news.push({ type: "PLAYOFF UPDATE", title: "🏆 The playoff bracket is locked!", date: formatNewsDate(), key: "league-locked" });
    }

    return news;
}

function renderNews() {
    const news = [...organizerNews.map(item => ({ ...item, type: "ORGANIZER ANNOUNCEMENT" })), ...getAutomaticNews()];
    newsList.innerHTML = news.length ? news.map(item => `
        <article class="news-card">
            <span class="news-type">${escapeHTML(item.type)}</span>
            <h3>${escapeHTML(item.title)}</h3>
            ${item.message ? `<p>${escapeHTML(item.message)}</p>` : ""}
            <small>${escapeHTML(item.date || formatNewsDate())}</small>
        </article>
    `).join("") : `<div class="empty-state">News will appear here as tournament events happen.</div>`;
}

function renderAdminNews() {
    adminNewsList.innerHTML = organizerNews.length ? organizerNews.map(item => `
        <div class="admin-news-item"><span>${escapeHTML(item.title)}</span><div><button type="button" data-edit-news="${item.id}" class="secondary-btn">Edit</button><button type="button" data-delete-news="${item.id}" class="secondary-btn">Delete</button></div></div>
    `).join("") : `<small class="empty-state">No organizer announcements yet.</small>`;
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
        .filter(match => !match.isPlayoff && match.status === "completed")
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
            } else {
                team1.points += 1;
                team2.points += 1;
            }
        });

    standings.forEach(team => {
        team.nrr = team.ballsFaced && team.ballsBowled
            ? (team.runsFor / (team.ballsFaced / 6)) - (team.runsAgainst / (team.ballsBowled / 6))
            : 0;
    });

    const leagueMatches = matches.filter(match => !match.isPlayoff);
    const leagueComplete = leagueMatches.length > 0 && leagueMatches.every(match => match.status === "completed");
    const qualificationStatuses = leagueComplete ? null : calculateQualificationStatuses(standings, leagueMatches);

    return standings
        .sort((a, b) => b.points - a.points || b.nrr - a.nrr || b.runsFor - a.runsFor || a.team.localeCompare(b.team))
        .map((team, index) => ({
            ...team,
            position: index + 1,
            qualification: leagueComplete
                ? (index < 4 ? `Q${index + 1}` : "ELIMINATED")
                : qualificationStatuses[team.team]
        }));
}

function calculateQualificationStatuses(standings, leagueMatches) {
    const remainingMatches = leagueMatches.filter(match => match.status !== "completed");
    const bestRank = Object.fromEntries(teams.map(team => [team, teams.length]));
    const worstRank = Object.fromEntries(teams.map(team => [team, 1]));
    const points = Object.fromEntries(standings.map(team => [team.team, team.points]));

    function evaluateScenario(matchIndex) {
        if (matchIndex === remainingMatches.length) {
            teams.forEach(team => {
                const currentPoints = points[team];
                const rankWithTieBreak = 1 + teams.filter(other => other !== team && points[other] > currentPoints).length;
                const worstCaseRank = 1 + teams.filter(other => other !== team && points[other] >= currentPoints).length;
                bestRank[team] = Math.min(bestRank[team], rankWithTieBreak);
                worstRank[team] = Math.max(worstRank[team], worstCaseRank);
            });
            return;
        }

        const match = remainingMatches[matchIndex];
        points[match.team1] += 2;
        evaluateScenario(matchIndex + 1);
        points[match.team1] -= 2;

        points[match.team2] += 2;
        evaluateScenario(matchIndex + 1);
        points[match.team2] -= 2;

        points[match.team1] += 1;
        points[match.team2] += 1;
        evaluateScenario(matchIndex + 1);
        points[match.team1] -= 1;
        points[match.team2] -= 1;
    }

    evaluateScenario(0);

    return Object.fromEntries(teams.map(team => [
        team,
        worstRank[team] <= 4 ? "QUALIFIED" : bestRank[team] > 4 ? "ELIMINATED" : "PENDING"
    ]));
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
            <td class="team-cell"><span class="team-dot" style="--team-color: ${getTeamColor(team.team)}"></span><strong style="color: ${getTeamColor(team.team)}">${team.team}</strong></td>
            <td>${team.played}</td>
            <td>${team.wins}</td>
            <td>${team.losses}</td>
            <td>${team.points}</td>
            <td>${team.nrr.toFixed(2)}</td>
            <td><strong class="qualification ${team.qualification.toLowerCase()}">${team.qualification}</strong></td>
        </tr>
    `).join("");
}

function getPlayoffBracket() {
    const standings = calculateStandings();
    const qualificationConfirmed = standings[0]?.qualification !== "PENDING";
    const teamAt = position => standings[position - 1]?.team || `Q${position}`;

    return [
        { match: matches.find(item => item.label === "QUALIFIER 1"), label: "QUALIFIER 1", team1: qualificationConfirmed ? teamAt(1) : "Qualification pending", team2: qualificationConfirmed ? teamAt(2) : "Qualification pending" },
        { match: matches.find(item => item.label === "ELIMINATOR"), label: "ELIMINATOR", team1: qualificationConfirmed ? teamAt(3) : "Qualification pending", team2: qualificationConfirmed ? teamAt(4) : "Qualification pending" },
        { match: matches.find(item => item.label === "QUALIFIER 2"), label: "QUALIFIER 2", team1: "Loser Q1", team2: "Winner Eliminator" },
        { match: matches.find(item => item.label === "FINAL"), label: "FINAL", team1: "Winner Q1", team2: "Winner Q2" }
    ];
}

function renderSchedule() {
    const selectedTeam = teamSelector.value;
    const isAdminView = adminPanel && !adminPanel.classList.contains("hidden");

    const leagueMatches = isAdminView
        ? matches.filter(match => !match.isPlayoff)
        : matches.filter(match => !match.isPlayoff && (match.team1 === selectedTeam || match.team2 === selectedTeam));

    const playoffMatches = getPlayoffBracket().filter(item => {
        if (isAdminView) return true;
        return item.team1 === selectedTeam || item.team2 === selectedTeam;
    });

    scheduleList.innerHTML = leagueMatches.length
        ? leagueMatches.map(match => {
            const isSelectedTeam = match.team1 === selectedTeam || match.team2 === selectedTeam;
            const resultText = match.status === "completed"
                ? `<small>${match.winner ? `${match.team1} ${match.score1} - ${match.score2} ${match.team2}` : "Tie / No Result"}</small>`
                : `<small>${match.date} • ${match.time || "8:00 PM"} • ${match.location || "Online"}</small>`;

            return `
                <div class="game ${isSelectedTeam ? "highlighted" : ""}" style="--team-color: ${getTeamColor(match.team1)}; --team-color-alt: ${getTeamColor(match.team2)}">
                    <b>Match ${match.id}</b>
                    <span><strong style="color: ${getTeamColor(match.team1)}">${match.team1}</strong> <em>vs</em> <strong style="color: ${getTeamColor(match.team2)}">${match.team2}</strong></span>
                    ${resultText}
                </div>
            `;
        }).join("")
        : `<div class="game"><b>No Matches</b><span>${selectedTeam}</span><small>No league matches scheduled for this team yet.</small></div>`;

    playoffList.innerHTML = playoffMatches.length
        ? playoffMatches.map(item => `
            <div class="playoff ${item.label === "FINAL" ? "final" : ""}" style="--team-color: ${getTeamColor(item.team1)}; --team-color-alt: ${getTeamColor(item.team2)}">
                <h3>${item.label}</h3>
                <p><strong style="color: ${getTeamColor(item.team1)}">${item.team1}</strong> <em>vs</em> <strong style="color: ${getTeamColor(item.team2)}">${item.team2}</strong></p>
                <small>${item.match.date}</small>
                ${item.match.status === "completed" ? `<small>Result: ${item.match.winner || "Tie / No Result"}</small>` : `<small>Winner → ${item.label === "QUALIFIER 1" ? "Final" : item.label === "ELIMINATOR" ? "Qualifier 2" : "Final"}</small>`}
            </div>
        `).join("")
        : `<div class="playoff"><h3>No Playoff Match</h3><p>${selectedTeam}</p><small>No playoff match is assigned to this team yet.</small></div>`;
}

function updateDashboard(team) {
    teamName.textContent = team.toUpperCase();
    teamName.style.color = getTeamColor(team);

    const standings = calculateStandings();
    const teamStats = standings.find(item => item.team === team) || { played: 0, wins: 0, losses: 0, points: 0 };
    document.getElementById("qualification-status").textContent = teamStats.qualification || "ELIMINATED";
    document.getElementById("qualification-status").className = teamStats.qualification.toLowerCase();
    const statBoxes = document.querySelectorAll(".stats div");

    statBoxes[0].querySelector("strong").textContent = teamStats.played;
    statBoxes[1].querySelector("strong").textContent = teamStats.wins;
    statBoxes[2].querySelector("strong").textContent = teamStats.losses;
    statBoxes[3].querySelector("strong").textContent = teamStats.points;

    updateNextMatch(team);
    highlightTeamMatches(team);
    renderFormGuide(team);
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
    const isAdminView = adminPanel && !adminPanel.classList.contains("hidden");

    games.forEach(game => {
        if (isAdminView) {
            game.style.border = "";
            game.style.opacity = "1";
            return;
        }

        const isTeamMatch = game.textContent.includes(team);
        game.style.border = isTeamMatch ? `2px solid ${getTeamColor(team)}` : "none";
        game.style.opacity = isTeamMatch ? "1" : "0.45";
    });
}

function setPlayerView(isAdminView) {
    playerOnlySections.forEach(section => section.classList.toggle("hidden", isAdminView));
}

function populateMatchSelect() {
    const bracket = getPlayoffBracket();
    resultMatchSelect.innerHTML = matches.map(match => {
        const playoff = bracket.find(item => item.match?.id === match.id);
        const team1 = playoff?.team1 || match.team1;
        const team2 = playoff?.team2 || match.team2;
        return `<option value="${match.id}">${match.isPlayoff ? match.label : `Match ${match.id}`} - ${team1} vs ${team2}</option>`;
    }).join("");
}

function fillScoresForSelectedMatch() {
    const selectedMatch = matches.find(match => match.id === Number(resultMatchSelect.value));

    if (!selectedMatch) return;

    team1ScoreInput.value = selectedMatch.score1 || "";
    team2ScoreInput.value = selectedMatch.score2 || "";
    team1OversInput.value = selectedMatch.overs1 || "";
    team2OversInput.value = selectedMatch.overs2 || "";
    resultOutcomeSelect.value = selectedMatch.winner ? "win" : "tie";
}

function renderAll() {
    renderPointsTable();
    renderSchedule();
    populateMatchSelect();
    fillScoresForSelectedMatch();
    updateDashboard(teamSelector.value);
    renderNews();
    renderAdminNews();
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
    setPlayerView(false);
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
        setPlayerView(true);
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
    setPlayerView(false);
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
    const outcome = resultOutcomeSelect.value;
    const hasScores = team1ScoreInput.value !== "" && team2ScoreInput.value !== "";
    const isNoResult = outcome === "tie" && !hasScores;
    const validOvers = parseOvers(overs1) !== null && parseOvers(overs2) !== null;

    if (!selectedMatch) {
        alert("Choose a valid match.");
        return;
    }

    const validScores = hasScores && !Number.isNaN(score1) && !Number.isNaN(score2) && score1 >= 0 && score2 >= 0;
    const validWin = outcome === "win" && validScores && score1 !== score2 && validOvers;
    const validTie = outcome === "tie" && (isNoResult || (validScores && score1 === score2 && validOvers));

    if (!validWin && !validTie) {
        alert("Enter valid scores and overs, or choose Tie / No Result for a tied or abandoned match.");
        return;
    }

    selectedMatch.score1 = isNoResult ? "" : score1;
    selectedMatch.score2 = isNoResult ? "" : score2;
    selectedMatch.overs1 = isNoResult ? "" : overs1;
    selectedMatch.overs2 = isNoResult ? "" : overs2;
    selectedMatch.status = "completed";
    selectedMatch.winner = outcome === "win" ? (score1 > score2 ? selectedMatch.team1 : selectedMatch.team2) : "";

    saveMatches();
    renderAll();
    alert("Result saved successfully.");
});

resultMatchSelect.addEventListener("change", fillScoresForSelectedMatch);

newsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = newsTitleInput.value.trim();
    const message = newsMessageInput.value.trim();
    if (!title || !message) return;

    const existingId = Number(newsIdInput.value);
    if (existingId) {
        const item = organizerNews.find(news => news.id === existingId);
        if (item) {
            item.title = title;
            item.message = message;
        }
    } else {
        organizerNews.unshift({ id: Date.now(), title, message, date: formatNewsDate() });
    }

    saveJSON(NEWS_KEY, organizerNews);
    resetNewsForm();
    renderNews();
    renderAdminNews();
});

function resetNewsForm() {
    newsForm.reset();
    newsIdInput.value = "";
    newsSubmit.textContent = "Add Announcement";
    newsCancel.classList.add("hidden");
}

newsCancel.addEventListener("click", resetNewsForm);

adminNewsList.addEventListener("click", function (event) {
    const editButton = event.target.closest("[data-edit-news]");
    const deleteButton = event.target.closest("[data-delete-news]");

    if (editButton) {
        const item = organizerNews.find(news => news.id === Number(editButton.dataset.editNews));
        if (!item) return;
        newsIdInput.value = item.id;
        newsTitleInput.value = item.title;
        newsMessageInput.value = item.message;
        newsSubmit.textContent = "Update Announcement";
        newsCancel.classList.remove("hidden");
        newsTitleInput.focus();
    }

    if (deleteButton) {
        organizerNews = organizerNews.filter(news => news.id !== Number(deleteButton.dataset.deleteNews));
        saveJSON(NEWS_KEY, organizerNews);
        renderNews();
        renderAdminNews();
    }
});

renderAll();
