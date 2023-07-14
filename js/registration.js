const submit_button = document.querySelector(".button");

submit_button.addEventListener("click", (e) => {
    e.preventDefault();
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const pass = document.getElementById("pass").value;
    const cpass = document.getElementById("cpass").value;
    const role = document.getElementById("role").value;

    if (fname === "" || lname === "" || email === "" || username === "" || pass === "" || cpass === "" || role === "") {
        alert("Input field is empty");
    }
    else if (pass.length < 6) {
        alert("Password should be at least 6 characters");
    }
    else if (pass !== cpass) {
        alert("Password does not match");
    }
    else if (!isValidEmail(email)) {
        alert("Email is not in a valid format");
    }
    else {
        let allData = JSON.parse(localStorage.getItem("alldata")) || [];

        existingUser = allData.find((user) => user.userName === username);
        if (existingUser) {
            alert("Username already exists");
        }
        else {
            let userData = {
                firstName: fname,
                lastName: lname,
                email: email,
                userName: username,
                password: pass,
                confirmPassword: cpass,
                userRole: role
            };

            allData.push(userData);
            localStorage.setItem("alldata", JSON.stringify(allData));

            alert("Registration Successful!");
            window.location.href = "login.html";
        }
    }
});

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}