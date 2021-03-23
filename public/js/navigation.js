function navigateNext(target) {
    window.location.href = window.location.href + '/' + target
}

function navigateReplace(target) {
    const currentUrl = window.location.href;

    let lastSlash = currentUrl.lastIndexOf('/');
    let currentDir = currentUrl.substring(lastSlash);
    let newUrl = currentUrl.replace(currentDir, target);

    window.location.href = newUrl;

    console.log(currentUrl);
}

function navigateFromIndex(target) {
    const currentUrl = window.location.href;

    let serverIndex = currentUrl.indexOf('/s/')
    let lastSlash = currentUrl.indexOf('/', serverIndex + 10)
    
    let currentDir = currentUrl.substring(lastSlash)
    
    let newUrl = currentUrl.replace(currentDir, target)

    window.location.href = newUrl;
}

function navigateReplaceAll(target){
    window.location.href = target
}

function openNewTab(target){
    window.open(target)
}

function historyBack(){
    window.history.back()
}

function back(){
    const currentUrl = window.location.href;

    if (currentUrl.includes('account/edit'))
        navigateReplaceAll('/account')

    if (currentUrl.includes('post') || currentUrl.includes('mahasiswa/search'))
        navigateReplace(' ')

    if (currentUrl.includes('mahasiswa') || currentUrl.includes('pengurus'))
        navigateReplace('/home')

    if (currentUrl.includes('view'))
        navigateFromIndex(' ')
        
    if (currentUrl.includes('add-me'))
        navigateReplace('/view')
    else
        console.warn('this route is not implemented yet');

}
