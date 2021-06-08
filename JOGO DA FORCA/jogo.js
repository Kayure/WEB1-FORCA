let jogo;

const letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const elementos = {
  telaInicial: document.getElementById('inicial'),
  telaCadastro: document.getElementById('cadastro'),
  telaJogo: document.getElementById('jogo'),
  telaMensagem: document.querySelector('.mensagem'),
  textoMensagem: document.querySelector('.mensagem .texto'),
  teclado: document.querySelector('.teclado'),
  palavra: document.querySelector('.palavra'),
  dica: document.querySelector('.dica'),
  botoes: {
    facil: document.querySelector('.botao-facil'),
    medio: document.querySelector('.botao-medio'),
    dificil: document.querySelector('.botao-dificil'),
    cadastrar: document.querySelector('.botao-cadastrar'),
    realizarCadastro: document.querySelector('.botao-realizar-cadastro'),
    voltar: document.querySelector('.botao-voltar'),
    reiniciar: document.querySelector('.reiniciar'),
  },
  campos: {
    dificuldade: {
      facil: document.getElementById('facil'),
      medio: document.getElementById('medio'),
      dificil: document.getElementById('dificil')
    },
    palavra: document.getElementById('palavra'),
    dica: document.getElementById('dica')
  },
  boneco: [
    document.querySelector('.boneco-cabeca'),
    document.querySelector('.boneco-corpo'),
    document.querySelector('.boneco-braco-esquerdo'),
    document.querySelector('.boneco-braco-direito'),
    document.querySelector('.boneco-perna-esquerda'),
    document.querySelector('.boneco-perna-direita'),
  ],
};

const palavras = {
  facil: [
    { palavra: 'anciã', dica: 'Pessoa com mais idade e conhecimento' },
    { palavra: 'série', dica: 'Game Of Thrones é a melhor...' },
    { palavra: 'avaro', dica: 'não sei o que é isso' },
    { palavra: 'maior', dica: 'Grade' },
    { palavra: 'noite', dica: 'Após as 18:00 vira...' },
    { palavra: 'ímpar', dica: 'Se não é par é...' },
    { palavra: 'salvo', dica: 'Deixe seus trabalhos ... no GitHub' },
    { palavra: 'vetor', dica: 'Armazena vários números' },
    { palavra: 'prado', dica: 'Não sei o que é' },
    { palavra: 'pecha', dica: 'Também não sei o que é, boa sorte' },
  ],
  medio: [
    { palavra: 'cônjuge', dica: 'Moram juntos' },
    { palavra: 'exceção', dica: 'Não é uma regra, "abrir uma"...' },
    { palavra: 'efêmero', dica: 'Não sei o que é isso' },
    { palavra: 'prolixo', dica: 'Se não presta vai pro...' },
    { palavra: 'idílico', dica: 'Não sei o que é isso' },
    { palavra: 'análogo', dica: 'analogia' },
    { palavra: 'caráter', dica: 'O que todos os homens tem' },
    { palavra: 'genuíno', dica: 'Autencidade, verdadeiro, real' },
    { palavra: 'estória', dica: ' É tipo História, mas muda umas letras' },
    { palavra: 'sublime', dica: 'Editor de código inimido do visual Studio' },
  ],
  dificil: [
    { palavra: 'concepção', dica: 'Criar' },
    { palavra: 'plenitude', dica: 'Se está pleno, a pessoa está em...' },
    { palavra: 'essencial', dica: 'primordial' },
    { palavra: 'hipócrita', dica: 'Enfim a Hipocrisia' },
    { palavra: 'corolário', dica: 'Não sei o que é isso' },
    { palavra: 'paradigma', dica: ' ciências que define um exemplo típico ou modelo de algo' },
    { palavra: 'dicotomia', dica: 'Divisão em dois' },
    { palavra: 'hegemonia', dica: 'supremacia' },
    { palavra: 'ratificar', dica: 'coisa de rato' },
    { palavra: 'propósito', dica: 'Com intenção ou objetivo' },
  ],
};

const novoJogo = () => {
  jogo = {
    dificuldade: undefined,
    palavra: {
      original: undefined,
      semAcentos: undefined,
      tamanho: undefined,
      dica: undefined,
    },
    acertos: undefined,
    jogadas: [],
    chances: 6,
    definirPalavra: function (palavra, dica) {
      this.palavra.original = palavra;
      this.palavra.tamanho = palavra.length;
      this.acertos = '';
      this.palavra.semAcentos = this.palavra.original.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      this.palavra.dica = dica
      for (let i = 0; i < this.palavra.tamanho; i++) {
        this.acertos += ' ';
      }
    },
    jogar: function (letraJogada) {
      let acertou = false;
      for (let i = 0; i < this.palavra.tamanho; i++) {
        const letra = this.palavra.semAcentos[i].toLowerCase();
        if (letra === letraJogada.toLowerCase()) {
          acertou = true;
          this.acertos = replace(this.acertos, i, this.palavra.original[i]);
        }
      }
      if (!acertou) {
        this.chances--;
      }
      return acertou;
    },
    ganhou: function () {
      return !this.acertos.includes(' ');
    },
    perdeu: function () {
      return this.chances <= 0;
    },
    acabou: function () {
      return this.ganhou() || this.perdeu();
    },
    emAndamento: false
  };

  elementos.telaInicial.style.display = 'flex';
  elementos.telaCadastro.style.display = 'none';
  elementos.telaJogo.style.display = 'none';
  elementos.telaMensagem.style.display = 'none';
  elementos.telaMensagem.classList.remove('mensagem-vitoria');
  elementos.telaMensagem.classList.remove('mensagem-derrota');
  for (const parte of elementos.boneco) {
    parte.classList.remove('escondido');
    parte.classList.add('escondido');
  }

  criarTeclado();
};

