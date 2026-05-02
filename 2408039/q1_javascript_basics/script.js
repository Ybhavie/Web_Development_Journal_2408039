/** 
 * PART A: DOM Manipulation Logic 
 */
function addItem() {
    const input = document.getElementById('itemInput');
    const ul = document.getElementById('itemList');

    // Requirement (b): On button click, dynamically add text into a list (<ul>)
    if (input.value.trim() !== "") {
        const li = document.createElement('li');
        li.textContent = input.value;
        
        // Requirement (c): Add functionality to remove a specific list item when clicked
        li.onclick = function() {
            this.remove();
        };

        ul.appendChild(li);
        input.value = ""; // Clear input after adding
    }
}

/** 
 * PART B: JavaScript String Program 
 */
function analyzeString() {
    // (a) Accept a string input
    const str = document.getElementById('stringInput').value;
    const outputDiv = document.getElementById('stringOutput');

    if (str.trim() === "") {
        outputDiv.innerHTML = "Please enter a string.";
        return;
    }

    let vowels = 0;
    let consonants = 0;
    const vowelList = "aeiouAEIOU";

    for (let char of str) {
        if (/[a-zA-Z]/.test(char)) { 
            // (c) Count and display number of vowels
            if (vowelList.includes(char)) {
                vowels++;
            } 
            // (d) Count and display number of consonants
            else {
                consonants++;
            }
        }
    }

    // (e) Reverse of the string
    const reversedStr = str.split("").reverse().join("");

    // (f) Show output dynamically on the webpage
    outputDiv.innerHTML = `
        <strong>Vowels:</strong> ${vowels} <br>
        <strong>Consonants:</strong> ${consonants} <br>
        <strong>Reverse:</strong> ${reversedStr}
    `;
}