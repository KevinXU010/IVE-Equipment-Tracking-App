const express = require('express')
const sql = require('mssql/msnodesqlv8')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const app = express()

app.use(cors())
app.use(express.json())

// const config = {
//   server: '192.168.3.10',
//   user: 'sa',
//   password: 'Abc_123456',
//   database: 'IVEproject',
//   driver: 'msnodesqlv8',
//   options: {
//     // trustedConnection: true,
//     trustServerCertificate: true,
//   },
// }

const config = {
  server: 'localhost\\SQLEXPRESS',
  database: 'IVEproject',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
}

// Config multer, this module is used to handle file uploads
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.use(cors())
app.use(express.json())

app.get('/items', async (req, res) => {
  try {
    await sql.connect(config)
    const result = await sql.query(
      `SELECT *
       FROM Equipments
       `
    )
    res.json(result.recordset)
  } catch (err) {
    console.error('SQL error:', err)
    res.status(500).send('Database connection error')
  }
})

app.post(
  '/items',
  upload.fields([{ name: 'img' }, { name: 'qr' }]),
  async (req, res) => {
    // use req.body get form data
    const { name, statement, description } = req.body
    // use req.files get uploaded files
    const img = req.files['img'] ? req.files['img'][0] : null
    const qr = req.files['qr'] ? req.files['qr'][0] : null

    // debug info
    console.log({ name, statement, description, img, qr })

    try {
      await sql.connect(config)

      // if img or qr is null, use default image
      const imgPath = img ? `/${img.originalname}` : '/MicrosoftHololens2.jpg'
      const qrPath = qr ? `/${qr.originalname}` : '/sampleQr.jpg'

      await sql.query`INSERT INTO [dbo].[Equipments]
           ([name]
           ,[Borrowed]
           ,[statement]
           ,[description]
           ,[img]
           ,[qr])
     VALUES
           (${name}
           ,0
           ,${statement}
           ,${description}
           ,${imgPath}
           ,${qrPath})`
      res.sendStatus(200)
    } catch (err) {
      console.error(err)
      res.status(500).send('Failed to add equipment')
    }
  }
)

app.get('/login', async (req, res) => {
  try {
    await sql.connect(config)
    const result = await sql.query(`SELECT * FROM Users`)
    res.json(result.recordset)
  } catch (err) {
    console.error('SQL error:', err)
    res.status(500).send('Database connection error')
  }
})
// borrow an item (set Borrowed = 1)
app.post('/items/:id/borrow', async (req, res) => {
  const { id } = req.params
  try {
    await sql.connect(config)
    await sql.query`UPDATE Equipments SET Borrowed = 1 WHERE id = ${id}`
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.status(500).send('Could not borrow item')
  }
})

// return an item (set Borrowed = 0)
app.post('/items/:id/return', async (req, res) => {
  const { id } = req.params
  try {
    await sql.connect(config)
    await sql.query`UPDATE Equipments SET Borrowed = 0 WHERE id = ${id}`
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.status(500).send('Could not return item')
  }
})
// login
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    await sql.connect(config)
    const result = await sql.query`
      SELECT *
      FROM Users
      WHERE Email = ${email}
    `
    console.log(result)
    let user = result.recordset[0]

    if (!user) {
      return res.status(404).send(
        JSON.stringify({
          message: 'NO_USER',
        })
      )
    }
    // transfer to string
    const isPasswordValid = await bcrypt.compare(
      String(password),
      String(user.password)
    )
    if (!isPasswordValid) {
      // wrong password
      console.log(user.password, password)
      return res.status(401).send(
        JSON.stringify({
          message: 'BAD_PASSWORD',
        })
      )
    }
    // success
    // remove password from user object
    delete user.password
    res.send(
      JSON.stringify({
        message: 'OK',
        data: user,
      })
    )
  } catch (err) {
    console.error(err)
    res.status(500).send(
      JSON.stringify({
        message: 'SERVER_ERROR',
        data: err,
      })
    )
  }
})

// register
app.post('/register', async (req, res) => {
  console.log(req.body.name)
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  if (!name || !email || !password) {
    return res.status(400).send(
      JSON.stringify({
        message: 'Name, email, and password are required.',
      })
    )
  }

  try {
    await sql.connect(config)
    // check if mail exists
    const checkEmailResult = await sql.query`
      SELECT *
      FROM Users
      WHERE Email = ${email}
    `
    if (checkEmailResult.recordset.length > 0) {
      return res.status(409).send(
        JSON.stringify({
          message: 'Email already exists.',
        })
      )
    }

    // use bcrypt encrypt password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // generate username: lowercase name, remove spaces, add random number
    const username =
      name.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random() * 10000)
    const admin = 0 // admin default is 0

    // insert new user into database
    await sql.query`
      INSERT INTO [dbo].[Users] ([name], [email], [username], [admin], [password])
      VALUES (${name}, ${email}, ${username}, ${admin}, ${hashedPassword})
    `

    res.send(
      JSON.stringify({
        message: 'User registered successfully.',
      })
    )
  } catch (err) {
    console.error('Error registering user:', err)
    res.status(500).send(
      JSON.stringify({
        message: 'SERVER_ERROR',
        data: err,
      })
    )
  }
})

app.listen(3001, () => console.log('Server running at http://localhost:3001'))
