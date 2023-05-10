const dogsList = document.getElementById('dogs-list');
const dogs = [];

// Define displayDogs function
const displayDogs = (dogs) => {
    dogsList.innerHTML = '';
    
    dogs.forEach(dog => {
      const li = document.createElement('li');
      li.textContent = `Name: ${dog.name}, Age: ${dog.age}`;