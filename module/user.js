const client = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function productVeiw(req, res) {
  const searchIteam = req.query.searchIteam;
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;

  let query = `select * from product`;
  if (searchIteam) {
    query += ` WHERE product_name ILIKE '%${searchIteam}%'`;
  }
  query += ` LIMIT ${limit} OFFSET ${offset}`;
  const result = await client.query(query);
  res.send(result.rows);
}

async function productVeiwId(req, res) {
  let id = req.params.id;
  const result = await client.query(`SELECT * FROM product WHERE id=${id}`);
  res.send(result.rows);
}

async function register(req, res) {
  const { name, username, password, phone } = req.body;
  try {
    const hash = bcrypt.hashSync(password, 10);
    const users = await client.query("select * from users");
    const findUser = users.rows.find((el) => el.username === username);

    if (findUser) {
      res.send({
        success: false,
        product: "The username is exist, Please try again",
      });
    } else {
      const result =
        await client.query(`INSERT INTO users (name, username,password, phone) 
            VALUES ('${name}', '${username}', '${hash}', '${phone}') RETURNING *`);
      res.send({
        success: true,
        product: result.rows[0],
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  const users = await client.query(
    `select * from users where username='${username}'`
  );
  if (users.rows.length === 0) {
    res.send({
      success: false,
      msg: "Not found, try again",
    });
  } else {
    let user = users.rows[0];
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (comparePassword) {
      let token = jwt.sign(user, process.env.TOKEN);
      res.send({
        success: true,
        token,
        user,
      });
    } else {
      res.send({
        success: false,
        msg: "the username of password is incorrect!",
      });
    }
  }
}

async function addOrder(req, res) {
  try {
    const { productId, userId, address } = req.body;

    const product = await client.query(
      `SELECT * FROM product WHERE id=${productId}`
    );
    const user = await client.query(`SELECT * FROM users WHERE id=${userId}`);

    if (!user || !product || !address) {
      return res.status(400).send({
        error: "userId, productId, quantity, and address are required.",
      });
    }

    const orderDate = new Date();
    const formattedOrderDate = orderDate.toISOString().split('T')[0];

    const result = await client.query(`
    INSERT INTO orders (item, userid, address, order_date, status)
    VALUES ($1::jsonb, $2, $3, $4, $5)
    RETURNING *`,
    [product.rows[0], userId, address, formattedOrderDate, 'pending']
);

    res.send({
      success: true,
      order: result.rows,
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  productVeiw,
  productVeiwId,
  addOrder,
  register,
  login,
};
