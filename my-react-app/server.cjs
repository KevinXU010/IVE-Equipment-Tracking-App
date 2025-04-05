const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const config = {
    server: 'GAOGANG\\SQLEXPRESS', // Use server name with double backslashes
    database: 'IVEproject', // Database name
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

app.listen(3001, () => {
    console.log('Server running at http://localhost:3001'); // Server running message
});
