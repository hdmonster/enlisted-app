let currentUrl = window.location.href;
let serverIndex = currentUrl.indexOf('/s/')
let lastSlash = currentUrl.lastIndexOf('/')
let serverCode = currentUrl.substring(serverIndex + 3, lastSlash)

const db = firebase.firestore();
const content = document.querySelector('.content');
const btnLoadMore = document.querySelector('#load-more');
const loadMoreContainer = document.querySelector('.load-more');
let currentDate = moment().format("DD/MM/YYYY");
let format = 'DD/MM/YYYY'
let latestDoc = null;
let limit = 5
let last;   
let snapshot;
let ref;    
let poll_count = 0;

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
    
    // Stop showing spinkit
    hideLoadingAnimation()
    
    snapshot.docs.forEach(doc => {
        let voter = [];

        let getData = doc.data();
        for(voter_id of getData.voter){
            voter.push(voter_id.userId);
        }
        getData.isVoted = voter.includes(currentUserId) ? true : false;
       
        if(getData.isVoted === true){
            pollCardVoted(getData, doc.id, serverCode)
        } else {
            pollCardVote(getData, doc.id, serverCode)
        }

        poll_count += 1
    });

    
    feather.replace();  

    if(snapshot.docs.length < limit){
        loadMoreContainer.style.display = "none";
    } else {
        loadMoreContainer.style.display = "flex";
    }

    if (poll_count < 1) {
        content.innerHTML = 'No recent poll'    
    }

    if(snapshot.empty){
        btnLoadMore.removeEventListener('click',handleClick);
    }

    setProgressBar()
}

window.addEventListener('DOMContentLoaded',() => getNextList() )

const handleClick = () => getNextList()

btnLoadMore.addEventListener('click', handleClick);

