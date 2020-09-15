require('dotenv').config();

const assert = require('assert');
const express = require('express');
const budgetRoute = require('./routes/budgets');
const accountRoute = require('./routes/accounts');
const userRoute = require('./routes/users');
const notFound = require('./middleware/notFound');

assert(process.env.PGUSER, 'env PGUSER is required');
assert(process.env.PGHOST, 'env PGHOST is required');
assert(process.env.PGPASSWORD, 'env PGPASSWORD is required');
assert(process.env.PGDATABASE, 'env PGDATABASE is required');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', userRoute);
app.use('/api/v1', budgetRoute);
app.use('/api/v1', accountRoute);
app.use(notFound);

app.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});
