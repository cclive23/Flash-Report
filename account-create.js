const loginRadio = document.getElementById('login');
const signupRadio = document.getElementById('signup');
const formContainer = document.querySelector('.form-inner');

loginRadio.addEventListener('change', () => {
  formContainer.style.transform = 'translateX(0)';
});

signupRadio.addEventListener('change', () => {
  formContainer.style.transform = 'translateX(-50%)';
});

// Initialize users from localStorage or use default admin
const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || {
  'cyusaclive24@fr.com': {
    password: 'Goat2302#',
    role: 'admin',
    name: 'Clive'
  }
};

// Save users to localStorage whenever updated
function saveUsers() {
  localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
}

// Function to check if email is a potential admin email
function isPotentialAdminEmail(email) {
  return email.endsWith('@fr.com');
}

// Handle login form submission
document.querySelector('form.login').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const email = this.querySelector('input[type="text"]').value;
  const password = this.querySelector('input[type="password"]').value;
  
  console.log('Login attempt:', email); // Debug logging
  
  if (registeredUsers[email] && registeredUsers[email].password === password) {
    console.log('Login successful for:', email); // Debug logging
    
    // Store user info in sessionStorage
    sessionStorage.setItem('userRole', registeredUsers[email].role);
    sessionStorage.setItem('userName', registeredUsers[email].name);
    sessionStorage.setItem('userEmail', email);
    
    // Redirect based on role
    if (registeredUsers[email].role === 'admin') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'user.html';
    }
  } else {
    console.log('Login failed for:', email); // Debug logging
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

  // Add new user with appropriate role
  registeredUsers[email] = {
    password: password,
    role: isPotentialAdminEmail(email) ? 'admin' : 'user',
    name: fullName
  };
  
  // Save to localStorage
  saveUsers();

  // Store user info in sessionStorage
  sessionStorage.setItem('userName', fullName);
  sessionStorage.setItem('userEmail', email);
  sessionStorage.setItem('userRole', registeredUsers[email].role);

  // Redirect based on role
  window.location.href = registeredUsers[email].role === 'admin' ? 'admin.html' : 'user.html';
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

// Update logout to clear both sessionStorage and localStorage
document.querySelector('.side-menu li.logout').addEventListener('click', function() {
  if (confirm('Are you sure you want to logout?')) {
    sessionStorage.clear();
    window.location.href = 'index.html';
  }
});

