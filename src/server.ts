import fastify from "fastify";
import { z } from "zod";
import fetch from "node-fetch";

const app = fastify();

const urlSchema = z.object({
    url: z.string(),
});

async function getDataBlob(url: string) {
    try {
        const res = await fetch(url);
        const buffer = await res.buffer(); 
        const base64Data = buffer.toString("base64");
        return base64Data;
    } catch (err) {
        console.error("Erro ao obter dados:", err);
        throw err;
    }
}

app.post('/transform', async (request, reply) => {
    try {
        const { url } = urlSchema.parse(request.body);

        const base64Data = await getDataBlob(url);

        return reply.status(200).send(base64Data);
    } catch (err) {
        console.error("Erro na requisição:", err);
        return reply.status(500).send({ error: "Erro ao processar a requisição" });
    }
});

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3147,
}).then(() => {
    console.log('Servidor HTTP rodando');
}).catch(err => {
    console.error('Erro ao iniciar o servidor:', err);
});
