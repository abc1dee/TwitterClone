document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signupForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        const usernameValidity = /^([a-zA-Z0-9]){3,16}$/.test(username);
        const passwordMatching = password === confirmPassword;
        const passwordValidity = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(password);

        if (!usernameValidity) {
            alert("Invalid username.");
            return;
        } 
        if (!passwordMatching) {
            alert("Password and Confirm Password should match.");
            return;
        } 
        if (!passwordValidity) {
            alert("Password must be 8 characters long and contain both numbers and letters.");
            return;
        }

        const userData = {
            username,
            password
        };

        try {
            const response = await fetch("/api/v1/auth/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                // Registration successful, redirect to login page
                window.location.href = '../Login/Login.html';
            } else {
                console.error('Registration failed:', response.status);
            }

            const data = await response.text();
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
