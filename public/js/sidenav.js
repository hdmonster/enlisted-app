const server_items = document.querySelectorAll('.server-item')
const overlay = document.querySelector('.overlay')

function openNav() {
    on()
    document.querySelector("#mySidenav").style.transform = "translateX(0)";

    server_items.forEach(server_item => {
        server_item.style.visibility = 'visible'
        server_item.style.opacity = 1
    })
}
  
/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
    off()

    document.querySelector("#mySidenav").style.transform = "translateX(-250px)";

    server_items.forEach(server_item => {
        server_item.style.visibility = 'hidden'
        server_item.style.opacity = 0
    })
}

// Overlay

overlay.addEventListener('click', () => closeNav())

function on() {
    overlay.style.height = '100%'
    overlay.style.opacity = 1;
}

function off() {
    overlay.style.opacity = 0;
    setTimeout(function() { overlay.style.height = 0}, 300)
}