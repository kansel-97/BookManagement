import Books from "../models/BooksModel.js";
 
export const AllBooks = async(req, res) => {
    try {
        const books = await Books.findAll({
            attributes:['id','title','authour','published','link','likes']
        });

        res.json(books);

    } catch (error) {
        console.log(error);
    }
}

export const CreateBook = async(req, res) => {
    
    const { title, authour, published, link } = req.body;

    try {
        await Books.create({
            title: title,
            authour: authour,
            published: published,
            link: link,
            likes: 0
        });
        res.json({msg: "Book Successful Created"});

    } catch (error) {
        console.log(error);
    }
}
 
export const ViewBook = async(req, res) => {

    try {

        const book = await Books.findAll({
            where:{
                id: req.body.id
            }
        });

        res.json({
           id:book[0].id,
           title:book[0].title,
           authour:book[0].authour,
           published:book[0].published,
           link:book[0].link,
           likes:book[0].likes
        });

    } catch (error) {
        console.log(error);
    }
}
 
export const UpdateBook = async(req, res) => {
    try {

        await Books.update({
            title: req.body.title,
            authour: req.body.authour,
            published:  req.body.published,
        },{
            where:{
                id:req.body.id
            }
        });

        return res.status(200).json({msg: "Book Updated"});

    } catch (error) {
        res.status(404).json({msg:"Fail to Update"});
    }
}
 
export const DeleteBook = async(req, res) => {
    try {
        const book = await Books.findAll({
            where:{
                id: req.body.id
            }
        }); 

        const deleted = await Books.destroy({
            where:{
                id: book[0].id
            }
        });
    
        return res.sendStatus(200);
    } catch (error) {
        res.status(404).json({msg:"Fail to Delete"});
    }

}