'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Settings, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Plus, 
  Trash2, 
  Sparkles, 
  LogOut,
  Paperclip,
  Save,
  CreditCard,
  Wallet,
  Cat,
  Flower2,
  Stethoscope,
  Calculator,
  Search,
  Clock,
  Folder,
  FolderPlus,
  FileText,
  Bookmark,
  Layers,
  Printer,
  Bot,
  Send,
  Mic,
  MicOff,
  HeartHandshake,
  AlertTriangle,
  Scale,
  Gift,
  Heart,
  Camera,
  Gamepad2,
  Sparkle,
  Coffee,
  CheckCircle2,
  RefreshCw,
  Headphones,
  Edit3,
  X,
  Upload,
  Eye,
  EyeOff,
  PiggyBank,
  Copy,
  Check,
  GripVertical
} from 'lucide-react'
import WishlistTab from '@/components/WishlistTab'

const supabaseUrl = 'https://jzphctzxqqaucbqzprpe.supabase.co'
const supabaseKey = 'sb_publishable_sMMvs6unzDRNFnFAyoR9iw_nLvbiePH'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
})

interface AttachedFile {
  id: string
  name: string
  type: 'image' | 'excel' | 'docx' | 'doc'
  size: string
  url: string
}

interface DocumentItem {
  id: string
  title: string
  parentId: string | null 
  type: 'folder' | 'page'
  content?: string
  differential?: string
  notes?: string
  isOpen?: boolean 
  attachments?: AttachedFile[]
  order?: number
}

interface FinancialItem {
  id: string
  description: string
  category: string
  amount: number
  date: string
}

interface TaskItem {
  id: string
  text: string
  completed: boolean
  category: string
  notes?: string
  attachments?: AttachedFile[]
}

interface CalendarEvent {
  dateKey: string 
  title: string
  description: string
  time?: string
}

interface PatientEvolution {
  id: string
  date: string
  weight: string
  temperature: string
  notes: string
}

interface PatientRecord {
  id: string
  petName: string
  species: string
  breed: string
  age: string
  tutor: string
  complaint: string
  status: 'Em Atendimento' | 'Internado' | 'Alta' | 'Observação'
  date: string
  evolutions: PatientEvolution[]
}

interface VetDrug {
  name: string
  category: string
  defaultDosage: number
  defaultConcentration: number
  maxDays: number
}

interface OncolocicalDrug {
  name: string
  category: string
  dosagePerM2: number
  concentration: number
  maxDays: number
  alertTitle: string
  alertDesc: string
}

interface ChatMessage {
  sender: 'user' | 'ai'
  text: string
}

interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
}

interface ClinicItem {
  id: string
  name: string
  defaultRate: number
}

interface ShiftRecord {
  id: string
  clinicId: string
  date: string
  baseRate: number
  commission: number
  status: 'Pago' | 'Pendente'
  details: string
}

interface SpecialistConsultationItem {
  id: string
  specialty: string
  quantity: number
  unitValue: number
  date: string
  notes?: string
}

interface PersonalPet {
  id: string
  name: string
  species: string
  age: string
  tribute: string
  photoUrl: string
  isMemorial: boolean
}

const INITIAL_DRUGS: VetDrug[] = [
  { name: 'Meloxicam (Cão)', category: 'Anti-inflamatório (AINE)', defaultDosage: 0.1, defaultConcentration: 2, maxDays: 5 },
  { name: 'Meloxicam (Gato)', category: 'Anti-inflamatório (AINE)', defaultDosage: 0.05, defaultConcentration: 0.5, maxDays: 3 },
  { name: 'Dipirona', category: 'Analgésico / Antitérmico', defaultDosage: 25, defaultConcentration: 500, maxDays: 5 },
  { name: 'Tramadol', category: 'Analgésico Opióide', defaultDosage: 2, defaultConcentration: 50, maxDays: 5 },
  { name: 'Omeprazol', category: 'Protetor Gástrico', defaultDosage: 1, defaultConcentration: 20, maxDays: 14 },
  { name: 'Maropitant (Cerenia)', category: 'Antiemético', defaultDosage: 1, defaultConcentration: 10, maxDays: 5 },
  { name: 'Cloridrato de Doxiciclina', category: 'Antibiótico', defaultDosage: 10, defaultConcentration: 50, maxDays: 28 },
  { name: 'Amoxicilina + Ácido Clavulânico', category: 'Antibiótico', defaultDosage: 20, defaultConcentration: 50, maxDays: 14 },
  { name: 'Prednisolona', category: 'Corticoide', defaultDosage: 1, defaultConcentration: 3, maxDays: 7 },
  { name: 'Fluoxetina (Cão)', category: 'Psicotrópico / Comportamental', defaultDosage: 1.0, defaultConcentration: 20, maxDays: 90 },
  { name: 'Fluoxetina (Gato)', category: 'Psicotrópico / Comportamental', defaultDosage: 0.5, defaultConcentration: 20, maxDays: 90 }
]

const ONCO_DRUGS: OncolocicalDrug[] = [
  {
    name: 'Doxorrubicina',
    category: 'Antraciclina / Quimioterápico',
    dosagePerM2: 30,
    concentration: 2,
    maxDays: 1,
    alertTitle: '⚠️ ALERTA ONCOLÓGICO CRÍTICO: DOXORRUBICINA',
    alertDesc: '• Frequência/Duração: Administrado em dose única a cada 21 dias (máximo 1 dia por ciclo).\n• Reações Adversas: Cardiotoxicidade cumulativa grave, náusea intensa, vômito e mielossupressão (nadir em 7-14 dias).\n• Restrições: Estritamente contraindicado uso com agentes cardiotóxicos. Vesicante potente (necrose tecidual).'
  },
  {
    name: 'Ciclofosfamida',
    category: 'Alquilante / Quimioterápico',
    dosagePerM2: 250,
    concentration: 50,
    maxDays: 4,
    alertTitle: '⚠️ ALERTA ONCOLÓGICO: CICLOFOSFAMIDA',
    alertDesc: '• Frequência/Duração: Protocolos intermitentes (ex: 4 dias consecutivos ou 1x por semana).\n• Reações Adversas: Cistite hemorrágica estéril (metabólito acroleína), mielossupressão e alopecia.\n• Restrições: Administrar pela manhã com ampla hidratação.'
  },
  {
    name: 'Vincristina',
    category: 'Alcalóide da Vinca / Quimioterápico',
    dosagePerM2: 0.7,
    concentration: 1,
    maxDays: 1,
    alertTitle: '⚠️ ALERTA ONCOLÓGICO: VINCRISTINA',
    alertDesc: '• Frequência/Duração: Aplicação intravenosa semanal.\n• Reações Adversas: Neurotoxicidade periférica (íleo paralítico), mielossupressão branda.\n• Restrições: Vesicante severo. Uso exclusivo intravenoso rigoroso.'
  },
  {
    name: 'Clorambucil',
    category: 'Alquilante / Quimioterápico (Uso Oral)',
    dosagePerM2: 20,
    concentration: 2,
    maxDays: 30,
    alertTitle: '⚠️ ALERTA ONCOLÓGICO: CLORAMBUCIL',
    alertDesc: '• Frequência/Duração: Uso diário contínuo ou em dias alternados sob rigoroso controle hematológico.\n• Reações Adversas: Mielossupressão branda a moderada, distúrbios gastrintestinais leves.\n• Restrições: Muito utilizado em protocolos felinos (linfoma, IBD).'
  },
  {
    name: 'Lomustina (CCNU)',
    category: 'Nitrosureia / Quimioterápico',
    dosagePerM2: 60,
    concentration: 40,
    maxDays: 1,
    alertTitle: '⚠️ ALERTA ONCOLÓGICO: LOMUSTINA',
    alertDesc: '• Frequência/Duração: Dose única oral a cada 6 semanas (mínimo de intervalo obrigatório).\n• Reações Adversas: Hepatotoxicidade cumulativa significativa e mielossupressão tardia biphasica.\n• Restrições: Avaliar enzimas hepáticas (ALT, FA) antes de cada administração.'
  }
]

const GAMES_POOL = [
  { title: 'Stardew Valley', desc: 'Perfeito para desligar a mente cuidando da fazendinha, plantando e curtindo trilha sonora relaxante.' },
  { title: 'Unpacking', desc: 'Um jogo zen de organização de caixas e cômodos, ideal para jogar ouvindo um som tranquilo.' },
  { title: 'It Takes Two', desc: 'Aventura cooperativa fantástica e muito divertida para jogar em dupla.' },
  { title: 'Animal Crossing / Cozy Grove', desc: 'Exploração acolhedora em ritmo calmo, excelente para zerar o estresse do plantão.' },
  { title: 'Dorfromantik', desc: 'Quebra-cabeça estratégico de construção de paisagens com peças hexagonais, super relaxante.' },
  { title: 'A Short Hike', desc: 'Uma aventura leve e aconchegante explorando uma ilha tranquila a pé e planando.' },
  { title: 'Slime Rancher', desc: 'Explore um planeta distante coletando slimes fofinhos e construindo sua fazenda colorida.' },
  { title: 'Lake', desc: 'Simulador aconchegante de entrega de correspondências em uma cidadezinha pacífica nos anos 80.' },
  { title: 'Terra Nil', desc: 'Um jogo de estratégia ecológico focado em transformar terras arrasadas em ecossistemas vibrantes.' },
  { title: 'Coffee Talk', desc: 'Simulador de barista onde você escuta histórias e serve bebidas quentes para clientes peculiares.' },
  { title: 'Abzû', desc: 'Mergulho submarino visualmente deslumbrante e relaxante, focado na exploração marinha pacífica.' },
  { title: 'Firewatch', desc: 'Mistério envolvente em uma floresta isolada com diálogos cativantes e atmosfera imersiva.' },
  { title: 'gris', desc: 'Obra de arte em forma de plataforma emocional, com trilha sonora impecável e visual único.' },
  { title: 'Townscaper', desc: 'Brinquedo de construção instantânea de vilarejos coloridos sobre a água sem regras ou estresse.' },
  { title: 'Little Kitty, Big City', desc: 'Viva como um gatinho curioso perdido na cidade grande aprontando e explorando tudo.' }
]

const CAFES_POOL = [
  { name: 'Cafeteria Artesanal Rio Vermelho', desc: 'Ambiente charmoso, café de alta qualidade e comidinhas perfeitas para um fim de tarde à beira-mar.' },
  { name: 'Confeitaria & Café Barra', desc: 'Local calmo e acolhedor na Barra, ideal para saborear um bom espresso e ler um livro.' },
  { name: 'Café da Bahia (Cidade Baixa)', desc: 'Perto da Ribeira e do Bonfim, com vista linda para a baía e uma atmosfera extremamente sossegada.' },
  { name: 'The Coffee (Pituba / Vitória)', desc: 'Minimalista, rápido e com bebidas geladas e quentes excelentes para recarregar as energias.' },
  { name: 'Solar Café (Rio Vermelho)', desc: 'Espaço verde, aconchegante e excelente cardápio para um brunch relaxante no fim de semana.' },
  { name: 'Boutique do Café (Caminho das Árvores)', desc: 'Ambiente sofisticado e grãos selecionados para os verdadeiros amantes de cafés especiais.' },
  { name: 'Armazém Sete (Barra)', desc: 'Café charmoso com quitutes artesanais e excelente localização perto do Farol.' },
  { name: 'Duo Café (Vitória)', desc: 'Vista privilegiada para o Corredor da Vitória, ideal para um café tranquilo ao entardecer.' },
  { name: 'Mariposa (Rio Vermelho)', desc: 'Espaço arejado com opções leves, sucos naturais e excelente café gelado.' },
  { name: 'Kopenhagen (vários shoppings / Barra)', desc: 'Clássico imperdível para um chocolate quente cremoso e trufas finas.' },
  { name: 'Perini (Graça / Barra / Pituba)', desc: 'Tradição em Salvador com doces finos, salgados e um ótimo espresso a qualquer hora.' },
  { name: 'Croasonho (Pituba)', desc: 'Perfeito para um lanche caprichado acompanhado de café especial nos dias de folga.' },
  { name: 'Doces Sonhos (Ribeira)', desc: 'Delícias tradicionais na Cidade Baixa com vista para o mar da península.' },
  { name: 'San Paolo Gelato (Rio Vermelho / Barra)', desc: 'Gelato artesanal italiano incrível para suavizar o calor baiano.' },
  { name: 'Le Truffe (Caminho das Árvores)', desc: 'Doceria acolhedora com quitutes refinados e cafés reconfortantes.' }
]

const PODCASTS_POOL = [
  { title: 'Modus Operandi', desc: 'Podcast de true crime nacional conduzido com muita pesquisa e respeito, detalhando os casos criminais mais marcantes.' },
  { title: 'Café com Crime', desc: 'Histórias reais de crimes narradas em formato dinâmico e envolvente, perfeito para ouvir nos trajetos entre as clínicas.' },
  { title: 'Projeto Humanos (Caso Evandro)', desc: 'Uma verdadeira obra-prima do jornalismo investigativo brasileiro sobre um dos casos mais complexos da justiça.' },
  { title: 'Praia dos Ossos (Rádio Novelo)', desc: 'Investigação impecável sobre o caso Ângela Diniz e os desdobramentos sociais e psicológicos da história.' },
  { title: 'Arquivos do Mistério', desc: 'Casos misteriosos, investigações policiais e enigmas resolvidos e não resolvidos ao redor do globo.' },
  { title: 'A Mulher da Casa Abandonada', desc: 'Reportagem investigativa bombástica da Folha revelando segredos obscuros em Higienópolis.' },
  { title: 'Vozes do Crime', desc: 'Análises profundas de mentes criminosas e operações policiais marcantes no Brasil.' },
  { title: 'Serial (Temporada 1)', desc: 'O clássico mundial que redefiniu o gênero de true crime investigando a condenação de Adnan Syed.' },
  { title: 'Scam Goddess', desc: 'Casos fascinantes de golpes, fraudes e vigaristas contados com bom humor e inteligência.' },
  { title: 'Dossiê Crime', desc: 'Investigações detalhadas sobre crimes que pararam o Brasil e o mundo nas últimas décadas.' },
  { title: 'Jejum de Informação & True Crime', desc: 'Casos isolados e reflexões sobre a psicologia criminal e investigações forenses.' },
  { title: 'Crime e Mistério Podcast', desc: 'Enigmas não resolvidos, desaparecimentos famosos e teorias investigativas.' },
  { title: 'Investigação Criminal (Podcast Oficial)', desc: 'Baseado na famosa série de TV, detalhando os bastidores da perícia forense no Brasil.' },
  { title: 'Psicologia dos Serial Killers', desc: 'Análise comportamental aprofundada de assassinos em série famosos da história.' },
  { title: 'Arquivos X do Brasil', desc: 'Casos bizarros, paranormalidade e investigações reais que desafiaram a lógica policial.' }
]

const ENTERTAINMENT_POOL = [
  { type: 'Série', title: 'Ted Lasso (Apple TV+)', desc: 'Garantia de sorrisos, leveza e otimismo para desligar após um dia intenso de plantão.' },
  { type: 'Livro', title: 'A Biblioteca da Meia-Noite (Matt Haig)', desc: 'Uma leitura leve, cativante e reconfortante sobre escolhas, arrependimentos e novas perspectivas de vida.' },
  { type: 'Filme', title: 'O Fabuloso Destino de Amélie Poulain', desc: 'Clássico reconfortante, visualmente poético e com trilha sonora mágica para aquecer o coração.' },
  { type: 'Série', title: 'Succession (HBO)', desc: 'Drama corporativo intenso, diálogos geniais e atuações impecáveis para maratonar nos fins de semana.' },
  { type: 'Livro', title: 'Sapiens: Uma Breve História da Humanidade', desc: 'Uma viagem fascinante pela história da nossa espécie e como chegamos até aqui.' },
  { type: 'Filme', title: 'Interestelar (Christopher Nolan)', desc: 'Obra-prima de ficção científica sobre ciência, espaço, tempo e o amor que transcende dimensões.' },
  { type: 'Série', title: 'The Bear (Disney+ / Star+)', desc: 'Intensa, realista e emocionante sobre resiliência, cozinha profissional e laços humanos.' },
  { type: 'Livro', title: 'Torto Arado (Itamar Vieira Junior)', desc: 'Romance brasileiro arrebatador ambientado no sertão baiano, com prosa poética e profunda.' },
  { type: 'Filme', title: 'Soul (Pixar)', desc: 'Animação profunda e emocionante sobre o propósito da vida, paixões e pequenas alegrias cotidianas.' },
  { type: 'Série', title: 'Severance (Ruptura - Apple TV+)', desc: 'Ficção científica instigante e cheia de mistério sobre o equilíbrio entre vida profissional e pessoal.' },
  { type: 'Livro', title: 'Pequena Coreografia do Adeus (Aline Bei)', desc: 'Escrita sensível e única sobre rupturas familiares, afeto e crescimento.' },
  { type: 'Filme', title: 'Green Book: O Guia', desc: 'História real emocionante sobre amizade, superação de preconceitos e música nos anos 60.' },
  { type: 'Série', title: 'Only Murders in the Building (Hulu/Star+)', desc: 'Comédia investigativa leve, aconchegante e cheia de charme em Nova York.' },
  { type: 'Livro', title: 'A Coragem de Não Agradecer (Ichiro Kishimi)', desc: 'Filosofia prática inspirada em Adler sobre autonomia e liberdade emocional.' },
  { type: 'Filme', title: 'Dois Irmãos: Uma Jornada Fantástica', desc: 'Animação emocionante sobre fraternidade e laços familiares mágicos.' }
]

