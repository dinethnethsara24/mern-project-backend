import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import orderRouter from './routes/orderRouter.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';




mongoose.connect("mongodb+srv://dinethnethsara24_db_user:d8Dzx4kff77TmuQ6@cluster.92jpqvt.mongodb.net/?appName=Cluster")
.then(()=>{
    console.log("Conneted to the database");
    }
).catch(() => {
    console.log("Database Connection failed");
});


const app = express();

app.use((req, res, next) => {
  res.setHeader(
    "Cross-Origin-Opener-Policy",
    "same-origin-allow-popups"
  );
  next();
});

app.use(bodyParser.json());
app.use(cors());

app.use( (req, res, next)=>{

        const tokenString = req.header("Authorization");

        if(tokenString != null){ 
            const token =tokenString.replace("Bearer ", "")
            

            jwt.verify(token, "secretkey", (err, decoded)=>{

                    if(decoded != null){
                        req.user = decoded
                        next()

                    }else{
                        console.log("Invalid Token")

                        res.status(403).json({
                            message : "Unauthorized Access"
                        })
                    }
                }
            )


        }        else{
            next()
        }
    }
)

app.use('/api/product', productRouter)
app.use('/api/user', userRouter)
app.use('/api/order', orderRouter)

app.listen(3000,
    ()=>{
    console.log('Server is running on port 3000');
    }
);

