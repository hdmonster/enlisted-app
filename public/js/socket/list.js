const container = document.querySelector('.container')

const socket = io()

socket.on('protocol', msg => {
    console.log(msg)
})

socket.on('lists', lists => {

    var content = ''

    lists.forEach(list => {
        var createdAt = moment(list.createdAt, "DD/MM/YYYY HH:mm:ss").fromNow();
        content += `
            <div class="card">
                <div class="header">
                    <a href="list/${list.id}/view"><span class="title">${list.title}</span></a>
                    <span class="detail">${createdAt} - ${list.author.name}</span>
                </div>
                <div class="icon-container">
                    <i data-feather="chevron-right"></i>
                </div>
            </div>
        `
    })

    container.innerHTML = content


})