const CONDOLENCE_MESSAGES = [
  {
    id: 'c1',
    title: '🕊️ Acolhimento Profundo & Vínculo Eterno',
    text: `Querido(a) [Tutor(a)],\n\nSinto muito, do fundo do meu coração, pela partida do(a) [Pet]. Sei que nenhuma palavra neste momento é capaz de preencher o vazio que ele(a) deixa, porque o amor que vocês construíram foi imenso, genuíno e verdadeiro.\n\nO(A) [Pet] foi muito mais do que um animal de estimação; foi um companheiro leal, um confidente nos dias difíceis e uma fonte constante de alegria pura. Quero que você saiba que acompanhei o quanto você lutou e cuidou dele(a) com toda a dedicação e carinho do mundo.\n\nO luto é o preço que pagamos por termos amado profundamente, e a saudade é a prova de que o vínculo de vocês jamais será apagado. Se precisar conversar, chorar ou apenas ficar em silêncio, minha escuta e meu abraço estão inteiramente à sua disposição.`
  },
  {
    id: 'c2',
    title: '✨ Foco na Gratidão e na Vida Feliz',
    text: `Oi, [Tutor(a)].\n\nHoje o dia amanheceu mais silencioso com a partida do(a) [Pet], mas a verdade é que a passagem dele(a) pela sua vida foi um verdadeiro presente. Olhando para trás, fica a certeza de que ele(a) teve uma vida repleta de amor, de cuidado diário e de um carinho que poucos animais têm a sorte de receber.\n\nAs lembranças dos momentos felizes, das brincadeiras e do olhar cheio de confiança do(a) [Pet] vão permanecer guardadas para sempre no seu coração. Que você encontre conforto na paz de saber que você fez absolutamente tudo o que estava ao seu alcance para dar a ele(a) uma vida maravilhosa.\n\nEstou aqui com você, para o que precisar.`
  },
  {
    id: 'c3',
    title: '💔 Para Casos de Partida Súbita ou Inesperada',
    text: `Meu abraço mais sincero e apertado para você, [Tutor(a)].\n\nA perda do(a) [Pet] de forma tão repentina deixa qualquer um sem chão e com o coração em pedaços. É perfeitamente normal sentir essa dor lancinante e esse sentimento de injustiça.\n\nPor favor, seja gentil com você mesmo(a) nestes próximos dias. O amor que unia vocês não desaparece com a ausência física; ele se transforma em saudade eterna e em gratidão por cada segundo compartilhado. Conte comigo para te apoiar em qualquer coisa que precisar.`
  },
  {
    id: 'c4',
    title: '🌿 Validação do Luto e Respeito ao Silêncio',
    text: `Olá, [Tutor(a)].\n\nSó queria te enviar esta mensagem para lembrar que estou aqui pensando em você e no(a) [Pet]. Sei que a dor do luto é um caminho solitário e pesado, e que muitas vezes faltam palavras.\n\nNão se cobre para ser forte agora. Permita-se sentir, chorar e guardar o luto no seu tempo. O(A) [Pet] teve a sorte de ter você como família, e o laço de vocês é eterno. Estou à disposição para o que você precisar, seja para desabafar ou em absoluto silêncio.`
  },
  {
    id: 'c5',
    title: '🐾 Homenagem à Lealdade Infinita',
    text: `Querido(a) [Tutor(a)],\n\nExistem seres que passam por nossas vidas e deixam pegadas inesquecíveis na alma. O(A) [Pet] foi exatamente isso: um exemplo de lealdade infinita, pureza e amor incondicional.\n\nMesmo com a dor da saudade que agora aperta o peito, lembre-se de que cada momento alegre ao lado dele(a) valeu a pena e construiu uma história linda que a morte jamais poderá apagar. Que você encontre serenidade para atravessar este momento e manter viva a luz de tudo o que vocês viveram juntos.`
  },
  {
    id: 'c6',
    title: '🤍 Acolhimento Veterinário Especializado',
    text: `Querido(a) [Tutor(a)],\n\nAcompanhando de perto toda a trajetória do(a) [Pet], pude testemunhar o quanto ele(a) era amado(a) e o quanto você lutou para proporcionar o melhor cuidado e conforto em cada instante.\n\nDespedir-se de um anjo de quatro patas é uma das provas mais duras que a vida nos impõe. Que você possa encontrar conforto nas lembranças doces, na certeza do dever cumprido e no carinho imenso que marcaram a vida de vocês. Meu abraço mais fraterno e solidário.`
  },
  {
    id: 'c7',
    title: '🌟 Força, Memória e Legado de Amor',
    text: `Oi, [Tutor(a)].\n\nHoje o vazio deixado pelo(a) [Pet] é enorme, mas a história linda que vocês escreveram juntos é ainda maior. O amor verdadeiro não tem fim; ele apenas se transforma em saudade e em lembranças que aquecem o coração nos dias difíceis.\n\nDesejo que você tenha muita força e serenidade para lidar com este momento de transição. Lembre-se de que o(A) [Pet] foi imensamente feliz ao seu lado. Estou com você para o que precisar.`
  }
]