const selecionarLetra = letra => {
  if (!jogo.jogadas.includes(letra) && !jogo.acabou()) {
    const acertou = jogo.jogar(letra);
    jogo.jogadas.push(letra);

    const button = document.querySelector(`.botao-${letra}`);
    button.classList.add(acertou ? 'certo' : 'errado');

    mostrarPalavra();

    if (!acertou) {
      mostrarErro();
    }

    if (jogo.ganhou()) {
      mostrarMensagem(true);
    } else if (jogo.perdeu()) {
      mostrarMensagem(false);
    }
  }
};

const criarTeclado = () => {
  const letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  elementos.teclado.textContent = '';
  for (const letra of letras) {
    const button = document.createElement('button');
    button.appendChild(document.createTextNode(letra.toUpperCase()));
    button.classList.add(`botao-${letra}`);

    elementos.teclado.appendChild(button);

    button.addEventListener('click', () => {
      selecionarLetra(letra);
    });
  }
};

const mostrarErro = () => {
  const parte = elementos.boneco[5 - jogo.chances];
  parte.classList.remove('escondido');
};

const mostrarMensagem = vitoria => {
  const mensagem = vitoria ? '<p>Parabéns!</p><p>Você GANHOU!</p>' : '<p>Que pena!</p><p>Você PERDEU!</p>';
  elementos.textoMensagem.innerHTML = mensagem;
  elementos.telaMensagem.style.display = 'flex';
  elementos.telaMensagem.classList.add(`mensagem-${vitoria ? 'vitoria' : 'derrota'}`);

  jogo.emAndamento = false;
};

const sortearPalavra = () => {
  const i = Math.floor(Math.random() * palavras[jogo.dificuldade].length);
  const palavra = palavras[jogo.dificuldade][i].palavra;
  const dica = palavras[jogo.dificuldade][i].dica;
  jogo.definirPalavra(palavra, dica);

  console.log(jogo.palavra.original);
  console.log(jogo.palavra.dica);

  return jogo.palavra.original;
};

const mostrarPalavra = () => {
  elementos.dica.textContent = jogo.palavra.dica;
  elementos.palavra.textContent = '';
  for (let i = 0; i < jogo.acertos.length; i++) {
    const letra = jogo.acertos[i].toUpperCase();
    elementos.palavra.innerHTML += `<div class="letra-${i}">${letra}</div>`;
  }
};

const iniciarJogo = dificuldade => {
  jogo.dificuldade = dificuldade;
  elementos.telaInicial.style.display = 'none';
  elementos.telaJogo.style.display = 'flex';

  jogo.emAndamento = true;

  sortearPalavra();
  mostrarPalavra();
};

const voltarInicio = () => {
  elementos.telaInicial.style.display = 'flex';
  elementos.telaCadastro.style.display = 'none';
}

const abrirTelaCadastroPalavra = () => {
  elementos.telaInicial.style.display = 'none';
  elementos.telaCadastro.style.display = 'flex';
};

const cadastrarPalavra = () => {
  let dificuldade = undefined;
  if (elementos.campos.dificuldade.facil.checked) {
    dificuldade = 'facil';
  } else if (elementos.campos.dificuldade.medio.checked) {
    dificuldade = 'medio';
  } else {
    dificuldade = 'dificil';
  }

  const palavra = {
    palavra: elementos.campos.palavra.value.toLowerCase(),
    dica: elementos.campos.dica.value
  };

  palavras[dificuldade].push(palavra);

  elementos.campos.dificuldade.facil.checked = true;
  elementos.campos.palavra.value = '';
  elementos.campos.dica.value = '';

  voltarInicio();
};

const replace = (str, i, newChar) => str.substring(0, i) + newChar + str.substring(i + 1);

elementos.botoes.facil.addEventListener('click', () => iniciarJogo('facil'));
elementos.botoes.medio.addEventListener('click', () => iniciarJogo('medio'));
elementos.botoes.dificil.addEventListener('click', () => iniciarJogo('dificil'));

elementos.botoes.cadastrar.addEventListener('click', () => abrirTelaCadastroPalavra());
elementos.botoes.realizarCadastro.addEventListener('click', () => cadastrarPalavra());
elementos.botoes.voltar.addEventListener('click', () => voltarInicio());

elementos.botoes.reiniciar.addEventListener('click', () => novoJogo());

document.onkeypress = event => {
  if (jogo.emAndamento && letras.includes(event.key)) {
    selecionarLetra(event.key);
  }
};

novoJogo();
