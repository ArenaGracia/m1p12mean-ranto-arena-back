
// conversion d'une image en string en Buffer
function prepareImageToInsert (image) {
    let base64Image = image.replace(/\s/g, ''); // Supprimer les espaces indésirables
    const matches = base64Image.match(/^data:image\/\w+;base64,/); // enlever le préfixe "data:image/jpeg;base64,"
    if (matches) {
        base64Image = base64Image.split(',')[1];
    }
    return Buffer.from(base64Image, 'base64');
}

module.exports = {
    prepareImageToInsert
}