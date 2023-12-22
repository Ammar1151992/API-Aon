require("dotenv").config();
const {Client} = require("pg")

const client =  new Client({
    connectionString: process.env.DATABASE_CONNECTION,
    ssl: {
        rejectUnauthorized: false,
      },
})

client
    .connect()
    .then(() => console.log("connected"))
    .catch((e) => console.log("Error", e))


module.exports = client;

