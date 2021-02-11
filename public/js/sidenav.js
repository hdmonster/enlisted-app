const server_items = document.querySelectorAll('.server-item')

function openNav() {
    document.querySelector("#mySidenav").style.width = "250px";

    server_items.forEach(server_item => {
        server_item.style.visibility = 'visible'
        server_item.style.opacity = 1
    })

}
  
/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
    document.querySelector("#mySidenav").style.width = "0";

    server_items.forEach(server_item => {
        server_item.style.visibility = 'hidden'
        server_item.style.opacity = 0
    })
}