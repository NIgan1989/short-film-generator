// Функция для генерации сценария
async function generateScript() {
    const genre = document.getElementById('genre').value; // Получаем выбранный жанр
    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY' // Замените на ваш API-ключ
            },
            body: JSON.stringify({
                model: 'text-davinci-003',
                prompt: `Create a short story for a children's animation film in the genre of ${genre}.`,
                max_tokens: 150
            })
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('output').innerText = data.choices[0].text;
        } else {
            const errorData = await response.json();
            document.getElementById('output').innerText = `Error: ${errorData.error.message || 'Unable to generate script.'}`;
        }
    } catch (error) {
        document.getElementById('output').innerText = 'Error: Failed to fetch script. Please check your connection.';
        console.error('Fetch error:', error);
    }
}

// Функция для скачивания сценария
function downloadScript() {
    const text = document.getElementById('output').innerText;
    if (!text || text.startsWith("Error:")) {
        alert("No valid script to download!");
        return;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'short_film_script.txt';
    link.click();
}

// Функция для сохранения сценария
function saveScript() {
    const script = document.getElementById('output').innerText;
    if (!script || script.startsWith("Error:")) {
        alert("No valid script to save!");
        return;
    }

    const savedScripts = JSON.parse(localStorage.getItem('scripts')) || [];
    savedScripts.push(script);
    localStorage.setItem('scripts', JSON.stringify(savedScripts));

    alert("Script saved successfully!");
}

// Функция для отображения сохранённых сценариев
function viewSavedScripts() {
    const savedScripts = JSON.parse(localStorage.getItem('scripts')) || [];
    const container = document.getElementById('saved-scripts');

    if (savedScripts.length === 0) {
        container.innerHTML = '<p>No saved scripts found!</p>';
        return;
    }

    container.innerHTML = '<h3>Saved Scripts:</h3>';
    savedScripts.forEach((script, index) => {
        const scriptElement = document.createElement('div');
        scriptElement.style.border = "1px solid #ccc";
        scriptElement.style.margin = "10px";
        scriptElement.style.padding = "10px";
        scriptElement.style.position = "relative";

        scriptElement.innerHTML = `
            <strong>Script ${index + 1}:</strong>
            <pre>${script}</pre>
            <button style="position: absolute; top: 5px; right: 10px;" onclick="deleteScript(${index})">Delete</button>
        `;

        container.appendChild(scriptElement);
    });
}

// Функция для удаления отдельного сценария
function deleteScript(index) {
    const savedScripts = JSON.parse(localStorage.getItem('scripts')) || [];
    if (index >= 0 && index < savedScripts.length) {
        savedScripts.splice(index, 1); // Удаляем сценарий по индексу
        localStorage.setItem('scripts', JSON.stringify(savedScripts));
        viewSavedScripts(); // Обновляем отображение
        alert("Script deleted successfully!");
    }
}

// Функция для очистки всех сохранённых сценариев
function clearSavedScripts() {
    if (confirm("Are you sure you want to delete all saved scripts?")) {
        localStorage.removeItem('scripts');
        alert("All saved scripts have been deleted!");
        document.getElementById('saved-scripts').innerHTML = ""; // Очистка отображения
    }
}
