const multer = require ('multer')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')//configura onde vai ser salvo o arquivo
},
filename:(req, file, cb) => {
    cb(null, `${Date.now().toString()}-${file.originalname}` )//coloca o nome original com a data na frente
}
})

const fileFilter= (req, file, cb) => { //filtro no backend para imagens
    const isAccepted = ['image/png', 'image/jpg', 'image/jpeg']. //para cada tipo de arquivo o fin vai ver se ele valida com esse mimetype
    find(acceptedFormat => acceptedFormat == file.mimetype)

    if(isAccepted){
        return cb(null, true);
    }

    return cb(null, false)


}

module.exports = multer({
    storage,
    fileFilter

})