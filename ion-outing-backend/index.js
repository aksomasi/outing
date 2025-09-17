const express = require("express");
const path = require('path');      
const app = express();
const fs = require('fs');
const fsp = require('fs').promises;
let data = 1;
let players = [];
let status = 'Not Shuffled';
let shuffledTeams = [];
reset = false;
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

app.get("/api/stop", (req, res) => {
  status = 'Not Shuffled';
  this.shuffledTeams = [];
  res.json({ players });
});

app.get("/api/reset", (req, res) => {
  status = 'Not Shuffled';
  reset = true;
  players = [];
  shuffledTeams = [];
  res.json({ players });
});

// ✅ Delete player(s) by name
app.delete("/api/player/:name", (req, res) => {
  const name = (req.params.name || "").trim();
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  players = players.filter(p => (p.name || "").trim() !== name);
  

  // (Optional) also clear any teams that included removed players
  // shuffledTeams = [];

  return res.json({
    players
  });
});



// refresh API
app.get("/api/refresh", (req, res) => {
    const resetFlag = Object.assign({}, reset);
    reset = false
    res.json({ players, status,resetFlag, shuffledTeams }); // content-type: application/json
});

app.post("/api/shuffle", async (req, res) => {
    status = 'Shuffle Started';
    await sleep(95000); // sleep 10 seconds
      const { teamsCount } = req.body;
    shuffledTeams = buildBalancedTeams(players, teamsCount);
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




// --- Static mount for your pics folder ---
const picsDir = path.join(__dirname, 'pics');

// Serve files at /pics/...
app.use('/pics', express.static(picsDir, {
  index: false,
  maxAge: '1d',  // cache a bit
  etag: true
}));

// --- Helper: safe join + recursive walk ---
function safeJoin(base, sub = '') {
  const p = path.normalize(path.join(base, sub));
  if (!p.startsWith(base)) throw new Error('Invalid path');
  return p;
}
async function walk(dir) {
  const out = [];
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(abs));
    else out.push(abs);
  }
  return out;
}
const IMG_EXT = /\.(png|jpe?g|webp|gif|svg)$/i;

// --- API: list images with browser URLs ---
app.get('/api/pics', async (req, res) => {
  try {
    const sub = (req.query.dir || '').replace(/^\/+/, ''); // optional subfolder
    const folder = safeJoin(picsDir, sub);
    if (!fs.existsSync(folder)) return res.status(404).json({ error: 'Folder not found' });

    const absFiles = await walk(folder);
    const relFiles = absFiles
      .filter(p => IMG_EXT.test(p))
      .map(p => path.relative(picsDir, p).split(path.sep).join('/')); // normalize to /

    const base = `${req.protocol}://${req.get('host')}`;
    const files = relFiles.map(r => `${base}/pics/${encodeURI(r)}`);

    res.json({ dir: sub || '', count: files.length, files });
  } catch (err) {
    console.error('List pics error:', err);
    res.status(500).json({ error: 'Failed to list pics' });
  }
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


// GET /api/generate/:count  -> count only
app.get("/api/generate/:count", (req, res) => {
  const n = Number(req.params.count);
  if (!Number.isInteger(n) || n < 1) {
    return res.status(400).json({ error: "Provide a positive integer count" });
  }
  const out = doGenerate(n);
  res.json({ status: "ok", count: out.length, players: out });
});

// Sample name pools (no libs)
const maleFirst = [
  "Arjun","Rohit","Vikram","Rahul","Siddharth","Kiran","Anil","Karthik","Naveen","Rakesh",
  "Varun","Harsha","Sandeep","Amit","Imran","Vishal","Deepak","Manoj","Santosh","Ravi"
];
const femaleFirst = [
  "Priya","Ananya","Sonia","Neha","Divya","Keerthi","Nagma","Sneha","Pooja","Meera",
  "Lavanya","Lakshmi","Kavya","Asha","Rani","Jaya","Niharika","Swathi","Anusha","Sindhu"
];
const lastNames = [
  "Sharma","Reddy","Rao","Singh","Kumar","Patel","Das","Iyer","Nair","Gupta",
  "Bose","Chowdhury","Menon","Naidu","Shetty","Yadav","Chaudhary","Gowda","Bhat","Joshi"
];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function mkName(firstPool, i) {
  const f = firstPool[i % firstPool.length];
  const l = lastNames[(i * 7) % lastNames.length];
  return `${f} ${l} ${String(i + 1).padStart(2, "0")}`; // tiny suffix to keep unique
}
function generatePlayers(count) {
  const n = Math.max(1, Math.min(1000, Number(count))); // clamp 1..1000
  const malesTarget = Math.floor(n / 2);
  const femalesTarget = n - malesTarget;

  const males = Array.from({ length: malesTarget }, (_, i) => ({
    name: mkName(maleFirst, i),
    gender: "M",
  }));
  const females = Array.from({ length: femalesTarget }, (_, i) => ({
    name: mkName(femaleFirst, i),
    gender: "F",
  }));

  return shuffle([...males, ...females]);
}

// Core generator (updates global players/status; assumes you have `players` & `status`)
function doGenerate(n) {
  const generated = generatePlayers(n);
  try {
    if (Array.isArray(players)) players = generated; // replace
    if (typeof status !== "undefined") status = "Generated";
    if (typeof shuffledTeams !== "undefined") shuffledTeams = [];
  } catch { /* ignore if not defined */ }
  return generated;
}

function buildBalancedTeams(players, teamCount = 4) {
  // --- helpers ---
  const clone = (x) => JSON.parse(JSON.stringify(x));
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  const norm = (g) => (g || '').toString().trim().toUpperCase().startsWith('M') ? 'M'
                    : (g || '').toString().trim().toUpperCase().startsWith('F') ? 'F'
                    : 'U';

  // --- prep ---
  const src = clone(players).map(p => ({ name: p.name, gender: norm(p.gender) }));
  const males = shuffle(src.filter(p => p.gender === 'M'));
  const females = shuffle(src.filter(p => p.gender === 'F'));
  const unknowns = shuffle(src.filter(p => p.gender === 'U'));

  // Create teams with pretty names (shuffled for randomness)
  const prettyNames = shuffle([
    'North', 'South', 'East', 'West'
  ]).slice(0, teamCount);

  const teams = Array.from({ length: teamCount }, (_, i) => ({
    id: i,
    name: prettyNames[i],
    members: [],
    counts: { M: 0, F: 0, U: 0 },
    get size() { return this.members.length; }
  }));

  // Round-robin helper that always picks the currently smallest teams first
  function give(playersArr, genderTag) {
    while (playersArr.length) {
      // Sort teams by current size (asc), then random tie-break
      const order = teams
        .map(t => ({ t, r: Math.random() }))
        .sort((a, b) => (a.t.size - b.t.size) || (a.r - b.r))
        .map(x => x.t);

      for (const t of order) {
        const p = playersArr.pop();
        if (!p) return;
        t.members.push(p);
        t.counts[genderTag]++;
      }
    }
  }

  // 1) Prioritize M+F pairing per team
  // Distribute pairs in a round-robin so each team gets as many pairs as possible
  let k = 0;
  while (males.length && females.length) {
    const team = teams[k % teamCount];
    team.members.push(males.pop()); team.counts.M++;
    team.members.push(females.pop()); team.counts.F++;
    k++;
  }

  // 2) Distribute leftovers (whichever gender remains + unknowns) evenly & randomly
  give(males, 'M');
  give(females, 'F');
  give(unknowns, 'U');

  // Optional: small tidy so `size` is materialized (handy when logging)
  return teams.map(t => ({ ...t, size: t.members.length }));
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
