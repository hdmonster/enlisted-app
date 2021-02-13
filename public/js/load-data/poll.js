let currentUrl = window.location.href;
let serverIndex = currentUrl.indexOf('/s/')
let lastSlash = currentUrl.lastIndexOf('/')
let serverCode = currentUrl.substring(serverIndex + 3, lastSlash)

const db = firebase.firestore();
const content = document.querySelector('.content');
const loadMore = document.getElementById('load-more');

let currentDate = moment().format("DD/MM/YYYY");
let latestDoc = null;
let polls = '';
let limit = 5
let last;
let snapshot;
let ref;

const getNextList = async () => {
    if(latestDoc == null){
        ref = db.collection(`servers/${serverCode}/polls`)
            .orderBy("createdAt","desc")
            .limit(limit);
    }else{
        ref = db.collection(`servers/${serverCode}/polls`)
        .orderBy("createdAt","desc")
        .startAfter(latestDoc.data().createdAt)
        .limit(limit)
    }
    snapshot = await ref.get();
    
    latestDoc = snapshot.docs[snapshot.docs.length - 1];
      
    snapshot.docs.forEach(doc => {
        let voter = [];
        const getData = doc.data();
        for(voter_id of getData.voter){
            voter.push(voter_id.userId);
        }
        let textEndTime;
        let isAuthor;
        let isBetween;
        getData.isVoted = voter.includes(currentUserId) ? true : false;
        console.log(getData);
       
    });
    
    content.innerHTML = polls;
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

