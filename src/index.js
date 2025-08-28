import dotenv from "dotenv"
import connecDB from './db/index.js';


dotenv.config({
    path: './env'
})

connecDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`); 
    })
})
.catch((err) => {
    console.log("MONGO db connect failed !!! ", err);

})