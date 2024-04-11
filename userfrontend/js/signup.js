  function validateName() {
    var nameInput = document.getElementById('signup-name').value;
  
    var nameRegex = /^[A-Za-z\s]+$/;
    if (nameRegex.test(nameInput)) {
      return true;
    } else {
        showMessage('error', 'Name should contain only alphabet', 4000);
      return false;
    }
  }
  
  function validateEmail() {
    var emailInput = document.getElementById('signup-email').value;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (emailRegex.test(emailInput)) {
      return true;
    } else {
        showMessage('error', 'Invalid Email. Try Again', 4000);
      return false;
    }
  }
  
  function validatePassword() {
    // Get the input value
    var passwordInput = document.getElementById('signup-password').value;
  
    // Define password criteria
    var minLength = 8;
    var uppercaseRegex = /[A-Z]/;
    var lowercaseRegex = /[a-z]/;
    var digitRegex = /\d/;
    var specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
  
    // Check if the password meets the criteria
    if (
      passwordInput.length >= minLength &&
      uppercaseRegex.test(passwordInput) &&
      lowercaseRegex.test(passwordInput) &&
      digitRegex.test(passwordInput) &&
      specialCharRegex.test(passwordInput)
    ) {
      return true;
    } else {
    showMessage('error', 'Weak Password. Include Uppercase, special character, lowercas, and numbers', 4000);
      return false;
    }
  }
  
  

  document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
 
    if (!validateName() || !validateEmail() || !validatePassword()) {
      return;
    }
    const formData = new FormData(this);
    const data = {};
    for(const [key, value] of formData.entries()) {
        data[key] = value;
    }

    fetch('https://ecommerce-fullstack-nine.vercel.app/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                showMessage('error', 'Please check your email and password', 3000);
                throw new Error('Network response was not ok');
            }
            return response.json(); })
        .then(data => {
            window.location.replace('login.html');
        })
        .catch(error => showMessage('error', 'Invalid email or password', 3000));
});
  