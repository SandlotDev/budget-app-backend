const express = require('express');
const budgetsRoute = require('./routes/budgets');
const accountsRoute = require('./routes/accounts');
const usersRoute = require('./routes/users');
const transactionsRoute = require('./routes/transactions');
const categoriesRoute = require('./routes/categories');
const payeesRoute = require('./routes/payees');
const notFound = require('./middleware/notFound');

const { PORT } = require('./utils/constants');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', usersRoute);
app.use('/api/v1', budgetsRoute);
app.use('/api/v1', accountsRoute);
app.use('/api/v1', transactionsRoute);
app.use('/api/v1', categoriesRoute);
app.use('/api/v1', payeesRoute);
app.use(notFound);

app.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT || 3000}`);
});
