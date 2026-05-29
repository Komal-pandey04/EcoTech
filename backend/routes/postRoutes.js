const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");

// Create post with userId
router.post("/", async (req, res) => {
  try {
    const { userId, username, caption, image, tag } = req.body;

    if (!userId || !username || !caption || !image) {
      return res.status(400).json({
        message: "userId, username, caption, and image are required"
      });
    }

    let finalImageURL = image;

    const hasCloudinaryConfig =
      process.env.CLOUD_NAME &&
      process.env.API_KEY &&
      process.env.API_SECRET;

    // If Cloudinary is configured, store optimized hosted URL
    if (hasCloudinaryConfig) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        finalImageURL = uploadResponse.secure_url;
      } catch (uploadError) {
        // Fallback if Cloudinary fails
        finalImageURL = image;
      }
    }

    const newPost = new Post({
      userId,
      username,
      caption,
      imageURL: finalImageURL,
      tag,
      createdAt: new Date()
    });

    await newPost.save();

    res.status(201).json(newPost);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all posts sorted by date
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get posts filtered by tag
router.get("/tag/:tag", async (req, res) => {
  try {
    const { tag } = req.params;

    const posts = await Post.find({ tag: { $regex: tag, $options: "i" } })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's posts
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like post
router.post("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.likes += 1;
    await post.save();

    res.json(post);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted", post });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;