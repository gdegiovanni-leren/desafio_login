import { Router } from 'express'
import UserModel from "../DAO/dbmanagers/models/user.model.js"


const router = Router()


router.post('/login', async(req,res) => {
    const { email, password } = req.body

    try{

    const user = await UserModel.findOne({ email, password })


    //console.log('user found?', user)

    if(!user) return res.status(404).send('User not found')

    const userData = {
        'first_name' : user.first_name,
        'last_name' : user.last_name,
        'age' : user.age,
        'email' : user.email,
        'role' : user.role
    }

    req.session.user = userData

    return res.redirect('/')

    }catch(e){
        console.log(e)

    }
    return res.status(500).send('Internal Error')
})


router.post('/register', async (req, res) => {

    let user = req.body

    if(!user.first_name || !user.last_name || !user.age || !user.email || !user.password ){
        return res.status(404).send('Error creating User. Some fields are required')
    }

    if(user.email === 'adminCoder@coder.com'  && user.password === 'adminCod3r123' ){
        user.role = 'admin'
    }else{
        user.role = 'usuario'
    }

    await UserModel.create(user)

    return res.redirect('/')
})


router.get('/logout', (req,res) => {
    req.session.destroy(err => {
        if(err) res.status(404).send('logout error')

        return res.redirect('/login')
    })
})

export default router
