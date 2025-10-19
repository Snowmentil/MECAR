const input = document.getElementById('letters');
const scrambleButton = document.getElementById('scrambleButton');
const validWordsList = document.getElementById('validWords');
const allWordsList = document.getElementById('allWords');
const toggleAllButton = document.getElementById('toggleAll');
const allWordsSection = document.getElementById('allWordsSection');

// Generate all permutations of a given string
function getPermutations(str) {
  let results = new Set();

  function permute(prefix, rest) {
    if (prefix.length > 1) results.add(prefix);
    for (let i = 0; i < rest.length; i++) {
      permute(prefix + rest[i], rest.slice(0, i) + rest.slice(i + 1));
    }
  }

  permute('', str);
  return Array.from(results);
}

// Check if a word is valid using dictionaryapi.dev
async function isValidWord(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    return response.ok;
  } catch (err) {
    console.error('Error checking word:', word, err);
    return false;
  }
}

scrambleButton.addEventListener('click', async () => {
  const letters = input.value.trim().toLowerCase();
  if (!letters || letters.length < 2) {
    alert('Please enter at least 2 letters.');
    return;
  }

  validWordsList.innerHTML = '';
  allWordsList.innerHTML = '';
  const permutations = getPermutations(letters);

  // Show all permutations (optional view)
  permutations.forEach(word => {
    const li = document.createElement('li');
    li.textContent = word;
    allWordsList.appendChild(li);
  });

  // Check each permutation
  const validWords = [];
  for (const word of permutations) {
    if (await isValidWord(word)) {
      validWords.push(word);
      const li = document.createElement('li');
      li.textContent = word;
      validWordsList.appendChild(li);
    }
  }

  if (validWords.length === 0) {
    validWordsList.innerHTML = '<li>No valid words found.</li>';
  }
});

// Toggle full permutation list
toggleAllButton.addEventListener('click', () => {
  if (allWordsSection.style.display === 'none') {
    allWordsSection.style.display = 'block';
    toggleAllButton.textContent = 'Hide All Permutations';
  } else {
    allWordsSection.style.display = 'none';
    toggleAllButton.textContent = 'Show All Permutations';
  }
});
