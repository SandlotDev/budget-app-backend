const format = require('pg-format');
const pool = require('./pool');

const OPERATOR_KEYS = {
  $eq: '=',
  $neq: '!=',
  $gt: '>',
  $gte: '>=',
  $lt: '<',
  $lte: '<=',
};

const LOGICAL_OPERATORS = {
  $OR: 'OR',
  $AND: 'AND',
};

const connect = async () => {
  const client = await pool.connect();

  const db = {};

  db.beginTransaction = async () => {
    await client.query('BEGIN');
  };

  db.commitTransaction = async () => {
    await client.query('COMMIT');
  };

  db.revertTransaction = async () => {
    await client.query('ROLLBACK');
  };

  db.sql = async (queryString, params) => {
    const dbResponse = await client.query(queryString, params);
    return dbResponse;
  };

  db.release = async () => {
    client.release();
  };

  db.query = (table) => {
    if (!table) {
      throw new Error('Table is a required paramater');
    }

    const query = {};

    query.find = async (condition, logicalOperators) => {
      const baseQueryString = format('SELECT * FROM %I', table);
      let dynamicQueryString = '';

      if (condition) {
        dynamicQueryString = 'WHERE (';
        const operators = Object.keys(condition);

        operators.forEach((operatorKey, idx) => {
          const operator = OPERATOR_KEYS[operatorKey];
          const columns = Object.keys(condition[operatorKey]);

          if (idx !== 0) dynamicQueryString += ` ${LOGICAL_OPERATORS[logicalOperators[idx - 1]]} (`;

          columns.forEach((column, colIdx) => {
            if (colIdx === (columns.length - 1)) dynamicQueryString += format(`%I ${operator} %L)`, column, condition[operatorKey][column]);
            else dynamicQueryString += format(`%I ${operator} %L AND `, column, condition[operatorKey][column]);
          });
        });
      }

      const { rows } = await client.query(`${baseQueryString} ${dynamicQueryString}`);
      return rows;
    };

    query.findOne = async (condition, logicalOperators) => {
      const baseQueryString = format('SELECT * FROM %I', table);
      let dynamicQueryString = '';

      if (condition) {
        dynamicQueryString = 'WHERE (';
        const operators = Object.keys(condition);

        operators.forEach((operatorKey, idx) => {
          const operator = OPERATOR_KEYS[operatorKey];
          const columns = Object.keys(condition[operatorKey]);

          if (idx !== 0) dynamicQueryString += ` ${LOGICAL_OPERATORS[logicalOperators[idx - 1]]} (`;

          columns.forEach((column, colIdx) => {
            if (colIdx === (columns.length - 1)) dynamicQueryString += format(`%I ${operator} %L)`, column, condition[operatorKey][column]);
            else dynamicQueryString += format(`%I ${operator} %L AND `, column, condition[operatorKey][column]);
          });
        });
      }

      const { rows } = await client.query(`${baseQueryString} ${dynamicQueryString}`);
      return rows[0] || false;
    };

    query.findById = async (id) => {
      const baseQueryString = format('SELECT * FROM %I WHERE id = %L', table, id);
      const { rows } = await client.query(baseQueryString);
      return rows[0] || false;
    };

    query.insert = async (params) => {
      const baseQueryString = format('INSERT INTO %I', table);
      let dynamicQueryString = '';

      const columns = Object.keys(params);
      if (columns.length === 1) {
        dynamicQueryString = format('(%I) VALUES (%L) RETURNING *', columns[0], params[columns[0]]);
      } else {
        columns.forEach((key, idx) => {
          if (idx === 0) dynamicQueryString += format('(%I,', key);
          else if (idx === (columns.length - 1)) dynamicQueryString += format(' %I) VALUES ', key);
          else dynamicQueryString += format('%I,', key);
        });

        columns.forEach((key, idx) => {
          if (idx === 0) dynamicQueryString += format('(%L,', params[key]);
          else if (idx === (columns.length - 1)) dynamicQueryString += format(' %L) RETURNING *', params[key]);
          else dynamicQueryString += format('%L,', params[key]);
        });
      }

      const { rows } = await client.query(`${baseQueryString} ${dynamicQueryString}`);
      return rows[0] || false;
    };

    query.update = async (values, condition, logicalOperators) => {
      const baseQueryString = format('UPDATE %I SET', table);
      let dynamicQueryString = '';

      const columns = Object.keys(values);
      columns.forEach((key, idx) => {
        if (idx === (columns.length - 1)) dynamicQueryString += format('%I = %L ', key, values[key]);
        else dynamicQueryString += format('%I = %L,', key, values[key]);
      });

      dynamicQueryString += 'WHERE (';

      const operators = Object.keys(condition);

      operators.forEach((operatorKey, idx) => {
        const operator = OPERATOR_KEYS[operatorKey];
        const opColumns = Object.keys(condition[operatorKey]);

        if (idx !== 0) dynamicQueryString += ` ${LOGICAL_OPERATORS[logicalOperators[idx - 1]]} (`;

        opColumns.forEach((column, colIdx) => {
          if (colIdx === (opColumns.length - 1)) dynamicQueryString += format(`%I ${operator} %L)`, column, condition[operatorKey][column]);
          else dynamicQueryString += format(`%I ${operator} %L AND `, column, condition[operatorKey][column]);
        });
      });

      dynamicQueryString += ' RETURNING *';
      const { rows } = await client.query(`${baseQueryString} ${dynamicQueryString}`);
      return rows;
    };

    query.updateById = async (id, values) => {
      const baseQueryString = format('UPDATE %I SET', table);
      let dynamicQueryString = '';

      const columns = Object.keys(values);
      columns.forEach((key, idx) => {
        if (idx === (columns.length - 1)) dynamicQueryString += format('%I = %L ', key, values[key]);
        else dynamicQueryString += format('%I = %L, ', key, values[key]);
      });

      dynamicQueryString += format('WHERE id = %L ', id);

      dynamicQueryString += 'RETURNING *';
      const { rows } = await client.query(`${baseQueryString} ${dynamicQueryString}`);
      return rows[0] || false;
    };

    query.delete = async (condition, logicalOperators) => {
      const baseQueryString = format('DELETE FROM %I', table);
      let dynamicQueryString = 'WHERE (';

      const operators = Object.keys(condition);

      operators.forEach((operatorKey, idx) => {
        const operator = OPERATOR_KEYS[operatorKey];
        const opColumns = Object.keys(condition[operatorKey]);

        if (idx !== 0) dynamicQueryString += ` ${LOGICAL_OPERATORS[logicalOperators[idx - 1]]} (`;

        opColumns.forEach((column, colIdx) => {
          if (colIdx === (opColumns.length - 1)) dynamicQueryString += format(`%I ${operator} %L)`, column, condition[operatorKey][column]);
          else dynamicQueryString += format(`%I ${operator} %L AND `, column, condition[operatorKey][column]);
        });
      });

      dynamicQueryString += ' RETURNING *';
      const { rows } = await client.query(`${baseQueryString} ${dynamicQueryString}`);
      return rows;
    };

    query.deleteById = async (id) => {
      const baseQueryString = format('DELETE FROM %I WHERE id = %L RETURNING *', table, id);

      const { rows } = await client.query(baseQueryString);
      return rows[0] || false;
    };
    return query;
  };

  return db;
};

module.exports = connect;
