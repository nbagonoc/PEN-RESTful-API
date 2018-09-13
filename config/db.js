const { Client } = require("pg");
const connectionString = require("./dbSecretKeys").postgresURI;

const client = new Client({
  connectionString
});

client.connect();

module.exports = client;
