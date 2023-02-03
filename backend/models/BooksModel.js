import { Sequelize } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;
 
const Books = db.define('books',{
    title:{
        type: DataTypes.STRING
    },
    authour:{
        type: DataTypes.STRING
    },
    published:{
        type: DataTypes.STRING
    },
    link:{
        type: DataTypes.STRING
    }
    ,
    likes:{
        type: DataTypes.INTEGER
    }
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
 
export default Books;