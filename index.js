const express = require('express')
const app = express()
const port = 3000
const zod = require("zod")
const schema = zod.array(zod.number());
app.use(express.json());
app. post("/health-checkup", function (req, res) {
    // kidneys = [1, 2]
    const kidneys = req.body.kidneys;
    const response = schema.safeParse(kidneys)
    res.send({
    response
    })
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/:name', (req, res) => {
  let name=req.params.name
  res.send('Hello World!'+name)
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})