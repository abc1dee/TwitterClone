async function login(event){
    // Prevent form from submitting
    event.preventDefault();

    // Getting user input
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value

    const usernameInput = document.getElementById('username').value;
    localStorage.setItem('username', usernameInput);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "username": username,
    "password": password
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    const res = await fetch("http://localhost:3000/api/v1/auth/login", requestOptions)
    if(res.status==200){
        const data = await res.text();
        document.cookie = "loginToken=" + data + ";path=/";
        window.location.href='../../index.html';
    } else if(res.status==401){
        alert("Your login credentials don't match a user in our system.")
    }
    else{
        alert("Something went wrong.")
    }
}
