<script>

   
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    const checkemail = () => {

        let valid = false;

        const Email = document.getElementById('email').trim();

        if (!isRequired(validateEmail)) {
            swal("Error", "Email cannot be blank", "error");

        }

        if (validateEmail(validateEmail)) {
            valid = true;
        } else {
            swal("Error", "Please insert the valid email address", "error");
        }

        return valid;
    };

    const checkphonenumber = () => {

        let valid = false;

        const Phone = document.getElementById('phone').trim();
        const reg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

        if (!isRequired(Phone)) {
            swal("Error", "Phone number cannot be blank", "error");
        }

        if (Phone.match(reg)) {
            valid = true;
        } else {
            swal("Error", "Please insert the valid phone number", "error");

        }
        return valid;
    };
    
   

    form.addEventListener('submit', function (e) {
        switch (url) {
            case "www.fundica.com":
                {
                    checkemail();
                    checkphonenumber();
                    break;
                }
            case "domain1.fundica.com":
                {
                    checkemail();
                    checkphonenumber();
                   
                    break;
                }
            case "domain2.fundica.com":
                {
                    checkemail();
                    break;
                }
           
        }
    });
</script>