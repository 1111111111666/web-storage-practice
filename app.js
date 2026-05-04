let notes =[];


function loadFromLocalStorage() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes){
        notes = JSON.parse(savedNotes);
    } else{
        notes = [
            {
                id: Date.now(),
                title: 'hello',
                body: "Create your first note~"
            }
        ];
        saveToLocalStorage();
    }
}

function saveToLocalStorage() {
localStorage.setItem('notes', JSON.stringify(notes));
}

function renderNotes() {
const notesContainer = document.querySelector('.notes');
notesContainer.innerHTML ='';

for (let i=0; i< notes.length; i++){
    const note = notes[i];
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';
    noteDiv.setAttribute('data-id', note.id);

    const noteUp = document.createElement('div');
    noteUp.className = 'note-up';

    const titleH3 = document.createElement('h3');
    titleH3.className = 'note-title';
    titleH3.textContent = note.title;

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'note-buttons';  // добавь для стилей

    const editButton = document.createElement('button');
    editButton.className = 'correct';
    editButton.textContent = '🖌️';
    editButton.onclick = function(){
        startEditing(note.id);
    };

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';  // новый класс
    deleteButton.textContent = '🗑️';       // иконка корзины
    deleteButton.onclick = function() {
        deleteNote(note.id);  // вызываем функцию удаления
    };

    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(deleteButton);

    noteUp.appendChild(titleH3);
    noteUp.appendChild(buttonsDiv);


    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'note-body';
    bodyDiv.textContent = note.body;

    noteDiv.appendChild(noteUp);
    noteDiv.appendChild(bodyDiv);

    notesContainer.appendChild(noteDiv);

}
};


function startEditing(noteId) {
    const note = notes.find( n=> n.id === noteId);

    if (!note) return;

    const noteElement = document.querySelector(`.note[data-id="${noteId}"]`);
    const titleElement = noteElement.querySelector('.note-title');
    const bodyElement = noteElement.querySelector('.note-body');
    const editButton = noteElement.querySelector('.correct');

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = note.title; 
    titleInput.className = 'edit-title-input';

    const bodyInput = document.createElement('textarea');
    bodyInput.value = note.body;
    bodyInput.className = 'edit-body-input';
    bodyInput.rows = 3;

    titleElement.replaceWith(titleInput);
    bodyElement.replaceWith(bodyInput);

    editButton.textContent = '✅'
    editButton.onclick = function(){
        saveEditing(noteId, titleInput.value, bodyInput.value);
    };

}

function saveEditing(noteId, newTitle, newBody) {
    const note = notes.find( n=> n.id === noteId);

    if(note){
        note.title = newTitle;
        note.body = newBody;
        saveToLocalStorage();
        renderNotes();
    }

}


function addNewNote() {
    const titleInput = document.getElementById('title');
    const bodyInput = document.getElementById('body');

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (title === '' || body === '') {
        alert('Пожалуйста, заполните и заголовок, и тело заметки');
        return;
    }

    const newNote ={
        id: Date.now(),  // уникальный ID
        title: title,
        body: body
    };

    notes.push(newNote);
    saveToLocalStorage();

    titleInput.value = '';
    bodyInput.value = '';
    
    renderNotes();
}


function deleteNote(noteId) {
    const confirmDelete = confirm('Точно удалить заметку?');
    if (!confirmDelete) return;

    notes = notes.filter(note => note.id !== noteId);
    saveToLocalStorage();
    renderNotes();
}


window.addEventListener('load', function(){
    loadFromLocalStorage();
    renderNotes();
    const addButton = document.querySelector('.done');
    addButton.onclick = function(event){
        event.preventDefault();
        addNewNote();
    }
});


if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('Service Worker зарегистрирован');
      })
      .catch(function(error) {
        console.log('Ошибка регистрации Service Worker');
      });
  });
}