import express from "express";
import pg from "pg";
import bodyParser from "body-parser";

const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database: "World",
    password:"rtsr2220",
    port :"5432",
})
db.connect()
.then(()=>console.log(`server connected to database World`))
.catch((err)=>console.log(`Something went wrong can't connect to World`));

// creating an function to load From DB
let quiz =[];
async function loadQuiz(){
    try {
        const res = await db.query("SELECT * FROM quiz");
        quiz = res.rows;
        console.log("Quiz questions loaded");
    }catch (err){
        console.error("Error executing query", err.stack);
    }
}

//Calling function loadquiz to load Quiz locally

loadQuiz();

//creating express app

const app = express();
const port = 3000;

//initiating body parser aka middleware

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

//ejs renderring
app.set("view engine", "ejs");

let currentQuestion;
let totalCorrect = 0;

// Homepage GET Route
app.get ("/",async (req,res)=>{
    totalCorrect = 0;
    await nextQuestion();
    console.log(currentQuestion);
    res.render("index.ejs",{ question : currentQuestion})
})

//POST routr for submit
app.post("/submit",(req,res)=>{
 let answer = req.body.answer.trim();
 let isCorrect = false ;
 if (currentQuestion.quiz_answer.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }


    nextQuestion();
    res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
    });
});

async function nextQuestion() {
const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
currentQuestion = randomCountry;
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });