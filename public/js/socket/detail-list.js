const entryList = document.querySelector('.entry-container')
const entryCount = document.querySelector('#entries-count')

const socket = io()

socket.on('protocol', msg => {
    console.log(msg)
})

socket.on('count', count => {
    var htmlCount = ''
    htmlCount += `<p>${count} entries </p>`
    entryCount.innerHTML = htmlCount
})

socket.on('entries', entries => {

    var content = ''

    entries.forEach(entry => {
        content += `
            <div class="card-entry">
                <div class="header">
                    <span class="title">${entry.name}</span>
                    <span class="note">${entry.note}</span>
                </div>
            </div>
        `
    })

    entryList.innerHTML = content


})
