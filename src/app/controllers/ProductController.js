const {formatPrice} = require('../../lib/utils')
const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')




module.exports = {


    // create foi feito com promises

create(req, res){
        //Pegar Categorias
        
        Category.all()
        .then(function(results){

            // Promessa linkada no models

            const categories = results.rows
            return res.render("products/create.njk", {categories})


            // Tratativa de erro

        }).catch(function(err){
            throw new Error(err)
        })
        
        
    
    
    
    },

async post (req, res){
        //Lógica de Salvar feito com async and await
        const keys = Object.keys(req.body) 

        for(key of keys){
    
        if(req.body[key] == ""){
            return res.send("Por favor, preencha todos os campos")
        }
        }


        if (req.files.length == 0)
            return res.send("Por favor insira ao menos uma imagem")

            let results = await Product.create(req.body)
            const productId = results.rows[0].id
        
            const filesPromise = req.files.map(file => File.create({...file, product_id: productId})) //.map transforma em array cada arquivo em upload
                await Promise.all(filesPromise) //Agora ele cria, ele espera cada arquivo ser carregado, porque antes só criou a array
            
            return res.redirect(`/products/${productId}/edit`)


        
        

        
        
        
        
        },

show(req,res){
    return res.render("products/show")
},

async edit(req, res){
    

    let results = await Product.find(req.params.id)
        const product = results.rows[0]

    if (!product) return res.send("Product not found!")

    product.old_price = formatPrice(product.old_price)
    product.price = formatPrice(product.price)

        
    // get categories
    results = await Category.all()
    const categories = results.rows
        


    //get images
    results = await Product.files(product.id)
    let files = results.rows
    files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public','')}` //pega o http ou https na barra de endereço o .host pega o endereço completo e a substituição do public por vazio é pq o endereço da foto nao tem public por causa daquela configuração static

    }))



        return res.render(`products/edit.njk`, {product, categories, files})
        

    },


    async put(req, res){
    const keys = Object.keys(req.body) 

        for(key of keys){

    
        if(req.body[key] == "" && key != "removed_files"){
            return res.send("Por favor, preencha todos os campos")
        }
        }
        
        //lógica para acrescentar arquivos no atualizar

        if (req.files.length != 0){
            const newFilesPromise = req.files.map(file =>
                File.create({...file, product_id: req.body.id}))

                await Promise.all(newFilesPromise)
        }

        if (req.body.removed_files){
            const removedFiles = req.body.removed_files.split(",") //pega o 1,2,3 e transforma em array [1,2,3,com esse espaço que tem q ser eliminado na linha de codigo abaixo]
            const lastIndex = removedFiles.length - 1 //Tira o zero vivo pq se tem 1,2,3 a posição é 0,1,2 entao ficaria 3-1=2 posição 2 ultima posição
            removedFiles.splice(lastIndex, 1) //pega a ultima posição que pegamos acima e retira
        
        const removedFilesPromise = removedFiles.map(id => File.delete(id)) //function(id){ return File.delete(id)} Esse id é a sequencia de numeros que tivemos acima
        await Promise.all(removedFilesPromise) // Promise para array
        }

        
        req.body.price = req.body.price.replace(/\D/g,"")
        
        //Como o price foi modificado no Frontend tem q pegar o valor antigo do price no req.body formulário
        if(req.body.old_price != req.body.price){
            const oldProduct = await Product.find(req.body.id)
            req.body.old_price = oldProduct.rows[0].price
        
        await Product.update(req.body)

        return res.redirect(`/products/${req.body.id}/edit`)
        
        }

},
async delete(req, res){
    await Product.delete(req.body.id)
    return res.redirect('/products/create')
}


}