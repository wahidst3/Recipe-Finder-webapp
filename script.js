// DOM elements
const recipesContainer = document.querySelector('.recipes');
const totalResultsElement = document.querySelector('#total');
const filterButton = document.querySelector('.filter');
const filterButtons = document.querySelectorAll('.filter-btn');
const popup = document.getElementById('popup');
const popupImage = document.getElementById('popup-image');
const overlay = document.getElementById('overlay');
const closePopupButton = document.getElementById('close');
const searchInput = document.querySelector('input');
const submitButton = document.querySelector('.submit');
const appId = 'ab6f4c74';
const appKey = '81698c1b7f9449f04eea17f449b336a1';
let filterCont=  document.querySelector('.btns')
let currentResults = 12; 
let moreButton=document.querySelector('.more')
let planBtn=document.querySelector('#toggle-button')

// Event listeners
filterButton.addEventListener('click', toggleFilterOptions);
closePopupButton.addEventListener('click', closePopup);
submitButton.addEventListener('click', searchRecipes);

// Initialize total results count
totalResultsElement.textContent = " " + recipesContainer.children.length;

// Image popup functionality
document.querySelectorAll('.image').forEach(img => {
    img.addEventListener('click', () => {
        popupImage.src = img.src;
        popup.style.display = 'block';
        overlay.style.display = 'block';
    });
});

// Toggle filter options visibility
function toggleFilterOptions() {
  filterCont.classList.toggle('hide');
}

// Close popup
function closePopup() {
    popup.style.display = 'none';
    overlay.style.display = 'none';
}

// Event listener for the "More" button
moreButton.addEventListener('click', () => {
  currentResults += 12;
    
    searchRecipes(currentResults)
});
// Fetch recipes based on search query
function searchRecipes() {
    const cuisine = document.querySelector('#cuisine');
    const nutrients = document.querySelector('#nutrient-select');
    const diet = document.querySelector('#diet-select');
    const query = searchInput.value.trim();

    if (!query) return; // Ignore empty queries

    let apiUrl = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}&from=0&to=${currentResults}`;

    // Append cuisine, nutrients, and diet parameters if selected
    if (cuisine.value!=="") {
        apiUrl += `&cuisineType=${cuisine.value}`;
    }
    if (nutrients.value!=="") {
        apiUrl += `&nutrient=${nutrients.value}`;
    }
    if (diet.value!=="") {
        apiUrl += `&diet=${diet.value}`;
    }


    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch recipes');
            }
            return response.json();
        })
        .then(data => {
            displayRecipes(data.hits);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Display recipes on the page
function displayRecipes(hits) {
    recipesContainer.innerHTML = ''; // Clear previous recipes

    hits.forEach(hit => {
        const recipe = hit.recipe;

        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('recipe-image');
        const image = document.createElement('img');
        image.src = recipe.image;
        imageContainer.appendChild(image);

        const title = document.createElement('h1');
        title.classList.add('heading')
        title.textContent = getShortenedTitle(recipe.label);

        const cookingTime = document.createElement('p');
        cookingTime.textContent = `Cooking Time: ${recipe.totalTime || 'N/A'} minutes`;

        const calories = document.createElement('p');
        calories.textContent = `Calories: ${Math.round(recipe.calories)} kcal`;

        const link = document.createElement('a');
        link.href = recipe.url;
        link.textContent = 'Full Recipe';
        console.log(recipe)
        recipeCard.appendChild(imageContainer);
        recipeCard.appendChild(title);
        recipeCard.appendChild(cookingTime);
        recipeCard.appendChild(calories);
        recipeCard.appendChild(link);

        recipesContainer.appendChild(recipeCard);
    });

    // Update total results count
    totalResultsElement.textContent = " " + hits.length;
}

// Get shortened title (first two words)
function getShortenedTitle(label) {
    const words = label.split(' ');
    return words.slice(0, 2).join(' ');
}
let left=3;
let spanToggle=document.querySelector('.toggle span');
let prices=document.querySelectorAll('.para .price');
let period=document.querySelectorAll('.para .time')
planBtn.addEventListener('click', () => {
    if (left == 3) {
        left = 29;
        spanToggle.style.left = left + 'px';
        for(var i=0;i<prices.length;i++){
            prices[i].textContent = parseFloat(prices[i].textContent) * 30;
            period[i].textContent='/Month'
        }
       
    } else {
        left = 3;
        spanToggle.style.left = left + 'px';
        for(var i=0;i<prices.length;i++){
            prices[i].textContent = parseFloat(prices[i].textContent) / 30;
            period[i].textContent='/Day'
        }
    }
});
