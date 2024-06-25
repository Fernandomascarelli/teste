import fastify from "fastify";
import { z } from "zod";
import fetch from "node-fetch";
import fs from "fs/promises";

const app = fastify();

app.post('/transform', (request, reply) => {
    const urlSchema = z.object({
        url : z.string(),
    })

    const { url } = urlSchema.parse(request.body);

    async function getDataBlob(url: string) {
        try {
          const res = await fetch(url);
          const buffer = await res.buffer(); 
      
          const base64Data = buffer.toString("base64");
      
          return base64Data;
        } catch (err) {
          console.error("Ero:", err);
          throw err;
        }
      }
      
      getDataBlob(url)
        .then((base64Data) => {
          console.log("Base64:", base64Data);
        })
        .catch((err) => {
          console.error("Ero:", err);
        });

        return reply.status(200).send(getDataBlob(url))

})


app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3147,
}).then(() => {
    console.log('HTTP Server Running')
})
