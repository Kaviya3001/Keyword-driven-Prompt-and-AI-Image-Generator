
const API_KEY="sk-qO4oyoerEr1ys1DzZHLpT3BlbkFJ3V4AzjRV1Y2zGZBrbKflJHGHTRGIOB238UH4TU5HRJ"

const submitIcon = document.querySelector("#submit-icon");
const inputElement = document.querySelector("#keyword");
const promptContainer = document.querySelector('#prompt-container');
const imageContainer = document.querySelector('#image-container');
const imageSection = document.querySelector('.images-section');

const getImages = async () => {
    // Clear existing images
    //imageSection.innerHTML = "";
    promptContainer.innerHTML = "";
    imageContainer.innerHTML = "";

    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            prompt: inputElement.value,
            n: 2,
            size: '1024x1024'
        })
    };

    try {
        // Make sure the URL is correct
        const response = await fetch("https://api.openai.com/v1/images/generations", options);

        // Check for a successful response (status code 200-299)
        if (response.ok) {
            const data = await response.json();
             // Display prompt
             const promptElement = document.createElement('p');
             promptElement.innerText = `Prompt: ${inputElement.value}`;
             promptContainer.appendChild(promptElement);

            if (data && data.data && data.data.length > 0) {
                data.data.forEach(imageObject => {
                    const imageContainer = document.createElement("div");
                    imageContainer.classList.add("image-container");
                    const imageElement = document.createElement("img");
                    imageElement.setAttribute("src", imageObject.url);
                    imageContainer.append(imageElement);
                    imageSection.append(imageContainer);
                });
            } else {
                console.error("No image data found in the response.");
            }
        } else {
            console.error(`Failed to fetch. Status: ${response.status}`);
        }
    } catch (error) {
        console.error(error);
    }
};

submitIcon.addEventListener('click', getImages);
