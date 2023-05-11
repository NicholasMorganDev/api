import { hashSync } from 'bcrypt';
import { db } from "./dbConnect.js";
import { salt, secretKey } from "../secrets.js";
import jwt from "jsonwebtoken";

export async function login(req, res) {
  const { email, password } = req.body
  if(!email || !password) {
    res.status(400).send({message: 'Email and password both required'})
    return
  }
  const hashedPassword = hashSync(password, salt)
  const usersResults = await db.collection('users')
    .where("email", "==", email.toLowerCase())
    .where("password", "==", hashedPassword)
    .get()
  let user = usersResults.docs.map(doc => ({ id: doc, ...doc.data() }))[0]
  if(!user){
    res.status(401).send({message: "Invalid email or password."})
    return
  }
  delete user.password
  const token = jwt.sign(user, secretKey)
  res.send({ user, token })
}

export async function signup(req, res) {
  const { email, password } = req.body
  if(!email || !password) {
    res.status(400).send({message: 'Email and password both required'})
    return
  }
  const check = await db.collection('users').where("email", "==", email.toLowerCase()).get()
  if(check.exists) {
    res.status(401).send({message: 'Email already in use, please try logging in instead.'})
    return
  }
  const hashedPassword = hashSync(password, salt)
  await db.collection('users').add({email: email.toLowerCase(), password: hashedPassword })
  login(req, res)
}


