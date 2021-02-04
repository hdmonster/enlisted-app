function navigateNext(target) {
    window.location.href = window.location.href + '/' + target
}

function navigateReplace(target) {
    currentUrl = window.location.href

    let lastSlash = currentUrl.lastIndexOf('/')
    let currentDir = currentUrl.substring(lastSlash + 1)
    let newUrl = currentUrl.replace(currentDir, target)

    window.location.href = newUrl

    console.log(newUrl);
}

function back(){
    window.history.back()
}


