const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(
	cors({
		origin: "*", // Allow all origins during development
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type"],
	})
);


const TodoModel = require("./model/Todo");


const connectionString = "mongodb+srv://sarahcancode:todoapp@todoapp.1v26q.mongodb.net/todoDB"
mongoose
.connect(connectionString)
.then(() => {
    console.log("Connected to the database!");
    app.listen(3000, function (){
        console.log("server is running at port 3000");
	})

}).catch((err) => console.log(err));


//CRUD Operations

app.get("/todos", async (req, res) => {
    try {
        const response = await TodoModel.find({})

        res.json(response)

    } catch (err) {
        console.log(err)
    }
});


//Create Method
app.post("/todos", async (req, res) => {
    try {
    console.log(req.body);

    const todo = req.body;

    //add new item to the database
    const newItem = await TodoModel.create(todo);
	
    res.status(200).send("Successful");
	} catch (error) {
	console.log(error);
    res.status(500).send("Server Error!");
	}
});

//Delete Method
app.delete("/todos/:id", async (req,res) => {
    try {
        let id =req.params.id;

        console.log(id)
        const deletedItem = await TodoModel.deleteOne({
            _id: id,
        });

        res.status(200).send("delete Successful")
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});


//PUT Method
app.put("/todos/:id", async (req,res) => {
    try {
        const id = req.params.id;
        console.log(id);

        const {text} = req.body;
     
        const updateOptions = {text: text};
        const updateItem = await TodoModel.findByIdAndUpdate(id, updateOptions);
        
        res.status(200).send("Updated Item")

    } catch (error){
        console.log(error);
        res.status(500).send("Server Error");

    }
})