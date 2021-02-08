function joinServer() {
    const server_code = document.querySelector('#server_code').value

    window.location = '/join/' + server_code
}