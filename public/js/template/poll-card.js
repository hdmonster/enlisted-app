// Poll template

const pollCardVoted = (getData) => {
    let polls = '';
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


    polls += `
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
                poll
            </div>
        </div>
    `

    parentContainer.innerHTML += polls

    content.appendChild(parentContainer)
}

const pollCardVote = (getData) => {
    let polls = '';
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

// End of poll template