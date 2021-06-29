const axios = require('axios');

const LANG = 'C#';
const USER = 'takenet';

async function getReps(page, respBefore = []) {
  try {
    const response = await axios.get(`https://api.github.com/users/${USER}/repos?q=&type=public&sort=created&direction=asc&page=${page}`);
    if(response && response.data && response.data.length > 0){
      // Adiciona a resposta da requisição ao array anterior, filtrando apenas os repositórios com linguagem especificada
      const respCShap = respBefore.concat(response.data.filter((i)=>{return i.language === LANG}));
      if(respCShap.length > 4){
        // Se houver mais 5 ou mais repositórios, retorna com a resposta
        return respCShap;
      }
      // Enquanto não houver 5 ou mais repositórios, busca nas páginas seguintes até que não existam mais respostas.
      return await getReps(page + 1, respCShap);
    }
    return [];  
  } catch (error) {
    return [];
  }
}

exports.getRepositorios = async (_req, res) => {
  try {
    // Função recursiva que enquanto não recuperar os 5 primeiros repositórios em C# segue realizando buscas nas páginas seguintes.
    let reps = await getReps(1);
    if(reps.length > 0){
      // Trata para exibir apenas os 5 primeiros
      reps = reps.slice(0, 5);
      const response = reps.map((rep)=>{
        return {
          header: {
            type: "application/vnd.lime.media-link+json",
            value: {
                title: rep.name,
                text: rep.description,
                type: "image/jpeg",
                uri: rep.owner.avatar_url
            }
          }
        }
      });
        return res.status(200).send({
            itemType: "application/vnd.lime.document-select+json",
            items: response
        });
    }
    return res.status(406).send({msg: 'Nenhum repositório encontrado'});
  } catch (error) {
    return res.status(500).send({msg: 'Serviço indisponível no momento'});
  }
};

