const client = require("../db");


async function orderVeiw(req, res) {
    const result = await client.query("select * from orders");
    res.send(result.rows)
}

async function editOrder(req, res) {
    let id = req.params.id;
    const status = req.body.status;

    if(status === "pending" ||  status === "preparing" || status === "delivered"){
        const result = await client.query(`update orders set status='${status}' where id=${id} RETURNING *`);
        res.send({
            success: true,
            product: result.rows
        });
    }else{
        return res.send({
            success: false,
            product: "The status type is not found"
        });
    }
   
}



module.exports = {
    orderVeiw,
    editOrder
}
