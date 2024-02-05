// Check form errors
document.addEventListener("DOMContentLoaded", function () {
    // Get the form element
    var form = document.getElementById("conversion-form");

    // Add a submit event listener to the form
    form.addEventListener("submit", function (event) {
        // Prevent the default form submission
        event.preventDefault();

        // Perform your error checking here
        var nameInput = document.getElementById("name").value;
        var phoneInput = document.getElementById("phone").value;
        var emailInput = document.getElementById("email").value;

        // Clean the phone number input
        phoneInput = cleanPhoneNumber(phoneInput);


        if (nameInput.trim() === "") {
            alert("Please enter your name.");
            return; // Prevent form submission if there's an error
        }

        if (!isValidPhoneNumber(phoneInput)) {
            alert("Please enter a valid phone number.");
            return; // Prevent form submission if there's an error
        }

        if (!isValidEmail(emailInput)) {
            alert("Please enter a valid email address.");
            return; // Prevent form submission if there's an error
        }

        // Check if the email has already been submitted
        if (isEmailAlreadySubmitted(emailInput)) {
            alert("We've received your information. We'll be in touch with you shortly.");
            return; // Prevent form submission if the email has already been submitted
        }

        sendDataToApi(form, emailInput);
    });

    function isEmailAlreadySubmitted(email) {
        // Check if the email is already stored in localStorage
        var submittedEmails = JSON.parse(localStorage.getItem("submittedEmails")) || [];
        return submittedEmails.includes(email);
    }

    function markEmailAsSubmitted(email) {
        // Store the submitted email in localStorage
        var submittedEmails = JSON.parse(localStorage.getItem("submittedEmails")) || [];
        submittedEmails.push(email);
        localStorage.setItem("submittedEmails", JSON.stringify(submittedEmails));
    }

    function sendDataToApi(form, email) {
        // Serialize form data
        var formData = new FormData(form);

        // Make an AJAX request using fetch
        fetch("/api", {
            method: "POST",
            body: formData,
        })
            .then(response => response.text())
            .then(data => {
                // Handle success
                alert('Thank you for your submission. We have received your information and will contact you shortly to discuss your request.');

                if (checkCampaignParam()){
                    gtag_report_conversion();
                }

                // Mark the email as submitted to avoid duplicate submissions
                markEmailAsSubmitted(email);

                // Disable all fields and submit buttons
                disableFormFields(form);
            })
            .catch(error => {
                // Handle error
                alert("An error occurred. Try again.");
            });
    }

     function disableFormFields(form) {
        // Disable all form fields
        var formElements = form.elements;
        for (var i = 0; i < formElements.length; i++) {
            formElements[i].disabled = true;
        }

        // Disable the submit button
        var submitButton = document.getElementById("form-submit");
        if (submitButton) {
            submitButton.disabled = true;
        }
    }
    // Find all elements with data-id="phoneConversion" and add a click event listener
    const phoneConversionLinks = document.querySelectorAll('[data-id="phoneConversion"]');
    phoneConversionLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (checkCampaignParam()){
                gtag_report_conversion();
            }
        });
    });

    function isValidPhoneNumber(phone) {
        var phonePattern = /^\d+$/;
        return phonePattern.test(phone);
    }

    // Function to validate email format
    function isValidEmail(email) {
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    }

    // Function to clean phone number input
    function cleanPhoneNumber(phone) {
        // Remove common symbols and non-numeric characters
        return phone.replace(/[^0-9]/g, "");
    }

    function checkCampaignParam() {
        const urlParams = new URLSearchParams(window.location.search);
        const campaignParam = urlParams.get("campaign");
        return campaignParam === "1";
    }
 });