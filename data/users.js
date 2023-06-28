import bcrypt from "bcryptjs"

const users =[
    {
        name: "Admin",
        email: "sa@gmail.com",
        password:bcrypt.hashSync("123456",10),
        isAdmin:true,
    },
    {
        name: "User",
        email: "user@gmail.com",
        password:bcrypt.hashSync("123456",10),
    },
    {
        name: "Le Dat",
        email: "dinhdat.le.2000@gmail.com",
        password:bcrypt.hashSync("123456",10),
    }
]

export default users;