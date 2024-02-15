document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signupForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(form);

        const userData = {
            username: formData.get('username'),
            password: formData.get('password')
        };
        
        let usernameValidity = /^([a-zA-Z0-9]){3,16}$/.test(document.getElementById('username').value);
        let passwordMatching = (document.getElementById('password').value == document.getElementById('confirmPassword').value);

        let passwordValidity = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(document.getElementById('password').value);


        if (usernameValidity != true) {
            alert("Invalid username.")
        } else if (passwordMatching != true) {
            alert("Password and Confirm Password should match.")
        } else if (passwordValidity != true) {
            alert("Password must be  8 characters long and contain both numbers and letters.");
        }
        else {
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
                    window.location.href='../../index.html';
                } else {
                    console.error('Registration failed:', response.status);
                }

                const data = await response.text();
                console.log(data);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });
});