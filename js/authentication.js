if(localStorage.getItem("authenticated") != "true"){
    if(window.prompt("password") == "jkcc"){
        localStorage.setItem("authenticated", "true");
        document.body.style.visibility = "visible";
    }
}else{
    document.body.style.visibility = "visible";
}