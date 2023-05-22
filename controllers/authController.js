const User = require("../models/Users")
const Post = require("../models/Posts")
const bcrypt = require("bcrypt")
const {validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")
const {secret} = require("./config")

const generateAccessToken = (id) => {
    const payload = {
        id
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Registration error", errors})
            }
            const {username, password} = req.body
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: "User with such username is already exists"})
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const user = new User({username, password: hashPassword})
            const token = generateAccessToken(user._id)

            await user.save()
            return res.json({token})

        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Registration error"})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: `user ${username} is not found`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: "Incorrect password"})

            }
            const token = generateAccessToken(user._id)
            return res.json({token})


        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Login error"})

        }
    }

    async createPost(req, res) {
        try {
            console.log(req.user)


            const post = new Post({
                ...req.body,
                author: req.user.id,

            })
            await post.save()
            return res.status(201).json({message: 'Post created successfully'});


        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Server error'});
        }
    }

    async updatePost(req, res) {
        try {
            const {postId} = req.params;
            const {title, content} = req.body;
            console.log(postId, req.user.id)
            const blogPost = await Post.findById(postId);

            if (!blogPost) {
                return res.status(404).json({ message: 'Blog post not found' });
            }
            if (blogPost.author.toString() !== req.user.id) {
                return res.status(403).json({ message: 'You are not authorized to update this blog post' });
            }

            blogPost.title = title;
            blogPost.content = content;
            const updatedPost = await blogPost.save();

            res.json({ message: 'Blog post updated successfully', post: updatedPost });

        } catch (e) {
            console.log(e)
            return res.status(500).json({message: 'Error updating blog post'});
        }

    }
    async deletePost(req, res){

        try{
            const {postId} = req.params
            console.log(req.params, req.user)

            const deletedPost = await Post.findOneAndDelete({
                _id: postId,
                author: req.user.id
            });
            if (!deletedPost) {
                return res.status(404).json({ message: 'Blog post not found or you are not authorized to delete it' });
            }


            return  res.json({ message: 'Blog post deleted successfully' });

        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: 'Error deleting blog post' });

        }
    }

    async getPosts(req, res) {
        try {

            const {userId} = req.params
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 20
            const skip = (page - 1) * limit
            const posts = await Post.find({author: userId}).populate("author").skip(skip).limit(limit)
            const totalCount = await Post.countDocuments({author: userId})
            const totalPages = Math.ceil(totalCount / limit);


            return res.status(200).send({
                data: posts,
                currentPage: page,
                totalPages: totalPages,
                totalBlogs: totalCount,
                postsPerPage: limit

            })

        } catch (e) {
            console.error(e)
            res.status(500).json({message: 'Server error'});
        }
    }

}

module.exports = new authController()