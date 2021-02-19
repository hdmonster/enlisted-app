function shareList(title) { 
    window.location.href = `whatsapp://send?text=${title} - Enlisted %0a %0a${shareContent}` 
} 

function sharePoll(server_code, id, title){
    let url = `https://app.enlistedapp.com/s/${server_code}/poll/${id}/view`
    window.location.href = `whatsapp://send?text=${title} %0a %0aVote here ${url}`
}