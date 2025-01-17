const loginRadio = document.getElementById('login');
const signupRadio = document.getElementById('signup');
const formContainer = document.querySelector('.form-inner');

loginRadio.addEventListener('change', () => {
  formContainer.style.transform = 'translateX(0)';
});

signupRadio.addEventListener('change', () => {
  formContainer.style.transform = 'translateX(-50%)';
});

// Create an object to store registered users with their roles
const registeredUsers = {
  'cyusaclive24@fr.com': {
    password: 'Goat2302#',
    role: 'admin',
    name: 'Clive'
  }
};

// Function to check if email is a potential admin email
function isPotentialAdminEmail(email) {
  return email.endsWith('@fr.com');
}

// Handle login form submission
document.querySelector('form.login').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const email = this.querySelector('input[type="text"]').value;
  const password = this.querySelector('input[type="password"]').value;
  
  if (registeredUsers[email] && registeredUsers[email].password === password) {
    // Store user role and name in sessionStorage
    sessionStorage.setItem('userRole', registeredUsers[email].role);
    sessionStorage.setItem('userName', registeredUsers[email].name);
    // Successful login
    window.location.href = 'user.html';
  } else {
    alert('Invalid credentials. Please sign up if you don\'t have an account.');
  }
});

// Handle signup form submission
document.querySelector('form.signup').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const fullName = this.querySelector('input[type="text"]').value;
  const email = this.querySelector('input[type="email"]').value;
  const password = this.querySelectorAll('input[type="password"]')[0].value;
  const confirmPassword = this.querySelectorAll('input[type="password"]')[1].value;
  
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  
  if (registeredUsers[email]) {
    alert('This email is already registered. Please login instead.');
    return;
  }

  // Check if email is a potential admin email
  if (isPotentialAdminEmail(email)) {
    // Add new user with admin role
    registeredUsers[email] = {
      password: password,
      role: 'admin',
      name: fullName
    };
    alert('Admin account registration successful! Please login with your credentials.');
  } else {
    // Add new user with user role
    registeredUsers[email] = {
      password: password,
      role: 'user',
      name: fullName
    };
    alert('User account registration successful! Please login with your credentials.');
  }
  
  // Store user info in sessionStorage
  sessionStorage.setItem('userName', fullName);
  sessionStorage.setItem('userRole', registeredUsers[email].role);
  
  // Redirect to user page after successful signup
  window.location.href = 'user.html';
});

document.getElementById('view-records-btn').addEventListener('click', function() {
  const recordsList = document.getElementById('records-list');
  recordsList.innerHTML = `
    <ul>
      <li>Record 1: Red-Flag - Title</li>
      <li>Record 2: Intervention - Title</li>
    </ul>
  `;
});

document.querySelector('.side-menu li.logout').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
});

