import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export function getUser(req, res) {
    User.find().then((data) =>{
        res.json(data)
        
    });
}

export function createUser(req, res) {

    if(req.body.user == "admin"){

        if(req.user != null){

            if(req.user.role != "admin"){
                 res.status(403).json({
                    message: "Only admin can create another admin user"
                })

                return;
            }    

        }else{

            res.status(403).json({
                message : "You are not authorized to create admin user"
            })

            return;


        }
    }


    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashedPassword,
    role: req.body.role,
    isBlocked: req.body.isBlocked
});

user.save().then(
    
    () => {
        res.json({
            message: "User created successfully"
        })
    }
    
).catch(
    
    () => {
        res.json({
            message: "User creation failed"
        })
    }
)
}

export function loginUser(req, res) {

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email : email}).then(

        (user) => {
            if(user == null) {
                res.status(404).json({
                    message : "User not found"
                });
            } else {

                const isPasswordCorrect = bcrypt.compareSync(password, user.password);

                if(isPasswordCorrect) {

                    const token = jwt.sign(
                        {
                            email : user.email,
                            firstName : user.firstName,
                            lastName : user.lastName,
                            role : user.role,
                            img : user.img
                        },

                        "secretkey"  //password to encrypt the JWTtoken
                    )    

                    res.status(200).json({
                        message : "Login successful",
                        token : token,
                        role : user.role
                    });

                } else {

                    res.status(401).json({
                        message : "Invalid password"
                    });
                }
            }

        } 
    )
}

export function isAdmin(req){

    if(req.user == null){
        return false;
    }
    if(req.user.role != "admin"){
        return false;
    }

    return true;
    
}
