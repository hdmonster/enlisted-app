const entryList = document.querySelector('.entry-list')
const entryCount = document.querySelector('.entry-count')

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
            <p>
                <b>${entry.displayName}</b><br>
                ${entry.note}
            </p>
        `
    })

    entryList.innerHTML = content


})
