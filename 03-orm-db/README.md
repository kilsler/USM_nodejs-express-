project/
│
├── app.js
├── db.js
│
├── model/
│   ├── User.js
│   └── Post.js
│
├── controller/
│   ├── UserController.js
│   └── PostController.js
│
└── routes/
    ├── UserRouter.js
    └── PostRouter.js
//////////////////// 
db.js — подключение к БД и создание Sequelize
js
Copy code
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("testdb", "root", "password", {
    host: "localhost",
    dialect: "mysql"
});

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("MySQL connected successfully!");
    } catch (e) {
        console.error("DB connection error:", e);
    }
}

connectDB();

module.exports = sequelize;
//////////////////// 
model/User.js
js
Copy code
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

module.exports = User;
📌 model/Post.js
js
Copy code
const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");

const Post = sequelize.define("Post", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

// Связь 1 - M
User.hasMany(Post, { onDelete: "CASCADE" });
Post.belongsTo(User);

module.exports = Post;
//////////////////// 
controller/UserController.js
js
Copy code
const User = require("../model/User");

class UserController {

    async createUser(req, res) {
        try {
            const { name, email } = req.body;
            const user = await User.create({ name, email });
            res.json(user);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async getUsers(req, res) {
        const users = await User.findAll();
        res.json(users);
    }

    async getUser(req, res) {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    }

    async updateUser(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) return res.status(404).json({ message: "User not found" });

            await user.update(req.body);
            res.json(user);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async deleteUser(req, res) {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.destroy();
        res.json({ message: "User deleted successfully" });
    }
}

module.exports = new UserController();
////////////////////  
controller/PostController.js
js
Copy code
const Post = require("../model/Post");

class PostController {

    async createPost(req, res) {
        try {
            const { title, content, userId } = req.body;
            const post = await Post.create({ title, content, UserId: userId });
            res.json(post);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async getPosts(req, res) {
        const posts = await Post.findAll();
        res.json(posts);
    }

    async getPost(req, res) {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
    }

    async updatePost(req, res) {
        try {
            const post = await Post.findByPk(req.params.id);
            if (!post) return res.status(404).json({ message: "Post not found" });

            await post.update(req.body);
            res.json(post);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async deletePost(req, res) {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        await post.destroy();
        res.json({ message: "Post deleted successfully" });
    }
}

module.exports = new PostController();
////////////////////////////////////////  

routes/UserRouter.js
js
Copy code
const Router = require("express");
const router = new Router();
const UserController = require("../controller/UserController");

router.post("/", UserController.createUser);
router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
📌 routes/PostRouter.js
js
Copy code
const Router = require("express");
const router = new Router();
const PostController = require("../controller/PostController");

router.post("/", PostController.createPost);
router.get("/", PostController.getPosts);
router.get("/:id", PostController.getPost);
router.put("/:id", PostController.updatePost);
router.delete("/:id", PostController.deletePost);

module.exports = router;  
////////////////////
app.js
js
Copy code
const express = require("express");
const sequelize = require("./db");

const User = require("./model/User");
const Post = require("./model/Post");

const UserRouter = require("./routes/UserRouter");
const PostRouter = require("./routes/PostRouter");

const app = express();
app.use(express.json());

app.use("/users", UserRouter);
app.use("/posts", PostRouter);

async function start() {
    try {
        await sequelize.sync({ alter: true });
        console.log("Models synchronized!");

        app.listen(3000, () => console.log("Server started on port 3000"));
    } catch (e) {
        console.error(e);
    }
}

start();
