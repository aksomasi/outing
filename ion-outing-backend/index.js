const express = require("express");
const app = express();
const PORT = 3000;
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
const dist = path.join(__dirname, "..", "ui", "dist");
const browser = path.join(dist, "YOUR_APP_NAME", "browser"); // see note below
app.use(express.static(browser));
app.get("*", (_req, res) => res.sendFile(path.join(browser, "index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
