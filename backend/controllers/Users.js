import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
 
export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['id','name','email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const Admin = async(req, res) => {
    
    const password = 'admin123';
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {

        const admin = await Users.create({
            name: 'super admin',
            email: 'admin@admin.com',
            role: 'admin',
            password: hashPassword
        });
        
        res.json({
            email:admin.email,
            password:'admin123'
        });

    } catch (error) {
        console.log(error);
    }
}

export const CreateUser = async(req, res) => {
    
    const { name, email, password, confPassword } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    //const hashPassword = bcrypt.hashSync(password, 8)

    try {
        await Users.create({
            name: name,
            email: email,
            role: 'admin',
            password: hashPassword
        });

        res.json({msg: "Registration Successful"});

    } catch (error) {
        console.log(error);
    }
}
 
export const Register = async(req, res) => {
    const { name, email, password, confPassword } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    //const hashPassword = bcrypt.hashSync(password, 8)

    try {
        await Users.create({
            name: name,
            email: email,
            role: 'user',
            password: hashPassword
        });

        res.json({msg: "Registration Successful"});

    } catch (error) {
        console.log(error);
    }
}
 
export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });

        const match = await bcrypt.compare(req.body.password, user[0].password);

        //const match = req.body.password == user[0].password ? true : false;

        if(!match) return res.status(400).json({msg: "Wrong Password"});

        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;

        const userD ={
              id:user[0].id,
              name:user[0].name,
              email:user[0].email
        }

        const accessToken = jwt.sign({userId}, 'book',{
            expiresIn: 86400
        });

        const refreshToken = jwt.sign({userId}, 'book',{
            expiresIn: 86400
        });

        await Users.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });

        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ token:accessToken ,user:userD});

    } catch (error) {
        res.status(404).json({msg:"Email not found"});
    }
}
 
export const Logout = async(req, res) => {

    // const userId = req.body.id;

    // await Users.update({refresh_token: null},{
    //     where:{
    //         id: userId
    //     }
    // });

    // res.clearCookie('refreshToken');
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null},{
        where:{
            id: userId
        }
    });

    res.clearCookie('refreshToken');
    return res.sendStatus(200);

   return res.status(200).json({msg: "User Logout"});
}

export const User = async(req, res) => {

    try {

        const user = await Users.findAll({
            where:{
                refresh_token: req.body.token
            }
        });

        res.json({
           id:user[0].id,
           name:user[0].name,
           email:user[0].email,
           role:user[0].role
        });

    } catch (error) {

        console.log(error);

    }
}
 
export const UpdateUser = async(req, res) => {
    try {

        await Users.update({
            name: req.body.name,
            email: req.body.email,
            password:  req.body.password,
        },{
            where:{
                id:req.body.id
            }
        });

        return res.status(200).json({msg: "User Updated"});

    } catch (error) {
           res.status(404).json({msg:"Fail to Update"});
    }
}
 
export const DeleteUser = async(req, res) => {
    try {
        const book = await Users.findAll({
            where:{
                id: req.body.id
            }
        }); 

        const deleted = await Users.destroy({
            where:{
                id: book[0].id
            }
        });
    
        return res.sendStatus(200);

    } catch (error) {
        res.status(404).json({msg:"Fail to Delete"});
    }

}