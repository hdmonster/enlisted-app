const entryList = document.querySelector('.entry-container')
const entryCount = document.querySelector('#entries-count')
let shareContent = ''

const socket = io()

socket.on('protocol', msg => {
    console.log(msg)
})

socket.on('count', count => {
    let htmlCount = ''
    htmlCount += `<p>${count} entries </p>`
    entryCount.innerHTML = htmlCount
})

socket.on('entries', entries => {

    let content = ''
    shareContent = ''

    let i = 1;
    entries.forEach(entry => {
        content += `
            <div class="card-entry">
                <div class="header">
                    <span class="title">${entry.name}</span>
                    <span class="note">${entry.note}</span>
                </div>
            </div>
        `

        shareContent += `${i++}. ${entry.name} ${entry.note} %0a`
    })

    entryList.innerHTML = content


})
