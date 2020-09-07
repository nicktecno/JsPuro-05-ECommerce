const Mask = {
    apply(input, func) {
        setTimeout(function () {
            input.value = Mask[func](input.value)

        }, 1) //Após 1 microsegundo ele executa a função
    },

    formatBRL(value) {
        value = value.replace(/\D/g, "") //Expressão Regular para trocar tudo que não é dígito por vazio, g de global para todos os digitos não apenas 1

        return new Intl.NumberFormat('pt-br', {
            style: 'currency',
            currency: 'BRL'

        }).format(value / 100)
    }



}

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files:[],


    handleFileInput(event) {
        const { files: fileList } = event.target //Chamou o valor do input dentro de um objeto files com um elemento Filelist
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return



        Array.from(fileList).forEach(file => { 
            //para cada arquivo selecionado


            PhotosUpload.files.push(file)

            const reader = new FileReader() //Constructor ler arquivos
            reader.onload = () => { //Quando ele estiver pronto ele executa a arrow
                const image = new Image() //é como criar uma tag no html <img>
                image.src = String(reader.result)
                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)

            }
            reader.readAsDataURL(file) //Quando as fotos tiverem carregado ele le e manda o file



        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    
    },

    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const {files:fileList} = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item =>{
            if (item.classList && item.classList.value =="photo")
            photosDiv.push(item)


        })

    const totalPhotos = fileList.length + photosDiv.length
    if (totalPhotos > uploadLimit){
        alert("Você atingiu o limite máximo de fotos")
        event.preventDefault()
        return true
    }

    },
    getAllFiles(){
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer() //para o mozzila ou chrome reconhecer o comando


        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))
        
        return dataTransfer.files

    },

    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')
        div.onclick = PhotosUpload.removePhoto
        div.appendChild(image)
        div.appendChild(PhotosUpload.getRemoveButton())
        return div
    },

getRemoveButton() {
    const button = document.createElement("i")
    button.classList.add("material-icons")
    button.innerHTML = "close"
    return button
},
removePhoto(event) {
    const photoDiv = event.target.parentNode //<div class="photo">
    const photosArray = Array.from(PhotosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)
    PhotosUpload.files.splice(index,1)
    PhotosUpload.input.files = PhotosUpload.getAllFiles()


    photoDiv.remove()

},
removeOldPhoto(event){
    const photoDiv = event.target.parentNode
    if(photoDiv.id) {
        const removedFiles = document.querySelector("input[name='removed_files'")
        if (removedFiles){
            removedFiles.value += `${photoDiv.id},` //Acrescenta o valor do id da photo a cada vez que o onclick do HTML for acionado

        }
    }

    photoDiv.remove()

}





}
