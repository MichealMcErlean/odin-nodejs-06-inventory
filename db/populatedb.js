require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function loadFile(relativePath) {
  const absolutePath = path.join(__dirname, relativePath);

  return fs.readFileSync(absolutePath, 'utf8');
}

const schema = loadFile('schema.sql');

async function main() {
  console.log('Seeding...');
  console.log(process.env.DATABASE_URI_PROD);
  const client = new Client({
    connectionString: process.env.DATABASE_URI_PROD,
    ssl: {rejectUnauthorized: false}
  });

  try {
    await client.connect();
    await client.query(schema);
    console.log('Done');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await client.end();
  }
}

main();