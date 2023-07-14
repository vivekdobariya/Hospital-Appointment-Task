const login = document.querySelector(".login");

login.addEventListener("click", (e) => {
    e.preventDefault();
    const userName1 = document.getElementById("username").value;
    const password1 = document.getElementById("password").value;

    let allData = JSON.parse(localStorage.getItem("alldata"));

    let currentUser = allData.find((user) => user.userName === userName1 && user.password === password1);

    if (currentUser) {
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        alert("Login Successful!");
        window.location.href = "home.html";
    }
    else {
        alert("Invalid email or password");
    }

});