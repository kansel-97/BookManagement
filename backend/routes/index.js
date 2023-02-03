import express from "express";
import { getUsers,UpdateUser,Admin,User,DeleteUser, Register,CreateUser, Login, Logout} from "../controllers/Users.js";
import { AllBooks, CreateBook,UpdateBook, ViewBook, DeleteBook} from "../controllers/Books.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
 
const router = express.Router();
 
//users
router.get('/users', verifyToken, getUsers);
router.post('/user', verifyToken, User);
router.post('/register', Register);
router.post('/createUser',verifyToken, CreateUser);
router.post('/updateUser',verifyToken, UpdateUser);
router.delete('/deleteUser',verifyToken, DeleteUser);
router.post('/login', Login);
router.get('/token', refreshToken);
router.get('/admin', Admin);
router.delete('/logout', Logout);

//books
router.get('/books', verifyToken, AllBooks);
router.post('/createBook',verifyToken, CreateBook);
router.post('/updateBook',verifyToken, UpdateBook);
router.post('/viewBook/',verifyToken, ViewBook);
router.delete('/deleteBook',verifyToken, DeleteBook);
 
export default router;