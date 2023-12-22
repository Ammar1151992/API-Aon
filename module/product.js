const client = require("../db");
const {uploadFile} = require("@uploadcare/upload-client")
// fileData must be Blob or File or Buffer

async function productVeiw(req, res) {
    const searchIteam = req.query.searchIteam;
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    let query =`select * from product`;
    if(searchIteam) {
      query += ` WHERE product_name ILIKE '%${searchIteam}%'`
    }
    query += ` LIMIT ${limit} OFFSET ${offset}`;
    const result = await client.query(query)
    res.send(result.rows)
}

async function addProduct(req, res) {
    const {product_name, price, currency, discount_type, discount_value, is_active} =  req.body;
    const image = await uploadFile(req.files.file.data,
        {
          publicKey: process.env.UPLOAD_KEY,
          store: 'auto',
          metadata: {
            subsystem: 'uploader',
            pet: 'cat'
          }
        }
      )

    const result = await client.query(`INSERT INTO product (product_name, price, currency,discount_type, discount_value, image, is_active) 
    VALUES ('${product_name}', ${price}, '${currency}', '${discount_type}', ${discount_value}, '${image.cdnUrl}', ${is_active}) RETURNING *`);
    res.send({
        success: true,
        product: result.rows[0]
    });
}

async function editProduct(req, res) {
    let id = req.params.id;
    const {product_name, price, currency, discount_type, discount_value, is_active} =  req.body;
    const image = await uploadFile(req.files.file.data,
        {
          publicKey: process.env.UPLOAD_KEY,
          store: 'auto',
          metadata: {
            subsystem: 'uploader',
            pet: 'cat'
          }
        }
      )

    const result = await client.query(`update product set 
    product_name='${product_name}',
    price=${price},
    currency='${currency}',
    discount_type='${discount_type}',
    discount_value=${discount_value},
    image='${image.cdnUrl}', 
    is_active=${is_active} 
    where id=${id} RETURNING *`);
    res.send({
        success: true,
        product: result.rows
    });
}

async function deletProduct(req, res) {
    let id = req.params.id;
    const result = await client.query(`delete from product where id=${id} RETURNING *`);
    res.send({
        success: true,
        product: result.rows
    });
}



module.exports = {
    productVeiw,
    addProduct,
    editProduct,
    deletProduct
}

