import express from "express";
import graph from "./ai/graph.ai.js"
const app = express()

app.get("/" , async (req , res)=>{
  const result = await graph("What is the capital of india")
  console.log(result)
  res.status(201).json({
    result
  })
})


export default app