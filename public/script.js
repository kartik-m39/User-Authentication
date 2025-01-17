// Initially the local storage has no token so the value of token variable here is null
let token = localStorage.getItem('token');

let isRegister = false;
let isAuthenticating = false;

const apibaseurl = 'https://user-authentication-lsuqh8l26-kartik-manchandas-projects.vercel.app/';

// Select the button
const authBtn = document.getElementById('authbtn');

// Add a keypress event listener to the document or a specific input field
document.addEventListener('keypress', function (event) {
    // Check if the pressed key is 'Enter'
    if (event.key === 'Enter') {
        authenticate(); // Trigger a click event on the button
    }
});

async function toggleIsRegister(){
    isRegister = !isRegister;
    document.querySelector('#success-message').innerText = isRegister ? 'Create new Account!' : '';
    document.querySelector('.sign-up-text').innerText = isRegister ? 'Register' : 'Login';
    document.querySelector('.register-content p').innerText = isRegister ? 'Already have an account?' : 'Don\'t have an account?';
    document.querySelector('.register-content button').innerText = isRegister ? 'Login' : 'Sign up';
}

async function authenticate() {
    const email = document.querySelector('#emailInput').value;
    const password = document.querySelector('#passwordInput').value;

    // Guard clauses
    if (!email || !password) {
        document.querySelector('#error').innerText = 'Please fill in all fields';
        document.querySelector('#error').style.display = 'block';
        return;
    }

    if(!email.includes('@')){
        document.querySelector('#error').innerText = 'Please enter a valid email';
        document.querySelector('#error').style.display = 'block';
        return;
    }

    if(password.length < 6){
        document.querySelector('#error').innerText = 'Password must be at least 6 characters';
        document.querySelector('#error').style.display = 'block';
        return;
    }

    // Disable the button and show loading text
    const error = document.querySelector('#error');
    error.style.display = 'none';
    isAuthenticating = true;
    const authBtn = document.querySelector('#authBtn');
    authBtn.innerText = 'Authenticating...';
    authBtn.disabled = true;     
    
    let data;
    try{
        if(isRegister){
            // Register the user
            const response = await fetch(apibaseurl + 'api/auth/register', {
                method: 'POST',
                headers:{ 'Content-Type': 'application/json'},
                body: JSON.stringify({ username: email, password: password})
            })
            // Parse the response from server
            data = await response.json();

            if (data.token) {
                // Store the JWT token for further use (e.g., in localStorage or sessionStorage)
                localStorage.setItem('token', data.token);

                setTimeout(() => {
                    // Redirect to index.html with a success message
                    window.location.href = '/index.html?message=Account created successfully. Please log in.';
                }, 2000);
            } else {
                throw Error('❌ Failed to create account...');
            }
        } else {
            // Login the user
            const response = await fetch(apibaseurl + 'api/auth/login', {
                method: 'POST',
                headers:{ 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: email, password: password})
            })
            // Parse the response from server
            data = await response.json();

            if (data.success) {
                // Store the JWT token for further use (e.g., in localStorage or sessionStorage)
                localStorage.setItem('token', data.token);

                // authenticating into login
                authBtn.innerText = 'Loading...';

                // Force a reflow to ensure the UI updates
                authBtn.offsetHeight;
                
                // Redirect to another page where we can display users
                setTimeout(() => {
                    window.location.href = '/users.html'; // Redirect to the users page
                }, 2000);

            } else {
                throw Error('❌ Failed to authenticate...')
            }
        }
    } catch (err){
        console.log(message);
        error.innerText = err.message;
        error.style.display = 'block';
    } finally {
        isAuthenticating = false;
        authBtn.innerText = 'Submit';
        authBtn.disabled = false;
    }
}