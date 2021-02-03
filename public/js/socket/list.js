const container = document.querySelector('.container')

const socket = io()

socket.on('protocol', msg => {
    console.log(msg)
})

socket.on('lists', lists => {

    var content = ''
    
    lists.forEach(list => {
        createdAt = moment(list.createdAt, "DD/MM/YYYY HH:mm:ss").fromNow();

        content += `
            <div class="card">
                <div class="header">
                    <span class="title">${list.title}</span>
                    <span class="detail">${createdAt} - ${list.author}</span>
                </div>
                <div class="icon-container">
                    <i data-feather="chevron-right"></i>
                </div>
            </div>
        `
    })

    //container.innerHTML = content
    
    
})