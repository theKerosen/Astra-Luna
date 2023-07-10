import { AstraLuna } from "../utils/Client";
import { checkStatus } from "./checkCSStatus";
export const Init = async (client: AstraLuna) => {
  await checkStatus();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client.application?.commands.set(client.commands.map((v: any) => v.data));
  client.user?.setStatus("idle");
  setInterval(() => {
    const randomStatus = [
      "Conversando com o Game Coordinator",
      "Pensando em pedir um lanche.",
      "Conversando sobre onde ir jantar com o Game Coordinator.",
      "Arrumando databases...",
      "Lendo um livro sobre livros...",
      "Calculando o XP de alguém aleatório...",
      "Oop! Desconectei um cabo sem querer, e agora?",
      "O que diabos é um protobuf?",
      "Gostei desta sugestão!",
      "@CS eu gosto de batata",
      "<insira frase completamente engraçada aqui>",
      "@neko.lunx dorme para caramba",
    ];
    client.user?.setActivity({
      name: randomStatus[Math.floor(Math.random() * randomStatus.length)],
    });
  }, 60000);
};
