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
        let getData = doc.data();
        for(voter_id of getData.voter){
            voter.push(voter_id.userId);
        }
        let textEndTime;
        let isAuthor;
        let isBetween;
        getData.isVoted = voter.includes(currentUserId) ? true : false;
        //console.log(getData);
       
        if(getData.isVoted === true){
            pollCardVoted(getData)
        } else {
            pollCardVote(getData)
        }
    });
    
    feather.replace();

    if(snapshot.docs.length < limit){
        loadMore.style.display = "none";
    }
    console.log(snapshot.docs.length);

    if(snapshot.empty){
        loadMore.removeEventListener('click',handleClick);
    }
}


const pollCardVoted = (getData) => {
    const parentContainer = document.createElement('DIV')

    isBetween = moment(currentDate).isBetween(getData.settings.availability.startDate, getData.settings.availability.endDate, undefined, '[]');

    if(!getData.settings.isAlwaysAvailable && moment(currentDate).isAfter(getData.settings.availability.endDate)){
        textEndTime = "Polls ended"
    }
    if(!getData.settings.isAlwaysAvailable && isBetween){
        textEndTime = "Ends " + moment(getData.settings.availability.endDate, "DD/MM/YYYY HH:mm:ss").fromNow();
    }
    if(getData.settings.isAlwaysAvailable){
        textEndTime = "Always available"
    }
    
    if (getData.author.userId == currentUserId){
        isAuthor = `<a href="/api/${ serverCode }/poll/${ getData.id }/update">` +  getData.settings.showAfterVote ? 'Hide results' : 'Show results' + `</a>`;
    }else{
        isAuthor = `<span>Thanks for the response!</span>`
    }
    
    let isEnded = !getData.settings.isAlwaysAvailable && moment(currentDate).isAfter(getData.settings.availability.endDate) ? 'Polls ended' : '';
    let voterCount = getData.voter.length;

    polls += `
        Voted
        <div class="poll-card-container">
            <div class="info_wrapper">
                <span class="author">${ getData.author.name }</span>
                <span class="end-time">
                    ${ textEndTime }
                </span>
            </div>
            
            <div class="question_wrapper">
                <span>
                    ${ getData.question }
                </span>
            </div>

            <div class="poll-wrapper">
                `
                    for(let i=0; i < getData.option.length; i++){
                        let percentage = Math.round((getData.option[i].count/voterCount) * 100);
                        percentage = getData.settings.showAfterVote ?  percentage : getData.settings.isAlwaysAvailable && !getData.settings.showAfterVote ? '0' : currentDate > getData.settings.availability.endDate && !getData.settings.showAfterVote ?  percentage : '0'; 
                        
                        `<div class="progress-bar_wrapper">
                            <div class="progress-bar" value="${ percentage }">
                                <div>
                                    <span>${ getData.option[i].item }></span>
                                    <span class="percentage">${ percentage }%</span>
                                </div>
                            </div> 
                        </div>`
                    } 
                `
            </div>
        </div>
    `

    parentContainer.innerHTML += polls

    content.appendChild(parentContainer)
}

const pollCardVote = (getData) => {
    const parentContainer = document.createElement('DIV')
    
    isBetween = moment(currentDate).isBetween(getData.settings.availability.startDate, getData.settings.availability.endDate, undefined, '[]')

    if(!getData.settings.isAlwaysAvailable && moment(currentDate).isBefore(getData.settings.availability.startDate)){
        textEndTime = "Opens " + moment(getData.settings.availability.startDate, "DD/MM/YYYY 00:00:00").fromNow();
    }

    if(!getData.settings.isAlwaysAvailable && isBetween){
        textEndTime = "Ends " + moment(getData.settings.availability.endDate, "DD/MM/YYYY HH:mm:ss").fromNow();
    }

    if(getData.settings.isAlwaysAvailable){
        textEndTime = "Always Available"
    }

    polls += `
        Not voted
        <div class="poll-card-container">
            <div class="info_wrapper">
                <span class="author">${ getData.author.name }</span>
                <span class="end-time">
                    ${ textEndTime }
                </span>
            </div>
            
            <div class="question_wrapper">
                <span>
                    ${ getData.question }
                </span>
            </div>
        </div>
    `

    parentContainer.innerHTML += polls

    content.appendChild(parentContainer)
}

window.addEventListener('DOMContentLoaded',() => getNextList());

const handleClick = () => {
    getNextList();
}

loadMore.addEventListener('click', handleClick);

