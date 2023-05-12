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

  // Remove dogs name
const removeDog = (id) => {
    fetch(`http://localhost:3000/posts/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Unable to remove dog.');
      }
      return response.json();
    })
    .then(data => {
      fetchDogs();
    })
    .catch(error => {
      console.error(error);
    });
  }


// Fetch dogs data from the server
const fetchDogs = async (sortBy = 'id', reverse = false) => {
  try {
    const response = await fetch(`http://localhost:3000/posts?_sort=${sortBy}`);
    let dogs = await response.json();

    // Sort the dogs by the specified property in ascending order
    dogs.sort((a, b) => a[sortBy] - b[sortBy]);

    // If reverse is true, reverse the order of the dogs array
    if (reverse) {
      dogs.reverse();
    }

    return dogs;
  } catch (error) {
    console.error(error);
  }
};

// Get the sort order dropdown element
const sortOrderDropdown = document.getElementById('sort-order');

// Add a change event listener to the dropdown
sortOrderDropdown.addEventListener('change', async () => {
  // Get the selected value from the dropdown
  const selectedValue = sortOrderDropdown.value;

  // Set the sortBy and reverse parameters based on the selected value
  let sortBy, reverse;
  if (selectedValue === 'puppy-to-senior') {
    sortBy = 'age';
    reverse = false;
  } else if (selectedValue === 'senior-to-puppy') {
    sortBy = 'age';
    reverse = true;
  } else {
    // Default to sorting by id in ascending order
    sortBy = 'id';
    reverse = false;
  }

  // Call the fetchDogs function with the selected parameters
  const dogs = await fetchDogs(sortBy, reverse);
  console.log(dogs); // Log the sorted dogs to the console
});


// Add dog button
const addDogBtn = document.getElementById('add-dog-form');

addDogBtn.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get the dog name and age from the input fields
    const name = document.getElementById('name-input').value;
    const age = document.getElementById('age-input').value;

    // Get the file object from the photo input field
    const photoFile = document.getElementById('photo-input').files[0];

    
    // Create an object URL for the photo file
    const photoUrl = window.URL.createObjectURL(photoFile);

    // Create a new dog object with the name, age, and photo URL
    const newDog = { name: name, age: age, photoUrl: photoUrl };

        // Add the new dog to the server
        fetch('http://localhost:3000/posts', {
            method: 'POST',
            body: JSON.stringify(newDog),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Unable to add dog.');
            }
            return response.json();
          })
          .then(data => {

              // Add the new dog to the dogs array and display all dogs
      dogs.push(data);
      displayDogs(dogs);
    })
    .catch(error => {
      console.error(error);
    });
  });

    //Adjusts photos to certain size
    const MAX_FILE_SIZE = 1024 * 1024; // 1MB

    const photoInput = document.getElementById('photo-input');
    
    photoInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
    
      if (file && file.size > MAX_FILE_SIZE) {
        alert('The selected photo is too large. Please select a file smaller than 1MB.');
        photoInput.value = null; // clear the file input field
    }
  });

// Get the form element
const form = document.getElementById('add-dog-form');

// Add an event listener for form submit
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from submitting

    // Get the dog name and age from the input fields
    const name = document.getElementById('name-input').value;
    const age = document.getElementById('age-input').value;

    // Get the file object from the photo input field
    const photoFile = document.getElementById('photo-input').files[0];

    // Create an object URL for the photo file
    const photoUrl = window.URL.createObjectURL(photoFile);

    // Create a new dog object with the name, age, and photo URL
    const newDog = { name: name, age: age, photoUrl: photoUrl };

    // Add the new dog to the server
    fetch('http://localhost:3000/posts', {
        method: 'POST',
        body: JSON.stringify(newDog),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Unable to add dog.');
        }
        return response.json();
    })
    .then(data => {

        // Add the new dog to the dogs array and display all dogs
        dogs.push(data);
        displayDogs(dogs);

        // Clear the form fields
        form.reset();
    })
    .catch(error => {
        console.error(error);
    });
});

// Adjusts photos to certain size
const MAX_FILE_SIZE = 1024 * 1024; // 1MB

const photoInput = document.getElementById('photo-input');

photoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file && file.size > MAX_FILE_SIZE) {
        alert('The selected photo is too large. Please select a file smaller than 1MB.');
        photoInput.value = null; // clear the file input field
    }
});

// Load dogs on page load
fetchDogs();
