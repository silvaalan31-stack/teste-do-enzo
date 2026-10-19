// ===== DADOS =====
const ideasDatabase = {
  'garrafa pet': [
    {
      id: 1,
      nome: '🌱 Vaso para plantas',
      icone: 'fa-seedling',
      dificuldade: 'Fácil',
      tempo: '15 min',
      materiais: 'Garrafa PET, tesoura, terra',
      passo: 'Corte a garrafa ao meio, faça furos no fundo, adicione terra e plante.',
      pontos: 10
    },
    {
      id: 2,
      nome: '💧 Irrigador de plantas',
      icone: 'fa-tint',
      dificuldade: 'Médio',
      tempo: '20 min',
      materiais: 'Garrafa, caneta, água',
      passo: 'Fure a tampa, encha com água, enterre próximo à planta.',
      pontos: 10
    },
    {
      id: 3,
      nome: '🖊️ Porta-lápis',
      icone: 'fa-pencil-alt',
      dificuldade: 'Fácil',
      tempo: '10 min',
      materiais: 'Garrafa, tesoura, tinta (opcional)',
      passo: 'Corte a parte superior, decore e coloque lápis.',
      pontos: 10
    },
    {
      id: 4,
      nome: '🎨 Artesanato criativo',
      icone: 'fa-palette',
      dificuldade: 'Médio',
      tempo: '30 min',
      materiais: 'Garrafa, tinta, pincéis',
      passo: 'Pinte, recorte e crie esculturas ou utilitários.',
      pontos: 10
    }
  ],
  'caixa de papelão': [
    {
      id: 5,
      nome: '📦 Organizador de gaveta',
      icone: 'fa-box',
      dificuldade: 'Fácil',
      tempo: '20 min',
      materiais: 'Caixa, tesoura, fita adesiva',
      passo: 'Corte a caixa no formato desejado e forre com papel.',
      pontos: 10
    }
  ],
  'camiseta': [
    {
      id: 6,
      nome: '👜 Sacola reutilizável',
      icone: 'fa-shopping-bag',
      dificuldade: 'Médio',
      tempo: '30 min',
      materiais: 'Camiseta velha, tesoura, linha',
      passo: 'Corte as mangas e o decote, costure a parte inferior.',
      pontos: 15
    }
  ]
};

const transformacoes = [
  { antes: 'Lápis pequeno', depois: '🌱 Plantio', icone: 'fa-pencil' },
  { antes: 'Caixa papelão', depois: '📦 Organizador', icone: 'fa-box' },
  { antes: 'Pote de vidro', depois: '🫙 Porta-objetos', icone: 'fa-jar' },
  { antes: 'Camiseta velha', depois: '👜 Sacola', icone: 'fa-tshirt' },
  { antes: 'Garrafa PET', depois: '🌱 Vaso', icone: 'fa-wine-bottle' }
];

const conquistasData = [
  { id: 'primeira', nome: '🌱 Primeira reutilização', condicao: 1 },
  { id: 'dez', nome: '♻️ 10 objetos reaproveitados', condicao: 10 },
  { id: 'cinquenta', nome: '🌎 50 objetos reaproveitados', condicao: 50 },
  { id: 'mestre', nome: '🏆 Mestre da Reutilização', condicao: 100 }
];

// ===== ESTADO DO USUÁRIO =====
let userState = {
  points: 0,
  reusedCount: 0,
  reusedItems: [],
  conquistas: []
};

// Carregar dados salvos
function loadState() {
  const saved = localStorage.getItem('reuseUserState');
  if (saved) {
    try {
      userState = JSON.parse(saved);
    } catch (e) {
      console.log('Erro ao carregar estado');
    }
  }
  updateUI();
}

function saveState() {
  localStorage.setItem('reuseUserState', JSON.stringify(userState));
}

// ===== FUNÇÕES UI =====
function updateUI() {
  document.getElementById('userPoints').textContent = userState.points;
  document.getElementById('totalPoints').textContent = userState.points;
  document.getElementById('reusedCount').textContent = userState.reusedCount;
  
  // Nível
  const level = getLevel(userState.points);
  document.getElementById('userLevel').textContent = level;
  
  // Conquistas
  renderConquistas();
  
  // Badge
  updateBadge();
  
  saveState();
}

function getLevel(points) {
  if (points >= 500) return '🏆 Protetor do Planeta';
  if (points >= 200) return '🌟 Defensor da Natureza';
  if (points >= 100) return '🌿 Amigo do Meio Ambiente';
  if (points >= 50) return '🌱 Explorador Sustentável';
  return '🌱 Iniciante';
}

function updateBadge() {
  const badge = document.getElementById('conquistaBadge');
  if (userState.reusedCount >= 10) {
    badge.innerHTML = `<i class="fas fa-award"></i> ${userState.reusedCount} objetos`;
  } else {
    badge.innerHTML = `<i class="fas fa-seedling"></i> ${userState.reusedCount} objetos`;
  }
}

function renderConquistas() {
  const container = document.getElementById('conquistasContainer');
  container.innerHTML = '';
  
  conquistasData.forEach(conq => {
    const unlocked = userState.reusedCount >= conq.condicao;
    const div = document.createElement('span');
    div.className = `conquista-item ${unlocked ? 'unlocked' : 'locked'}`;
    div.innerHTML = `${conq.nome} ${unlocked ? '✅' : '🔒'}`;
    container.appendChild(div);
  });
}

function renderTransformacoes() {
  const grid = document.getElementById('transformGrid');
  grid.innerHTML = '';
  
  transformacoes.forEach(item => {
    const div = document.createElement('div');
    div.className = 'transform-item';
    div.innerHTML = `
      <i class="fas ${item.icone}"></i>
      <div class="antes">${item.antes}</div>
      <span class="seta">→</span>
      <div class="depois">${item.depois}</div>
    `;
    grid.appendChild(div);
  });
}

function renderIdeas(searchTerm) {
  const container = document.getElementById('ideasList');
  container.innerHTML = '';
  
  const term = searchTerm.toLowerCase().trim();
  let ideas = [];
  
  // Buscar no banco de dados
  for (const [key, value] of Object.entries(ideasDatabase)) {
    if (key.includes(term) || term.includes(key)) {
      ideas = value;
      break;
    }
  }
  
  // Se não encontrou, mostrar mensagem
  if (ideas.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px 20px; color: #4a7a4a;">
        <i class="fas fa-search" style="font-size: 40px; display: block; margin-bottom: 12px;"></i>
        <p style="font-size: 16px;">Nenhuma ideia encontrada para "${searchTerm}"</p>
        <p style="font-size: 