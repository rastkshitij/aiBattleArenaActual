import express from "express";
import graph from "./ai/graph.ai.js"
import cors from "cors";
import morgan from "morgan";
const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(
  cors({
    origin : "http://localhost:5173" ,
    Credential :true
  })
)




app.get("/" , async (req , res)=>{
  const result = await graph("What is the capital of india")
  console.log(result)
  res.status(201).json({
    result
  })
})

app.post("/invoke" , async (req , res)=>{
const { input } = req.body
const  result = await graph(input)
res.status(200).json({
  message :  "Graph executed succesfully" ,
  success : true ,
  result
})
})

export default app