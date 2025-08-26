import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import foodRouter from './routes/foodRoute.js'
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

//app config
const app = express()
const port = process.env.PORT || 4000

// middleware
app.use(express.json())

// Enable CORS for all routes
app.use(cors())

// Additional headers for CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://food-delivery-website-kappa-three.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

//db connection
connectDB();

// Debug environment variables
console.log('JWT_SECRET is set:', !!process.env.JWT_SECRET);

// api endpoints
app.use("/api/food",foodRouter)
app.use("/uploads",express.static('uploads'))
app.use('/api/user', userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get("/",(req,res)=>{
        res.send("API working")
})

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
})

