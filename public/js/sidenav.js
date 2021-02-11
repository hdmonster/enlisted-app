const server_container = document.querySelector('.server-container')
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

// Socket connection

const socket = io()

socket.on('server_changes', change => {
    console.log('receiving changes');

    if (change.type === 'added') {
        console.log('New server: ', change.data);
        renderServerItem(change.data)
    }
    if (change.type === 'modified') {
        console.log('Modified server: ', change.data);
    }
    if (change.type === 'removed') {
        console.log('Removed server: ', change.data);
    }
})

// Render server item

async function renderServerItem(data) {
    console.log('appending', data)

    const { server_id, icon, name } = data

    const server_item_wrapper = document.createElement("div");

    const server_item = await `
        <div class="server-item" id="${server_id}" onclick="navigateReplaceAll('/s/${server_id}/home')" style="visibility: visible; opacity: 1;">
            <div class="border"></div>
            <div class="server-info">
                <img src="${icon}" alt="server logo">
                <span class="title">${name}</span>
            </div>
        </div>
    `
    server_container.innerHTML += server_item

    //server_container.appendChild(server_item_wrapper)

    console.log('object appended');
}