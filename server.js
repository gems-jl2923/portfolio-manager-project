const express = require('express');
const path = require('path');
const app = express();

// Serve static assets from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML from 'views/index.html'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
