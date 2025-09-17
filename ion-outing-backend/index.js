const express = require("express");
const path = require('path');      
const app = express();
let data = 1;
let players = [];
let status = 'Not Shuffled';
let shuffledTeams = [];

// ✅ MUST come before any routes
app.use(express.json());                         // parses application/json
app.use(express.urlencoded({ extended: true })); // parses form posts (optional in dev)


// ✅ New API: add player
app.post("/api/addPlayer", (req, res) => {
  const { name, gender } = req.body;

  if (!name || !gender) {
    return res
      .status(400)
      .json({ error: "Name and gender are required" });
  }

  const exists = players.find(
    (p) => p.name === name && p.gender === gender
  );

  if (exists) {
    return res.json({ status: "existed", player: exists });
  }

  const newPlayer = { name, gender };
  players.push(newPlayer);

  res.json({ status: "created", player: newPlayer });
});


// ✅ New API: get players
app.get("/api/players", (req, res) => {
  res.json({ players });
});




// refresh API
app.get("/api/refresh", (req, res) => {
    res.json({ players, status, shuffledTeams }); // content-type: application/json
});

app.get("/api/shuffle", async (req, res) => {
    status = 'Shuffle Started';
    await sleep(12000); // sleep 10 seconds
    status = 'Shuffle Completed';
    res.json({ players, status, shuffledTeams }); // content-type: application/json
});

app.get("/api/restShuffle", async (req, res) => {
    status = 'Not Shuffled';
    res.json({ players, status, shuffledTeams }); // content-type: application/json
});


app.get("/api/lock", async (req, res) => {
    status = 'Shuffle Started';
    res.json({ players, status, shuffledTeams }); // content-type: application/json
});





// Simple API
app.get("/hello", (req, res) => {
	data = data + 1;
    res.json({ message: 'Hello World' }); // content-type: application/json
});

app.get("/getData", (req, res) => {
    res.json({ data }); // content-type: application/json
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// --- serve Angular build ---
// --- your APIs ---
app.get('/api/hello', (req, res) => res.json({ message: 'Api Hello World' }));

// --- serve Angular build (from angular.json -> outputPath: dist/ion-outing) ---
const staticDir = path.join(__dirname, '..', 'ion-outing', 'dist', 'ion-outing', 'browser');
app.use(express.static(staticDir));

// SPA fallback for any non-API route (works on Express 5)
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
