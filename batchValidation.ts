require("dotenv").config();
const mysql = require("mysql");
const axios = require("axios").default;

axios.defaults.validateStatus = function (status: number) {
  return status === 400; // Ignore axios error if status code is 400
};

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
const url = "http://localhost:3000/passwords";

connection.query(
  "SELECT * FROM passwords",
  async function (error: any, results: any, fields: any) {
    if (error) throw error;
    for (let i = 0; i < results.length; i++) {
      let password = results[i].password;
      await sendPostRequest(password);
    }
    connection.end();
  }
);

const sendPostRequest = async (password: string) => {
  try {
    const resp = await axios.post(url, { password });
    if (resp.status === 204) {
      console.log(`${password} is valid`);
      connection.query("UPDATE passwords SET valid = 1 WHERE password = ?", [
        password,
      ]);
    } else {
      console.log(`${password} is invalid...`);
      console.table(resp.data);

      connection.query("UPDATE passwords SET valid = 0 WHERE password = ?", [
        password,
      ]);
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
};
