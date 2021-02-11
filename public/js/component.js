function showPreview(){
    try {
        const checkBtnSingle = document.querySelector('#btn-single')
    
        const previewSingle = document.querySelector('.preview-single')
        const previewDouble = document.querySelector('.preview-double')
    
        previewSingle.style.display = checkBtnSingle.checked ? 'block' : 'none'
        previewDouble.style.display = checkBtnSingle.checked ? 'none' : 'block'
    } catch(e) {
        console.warn('No list preview')
    }
    
}

function showDatepicker(){
    try {
        const openPoll = document.querySelector('#openPoll')

        const datepicker = document.querySelector('.datetime_wrapper')
    
        datepicker.style.display = openPoll.checked ? 'none' : 'block'
    } catch(e) {
        console.warn('No datepicker found')
    }
}

function addOption(){
    const additional_option_container = document.createElement("div");

    const option_container = document.querySelector('.additional-option-input_container')

    const option = index => {
        return `
            <input class="txt-field-fill_grey" autocomplete="off" type="text" name="vote_option[]" placeholder="Option ${index}">
        `
    }

    count = option_container.childElementCount + 3

    additional_option_container.innerHTML += option(count)

    option_container.appendChild(additional_option_container);
}

function setProgressBar(){
    try {
        const progressBar = document.querySelectorAll('.progress-bar')
        const fillProgress = document.querySelectorAll('.progress-bar div')

        fillProgress.forEach((fill, i) => {
            let value = progressBar[i].getAttribute('value')

            fill.style.width = value+'%'

            if (value < 34)
                fill.style.color = '#3d3d3d'
            else
                fill.style.color = 'white'
        });

    } catch(e){
        console.warn('No polls found')
    }
}

function showToast(type, msg) {
    const toast = document.querySelector("#snackbar")

    toast.className = "show"
    toast.innerHTML = msg

    if(type == 'success')
        toast.style.background = 'green'
    else
        toast.style.background = 'crimson'

    setTimeout(() => toast.className = toast.className.replace("show", "") , 3000);
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

    try{
        if (pathUrl.includes('list'))
            listIcon.classList.add("nav__link--active");
        else if (pathUrl.includes('poll'))
            pollIcon.classList.add("nav__link--active");
        else if (pathUrl.includes('announcement'))
            announcementIcon.classList.add("nav__link--active");
        else
            homeIcon.classList.add("nav__link--active");
    } catch(e) {
        console.warn('No bottom nav detected')
    }
}

function assignActiveServer(){
    const pathUrl = window.location.pathname

    const serverItems = document.querySelectorAll('.server-item')
    const itemBorders = document.querySelectorAll('.server-item .border')

    serverItems.forEach((item, i) => {
        let server_id = item.getAttribute('id')
        let itemBorder = itemBorders[i]

        if (pathUrl.includes(server_id))
            itemBorder.classList.add('active')
            console.log('active');

    })
}

function loadFirst(){
    const pathUrl = window.location.pathname


    assignActiveServer()
    assignActiveIcon()

    if (pathUrl.includes('list')){
        showPreview()
    } else if (pathUrl.includes('poll')){
        setProgressBar()
        showDatepicker()
    } else{
        console.warn('No function to load')
    }
    
}


// Load functions on page load
window.onload = loadFirst
