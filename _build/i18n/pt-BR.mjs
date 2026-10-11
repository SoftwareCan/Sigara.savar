// Website interface copy; educational content is maintained in the content catalogue.
export default {
  locale: 'pt-BR', dateLocale: 'pt-BR',
  meta: {
    siteDescription: 'Informação, acompanhamento do progresso e comunidade para sua vida sem cigarro. Explore a Central de Conhecimento, as ferramentas para lidar com a vontade e o app Sigara Savar.',
    titleSuffix: 'Sigara Savar',
  },
  a11y: {
    skip: 'Pular para o conteúdo', mainNav: 'Navegação principal', mobileNav: 'Navegação móvel', breadcrumb: 'Caminho de navegação', footerNav: 'Links do site',
    external: '(abre em uma nova aba)', logoAlt: 'Logo do Sigara Savar', markAlt: 'Símbolo do Sigara Savar: um cigarro em forma de infinito, partido ao meio',
  },
  nav: {
    home: 'Início', knowledge: 'Central de Conhecimento', guide: 'Guia para parar', tools: 'Ferramentas', community: 'Comunidade', app: 'O aplicativo', download: 'Baixar o app', menu: 'Menu', close: 'Fechar',
    crisisShortcut: 'Está passando por um momento difícil? Experimente o exercício de 90 segundos',
  },
  stores: {
    appStore: 'App Store', googlePlay: 'Google Play', appStoreLong: 'Baixar na App Store', googlePlayLong: 'Baixar no Google Play', iphone: 'Para iPhone', android: 'Para Android',
    note: 'Download gratuito. Algumas funções exigem uma assinatura Premium.',
  },
  downloadPage: {
    title: 'Baixe o Sigara Savar', metaTitle: 'Baixar Sigara Savar | iPhone e Android',
    description: 'Baixe o Sigara Savar gratuitamente na App Store para iPhone ou no Google Play para Android.', eyebrow: 'Para iPhone e Android',
    lead: 'No celular, esta página abre a loja correspondente ao seu aparelho. Você também pode escolher uma loja abaixo.',
    detecting: 'Identificando seu aparelho…', ios: 'Abrindo a App Store…', android: 'Abrindo o Google Play…',
    desktop: 'Escaneie o QR code para continuar no celular ou escolha uma loja.', other: 'Escolha uma loja para continuar.',
    cancel: 'Cancelar o redirecionamento automático', cancelled: 'Redirecionamento automático cancelado. Escolha uma loja abaixo.', qrTitle: 'Escaneie com seu celular',
    qrText: 'Este link abre automaticamente a loja correspondente ao seu celular.', privacy: 'O tipo do seu aparelho é identificado apenas nesta página para abrir a loja correta.',
  },
  footer: {
    tagline: 'Informação, acompanhamento, apoio e comunidade para parar de fumar.',
    groups: { site: 'Sigara Savar', support: 'Apoio', legal: 'Informações legais', app: 'Baixar o app' },
    contact: 'Contato', dataDeletion: 'Exclusão de dados', privacy: 'Política de Privacidade', terms: 'Termos de Serviço', crisisGuide: 'Guia para lidar com a vontade de fumar (PDF, em turco)', instagram: 'Instagram',
    disclaimer: 'O Sigara Savar não é um dispositivo médico. Não oferece aconselhamento médico, diagnóstico, tratamento, terapia, atendimento de emergência nem um programa com garantia de sucesso para parar de fumar. O conteúdo deste site tem caráter informativo geral. Em uma emergência, procure os serviços de emergência da sua região.',
    copyright: (year) => `© ${year} Sigara Savar® · Todos os direitos reservados.`,
  },
  common: {
    readTime: (m) => `${m}\u00a0min de leitura`, readTimeLong: (m) => `${m} minutos de leitura`, articleCount: (n) => `${n}\u00a0${n === 1 ? 'artigo' : 'artigos'}`, sectionLabel: (n) => `Seção\u00a0${n}`,
    takeaways: 'Pontos principais', takeawaysAlt: 'A ideia principal', share: 'Compartilhar', copyLink: 'Copiar link', copied: 'Link copiado',
    medicalNote: 'Este conteúdo tem caráter informativo geral e não substitui a orientação médica. Consulte um profissional de saúde sobre a sua situação.',
  },
  home: {},
  knowledge: {
    title: 'Central de Conhecimento', metaTitle: 'Central de Conhecimento: guias para parar de fumar',
    description: '29 artigos curtos sobre dependência de nicotina, abstinência, vontade de fumar, gatilhos, deslizes e recaídas. A Central de Conhecimento do Sigara Savar.',
    lead: 'Artigos curtos para entender o processo de parar de fumar: como a dependência funciona, o que você pode sentir nos primeiros dias, como lidar com a vontade e como retomar o caminho após um deslize.',
    stats: (sections, articles, minutes) => `${sections} seções, ${articles} artigos, ${minutes} minutos de leitura no total`,
    search: {
      label: 'Pesquisar artigos', placeholder: 'Busque abstinência, gatilhos, deslizes…', submit: 'Pesquisar', found: '{n} artigos encontrados', none: 'Nenhum artigo encontrado',
      empty: 'Nenhum artigo corresponde à sua busca. Tente uma palavra mais curta ou explore as seções.', clear: 'Limpar busca',
    },
    entryTitle: 'Dois pontos de partida', entries: [{ id: 'b1-01', label: 'Se você quer começar pelo início' }, { id: 'b3-02', label: 'Se está sentindo vontade de fumar agora' }],
    sectionsNav: 'Seções', source: 'Estes artigos fazem parte da Central de Conhecimento do app Sigara Savar.',
  },
  article: {
    breadcrumbHome: 'Início', position: (i, n) => `Artigo ${i} de ${n} nesta seção`, prev: 'Artigo anterior', next: 'Próximo artigo', inSection: 'Artigos desta seção', backToKc: 'Voltar à Central de Conhecimento',
    crisisCta: { title: 'Se a vontade acabou de chegar', text: 'O exercício de 90 segundos orienta você enquanto espera a onda de vontade passar.', link: 'Experimentar o Guardião da Crise' },
    appCta: { title: 'Estes artigos também estão no app', text: 'Além da Central de Conhecimento, o Sigara Savar ajuda você a acompanhar o tempo sem fumar, os marcos de saúde e o Mapa da Jornada.' },
  },
  guide: {
    title: 'Guia para parar de fumar', metaTitle: 'Guia para parar de fumar: da decisão ao primeiro ano',
    description: 'Um guia passo a passo com artigos da nossa Central de Conhecimento: preparação, o dia de parar, a primeira semana, a vontade de fumar e como recomeçar após um deslize.',
    lead: 'Do dia em que você decide parar ao primeiro ano e além: explore o que pode acontecer, as ações que você pode experimentar e onde encontrar apoio.', toc: 'Nesta página',
    prepare: { title: 'Antes de parar', lead: 'Pode ser difícil decidir tudo no dia de parar. Preparar-se antes ajuda a tornar as escolhas mais simples, especialmente nos momentos em que você costumava fumar sem pensar.', sourceId: 'b1-04', related: ['b1-05', 'b1-07', 'b1-06'] },
    journey: {
      title: 'Mapa da Jornada', lead: 'O Mapa da Jornada do app divide o processo em 12 etapas. Explore-as abaixo e leia os artigos gratuitos sobre os primeiros dias.',
      developments: 'O que acontece nesta etapa?', attention: 'Pontos de atenção', traps: 'Armadilhas do pensamento',
      inApp: 'O Mapa da Jornada no app explica o que acontece em cada etapa, quais pontos merecem atenção e que pensamentos podem se tornar armadilhas.', lockedTitle: (from, to) => `Etapas ${from}–${to}`,
    },
    recovery: { title: 'O que muda no seu corpo?', lead: 'Uma seleção dos marcos de saúde do app, comparada com fontes de saúde pública. Os prazos não são uma avaliação individual nem um cronograma pessoal de recuperação.' },
    hardMoments: { title: 'Para os momentos difíceis', lead: 'Escolher o que fazer antes de a vontade chegar reduz o número de decisões naquele momento.', planLink: 'Monte seu plano para lidar com a vontade', toolsLink: 'Explore as ferramentas', related: ['b3-02', 'b3-04', 'b3-08'] },
    reading: { title: 'Seu percurso de leitura', lead: 'A Central de Conhecimento foi organizada para ser lida em sequência. Cada seção se apoia na anterior.' },
  },
  tools: {
    title: 'Ferramentas', metaTitle: 'Vontade de fumar: respiração, 90 segundos e um plano',
    description: 'Ferramentas gratuitas no navegador para os momentos de vontade: exercício de 90 segundos do Guardião da Crise, 6 técnicas de respiração, método 4D e um plano pessoal.',
    lead: 'Ferramentas para usar agora, sem criar uma conta. Funcionam no navegador; tudo o que você escrever fica neste aparelho.',
    crisis: { title: 'Guardião da Crise: 90 segundos', tryTitle: 'Experimente agora', lead: 'Uma versão curta, no navegador, do exercício Guardião da Crise do app.' },
    breathing: {
      title: 'Exercícios de respiração', lead: 'As 6 técnicas do app. Escolha uma e acompanhe o ritmo.', choose: 'Técnica', start: 'Começar', stop: 'Parar', inhale: 'Inspire', hold: 'Segure', exhale: 'Expire devagar', ready: 'Comece quando se sentir pronto',
      cycles: (n) => `Ciclo ${n}`, pattern: (i, h, e) => h ? `Inspire por ${i}s, segure por ${h}s e expire por ${e}s` : `Inspire por ${i}s e expire por ${e}s`,
      safety: 'Se sentir tontura, dor no peito, falta de ar ou algo incomum, pare imediatamente e volte à sua respiração normal. Se você tem asma, DPOC, doença cardíaca, está grávida ou tem outra condição de saúde, consulte primeiro um profissional de saúde.',
    },
    fourD: { title: 'O método 4D', lead: 'Quatro passos para criar um pouco de espaço quando a vontade vem com força.', articleId: 'b3-04' },
    plan: {
      title: 'Meu plano para lidar com a vontade', lead: 'Um plano ao qual recorrer em vez de começar do zero em um momento difícil. Suas respostas são salvas neste navegador e não são enviadas para nós. Você também pode imprimi-las.', articleId: 'b3-09',
      fields: [{ id: 'triggers', label: 'Meus três gatilhos mais fortes' }, { id: 'first', label: 'A primeira coisa que farei quando a vontade chegar' }, { id: 'place', label: 'Uma forma de mudar o ambiente ao meu redor' }, { id: 'person', label: 'Alguém para quem posso ligar ou mandar mensagem' }, { id: 'sentence', label: 'Uma frase para lembrar a mim mesmo' }],
      saved: 'Salvo neste aparelho', print: 'Imprimir', clear: 'Limpar', clearConfirm: 'Toque novamente para limpar', printTitle: 'Meu plano para lidar com a vontade',
    },
    pdf: { title: 'Guia para lidar com a vontade de fumar', text: 'Um resumo de duas páginas sobre os sinais da vontade de fumar e técnicas para experimentar na hora. Disponível em turco.', link: 'Baixar PDF (2 páginas, em turco)' },
    inApp: {
      title: 'Mais ferramentas no app', items: [
        { title: 'Teste de retenção da respiração', text: 'Registra quanto tempo você consegue prender a respiração. Não é uma avaliação médica.' },
        { title: 'Lembrete de água', text: 'Uma meta diária de água e lembretes.' },
        { title: 'Diário', text: 'Um espaço para anotar momentos difíceis e pequenas conquistas.' },
        { title: 'Quiz', text: 'Desafie amigos e aprendam juntos.' },
        { title: 'Jogos rápidos', text: 'Cobrinha, Estourar Bolhas, Reflexo e Memória de Cores: pequenas pausas para mudar o foco.' },
      ],
    },
  },
  crisisTool: {
    start: 'Começar 90 segundos', finish: 'Concluir', restart: 'Mais 90 segundos', phases: ['Aumentando', 'Pico', 'Diminuindo'], waveLabel: 'Onda de vontade', remaining: 'Tempo restante',
    breath: { inhale: 'Inspire', hold: 'Segure', exhale: 'Expire devagar' }, breathNote: '4-4-6: inspire por 4 segundos, segure por 4 e expire por 6.',
    yes: 'Sim', no: 'Não', lessMessage: 'A onda diminuiu. Você viu que consegue atravessá-la sem fumar.',
    stillTitle: 'Você não precisa decidir agora.', stillMessage: 'Experimente mais um ciclo de respiração, mude de ambiente ou mande uma mensagem para alguém. A onda cresce, mas não dura para sempre.',
    appLink: 'O Guardião da Crise no app continua com um temporizador de adiamento e lembretes.',
  },
  notFound: { title: 'Página não encontrada', lead: 'A página que você procura pode ter mudado de endereço ou não existir.', links: 'Continue por aqui' },
  legal: { dataDeletion: 'Exclusão de dados' },
};
