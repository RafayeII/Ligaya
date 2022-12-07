//Variables for Profile Picture Change HTML Elements//
const profile = document.querySelector('.R_Profile');
const img = document.querySelector('.R_PicImg');
const file = document.querySelector('#R_File');
const uploadBtn = document.querySelector('.R_UploadBtn');
//const editBtn = document.getElementById("R_Edit"); 

//Displays "Choose Photo" when mouse hovers in Profile Div//
profile.addEventListener('mouseenter', function(){
    uploadBtn.style.display = "block";
});

//Hides "Choose Photo" when mouse hovers out Profile Div//
profile.addEventListener('mouseleave', function(){
    uploadBtn.style.display = "none";
});

//Function to change Profile Photo//
file.addEventListener('change', function(){
    let choosedFile = this.files[0]; //Refers to file

    //When a File is choosed//
    if (choosedFile) {
        const reader = new FileReader(); //File Reader

        //Loads the File choosed//
        reader.addEventListener('load', function(){
            img.setAttribute('src', reader.result); 
        });

        reader.readAsDataURL(choosedFile);
    }
});