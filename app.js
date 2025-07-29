const express = require('express');
const app = express();
const portfolioRoutes = require('./routes/portfolioRoutes');

app.use(express.json());
app.use('/', portfolioRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
