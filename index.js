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

const adminRoutes = require('./router/admin.router')
const userRoutes = require('./router/user.router')
const fastcallRoutes = require('./router/fastcall.router')
const raportRoutes = require('./router/raport.router')
const msgRoutes = require('./router/msg.router')


app.use('/api/admin',adminRoutes)
app.use('/api/user',userRoutes)
app.use('/api/fastcall',fastcallRoutes)
app.use('/api/raport',raportRoutes)
app.use('/api/msg',msgRoutes)
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




const port = process.env.PORT || 7000

server.listen(port,()=>{
    console.log(`lisiting on port ${port}`);
    // console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
})