const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const config = {
  server: '192.168.3.10',
  user: 'sa',
  password: 'Abc_123456',
  database: 'IVEproject',
  driver: 'msnodesqlv8',
  options: {
    // trustedConnection: true,
    trustServerCertificate: true
  }
};

app.use(cors());
app.use(express.json());

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

app.get('/login', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query(
            `SELECT * FROM Users`
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
// login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        await sql.connect(config);
        const result = await sql.query`
      SELECT *
      FROM Users
      WHERE Email = ${email}
    `;
    console.log(result)
        let user = result.recordset[0];

        if (!user) {
            return res.status(404).send(JSON.stringify({
              message: 'NO_USER'
          }));
        }
        // transfer to string
        if (String(user.password) !== String(password)) {
            // wrong password
            console.log(user.password, password);
            return res.status(401).send(JSON.stringify({
              message: 'BAD_PASSWORD',
        }));
        }
        // success
        // remove password from user object
        delete user.password;
        res.send(JSON.stringify({
          message: 'OK',
          data: user
        }));
    } catch (err) {
        console.error(err);
        res.status(500).send(JSON.stringify({
          message:'SERVER_ERROR',
          data: err}));
    }
});

app.listen(3001, () => console.log('Server running at http://localhost:3001'));