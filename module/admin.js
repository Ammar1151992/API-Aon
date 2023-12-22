const client = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res){
    const { name, department, username, password } = req.body;
    try {
        const hash = bcrypt.hashSync(password, 10);
        const adminData = await client.query("select * from dash_admin");
        console.log(adminData.rows);
        const findUser = adminData.rows.find(el => el.username === username);

        if(findUser){
            res.send({
                success: false,
                product: "The username is exist, Please try again"
            })
        }else{
            const result = await client.query(`INSERT INTO dash_admin (name, department, username,password) 
            VALUES ('${name}', '${department}', '${username}', '${hash}') RETURNING *`);
            console.log(result.rows);
            res.send({
                success: true,
                product: result.rows[0]
            })
        }     
    } catch (error) {
        console.log(error);
    }
    
}

async function login(req, res){
    const {username, password} = req.body;

    const adminData = await client.query(`select * from dash_admin where username='${username}'`);
    if(adminData.rows.length === 0){
        res.send({
            success: false,
            msg: "Not found, try again"
        })        
    }else{
        let user = adminData.rows[0]
        let comparePassword = bcrypt.compareSync(password, user.password);
        if(comparePassword){
            let token = jwt.sign(user, process.env.TOKEN)
            res.send({
                success: true,
                token,
                user
            })  
        }else{
            res.send({
                success: false,
                msg: "the username of password is incorrect!"
            })  
        }

    }
}


module.exports = {
    register,
    login
}