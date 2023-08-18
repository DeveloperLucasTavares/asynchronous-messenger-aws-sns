import express from "express"
import cors from "cors"

const app = express();
const data = []

app.use(express.json({type: ['text/*', '*/json']}))
app.use(cors())

app.get("/", (request, response) => {
    console.log("Obtendo estatísticas...(GET)")

    response.send(data)
})

app.post("/", (request, response) =>{
    console.log("Nova mensagem recebida...(POST)")

    if(request.body.SubscribeURL) {
        console.log("-> URL para inscrição: " + request.body.SubscribeURL)
    }

    if(request.body.Message){
        console.log("-> Mensagem: " + request.body.Message)
    }

    data.push({
        message: request.body.Message,
        timestamp: new Date(),
        SubscribeURL: request.body.SubscribeURL
    })

    response.send({ok: true})
})

app.listen(3005, ()=>{
    console.log("Microsserviço em Execução!")
})