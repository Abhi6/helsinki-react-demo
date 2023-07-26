import { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import noteService from './services/notes'

const App = () => {
	const [notes, setNotes] = useState([])
	const [newNote, setNewNote] = useState(' a new note...')
	const [showAll, setShowAll] = useState(true)
	const [errorMessage, setErrorMessage] = useState(null)

	useEffect(() => {
		noteService
			.getAll()
			.then(response => {
				setNotes(response.data)
			})
	}, [])

	const addNote = (event) => {
		event.preventDefault()
		const noteObject = {
			content: newNote,
			important: Math.random() < 0.5,
			id: notes.length + 1,
		}
		noteService
			.create(noteObject)
			.then(response => {
				setNotes(notes.concat(response.data))
				setNewNote('')
			})
	}

	const handleNoteChange = (event) => {
		console.log(event.target.value)
		setNewNote(event.target.value)
	}

	const toggleImportanceOf = (id) => {
		const note = notes.find(n => n.id === id)
		const changedNote = { ...note, important: !note.important}

		noteService
			.update(id, changedNote)
			.then(response => {
				setNotes(notes.map(n => n.id !== id ? n : response.data))
			})
			.catch(error => {
				setErrorMessage(
					`Note '${note.content}' was already removed from server`
				)
				setTimeout(() => {
					setErrorMessage(null)
				}, 5000)
				setNotes(notes.filter(n => n.id !== id))
			})
	}

	const notesToShow = showAll ? notes : notes.filter(note => note.important === true)

	return (
		<div>
			<h1>Notes</h1>
			<Notification message={errorMessage} />
			<div>
				<button onClick={() => setShowAll(!showAll)}>
					show {showAll ? 'important' : 'all'}
				</button>
			</div>
			<ul>
				{notesToShow.map(note => <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />)}
			</ul>
			<form onSubmit={addNote}>
				<input value={newNote} onChange={handleNoteChange} />
				<button type='submit'>save</button>
			</form>
		</div>
	)
}

export default App
