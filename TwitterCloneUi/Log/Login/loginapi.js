async function login(event) {
    // Prevent form from submitting
    event.preventDefault();

    // Getting user input
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Storing username in localStorage
    localStorage.setItem('username', username);

    const requestOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        redirect: 'follow'
    };

    try {
        const res = await fetch("http://localhost:3000/api/v1/auth/login", requestOptions);

        if (res.ok) {
            const data = await res.text();
            // Storing token in localStorage
            localStorage.setItem('token', data);
            document.cookie = "loginToken=" + data + ";path=/";
            window.location.href = '../../index.html';
        } else if (res.status === 401) {
            alert("Your login credentials don't match a user in our system.");
        } else {
            throw new Error("An error occurred while trying to log in.");
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong.");
    }
}
