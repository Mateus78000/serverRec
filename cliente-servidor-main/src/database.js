const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

let instance = null

// verifica se já existe banco de dados, se sim, retorna a instancia, se não, cria um banco de dados 
async function getDatabaseInstance() {
  if (instance)
    return instance

    // cria o arquivo do banco de dados
  const database = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database
  })

  
  await database.exec(`
    CREATE TABLE IF NOT EXISTS movies  (
      id           INTEGER PRIMARY KEY   AUTOINCREMENT ,
      title        TEXT                  NOT NULL      ,
      source       TEXT                  NOT NULL      ,
      description  TEXT                                ,
      thumb        TEXT
    );
  `)

  instance = database

  return database
}

module.exports = { getDatabaseInstance }