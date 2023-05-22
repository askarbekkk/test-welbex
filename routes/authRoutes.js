const Router = require("express")
const router = new Router()
const controller = require("../controllers/authController")
const {check} = require("express-validator")
const authMiddleware = require("../middleware/authMiddleware")
router.post('/auth/registration',[
    check("username", "username can not be empty!").notEmpty(),
    check("password", "password length must be from 4 to 10").isLength({min:4, max:10})
], controller.registration)
router.post('/auth/login', controller.login)
router.post('/createPost', authMiddleware,  controller.createPost)
router.put('/updatePost/:postId', authMiddleware, controller.updatePost)
router.delete('/deletePost/:postId', authMiddleware, controller.deletePost)
router.get('/users/:userId/posts', authMiddleware, controller.getPosts)

module.exports = router