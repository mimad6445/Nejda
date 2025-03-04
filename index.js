const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")
const connectDB = require('./connection/Connectdb')
const httpStatusText = require('./utils/httpStatusText')
const http = require("http")
const { Server } = require("socket.io");

// init server ws+http
const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {},
});


//Requirement
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
connectDB()



app.use('/uploads',express.static(path.join(__dirname,'uploads')))

//Handling Routes Error
app.all('*',(req,res,next)=>{
    res.status(400).json({status : httpStatusText.ERROR , msg : "endpoint found data"});
})

app.set('socketio', io);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});




const port = process.env.PORT || 5000

server.listen(port,()=>{
    console.log(`lisiting on port ${port}`);
    console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
})