import express from 'express'
import fs, { readFile, readFileSync } from 'fs';

const app = express()

app.use(express.json())

//agregar una nota
app.post("/agregar_nota", (req, res)=>{
    const {id, titulo, descripcion, estado} = req.body
    const notas = JSON.parse(fs.readFileSync('notas.json', 'utf-8'))
    const nuevaNota = {id, titulo, descripcion, estado}
    notas.push(nuevaNota)
    fs.writeFileSync('notas.json', JSON.stringify(notas, null, 2))
    //lee el archivo
    res.json({nota: nuevaNota})
    //agrega la nota
})

//editar notas
app.put("/editar_nota/:id", (req, res)=>{
    const idBuscar=req.params.id
    const { titulo, descripcion, estado } = req.body
    const contenido = fs.readFileSync('notas.json', 'utf-8')
    //lee el archivo .json donde se guardan las notas
    const notas = JSON.parse(contenido || "[]")
    //pasa el objeto a texto

    const indice = notas.findIndex(n => n.id == idBuscar)
    if (indice !== -1) {
        notas[indice].titulo = titulo || notas[indice].titulo
        notas[indice].descripcion = descripcion || notas[indice].descripcion
        notas[indice].estado = estado || notas[indice].estado
        //revisa que cambios se mandaron y si no hay cambios, lo deja a como estaba.

        fs.writeFileSync('notas.json', JSON.stringify(notas, null, 2))
        //pasa el texto a objeto .json
        
        res.json({nota: notas[indice] })
    } else {
        res.status(404).json({ mensaje: "No encontré el ID " + idBuscar })
        //indica que id está buscando
    }
})

//eliminar notas
app.delete("/eliminar_nota/:id", (req, res) =>{
    const idBuscar=req.params.id
    const notas = JSON.parse(fs.readFileSync('notas.json', 'utf-8'))

    const indice = notas.findIndex(n => n.id == idBuscar)
    if (indice !=-1){
        notas.splice(indice, 1)
        //busca el indice de la nota y lo elimina, si se pusiera otro numero como: 2
        //se eliminaría esa nota y la que le sigue.
        fs.writeFileSync('notas.json', JSON.stringify(notas, null, 2))
        res.json({ mensaje: "Nota borrada" })
    }else {
        res.status(404).json({ mensaje: "No encontré esa nota" })
    }
})




app.listen(4000, () => {
    console.log(`Servidor en: http://localhost:4000`);
})
