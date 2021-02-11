const container = document.querySelector('.list')

const socket = io()

socket.on('protocol', msg => {
    console.log(msg)
})

socket.on('lists', lists => {

    var content = ''

    lists.forEach(list => {
        var createdAt = moment(list.createdAt, "DD/MM/YYYY HH:mm:ss").fromNow();
        content += `
            <div class="card-list" onclick="navigateNext('${list.id}/view')">
                <div class="header">
                    <span class="title">${list.title}</span>
                    <span class="detail">${list.author.name.split('AKA ')[1]} - ${createdAt}</span>
                </div>
                <div class="icon-container">
                    <i data-feather="chevron-right"></i>
                </div>
            </div>
        `
    })

    container.innerHTML = content


})
