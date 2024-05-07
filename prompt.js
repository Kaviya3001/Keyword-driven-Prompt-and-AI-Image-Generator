document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('submit-icon');
    submitButton.addEventListener('click', generateImagePrompt);
});

async function generateImagePrompt() {
    const keyword = document.getElementById('keyword').value;

    if (!keyword) {
        alert('Please enter a keyword');
        return;
    }

    const response = await fetch('http://127.0.0.1:5000/generate_image_prompt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword }),
    });

    const result = await response.json();

    const imagesSection = document.querySelector('.images-section');
    imagesSection.innerHTML = '';

    const imageElement = document.createElement('img');
    imageElement.src = result.generated_image_url;
    imagesSection.appendChild(imageElement);

    const promptElement = document.createElement('p');
    promptElement.innerText = `${result.image_prompt}`;
    imagesSection.appendChild(promptElement);
}
