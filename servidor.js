import express from "express"
import aws from "aws-sdk"
import axios from "axios"

const app = express();

const path = process.env.PWD + "/static"

app.use(express.static(path))
app.use(express.json())

aws.config.update({region: 'us-east-1'})

const sns = new aws.SNS()

app.get("/sistemas_inscritos", async (request, response) => {
    sns.listSubscriptionsByTopic({
            TopicArn: "arn:aws:sns:us-east-1:798616186501:isso-e-um-teste"
        },
        async (erro, dados) =>{
            if(erro) {
                console.log('[ERRO] Falha ao obter inscritos...')
                return
            }

            let result = []

            for (let index = 0; index < dados.Subscriptions.length; index++) {
                const subscribers = dados.Subscriptions[index];

                console.log("Obtendo dados para o inscrito..." + subscribers.Endpoint)
                
                await axios({
                    method: "get",
                    url: subscribers.Endpoint,
                    timeout: 1000
                }).then((response)=>{
                    result.push ({
                        url: subscribers.Endpoint,
                        itensProcessados: response.data.length,
                        disponivel: true,
                    })
                }).catch((e) =>{
                    console.log("Erro na requisição!")
                    result.push({
                        url: subscribers.Endpoint,
                        disponivel: false,
                    })
                })
            }

            response.json(result)
        }
    )
})

app.post("/enviar_mensagem", (request, response) => {
    const promiseResposta = sns.publish({
        Message: "Isso é um teste",
        TopicArn: "arn:aws:sns:us-east-1:798616186501:isso-e-um-teste"
    }).promise()

    promiseResposta.then(()=> {
        console.log("Mensagem Enviada")
    }).catch((e)=> console.log("Erro no envio da mensagem!", e))
})

app.listen(8080, ()=> {
    console.log("Aplicativo Rodando!")
})