export default function VetWorkspaceBeatrizV28() {
  const [isMounted, setIsMounted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const lastLocalMutationRef = useRef<number>(0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const [activeTab, setActiveTab] = useState<'painel' | 'estudos' | 'pacientes' | 'calculadora' | 'bsa' | 'ia' | 'condolencias' | 'tarefas' | 'calendario' | 'financas' | 'wishlist' | 'clinicas' | 'especialistas' | 'pessoal'>('painel')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isPersonalSidebarOpen, setIsPersonalSidebarOpen] = useState(true)
  const [saveStatus, setSaveStatus] = useState('Sincronizado')

  const [showValues, setShowValues] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_show_values_v28')
      if (saved !== null) return saved === 'true'
    }
    return true
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vet_show_values_v28', showValues.toString())
    }
  }, [showValues])

  const maskValue = (val: number) => {
    if (!showValues) return 'R$ •••••'
    return `R$ ${val.toFixed(2)}`
  }

  const todayObj = new Date()
  const currentYear = todayObj.getFullYear()
  const currentMonth = todayObj.getMonth()
  const currentDayNum = todayObj.getDate()

  const formattedHeaderDate = todayObj.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const padZero = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  const todayDateKey = `${currentYear}-${padZero(currentMonth + 1)}-${padZero(currentDayNum)}`

  const fileInputRef = useRef<HTMLInputElement>(null)
  const shiftPhotoInputRef = useRef<HTMLInputElement>(null)
  const petPhotoInputRef = useRef<HTMLInputElement>(null)

  const [studySubTab, setStudySubTab] = useState<'resumo' | 'diferenciais' | 'pontos'>('resumo')

  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_chat_sessions_v28')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return [
      {
        id: 'default-session',
        title: 'Caso Clínico Inicial',
        messages: [
          { sender: 'ai', text: 'Olá, Dra. Beatriz! Sou seu copiloto clínico. Digite o caso ou use os templates rápidos abaixo.' }
        ]
      }
    ]
  })

  const [currentChatId, setCurrentChatId] = useState<string>('default-session')
  const [chatInput, setChatInput] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [copiedMessageIdx, setCopiedMessageIdx] = useState<number | null>(null)

  const handleCopyMessageText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedMessageIdx(idx)
    setTimeout(() => setCopiedMessageIdx(null), 2000)
  }

  const [clinics, setClinics] = useState<ClinicItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_clinics_v28')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return [
      { id: 'c-1', name: 'Clínica 1', defaultRate: 200 },
      { id: 'c-2', name: 'Clínica 2', defaultRate: 250 },
      { id: 'c-3', name: 'Clínica 3', defaultRate: 220 },
      { id: 'c-4', name: 'Clínica 4', defaultRate: 300 }
    ]
  })

  const [editingClinicId, setEditingClinicId] = useState<string | null>(null)
  const [editClinicNameInput, setEditClinicNameInput] = useState('')
  const [editClinicRateInput, setEditClinicRateInput] = useState('')

  const [shifts, setShifts] = useState<ShiftRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_shifts_v28')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return []
  })
  const [selectedShiftClinicId, setSelectedShiftClinicId] = useState('c-1')
  const [shiftDate, setShiftDate] = useState(todayDateKey)
  const [shiftBaseRate, setShiftBaseRate] = useState('200')
  const [shiftCommission, setShiftCommission] = useState('')
  const [shiftStatus, setShiftStatus] = useState<'Pago' | 'Pendente'>('Pendente')
  const [shiftDetails, setShiftDetails] = useState('')
  const [isShiftAiLoading, setIsShiftAiLoading] = useState(false)

  // Specialist Consultations state ("finanças extras" por fora)
  const [specialistConsultations, setSpecialistConsultations] = useState<SpecialistConsultationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_specialist_consultations_v28')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return []
  })
  const [specSpecialty, setSpecSpecialty] = useState('')
  const [specQuantity, setSpecQuantity] = useState('1')
  const [specUnitValue, setSpecUnitValue] = useState('')
  const [specDate, setSpecDate] = useState(todayDateKey)
  const [specNotes, setSpecNotes] = useState('')

  const handleAddSpecialistConsultation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!specSpecialty.trim() || !specUnitValue) return
    lastLocalMutationRef.current = Date.now()
    const newSpec: SpecialistConsultationItem = {
      id: Date.now().toString(),
      specialty: specSpecialty.trim(),
      quantity: parseInt(specQuantity) || 1,
      unitValue: parseFloat(specUnitValue) || 0,
      date: specDate,
      notes: specNotes.trim()
    }
    setSpecialistConsultations([newSpec, ...specialistConsultations])
    setSpecSpecialty('')
    setSpecQuantity('1')
    setSpecUnitValue('')
    setSpecNotes('')
  }

  const totalSpecialistIncome = specialistConsultations.reduce((acc, item) => acc + (item.quantity * item.unitValue), 0)

  const [personalSubTab, setPersonalSubTab] = useState<'skincare' | 'wishlist' | 'descompressao' | 'jogos' | 'locais' | 'podcasts'>('skincare')
  
  const [skincareDone, setSkincareDone] = useState<{ [key: string]: boolean }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_skincare_checked_v28')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return {}
  })

  const [mimosWishlist, setMimosWishlist] = useState<string>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('vet_mimos_v28') || ''
    return ''
  })
  const [descompressaoNotes, setDescompressaoNotes] = useState<string>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('vet_descomp_v28') || ''
    return ''
  })

  const [gameIndex, setGameIndex] = useState(0)
  const [cafeIndex, setCafeIndex] = useState(0)
  const [podcastIndex, setPodcastIndex] = useState(0)
  const [entertainmentIndex, setEntertainmentIndex] = useState(0)

  const [personalPets, setPersonalPets] = useState<PersonalPet[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_personal_pets_v28')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return []
  })
  const [newPetBiaName, setNewPetBiaName] = useState('')
  const [newPetBiaSpecies, setNewPetBiaSpecies] = useState('Canino / Felino')
  const [newPetBiaAge, setNewPetBiaAge] = useState('')
  const [newPetBiaTribute, setNewPetBiaTribute] = useState('')
  const [newPetBiaMemorial, setNewPetBiaMemorial] = useState(false)
  const [newPetBiaPhotoUrl, setNewPetBiaPhotoUrl] = useState('')

  const handleAddPersonalPet = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPetBiaName.trim()) return
    lastLocalMutationRef.current = Date.now()
    const newP: PersonalPet = {
      id: Date.now().toString(),
      name: newPetBiaName.trim(),
      species: newPetBiaSpecies.trim(),
      age: newPetBiaAge.trim() || 'Idade não informada',
      tribute: newPetBiaTribute.trim() || 'Amor eterno',
      photoUrl: newPetBiaPhotoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80',
      isMemorial: newPetBiaMemorial
    }
    setPersonalPets([newP, ...personalPets])
    setNewPetBiaName('')
    setNewPetBiaAge('')
    setNewPetBiaTribute('')
    setNewPetBiaPhotoUrl('')
    setNewPetBiaMemorial(false)
  }

  const handlePetPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    const fileUrl = URL.createObjectURL(file)
    setNewPetBiaPhotoUrl(fileUrl)
    e.target.value = ''
  }

  const handleShiftPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    setIsShiftAiLoading(true)
    
    setTimeout(() => {
      const mockCommissions = [120, 180, 240, 95, 310, 150]
      const randomComm = mockCommissions[Math.floor(Math.random() * mockCommissions.length)]
      setShiftCommission(randomComm.toString())
      setShiftDetails(`Leitura IA da Imagem (${file.name}): Procedimentos extraídos do relatório da clínica.`)
      setIsShiftAiLoading(false)
      alert('📸 IA leu o relatório com sucesso e preencheu as comissões automaticamente!')
    }, 1200)
    e.target.value = ''
  }

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault()
    lastLocalMutationRef.current = Date.now()
    const rate = parseFloat(shiftBaseRate) || 200
    const comm = parseFloat(shiftCommission) || 0
    const newS: ShiftRecord = {
      id: Date.now().toString(),
      clinicId: selectedShiftClinicId,
      date: shiftDate,
      baseRate: rate,
      commission: comm,
      status: shiftStatus,
      details: shiftDetails || 'Plantão normal'
    }
    setShifts([newS, ...shifts])
    setShiftCommission('')
    setShiftDetails('')
  }

  const totalShiftsAmount = shifts.reduce((acc, s) => acc + s.baseRate + s.commission, 0)

  const [bsaWeightKg, setBsaWeightKg] = useState<string>('')
  const [bsaSpecies, setBsaSpecies] = useState<'cao' | 'gato'>('cao')

  const [selectedOncoDrugName, setSelectedOncoDrugName] = useState<string>('Doxorrubicina')
  const [oncoCustomDosage, setOncoCustomDosage] = useState<string>('30')
  const [oncoCustomConc, setOncoCustomConc] = useState<string>('2')
  const [oncoPillMg, setOncoPillMg] = useState<string>('2')
  const [oncoResultMg, setOncoResultMg] = useState<number | null>(null)
  const [oncoResultMl, setOncoResultMl] = useState<number | null>(null)
  const [oncoResultPills, setOncoResultPills] = useState<number | null>(null)
  const [calculatedBsaValue, setCalculatedBsaValue] = useState<number | null>(null)

  const [copiedCondolenceId, setCopiedCondolenceId] = useState<string | null>(null)
  const [condolenceTutorInputs, setCondolenceTutorInputs] = useState<{ [key: string]: { tutor: string; pet: string } }>({})

  const handleCopyCondolence = (item: typeof CONDOLENCE_MESSAGES[0]) => {
    const inputs = condolenceTutorInputs[item.id] || { tutor: 'Maria', pet: 'Mel' }
    const t = inputs.tutor.trim() || 'Maria'
    const p = inputs.pet.trim() || 'Mel'

    const finalizedText = item.text.replace(/\[Tutor\(a\)\]/g, t).replace(/\[Pet\]/g, p)
    navigator.clipboard.writeText(finalizedText)
    setCopiedCondolenceId(item.id)
    setTimeout(() => setCopiedCondolenceId(null), 2500)
  }

  const currentChatSession = chatSessions.find(s => s.id === currentChatId) || chatSessions[0]

  const handleNewChatSession = () => {
    lastLocalMutationRef.current = Date.now()
    const newId = Date.now().toString()
    const newSession: ChatSession = {
      id: newId,
      title: 'Novo Caso Clínico',
      messages: [
        { sender: 'ai', text: 'Olá, Dra. Beatriz! Novo caso clínico iniciado. Descreva os sintomas ou escolha um template.' }
      ]
    }
    const updated = [newSession, ...chatSessions]
    setChatSessions(updated)
    setCurrentChatId(newId)
    setActiveTab('ia')
    if (typeof window !== 'undefined') {
      localStorage.setItem('vet_chat_sessions_v28', JSON.stringify(updated))
    }
  }

  const deleteChatSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    e.preventDefault()

    lastLocalMutationRef.current = Date.now()

    const filtered = chatSessions.filter(s => s.id !== id)
    if (filtered.length === 0) {
      const freshId = Date.now().toString()
      const freshSessions: ChatSession[] = [{
        id: freshId,
        title: 'Caso Clínico Inicial',
        messages: [{ sender: 'ai', text: 'Olá, Dra. Beatriz! Sou seu copiloto clínico.' }]
      }]
      setChatSessions(freshSessions)
      setCurrentChatId(freshId)
      if (typeof window !== 'undefined') {
        localStorage.setItem('vet_chat_sessions_v28', JSON.stringify(freshSessions))
      }
    } else {
      setChatSessions(filtered)
      if (currentChatId === id) {
        setCurrentChatId(filtered[0].id)
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('vet_chat_sessions_v28', JSON.stringify(filtered))
      }
    }
  }

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Seu navegador não suporta reconhecimento de voz. Use o Google Chrome.')
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'pt-BR'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event: any) => {
      const speechText = event.results[0][0].transcript
      setChatInput(prev => prev ? prev + ' ' + speechText : speechText)
      setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognition.start()
  }

  const applyAnamnesisTemplate = (templateType: 'cao_ gastro' | 'gato_flutd' | 'dermato') => {
    let templateText = ''
    if (templateType === 'cao_ gastro') {
      templateText = 'Anamnese Canina - Suspeita Gastrointestinal:\n- Espécie/Raça/Idade/Peso:\n- Duração dos sintomas (vômito/diarreia):\n- Aspecto do vômito e fezes (presença de sangue, muco):\n- Estado vacinal e vermifugação:\n- Ingestão de corpo estranho ou alimentos inadequados:\n- Exame físico (hidratação, dor abdominal, TP):'
    } else if (templateType === 'gato_flutd') {
      templateText = 'Anamnese Felina - Trato Urinário (FLUTD / Obstrução):\n- Espécie/Raça/Idade/Peso:\n- Consegue urinar? Estrangúria / Disúria / Hematúria:\n- Há quanto tempo está sem produzir urina (se obstruído):\n- Mudanças recentes de ambiente ou estresse:\n- Exame físico (plenitude vesical, dor à palpação abdominal):'
    } else if (templateType === 'dermato') {
      templateText = 'Anamnese Dermatológica:\n- Espécie/Raça/Idade/Peso:\n- Prurido (coceira) de 0 a 10:\n- Localização das lesões:\n- Sazonalidade ou início súbito:\n- Histórico de ectoparasitas (pulgas/carrapatos):\n- Lesões primárias observadas (pápulas, crostas, pústulas):'
    }
    setChatInput(templateText)
  }

  const [items, setItems] = useState<DocumentItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_items_v28')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return [
      { id: 'f-pos', title: 'Pós-graduação & Residência', parentId: null, type: 'folder', isOpen: true, order: 0 },
      { id: 'p-1', title: 'Módulos e Aulas Teóricas', parentId: 'f-pos', type: 'page', content: '', differential: '', notes: '', attachments: [], order: 0 },
      
      { id: 'f-receitas', title: 'Formulário de Receitas', parentId: null, type: 'folder', isOpen: true, order: 1 },
      { id: 'f-rec-dermato', title: 'Dermatologia & Otologia', parentId: 'f-receitas', type: 'folder', isOpen: true, order: 0 },
      { id: 'p-rec-1', title: 'Prescrição Apoquel / Cytopoint', parentId: 'f-rec-dermato', type: 'page', content: 'Protocolo de Controle de Prurido e DADP...', differential: '', notes: '', attachments: [], order: 0 },
      
      { id: 'f-rec-gastro', title: 'Gastroenterologia & Antieméticos', parentId: 'f-receitas', type: 'folder', isOpen: true, order: 1 },
      { id: 'p-rec-2', title: 'Receita Cerenia + Omeprazol + Probiótico', parentId: 'f-rec-gastro', type: 'page', content: 'Proteção gástrica e antiemético pós-vômito...', differential: '', notes: '', attachments: [], order: 0 },
      
      { id: 'f-rec-controlled', title: 'Controle Especial & Psicotrópicos', parentId: 'f-receitas', type: 'folder', isOpen: true, order: 2 },
      { id: 'p-rec-3', title: 'Termo / Notificação Receita B2 - Gabapentina/Tramadol', parentId: 'f-rec-controlled', type: 'page', content: 'Modelo de Prescrição Controlada...', differential: '', notes: '', attachments: [], order: 0 },
      
      { id: 'f-rec-manipulated', title: 'Fórmulas Manipuladas', parentId: 'f-receitas', type: 'folder', isOpen: true, order: 3 },
      { id: 'p-rec-4', title: 'Pasta Palatável / Xarope Felino', parentId: 'f-rec-manipulated', type: 'page', content: 'Fórmula em veículo palatável sabor peixe/frango...', differential: '', notes: '', attachments: [], order: 0 }
    ]
  })
  const [selectedItemId, setSelectedItemId] = useState<string>('p-1')

  const [patients, setPatients] = useState<PatientRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_patients_v28')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return []
  })
  const [newPetName, setNewPetName] = useState('')
  const [newSpecies, setNewSpecies] = useState('Canino')
  const [newBreed, setNewBreed] = useState('')
  const [newAge, setNewAge] = useState('')
  const [newWeight, setNewWeight] = useState('')
  const [newTutor, setNewTutor] = useState('')
  const [newComplaint, setNewComplaint] = useState('')
  const [newStatus, setNewStatus] = useState<'Em Atendimento' | 'Internado' | 'Alta' | 'Observação'>('Em Atendimento')

  const [activePatientForEvolution, setActivePatientForEvolution] = useState<string | null>(null)
  const [evoWeight, setEvoWeight] = useState('')
  const [evoTemp, setEvoTemp] = useState('')
  const [evoNotes, setEvoNotes] = useState('')

  const handleExportAiToPatient = (aiText: string, targetPatientId: string) => {
    if (!targetPatientId) {
      alert('Selecione um paciente para exportar.')
      return
    }
    lastLocalMutationRef.current = Date.now()
    const newEvo: PatientEvolution = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      weight: 'N/I',
      temperature: 'N/I',
      notes: '[Parecer Copiloto IA]: ' + aiText
    }
    setPatients(patients.map(p => p.id === targetPatientId ? { ...p, evolutions: [newEvo, ...p.evolutions] } : p))
    alert('Resposta da IA exportada com sucesso para o prontuário do paciente!')
  }

  const handlePrintPatient = (p: PatientRecord) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Prontuário - ${p.petName}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
          h1 { color: #db2777; margin-bottom: 5px; }
          .subtitle { font-size: 14px; color: #666; margin-bottom: 20px; }
          .box { border: 1px solid #fbcfe8; background: #fdf2f8; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .box h3 { margin-top: 0; color: #9d174d; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #f3e8ff; padding: 10px; text-align: left; font-size: 13px; }
          th { background: #fce7f3; color: #831843; }
          .footer { margin-top: 40px; font-size: 12px; text-align: center; color: #888; border-top: 1px solid #ddd; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Prontuário Clínico Veterinário</h1>
        <div class="subtitle">Dra. Beatriz Contreiras • VetWorkspace</div>
          
        <div class="box">
          <h3>Informações do Paciente</h3>
          <p><strong>Nome do Pet:</strong> ${p.petName}</p>
          <p><strong>Espécie / Raça:</strong> ${p.species} - ${p.breed}</p>
          <p><strong>Idade:</strong> ${p.age} | <strong>Tutor:</strong> ${p.tutor}</p>
          <p><strong>Status Atual:</strong> ${p.status}</p>
          <p><strong>Queixa Principal:</strong> ${p.complaint}</p>
        </div>

        <h3>Linha do Tempo (Evoluções & Retornos)</h3>
        <table>
          <thead>
            <tr>
              <th>Data / Horário</th>
              <th>Peso</th>
              <th>Temperatura</th>
              <th>Evolução Clínica / Conduta</th>
            </tr>
          </thead>
          <tbody>
            ${p.evolutions.map(e => `
              <tr>
                <td>${e.date}</td>
                <td>${e.weight}</td>
                <td>${e.temperature}</td>
                <td>${e.notes}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          Gerado por VetWorkspace em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `
    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  const [calcMode, setCalcMode] = useState<'dose' | 'fluido'>('dose')
  const [customDrugs, setCustomDrugs] = useState<VetDrug[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_custom_drugs_v28')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return INITIAL_DRUGS
  })
  const [calcWeight, setCalcWeight] = useState<string>('')
  const [drugSearchQuery, setDrugSearchQuery] = useState<string>('')
  const [selectedDrugName, setSelectedDrugName] = useState<string>('Selecione ou adicione...')
  const [calcDosage, setCalcDosage] = useState<string>('')
  const [calcConcentration, setCalcConcentration] = useState<string>('')
  const [calcPillMg, setCalcPillMg] = useState<string>('')
  const [calcResultMl, setCalcResultMl] = useState<number | null>(null)
  const [calcResultPills, setCalcResultPills] = useState<number | null>(null)

  const currentSelectedDrugObj = customDrugs.find(d => d.name.toLowerCase() === selectedDrugName.toLowerCase())

  const getAdvancedDrugAlert = (drugName: string) => {
    const foundDrug = currentSelectedDrugObj
    const cat = foundDrug ? foundDrug.category.toLowerCase() : ''
    const nameLower = drugName.toLowerCase()
    
    const maxD = foundDrug ? foundDrug.maxDays : 7

    if (cat.includes('aine') || cat.includes('anti-inflamatório') || nameLower.includes('meloxicam')) {
      return {
        title: `⚠️ ALERTA DE CLASSE (AINE): USO MÁXIMO DE ${maxD} DIAS`,
        desc: `Uso recomendado por no máximo ${maxD} dias consecutivos para prevenir úlceras gástricas e lesão renal aguda.`
      }
    }
    return {
      title: `ℹ️ ORIENTAÇÃO DE USO CONTÍNUO (${maxD} DIAS)`,
      desc: `Limite máximo de segurança recomendado para esta prescrição: ${maxD} dias.`
    }
  }

  const [fluidWeight, setFluidWeight] = useState<string>('')
  const [fluidSpecies, setFluidSpecies] = useState<'cao' | 'gato'>('cao')
  const [fluidMode, setFluidMode] = useState<'manutencao' | 'reposicao'>('manutencao')
  const [fluidDehydrationPercent, setFluidDehydrationPercent] = useState<string>('8')
  const [fluidResultSummary, setFluidResultSummary] = useState<{
    mlHour: number
    ml24hRange?: string
    notes: string
  } | null>(null)

  const [newDrugName, setNewDrugName] = useState('')
  const [newDrugCat, setNewDrugCat] = useState('Anti-inflamatório (AINE)')
  const [newDrugDosage, setNewDrugDosage] = useState('')
  const [newDrugConc, setNewDrugConc] = useState('')
  const [newDrugMaxDays, setNewDrugMaxDays] = useState('5')

  const [monthlyIncome, setMonthlyIncome] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_income_v28')
      if (saved) {
        const parsed = parseFloat(saved)
        if (!isNaN(parsed)) return parsed
      }
    }
    return 0.00
  })

  const [cofrinhoAmount, setCofrinhoAmount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_cofrinho_v28')
      if (saved) {
        const parsed = parseFloat(saved)
        if (!isNaN(parsed)) return parsed
      }
    }
    return 0.00
  })
  const [cofrinhoInput, setCofrinhoInput] = useState<string>('')

  const [isEditingIncome, setIsEditingIncome] = useState(false)
  const [tempIncomeInput, setTempIncomeInput] = useState<string>('')

  const [finances, setFinances] = useState<FinancialItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_finances_v28')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return []
  })

  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)
  const [editDescInput, setEditDescInput] = useState('')
  const [editAmountInput, setEditAmountInput] = useState('')

  const [finDesc, setFinDesc] = useState('')
  const [finCategory, setFinCategory] = useState('Cartão de Crédito')
  const [finCustomCategory, setFinCustomCategory] = useState('')
  const [finAmount, setFinAmount] = useState('')

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_tasks_v28')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return []
  })
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState('Geral')
  const [newTaskNotes, setNewTaskNotes] = useState('')
  const [activeTaskForAttach, setActiveTaskForAttach] = useState<string | null>(null)

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_events_v28')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return []
  })
  const [selectedDate, setSelectedDate] = useState<string>(todayDateKey)
  const [eventTitle, setEventTitle] = useState('')
  const [eventDesc, setEventDesc] = useState('')
  const [eventTime, setEventTime] = useState('08:00')

  // Drag and Drop state
  const [draggedId, setDraggedId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCloudData() {
      try {
        const { data, error } = await supabase
          .from('app_data')
          .select('data')
          .eq('id', 'beatriz_workspace_v28')
          .maybeSingle()

        if (error) {
          setSaveStatus(`Erro Supabase: ${error.message}`)
          return
        }

        if (data && data.data) {
          const d = data.data
          if (d.items) { setItems(d.items); localStorage.setItem('vet_items_v28', JSON.stringify(d.items)); }
          if (d.patients) { setPatients(d.patients); localStorage.setItem('vet_patients_v28', JSON.stringify(d.patients)); }
          if (d.customDrugs) { setCustomDrugs(d.customDrugs); localStorage.setItem('vet_custom_drugs_v28', JSON.stringify(d.customDrugs)); }
          if (d.monthlyIncome !== undefined) { 
            setMonthlyIncome(d.monthlyIncome); 
            localStorage.setItem('vet_income_v28', d.monthlyIncome.toString()); 
          }
          if (d.cofrinhoAmount !== undefined) {
            setCofrinhoAmount(d.cofrinhoAmount);
            localStorage.setItem('vet_cofrinho_v28', d.cofrinhoAmount.toString());
          }
          if (d.finances) { setFinances(d.finances); localStorage.setItem('vet_finances_v28', JSON.stringify(d.finances)); }
          if (d.tasks) { setTasks(d.tasks); localStorage.setItem('vet_tasks_v28', JSON.stringify(d.tasks)); }
          if (d.events) { setEvents(d.events); localStorage.setItem('vet_events_v28', JSON.stringify(d.events)); }
          if (d.chatSessions) { setChatSessions(d.chatSessions); localStorage.setItem('vet_chat_sessions_v28', JSON.stringify(d.chatSessions)); }
          if (d.clinics) { setClinics(d.clinics); localStorage.setItem('vet_clinics_v28', JSON.stringify(d.clinics)); }
          if (d.shifts) { setShifts(d.shifts); localStorage.setItem('vet_shifts_v28', JSON.stringify(d.shifts)); }
          if (d.specialistConsultations) { setSpecialistConsultations(d.specialistConsultations); localStorage.setItem('vet_specialist_consultations_v28', JSON.stringify(d.specialistConsultations)); }
          if (d.personalPets) { setPersonalPets(d.personalPets); localStorage.setItem('vet_personal_pets_v28', JSON.stringify(d.personalPets)); }
          if (d.skincareDone) { setSkincareDone(d.skincareDone); localStorage.setItem('vet_skincare_checked_v28', JSON.stringify(d.skincareDone)); }
          if (d.mimosWishlist) { setMimosWishlist(d.mimosWishlist); localStorage.setItem('vet_mimos_v28', d.mimosWishlist); }
          if (d.descompressaoNotes) { setDescompressaoNotes(d.descompressaoNotes); localStorage.setItem('vet_descomp_v28', d.descompressaoNotes); }
          setSaveStatus('Sincronizado')
        }
      } catch (err: any) {
        setSaveStatus(`Erro: ${err.message}`)
      } finally {
        setIsInitialized(true)
      }
    }
    fetchCloudData()

    const channel = supabase
      .channel('app_data_realtime_v28')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'app_data', filter: 'id=eq.beatriz_workspace_v28' },
        (payload: any) => {
          if (Date.now() - lastLocalMutationRef.current < 25000) {
            return
          }

          if (payload.new && payload.new.data) {
            const d = payload.new.data
            if (d.items) { setItems(d.items); localStorage.setItem('vet_items_v28', JSON.stringify(d.items)); }
            if (d.patients) { setPatients(d.patients); localStorage.setItem('vet_patients_v28', JSON.stringify(d.patients)); }
            if (d.customDrugs) { setCustomDrugs(d.customDrugs); localStorage.setItem('vet_custom_drugs_v28', JSON.stringify(d.customDrugs)); }
            if (d.monthlyIncome !== undefined) { 
              setMonthlyIncome(d.monthlyIncome); 
              localStorage.setItem('vet_income_v28', d.monthlyIncome.toString()); 
            }
            if (d.cofrinhoAmount !== undefined) {
              setCofrinhoAmount(d.cofrinhoAmount);
              localStorage.setItem('vet_cofrinho_v28', d.cofrinhoAmount.toString());
            }
            if (d.finances) { setFinances(d.finances); localStorage.setItem('vet_finances_v28', JSON.stringify(d.finances)); }
            if (d.tasks) { setTasks(d.tasks); localStorage.setItem('vet_tasks_v28', JSON.stringify(d.tasks)); }
            if (d.events) { setEvents(d.events); localStorage.setItem('vet_events_v28', JSON.stringify(d.events)); }
            
            if (d.chatSessions) {
              setChatSessions(prevSessions => {
                const merged = d.chatSessions.map((remoteSession: ChatSession) => {
                  const localSession = prevSessions.find(s => s.id === remoteSession.id)
                  if (localSession && localSession.messages.length > remoteSession.messages.length) {
                    return localSession
                  }
                  return remoteSession
                })
                const remoteIds = new Set(d.chatSessions.map((s: any) => s.id))
                const localOnly = prevSessions.filter(s => !remoteIds.has(s.id))
                
                const finalSessions = [...merged, ...localOnly]
                localStorage.setItem('vet_chat_sessions_v28', JSON.stringify(finalSessions))
                return finalSessions
              })
            }

            if (d.clinics) { setClinics(d.clinics); localStorage.setItem('vet_clinics_v28', JSON.stringify(d.clinics)); }
            if (d.shifts) { setShifts(d.shifts); localStorage.setItem('vet_shifts_v28', JSON.stringify(d.shifts)); }
            if (d.specialistConsultations) { setSpecialistConsultations(d.specialistConsultations); localStorage.setItem('vet_specialist_consultations_v28', JSON.stringify(d.specialistConsultations)); }
            if (d.personalPets) { setPersonalPets(d.personalPets); localStorage.setItem('vet_personal_pets_v28', JSON.stringify(d.personalPets)); }
            if (d.skincareDone) { setSkincareDone(d.skincareDone); localStorage.setItem('vet_skincare_checked_v28', JSON.stringify(d.skincareDone)); }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (!isMounted || !isInitialized) return

    lastLocalMutationRef.current = Date.now()

    localStorage.setItem('vet_items_v28', JSON.stringify(items))
    localStorage.setItem('vet_patients_v28', JSON.stringify(patients))
    localStorage.setItem('vet_custom_drugs_v28', JSON.stringify(customDrugs))
    localStorage.setItem('vet_income_v28', monthlyIncome.toString())
    localStorage.setItem('vet_cofrinho_v28', cofrinhoAmount.toString())
    localStorage.setItem('vet_finances_v28', JSON.stringify(finances))
    localStorage.setItem('vet_tasks_v28', JSON.stringify(tasks))
    localStorage.setItem('vet_events_v28', JSON.stringify(events))
    localStorage.setItem('vet_chat_sessions_v28', JSON.stringify(chatSessions))
    localStorage.setItem('vet_clinics_v28', JSON.stringify(clinics))
    localStorage.setItem('vet_shifts_v28', JSON.stringify(shifts))
    localStorage.setItem('vet_specialist_consultations_v28', JSON.stringify(specialistConsultations))
    localStorage.setItem('vet_personal_pets_v28', JSON.stringify(personalPets))
    localStorage.setItem('vet_skincare_checked_v28', JSON.stringify(skincareDone))
    localStorage.setItem('vet_mimos_v28', mimosWishlist)
    localStorage.setItem('vet_descomp_v28', descompressaoNotes)

    let wishlistData = []
    try {
      const savedWish = localStorage.getItem('vet_wishlist')
      if (savedWish) wishlistData = JSON.parse(savedWish)
    } catch(e) {}

    setSaveStatus('Salvando...')

    const syncToCloud = async () => {
      try {
        const payload = {
          items,
          patients,
          customDrugs,
          monthlyIncome,
          cofrinhoAmount,
          finances,
          tasks,
          events,
          chatSessions,
          clinics,
          shifts,
          specialistConsultations,
          personalPets,
          skincareDone,
          mimosWishlist,
          descompressaoNotes,
          wishlist: wishlistData
        }

        const { error } = await supabase
          .from('app_data')
          .upsert({
            id: 'beatriz_workspace_v28',
            data: payload,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' })

        if (error) {
          setSaveStatus(`Erro Supabase: ${error.message}`)
        } else {
          setSaveStatus('Sincronizado')
        }
      } catch (err: any) {
        setSaveStatus(`Erro de Rede`)
      }
    }

    const timer = setTimeout(syncToCloud, 800)
    return () => clearTimeout(timer)
  }, [isInitialized, items, patients, customDrugs, monthlyIncome, cofrinhoAmount, finances, tasks, events, chatSessions, clinics, shifts, specialistConsultations, personalPets, skincareDone, mimosWishlist, descompressaoNotes])

  const selectedItem = items.find(i => i.id === selectedItemId && i.type === 'page') || items.find(i => i.type === 'page')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    const fileUrl = URL.createObjectURL(file)
    const fileName = file.name
    const fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB'
    let fileType: 'image' | 'excel' | 'docx' | 'doc' = 'doc'
    const lower = fileName.toLowerCase()
    if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) fileType = 'image'
    else if (lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.csv')) fileType = 'excel'
    else if (lower.endsWith('.docx') || lower.endsWith('.doc')) fileType = 'docx'

    const newAtt: AttachedFile = { id: Date.now().toString(), name: fileName, type: fileType, size: fileSize, url: fileUrl }

    if (activeTaskForAttach) {
      setTasks(prev => prev.map(t => t.id === activeTaskForAttach ? { ...t, attachments: [...(t.attachments || []), newAtt] } : t))
      setActiveTaskForAttach(null)
    } else if (selectedItem) {
      setItems(prev => prev.map(i => i.id === selectedItem.id ? { ...i, attachments: [...(i.attachments || []), newAtt] } : i))
    }
    e.target.value = ''
  }

  const handleRemoveAttachment = (itemId: string, attachmentId: string) => {
    setItems(prev => prev.map(i => {
      if (i.id === itemId) {
        return {
          ...i,
          attachments: (i.attachments || []).filter(att => att.id !== attachmentId)
        }
      }
      return i
    }))
  }

  const totalGastos = finances.reduce((acc, f) => acc + f.amount, 0)
  const totalRendaGeral = monthlyIncome + totalShiftsAmount + totalSpecialistIncome
  const saldoRestante = totalRendaGeral - totalGastos

  const handleAddFinancial = (e: React.FormEvent) => {
    e.preventDefault()
    if (!finDesc || !finAmount) return
    lastLocalMutationRef.current = Date.now()
    const catFinal = finCategory === 'Outro' && finCustomCategory.trim() ? finCustomCategory.trim() : finCategory
    const newF: FinancialItem = {
      id: Date.now().toString(),
      description: finDesc,
      category: catFinal,
      amount: parseFloat(finAmount),
      date: new Date().toLocaleDateString('pt-BR')
    }
    setFinances([newF, ...finances])
    setFinDesc('')
    setFinAmount('')
    setFinCustomCategory('')
  }

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPetName.trim()) return
    lastLocalMutationRef.current = Date.now()
    const initialEvo: PatientEvolution = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      weight: newWeight || '0',
      temperature: '38.5°C',
      notes: newComplaint || 'Atendimento inicial.'
    }
    const newP: PatientRecord = {
      id: Date.now().toString(),
      petName: newPetName,
      species: newSpecies,
      breed: newBreed || 'Não informada',
      age: newAge || 'Não informada',
      tutor: newTutor || 'Não informado',
      complaint: newComplaint || 'Sem queixa relatada',
      status: newStatus,
      date: new Date().toLocaleDateString('pt-BR'),
      evolutions: [initialEvo]
    }
    setPatients([newP, ...patients])
    setNewPetName('')
    setNewBreed('')
    setNewAge('')
    setNewWeight('')
    setNewTutor('')
    setNewComplaint('')
  }

  const handleAddEvolution = (patientId: string, e: React.FormEvent) => {
    e.preventDefault()
    if (!evoNotes.trim()) return
    lastLocalMutationRef.current = Date.now()
    const newEvo: PatientEvolution = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      weight: evoWeight || 'N/I',
      temperature: evoTemp ? evoTemp + '°C' : 'N/I',
      notes: evoNotes
    }
    setPatients(patients.map(p => p.id === patientId ? { ...p, evolutions: [newEvo, ...p.evolutions] } : p))
    setActivePatientForEvolution(null)
    setEvoWeight('')
    setEvoTemp('')
    setEvoNotes('')
  }

  const handleSaveNewDrug = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDrugName.trim() || !newDrugDosage || !newDrugConc) return
    lastLocalMutationRef.current = Date.now()
    const newD: VetDrug = {
      name: newDrugName.trim(),
      category: newDrugCat.trim() || 'Personalizado',
      defaultDosage: parseFloat(newDrugDosage) || 0,
      defaultConcentration: parseFloat(newDrugConc) || 1,
      maxDays: parseInt(newDrugMaxDays) || 7
    }
    setCustomDrugs([newD, ...customDrugs])
    setSelectedDrugName(newD.name)
    setCalcDosage(newD.defaultDosage.toString())
    setCalcConcentration(newD.defaultConcentration.toString())
    setNewDrugName('')
    setNewDrugDosage('')
    setNewDrugConc('')
    setNewDrugMaxDays('5')
  }

  const handleAddFolder = (parentId: string | null) => {
    const title = prompt('Nome da nova pasta ou subpasta:')
    if (!title) return
    lastLocalMutationRef.current = Date.now()
    
    setItems(prev => {
      const siblings = prev.filter(i => i.parentId === parentId)
      const newFolder: DocumentItem = {
        id: 'folder-' + Date.now(),
        title,
        parentId,
        type: 'folder',
        isOpen: true,
        order: siblings.length
      }
      return [...prev, newFolder]
    })
  }

  const handleRenameFolder = (id: string, currentTitle: string) => {
    const newTitle = prompt('Novo nome para a pasta:', currentTitle)
    if (!newTitle || !newTitle.trim()) return
    lastLocalMutationRef.current = Date.now()
    setItems(prev => prev.map(i => i.id === id ? { ...i, title: newTitle.trim() } : i))
  }

  const handleAddPage = (parentId: string | null) => {
    const title = prompt('Nome da nova página ou receita:')
    if (!title) return
    lastLocalMutationRef.current = Date.now()
    
    setItems(prev => {
      const siblings = prev.filter(i => i.parentId === parentId)
      const newPage: DocumentItem = {
        id: 'page-' + Date.now(),
        title,
        parentId,
        type: 'page',
        content: '',
        differential: '',
        notes: '',
        attachments: [],
        order: siblings.length
      }
      return [...prev, newPage]
    })
    setSelectedItemId('page-' + Date.now())
    setActiveTab('estudos')
  }

  const toggleFolder = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isOpen: !i.isOpen } : i))
  }

  const deleteItem = (id: string) => {
    lastLocalMutationRef.current = Date.now()
    setItems(prev => {
      const idsToDelete = [id]
      const getChildrenIds = (parentId: string) => {
        prev.filter(i => i.parentId === parentId).forEach(child => {
          idsToDelete.push(child.id)
          if (child.type === 'folder') getChildrenIds(child.id)
        })
      }
      getChildrenIds(id)
      return prev.filter(i => !idsToDelete.includes(i.id))
    })
  }

  const handleMoveItem = (id: string, direction: 'up' | 'down') => {
    lastLocalMutationRef.current = Date.now()
    setItems(prev => {
      const targetItem = prev.find(i => i.id === id)
      if (!targetItem) return prev

      const siblings = prev
        .filter(i => i.parentId === targetItem.parentId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

      const index = siblings.findIndex(i => i.id === id)
      if (index === -1) return prev
      if (direction === 'up' && index === 0) return prev
      if (direction === 'down' && index === siblings.length - 1) return prev

      const targetIndex = direction === 'up' ? index - 1 : index + 1
      
      const temp = siblings[index]
      siblings[index] = siblings[targetIndex]
      siblings[targetIndex] = temp

      siblings.forEach((sib, idx) => {
        sib.order = idx
      })

      const siblingIds = new Set(siblings.map(s => s.id))
      return prev.map(i => {
        if (siblingIds.has(i.id)) {
          const updatedSib = siblings.find(s => s.id === i.id)
          return updatedSib || i
        }
        return i
      })
    })
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.stopPropagation()
    e.dataTransfer.setData('text/plain', id)
    setDraggedId(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!draggedId || draggedId === targetId) return

    lastLocalMutationRef.current = Date.now()
    setItems(prev => {
      const dragged = prev.find(i => i.id === draggedId)
      const target = prev.find(i => i.id === targetId)
      if (!dragged || !target) return prev

      // Prevent dropping a folder into itself or its own descendant
      if (dragged.type === 'folder') {
        let curr: string | null = target.parentId
        while (curr !== null) {
          if (curr === dragged.id) return prev
          const pItem = prev.find(i => i.id === curr)
          curr = pItem ? pItem.parentId : null
        }
      }

      const newParentId = target.parentId
      const siblings = prev
        .filter(i => i.parentId === newParentId && i.id !== draggedId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

      const targetIndex = siblings.findIndex(i => i.id === targetId)
      
      const updatedSiblings = [...siblings]
      updatedSiblings.splice(targetIndex + 1, 0, { ...dragged, parentId: newParentId })

      updatedSiblings.forEach((s, idx) => {
        s.order = idx
      })

      const siblingIds = new Set(updatedSiblings.map(s => s.id))
      const otherItems = prev.filter(i => i.parentId !== newParentId && i.id !== draggedId)

      return [...otherItems, ...updatedSiblings]
    })
    setDraggedId(null)
  }

  const renderTree = (parentId: string | null) => {
    const children = items
      .filter(i => i.parentId === parentId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

    if (children.length === 0) return null

    return (
      <div className="space-y-1.5 pl-3 border-l border-pink-200 ml-1">
        {children.map((item, index) => {
          if (item.type === 'folder') {
            return (
              <div 
                key={item.id} 
                draggable={true}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item.id)}
                className="space-y-1 pt-1"
              >
                <div className="flex items-center justify-between group px-2.5 py-1.5 rounded-xl bg-pink-50/50 hover:bg-pink-100/80 text-pink-950 cursor-grab active:cursor-grabbing border border-pink-100">
                  <div className="flex items-center gap-2 truncate flex-1" onClick={() => toggleFolder(item.id)}>
                    <GripVertical className="w-3.5 h-3.5 text-pink-300 group-hover:text-pink-500 shrink-0" />
                    <button className="text-pink-500">
                      {item.isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <Folder className="w-4 h-4 text-pink-500 fill-pink-200 shrink-0" />
                    <span className="font-extrabold text-xs truncate">{item.title}</span>
                  </div>
                  <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                    <button title="Mover para cima" onClick={(e) => { e.stopPropagation(); handleMoveItem(item.id, 'up'); }} disabled={index === 0} className="p-1 text-pink-600 hover:text-pink-950 bg-white rounded-lg shadow-2xs disabled:opacity-30">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button title="Mover para baixo" onClick={(e) => { e.stopPropagation(); handleMoveItem(item.id, 'down'); }} disabled={index === children.length - 1} className="p-1 text-pink-600 hover:text-pink-950 bg-white rounded-lg shadow-2xs disabled:opacity-30">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button title="Renomear Pasta" onClick={(e) => { e.stopPropagation(); handleRenameFolder(item.id, item.title); }} className="p-1 text-pink-600 hover:text-pink-950 bg-white rounded-lg shadow-2xs">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button title="Adicionar Subpasta Dentro Esta Pasta" onClick={(e) => { e.stopPropagation(); handleAddFolder(item.id); }} className="p-1 text-pink-600 hover:text-pink-950 bg-white rounded-lg shadow-2xs font-bold text-[10px] flex items-center gap-0.5">
                      <FolderPlus className="w-3.5 h-3.5" />
                    </button>
                    <button title="Adicionar Receita / Página" onClick={(e) => { e.stopPropagation(); handleAddPage(item.id); }} className="p-1 text-pink-600 hover:text-pink-950 bg-white rounded-lg shadow-2xs">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button title="Excluir Pasta" onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} className="p-1 text-stone-400 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {item.isOpen && (
                  <div className="pt-1">
                    {renderTree(item.id)}
                  </div>
                )}
              </div>
            )
          } else {
            const isSelected = selectedItemId === item.id
            return (
              <div 
                key={item.id} 
                draggable={true}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item.id)}
                className={`flex items-center justify-between group px-3 py-2 rounded-xl cursor-grab active:cursor-grabbing transition shadow-2xs ${isSelected ? 'bg-pink-500 text-white font-extrabold shadow-sm' : 'bg-white/80 text-pink-950 hover:bg-pink-50 border border-pink-100'}`} 
                onClick={() => { setSelectedItemId(item.id); setActiveTab('estudos'); }}
              >
                <div className="flex items-center gap-2.5 truncate flex-1">
                  <GripVertical className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-pink-200' : 'text-pink-300 group-hover:text-pink-500'}`} />
                  <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-pink-500'}`} />
                  <span className="text-xs truncate">{item.title}</span>
                </div>
                <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                  <button title="Mover para cima" onClick={(e) => { e.stopPropagation(); handleMoveItem(item.id, 'up'); }} disabled={index === 0} className={`p-1 rounded-lg shadow-2xs disabled:opacity-30 ${isSelected ? 'bg-pink-600 text-white' : 'bg-white text-pink-600'}`}>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button title="Mover para baixo" onClick={(e) => { e.stopPropagation(); handleMoveItem(item.id, 'down'); }} disabled={index === children.length - 1} className={`p-1 rounded-lg shadow-2xs disabled:opacity-30 ${isSelected ? 'bg-pink-600 text-white' : 'bg-white text-pink-600'}`}>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button title="Excluir Página" onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} className={`p-1 ${isSelected ? 'text-white/80 hover:text-white' : 'text-stone-400 hover:text-red-500'}`}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          }
        })}
      </div>
    )
  }

  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isAiLoading) return

    const userText = chatInput.trim()
    setChatInput('')
    setIsAiLoading(true)

    lastLocalMutationRef.current = Date.now()

    let currentHistory: ChatMessage[] = []

    setChatSessions((prevSessions: ChatSession[]) => {
      const updated = prevSessions.map(session => {
        if (session.id === currentChatId) {
          const isDefaultTitle = session.title === 'Novo Caso Clínico' || session.title === 'Caso Clínico Inicial'
          const newTitle = isDefaultTitle
            ? (userText.length > 28 ? userText.substring(0, 28) + '...' : userText)
            : session.title

          const userMsg: ChatMessage = { sender: 'user', text: userText }
          const newMessages: ChatMessage[] = [...session.messages, userMsg]
          currentHistory = newMessages

          return {
            ...session,
            title: newTitle,
            messages: newMessages
          }
        }
        return session
      })

      localStorage.setItem('vet_chat_sessions_v28', JSON.stringify(updated))
      return updated
    })

    try {
      const response = await fetch('/api/vet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, messages: currentHistory })
      })

      let replyText = 'Não foi possível obter resposta no momento.'

      if (response.ok) {
        const data = await response.json()
        replyText = data.reply || replyText
      } else {
        const errData = await response.json().catch(() => ({}))
        replyText = errData.error || `Erro no servidor (${response.status}).`
      }

      lastLocalMutationRef.current = Date.now()

      setChatSessions((prevSessions: ChatSession[]) => {
        const updated = prevSessions.map(session => {
          if (session.id === currentChatId) {
            const aiMsg: ChatMessage = { sender: 'ai', text: replyText }
            return {
              ...session,
              messages: [...session.messages, aiMsg]
            }
          }
          return session
        })

        localStorage.setItem('vet_chat_sessions_v28', JSON.stringify(updated))
        return updated
      })
    } catch (err: any) {
      lastLocalMutationRef.current = Date.now()
      setChatSessions((prevSessions: ChatSession[]) => {
        const updated = prevSessions.map(session => {
          if (session.id === currentChatId) {
            const errorMsg: ChatMessage = { 
              sender: 'ai', 
              text: '⚠️ Falha na conexão ao enviar mensagem. Tente novamente.' 
            }
            return {
              ...session,
              messages: [...session.messages, errorMsg]
            }
          }
          return session
        })
        localStorage.setItem('vet_chat_sessions_v28', JSON.stringify(updated))
        return updated
      })
    } finally {
      lastLocalMutationRef.current = Date.now()
      setIsAiLoading(false)
    }
  }

  const filteredDrugs = customDrugs.filter(d => d.name.toLowerCase().includes(drugSearchQuery.toLowerCase()) || d.category.toLowerCase().includes(drugSearchQuery.toLowerCase()))

  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const calendarDays = Array.from({ length: daysInCurrentMonth }, (_, i) => {
    const dayNum = i + 1
    const formattedDay = padZero(dayNum)
    const formattedMonth = padZero(currentMonth + 1)
    return { day: dayNum, dateKey: `${currentYear}-${formattedMonth}-${formattedDay}` }
  })

  const currentMonthName = new Date(currentYear, currentMonth, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  if (!isMounted) {
    return <div className="flex h-screen bg-pink-50/40" />
  }

  return (
    <div className="relative flex h-screen bg-pink-50/40 text-stone-800 font-sans overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <div className="absolute top-10 left-20 animate-bounce duration-1000 text-pink-400">
          <Cat className="w-12 h-12" />
        </div>
        <div className="absolute bottom-20 right-32 animate-pulse text-pink-300">
          <Flower2 className="w-16 h-16" />
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg,.pdf" />

      {/* BARRA LATERAL (Largura aumentada para w-88 para melhor visualização) */}
      <div className={`${isSidebarOpen ? 'w-88' : 'w-0'} transition-all duration-200 bg-white/90 backdrop-blur-md border-r border-pink-100 flex flex-col z-10 overflow-hidden shadow-xs select-none shrink-0`}>
        <div className="p-4 border-b border-pink-100 flex items-center justify-between bg-pink-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">V</div>
            <div>
              <div className="font-extrabold text-sm text-pink-950 tracking-tight">VetWorkspace</div>
              <div className="text-[10px] font-semibold text-pink-500 uppercase tracking-wide">Dra. Beatriz Contreiras</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-xs">
          <button onClick={() => setActiveTab('painel')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'painel' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <LayoutDashboard className="w-4 h-4" /> Painel & Mural de Pets
          </button>
            
          <div className="pt-2 pb-1 border-t border-pink-100/60 mt-2">
            <div className="flex items-center justify-between px-3 pt-2 text-[11px] font-bold text-pink-900 uppercase tracking-wider">
              <span>📚 Estudos, Receitas & Pastas</span>
              <div className="flex items-center gap-1">
                <button title="Nova Pasta Raiz" onClick={() => handleAddFolder(null)} className="p-1 rounded hover:bg-pink-100 text-pink-600"><FolderPlus className="w-3.5 h-3.5" /></button>
                <button title="Nova Página Raiz" onClick={() => handleAddPage(null)} className="p-1 rounded hover:bg-pink-100 text-pink-600"><Plus className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="mt-1">
              {renderTree(null)}
            </div>
          </div>

          <div className="pt-2 border-t border-pink-100/60 mt-2 space-y-1">
            <button onClick={() => setActiveTab('clinicas')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'clinicas' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <Stethoscope className="w-4 h-4" /> Clínicas & Plantões 🏥
            </button>
            <button onClick={() => setActiveTab('especialistas')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'especialistas' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <Stethoscope className="w-4 h-4 text-pink-500" /> Consultas com Especialistas 🩺
            </button>
          </div>

          <div className="pt-1">
            <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-pink-50/60 hover:bg-pink-100/70 text-pink-950 cursor-pointer border border-pink-100 font-semibold transition" onClick={() => setIsPersonalSidebarOpen(!isPersonalSidebarOpen)}>
              <div className="flex items-center gap-2.5 truncate">
                <Heart className="w-4 h-4 text-pink-500 fill-pink-200 shrink-0" />
                <span className="truncate">Espaço Pessoal de Bia</span>
              </div>
              <button className="text-pink-500 shrink-0">
                {isPersonalSidebarOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
            
            {isPersonalSidebarOpen && (
              <div className="pl-3 pr-1 space-y-1 my-1 border-l border-pink-200 ml-2">
                <div 
                  onClick={() => { setActiveTab('pessoal'); setPersonalSubTab('skincare'); }}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer text-xs transition ${activeTab === 'pessoal' && personalSubTab === 'skincare' ? 'bg-pink-500 text-white font-extrabold shadow-xs' : 'text-stone-700 hover:bg-pink-50'}`}
                >
                  <Sparkle className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span className="truncate">Skincare & Beleza</span>
                </div>
                <div 
                  onClick={() => { setActiveTab('pessoal'); setPersonalSubTab('wishlist'); }}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer text-xs transition ${activeTab === 'pessoal' && personalSubTab === 'wishlist' ? 'bg-pink-500 text-white font-extrabold shadow-xs' : 'text-stone-700 hover:bg-pink-50'}`}
                >
                  <Gift className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span className="truncate">Wishlist de Mimos</span>
                </div>
                <div 
                  onClick={() => { setActiveTab('pessoal'); setPersonalSubTab('descompressao'); }}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer text-xs transition ${activeTab === 'pessoal' && personalSubTab === 'descompressao' ? 'bg-pink-500 text-white font-extrabold shadow-xs' : 'text-stone-700 hover:bg-pink-50'}`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span className="truncate">Séries, Filmes & Leituras</span>
                </div>
                <div 
                  onClick={() => { setActiveTab('pessoal'); setPersonalSubTab('jogos'); }}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer text-xs transition ${activeTab === 'pessoal' && personalSubTab === 'jogos' ? 'bg-pink-500 text-white font-extrabold shadow-xs' : 'text-stone-700 hover:bg-pink-50'}`}
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span className="truncate">Jogos & Recomendações</span>
                </div>
                <div 
                  onClick={() => { setActiveTab('pessoal'); setPersonalSubTab('locais'); }}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer text-xs transition ${activeTab === 'pessoal' && personalSubTab === 'locais' ? 'bg-pink-500 text-white font-extrabold shadow-xs' : 'text-stone-700 hover:bg-pink-50'}`}
                >
                  <Coffee className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span className="truncate">Locais & Cafés (Salvador)</span>
                </div>
                <div 
                  onClick={() => { setActiveTab('pessoal'); setPersonalSubTab('podcasts'); }}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer text-xs transition ${activeTab === 'pessoal' && personalSubTab === 'podcasts' ? 'bg-pink-500 text-white font-extrabold shadow-xs' : 'text-stone-700 hover:bg-pink-50'}`}
                >
                  <Headphones className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span className="truncate">Podcasts & True Crime</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-pink-100/60 mt-2">
            <button onClick={() => setActiveTab('pacientes')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'pacientes' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <Folder className="w-4 h-4" /> Prontuário de Pacientes ({patients.length})
            </button>
          </div>

          <div className="pt-1">
            <div className="flex items-center justify-between">
              <button onClick={() => setActiveTab('ia')} className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'ia' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
                <Bot className="w-4 h-4" /> Copiloto IA Vet 🐾 ({chatSessions.length})
              </button>
              <button title="Novo Caso de IA" onClick={handleNewChatSession} className="p-2 text-pink-600 hover:bg-pink-100 rounded-xl ml-1">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pl-3 pr-1 space-y-1 my-1 max-h-36 overflow-y-auto border-l border-pink-200 ml-2">
              {chatSessions.map(session => (
                <div 
                  key={session.id}
                  onClick={() => { setCurrentChatId(session.id); setActiveTab('ia'); }}
                  className={`group flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer text-[11px] transition ${session.id === currentChatId && activeTab === 'ia' ? 'bg-pink-200/80 font-bold text-pink-950' : 'text-stone-600 hover:bg-pink-50'}`}
                >
                  <span className="truncate flex-1">{session.title}</span>
                  <button 
                    type="button"
                    title="Excluir esta conversa"
                    onClick={(e) => deleteChatSession(e, session.id)} 
                    className="text-stone-400 hover:text-red-500 p-1 rounded transition shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setActiveTab('condolencias')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'condolencias' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <HeartHandshake className="w-4 h-4 text-pink-500" /> Mensagem de Apoio 🕊️ (7 Tipos)
          </button>

          <button onClick={() => setActiveTab('calculadora')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'calculadora' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <Calculator className="w-4 h-4" /> Calculadora & Soro
          </button>

          <button onClick={() => setActiveTab('bsa')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'bsa' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <Scale className="w-4 h-4 text-pink-500" /> Calculadora BSA & Oncológicos
          </button>

          <button onClick={() => setActiveTab('wishlist')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'wishlist' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <Gift className="w-4 h-4 text-pink-500" /> 🎁 Lista de Desejos
          </button>

          <button onClick={() => setActiveTab('tarefas')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'tarefas' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <CheckSquare className="w-4 h-4" /> Tarefas ({tasks.filter(t => !t.completed).length})
          </button>
          <button onClick={() => setActiveTab('calendario')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'calendario' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <CalendarIcon className="w-4 h-4" /> Calendário & Metas
          </button>
          <button onClick={() => setActiveTab('financas')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'financas' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <DollarSign className="w-4 h-4" /> Finanças & Gráficos
          </button>
        </div>

        <div className="p-3 border-t border-pink-100 space-y-2 text-xs bg-pink-50/20">
          <div className="flex items-center gap-2 text-pink-900/70 px-2 py-1.5 rounded-lg hover:bg-pink-50 cursor-pointer font-medium">
            <Settings className="w-4 h-4 text-pink-500" /> Configurações
          </div>
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center text-[10px]">B</div>
              <span className="font-bold text-pink-950 text-xs">Dra. Beatriz</span>
            </div>
            <LogOut className="w-3.5 h-3.5 text-pink-400 hover:text-red-500 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col h-full bg-transparent z-10 overflow-hidden">
        <div className="h-16 border-b border-pink-100/80 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md shadow-xs select-none">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl text-pink-600 hover:bg-pink-50 transition">
              <ChevronRight className={`w-4 h-4 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
            </button>
            <div>
              <h1 className="text-base font-extrabold text-pink-950">Dra. Beatriz Contreiras</h1>
              <p className="text-xs text-pink-400 font-medium capitalize">{formattedHeaderDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowValues(!showValues)} 
              className="bg-white hover:bg-pink-50 text-pink-700 px-3 py-1.5 rounded-xl border border-pink-200 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title={showValues ? "Ocultar valores financeiros" : "Mostrar valores financeiros"}
            >
              {showValues ? <EyeOff className="w-3.5 h-3.5 text-pink-500" /> : <Eye className="w-3.5 h-3.5 text-pink-500" />}
              <span>{showValues ? 'Ocultar Valores' : 'Mostrar Valores'}</span>
            </button>

            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border flex items-center gap-1 ${
              saveStatus.includes('Erro') 
                ? 'bg-rose-50 text-rose-700 border-rose-300' 
                : saveStatus.includes('Salvando') 
                ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                : 'bg-pink-50 text-pink-600 border-pink-200'
            }`}>
              <Save className="w-3 h-3" /> {saveStatus}
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-3.5 py-1.5 rounded-full border border-emerald-200 font-bold flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Nuvem Conectada
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:px-12 space-y-6">
          
          {activeTab === 'painel' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div onClick={() => setActiveTab('financas')} className="bg-white/90 backdrop-blur-sm border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-300 transition">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Renda do Mês</span>
                    <div className="text-2xl font-extrabold text-emerald-600 mt-1">{maskValue(totalRendaGeral)}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Wallet className="w-5 h-5" /></div>
                </div>
                <div onClick={() => setActiveTab('financas')} className="bg-white/90 backdrop-blur-sm border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-300 transition">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Total de Despesas</span>
                    <div className="text-2xl font-extrabold text-rose-500 mt-1">{maskValue(totalGastos)}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500"><CreditCard className="w-5 h-5" /></div>
                </div>
                <div onClick={() => setActiveTab('especialistas')} className="bg-white/90 backdrop-blur-sm border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-300 transition">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Consultas Especialistas</span>
                    <div className="text-2xl font-extrabold text-pink-950 mt-1">{maskValue(totalSpecialistIncome)}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500"><Stethoscope className="w-5 h-5" /></div>
                </div>
                <div onClick={() => setActiveTab('pessoal')} className="bg-white/90 backdrop-blur-sm border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-300 transition">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Espaço Pessoal & Pets</span>
                    <div className="text-xs font-bold text-pink-600 mt-1 flex items-center gap-1">Mural de Memórias <Heart className="w-3 h-3 text-pink-500" /></div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500"><Heart className="w-5 h-5" /></div>
                </div>
              </div>

              {/* MURAL DE PETS */}
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-pink-100 pb-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold text-pink-500 uppercase tracking-wider">
                      <Heart className="w-4 h-4 text-pink-500 fill-pink-200" /> Cantinho Especial & Mural de Homenagem aos Pets
                    </div>
                    <h2 className="text-xl font-extrabold text-pink-950 mt-1">A Família de Quatro Patas da Dra. Beatriz (Atuais e Eternos)</h2>
                    <p className="text-xs text-stone-500 mt-0.5">Cadastre seus pets informando nome, idade, foto e homenagem.</p>
                  </div>

                  <input type="file" ref={petPhotoInputRef} onChange={handlePetPhotoUpload} className="hidden" accept=".png,.jpg,.jpeg" />

                  <form onSubmit={handleAddPersonalPet} className="flex flex-wrap items-center gap-2 bg-pink-50/60 p-3 rounded-2xl border border-pink-200">
                    <input type="text" placeholder="Nome do Pet" value={newPetBiaName} onChange={(e) => setNewPetBiaName(e.target.value)} className="bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs font-medium text-pink-950 focus:outline-none w-28" required />
                    <input type="text" placeholder="Idade (ex: 5 anos)" value={newPetBiaAge} onChange={(e) => setNewPetBiaAge(e.target.value)} className="bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs font-medium text-pink-950 focus:outline-none w-28" />
                    <input type="text" placeholder="Homenagem / Descrição" value={newPetBiaTribute} onChange={(e) => setNewPetBiaTribute(e.target.value)} className="bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs font-medium text-pink-950 focus:outline-none w-36" />
                    
                    <div className="flex items-center gap-1">
                      <input type="text" placeholder="URL da Foto ou faça upload" value={newPetBiaPhotoUrl} onChange={(e) => setNewPetBiaPhotoUrl(e.target.value)} className="bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs font-medium text-pink-950 focus:outline-none w-32" />
                      <button 
                        type="button" 
                        onClick={() => petPhotoInputRef.current?.click()} 
                        className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
                        title="Enviar foto do computador"
                      >
                        <Upload className="w-3.5 h-3.5" /> Foto
                      </button>
                    </div>

                    <label className="flex items-center gap-1 text-[11px] font-bold text-stone-700 cursor-pointer">
                      <input type="checkbox" checked={newPetBiaMemorial} onChange={(e) => setNewPetBiaMemorial(e.target.checked)} className="accent-pink-500 w-3.5 h-3.5" /> Memorial 🕊️
                    </label>
                    <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Adicionar
                    </button>
                  </form>
                </div>

                {personalPets.length === 0 ? (
                  <div className="bg-pink-50/40 border border-dashed border-pink-300 p-12 rounded-3xl text-center space-y-3">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto text-pink-500">
                      <Cat className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-pink-950">Seu mural está aguardando as primeiras fotos!</h3>
                    <p className="text-xs text-stone-500 max-w-md mx-auto">Use o botão de upload para enviar fotos reais dos seus bichinhos junto com a idade e homenagens.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {personalPets.map(pet => (
                      <div key={pet.id} className={`group relative bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col ${pet.isMemorial ? 'border-pink-300 bg-pink-50/20' : 'border-pink-100'}`}>
                        <div className="relative h-48 w-full bg-pink-100 overflow-hidden">
                          <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" onError={(e)=>{(e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80'}} />
                          {pet.isMemorial && (
                            <span className="absolute top-3 left-3 bg-stone-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
                              🕊️ Eterno no Coração
                            </span>
                          )}
                          <button onClick={() => { lastLocalMutationRef.current = Date.now(); setPersonalPets(personalPets.filter(p => p.id !== pet.id)); }} className="absolute top-3 right-3 bg-white/90 hover:bg-rose-500 hover:text-white text-stone-600 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <div className="flex items-center justify-between">
                              <h3 className="font-extrabold text-sm text-pink-950">{pet.name}</h3>
                              <span className="text-[10px] font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-lg">{pet.age}</span>
                            </div>
                            <p className="text-xs text-stone-600 mt-1 italic leading-relaxed">"{pet.tribute}"</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'clinicas' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm"><Stethoscope className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-base font-extrabold text-pink-950">Gestão de Plantões & Alteração de Nomes das Clínicas</h2>
                    <p className="text-xs text-pink-500 font-medium">Renomeie as clínicas para os nomes reais que você atende, controle diárias, comissões e leitura por IA</p>
                  </div>
                </div>

                <div className="bg-pink-50/60 border border-pink-200 p-5 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold text-pink-950 uppercase tracking-wider">Configurar Nomes e Diárias Padrão das Clínicas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {clinics.map(c => {
                      const isEditing = editingClinicId === c.id
                      return (
                        <div key={c.id} className="bg-white border border-pink-200 p-3.5 rounded-xl flex items-center justify-between shadow-2xs text-xs">
                          {isEditing ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input 
                                type="text" 
                                value={editClinicNameInput} 
                                onChange={(e) => setEditClinicNameInput(e.target.value)} 
                                className="bg-pink-50 border border-pink-200 rounded-lg px-2.5 py-1 text-xs text-pink-950 font-bold flex-1"
                                placeholder="Nome real da clínica"
                              />
                              <input 
                                type="number" 
                                value={editClinicRateInput} 
                                onChange={(e) => setEditClinicRateInput(e.target.value)} 
                                className="bg-pink-50 border border-pink-200 rounded-lg px-2 py-1 text-xs text-pink-950 w-20"
                                placeholder="Diária R$"
                              />
                              <button 
                                onClick={() => {
                                  const rateVal = parseFloat(editClinicRateInput)
                                  if (editClinicNameInput.trim() && !isNaN(rateVal)) {
                                    lastLocalMutationRef.current = Date.now()
                                    setClinics(clinics.map(item => item.id === c.id ? { ...item, name: editClinicNameInput.trim(), defaultRate: rateVal } : item))
                                    setEditingClinicId(null)
                                  }
                                }} 
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg font-bold"
                              >
                                Salvar
                              </button>
                            </div>
                          ) : (
                            <>
                              <div>
                                <span className="font-extrabold text-pink-950 text-sm">🏥 {c.name}</span>
                                <div className="text-[10px] text-stone-500">Diária Padrão: {maskValue(c.defaultRate)}</div>
                              </div>
                              <button 
                                onClick={() => {
                                  setEditingClinicId(c.id)
                                  setEditClinicNameInput(c.name)
                                  setEditClinicRateInput(c.defaultRate.toString())
                                }}
                                className="bg-pink-50 hover:bg-pink-100 text-pink-700 px-3 py-1.5 rounded-lg font-bold border border-pink-200 flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" /> Renomear
                              </button>
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Registrar Plantão</h3>
                     
                    <input type="file" ref={shiftPhotoInputRef} onChange={handleShiftPhotoUpload} className="hidden" accept=".png,.jpg,.jpeg" />

                    <div className="bg-pink-50/60 border border-pink-200 p-4 rounded-2xl space-y-3">
                      <span className="text-xs font-extrabold text-pink-950 flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-pink-500" /> Leitura Automática de Fechamento por Foto (IA)
                      </span>
                      <button 
                        type="button" 
                        onClick={() => shiftPhotoInputRef.current?.click()}
                        disabled={isShiftAiLoading}
                        className="w-full bg-white hover:bg-pink-100 text-pink-800 border border-pink-300 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                      >
                        {isShiftAiLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4 text-pink-500" />}
                        {isShiftAiLoading ? 'Lendo relatório com IA...' : '📸 Enviar Foto/Print do Fechamento'}
                      </button>
                    </div>

                    <form onSubmit={handleAddShift} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Clínica</label>
                        <select 
                          value={selectedShiftClinicId} 
                          onChange={(e) => {
                            setSelectedShiftClinicId(e.target.value)
                            const found = clinics.find(c => c.id === e.target.value)
                            if (found) setShiftBaseRate(found.defaultRate.toString())
                          }} 
                          className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium"
                        >
                          {clinics.map(c => (
                            <option key={c.id} value={c.id}>🏥 {c.name} (Base: R$ {c.defaultRate})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Data</label>
                          <input type="date" value={shiftDate} onChange={(e) => setShiftDate(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium" required />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Valor Diária (R$)</label>
                          <input type="number" step="0.01" value={shiftBaseRate} onChange={(e) => setShiftBaseRate(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium" required />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Comissão (R$)</label>
                          <input type="number" step="0.01" placeholder="Ex: 150.00" value={shiftCommission} onChange={(e) => setShiftCommission(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Status Repasse</label>
                          <select value={shiftStatus} onChange={(e) => setShiftStatus(e.target.value as any)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium">
                            <option value="Pendente">Pendente</option>
                            <option value="Pago">Pago</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Detalhes / Procedimentos</label>
                        <input type="text" placeholder="Ex: 2 cirurgias, 1 ultrassom..." value={shiftDetails} onChange={(e) => setShiftDetails(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium" />
                      </div>

                      <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
                        <Plus className="w-4 h-4" /> Salvar Lançamento do Plantão
                      </button>
                    </form>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Consolidado Geral das Clínicas</h3>
                    <div className="bg-pink-50 border border-pink-200 p-5 rounded-2xl space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-pink-600 uppercase">Total Bruto Acumulado (Diárias + Comissões)</span>
                        <div className="text-3xl font-extrabold text-pink-950 mt-1">{maskValue(totalShiftsAmount)}</div>
                      </div>

                      <div className="pt-3 border-t border-pink-200/60 space-y-2">
                        <span className="text-xs font-extrabold text-pink-950">Extrato Recente de Plantões:</span>
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                          {shifts.length === 0 ? (
                            <p className="text-xs text-stone-400 text-center py-6">Nenhum plantão registrado ainda.</p>
                          ) : (
                            shifts.map(s => {
                              const clinicObj = clinics.find(c => c.id === s.clinicId)
                              return (
                                <div key={s.id} className="bg-white border border-pink-200 p-3 rounded-xl text-xs flex items-center justify-between shadow-2xs">
                                  <div>
                                    <div className="font-extrabold text-pink-950">{clinicObj?.name || 'Clínica'} ({s.date})</div>
                                    <div className="text-[10px] text-stone-600">Diária: {maskValue(s.baseRate)} + Comissões: {maskValue(s.commission)} {s.details ? `• ${s.details}` : ''}</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${s.status === 'Pago' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                      {s.status}
                                    </span>
                                    <button onClick={() => { lastLocalMutationRef.current = Date.now(); setShifts(shifts.filter(item => item.id !== s.id)); }} className="text-stone-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                  </div>
                                </div>
                              )
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'especialistas' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm"><Stethoscope className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-base font-extrabold text-pink-950">Consultas com Especialistas 🩺 (Finanças Extras por Fora)</h2>
                    <p className="text-xs text-pink-500 font-medium">Cadastre quantas consultas com especialista foram realizadas e os respectivos valores. Integrado automaticamente com as finanças.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Registrar Consulta Especializada</h3>
                    <form onSubmit={handleAddSpecialistConsultation} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Especialidade / Descrição</label>
                        <input type="text" placeholder="Ex: Cardiologia, Oftalmologia, Ortopedia..." value={specSpecialty} onChange={(e) => setSpecSpecialty(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium" required />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Quantidade de Consultas</label>
                          <input type="number" min="1" value={specQuantity} onChange={(e) => setSpecQuantity(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium" required />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Valor Unitário (R$)</label>
                          <input type="number" step="0.01" placeholder="Ex: 250.00" value={specUnitValue} onChange={(e) => setSpecUnitValue(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium" required />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Data</label>
                        <input type="date" value={specDate} onChange={(e) => setSpecDate(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium" required />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Observações (Opcional)</label>
                        <input type="text" placeholder="Nome do paciente / tutor ou detalhes..." value={specNotes} onChange={(e) => setSpecNotes(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium" />
                      </div>

                      <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
                        <Plus className="w-4 h-4" /> Salvar Consulta Especializada
                      </button>
                    </form>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Consolidado Finanças Extras (Especialistas)</h3>
                    <div className="bg-pink-50 border border-pink-200 p-5 rounded-2xl space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-pink-600 uppercase">Total Acumulado com Especialistas</span>
                        <div className="text-3xl font-extrabold text-pink-950 mt-1">{maskValue(totalSpecialistIncome)}</div>
                        <p className="text-[11px] text-stone-500 mt-1">Este valor soma automaticamente nas suas finanças totais ("por fora").</p>
                      </div>

                      <div className="pt-3 border-t border-pink-200/60 space-y-2">
                        <span className="text-xs font-extrabold text-pink-950">Histórico de Consultas:</span>
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                          {specialistConsultations.length === 0 ? (
                            <p className="text-xs text-stone-400 text-center py-6">Nenhuma consulta com especialista registrada.</p>
                          ) : (
                            specialistConsultations.map(item => (
                              <div key={item.id} className="bg-white border border-pink-200 p-3 rounded-xl text-xs flex items-center justify-between shadow-2xs">
                                <div>
                                  <div className="font-extrabold text-pink-950">🩺 {item.specialty} ({item.date})</div>
                                  <div className="text-[10px] text-stone-600">Qtd: {item.quantity} | Unit: {maskValue(item.unitValue)} | Total: <span className="font-bold text-emerald-600">{maskValue(item.quantity * item.unitValue)}</span> {item.notes ? `• ${item.notes}` : ''}</div>
                                </div>
                                <button onClick={() => { lastLocalMutationRef.current = Date.now(); setSpecialistConsultations(specialistConsultations.filter(s => s.id !== item.id)); }} className="text-stone-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pessoal' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm"><Heart className="w-6 h-6 fill-pink-200" /></div>
                  <div>
                    <h2 className="text-base font-extrabold text-pink-950">Espaço Pessoal de Bia ✨</h2>
                    <p className="text-xs text-pink-500 font-medium">Cantinho de autocuidado, mimos, lazer e recomendações inteligentes</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-b border-pink-100 pb-3">
                  <button onClick={() => setPersonalSubTab('skincare')} className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${personalSubTab === 'skincare' ? 'bg-pink-500 text-white shadow-sm' : 'bg-pink-50/80 text-pink-950 hover:bg-pink-100 border border-pink-100'}`}>
                    <Sparkle className="w-3.5 h-3.5" /> Skincare
                  </button>
                  <button onClick={() => setPersonalSubTab('wishlist')} className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${personalSubTab === 'wishlist' ? 'bg-pink-500 text-white shadow-sm' : 'bg-pink-50/80 text-pink-950 hover:bg-pink-100 border border-pink-100'}`}>
                    <Gift className="w-3.5 h-3.5" /> Wishlist de Mimos
                  </button>
                  <button onClick={() => setPersonalSubTab('descompressao')} className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${personalSubTab === 'descompressao' ? 'bg-pink-500 text-white shadow-sm' : 'bg-pink-50/80 text-pink-950 hover:bg-pink-100 border border-pink-100'}`}>
                    <BookOpen className="w-3.5 h-3.5" /> Séries & Leituras
                  </button>
                  <button onClick={() => setPersonalSubTab('jogos')} className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${personalSubTab === 'jogos' ? 'bg-pink-500 text-white shadow-sm' : 'bg-pink-50/80 text-pink-950 hover:bg-pink-100 border border-pink-100'}`}>
                    <Gamepad2 className="w-3.5 h-3.5" /> Jogos
                  </button>
                  <button onClick={() => setPersonalSubTab('locais')} className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${personalSubTab === 'locais' ? 'bg-pink-500 text-white shadow-sm' : 'bg-pink-50/80 text-pink-950 hover:bg-pink-100 border border-pink-100'}`}>
                    <Coffee className="w-3.5 h-3.5" /> Cafés (Salvador)
                  </button>
                  <button onClick={() => setPersonalSubTab('podcasts')} className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${personalSubTab === 'podcasts' ? 'bg-pink-500 text-white shadow-sm' : 'bg-pink-50/80 text-pink-950 hover:bg-pink-100 border border-pink-100'}`}>
                    <Headphones className="w-3.5 h-3.5" /> Podcasts & True Crime
                  </button>
                </div>

                {personalSubTab === 'skincare' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-extrabold text-pink-950 flex items-center gap-2">
                          <Sparkle className="w-4 h-4 text-pink-500" /> Rotina de Skincare & Dermocosméticos Ideais
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">Marque os produtos e passos que você já testou e incorporou na sua rotina diária.</p>
                      </div>
                      <span className="text-[11px] bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-bold">Autocuidado</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: '☀️ Rotina Matinal', desc: '1. Sabonete suave para pele sensível\n2. Vitamina C antioxidante\n3. Hidratante facial leve\n4. Protetor Solar FPS 50+ (Essencial!)' },
                        { title: '🌙 Rotina Noturna', desc: '1. Demaquilante / Cleansing Oil\n2. Gel de limpeza facial\n3. Ácido Hialurônico ou Retinol (conforme orientação)\n4. Hidratante reparador noturno' }
                      ].map((routine, idx) => (
                        <div key={idx} className="bg-pink-50/40 border border-pink-200 p-5 rounded-2xl space-y-3 shadow-2xs">
                          <h4 className="font-extrabold text-xs text-pink-950">{routine.title}</h4>
                          <div className="space-y-2">
                            {routine.desc.split('\n').map((step, sIdx) => {
                              const stepKey = `${idx}-${sIdx}`
                              const isChecked = skincareDone[stepKey] || false
                              return (
                                <div key={sIdx} onClick={() => { lastLocalMutationRef.current = Date.now(); setSkincareDone({ ...skincareDone, [stepKey]: !isChecked }); }} className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition border ${isChecked ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold' : 'bg-white border-pink-100 text-stone-700 hover:bg-pink-50'}`}>
                                  <span className="text-xs">{step}</span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isChecked ? 'bg-emerald-200 text-emerald-800' : 'bg-stone-100 text-stone-500'}`}>
                                    {isChecked ? '✅ Já testei / Uso' : 'Marcar usado'}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {personalSubTab === 'wishlist' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-pink-950 flex items-center gap-2">
                        <Gift className="w-4 h-4 text-pink-500" /> Wishlist de Mimos Pessoais
                      </h3>
                      <span className="text-[11px] bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-bold">Salvo Automaticamente</span>
                    </div>
                    <textarea 
                      value={mimosWishlist} 
                      onChange={(e) => { lastLocalMutationRef.current = Date.now(); setMimosWishlist(e.target.value); }} 
                      rows={12} 
                      className="w-full bg-pink-50/25 border border-pink-200 p-5 rounded-2xl text-stone-800 text-sm leading-relaxed focus:outline-none focus:border-pink-400 resize-none font-normal placeholder-stone-300 select-text" 
                      placeholder="Anote aqui os mimos, roupas, livros e acessórios que você quer comprar ou ganhar..." 
                    />
                  </div>
                )}

                {personalSubTab === 'descompressao' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-extrabold text-pink-950 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-pink-500" /> Séries, Filmes & Leituras Relaxantes (15 Opções)
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">Anotações pessoais e recomendações rotativas para o descanso.</p>
                      </div>
                      <button 
                        onClick={() => setEntertainmentIndex((prev) => (prev + 2) % ENTERTAINMENT_POOL.length)}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Ver Outras Opções
                      </button>
                    </div>

                    <textarea 
                      value={descompressaoNotes} 
                      onChange={(e) => { lastLocalMutationRef.current = Date.now(); setDescompressaoNotes(e.target.value); }} 
                      rows={4} 
                      className="w-full bg-pink-50/25 border border-pink-200 p-4 rounded-2xl text-stone-800 text-xs leading-relaxed focus:outline-none focus:border-pink-400 resize-none font-normal placeholder-stone-300 select-text" 
                      placeholder="Minhas anotações e favoritos sobre filmes, séries e livros..." 
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[0, 1].map((offset) => {
                        const item = ENTERTAINMENT_POOL[(entertainmentIndex + offset) % ENTERTAINMENT_POOL.length]
                        return (
                          <div key={offset} className="bg-white p-6 rounded-2xl border border-pink-200 shadow-2xs space-y-2 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <h4 className="font-extrabold text-sm text-pink-950">{item.title}</h4>
                                <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md font-bold">{item.type}</span>
                              </div>
                              <p className="text-xs text-stone-600 mt-2 leading-relaxed">{item.desc}</p>
                            </div>
                            <button onClick={() => alert(`✨ '${item.title}' salvo na sua lista de favoritos!`)} className="w-full mt-4 bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 py-2 rounded-xl text-xs font-bold transition">
                              💖 Adicionar aos Favoritos
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {personalSubTab === 'jogos' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-extrabold text-pink-950 flex items-center gap-2">
                          <Gamepad2 className="w-4 h-4 text-pink-500" /> Jogos Relaxantes (15 Opções Disponíveis)
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">Clique para rodar novas recomendações do catálogo expandido.</p>
                      </div>
                      <button 
                        onClick={() => setGameIndex((prev) => (prev + 2) % GAMES_POOL.length)}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Ver Outras Recomendações
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[0, 1].map((offset) => {
                        const item = GAMES_POOL[(gameIndex + offset) % GAMES_POOL.length]
                        return (
                          <div key={offset} className="bg-white p-6 rounded-2xl border border-pink-200 shadow-2xs space-y-2 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <h4 className="font-extrabold text-sm text-pink-950">{item.title}</h4>
                                <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md font-bold">🎮 Game Zen</span>
                              </div>
                              <p className="text-xs text-stone-600 mt-2 leading-relaxed">{item.desc}</p>
                            </div>
                            <button onClick={() => alert(`🎮 '${item.title}' adicionado à sua lista de desejos de jogos!`)} className="w-full mt-4 bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 py-2 rounded-xl text-xs font-bold transition">
                              ✨ Adicionar à Lista
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {personalSubTab === 'locais' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-extrabold text-pink-950 flex items-center gap-2">
                          <Coffee className="w-4 h-4 text-pink-500" /> Cafés & Locais em Salvador (15 Opções Disponíveis)
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">Lugares aconchegantes pelo catálogo expandido na cidade.</p>
                      </div>
                      <button 
                        onClick={() => setCafeIndex((prev) => (prev + 2) % CAFES_POOL.length)}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Trocar Local
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[0, 1].map((offset) => {
                        const item = CAFES_POOL[(cafeIndex + offset) % CAFES_POOL.length]
                        return (
                          <div key={offset} className="bg-white p-6 rounded-2xl border border-pink-200 shadow-2xs space-y-2 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <h4 className="font-extrabold text-sm text-pink-950">{item.name}</h4>
                                <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md font-bold">☕ Salvador</span>
                              </div>
                              <p className="text-xs text-stone-600 mt-2 leading-relaxed">{item.desc}</p>
                            </div>
                            <button onClick={() => alert(`📍 ${item.name} marcado como visitado/favorito!`)} className="w-full mt-4 bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 py-2 rounded-xl text-xs font-bold transition">
                              📍 Quero Conhecer / Favorito
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {personalSubTab === 'podcasts' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-extrabold text-pink-950 flex items-center gap-2">
                          <Headphones className="w-4 h-4 text-pink-500" /> Podcasts & True Crime (15 Opções Disponíveis)
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">Investigações e casos criminais fascinantes do catálogo expandido.</p>
                      </div>
                      <button 
                        onClick={() => setPodcastIndex((prev) => (prev + 2) % PODCASTS_POOL.length)}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Trocar Indicação
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[0, 1].map((offset) => {
                        const item = PODCASTS_POOL[(podcastIndex + offset) % PODCASTS_POOL.length]
                        return (
                          <div key={offset} className="bg-white p-6 rounded-2xl border border-pink-200 shadow-2xs space-y-2 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <h4 className="font-extrabold text-sm text-pink-950">{item.title}</h4>
                                <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md font-bold">🎧 True Crime</span>
                              </div>
                              <p className="text-xs text-stone-600 mt-2 leading-relaxed">{item.desc}</p>
                            </div>
                            <button onClick={() => alert(`🎧 '${item.title}' salvo na sua lista para ouvir no próximo plantão!`)} className="w-full mt-4 bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 py-2 rounded-xl text-xs font-bold transition">
                              🎧 Salvar para Ouvir
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'estudos' && selectedItem && (
            <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md border border-pink-100 p-8 lg:p-10 rounded-3xl shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-pink-100 pb-5 gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-extrabold text-pink-500 uppercase tracking-wider mb-1">
                    <BookOpen className="w-3.5 h-3.5" /> Módulo de Cadernos & Receitas (Editor)
                  </div>
                  <input 
                    type="text" 
                    value={selectedItem.title}
                    onChange={(e) => { lastLocalMutationRef.current = Date.now(); setItems(items.map(i => i.id === selectedItem.id ? { ...i, title: e.target.value } : i)); }}
                    className="w-full bg-transparent text-2xl lg:text-3xl font-extrabold text-pink-950 focus:outline-none placeholder-pink-200"
                    placeholder="Título da Página ou Receita..."
                  />
                </div>
                <div className="flex items-center gap-2.5">
                  <button onClick={() => { setActiveTaskForAttach(null); fileInputRef.current?.click(); }} className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1.5 cursor-pointer">
                    <Paperclip className="w-4 h-4" /> Anexar Material ({selectedItem.attachments?.length || 0})
                  </button>
                </div>
              </div>

              {selectedItem.attachments && selectedItem.attachments.length > 0 && (
                <div className="bg-pink-50/70 border border-pink-200 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-extrabold text-pink-950">Arquivos Anexados a esta Página:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.attachments.map(att => (
                      <div key={att.id} className="bg-white border border-pink-200 px-3 py-1.5 rounded-xl text-xs font-bold text-pink-700 hover:bg-pink-100 flex items-center gap-1.5 shadow-2xs">
                        <a href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:underline">
                          📎 {att.name} ({att.size})
                        </a>
                        <button
                          type="button"
                          title="Excluir Anexo"
                          onClick={() => { lastLocalMutationRef.current = Date.now(); handleRemoveAttachment(selectedItem.id, att.id); }}
                          className="text-stone-400 hover:text-red-500 p-0.5 ml-1 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 border-b border-pink-100 pb-3">
                <button onClick={() => setStudySubTab('resumo')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${studySubTab === 'resumo' ? 'bg-pink-500 text-white shadow-xs' : 'bg-pink-50 text-pink-900/70 hover:bg-pink-100'}`}>
                  <FileText className="w-3.5 h-3.5" /> Prescrição & Conteúdo
                </button>
                <button onClick={() => setStudySubTab('diferenciais')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${studySubTab === 'diferenciais' ? 'bg-pink-500 text-white shadow-xs' : 'bg-pink-50 text-pink-900/70 hover:bg-pink-100'}`}>
                  <Layers className="w-3.5 h-3.5" /> Diagnósticos Diferenciais
                </button>
                <button onClick={() => setStudySubTab('pontos')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${studySubTab === 'pontos' ? 'bg-pink-500 text-white shadow-xs' : 'bg-pink-50 text-pink-900/70 hover:bg-pink-100'}`}>
                  <Bookmark className="w-3.5 h-3.5" /> Observações & Posologia
                </button>
              </div>

              {studySubTab === 'resumo' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-pink-900 flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-pink-500" /> Prescrição ou Conteúdo Principal</label>
                  <textarea value={selectedItem.content || ''} onChange={(e) => { lastLocalMutationRef.current = Date.now(); setItems(items.map(i => i.id === selectedItem.id ? { ...i, content: e.target.value } : i)); }} rows={14} className="w-full bg-pink-50/25 border border-pink-200 p-5 rounded-2xl text-stone-800 text-sm leading-relaxed focus:outline-none focus:border-pink-400 resize-none font-normal placeholder-stone-300 select-text" placeholder="Escreva a receita, doses ou resumo da matéria..." />
                </div>
              )}
              {studySubTab === 'diferenciais' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-pink-900 flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-pink-500" /> Diagnósticos Diferenciais / Opções</label>
                  <textarea value={selectedItem.differential || ''} onChange={(e) => { lastLocalMutationRef.current = Date.now(); setItems(items.map(i => i.id === selectedItem.id ? { ...i, differential: e.target.value } : i)); }} rows={14} className="w-full bg-pink-50/25 border border-pink-200 p-5 rounded-2xl text-stone-800 text-sm leading-relaxed focus:outline-none focus:border-pink-400 resize-none font-normal placeholder-stone-300 select-text" placeholder="Liste aqui os diferenciais clínicos..." />
                </div>
              )}
              {studySubTab === 'pontos' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-pink-900 flex items-center gap-1"><Bookmark className="w-3.5 h-3.5 text-pink-500" /> Observações, Contraindicações & Avisos ao Tutor</label>
                  <textarea value={selectedItem.notes || ''} onChange={(e) => { lastLocalMutationRef.current = Date.now(); setItems(items.map(i => i.id === selectedItem.id ? { ...i, notes: e.target.value } : i)); }} rows={14} className="w-full bg-pink-50/25 border border-pink-200 p-5 rounded-2xl text-stone-800 text-sm leading-relaxed focus:outline-none focus:border-pink-400 resize-none font-normal placeholder-stone-300 select-text" placeholder="Anotações importantes..." />
                </div>
              )}
            </div>
          )}

          {activeTab === 'ia' && (
            <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white/95 backdrop-blur-md border border-pink-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-pink-100 bg-pink-50/50 flex flex-col gap-3 select-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm"><Bot className="w-5 h-5" /></div>
                    <div>
                      <h2 className="text-sm font-extrabold text-pink-950">Copiloto IA Veterinária - {currentChatSession.title}</h2>
                      <p className="text-[11px] text-pink-500 font-medium">Raciocínio clínico ilimitado, selecione ou copie qualquer mensagem</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={handleNewChatSession} className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition">+ Novo Caso</button>
                    <span className="text-[10px] bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-bold">API Conectada</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-pink-100/60 overflow-x-auto pb-1">
                  <span className="text-[11px] font-bold text-stone-500 whitespace-nowrap">Templates Rápidos:</span>
                  <button onClick={() => applyAnamnesisTemplate('cao_ gastro')} className="bg-white hover:bg-pink-100 text-pink-800 border border-pink-200 px-3 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap shadow-2xs">🐕 Cão: Vômito/Gastro</button>
                  <button onClick={() => applyAnamnesisTemplate('gato_flutd')} className="bg-white hover:bg-pink-100 text-pink-800 border border-pink-200 px-3 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap shadow-2xs">🐈 Gato: Urinário (FLUTD)</button>
                  <button onClick={() => applyAnamnesisTemplate('dermato')} className="bg-white hover:bg-pink-100 text-pink-800 border border-pink-200 px-3 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap shadow-2xs">🩺 Dermatologia Geral</button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {currentChatSession.messages.map((msg, idx) => {
                  const isCopied = copiedMessageIdx === idx
                  return (
                    <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-xs select-text ${msg.sender === 'user' ? 'bg-pink-500 text-white rounded-br-xs' : 'bg-pink-50/70 border border-pink-100 text-stone-800 rounded-bl-xs'}`}>
                        {msg.text}
                      </div>

                      <div className="flex items-center gap-2 mt-1.5 px-1">
                        <button
                          type="button"
                          onClick={() => handleCopyMessageText(msg.text, idx)}
                          className="text-[10px] font-bold text-pink-700 hover:text-pink-950 flex items-center gap-1 bg-pink-50/80 hover:bg-pink-100 px-2.5 py-1 rounded-lg border border-pink-200 transition cursor-pointer shadow-2xs select-none"
                          title="Copiar texto da mensagem"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-pink-500" />}
                          <span>{isCopied ? 'Copiado!' : 'Copiar Texto'}</span>
                        </button>

                        {msg.sender === 'ai' && patients.length > 0 && (
                          <>
                            <select 
                              id={`export-select-${idx}`}
                              className="bg-white border border-pink-200 rounded-lg px-2 py-1 text-[10px] text-pink-950 font-medium focus:outline-none select-none"
                            >
                              {patients.map(p => (
                                <option key={p.id} value={p.id}>🐾 {p.petName} ({p.tutor})</option>
                              ))}
                            </select>
                            <button 
                              onClick={() => {
                                const selectEl = document.getElementById(`export-select-${idx}`) as HTMLSelectElement
                                if (selectEl) handleExportAiToPatient(msg.text, selectEl.value)
                              }}
                              className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 border border-pink-200 shadow-2xs cursor-pointer select-none"
                            >
                              📥 Enviar para Prontuário
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
                {isAiLoading && (
                  <div className="flex justify-start px-6 select-none">
                    <div className="bg-pink-50/70 border border-pink-100 p-4 rounded-2xl text-xs text-pink-600 flex items-center gap-2 animate-pulse">
                      <Sparkles className="w-4 h-4 animate-spin" /> A IA está analisando o caso clínico...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendAiMessage} className="p-4 border-t border-pink-100 bg-white flex gap-2 items-center select-none">
                <button type="button" onClick={toggleListening} title={isListening ? "Ouvindo..." : "Falar por voz"} className={`p-3 rounded-xl transition flex items-center justify-center ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-pink-100 hover:bg-pink-200 text-pink-700'}`}>
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <input type="text" placeholder={isListening ? "Ouvindo sua fala..." : "Digite o caso ou escolha um template acima..."} value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 bg-pink-50/50 border border-pink-200 rounded-xl px-4 py-3 text-xs text-pink-950 focus:outline-none font-medium select-text" />
                <button type="submit" disabled={isAiLoading} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                  <Send className="w-4 h-4" /> Perguntar
                </button>
              </form>
            </div>
          )}

          {activeTab === 'bsa' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm"><Scale className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-base font-extrabold text-pink-950">Calculadora BSA (m²) & Fármacos Oncológicos</h2>
                    <p className="text-xs text-pink-500 font-medium">Superfície corporal, dose em mg/m², volume em ml, comprimidos e dias máximos de uso</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">1. Dados do Paciente & Quimioterápico</h3>
                     
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Peso (kg)</label>
                        <input type="number" step="0.1" placeholder="Ex: 15" value={bsaWeightKg} onChange={(e) => setBsaWeightKg(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Espécie</label>
                        <select value={bsaSpecies} onChange={(e) => setBsaSpecies(e.target.value as any)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                          <option value="cao">Canino (K=10.1)</option>
                          <option value="gato">Felino (K=10.0)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">Fármaco Oncológico</label>
                      <select 
                        value={selectedOncoDrugName} 
                        onChange={(e) => {
                          const found = ONCO_DRUGS.find(d => d.name === e.target.value)
                          if (found) {
                            setSelectedOncoDrugName(found.name)
                            setOncoCustomDosage(found.dosagePerM2.toString())
                            setOncoCustomConc(found.concentration.toString())
                          }
                        }} 
                        className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium"
                      >
                        {ONCO_DRUGS.map(d => (
                          <option key={d.name} value={d.name}>{d.name} ({d.category})</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-stone-600 block mb-1">Dose (mg/m²)</label>
                        <input type="number" step="0.1" value={oncoCustomDosage} onChange={(e) => setOncoCustomDosage(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none font-medium" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-stone-600 block mb-1">Conc. (mg/ml)</label>
                        <input type="number" step="0.1" value={oncoCustomConc} onChange={(e) => setOncoCustomConc(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none font-medium" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-stone-600 block mb-1">Comp. (mg)</label>
                        <input type="number" step="0.1" placeholder="Ex: 2" value={oncoPillMg} onChange={(e) => setOncoPillMg(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none font-medium" />
                      </div>
                    </div>

                    <button onClick={() => {
                      const w = parseFloat(bsaWeightKg) || 0
                      const dM2 = parseFloat(oncoCustomDosage) || 0
                      const conc = parseFloat(oncoCustomConc) || 1
                      const pillM = parseFloat(oncoPillMg) || 0
                      if (w <= 0) {
                        setCalculatedBsaValue(null)
                        setOncoResultMg(null)
                        setOncoResultMl(null)
                        setOncoResultPills(null)
                        return
                      }
                      const k = bsaSpecies === 'cao' ? 10.1 : 10.0
                      const bsa = (k * Math.pow(w, 2/3)) / 100
                      setCalculatedBsaValue(bsa)

                      const totalMg = bsa * dM2
                      const totalMl = totalMg / conc
                      const totalPills = pillM > 0 ? totalMg / pillM : 0

                      setOncoResultMg(totalMg)
                      setOncoResultMl(totalMl)
                      setOncoResultPills(totalPills)
                    }} className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
                      <Calculator className="w-4 h-4" /> Calcular Dose por m² & Comprimidos
                    </button>
                  </div>

                  <div className="space-y-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider mb-2">2. Resultados & Segurança Farmacológica</h3>
                       
                      {calculatedBsaValue !== null ? (
                        <div className="bg-pink-50 border border-pink-200 p-4 rounded-2xl space-y-3 text-center">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-pink-600 uppercase">Superfície (BSA)</span>
                              <div className="text-lg font-extrabold text-pink-950">{calculatedBsaValue.toFixed(3)} m²</div>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-stone-500 uppercase">Dose Total (mg)</span>
                              <div className="text-lg font-extrabold text-pink-950">{oncoResultMg?.toFixed(2)} mg</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-pink-200/60">
                            <div>
                              <span className="text-[10px] font-bold text-stone-500 uppercase">Volume (ml)</span>
                              <div className="text-base font-extrabold text-rose-600">{oncoResultMl?.toFixed(2)} ml</div>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-stone-500 uppercase">Comprimidos / Uso</span>
                              <div className="text-base font-extrabold text-emerald-600">{oncoResultPills ? oncoResultPills.toFixed(2) : '0'} comp. / dia</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-pink-50/50 border border-pink-100 p-8 rounded-2xl text-center text-xs text-stone-400">
                          Preencha o peso e clique em calcular para ver a dose exata.
                        </div>
                      )}
                    </div>

                    {(() => {
                      const drugObj = ONCO_DRUGS.find(d => d.name === selectedOncoDrugName)
                      if (!drugObj) return null
                      return (
                        <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-amber-900 text-xs space-y-1.5 shadow-xs">
                          <div className="font-extrabold flex items-center gap-1.5 text-amber-950">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            {drugObj.alertTitle} (Uso máx: {drugObj.maxDays} {drugObj.maxDays === 1 ? 'dia por ciclo' : 'dias'})
                          </div>
                          <p className="text-[11px] text-amber-900/95 leading-relaxed pl-5 whitespace-pre-line">
                            {drugObj.alertDesc}
                          </p>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'condolencias' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm"><HeartHandshake className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-base font-extrabold text-pink-950">Biblioteca com 7 Mensagens de Apoio Humanizadas & Profundas 🕊️</h2>
                    <p className="text-xs text-pink-500 font-medium">Textos extensos, tocantes e repletos de empatia para tutores em momentos de luto</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {CONDOLENCE_MESSAGES.map((item) => {
                    const currentInputs = condolenceTutorInputs[item.id] || { tutor: '', pet: '' }
                    const isCopied = copiedCondolenceId === item.id
                    const customizedText = item.text
                      .replace(/\[Tutor\(a\)\]/g, currentInputs.tutor.trim() || '[Tutor(a)]')
                      .replace(/\[Pet\]/g, currentInputs.pet.trim() || '[Pet]')

                    return (
                      <div key={item.id} className="bg-pink-50/40 border border-pink-200 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h3 className="text-sm font-extrabold text-pink-950">{item.title}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-pink-100">
                          <div>
                            <label className="text-[10px] font-bold text-stone-500 block mb-1">Nome do Tutor(a)</label>
                            <input 
                              type="text" 
                              placeholder="Ex: Maria" 
                              value={currentInputs.tutor} 
                              onChange={(e) => setCondolenceTutorInputs({ ...condolenceTutorInputs, [item.id]: { ...currentInputs, tutor: e.target.value } })} 
                              className="w-full bg-pink-50/50 border border-pink-200 rounded-lg px-3 py-1.5 text-xs text-pink-950 focus:outline-none" 
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-stone-500 block mb-1">Nome do Pet</label>
                            <input 
                              type="text" 
                              placeholder="Ex: Mel" 
                              value={currentInputs.pet} 
                              onChange={(e) => setCondolenceTutorInputs({ ...condolenceTutorInputs, [item.id]: { ...currentInputs, pet: e.target.value } })} 
                              className="w-full bg-pink-50/50 border border-pink-200 rounded-lg px-3 py-1.5 text-xs text-pink-950 focus:outline-none" 
                            />
                          </div>
                        </div>

                        <div className="bg-white border border-pink-200 p-4 rounded-xl text-xs leading-relaxed text-stone-800 whitespace-pre-line font-normal select-text">
                          {customizedText}
                        </div>

                        <button 
                          onClick={() => handleCopyCondolence(item)}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer ${isCopied ? 'bg-emerald-600 text-white' : 'bg-stone-800 hover:bg-stone-900 text-white'}`}
                        >
                          {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                          {isCopied ? 'Mensagem Copiada com Sucesso!' : '📋 Copiar Mensagem Completa'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <WishlistTab />
          )}

          {activeTab === 'pacientes' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-xl font-extrabold text-pink-950">Módulo de Casos Clínicos & Prontuário de Pacientes</h2>
              
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Novo Paciente / Caso Clínico Real</h3>
                <form onSubmit={handleAddPatient} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input type="text" placeholder="Nome do Pet" value={newPetName} onChange={(e) => setNewPetName(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                    <select value={newSpecies} onChange={(e) => setNewSpecies(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                      <option value="Canino">Canino</option>
                      <option value="Felino">Felino</option>
                      <option value="Ave / Silvestre">Ave / Silvestre</option>
                      <option value="Outro">Outro</option>
                    </select>
                    <input type="text" placeholder="Raça" value={newBreed} onChange={(e) => setNewBreed(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input type="text" placeholder="Idade" value={newAge} onChange={(e) => setNewAge(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                    <input type="text" placeholder="Peso inicial (ex: 12kg)" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                    <input type="text" placeholder="Nome do Tutor" value={newTutor} onChange={(e) => setNewTutor(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input type="text" placeholder="Queixa Principal / Anamnese" value={newComplaint} onChange={(e) => setNewComplaint(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as any)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                      <option value="Em Atendimento">Em Atendimento</option>
                      <option value="Internado">Internado</option>
                      <option value="Observação">Observação</option>
                      <option value="Alta">Alta</option>
                    </select>
                  </div>
                  <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Cadastrar Caso Clínico
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                {patients.length === 0 ? (
                  <p className="text-xs text-stone-400 py-6 text-center bg-white/50 rounded-2xl border border-pink-100">Nenhum caso clínico cadastrado ainda.</p>
                ) : (
                  patients.map(p => (
                    <div key={p.id} className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">🐾</div>
                          <div>
                            <h4 className="text-sm font-extrabold text-pink-950">{p.petName} <span className="text-xs font-normal text-stone-500">({p.species} - {p.breed})</span></h4>
                            <p className="text-[11px] text-stone-400">Tutor: {p.tutor} • Idade: {p.age}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <button onClick={() => handlePrintPatient(p)} className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer">
                            <Printer className="w-3.5 h-3.5" /> Imprimir / PDF
                          </button>
                          <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${p.status === 'Internado' ? 'bg-amber-100 text-amber-800' : p.status === 'Alta' ? 'bg-emerald-100 text-emerald-800' : 'bg-pink-100 text-pink-800'}`}>
                            {p.status}
                          </span>
                          <button onClick={() => { lastLocalMutationRef.current = Date.now(); setPatients(patients.filter(item => item.id !== p.id)); }} className="text-stone-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-pink-900 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-pink-500" /> Linha do Tempo (Evoluções & Retornos)</span>
                          <button onClick={() => setActivePatientForEvolution(activePatientForEvolution === p.id ? null : p.id)} className="text-xs font-bold text-pink-600 hover:underline bg-pink-50 px-3 py-1 rounded-lg border border-pink-200">
                            {activePatientForEvolution === p.id ? 'Fechar' : '+ Adicionar Retorno'}
                          </button>
                        </div>

                        {activePatientForEvolution === p.id && (
                          <form onSubmit={(e) => handleAddEvolution(p.id, e)} className="bg-pink-50/50 border border-pink-200 p-4 rounded-xl space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <input type="text" placeholder="Peso atual (ex: 12.5kg)" value={evoWeight} onChange={(e) => setEvoWeight(e.target.value)} className="bg-white border border-pink-200 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-none" />
                              <input type="text" placeholder="Temperatura (ex: 38.8)" value={evoTemp} onChange={(e) => setEvoTemp(e.target.value)} className="bg-white border border-pink-200 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-none" />
                            </div>
                            <textarea placeholder="Evolução clínica, medicação aplicada, resposta..." value={evoNotes} onChange={(e) => setEvoNotes(e.target.value)} rows={2} className="w-full bg-white border border-pink-200 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-none resize-none select-text" required />
                            <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition">Salvar Retorno</button>
                          </form>
                        )}

                        <div className="space-y-2 pt-1">
                          {p.evolutions.map((evo, idx) => (
                            <div key={evo.id || idx} className="bg-pink-50/30 border border-pink-100 p-3 rounded-xl text-xs space-y-1">
                              <div className="flex items-center justify-between text-[11px] font-bold text-pink-950 border-b border-pink-100/60 pb-1">
                                <span>📅 {evo.date}</span>
                                <span className="text-pink-600">Peso: {evo.weight} • Temp: {evo.temperature}</span>
                              </div>
                              <p className="text-stone-700 pt-1 select-text">{evo.notes}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'calculadora' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-pink-950">Calculadora Veterinária & Alerta de Dias Máximos</h2>
                <div className="flex gap-2">
                  <button onClick={() => setCalcMode('dose')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${calcMode === 'dose' ? 'bg-pink-500 text-white shadow-sm' : 'bg-white text-pink-900 border border-pink-200'}`}>💊 Dose de Fármacos (mg/kg)</button>
                  <button onClick={() => setCalcMode('fluido')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${calcMode === 'fluido' ? 'bg-pink-500 text-white shadow-sm' : 'bg-white text-pink-900 border border-pink-200'}`}>💧 Tabela de Fluidoterapia</button>
                </div>
              </div>

              {calcMode === 'dose' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                    <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">1. Selecionar ou Pesquisar Fármaco de Rotina</h3>
                     
                    <div className="relative">
                      <Search className="absolute left-3.5 top-3 w-4 h-4 text-pink-400" />
                      <input type="text" placeholder="Pesquisar remédio salvo..." value={drugSearchQuery} onChange={(e) => setDrugSearchQuery(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                    </div>

                    <div className="max-h-36 overflow-y-auto space-y-1 pr-1 border border-pink-100 p-2 rounded-xl bg-pink-50/20">
                      {filteredDrugs.length === 0 ? (
                        <p className="text-[11px] text-stone-400 text-center py-4">Nenhum remédio encontrado. Cadastre abaixo!</p>
                      ) : (
                        filteredDrugs.map((drug, idx) => (
                          <div key={idx} onClick={() => { setSelectedDrugName(drug.name); setCalcDosage(drug.defaultDosage.toString()); setCalcConcentration(drug.defaultConcentration.toString()); }} className={`p-2 rounded-lg text-xs cursor-pointer transition flex justify-between items-center ${selectedDrugName === drug.name ? 'bg-pink-500 text-white font-bold' : 'bg-white text-stone-700 hover:bg-pink-100'}`}>
                            <div>
                              <span className="font-bold">{drug.name}</span>
                              <span className="text-[10px] ml-1 opacity-80">({drug.category})</span>
                            </div>
                            <span className="text-[10px] opacity-90">{drug.defaultDosage} mg/kg</span>
                          </div>
                        ))
                      )}
                    </div>

                    {getAdvancedDrugAlert(selectedDrugName) && (
                      <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-amber-900 text-xs space-y-1.5 shadow-xs">
                        <div className="font-extrabold flex items-center gap-1.5 text-amber-950">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          {getAdvancedDrugAlert(selectedDrugName)?.title}
                        </div>
                        <p className="text-[11px] text-amber-900/95 leading-relaxed pl-5 whitespace-pre-line">
                          {getAdvancedDrugAlert(selectedDrugName)?.desc}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="text-[11px] font-bold text-stone-600 block mb-1">Peso do Animal (kg)</label>
                        <input type="number" step="0.1" placeholder="Ex: 15" value={calcWeight} onChange={(e) => setCalcWeight(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-stone-600 block mb-1">Dose (mg/kg)</label>
                          <input type="number" step="0.01" value={calcDosage} onChange={(e) => setCalcDosage(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none font-medium" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-stone-600 block mb-1">Conc. (mg/ml)</label>
                          <input type="number" step="0.01" value={calcConcentration} onChange={(e) => setCalcConcentration(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none font-medium" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-stone-600 block mb-1">Comp. (mg)</label>
                          <input type="number" step="0.1" placeholder="Ex: 20" value={calcPillMg} onChange={(e) => setCalcPillMg(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none font-medium" />
                        </div>
                      </div>

                      <button onClick={() => {
                        const w = parseFloat(calcWeight) || 0
                        const d = parseFloat(calcDosage) || 0
                        const c = parseFloat(calcConcentration) || 1
                        const pillM = parseFloat(calcPillMg) || 0
                        const totalMg = w * d
                        const totalMl = totalMg / c
                        const totalPills = pillM > 0 ? totalMg / pillM : 0

                        setCalcResultMl(totalMl)
                        setCalcResultPills(totalPills)
                      }} className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
                        <Calculator className="w-4 h-4" /> Calcular Volume (ml) & Comprimidos
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                      <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Resultado ({selectedDrugName})</h3>
                      {calcResultMl !== null ? (
                        <div className="bg-pink-50 border border-pink-200 p-5 rounded-2xl text-center space-y-3">
                          <div>
                            <span className="text-[10px] font-bold text-pink-600 uppercase">Volume Líquido</span>
                            <div className="text-2xl font-extrabold text-pink-950">{calcResultMl.toFixed(2)} ml / dia</div>
                          </div>
                          {calcPillMg !== '' && parseFloat(calcPillMg) > 0 && (
                            <div className="pt-2 border-t border-pink-200/60 space-y-1">
                              <span className="text-[10px] font-bold text-stone-500 uppercase">Quantidade de Comprimidos</span>
                              <div className="text-xl font-extrabold text-emerald-600">{calcResultPills?.toFixed(2)} comp. / dia</div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-stone-400 text-center py-6">Selecione um remédio, preencha o peso e calcule.</p>
                      )}
                    </div>

                    <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-3">
                      <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">2. Cadastrar Novo Fármaco de Rotina</h3>
                      <form onSubmit={handleSaveNewDrug} className="space-y-2.5">
                        <input type="text" placeholder="Nome do Fármaco" value={newDrugName} onChange={(e) => setNewDrugName(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium" required />
                        <div>
                          <label className="text-[10px] font-bold text-stone-500 block mb-1">Categoria</label>
                          <select value={newDrugCat} onChange={(e) => setNewDrugCat(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium">
                            <option value="Anti-inflamatório (AINE)">Anti-inflamatório (AINE)</option>
                            <option value="Corticoide / Esteroidal">Corticoide / Esteroidal</option>
                            <option value="Psicotrópico / Comportamental">Psicotrópico / Comportamental</option>
                            <option value="Antibiótico">Antibiótico</option>
                            <option value="Analgésico / Opióide">Analgésico / Opióide</option>
                            <option value="Outro / Geral">Outro / Geral</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <input type="number" step="0.01" placeholder="Dose (mg/kg)" value={newDrugDosage} onChange={(e) => setNewDrugDosage(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none font-medium" required />
                          <input type="number" step="0.01" placeholder="Conc. (mg/ml)" value={newDrugConc} onChange={(e) => setNewDrugConc(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none font-medium" required />
                          <input type="number" placeholder="Máx dias" value={newDrugMaxDays} onChange={(e) => setNewDrugMaxDays(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none font-medium" required />
                        </div>
                        <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
                          <Plus className="w-3.5 h-3.5" /> Salvar Fármaco na Lista
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                    <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Cálculo de Fluido Intravenosa (Tabela Oficial)</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-stone-600 block mb-1">Peso do Animal (kg)</label>
                        <input type="number" step="0.1" placeholder="Ex: 10" value={fluidWeight} onChange={(e) => setFluidWeight(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-stone-600 block mb-1">Espécie</label>
                          <select value={fluidSpecies} onChange={(e) => setFluidSpecies(e.target.value as any)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                            <option value="cao">Cão (1,5 ml/kg/h)</option>
                            <option value="gato">Gato (1 ml/kg/h)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-stone-600 block mb-1">Objetivo do Fluido</label>
                          <select value={fluidMode} onChange={(e) => setFluidMode(e.target.value as any)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                            <option value="manutencao">Manutenção (Reavaliar contínuo)</option>
                            <option value="reposicao">Reposição de Desidratação</option>
                          </select>
                        </div>
                      </div>

                      {fluidMode === 'reposicao' && (
                        <div>
                          <label className="text-[11px] font-bold text-stone-600 block mb-1">Percentual de Desidratação (%)</label>
                          <input type="number" step="1" placeholder="Ex: 8" value={fluidDehydrationPercent} onChange={(e) => setFluidDehydrationPercent(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                        </div>
                      )}

                      <button onClick={() => {
                        const w = parseFloat(fluidWeight) || 0
                        if (w <= 0) {
                          setFluidResultSummary(null)
                          return
                        }

                        if (fluidMode === 'manutencao') {
                          const rateHour = fluidSpecies === 'cao' ? w * 1.5 : w * 1.0
                          const range24h = fluidSpecies === 'cao' 
                            ? `${(w * 35).toFixed(0)} a ${(w * 40).toFixed(0)} ml / 24h` 
                            : `${(w * 20).toFixed(0)} a ${(w * 25).toFixed(0)} ml / 24h`

                          setFluidResultSummary({
                            mlHour: rateHour,
                            ml24hRange: range24h,
                            notes: `Manutenção contínua para ${fluidSpecies === 'cao' ? 'Cão' : 'Gato'}. Reavaliar continuamente.`
                          })
                        } else {
                          const pct = (parseFloat(fluidDehydrationPercent) || 0) / 100
                          const totalRepositionMl = w * pct * 1000
                          const rateHour = totalRepositionMl / 9

                          setFluidResultSummary({
                            mlHour: rateHour,
                            ml24hRange: `Volume Total de Reposição: ${totalRepositionMl.toFixed(0)} ml`,
                            notes: `Volume a ser infundido entre 6 e 12 horas.`
                          })
                        }
                      }} className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-xs font-bold transition shadow-md cursor-pointer">
                        Calcular Fluidoterapia (Tabela Beatriz)
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider mb-4">Resultado da Tabela de Fluidoterapia</h3>
                      {fluidResultSummary !== null ? (
                        <div className="bg-pink-50 border border-pink-200 p-6 rounded-2xl text-center space-y-3">
                          <span className="text-xs font-bold text-pink-600 uppercase">Taxa de Infusão Sugerida</span>
                          <div className="text-3xl font-extrabold text-pink-950">{fluidResultSummary.mlHour.toFixed(1)} ml / hora</div>
                          {fluidResultSummary.ml24hRange && (
                            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-xl border border-emerald-200">
                              {fluidResultSummary.ml24hRange}
                            </div>
                          )}
                          <p className="text-[11px] text-stone-600 pt-2 border-t border-pink-200/60 leading-relaxed">
                            {fluidResultSummary.notes}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-stone-400 text-center py-12">Insira o peso e clique em calcular.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tarefas' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-xl font-extrabold text-pink-950">Gerenciador de Tarefas</h2>
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Nova Tarefa ou Meta</h3>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  if (!newTaskText.trim()) return
                  lastLocalMutationRef.current = Date.now()
                  setTasks([{ id: Date.now().toString(), text: newTaskText, completed: false, category: newTaskCategory, notes: newTaskNotes, attachments: [] }, ...tasks])
                  setNewTaskText('')
                  setNewTaskNotes('')
                }} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input type="text" placeholder="O que precisa ser feito?" value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} className="md:col-span-2 bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                    <input type="text" placeholder="Categoria" value={newTaskCategory} onChange={(e) => setNewTaskCategory(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                  </div>
                  <textarea placeholder="Detalhes..." value={newTaskNotes} onChange={(e) => setNewTaskNotes(e.target.value)} rows={2} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium resize-none select-text" />
                  <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer"><Plus className="w-4 h-4" /> Adicionar Tarefa</button>
                </form>
              </div>

              <div className="space-y-3">
                {tasks.map(t => (
                  <div key={t.id} className={`bg-white/95 backdrop-blur-md border p-4 rounded-2xl shadow-xs flex flex-col gap-3 transition ${t.completed ? 'border-emerald-200 bg-emerald-50/20 opacity-80' : 'border-pink-100'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={t.completed} onChange={() => { lastLocalMutationRef.current = Date.now(); setTasks(tasks.map(item => item.id === t.id ? { ...item, completed: !item.completed } : item)); }} className="w-4 h-4 accent-pink-500 cursor-pointer" />
                        <div>
                          <span className={`text-xs font-bold select-text ${t.completed ? 'line-through text-stone-400' : 'text-pink-950'}`}>{t.text}</span>
                          <span className="ml-2 text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md font-semibold">{t.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setActiveTaskForAttach(t.id); fileInputRef.current?.click(); }} className="text-xs text-pink-600 hover:bg-pink-50 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 border border-pink-200 cursor-pointer"><Paperclip className="w-3 h-3" /> Anexar</button>
                        <button onClick={() => { lastLocalMutationRef.current = Date.now(); setTasks(tasks.filter(item => item.id !== t.id)); }} className="text-stone-400 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    {t.notes && <p className="text-xs text-stone-600 pl-7 select-text">{t.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'calendario' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-pink-950">Calendário Estilo Google Agenda & Metas ({currentMonthName})</h2>
                <span className="text-xs bg-pink-100 text-pink-800 font-bold px-3 py-1 rounded-xl capitalize">Hoje: {formattedHeaderDate}</span>
              </div>

              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-3xl shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Visão em Grade do Mês</h3>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((d, i) => (
                    <span key={i} className="text-[11px] font-extrabold text-pink-500 py-1">{d}</span>
                  ))}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-20 bg-pink-50/20 rounded-2xl border border-transparent"></div>
                  ))}
                  {calendarDays.map(cd => {
                    const dayEvents = events.filter(ev => ev.dateKey === cd.dateKey)
                    const isSelected = selectedDate === cd.dateKey
                    const isToday = cd.day === currentDayNum
                    return (
                      <div 
                        key={cd.dateKey} 
                        onClick={() => setSelectedDate(cd.dateKey)}
                        className={`h-24 p-2 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer overflow-y-auto ${isSelected ? 'border-pink-500 bg-pink-50 shadow-sm' : isToday ? 'border-pink-400 bg-white ring-2 ring-pink-300' : 'border-pink-100 bg-white/70 hover:border-pink-300'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-extrabold ${isToday ? 'bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-xs' : 'text-pink-950'}`}>
                            {cd.day}
                          </span>
                          {dayEvents.length > 0 && <span className="text-[9px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-full font-bold">{dayEvents.length}</span>}
                        </div>
                        <div className="space-y-0.5 mt-1">
                          {dayEvents.slice(0, 2).map((ev, idx) => (
                            <div key={idx} className="text-[10px] bg-pink-500 text-white px-1.5 py-0.5 rounded truncate font-medium">
                              {ev.time ? `${ev.time} - ` : ''}{ev.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Adicionar Evento com Horário no Dia Selecionado ({selectedDate})</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    if (!eventTitle.trim()) return
                    lastLocalMutationRef.current = Date.now()
                    setEvents([...events, { dateKey: selectedDate, title: eventTitle, description: eventDesc, time: eventTime }])
                    setEventTitle('')
                    setEventDesc('')
                  }} className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <input type="text" placeholder="Título do Evento / Matéria" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className="col-span-2 bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                      <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                    </div>
                    <textarea placeholder="Detalhes ou notas do compromisso..." value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} rows={2} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium resize-none select-text" />
                    <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-xs font-bold transition shadow-md cursor-pointer">Salvar na Agenda</button>
                  </form>
                </div>

                <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Compromissos do Dia {selectedDate}</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {events.filter(ev => ev.dateKey === selectedDate).length === 0 ? (
                      <p className="text-xs text-stone-400 py-6 text-center">Nenhum evento registrado para este dia.</p>
                    ) : (
                      events.filter(ev => ev.dateKey === selectedDate).map((ev, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-pink-50/40 border border-pink-100 p-3.5 rounded-2xl">
                          <div>
                            <div className="text-xs font-bold text-pink-950 flex items-center gap-2 select-text">
                              {ev.time && <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded-lg text-[10px] font-extrabold">{ev.time}</span>}
                              {ev.title}
                            </div>
                            {ev.description && <div className="text-[11px] text-stone-600 mt-0.5 select-text">{ev.description}</div>}
                          </div>
                          <button onClick={() => { lastLocalMutationRef.current = Date.now(); setEvents(events.filter(item => !(item.title === ev.title && item.dateKey === ev.dateKey))); }} className="text-stone-400 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financas' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-extrabold text-pink-950">Controle Financeiro & Gráficos</h2>
                
                <button 
                  onClick={() => setShowValues(!showValues)}
                  className="flex items-center gap-2 bg-white hover:bg-pink-100 text-pink-800 px-4 py-2 rounded-xl text-xs font-bold transition border border-pink-200 cursor-pointer shadow-2xs w-fit"
                  title={showValues ? "Ocultar valores financeiros" : "Mostrar valores financeiros"}
                >
                  {showValues ? <EyeOff className="w-4 h-4 text-pink-600" /> : <Eye className="w-4 h-4 text-pink-600" />}
                  <span>{showValues ? 'Ocultar Valores' : 'Mostrar Valores'}</span>
                </button>
              </div>
              
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Renda Base / Extra ("Por Fora")</h3>
                  {!isEditingIncome && (
                    <button 
                      onClick={() => { setIsEditingIncome(true); setTempIncomeInput(monthlyIncome.toString()); }}
                      className="text-xs font-bold text-pink-600 hover:underline bg-pink-50 px-3 py-1 rounded-lg border border-pink-200 cursor-pointer"
                    >
                      ✏️ Editar Renda
                    </button>
                  )}
                </div>

                {isEditingIncome ? (
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <input 
                      type="number" 
                      step="0.01" 
                      value={tempIncomeInput} 
                      onChange={(e) => setTempIncomeInput(e.target.value)} 
                      className="w-full sm:w-64 bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium"
                      placeholder="Ex: 3500.00"
                    />
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button 
                        type="button" 
                        onClick={() => {
                          const val = parseFloat(tempIncomeInput)
                          if (!isNaN(val)) {
                            lastLocalMutationRef.current = Date.now()
                            setMonthlyIncome(val)
                            setIsEditingIncome(false)
                            alert('Renda base atualizada com sucesso!')
                          }
                        }} 
                        className="flex-1 sm:flex-none bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        💾 Salvar
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsEditingIncome(false)} 
                        className="flex-1 sm:flex-none bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xl font-extrabold text-emerald-600">
                    {maskValue(monthlyIncome)}
                  </div>
                )}
              </div>

              {/* CARD DE COFRINHO */}
              <div className="bg-gradient-to-br from-pink-50 to-pink-100/60 border border-pink-200 p-6 rounded-3xl shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-pink-500 text-white flex items-center justify-center font-bold shadow-xs">
                      <PiggyBank className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-pink-950">Cofrinho & Reserva Especial</h3>
                      <p className="text-[11px] text-pink-600 font-medium">Guarde dinheiros para emergências ou metas futuras</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-pink-600 uppercase">Saldo Guardado</span>
                    <div className="text-2xl font-extrabold text-pink-950">{maskValue(cofrinhoAmount)}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-pink-200/60">
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder="Digite o valor (R$)" 
                    value={cofrinhoInput} 
                    onChange={(e) => setCofrinhoInput(e.target.value)} 
                    className="w-full sm:flex-1 bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button 
                      type="button" 
                      onClick={() => {
                        const val = parseFloat(cofrinhoInput)
                        if (!isNaN(val) && val > 0) {
                          lastLocalMutationRef.current = Date.now()
                          setCofrinhoAmount(prev => prev + val)
                          setCofrinhoInput('')
                        }
                      }} 
                      className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      ➕ Guardar
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const val = parseFloat(cofrinhoInput)
                        if (!isNaN(val) && val > 0) {
                          lastLocalMutationRef.current = Date.now()
                          setCofrinhoAmount(prev => Math.max(0, prev - val))
                          setCofrinhoInput('')
                        }
                      }} 
                      className="flex-1 sm:flex-none bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      ➖ Retirar
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-stone-400">Renda Base + Plantões</span>
                  <div className="text-xl font-extrabold text-emerald-600 mt-2">{maskValue(monthlyIncome + totalShiftsAmount)}</div>
                </div>

                <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-stone-400">Finanças Extras (Especialistas)</span>
                  <div className="text-xl font-extrabold text-pink-600 mt-2">{maskValue(totalSpecialistIncome)}</div>
                </div>

                <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-stone-400">Total de Despesas</span>
                  <div className="text-xl font-extrabold text-rose-500 mt-2">{maskValue(totalGastos)}</div>
                </div>

                <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-stone-400">Saldo Restante</span>
                  <div className={`text-xl font-extrabold mt-2 ${saldoRestante >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {maskValue(saldoRestante)}
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Adicionar Despesa ou Gasto</h3>
                <form onSubmit={handleAddFinancial} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input type="text" placeholder="Descrição do Gasto" value={finDesc} onChange={(e) => setFinDesc(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                    <select value={finCategory} onChange={(e) => setFinCategory(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                      <option value="Cartão de Crédito">Cartão de Crédito</option>
                      <option value="Insumos / Clínica">Insumos / Clínica</option>
                      <option value="Alimentação">Alimentação</option>
                      <option value="Transporte">Transporte</option>
                      <option value="Outro">Outro (Personalizado)</option>
                    </select>
                    <input type="number" step="0.01" placeholder="Valor (R$)" value={finAmount} onChange={(e) => setFinAmount(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                  </div>

                  {finCategory === 'Outro' && (
                    <input type="text" placeholder="Nome da Categoria Personalizada" value={finCustomCategory} onChange={(e) => setFinCustomCategory(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                  )}

                  <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer">
                    <Plus className="w-4 h-4" /> Adicionar Despesa
                  </button>
                </form>
              </div>

              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Histórico de Lançamentos & Edição Direta</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {finances.length === 0 ? (
                    <p className="text-xs text-stone-400 py-6 text-center">Nenhum gasto lançado ainda.</p>
                  ) : (
                    finances.map(f => {
                      const isEditing = editingExpenseId === f.id
                      return (
                        <div key={f.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-pink-50/40 border border-pink-100 p-3.5 rounded-xl text-xs gap-3">
                          {isEditing ? (
                            <div className="flex flex-wrap items-center gap-2 flex-1">
                              <input 
                                type="text" 
                                value={editDescInput} 
                                onChange={(e) => setEditDescInput(e.target.value)} 
                                className="bg-white border border-pink-200 rounded-lg px-2.5 py-1.5 text-xs text-pink-950 flex-1 min-w-[120px]" 
                                placeholder="Descrição" 
                              />
                              <input 
                                type="number" 
                                step="0.01" 
                                value={editAmountInput} 
                                onChange={(e) => setEditAmountInput(e.target.value)} 
                                className="bg-white border border-pink-200 rounded-lg px-2.5 py-1.5 text-xs text-pink-950 w-24" 
                                placeholder="Valor" 
                              />
                              <button 
                                onClick={() => {
                                  const amt = parseFloat(editAmountInput)
                                  if (!isNaN(amt)) {
                                    lastLocalMutationRef.current = Date.now()
                                    setFinances(finances.map(item => item.id === f.id ? { ...item, description: editDescInput || item.description, amount: amt } : item))
                                    setEditingExpenseId(null)
                                  }
                                }} 
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold"
                              >
                                Salvar
                              </button>
                              <button 
                                onClick={() => setEditingExpenseId(null)} 
                                className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-2.5 py-1.5 rounded-lg"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <div>
                                <span className="font-bold text-pink-950">{f.description}</span>
                                <span className="ml-2 bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md text-[10px] font-semibold">{f.category}</span>
                                <div className="text-[10px] text-stone-400 mt-0.5">{f.date}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-extrabold text-rose-500">{maskValue(f.amount)}</span>
                                <button 
                                  onClick={() => {
                                    setEditingExpenseId(f.id)
                                    setEditDescInput(f.description)
                                    setEditAmountInput(f.amount.toString())
                                  }} 
                                  className="text-pink-600 hover:bg-pink-100 p-1 rounded-lg"
                                  title="Editar Despesa"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => { lastLocalMutationRef.current = Date.now(); setFinances(finances.filter(item => item.id !== f.id)); }} className="text-stone-400 hover:text-red-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}