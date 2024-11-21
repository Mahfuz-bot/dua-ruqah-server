// server.js
import express from "express"
import Database from "better-sqlite3"
import cors from "cors"
import { getCategoriesWithDetails } from "./data.js"

const app = express()
const PORT = process.env.PORT || 3001

const db = new Database("./dua_main.sqlite", { verbose: console.log })

app.use(
  cors({
    origin: "*",
  })
)

app.get("/categories", async (req, res) => {
  try {
    const categories = await getCategoriesWithDetails(db)
    res.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    res.status(500).json({ error: "Failed to fetch categories" })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
