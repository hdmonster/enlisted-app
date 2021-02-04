function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.querySelector(".master-container").style.marginLeft = "250px";
    document.querySelector(".master-container").style.backgroundColor = "rgba(0,0,0,0.4)";
}
  
/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.querySelector(".master-container").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
}