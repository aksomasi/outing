const express = require("express");
const path = require('path');      
const app = express();
let data = 1;
// Simple API
app.get("/hello", (req, res) => {
	data = data + 1;
    res.json({ message: 'Hello World' }); // content-type: application/json
});

app.get("/getData", (req, res) => {
    res.json({ data }); // content-type: application/json
});

// --- serve Angular build ---
const browserDir = path.join(__dirname, '..', 'ion-outing', 'dist', 'ion-outing', 'browser');
app.use(express.static(browserDir));
app.get('*', (_req, res) => res.sendFile(path.join(browserDir, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
