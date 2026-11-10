const forme = document.getElementById("form")
const input = document.getElementById("city")
 const button =document.getElementById("btn")
const messagerror =document.getElementById("mesgerror")

forme.addEventListener("submit",(event)=>{
    event.preventDefault();
    if(input.value.trim() === ""){
        messagerror.style.display="block"  
        return;
    }
    else {
        messagerror.style.display="none"
    }
})