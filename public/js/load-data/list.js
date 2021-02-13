let currentUrl = window.location.href;
let serverIndex = currentUrl.indexOf('/s/')
let lastSlash = currentUrl.lastIndexOf('/')
let serverCode = currentUrl.substring(serverIndex + 3, lastSlash)

const db = firebase.firestore();
const content = document.querySelector('.content');
const loadMore = document.getElementById('load-more');

let latestDoc = null;
let lists = '';
let limit = 10
let last;
let snapshot;
let ref;
const getNextList = async () => {
    if(latestDoc == null){
        ref = db.collection(`servers/${serverCode}/lists`)
            .orderBy("createdAt","desc")
            .limit(limit);
    }else{
        ref = db.collection(`servers/${serverCode}/lists`)
        .orderBy("createdAt","desc")
        .startAfter(latestDoc.data().createdAt)
        .limit(limit)
    }
    snapshot = await ref.get();
    
    latestDoc = snapshot.docs[snapshot.docs.length - 1];
      
    snapshot.docs.forEach(doc => {
        const getData = doc.data();
        let createdAt = moment(getData.createdAt, "DD/MM/YYYY HH:mm:ss").fromNow();
        lists += `
            <div class="card-list" onclick="navigateNext('${ doc.id }/view')">
                <div class="header">
                    <span class="title">${ getData.title }</span>
                    <span class="detail">${ getData.author.name } - ${ createdAt }</span>
                </div>
                <div class="icon-container">
                    <i data-feather="chevron-right"></i>
                </div>
            </div>
        `
    });
    
    content.innerHTML = lists;
    feather.replace();

    if(snapshot.docs.length < limit){
        loadMore.style.display = "none";
    }
    console.log(snapshot.docs.length);

    if(snapshot.empty){
        loadMore.removeEventListener('click',handleClick);
    }
}

window.addEventListener('DOMContentLoaded',() => getNextList());

const handleClick = () => {
    getNextList();
}

loadMore.addEventListener('click', handleClick);

