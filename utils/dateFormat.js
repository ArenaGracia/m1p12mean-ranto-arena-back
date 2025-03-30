
function formateDate(dateString) { // ex : 2025-04-01T14:00:00.000Z
    const date = new Date(dateString);

    const formattedDate = date.toLocaleString('fr-FR', {
        weekday: 'long',     // mardi
        year: 'numeric',     // 2025
        month: 'long',       // avril
        day: 'numeric',      // 1
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Paris'
    });
    return formattedDate;
}

module.exports = {
    formateDate
}