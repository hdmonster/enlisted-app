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
        const pollCard = document.querySelectorAll('.poll-card-container.vote-index')
        const progressBar = document.querySelectorAll('.progress-bar')
        const fillProgress = document.querySelectorAll('.progress-bar div')
        const pollRelative = document.querySelectorAll('.poll-relative')

        fillProgress.forEach((fill, i) => {
            let value = progressBar[i].getAttribute('value')

            fill.style.width = value+'%'

            if (value < 34)
                pollRelative[i].style.color = '#3d3d3d'
            else
                pollRelative[i].style.color = 'white'
        });

        setTimeout(function() {
            let delaySec = 0.3
            let index = 0
            pollCard.forEach(card => {
                index++
                
                card.style.opacity = 1
                card.style.transitionDelay = delaySec.toString() + 's'
                
                if (index%5 == 0){
                    delaySec = 0.3
                } else {
                    delaySec += 0.3
                }
                
            })
        }, 100)

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

function hideLoadingAnimation(){
    const spinkit = document.querySelector('.sk-circle')
    spinkit.style.display = 'none'
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
    })
}

function setAvatar(){

    try {
        let avatarurl = document.querySelector('.avatar').getAttribute('url')
        const avatarContainer = document.querySelector('.avatar')

        avatarContainer.style.backgroundImage = `url('${avatarurl}')`
    } catch (e) {
        console.warn('No avatar to set');
    }
    
}

function changeAvatar(){
    document.querySelector('#avatar').click()
}

function filterName() {
    // Declare variables
    var input, filter, container, div, span, i, txtValue;

    input = document.querySelector("#search_bar");
    filter = input.value.toUpperCase();
    container = document.querySelector(".container");
    div = container.getElementsByTagName("div");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < div.length; i++) {
        span = div[i].getElementsByTagName("span")[0];
      if (span) {
        txtValue = span.textContent || span.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            div[i].style.display = "";
        } else {
            div[i].style.display = "none";
        }
      }
    }

    setFilterMsg()
}

function setFilterMsg(){
    try {
        let filterMsg = document.querySelector('.container .filter-msg')
        let divs = document.querySelectorAll('.container div')
    
        //convert to an array
        let divsArray = [].slice.call(divs);
    
        //so now we can use filter
        //find all divs with display none
        let displayNone = divsArray.filter(function(el) {
            return getComputedStyle(el).display === "none"
        });
    
        //and all divs that are not display none
        var displayShow = divsArray.filter(function(el) {
            return getComputedStyle(el).display !== "none"
        });
    
        if (displayShow.length < 1){
            filterMsg.style.display = 'block'
            console.log('no');
        } else {
            console.log('yes');
            filterMsg.style.display = 'none'
        }
    } catch (e) {
        console.warn('No items to filter');
    }
    
}

function loadFirst(){
    const pathUrl = window.location.pathname

    assignActiveServer()
    assignActiveIcon()

    if (pathUrl.includes('list')){
        showPreview()
    } else if (pathUrl.includes('poll')){
        showDatepicker()
    } else if (pathUrl.includes('account') || pathUrl.includes('mahasiswa')) {
        setAvatar()
        
    } else{
        console.warn('No function to load')
    }
    
}




// Load functions on page load
window.onload = loadFirst
