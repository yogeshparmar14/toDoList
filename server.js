const dotenv = require("dotenv");
    dotenv.config();
    const TodoTask = require("./db/models/toDoSchema.js");
const connectDb=require("./db/connectiondb.js");
const express = require("express");
const app = express();
const port = process.env.PORT;
const DATABASE_URL_LOCAL =process.env.DATABASE_URL_LOCAL
const DATABASE_URL_ATLAS =process.env.DATABASE_URL_ATLAS
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")
// app.set("views", "./views")
app.use("/static",express.static("public"));

connectDb(DATABASE_URL_LOCAL, DATABASE_URL_ATLAS);


app.get("/", (req, res) => { 
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks,idTask: id});
    });
    });
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
    });

 app
    .route("/edit/:id")
    .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
    res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
    })
    .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });  
    
    app.route("/remove/:id").get((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
        });
        });
    
app.listen(port, () => console.log("Server Up and running"));