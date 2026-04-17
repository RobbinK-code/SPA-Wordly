const form = document.getElementById('search-form');
const input = document.getElementById('word-input');

const errorDiv = document.getElementById('error');
const wordTitle = document.getElementById('word-title');
const partOfSpeech = document.getElementById('part-of-speech');
const definition = document.getElementById('definition');
const example = document.getElementById('example');
const synonyms = document.getElementById('synonyms');
const audio = document.getElementById('audio');

async function fetchWord(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    if (!response.ok) {
      throw new Error('Word not found');
    }

    const data = await response.json();
    displayWord(data[0]);
    clearError();

  } catch (error) {
    displayError(error.message);
  }
}

function displayWord(data) {
  wordTitle.textContent = data.word;

  const meaning = data.meanings[0];

  partOfSpeech.textContent = `Part of Speech: ${meaning.partOfSpeech}`;
  definition.textContent = `Definition: ${meaning.definitions[0].definition}`;
  example.textContent = `Example: ${meaning.definitions[0].example || 'No example available'}`;

  const syns = meaning.synonyms;
  synonyms.textContent = syns.length > 0
    ? `Synonyms: ${syns.join(', ')}`
    : 'Synonyms: None';

  const phonetic = data.phonetics.find(p => p.audio);

  if (phonetic && phonetic.audio) {
    audio.src = phonetic.audio;
    audio.classList.remove('hidden');
  } else {
    audio.classList.add('hidden');
  }
}

function displayError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
}

function clearError() {
  errorDiv.textContent = '';
  errorDiv.classList.add('hidden');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const word = input.value.trim();

  if (!word) {
    displayError('Please enter a word');
    return;
  }

  fetchWord(word);

  input.value = '';
});