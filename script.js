const input = document.getElementById('letters');
const scrambleButton = document.getElementById('scrambleButton');
const validWordsList = document.getElementById('validWords');
const allWordsList = document.getElementById('allWords');
const toggleAllButton = document.getElementById('toggleAll');
const allWordsSection = document.getElementById('allWordsSection');

let dictionary = new Set(); // Local word list
// Load words from words.json (JSON array of words)
async function loadWordList() {
  try {
    const response = await fetch('words.txt');
    const words = await response.json(); // <-- parse JSON
    dictionary = new Set(words.map(w => w.trim().toLowerCase()));
    console.log(`✅ Loaded ${dictionary.size} words from local dictionary`);
  } catch (err) {
    console.error('❌ Failed to load dictionary:', err);
  }
}


// Generate all subwords from given letters
function getAllCombinations(letters) {
  let results = new Set();

  function combine(prefix, remaining) {
    if (prefix.length >= 2) {
      results.add(prefix);
    }
    for (let i = 0; i < remaining.length; i++) {
      combine(prefix + remaining[i], remaining.slice(0, i) + remaining.slice(i + 1));
    }
  }

  combine('', letters);
  return Array.from(results);
}

scrambleButton.addEventListener('click', () => {
  const letters = input.value.trim().toLowerCase();
  if (!letters || letters.length < 2) {
    alert('Please enter at least 2 letters.');
    return;
  }

  validWordsList.innerHTML = '';
  allWordsList.innerHTML = '';

  const allCombos = getAllCombinations(letters);

  // Display all generated subwords
  allCombos.forEach(word => {
    const li = document.createElement('li');
    li.textContent = word;
    allWordsList.appendChild(li);
  });

  // Filter and display valid words from the dictionary
  const validWords = allCombos.filter(word => dictionary.has(word));

  if (validWords.length > 0) {
    validWords.sort((a, b) => a.length - b.length); // optional sorting by length
    validWords.forEach(word => {
      const li = document.createElement('li');
      li.textContent = word;
      validWordsList.appendChild(li);
    });
  } else {
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

// Load dictionary as soon as script runs
loadWordList();

