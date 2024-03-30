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
          const { title, description, tag } = req.body;
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

//ROUTE:3 update notes using /api/note/updatenote, login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
     try {
          const { title, description, tag } = req.body;
          //Create a newNote object
          const newNote = {}
          if (title) { newNote.title = title }
          if (description) { newNote.description = description }
          if (tag) { newNote.tag = tag }

          //find the note to be updated and update it
          let note = await Note.findById(req.params.id)
          if (!note) { return res.status(404).send("Not Found") }

          //verifying that the user is trying to update their notes only after logging in to their account
          if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed") }

          //updating the particular note
          note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
          res.json({ note })
     }
     catch (error) {
          console.log(error.message)
          res.status(500).send("Internal Server Error")
     }
})

//ROUTE:4 delete notes using /api/note/deletenote, login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
     try {
          //find the note to be deleted and delete it
          let note = await Note.findById(req.params.id)
          if (!note) { return res.status(404).send("Not Found") }

          //verifying that the user is trying to delete their notes only after logging in to their account
          if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed") }

          //deleting the particular note
          note = await Note.findByIdAndDelete(req.params.id)
          res.json({ "Success": "the note has been deleted", "id": req.user.id })
     }
     catch (error) {
          console.log(error.message)
          res.status(500).send("Internal Server Error")
     }
})
module.exports = router