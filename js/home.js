const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser) {
    if (currentUser.userRole === "doctor") {
        showDoctorSection();
    }
    else if (currentUser.userRole === "patient") {
        showPatientSection();
    }
    else {
        console.error("Invalid user role");
    }
}
else {
    console.error("User not logged in");
}

function showDoctorSection() {
    const doctorSection = document.getElementById("doctor-section");
    doctorSection.style.display = "block";

    const patientSection = document.getElementById("patient-section");
    patientSection.style.display = "none";

    const doctorAppointmentFilter = document.getElementById("doctor-appointment-filter");
    doctorAppointmentFilter.addEventListener("change", handleDoctorAppointmentFilter);

    displayAppointments();
}

function handleDoctorAppointmentFilter() {
    displayAppointments();
}

function showPatientSection() {
    const doctorSection = document.getElementById("doctor-section");
    doctorSection.style.display = "none";

    const patientSection = document.getElementById("patient-section");
    patientSection.style.display = "block";

    const patientAppointmentFilter = document.getElementById("patient-appointment-filter");
    patientAppointmentFilter.addEventListener("change", handlePatientAppointmentFilter);

    const addAppointmentButton = document.getElementById("add-appointment-button");
    addAppointmentButton.addEventListener("click", openAddAppointmentPopup);

    const addAppointmentForm = document.getElementById("add-appointment-form");
    addAppointmentForm.addEventListener("submit", handleAddAppointmentSubmit);

    const cancelAddAppointmentButton = document.getElementById("cancel-add-appointment");
    cancelAddAppointmentButton.addEventListener("click", closeAddAppointmentPopup);

    displayAppointments();
}

function handlePatientAppointmentFilter() {
    displayAppointments();
}

function openAddAppointmentPopup() {
    const popup = document.getElementById("add-appointment-popup");
    popup.style.display = "block";
}

function handleAddAppointmentSubmit(e) {
    e.preventDefault();

    const patientName = document.getElementById("patientname").value;
    const appointmentTime = new Date(document.getElementById("appointment-time").value);
    const selectedDoctor = document.getElementById("doctor-select").value;
    const diseaseInput = document.getElementById("disease-input").value;
    const mobileInput = document.getElementById("mobile-input").value;

    if (patientName === "" || appointmentTime === "" || selectedDoctor === "" || diseaseInput === "" || mobileInput === "") {
        alert("Please fill in all the fields.");
        return;
    }

    const newAppointment = {
        patientName: patientName,
        time: appointmentTime.toLocaleString("en-IN"),
        doctor: selectedDoctor,
        disease: diseaseInput,
        mobileNumber: mobileInput,
        status: "upcoming"
    };

    const appointments = getAppointments();
    appointments.push(newAppointment);
    localStorage.setItem("appointments", JSON.stringify(appointments));

    alert("Appointment added successfully!");
    closeAddAppointmentPopup();
    displayAppointments();
}


function closeAddAppointmentPopup() {
    const popup = document.getElementById("add-appointment-popup");
    popup.style.display = "none";

    document.getElementById("patientname").value = "";
    document.getElementById("appointment-time").value = "";
    document.getElementById("doctor-select").value = "";
    document.getElementById("disease-input").value = "";
    document.getElementById("mobile-input").value = "";
}

function filterAppointments(filter) {
    const appointments = getAppointments();
    if (filter === "all") {
        return appointments;
    }
    else {
        return appointments.filter(appointment => appointment.status.toLowerCase() === filter.toLowerCase());
    }
}

function displayAppointments() {
    const appointmentFilter = document.getElementById(currentUser.userRole === "doctor" ? "doctor-appointment-filter" : "patient-appointment-filter");
    const selectedFilter = appointmentFilter.value;
    const filteredAppointments = filterAppointments(selectedFilter);

    const appointmentTableBody = document.getElementById("appointment-table-body");
    appointmentTableBody.innerHTML = "";

    filteredAppointments.forEach((appointment, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${appointment.patientName}</td>
          <td>${appointment.time}</td>
          <td>${appointment.disease}</td>
          <td class="responsive-btn">
            <button class="cancel-button" onclick="cancelAppointment(${index})">Cancel</button>
            <button class="reschedule-button" onclick="rescheduleAppointment(${index})">Reschedule</button>
            <button class="complete-button" onclick="completeAppointment(${index})">Complete</button>
          </td>
        `;
        appointmentTableBody.appendChild(row);
    });

    const appointmentCountElement = document.getElementById(currentUser.userRole === "doctor" ? "doctor-appointment-count" : "patient-appointment-count");
    appointmentCountElement.textContent = filteredAppointments.length;
}

function cancelAppointment(index) {
    const appointments = getAppointments();
    if (index >= 0 && index < appointments.length) {
        appointments[index].status = "cancelled";
        localStorage.setItem("appointments", JSON.stringify(appointments));
        alert("Appointment cancelled successfully!");
        displayAppointments();
    }
    else {
        console.error("Invalid appointment index");
    }
}

function rescheduleAppointment(index) {
    const appointments = getAppointments();
    if (index >= 0 && index < appointments.length) {
        const appointment = appointments[index];
        const newDateTime = prompt("Enter the new date and time for the appointment (DD-MM-YYYY HH:MM):");
        if (newDateTime) {
            appointment.time = newDateTime;
            appointments[index].status = "upcoming";
            localStorage.setItem("appointments", JSON.stringify(appointments));
            alert("Appointment rescheduled successfully!");
            displayAppointments();
        }
        else {
            alert("Reschedule cancelled!");
        }
    }
    else {
        console.error("Invalid appointment index");
    }
}

function completeAppointment(index) {
    const appointments = getAppointments();
    if (index >= 0 && index < appointments.length) {
        appointments[index].status = "completed";
        localStorage.setItem("appointments", JSON.stringify(appointments));
        alert("Appointment marked as completed!");
        displayAppointments();
    }
    else {
        console.error("Invalid appointment index");
    }
}

function getAppointments() {
    return JSON.parse(localStorage.getItem("appointments")) || [];
}
