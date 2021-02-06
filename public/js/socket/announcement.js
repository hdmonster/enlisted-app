const annContent = document.querySelector('.content')

const socket = io()

socket.on('protocol', msg => {
    console.log(msg)
})

socket.on('announcements', announcements => {

    var content = ''

    announcements.forEach(announcement => {
        var createdAt = moment(announcement.createdAt, "DD/MM/YYYY HH:mm:ss").fromNow();
        content += `
            <div class="card-list" onclick="navigateNext('${announcement.id}/view')">
                <div class="header">
                    <span class="title">${announcement.title}</span>
                    <span class="detail">${announcement.author.name.split('AKA ')[1]} - ${createdAt}</span>
                </div>
                <div class="icon-container">
                    <i data-feather="chevron-right"></i>
                </div>
            </div>
        `
    })

    annContent.innerHTML = content
    feather.replace()


})
