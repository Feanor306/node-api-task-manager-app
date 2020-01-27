const app = require('./app')
const port = process.env.port

app.listen(port, () => {
    console.log("Server started on port " + port)
})