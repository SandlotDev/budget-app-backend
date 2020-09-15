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

  db.query = (table) => {
    if (!table) {
      throw new Error('Table is a required paramater');
    }

    const query = {};

    query.find = async (params) => {
      const baseQueryString = format('SELECT * FROM %I', table);
      let dynamicQueryString = '';

      if (params) {
        dynamicQueryString = 'WHERE';
        Object.keys(params).forEach((key, idx) => {
          if (idx === 0) dynamicQueryString += ` ${format('%I = %L', key, params[key])} `;
          else dynamicQueryString += ` ${format('AND %I = %L', key, params[key])} `;
        });
      }

      const { rows } = await client.query(`${baseQueryString} ${dynamicQueryString}`);
      return rows;
    };

    query.findOne = async (params) => {
      const baseQueryString = format('SELECT * FROM %I', table);
      let dynamicQueryString = '';

      if (params) {
        dynamicQueryString = 'WHERE';
        Object.keys(params).forEach((key, idx) => {
          if (idx === 0) dynamicQueryString += ` ${format('%I = %L', key, params[key])} `;
          else dynamicQueryString += ` ${format('AND %I = %L', key, params[key])} `;
        });
      }

      const { rows } = await client.query(`${baseQueryString} ${dynamicQueryString}`);
      return rows[0] || false;
    };

    query.findById = async (id) => {
      const baseQueryString = format('SELECT * FROM %I WHERE %I = %L', table, `${table.slice(0, -1)}_id`, id);
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

    query.update = async (condition, params) => {
      const baseQueryString = format('UPDATE %I SET', table);
      let dynamicQueryString = '';

      const columns = Object.keys(params);
      columns.forEach((key, idx) => {
        if (idx === (columns.length - 1)) dynamicQueryString += format(' %I = %L ', key, params[key]);
        else dynamicQueryString += format(' %I = %L,', key, params[key]);
      });

      dynamicQueryString += 'WHERE';
      const operators = Object.keys(condition);

      operators.forEach((operatorKey, idx) => {
        const operator = OPERATOR_KEYS[operatorKey];
        const column = Object.keys(condition[operatorKey]);

        if (idx === (operators.length - 1)) dynamicQueryString += format(` %I ${operator} %L`, column, condition[operatorKey][column]);
        else dynamicQueryString += format(` %I ${operator} %L AND`, column, condition[operatorKey][column]);
      });

      dynamicQueryString += 'RETURNING *';
      const { rows } = await client.query(`${baseQueryString} ${dynamicQueryString}`);
      return rows;
    };

    query.updateById = async (id, params) => {
      const baseQueryString = format('UPDATE %I SET', table);
      let dynamicQueryString = '';

      const columns = Object.keys(params);
      columns.forEach((key, idx) => {
        if (idx === (columns.length - 1)) dynamicQueryString += format('%I = %L ', key, params[key]);
        else dynamicQueryString += format('%I = %L, ', key, params[key]);
      });

      dynamicQueryString += format('WHERE %I = %L ', `${table.slice(0, -1)}_id`, id);

      dynamicQueryString += 'RETURNING *';
      const { rows } = await client.query(`${baseQueryString} ${dynamicQueryString}`);
      return rows[0] || false;
    };

    query.delete = async (condition) => {
      const baseQueryString = format('DELETE FROM %I', table);
      let dynamicQueryString = 'WHERE';

      const operators = Object.keys(condition);

      operators.forEach((operatorKey, idx) => {
        const operator = OPERATOR_KEYS[operatorKey];
        const column = Object.keys(condition[operatorKey]);

        if (idx === (operators.length - 1)) dynamicQueryString += format(` %I ${operator} %L`, column, condition[operatorKey][column]);
        else dynamicQueryString += format(` %I ${operator} %L AND`, column, condition[operatorKey][column]);
      });

      dynamicQueryString += 'RETURNING *';
      const { rows } = await client.query(`${baseQueryString} ${dynamicQueryString}`);
      return rows;
    };

    query.deleteById = async (id) => {
      const baseQueryString = format('DELETE FROM %I WHERE %I = %L RETURNING *', table, `${table.slice(0, -1)}_id`, id);

      const { rows } = await client.query(baseQueryString);
      return rows[0] || false;
    };
    return query;
  };

  return db;
};

module.exports = connect;
