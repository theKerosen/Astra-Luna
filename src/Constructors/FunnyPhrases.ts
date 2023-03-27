export class FunnyPhrasesGen {
  constructor(userID_1: string, userID_2: string) {
    const array: string[] = [
      `<@${userID_1}> confiou na call do cachorro enquanto <@${userID_2}> não comprou nada, assim nem ganhou nem perdeu. <@${userID_2}> Venceu.`,
      `<@${userID_1} estava indo para a casa do amigo, mas quando chegou lá o <@${userID_2}> estava com a mãe dele. <@${userID_2}> Venceu.`,
      `<@${userID_1}> pensou que a vida é mamão com açúcar e começou a discussão, mas quando <@${userID_1}> discutia, <@${userID_2}> estava com sua tia! <@${userID_2}> Venceu.`,
      `Podem falar que sou assim e assado, mas quando o <@${userID_1}> e o <@${userID_2}> falam eu coloco eles de qua- opa, ganhei.`,
      `Dessa vez não é bait! <@${userID_1}> realmente acertou enquanto <@${userID_2}> só criticou, <@${userID_1}> venceu. `,
      `<@${userID_1}>, isso não é dica de investimento! <@${userID_2}> Venceu.`,
      `Rosas são vermelhas, violetas são azuis, <@${userID_2}> caiu no bait, pois cachorro1337 (<@${userID_2}>) o seduz! `,
      `<@${userID_1}> é o tipo de gente que posta vídeo que deu skin e depois de 8 dias pede a skin de volta! <@${userID_2}> Venceu.`,
      `A Source 2 não saiu, é tudo uma ilusão, <@${userID_1}> é iludido, <@${userID_2}> é campeão!`,
      `Posta sem agregar nada o dia inteiro <@${userID_1}> e quer chamar atenção? <@${userID_2}> é campeão!`,
      `<@${userID_1}> chamou para o comp e foi carregado pelo <@${userID_2}> que ganhou essa discussão.`,
      `<@${userID_1}> arregou no X1 e perdeu seus pontos de credibilidade, <@${userID_2}> ganhou por WO!`,
      `Parabéns <@${userID_1}>, você é oficialmente o rei/rainha do papo furado. <@${userID_2}> Venceu.`,
      `<@${userID_2}> perdeu essa, mas pelo menos não é um perdedor em série como <@${userID_1}>.`,
      `Parabéns <@${userID_1}>, você foi a pessoa mais engraçada da discussão. <@${userID_2}> Venceu.`,
      `Parabéns, você é o mais funny do grupo <@${userID_1}>, <@${userID_2}> Venceu.`,
      `<@${userID_2}> perdeu essa, mas pelo menos ainda tem sua dignidade, Fim de discussão!`,
      `<@${userID_2}> perdeu essa, mas pelo menos não é tão ruim quanto os argumentos de <@${userID_1}>`,
      `<@${userID_1}> perdeu mais rápido do que um celular sem bateria. <@${userID_2}> Venceu.`,
      `<@${userID_1} Sua resposta foi mais sem sentido do que uma girafa jogando vôlei. <@${userID_2}> Venceu. `,
    ];
    return Math.floor(Math.random() * array.length);
  }
}
