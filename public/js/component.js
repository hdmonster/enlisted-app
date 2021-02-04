function showPreview(){
    let checkBtnSingle = document.querySelector('#btn-single')
    
    let previewSingle = document.querySelector('.preview-single')
    let previewDouble = document.querySelector('.preview-double')

    previewSingle.style.display = checkBtnSingle.checked ? 'block' : 'none'
    previewDouble.style.display = checkBtnSingle.checked ? 'none' : 'block'
}

function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}

function assignActiveIcon(){
    const homeIcon = document.querySelector('.bottom-nav .home_icon')
    const listIcon = document.querySelector('.bottom-nav .list_icon')
    const pollIcon = document.querySelector('.bottom-nav .poll_icon')
    const announcementIcon = document.querySelector('.bottom-nav .announcement_icon')

    pathUrl = window.location.pathname

    if (pathUrl.includes('list')) 
        listIcon.classList.add("nav__link--active");
    else if (pathUrl.includes('poll')) 
        pollIcon.classList.add("nav__link--active");
    else if (pathUrl.includes('announcement')) 
        announcementIcon.classList.add("nav__link--active");
    else
        homeIcon.classList.add("nav__link--active");
}

window.onload = assignActiveIcon