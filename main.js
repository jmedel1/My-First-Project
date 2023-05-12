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
const fetchDogs = async (sortBy = 'id', sortDescending = false) => {
  try {
    const response = await fetch(`http://localhost:3000/posts?_sort=${sortBy}&_order=${sortDescending ? 'desc' : 'asc'}`);
    const dogs = await response.json();

    // Parse the age values as numbers before sorting
    dogs.forEach(dog => {
      dog.age = parseInt(dog.age);
    });

    // Sort the dogs by age if requested
    const sortDogsByAge = (dogs, order) => {
      return dogs.sort((a, b) => {
        if (order === "puppy-to-senior") {
          return a.age - b.age;
        } else if (order === "senior-to-puppy") {
          return b.age - a.age;
        }
      });
    };
  
    // Display the dogs
    displayDogs(dogs);

    // Add event listener to the sort by age button
    const sortByAgeBtn = document.getElementById('sort-by-age-btn');
    sortByAgeBtn.addEventListener('click', sortDogs);
  } catch (error) {
    console.error(error);
  }
};

// Add sort by age button
const sortByAgeBtn = document.getElementById('sort-by-age-btn');
function sortDogsByAge() {
  let sortOrder = document.getElementById("sort-by-age-select").value;
  fetchDogs('age', sortOrder === "senior-to-puppy");
}

sortByAgeBtn.addEventListener('click',() => {
  const sortOrder = document.getElementById('sort-order').value;
  fetchDogs('age', sortOrder);
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
  const name = document.getElementById('name-input').value;
  const age = document.getElementById('age-input').value;
  const photo = document.getElementById('photo-input').files[0];

  const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');

imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  const reader = new FileReader();
  
  reader.addEventListener('load', () => {
    // Set the preview image source to the uploaded file
    imagePreview.src = reader.result;
    
    // Upload the file to the server using AJAX or fetch()
    uploadFile(file);
  });
  
  // Read the uploaded file as a data URL
  reader.readAsDataURL(file);
});

function uploadFile(file) {
  // Make an AJAX or fetch() request to upload the file to the server
  // Include any additional data you want to store, such as the user ID or a timestamp
  // On successful upload, store the file name or URL in a database or other data store
}

window.addEventListener('load', () => {
  // Get the list of file names or URLs from the database or other data store
  const fileNames = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
  
  fileNames.forEach((fileName) => {
    // Create an image element for each file
    const image = document.createElement('img');
    image.src = `path/to/images/${fileName}`;
    
    // Add the image element to the page
    document.body.appendChild(image);
  });
});

  
  // Clear the form fields
  form.reset();
});


// Load dogs on page load
fetchDogs();