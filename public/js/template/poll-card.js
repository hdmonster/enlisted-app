// Poll template

const pollCardVoted = (getData, id, serverCode) => {
    let textEndTime;
    let isAuthor;
    let isBetween;
    let polls = '';
    const cardContainer = document.createElement('DIV')
    cardContainer.classList.add('poll-card-container')
    cardContainer.classList.add('vote-index')

    isBetween = moment(currentDate, format).isBetween(moment(getData.settings.availability.startDate, format), moment(getData.settings.availability.endDate, format), undefined, '[]')

    if(!getData.settings.isAlwaysAvailable && moment(currentDate, format).isBefore(moment(getData.settings.availability.startDate, format))){
        textEndTime = "Opens " + moment(getData.settings.availability.startDate, "DD/MM/YYYY 00:00:00").fromNow();
    }

    if(!getData.settings.isAlwaysAvailable && isBetween){
        textEndTime = "Ends " + moment(getData.settings.availability.endDate, "DD/MM/YYYY HH:mm:ss").fromNow();
    }

    if(getData.settings.isAlwaysAvailable){
        textEndTime = "Always Available"
    }
    
    if (getData.author.userId == currentUserId){
        isAuthor = `<a href="/api/${ serverCode }/poll/${ id }/update">` +  getData.settings.showAfterVote ? 'Hide results' : 'Show results' + `</a>`;
    }else{
        isAuthor = `<span>Thanks for the response!</span>`
    }
    
    let isEnded = !getData.settings.isAlwaysAvailable && moment(currentDate).isAfter(getData.settings.availability.endDate) ? 'Polls ended' : '';
    let voterCount = getData.voter.length;

    let voteOptions = ''

    for(let i = 0; i < getData.option.length; i++){
        let percentage = Math.round((getData.option[i].count/voterCount) * 100);
        percentage = getData.settings.showAfterVote ?  percentage : getData.settings.isAlwaysAvailable && !getData.settings.showAfterVote ? '0' : currentDate > getData.settings.availability.endDate && !getData.settings.showAfterVote ?  percentage : '0'; 
        
        voteOptions += `<div class="progress-bar_wrapper">
            <div class="progress-bar" value="${ percentage }">
                <div>
                    <span>${ getData.option[i].item }</span>
                    <span class="percentage">${ percentage }%</span>
                </div>
            </div> 
        </div>`
    }    

    let voteButton = ''

    if (getData.author.userId == currentUserId) { 
        voteButton = `<a href="/api/${serverCode}/poll/${id}/update">${getData.settings.showAfterVote ? 'Hide results' : 'Show results'}</a>`
    } else {
        voteButton = '<span>Thanks for the response!</span>'
    }


    polls += `
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
            ${voteOptions}
        </div>

        <div class="vote-btn_wrapper">
            ${voteButton}
        </div>
    `

    cardContainer.innerHTML += polls

    content.appendChild(cardContainer)
}

const pollCardVote = (getData, id, serverCode) => {
    let textEndTime;
    let isBetween;
    let polls = '';
    const cardContainer = document.createElement('DIV')
    cardContainer.classList.add('poll-card-container')
    cardContainer.classList.add('vote-index')

    isBetween = moment(currentDate, format).isBetween(moment(getData.settings.availability.startDate, format), moment(getData.settings.availability.endDate, format), undefined, '[]')

    if(!getData.settings.isAlwaysAvailable && moment(currentDate, format).isBefore(moment(getData.settings.availability.startDate, format))){
        textEndTime = "Opens " + moment(getData.settings.availability.startDate, "DD/MM/YYYY 00:00:00").fromNow();
    }

    if(!getData.settings.isAlwaysAvailable && isBetween){
        textEndTime = "Ends " + moment(getData.settings.availability.endDate, "DD/MM/YYYY HH:mm:ss").fromNow();
    }

    if(getData.settings.isAlwaysAvailable){
        textEndTime = "Always Available"
    }

    let voterCount = getData.voter.length;

    let voteOptions = ''

    for(let i = 0; i < getData.option.length; i++){
        let percentage = Math.round((getData.option[i].count/voterCount) * 100);
        percentage = getData.settings.showAfterVote ?  percentage : getData.settings.isAlwaysAvailable && !getData.settings.showAfterVote ? '0' : currentDate > getData.settings.availability.endDate && !getData.settings.showAfterVote ?  percentage : '0'; 
        
        voteOptions += `
            <input type="radio" id="vote-btn-${i}-${id}" name="vote_option" value="${getData.option[i].item}">
            <label for="vote-btn-${i}-${id}" class="btn">${getData.option[i].item}</label>
        `
    }   

    polls += `
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

        <form action="/api/${serverCode}/poll/${id}/vote" method="post">
            <div class="poll-wrapper">
                ${voteOptions}
            </div>
            <div class="vote-btn_wrapper">
                <button type="submit" class="btn-lg" ${getData.settings.isAlwaysAvailable ? '' : isBetween ? '' : 'disabled'}>vote</button>
            </div>
        </form>
    `

    cardContainer.innerHTML += polls

    content.appendChild(cardContainer)
}

// End of poll template