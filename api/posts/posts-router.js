// implement your posts router here
const express = require('express');
const Posts = require('./posts-model')
const router = express.Router();

router.get('/', (_, res) => {
  Posts.find()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "The posts information could not be retrieved" })
    })
});

router.get('/:id', (req, res) => {
  Posts.findById(req.params.id)
    .then(result => {
      if (result) {
        res.status(200).json(result)
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist" })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "The post information could not be retrieved" })
    })
});

router.post('/', (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({ message: "Please provide title and contents for the post" })
    return;
  }

  Posts.insert(req.body)
    .then(result => {
      //console.log(result)
      return Posts.findById(result.id)
    })
    .then(post => {
      //console.log(post)
      res.status(201).json(post)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "There was an error while saving the post to the database" })
    })
});

router.put('/:id', async (req, res) => {
  const { title, contents } = req.body;
  const { id } = req.params;
  try {
    if (!title || !contents) {
      res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
      const updatedCount = await Posts.update(id, req.body)
      if (updatedCount > 0) {
        const updatedPost = await Posts.findById(id)
        res.status(200).json(updatedPost)
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist" })
      }
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "The post information could not be modified" })
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Posts.findById(id);
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist" })
    } else {
      await Posts.remove(id)
      res.status(200).json(post)
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "The post could not be removed" })
  }
  
});

router.get('/:id/comments', async (req, res) => {
  const { id } = req.params
  try {
    const post = await Posts.findById(id)
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist" })
    } else {
      const comments = await Posts.findPostComments(id)
      res.status(200).json(comments)
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "The comments information could not be retrieved" })
  }
})

module.exports = router;