const dogsList = document.getElementById('dogs-list');
const dogs = [];

// Define displayDogs function
const displayDogs = (dogs) => {
    dogsList.innerHTML = '';
    
    dogs.forEach(dog => {
      const li = document.createElement('li');
      li.textContent = `Name: ${dog.name}, Age: ${dog.age}`;

          // Add a remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.classList.add('remove');
    removeBtn.addEventListener('click', () => {
      removeDog(dog.id);
    });
    li.appendChild(removeBtn);

     // Add photo
     if (dog.photoUrl) {
        const img = document.createElement('img');
        img.src = dog.photoUrl;
        li.appendChild(img);
      }
  
      dogsList.appendChild(li);
    });
  }