const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const config = {
  server: 'localhost\\SQLEXPRESS',
  database: 'IVEproject',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  }
};

app.get('/items', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query(
            `SELECT *
       FROM Equipments
       `
        );
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error:', err);
        res.status(500).send('Database connection error');
    }
});

// borrow an item (set Borrowed = 1)
app.post('/items/:id/borrow', async (req, res) => {
  const { id } = req.params;
  try {
    await sql.connect(config);
    await sql.query`UPDATE Equipments SET Borrowed = 1 WHERE id = ${id}`;
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Could not borrow item');
  }
});

// return an item (set Borrowed = 0)
app.post('/items/:id/return', async (req, res) => {
  const { id } = req.params;
  try {
    await sql.connect(config);
    await sql.query`UPDATE Equipments SET Borrowed = 0 WHERE id = ${id}`;
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Could not return item');
  }
});

app.listen(3001, () => console.log('Server running at http://localhost:3001'));