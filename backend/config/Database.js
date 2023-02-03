import { Sequelize } from "sequelize";
 
const db = new Sequelize('book', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});
 
export default db;