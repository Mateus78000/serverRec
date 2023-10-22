const crypto = require ("crypto")
const express = require("express")
const fs = require("fs")
const { getDatabaseInstance } = require("./database")

const app = express()

app.use(express.static(__dirname + '/../public'))
app.use(express.json()) 

const loginTokens = []

// VERIFICAR LOGIN
function login(req, res, next) {
  const { token } = req.query
  if (loginTokens.includes(token)) {
    next()
    return
  }
  res.status(400).json({ error: true, msg: "Token de acesso inválido!" })
}

// LOGIN
app.get("/login", (req, res) => {
  const { login, senha } = req.query
  if (login == "daniel" && senha == "123123") {
    const hash = crypto.randomBytes(20).toString('hex')
    loginTokens.push(hash)
    console.log(hash)
    res.json({ error: false, token: hash })
    return
  }
  res.status(400).json({ error: true, msg: "Usuário e senha inválidos" })
})

app.post("/movies", async (req, res) => {
  const { title, source, description, thumb } = req.body
  const db = await getDatabaseInstance()
  const result = await db.run(`INSERT INTO movies(title, source, description, thumb) VALUES(?, ?, ?, ?)`, [title, source, description, thumb])
  res.json(result)
})

app.get("/movies", async (req, res) => {
  const { id } = req.query
  const db = await getDatabaseInstance()
  if (id) {
    const result = await db.get(`SELECT * FROM movies WHERE id=?`, id)
    res.json(result)
    return
  }
  const result = await db.all(`SELECT * FROM movies`)
  res.json(result)
})

app.put("/movies", async (req, res) => {
  const { id } = req.query
  const { title, source, description, thumb } = req.body
  const db = await getDatabaseInstance()
  const result = await db.run(
    `UPDATE movies SET title=?, source=?, description=?, thumb=? WHERE id=?`,
    title, source, description, thumb, id
  )
  res.json(result)
})

// ??????? PATCH - 
//obter um array com pares [chave, valor] do objeto req.body. Em seguida, mapear esse array para criar uma string que atualiza cada coluna com o valor fornecido ou mantém o valor original usando a função COALESCE do SQL.

app.patch("/movies", async (req, res) => {
  const { id } = req.query
  const db = await getDatabaseInstance()
  const updates = Object.entries(req.body).map(([key, value]) => `${key} = COALESCE(?, ${key})`).join(", ")
  const values = Object.values(req.body)
  const result = await db.run(
    `UPDATE movies SET ${updates} WHERE id = ?`,
    [...values, id]
  )

//  `UPDATE movies SET title = ?, source = ?, WHERE id = ?`

  res.json(result)
  return 
})


app.delete("/movies", async (req, res) => {
  const { id } = req.query
  const db = await getDatabaseInstance()
  const result = await db.run(`DELETE FROM movies WHERE id=?`, id)
  res.json(result)
})

app.listen(3000, () => console.log("Servidor rodando!"))



