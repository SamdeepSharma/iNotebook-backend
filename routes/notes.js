const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');

//ROUTE:1 GET all notes using /api/notes/fetchnotes, login required
router.get('/fetchnotes', fetchuser, async (req, res) => {
     try {
          const notes = await Note.find({ user: req.user.id })
          res.json(notes)
     }
     catch (error) {
          console.log(error.message)
          res.status(500).send("Internal Server Error")
     }
})

//ROUTE:2 add notes using /api/note/addnote, login required
router.post('/addnote', fetchuser, [
     body('title', 'Enter a valid title').isLength({ min: 3 }),
     body('description', 'Enter a valid description').isLength({ min: 5 }),
], async (req, res) => {
     try {
          const {title, description, tag} = req.body;
           //If there are errors, return bad request
           const result = validationResult(req);
           if (!result.isEmpty()) {
                return res.json({ errors: result.array() });
           }
           const note = new Note({
               title, description, tag, user: req.user.id
           })

           const savednote = await note.save()
           res.json(savednote)
     }
     catch (error) {
          console.log(error.message)
          res.status(500).send("Internal Server Error")
     }
})

module.exports = router