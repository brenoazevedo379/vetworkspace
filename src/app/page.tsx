'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
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
  Circle,
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
  GripVertical,
  FlaskConical,
  Activity,
  ShieldAlert,
  Syringe,
  ClipboardList,
  Utensils,
  Weight
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
  type: 'image' | 'pdf' | 'excel' | 'docx' | 'doc'
  size: string
  url: string
}

interface DocumentSection {
  id: string
  title: string
  content: string
  order: number
}

interface DocumentItem {
  id: string
  title: string
  parentId: string | null 
  type: 'folder' | 'page'
  content?: string
  differential?: string
  notes?: string
  sections?: DocumentSection[]
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
  status?: 'Pago' | 'Pendente'
  paidDate?: string
}

interface FinanceHistoryEntry {
  id: string
  type: 'expense' | 'received' | 'pending'
  source: 'expense' | 'shift' | 'specialist' | 'base' | 'other'
  label: string
  category: string
  amount: number
  date: string
  shiftId?: string
  expenseId?: string
  expenseStatus?: 'Pago' | 'Pendente'
  expensePaidDate?: string
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
  clinicId?: string
  clinicName?: string
  clinicColor?: string
  category?: 'work' | 'return' | 'other'
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
  neoplasia?: string
  timeline?: PatientTimelineEvent[]
  alerts?: PatientAlert[]
  continuousMedications?: string[]
}

interface PrescriptionMedication {
  id: string
  name: string
  presentation: string
  dose: string
  frequency: string
  duration: string
  instructions: string
}

interface VetPrescription {
  id: string
  createdAt: string
  updatedAt: string
  patientId: string
  patientName: string
  tutorName: string
  species: string
  date: string
  veterinarian: string
  crmv: string
  diagnosis: string
  medications: PrescriptionMedication[]
  generalInstructions: string
  notes: string
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

interface AiAttachment {
  id: string
  name: string
  mimeType: string
  dataUrl: string
  previewUrl?: string
  kind: 'image' | 'pdf'
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
  paidDate?: string
}

interface SpecialistConsultationItem {
  id: string
  clinicId: string
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

type PersonalMediaType = 'Livro' | 'Filme' | 'Série' | 'Jogo' | 'Cafeteria' | 'Podcast'
type PersonalMediaStatus = 'quero' | 'em_andamento' | 'concluido'
type PersonalMediaFilter = 'todos' | 'quero' | 'em_andamento' | 'concluido' | 'favoritos'
type PersonalMediaSort = 'recentes' | 'alfabetico' | 'nota' | 'concluidos'

interface PersonalMediaItem {
  id: string
  type: PersonalMediaType
  title: string
  notes: string
  status: PersonalMediaStatus
  createdAt: string
  completedAt?: string
  archived?: boolean
  imageUrl?: string
  rating?: number
  favorite?: boolean
  review?: string
  progressCurrent?: number
  progressTotal?: number
  progressNote?: string
}

interface PersonalMediaGoal {
  monthly: number
  annual: number
}

type PersonalMediaGoals = Record<PersonalMediaType, PersonalMediaGoal>

const DEFAULT_PERSONAL_MEDIA_GOALS: PersonalMediaGoals = {
  Livro: { monthly: 1, annual: 12 },
  Filme: { monthly: 2, annual: 20 },
  Série: { monthly: 1, annual: 8 },
  Jogo: { monthly: 1, annual: 5 },
  Cafeteria: { monthly: 1, annual: 12 },
  Podcast: { monthly: 2, annual: 24 },
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

/**
 * Ferramentas de apoio à decisão clínica.
 * - VCOG-CTCAE v2: LeBlanc et al., Vet Comp Oncol. 2021;19:311-352.
 * - Energia/Nutrição: 2021 AAHA Nutrition and Weight Management Guidelines.
 * - ECC: WSAVA Global Nutrition Committee, escala 1-9 para cães.
 *
 * Os módulos abaixo NÃO substituem julgamento clínico, laudo anatomopatológico,
 * bula, protocolo institucional ou consulta com nutricionista veterinário.
 */

export type TimelineEventType =
  | 'peso'
  | 'tumor'
  | 'hemograma'
  | 'quimioterapia'
  | 'toxicidade'
  | 'histologia'
  | 'nutricao'
  | 'outro'

export interface PatientTimelineEvent {
  id: string
  date: string
  type: TimelineEventType
  title: string
  notes?: string
  weightKg?: number
  tumorMeasurementMm?: string
  neutrophils?: number
  platelets?: number
  hematocrit?: number
  chemoDrug?: string
  chemoCycle?: string
  nadirStart?: string
  nadirEnd?: string
  grade?: number
}

export interface PatientAlert {
  id: string
  createdAt: string
  severity: 'info' | 'warning' | 'critical'
  title: string
  message: string
  resolved?: boolean
}

export interface ClinicalPatientLite {
  id: string
  petName: string
  tutor: string
  species: string
  neoplasia?: string
  timeline?: PatientTimelineEvent[]
  alerts?: PatientAlert[]
  continuousMedications?: string[]
}

interface CalendarEventLite {
  dateKey: string
  title: string
  description: string
  time?: string
  clinicId?: string
  clinicName?: string
  clinicColor?: string
  category?: 'work' | 'return' | 'other'
}

interface TaskLite {
  id: string
  text: string
  completed: boolean
  category: string
}

const inputClass = 'w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none focus:border-pink-400 font-medium'
const labelClass = 'text-[11px] font-bold text-stone-600 block mb-1'
const cardClass = 'bg-white/95 border border-pink-100 rounded-3xl shadow-sm p-6 md:p-8'

const formatLocalDate = (iso: string) => {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR')
}

const todayLocalIso = () => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const addDaysIso = (iso: string, days: number) => {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + days)
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

const NADIR_WINDOWS: Record<string, { start: number; end: number }> = {
  Doxorrubicina: { start: 7, end: 14 },
  Ciclofosfamida: { start: 7, end: 14 },
  Vincristina: { start: 7, end: 10 },
  'Lomustina (CCNU)': { start: 7, end: 21 },
  Clorambucil: { start: 7, end: 14 },
}

const getNadirWindow = (drug: string, date: string) => {
  const win = NADIR_WINDOWS[drug]
  if (!win || !date) return null
  return { start: addDaysIso(date, win.start), end: addDaysIso(date, win.end) }
}

const VCOG_GENERAL: Record<number, { label: string; description: string; workflow: string }> = {
  1: {
    label: 'Grau 1 — Leve',
    description: 'Assintomático ou sintomas leves; observação clínica/diagnóstica; intervenção geralmente não indicada.',
    workflow: 'Registrar, orientar monitoramento e revisar antes do próximo ciclo se houver progressão.',
  },
  2: {
    label: 'Grau 2 — Moderado',
    description: 'Intervenção ambulatorial ou não invasiva indicada; limitação moderada das atividades diárias.',
    workflow: 'Avaliar suporte ambulatorial e discutir necessidade de ajuste/adiamento conforme protocolo e tendência clínica.',
  },
  3: {
    label: 'Grau 3 — Grave',
    description: 'Grave ou clinicamente significativo, sem risco de vida imediato; hospitalização pode ser indicada.',
    workflow: 'Reavaliação veterinária prioritária; não liberar novo ciclo sem revisão oncológica e laboratorial.',
  },
  4: {
    label: 'Grau 4 — Risco de vida',
    description: 'Consequências potencialmente fatais; intervenção urgente indicada.',
    workflow: 'Atendimento emergencial/hospitalização e estabilização. Suspender programação antineoplásica até reavaliação formal.',
  },
  5: {
    label: 'Grau 5 — Óbito relacionado ao evento',
    description: 'Óbito natural ou eutanásia relacionada ao evento adverso, conforme documentação clínica.',
    workflow: 'Documentar evento, atribuição e relação temporal de forma completa.',
  },
}

const toxicitySeverityClass = (grade: number) => {
  if (grade >= 4) return 'bg-rose-50 border-rose-300 text-rose-900'
  if (grade === 3) return 'bg-orange-50 border-orange-300 text-orange-900'
  if (grade === 2) return 'bg-amber-50 border-amber-300 text-amber-900'
  return 'bg-emerald-50 border-emerald-200 text-emerald-900'
}

function autoGradeHematologic(event: string, value: number, lln: number, species: 'cao' | 'gato') {
  if (!Number.isFinite(value) || value < 0) return 0

  if (event === 'Neutropenia') {
    if (value < 500) return 4
    if (value < 1000) return 3
    if (value < 1500) return 2
    if (lln > 0 && value < lln) return 1
    return 0
  }

  if (event === 'Trombocitopenia') {
    if (value < 25000) return 4
    if (value < 50000) return 3
    if (value < 100000) return 2
    if (lln > 0 && value < lln) return 1
    return 0
  }

  if (event === 'PCV/Hematócrito baixo') {
    if (value < 15) return 4
    if (value < 20) return 3
    if (species === 'cao') {
      if (value < 30) return 2
      if (lln > 0 && value < lln) return 1
    } else {
      if (value < 25) return 2
      if (lln > 0 && value < lln) return 1
    }
    return 0
  }

  return 0
}

export type OncologyFeatureMode = 'toxicity' | 'interactions' | 'postchemo' | 'histology'

interface AdvancedOncologyFeatureProps {
  mode: OncologyFeatureMode
  patients: ClinicalPatientLite[]
  onAddTimelineEvent?: (patientId: string, event: PatientTimelineEvent) => void
  onAddAlert?: (patientId: string, alert: PatientAlert) => void
  onUpdateContinuousMedications?: (patientId: string, medications: string[]) => void
}

export function AdvancedOncologyFeature({
  mode,
  patients,
  onAddTimelineEvent,
  onAddAlert,
  onUpdateContinuousMedications,
}: AdvancedOncologyFeatureProps) {
  const [patientId, setPatientId] = useState('')

  const selectedPatient = patients.find(p => p.id === patientId)
  const patientOptions = patients.filter(p => ['canino', 'felino', 'cão', 'gato'].some(s => p.species.toLowerCase().includes(s)))

  if (mode === 'toxicity') {
    return <ToxicityGrading patientOptions={patientOptions} patientId={patientId} setPatientId={setPatientId} onAddTimelineEvent={onAddTimelineEvent} onAddAlert={onAddAlert} />
  }
  if (mode === 'interactions') {
    return <InteractionChecker patientOptions={patientOptions} patientId={patientId} setPatientId={setPatientId} selectedPatient={selectedPatient} onUpdateContinuousMedications={onUpdateContinuousMedications} />
  }
  if (mode === 'postchemo') {
    return <PostChemoGuidance patientOptions={patientOptions} patientId={patientId} setPatientId={setPatientId} selectedPatient={selectedPatient} onAddTimelineEvent={onAddTimelineEvent} />
  }
  return <HistologyGrading patientOptions={patientOptions} patientId={patientId} setPatientId={setPatientId} selectedPatient={selectedPatient} onAddTimelineEvent={onAddTimelineEvent} />
}

function PatientSelector({
  patients,
  value,
  onChange,
  label = 'Paciente (opcional para simulação)',
  manualName = '',
  onManualNameChange,
}: {
  patients: ClinicalPatientLite[]
  value: string
  onChange: (value: string) => void
  label?: string
  manualName?: string
  onManualNameChange?: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <div>
        <label className={labelClass}>{label}</label>
        <select
          value={value}
          onChange={e => {
            onChange(e.target.value)
            if (e.target.value && onManualNameChange) onManualNameChange('')
          }}
          className={inputClass}
        >
          <option value="">Sem vincular a prontuário</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.petName} • {p.tutor} • {p.species}{p.neoplasia ? ` • ${p.neoplasia}` : ''}</option>
          ))}
        </select>
      </div>

      {onManualNameChange && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-px flex-1 bg-pink-100" />
            <span className="text-[10px] font-bold text-stone-400 uppercase">ou digite</span>
            <span className="h-px flex-1 bg-pink-100" />
          </div>
          <label className={labelClass}>Nome do paciente</label>
          <input
            value={manualName}
            onChange={e => {
              onManualNameChange(e.target.value)
              if (e.target.value && value) onChange('')
            }}
            placeholder="Ex: Mel"
            className={inputClass}
          />
          <p className="text-[10px] text-stone-400 mt-1">
            Use este campo quando quiser utilizar a ferramenta sem cadastrar o paciente no prontuário.
          </p>
        </div>
      )}
    </div>
  )
}

function ModuleHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-pink-100 pb-4 mb-5">
      <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm">{icon}</div>
      <div>
        <h2 className="text-base font-extrabold text-pink-950">{title}</h2>
        <p className="text-xs text-pink-500 font-medium">{subtitle}</p>
      </div>
    </div>
  )
}

function SafetyBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 text-[11px] leading-relaxed text-amber-900 flex gap-2">
      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  )
}

function ToxicityGrading({
  patientOptions,
  patientId,
  setPatientId,
  onAddTimelineEvent,
  onAddAlert,
}: {
  patientOptions: ClinicalPatientLite[]
  patientId: string
  setPatientId: (v: string) => void
  onAddTimelineEvent?: AdvancedOncologyFeatureProps['onAddTimelineEvent']
  onAddAlert?: AdvancedOncologyFeatureProps['onAddAlert']
}) {
  const [manualPatientName, setManualPatientName] = useState('')
  const [event, setEvent] = useState('Neutropenia')
  const [species, setSpecies] = useState<'cao' | 'gato'>('cao')
  const [value, setValue] = useState('')
  const [lln, setLln] = useState('')
  const [manualGrade, setManualGrade] = useState(1)
  const [fatalEvent, setFatalEvent] = useState(false)
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  const hematologic = ['Neutropenia', 'Trombocitopenia', 'PCV/Hematócrito baixo'].includes(event)
  const numericValue = Number(value)
  const numericLln = Number(lln)
  const autoGrade = hematologic ? autoGradeHematologic(event, numericValue, numericLln, species) : manualGrade
  const finalGrade = fatalEvent ? 5 : (autoGrade || (hematologic ? 0 : manualGrade))

  const unit = event === 'PCV/Hematócrito baixo' ? '%' : '/µL'

  const saveEvent = () => {
    if (!patientId || finalGrade === 0) return
    const date = todayLocalIso()
    onAddTimelineEvent?.(patientId, {
      id: `tox-${Date.now()}`,
      date,
      type: 'toxicidade',
      title: `${event} — VCOG Grau ${finalGrade}`,
      grade: finalGrade,
      notes: `${hematologic ? `Valor: ${value} ${unit}${lln ? ` | LLN lab: ${lln} ${unit}` : ''}. ` : ''}${notes}`.trim(),
    })
    if (finalGrade >= 3) {
      onAddAlert?.(patientId, {
        id: `alert-${Date.now()}`,
        createdAt: new Date().toISOString(),
        severity: finalGrade >= 4 ? 'critical' : 'warning',
        title: `Toxicidade VCOG Grau ${finalGrade}: ${event}`,
        message: VCOG_GENERAL[finalGrade].workflow,
        resolved: false,
      })
    }
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className={cardClass}>
        <ModuleHeader icon={<ShieldAlert className="w-6 h-6" />} title="Graduação de Toxicidade — VCOG-CTCAE v2" subtitle="Cães e gatos • eventos hematológicos automáticos + graduação clínica não hematológica" />
        <SafetyBanner>
          Os limites hematológicos abaixo seguem a VCOG-CTCAE v2. O grau 1 depende do limite inferior de referência (LLN) do laboratório. Para eventos não hematológicos, selecione o grau conforme a descrição específica do VCOG quando disponível; a descrição geral funciona como apoio.
        </SafetyBanner>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <div className="space-y-4">
            <PatientSelector patients={patientOptions} value={patientId} onChange={setPatientId} manualName={manualPatientName} onManualNameChange={setManualPatientName} />
            <div>
              <label className={labelClass}>Evento adverso</label>
              <select value={event} onChange={e => { setEvent(e.target.value); setValue(''); setLln('') }} className={inputClass}>
                <optgroup label="Hematológicos — cálculo automático">
                  <option>Neutropenia</option>
                  <option>Trombocitopenia</option>
                  <option>PCV/Hematócrito baixo</option>
                </optgroup>
                <optgroup label="Não hematológicos — graduação clínica">
                  <option>Vômito</option>
                  <option>Diarreia</option>
                  <option>Hiporexia/Anorexia</option>
                  <option>Letargia/Fadiga</option>
                  <option>Dor</option>
                  <option>Reação de hipersensibilidade</option>
                  <option>Outro</option>
                </optgroup>
              </select>
            </div>

            {hematologic ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Espécie</label>
                    <select value={species} onChange={e => setSpecies(e.target.value as 'cao' | 'gato')} className={inputClass}>
                      <option value="cao">Canino</option>
                      <option value="gato">Felino</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Resultado ({unit})</label>
                    <input type="number" min="0" step={event === 'PCV/Hematócrito baixo' ? '0.1' : '1'} value={value} onChange={e => setValue(e.target.value)} className={inputClass} placeholder="Valor do exame" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>LLN do laboratório ({unit})</label>
                  <input type="number" min="0" step={event === 'PCV/Hematócrito baixo' ? '0.1' : '1'} value={lln} onChange={e => setLln(e.target.value)} className={inputClass} placeholder="Necessário para diferenciar normal de Grau 1" />
                </div>
              </>
            ) : (
              <div>
                <label className={labelClass}>Grau clínico</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(g => (
                    <button key={g} type="button" onClick={() => setManualGrade(g)} className={`py-2 rounded-xl border text-xs font-extrabold transition ${manualGrade === g ? 'bg-pink-500 text-white border-pink-500' : 'bg-white border-pink-200 text-pink-800 hover:bg-pink-50'}`}>
                      G{g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <label className={`flex items-start gap-2 p-3 rounded-xl border text-[11px] font-bold ${fatalEvent ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-white border-pink-100 text-stone-600'}`}>
              <input type="checkbox" checked={fatalEvent} onChange={e => setFatalEvent(e.target.checked)} className="accent-rose-600 mt-0.5" />
              Óbito/eutanásia atribuída ao evento adverso — classificar como Grau 5 independentemente do valor laboratorial.
            </label>

            <div>
              <label className={labelClass}>Observações clínicas</label>
              <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} className={inputClass} placeholder="Sintomas, duração, intervenções, tendência..." />
            </div>
          </div>

          <div className="space-y-4">
            {finalGrade === 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-sm text-emerald-900 font-bold">
                Sem toxicidade graduável pelos dados informados. Confirme o intervalo de referência do laboratório.
              </div>
            ) : (
              <div className={`border rounded-2xl p-5 space-y-3 ${toxicitySeverityClass(finalGrade)}`}>
                <div className="text-lg font-extrabold">{VCOG_GENERAL[finalGrade].label}</div>
                <p className="text-xs leading-relaxed">{VCOG_GENERAL[finalGrade].description}</p>
                <div className="bg-white/70 rounded-xl p-3 text-xs leading-relaxed">
                  <strong>Fluxo clínico sugerido no sistema:</strong> {VCOG_GENERAL[finalGrade].workflow}
                </div>
              </div>
            )}

            {hematologic && (
              <div className="bg-pink-50/60 border border-pink-200 rounded-2xl p-4 text-[11px] text-stone-700 space-y-1">
                <div className="font-extrabold text-pink-950">Referência rápida VCOG-CTCAE v2</div>
                {event === 'Neutropenia' && <p>G1: 1.500 até &lt;LLN • G2: 1.000–1.499 • G3: 500–999 • G4: &lt;500 neutrófilos/µL.</p>}
                {event === 'Trombocitopenia' && <p>Sem sangramento: G1: 100.000 até &lt;LLN • G2: 50.000–99.000 • G3: 25.000–49.000 • G4: &lt;25.000 plaquetas/µL.</p>}
                {event === 'PCV/Hematócrito baixo' && <p>G2: cão 20–&lt;30%, gato 20–&lt;25% • G3: 15–&lt;20% • G4: &lt;15%. G1 depende do LLN do laboratório.</p>}
              </div>
            )}

            <button type="button" disabled={!patientId || finalGrade === 0} onClick={saveEvent} className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
              {saved ? <Check className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
              {saved ? 'Registrado no prontuário' : patientId ? 'Registrar na timeline do paciente' : 'Selecione um paciente para registrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface InteractionFlag {
  severity: 'warning' | 'critical'
  title: string
  detail: string
}

function InteractionChecker({
  patientOptions,
  patientId,
  setPatientId,
  selectedPatient,
  onUpdateContinuousMedications,
}: {
  patientOptions: ClinicalPatientLite[]
  patientId: string
  setPatientId: (v: string) => void
  selectedPatient?: ClinicalPatientLite
  onUpdateContinuousMedications?: AdvancedOncologyFeatureProps['onUpdateContinuousMedications']
}) {
  const [manualPatientName, setManualPatientName] = useState('')
  const [chemo, setChemo] = useState('Doxorrubicina')
  const [meds, setMeds] = useState('')
  const [classes, setClasses] = useState<string[]>([])
  const [saved, setSaved] = useState(false)

  React.useEffect(() => {
    setMeds((selectedPatient?.continuousMedications || []).join(', '))
    setClasses([])
  }, [selectedPatient?.id])

  const toggleClass = (name: string) => setClasses(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name])

  const detectedClasses = useMemo(() => {
    const text = meds.toLowerCase()
    const detected: string[] = []
    const hasAny = (terms: string[]) => terms.some(term => text.includes(term))
    if (hasAny(['meloxicam', 'carprofeno', 'carprofen', 'firocoxib', 'deracoxib', 'robenacoxib', 'cetoprofeno', 'ketoprofen', 'aspirina'])) detected.push('AINE')
    if (hasAny(['prednisolona', 'prednisona', 'dexametasona', 'metilprednisolona', 'hidrocortisona'])) detected.push('Corticoide')
    if (hasAny(['clopidogrel', 'rivaroxabana', 'rivaroxaban', 'apixabana', 'apixaban', 'heparina', 'varfarina', 'warfarin'])) detected.push('Anticoagulante')
    if (hasAny(['cetoconazol', 'ketoconazole', 'itraconazol', 'itraconazole', 'claritromicina', 'clarithromycin'])) detected.push('CYP/P-gp')
    return detected
  }, [meds])

  const riskClasses = useMemo(() => Array.from(new Set([...classes, ...detectedClasses])), [classes, detectedClasses])

  const flags = useMemo<InteractionFlag[]>(() => {
    const f: InteractionFlag[] = []
    if (riskClasses.includes('AINE') && riskClasses.includes('Corticoide')) {
      f.push({ severity: 'critical', title: 'AINE + corticoide', detail: 'Associação com risco gastrointestinal/renal aumentado. Revisar necessidade de uso concomitante e intervalo entre classes.' })
    }
    if (chemo === 'Lomustina (CCNU)' && riskClasses.includes('Hepatotóxico')) {
      f.push({ severity: 'critical', title: 'Lomustina + potencial hepatotóxico', detail: 'Risco de hepatotoxicidade aditiva. Revisar medicações, enzimas hepáticas e protocolo de monitoramento.' })
    }
    if (chemo === 'Doxorrubicina' && riskClasses.includes('Cardiotóxico')) {
      f.push({ severity: 'critical', title: 'Doxorrubicina + potencial cardiotóxico', detail: 'Possível cardiotoxicidade aditiva. Necessita revisão do histórico, dose cumulativa e avaliação cardiológica quando indicada.' })
    }
    if (chemo === 'Vincristina' && riskClasses.includes('CYP/P-gp')) {
      f.push({ severity: 'warning', title: 'Vincristina + inibidor forte CYP3A/P-gp', detail: 'Pode aumentar exposição/toxicidade de alcaloides da vinca. Confirmar interação específica da medicação antes da administração.' })
    }
    if (riskClasses.includes('Mielossupressor')) {
      f.push({ severity: 'warning', title: 'Terapia concomitante mielossupressora', detail: 'Pode haver toxicidade hematológica aditiva. Correlacionar com hemograma, nadir esperado e protocolo.' })
    }
    if (riskClasses.includes('Anticoagulante')) {
      f.push({ severity: 'warning', title: 'Anticoagulante/antiagregante em paciente oncológico', detail: 'Revisar risco hemorrágico especialmente se houver trombocitopenia, tumor ulcerado ou procedimento invasivo.' })
    }
    if ((chemo === 'Cisplatina' || chemo === 'Carboplatina') && riskClasses.includes('Nefrotóxico')) {
      f.push({ severity: 'critical', title: `${chemo} + potencial nefrotóxico`, detail: 'Possível risco renal aditivo. Revisar função renal, hidratação e alternativas antes da terapia.' })
    }
    return f
  }, [chemo, riskClasses])

  const saveMeds = () => {
    if (!patientId) return
    const parsed = meds.split(/[\n,;]/).map(x => x.trim()).filter(Boolean)
    onUpdateContinuousMedications?.(patientId, parsed)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className={cardClass}>
        <ModuleHeader icon={<Activity className="w-6 h-6" />} title="Alerta de Interações Medicamentosas" subtitle="Triagem rule-based entre quimioterápicos, medicações contínuas e classes de risco" />
        <SafetyBanner>
          Esta tela faz detecção automática limitada por nomes comuns e permite marcar classes adicionais; não é uma base exaustiva de interações. Sempre conferir bula, farmacologia, comorbidades, função orgânica e protocolo oncológico antes de alterar tratamento.
        </SafetyBanner>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <div className="space-y-4">
            <PatientSelector patients={patientOptions} value={patientId} onChange={setPatientId} manualName={manualPatientName} onManualNameChange={setManualPatientName} />
            <div>
              <label className={labelClass}>Quimioterápico</label>
              <select value={chemo} onChange={e => setChemo(e.target.value)} className={inputClass}>
                {['Doxorrubicina', 'Ciclofosfamida', 'Vincristina', 'Lomustina (CCNU)', 'Clorambucil', 'Carboplatina', 'Cisplatina'].map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Medicações de uso contínuo</label>
              <textarea rows={4} value={meds} onChange={e => setMeds(e.target.value)} className={inputClass} placeholder="Ex.: prednisolona, meloxicam, fenobarbital..." />
              {patientId && <button type="button" onClick={saveMeds} className="mt-2 text-[11px] font-bold text-pink-700 hover:underline">{saved ? '✓ Salvo no paciente' : 'Salvar lista no prontuário'}</button>}
              {detectedClasses.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5"><span className="text-[10px] text-stone-500">Detectado pelo nome:</span>{detectedClasses.map(c => <span key={c} className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">{c}</span>)}</div>}
            </div>
            <div>
              <label className={labelClass}>Classes/riscos adicionais para revisão manual</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['AINE', 'AINE'],
                  ['Corticoide', 'Corticoide'],
                  ['Hepatotóxico', 'Potencial hepatotóxico'],
                  ['Nefrotóxico', 'Potencial nefrotóxico'],
                  ['Cardiotóxico', 'Potencial cardiotóxico'],
                  ['CYP/P-gp', 'Inibidor forte CYP3A/P-gp'],
                  ['Mielossupressor', 'Outro mielossupressor'],
                  ['Anticoagulante', 'Anticoagulante/antiagregante'],
                ].map(([value, label]) => (
                  <label key={value} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-[11px] font-bold ${classes.includes(value) ? 'bg-pink-100 border-pink-300 text-pink-900' : 'bg-white border-pink-100 text-stone-600'}`}>
                    <input type="checkbox" checked={classes.includes(value)} onChange={() => toggleClass(value)} className="accent-pink-500" /> {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-pink-950 uppercase tracking-wider">Resultado da triagem</h3>
            {flags.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-xs text-emerald-900 leading-relaxed">
                Nenhum conflito de alta relevância foi disparado pelas classes marcadas. Isso <strong>não significa ausência de interação</strong>; revise os nomes das medicações individualmente.
              </div>
            ) : flags.map((flag, idx) => (
              <div key={idx} className={`rounded-2xl p-4 border ${flag.severity === 'critical' ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-amber-50 border-amber-300 text-amber-900'}`}>
                <div className="font-extrabold text-xs flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {flag.title}</div>
                <p className="text-[11px] mt-1.5 leading-relaxed">{flag.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PostChemoGuidance({
  patientOptions,
  patientId,
  setPatientId,
  selectedPatient,
  onAddTimelineEvent,
}: {
  patientOptions: ClinicalPatientLite[]
  patientId: string
  setPatientId: (v: string) => void
  selectedPatient?: ClinicalPatientLite
  onAddTimelineEvent?: AdvancedOncologyFeatureProps['onAddTimelineEvent']
}) {
  const [manualPatientName, setManualPatientName] = useState('')
  const [drug, setDrug] = useState('Doxorrubicina')
  const [date, setDate] = useState(() => todayLocalIso())
  const [hours, setHours] = useState('72')
  const [extra, setExtra] = useState('')
  const [copied, setCopied] = useState(false)

  const guidance = useMemo(() => {
    const pet = selectedPatient?.petName || manualPatientName.trim() || '[nome do pet]'
    const tutor = selectedPatient?.tutor || '[tutor]'
    return `ORIENTAÇÕES APÓS QUIMIOTERAPIA\n\nPaciente: ${pet}\nTutor(a): ${tutor}\nFármaco: ${drug}\nData da aplicação: ${formatLocalDate(date)}\n\n1. MEDICAÇÕES E ALIMENTAÇÃO\n• Ofereça água e alimentação conforme orientação da equipe.\n• Administre somente as medicações prescritas. Não acrescente anti-inflamatórios, corticoides ou outros medicamentos por conta própria.\n\n2. URINA, FEZES E VÔMITO\n• Durante aproximadamente ${hours || '72'} horas (ou pelo período específico informado pela equipe), use luvas descartáveis ao limpar urina, fezes ou vômito.\n• Recolha os resíduos com material descartável, acondicione em saco fechado e higienize a área.\n• Gestantes, crianças pequenas e pessoas imunossuprimidas devem evitar contato direto com dejetos nesse período.\n\n3. SINAIS DE ALARME — CONTATE A EQUIPE\n• Febre medida ou temperatura fora do intervalo orientado pela clínica.\n• Apatia intensa, fraqueza ou piora súbita do estado geral.\n• Vômitos repetidos, diarreia intensa ou recusa persistente de água/alimento.\n• Sangramento, dificuldade respiratória, dor importante ou redução importante da urina.\n\n4. RETORNO\n• Realize hemograma e retorno nas datas orientadas, especialmente durante a janela prevista de nadir.\n${extra ? `\nObservações específicas:\n${extra}\n` : ''}\nEm caso de dúvida ou piora, entre em contato com a equipe veterinária responsável.`
  }, [selectedPatient, manualPatientName, drug, date, hours, extra])

  const copy = async () => {
    await navigator.clipboard.writeText(guidance)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2200)
  }

  const save = () => {
    if (!patientId) return
    const nadir = getNadirWindow(drug, date)
    onAddTimelineEvent?.(patientId, {
      id: `post-${Date.now()}`,
      date,
      type: 'quimioterapia',
      title: `Quimioterapia / orientações — ${drug}`,
      chemoDrug: drug,
      nadirStart: nadir?.start,
      nadirEnd: nadir?.end,
      notes: 'Orientações domiciliares entregues ao tutor e registradas no prontuário.',
    })
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className={cardClass}>
        <ModuleHeader icon={<FileText className="w-6 h-6" />} title="Gerador de Orientações Pós-Quimio para o Tutor" subtitle="Resumo prático de cuidados domiciliares, manejo de dejetos e sinais de alarme" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <PatientSelector patients={patientOptions} value={patientId} onChange={setPatientId} label="Paciente" manualName={manualPatientName} onManualNameChange={setManualPatientName} />
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Quimioterápico</label><select value={drug} onChange={e => setDrug(e.target.value)} className={inputClass}>{Object.keys(NADIR_WINDOWS).map(x => <option key={x}>{x}</option>)}</select></div>
              <div><label className={labelClass}>Data</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass} /></div>
            </div>
            <div><label className={labelClass}>Período de precaução com dejetos (horas)</label><input type="number" min="24" max="168" value={hours} onChange={e => setHours(e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Orientações específicas adicionais</label><textarea rows={5} value={extra} onChange={e => setExtra(e.target.value)} className={inputClass} placeholder="Ex.: antiemético, data do hemograma, telefone da clínica..." /></div>
            <SafetyBanner>O período de manejo de excretas pode variar conforme o fármaco e o protocolo da instituição. Ajuste o campo acima para a orientação adotada pela sua equipe.</SafetyBanner>
          </div>
          <div className="space-y-3">
            <div className="bg-pink-50/40 border border-pink-200 rounded-2xl p-4 text-xs whitespace-pre-line leading-relaxed text-stone-800 max-h-[520px] overflow-y-auto select-text">{guidance}</div>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={copy} className="bg-stone-800 hover:bg-stone-900 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copiado' : 'Copiar para o tutor'}</button>
              <button type="button" disabled={!patientId} onClick={save} className="bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white py-2.5 rounded-xl text-xs font-bold">Registrar entrega</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HistologyGrading({
  patientOptions,
  patientId,
  setPatientId,
  selectedPatient,
  onAddTimelineEvent,
}: {
  patientOptions: ClinicalPatientLite[]
  patientId: string
  setPatientId: (v: string) => void
  selectedPatient?: ClinicalPatientLite
  onAddTimelineEvent?: AdvancedOncologyFeatureProps['onAddTimelineEvent']
}) {
  const [manualPatientName, setManualPatientName] = useState('')
  const [tumorType, setTumorType] = useState<'mastocitoma' | 'mamario' | 'outro'>('mastocitoma')
  const [patnaik, setPatnaik] = useState('II')
  const [mitosesMct, setMitosesMct] = useState('')
  const [multinucleated, setMultinucleated] = useState('')
  const [bizarre, setBizarre] = useState('')
  const [karyomegaly, setKaryomegaly] = useState<'nao_informado' | 'ausente' | 'presente'>('nao_informado')
  const [tubule, setTubule] = useState(1)
  const [pleomorphism, setPleomorphism] = useState(1)
  const [mammaryMitosis, setMammaryMitosis] = useState(1)
  const [genericGrade, setGenericGrade] = useState('I')
  const [margins, setMargins] = useState('Não informado')
  const [lvi, setLvi] = useState('Não informado')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  React.useEffect(() => {
    const n = (selectedPatient?.neoplasia || '').toLowerCase()
    if (n.includes('mastoc')) setTumorType('mastocitoma')
    else if (n.includes('mam')) setTumorType('mamario')
  }, [selectedPatient?.id])

  const mctAnyHigh = (mitosesMct !== '' && Number(mitosesMct) >= 7) || (multinucleated !== '' && Number(multinucleated) >= 3) || (bizarre !== '' && Number(bizarre) >= 3) || karyomegaly === 'presente'
  const mctComplete = mitosesMct !== '' && multinucleated !== '' && bizarre !== '' && karyomegaly !== 'nao_informado'
  const mctClassification = mctAnyHigh ? 'ALTO GRAU' : mctComplete ? 'BAIXO GRAU' : 'INDETERMINADO — complete todos os critérios'
  const mammaryTotal = tubule + pleomorphism + mammaryMitosis
  const mammaryGrade = mammaryTotal <= 5 ? 'I (baixo)' : mammaryTotal <= 7 ? 'II (intermediário)' : 'III (alto)'

  const summary = useMemo(() => {
    const base = [`Paciente: ${selectedPatient?.petName || manualPatientName.trim() || '[não informado]'}`, `Neoplasia cadastrada: ${selectedPatient?.neoplasia || 'não informada'}`]
    if (tumorType === 'mastocitoma') {
      base.push(`Mastocitoma cutâneo — Patnaik: grau ${patnaik}.`)
      base.push(`Kiupel pelos critérios inseridos: ${mctClassification}.`)
      base.push(`Critérios Kiupel: mitoses/10 HPF=${mitosesMct || 'NI'}; células multinucleadas/10 HPF=${multinucleated || 'NI'}; núcleos bizarros/10 HPF=${bizarre || 'NI'}; cariomegalia=${karyomegaly === 'presente' ? 'presente' : karyomegaly === 'ausente' ? 'ausente' : 'NI'}.`)
    } else if (tumorType === 'mamario') {
      base.push(`Carcinoma mamário — escore histológico: ${mammaryTotal}/9; grau ${mammaryGrade}.`)
      base.push(`Componentes: formação tubular=${tubule}; pleomorfismo nuclear=${pleomorphism}; atividade mitótica=${mammaryMitosis}.`)
    } else {
      base.push(`Tumor/Laudo — grau histológico informado: ${genericGrade}.`)
    }
    base.push(`Margens: ${margins}. Invasão linfovascular: ${lvi}.`)
    if (notes) base.push(`Observações: ${notes}`)
    return base.join('\n')
  }, [selectedPatient, manualPatientName, tumorType, patnaik, mctClassification, mitosesMct, multinucleated, bizarre, karyomegaly, mammaryTotal, mammaryGrade, tubule, pleomorphism, mammaryMitosis, genericGrade, margins, lvi, notes])

  const save = () => {
    if (!patientId) return
    onAddTimelineEvent?.(patientId, {
      id: `hist-${Date.now()}`,
      date: todayLocalIso(),
      type: 'histologia',
      title: tumorType === 'mastocitoma' ? `Laudo: Mastocitoma — Kiupel ${mctClassification}` : tumorType === 'mamario' ? `Laudo: Carcinoma mamário — Grau ${mammaryGrade}` : `Laudo histológico — Grau ${genericGrade}`,
      notes: summary,
    })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className={cardClass}>
        <ModuleHeader icon={<Stethoscope className="w-6 h-6" />} title="Laudos Estruturados & Graduação Histológica" subtitle="Mastocitoma (Patnaik/Kiupel), carcinoma mamário e laudos gerais" />
        <SafetyBanner>O sumário organiza dados do laudo e pode sugerir a classificação pelos critérios inseridos. A classificação definitiva permanece a do patologista e deve considerar tipo tumoral, amostra, margens, estadiamento e contexto clínico.</SafetyBanner>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <div className="space-y-4">
            <PatientSelector patients={patientOptions} value={patientId} onChange={setPatientId} label="Paciente" manualName={manualPatientName} onManualNameChange={setManualPatientName} />
            <div><label className={labelClass}>Tipo de graduação</label><select value={tumorType} onChange={e => setTumorType(e.target.value as any)} className={inputClass}><option value="mastocitoma">Mastocitoma cutâneo canino</option><option value="mamario">Carcinoma mamário canino</option><option value="outro">Outro tumor / laudo</option></select></div>

            {tumorType === 'mastocitoma' && (
              <div className="space-y-3 bg-pink-50/40 border border-pink-100 rounded-2xl p-4">
                <div><label className={labelClass}>Patnaik informado no laudo</label><select value={patnaik} onChange={e => setPatnaik(e.target.value)} className={inputClass}><option>I</option><option>II</option><option>III</option><option>Não informado</option></select></div>
                <div className="grid grid-cols-3 gap-2">
                  <div><label className={labelClass}>Mitoses / 10 HPF</label><input type="number" min="0" value={mitosesMct} onChange={e => setMitosesMct(e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Multinucleadas / 10 HPF</label><input type="number" min="0" value={multinucleated} onChange={e => setMultinucleated(e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Núcleos bizarros / 10 HPF</label><input type="number" min="0" value={bizarre} onChange={e => setBizarre(e.target.value)} className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>Cariomegalia: ≥10% das células com variação ≥2× do diâmetro nuclear</label><select value={karyomegaly} onChange={e => setKaryomegaly(e.target.value as any)} className={inputClass}><option value="nao_informado">Não informado</option><option value="ausente">Ausente</option><option value="presente">Presente</option></select></div>
                <div className={`rounded-xl p-3 text-xs font-extrabold border ${mctAnyHigh ? 'bg-rose-50 border-rose-300 text-rose-900' : mctComplete ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-300 text-amber-900'}`}>Kiupel: {mctClassification}</div>
              </div>
            )}

            {tumorType === 'mamario' && (
              <div className="space-y-3 bg-pink-50/40 border border-pink-100 rounded-2xl p-4">
                <p className="text-[11px] text-stone-600">Some os três componentes do sistema histológico: formação tubular, pleomorfismo nuclear e atividade mitótica.</p>
                {[['Formação tubular', tubule, setTubule], ['Pleomorfismo nuclear', pleomorphism, setPleomorphism], ['Atividade mitótica', mammaryMitosis, setMammaryMitosis]].map(([label, value, setter]: any) => (
                  <div key={label}><label className={labelClass}>{label}</label><select value={value} onChange={e => setter(Number(e.target.value))} className={inputClass}><option value={1}>1 ponto</option><option value={2}>2 pontos</option><option value={3}>3 pontos</option></select></div>
                ))}
                <div className="bg-white border border-pink-200 rounded-xl p-3 text-xs font-extrabold text-pink-950">Total: {mammaryTotal}/9 → Grau {mammaryGrade}</div>
              </div>
            )}

            {tumorType === 'outro' && <div><label className={labelClass}>Grau informado</label><select value={genericGrade} onChange={e => setGenericGrade(e.target.value)} className={inputClass}><option>I</option><option>II</option><option>III</option><option>Baixo</option><option>Intermediário</option><option>Alto</option><option>Não aplicável</option></select></div>}

            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Margens</label><select value={margins} onChange={e => setMargins(e.target.value)} className={inputClass}><option>Não informado</option><option>Livres</option><option>Exíguas</option><option>Comprometidas</option></select></div>
              <div><label className={labelClass}>Invasão linfovascular</label><select value={lvi} onChange={e => setLvi(e.target.value)} className={inputClass}><option>Não informado</option><option>Ausente</option><option>Presente</option><option>Suspeita</option></select></div>
            </div>
            <div><label className={labelClass}>Observações adicionais</label><textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} className={inputClass} /></div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-pink-950 uppercase tracking-wider">Sumário automático</h3>
            <div className="bg-white border border-pink-200 rounded-2xl p-4 text-xs whitespace-pre-line leading-relaxed text-stone-800 select-text">{summary}</div>
            <button type="button" onClick={() => navigator.clipboard.writeText(summary)} className="w-full bg-stone-800 hover:bg-stone-900 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"><Copy className="w-4 h-4" /> Copiar sumário</button>
            <button type="button" disabled={!patientId} onClick={save} className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white py-2.5 rounded-xl text-xs font-bold">{saved ? '✓ Registrado na timeline' : 'Registrar no prontuário'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export type NutritionFeatureMode = 'energy' | 'bcs' | 'toxins' | 'diet'

interface CanineNutritionFeatureProps {
  mode: NutritionFeatureMode
  patients: ClinicalPatientLite[]
  onAddTimelineEvent?: (patientId: string, event: PatientTimelineEvent) => void
}

const CANINE_FACTORS: Record<string, { label: string; min: number; max: number; default: number; note?: string }> = {
  neutered: { label: 'Adulto castrado', min: 1.4, max: 1.6, default: 1.5 },
  intact: { label: 'Adulto inteiro', min: 1.6, max: 1.8, default: 1.7 },
  inactive: { label: 'Inativo / propenso à obesidade', min: 1.0, max: 1.2, default: 1.1 },
  senior: { label: 'Idoso / baixa atividade', min: 1.0, max: 1.4, default: 1.2, note: 'Não há fator único universal para idosos; ajustar por ECC, massa muscular e atividade.' },
  weightloss: { label: 'Emagrecimento', min: 1.0, max: 1.0, default: 1.0 },
  puppy1: { label: 'Filhote < 4 meses', min: 3.0, max: 3.0, default: 3.0 },
  puppy2: { label: 'Filhote ≥ 4 meses', min: 2.0, max: 2.0, default: 2.0 },
  gestation: { label: 'Gestação — últimos 21 dias', min: 3.0, max: 3.0, default: 3.0 },
  lactation: { label: 'Lactação', min: 3.0, max: 6.0, default: 4.0, note: 'Pode ultrapassar 6× RER conforme ninhada e semana de lactação.' },
  worklight: { label: 'Trabalho leve', min: 1.6, max: 2.0, default: 1.8 },
  workmoderate: { label: 'Trabalho moderado', min: 2.0, max: 5.0, default: 3.0 },
  workheavy: { label: 'Trabalho pesado', min: 5.0, max: 11.0, default: 7.0 },
}

const BCS_TEXT: Record<number, string> = {
  1: 'Muito magro: proeminências ósseas evidentes à distância, sem gordura observável e perda muscular.',
  2: 'Muito magro: costelas, vértebras lombares e pelve facilmente visíveis; sem gordura palpável.',
  3: 'Magro: costelas facilmente palpáveis e possivelmente visíveis; cintura e recolhimento abdominal óbvios.',
  4: 'Ideal baixo: costelas facilmente palpáveis com cobertura mínima; cintura evidente.',
  5: 'Ideal: costelas palpáveis sem excesso de gordura; cintura visível e recolhimento abdominal presente.',
  6: 'Sobrepeso leve: cobertura adiposa discretamente excessiva; cintura ainda observável.',
  7: 'Sobrepeso: costelas difíceis de palpar; depósitos lombares/base da cauda; cintura pouco evidente.',
  8: 'Obesidade: costelas não palpáveis ou apenas com pressão; cintura ausente e depósitos adiposos marcados.',
  9: 'Obesidade acentuada: depósitos adiposos massivos; cintura e recolhimento abdominal ausentes.',
}

const DOG_TOXINS = [
  { name: 'Xilitol', risk: 'CRÍTICO', effect: 'Pode causar hipoglicemia rápida e, em exposições maiores, lesão ou insuficiência hepática em cães.', action: 'Contato veterinário imediato. Não provocar vômito em casa sem orientação; a hipoglicemia pode começar rapidamente.' },
  { name: 'Chocolate / cacau', risk: 'ALTO', effect: 'Metilxantinas podem causar vômito, agitação, taquicardia, arritmias, tremores e convulsões.', action: 'Identificar tipo, quantidade, peso do cão e horário; contatar serviço veterinário rapidamente.' },
  { name: 'Uvas / passas', risk: 'ALTO', effect: 'Podem causar lesão renal aguda em cães e a sensibilidade individual é variável.', action: 'Avaliação veterinária precoce após ingestão e monitoramento renal conforme orientação.' },
  { name: 'Tamarindo', risk: 'ALTO', effect: 'Assim como uvas e passas, contém ácido tartárico e há relatos de lesão renal em cães.', action: 'Evitar oferta e procurar orientação veterinária após ingestão relevante.' },
  { name: 'Cebola / alho / cebolinha / alho-poró', risk: 'ALTO', effect: 'Compostos oxidantes de Allium podem causar hemólise e anemia, inclusive em formas cozidas, secas ou em pó.', action: 'Registrar forma e quantidade; procurar orientação veterinária, sobretudo se houver fraqueza, palidez ou icterícia.' },
  { name: 'Macadâmia', risk: 'MODERADO', effect: 'Pode causar vômito, fraqueza, ataxia, tremores e hipertermia em cães.', action: 'Contatar o veterinário para avaliação; quadros mais intensos podem precisar de suporte.' },
  { name: 'Massa crua com fermento', risk: 'ALTO', effect: 'Pode expandir no estômago e produzir etanol, levando a distensão e intoxicação alcoólica.', action: 'Atendimento veterinário imediato.' },
  { name: 'Álcool / bebidas alcoólicas', risk: 'CRÍTICO', effect: 'Pode causar vômito, depressão do sistema nervoso central, incoordenação, hipotermia, dificuldade respiratória, coma e morte.', action: 'Atendimento veterinário imediato. Informar tipo, teor alcoólico, quantidade e horário.' },
  { name: 'Café / cafeína / energéticos / chá concentrado', risk: 'ALTO', effect: 'Metilxantinas podem causar agitação, taquicardia, hipertensão, arritmias, tremores, hipertermia e convulsões.', action: 'Contato veterinário rápido. Levar embalagem ou informar concentração, quantidade e horário.' },
  { name: 'Lúpulo / resíduos de fabricação de cerveja', risk: 'CRÍTICO', effect: 'Pode provocar hipertermia grave, taquicardia, ansiedade, ofegação e deterioração rápida.', action: 'Emergência veterinária. Não aguardar surgimento de sinais.' },
  { name: 'Excesso de sal / massa de sal / água muito salgada', risk: 'ALTO', effect: 'Pode causar vômito, diarreia, sede intensa, alterações neurológicas, tremores e convulsões.', action: 'Avaliação veterinária urgente. A correção de sódio deve ser controlada.' },
  { name: 'Alimentos mofados / lixo orgânico / composto', risk: 'ALTO', effect: 'Alguns fungos produzem micotoxinas tremorgênicas, com risco de vômito, agitação, tremores, hipertermia e convulsões.', action: 'Atendimento veterinário rápido. Se possível, levar foto ou informação sobre o material ingerido.' },
  { name: 'Noz-moscada em grande quantidade', risk: 'MODERADO', effect: 'Exposições relevantes podem provocar sinais gastrointestinais e neurológicos, como desorientação e tremores.', action: 'Contatar o veterinário com quantidade, forma do produto, peso e horário.' },
  { name: 'Abacate — caroço, casca e grande quantidade', risk: 'MODERADO', effect: 'Em cães, a polpa pode causar desconforto gastrointestinal em excesso; o caroço representa importante risco de obstrução.', action: 'Se houve ingestão do caroço, grande quantidade ou vômitos/dor abdominal, procurar avaliação veterinária.' },
  { name: 'Comestíveis com cannabis / THC', risk: 'ALTO', effect: 'Podem causar depressão, ataxia, hipersensibilidade, alterações cardíacas, hipotermia e incontinência; chocolate ou xilitol podem somar riscos.', action: 'Procurar atendimento veterinário e informar composição, quantidade e horário.' },
  { name: 'Cogumelos silvestres / desconhecidos', risk: 'CRÍTICO', effect: 'A toxicidade varia conforme a espécie e pode incluir sinais gastrointestinais, neurológicos, hepáticos ou renais graves.', action: 'Atendimento veterinário imediato. Fotografar o cogumelo e, se seguro, levar uma amostra separada.' },
  { name: 'Ossos cozidos / espinhas', risk: 'MODERADO', effect: 'Podem lascar e causar engasgo, lesões orais, perfuração ou obstrução gastrointestinal.', action: 'Não oferecer. Procurar avaliação se houver engasgo, vômitos, dor, sangue nas fezes ou dificuldade para evacuar.' },
  { name: 'Carne / ovos crus', risk: 'MODERADO', effect: 'Podem carregar bactérias patogênicas e aumentar risco gastrointestinal e zoonótico.', action: 'Evitar sem plano nutricional e manejo sanitário orientado pelo veterinário.' },
  { name: 'Alimentos muito gordurosos / frituras / restos de mesa', risk: 'MODERADO', effect: 'Podem causar vômito, diarreia e, em animais suscetíveis, pancreatite.', action: 'Evitar oferta. Procurar avaliação se surgirem vômitos persistentes, dor abdominal ou prostração.' },
  { name: 'Nozes, pecãs e outras oleaginosas em excesso', risk: 'MODERADO', effect: 'O alto teor de gordura pode causar desconforto gastrointestinal e pancreatite; produtos mofados acrescentam risco de micotoxinas.', action: 'Evitar oferta e conferir se o produto contém chocolate, xilitol, sal ou mofo.' },
]

const CAT_TOXINS = [
  { name: 'Cebola / alho / cebolinha / alho-poró', risk: 'ALTO', effect: 'Gatos são especialmente suscetíveis aos compostos oxidantes de Allium, com risco de hemólise e anemia; formas cozidas e em pó também importam.', action: 'Procurar orientação veterinária após ingestão e observar fraqueza, palidez, taquipneia ou icterícia.' },
  { name: 'Chocolate / cacau', risk: 'ALTO', effect: 'Metilxantinas podem causar vômito, agitação, taquicardia, arritmias, tremores e convulsões.', action: 'Informar tipo de chocolate, quantidade, peso do gato e horário ao veterinário.' },
  { name: 'Café / cafeína / energéticos / chá concentrado', risk: 'ALTO', effect: 'Cafeína e outras metilxantinas podem causar hiperatividade, taquicardia, tremores, hipertermia e convulsões.', action: 'Contato veterinário rápido; levar embalagem ou informar concentração e quantidade.' },
  { name: 'Álcool / bebidas alcoólicas', risk: 'CRÍTICO', effect: 'Pode causar depressão neurológica, incoordenação, hipotermia, dificuldade respiratória, coma e morte.', action: 'Atendimento veterinário imediato. Informar produto, teor alcoólico, quantidade e horário.' },
  { name: 'Massa crua com fermento', risk: 'ALTO', effect: 'Pode expandir no estômago e produzir etanol, causando distensão e intoxicação alcoólica.', action: 'Atendimento veterinário imediato.' },
  { name: 'Excesso de sal / alimentos extremamente salgados', risk: 'ALTO', effect: 'Pode provocar vômito, diarreia, sede intensa e alterações neurológicas, incluindo tremores e convulsões.', action: 'Avaliação veterinária urgente; alterações de sódio exigem correção controlada.' },
  { name: 'Alimentos mofados / lixo orgânico / composto', risk: 'ALTO', effect: 'Micotoxinas podem causar vômito, agitação, tremores, hipertermia e convulsões.', action: 'Atendimento veterinário rápido e, se possível, identificar o material ingerido.' },
  { name: 'Comestíveis com cannabis / THC', risk: 'ALTO', effect: 'Podem causar depressão, ataxia, hipersensibilidade, alterações cardíacas, hipotermia e incontinência.', action: 'Procurar atendimento veterinário e informar composição, quantidade e horário.' },
  { name: 'Cogumelos silvestres / desconhecidos', risk: 'CRÍTICO', effect: 'A toxicidade varia conforme a espécie e pode envolver trato gastrointestinal, sistema nervoso, fígado ou rins.', action: 'Atendimento veterinário imediato. Fotografar o cogumelo e, se seguro, levar uma amostra.' },
  { name: 'Ossos cozidos / espinhas', risk: 'MODERADO', effect: 'Podem causar engasgo, trauma oral, perfuração ou obstrução gastrointestinal.', action: 'Não oferecer. Procurar avaliação se houver engasgo, vômitos, dor ou dificuldade para evacuar.' },
  { name: 'Carne / ovos crus', risk: 'MODERADO', effect: 'Podem carregar bactérias patogênicas e aumentar risco gastrointestinal e zoonótico.', action: 'Evitar sem plano nutricional e manejo sanitário orientado pelo veterinário.' },
  { name: 'Peixe cru oferecido com frequência', risk: 'MODERADO', effect: 'Alguns peixes crus contêm tiaminase e dietas repetitivas podem contribuir para deficiência de tiamina, além do risco microbiológico.', action: 'Não usar como base rotineira da dieta sem formulação veterinária.' },
  { name: 'Fígado em excesso / dieta muito rica em fígado', risk: 'ALTO', effect: 'Uso crônico em excesso pode levar a hipervitaminose A, com alterações ósseas e articulares.', action: 'Evitar como alimento predominante; dieta caseira deve ser formulada por profissional.' },
  { name: 'Leite / creme / laticínios em excesso', risk: 'MODERADO', effect: 'Muitos gatos adultos digerem mal lactose, podendo apresentar diarreia, gases e desconforto gastrointestinal.', action: 'Evitar como rotina; água e dieta completa são opções mais adequadas.' },
  { name: 'Alimentos muito gordurosos / frituras / restos de mesa', risk: 'MODERADO', effect: 'Podem causar vômito, diarreia, ganho de peso e problemas gastrointestinais.', action: 'Evitar oferta e procurar avaliação se houver sinais persistentes.' },
  { name: 'Cascas, folhas e óleos cítricos concentrados', risk: 'MODERADO', effect: 'Óleos essenciais e ácido cítrico em exposições relevantes podem provocar irritação gastrointestinal e sinais sistêmicos.', action: 'Não oferecer produtos concentrados ou óleos essenciais; procurar orientação se houver exposição relevante.' },
  { name: 'Abacate — caroço, casca e grande quantidade', risk: 'MODERADO', effect: 'Pode causar desconforto gastrointestinal, e o caroço representa risco mecânico de obstrução.', action: 'Evitar caroço e casca; buscar avaliação se houver vômitos, dor ou suspeita de corpo estranho.' },
  { name: 'Uvas / passas', risk: 'MODERADO', effect: 'A toxicidade renal é bem documentada em cães; em gatos os relatos são raros e o risco é menos definido, por isso a oferta deve ser evitada por precaução.', action: 'Não oferecer. Em ingestão relevante, contatar o veterinário para avaliação individual.' },
  { name: 'Atum como dieta exclusiva / alimentação monótona', risk: 'MODERADO', effect: 'Não é uma dieta completa para uso exclusivo e prolongado; pode gerar desequilíbrios nutricionais.', action: 'Usar apenas como petisco eventual quando apropriado, e manter dieta felina completa e balanceada.' },
  { name: 'Ração de cães como dieta habitual', risk: 'ALTO', effect: 'Não atende de forma adequada às necessidades nutricionais específicas do gato quando usada como dieta principal por períodos prolongados.', action: 'Não usar como alimentação habitual; oferecer dieta completa formulada para felinos.' },
]

export function CanineNutritionFeature({ mode, patients, onAddTimelineEvent }: CanineNutritionFeatureProps) {
  const caninePatients = patients.filter(p => p.species.toLowerCase().includes('can'))
  if (mode === 'energy') return <EnergyCalculator patients={caninePatients} onAddTimelineEvent={onAddTimelineEvent} />
  if (mode === 'bcs') return <BCSCalculator patients={caninePatients} onAddTimelineEvent={onAddTimelineEvent} />
  if (mode === 'toxins') return <ToxicFoods />
  return <HomeDiet patients={caninePatients} onAddTimelineEvent={onAddTimelineEvent} />
}

function EnergyCalculator({ patients, onAddTimelineEvent }: Pick<CanineNutritionFeatureProps, 'onAddTimelineEvent'> & { patients: ClinicalPatientLite[] }) {
  const [patientId, setPatientId] = useState('')
  const [manualPatientName, setManualPatientName] = useState('')
  const [weight, setWeight] = useState('')
  const [stage, setStage] = useState('neutered')
  const [factor, setFactor] = useState(CANINE_FACTORS.neutered.default.toString())

  const rer = Number(weight) > 0 ? 70 * Math.pow(Number(weight), 0.75) : 0
  const mer = rer * (Number(factor) || 0)
  const stageInfo = CANINE_FACTORS[stage]

  const changeStage = (value: string) => {
    setStage(value)
    setFactor(CANINE_FACTORS[value].default.toString())
  }

  const save = () => {
    if (!patientId || !rer) return
    onAddTimelineEvent?.(patientId, {
      id: `nutrition-${Date.now()}`,
      date: todayLocalIso(),
      type: 'nutricao',
      title: `Necessidade energética — RER ${rer.toFixed(0)} / MER ${mer.toFixed(0)} kcal/dia`,
      weightKg: Number(weight),
      notes: `${stageInfo.label}; fator utilizado ${Number(factor).toFixed(2)}× RER. Estimativa inicial — ajustar pela resposta de peso/ECC.`,
    })
  }

  return (
    <div className="max-w-5xl mx-auto"><div className={cardClass}>
      <ModuleHeader icon={<Calculator className="w-6 h-6" />} title="Nutrição Canina — RER & MER Personalizada" subtitle="Exclusivo para cães • necessidade energética por peso e fase fisiológica" />
      <SafetyBanner>RER = 70 × peso(kg)^0,75. Os fatores de MER são estimativas iniciais da AAHA e devem ser ajustados pelo acompanhamento de peso, ECC, massa muscular, atividade, doença e ingestão real.</SafetyBanner>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <div className="space-y-4">
          <PatientSelector patients={patients} value={patientId} onChange={setPatientId} manualName={manualPatientName} onManualNameChange={setManualPatientName} />
          <div><label className={labelClass}>Peso atual (kg)</label><input type="number" min="0.1" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Condição fisiológica</label><select value={stage} onChange={e => changeStage(e.target.value)} className={inputClass}>{Object.entries(CANINE_FACTORS).map(([key, x]) => <option value={key} key={key}>{x.label}</option>)}</select></div>
          <div><label className={labelClass}>Fator MER utilizado</label><input type="number" step="0.1" min="0.5" max="12" value={factor} onChange={e => setFactor(e.target.value)} className={inputClass} /><p className="text-[10px] text-stone-500 mt-1">Faixa de referência: {stageInfo.min === stageInfo.max ? stageInfo.min : `${stageInfo.min}–${stageInfo.max}`} × RER. {stageInfo.note || ''}</p></div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5 text-center"><div className="text-[10px] font-bold text-pink-600 uppercase">RER</div><div className="text-2xl font-extrabold text-pink-950">{rer ? rer.toFixed(0) : '—'}</div><div className="text-[10px] text-stone-500">kcal/dia</div></div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center"><div className="text-[10px] font-bold text-emerald-700 uppercase">MER estimada</div><div className="text-2xl font-extrabold text-emerald-900">{mer ? mer.toFixed(0) : '—'}</div><div className="text-[10px] text-stone-500">kcal/dia</div></div>
          </div>
          <div className="bg-white border border-pink-200 rounded-2xl p-4 text-xs text-stone-700 leading-relaxed"><strong>Interpretação:</strong> comece pela estimativa e reavalie a ingestão com peso e ECC seriados. Pacientes oncológicos, cardiopatas, renais, gastrointestinais ou com perda muscular podem precisar de plano individualizado.</div>
          <button type="button" disabled={!patientId || !rer} onClick={save} className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white py-2.5 rounded-xl text-xs font-bold">Registrar avaliação nutricional</button>
        </div>
      </div>
    </div></div>
  )
}

function BCSCalculator({ patients, onAddTimelineEvent }: Pick<CanineNutritionFeatureProps, 'onAddTimelineEvent'> & { patients: ClinicalPatientLite[] }) {
  const [patientId, setPatientId] = useState('')
  const [manualPatientName, setManualPatientName] = useState('')
  const [weight, setWeight] = useState('')
  const [bcs, setBcs] = useState(5)
  const [maintenanceFactor, setMaintenanceFactor] = useState('1.4')
  const w = Number(weight)

  const estimatedIdeal = useMemo(() => {
    if (!w) return 0
    if (bcs > 5) return w / (1 + (bcs - 5) * 0.10)
    if (bcs < 4) return w / Math.max(0.5, 1 - (4 - bcs) * 0.10)
    return w
  }, [w, bcs])
  const currentRer = w ? 70 * Math.pow(w, 0.75) : 0
  const estimatedMaintenance = currentRer * Number(maintenanceFactor || 0)
  const targetRer = estimatedIdeal ? 70 * Math.pow(estimatedIdeal, 0.75) : 0
  const deficit = Math.max(0, estimatedMaintenance - targetRer)

  const save = () => {
    if (!patientId || !w) return
    onAddTimelineEvent?.(patientId, {
      id: `bcs-${Date.now()}`,
      date: todayLocalIso(),
      type: 'nutricao',
      title: `ECC ${bcs}/9 — avaliação de condição corporal`,
      weightKg: w,
      notes: `Peso ideal estimado: ${estimatedIdeal.toFixed(1)} kg. ${bcs > 5 ? `RER do peso-alvo: ${targetRer.toFixed(0)} kcal/dia; déficit estimado vs manutenção atual: ${deficit.toFixed(0)} kcal/dia.` : 'Sem plano automático de restrição calórica.'}`,
    })
  }

  return (
    <div className="max-w-5xl mx-auto"><div className={cardClass}>
      <ModuleHeader icon={<Weight className="w-6 h-6" />} title="Nutrição Canina — ECC 1 a 9 & Meta de Peso" subtitle="Escala WSAVA, estimativa de peso-alvo e ponto de partida calórico para emagrecimento" />
      <SafetyBanner>A estimativa de peso ideal usa aproximadamente 10% de diferença por ponto de ECC acima/abaixo da faixa ideal e serve apenas como ponto de partida. Em cães obesos, a meta de perda costuma ser acompanhada semanalmente e ajustada pela resposta clínica.</SafetyBanner>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <div className="space-y-4">
          <PatientSelector patients={patients} value={patientId} onChange={setPatientId} manualName={manualPatientName} onManualNameChange={setManualPatientName} />
          <div><label className={labelClass}>Peso atual (kg)</label><input type="number" min="0.1" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>ECC — 1 a 9</label><div className="grid grid-cols-9 gap-1">{Array.from({ length: 9 }, (_, i) => i + 1).map(score => <button key={score} type="button" onClick={() => setBcs(score)} className={`py-2 rounded-lg text-xs font-extrabold border ${bcs === score ? 'bg-pink-500 text-white border-pink-500' : 'bg-white border-pink-200 text-pink-800'}`}>{score}</button>)}</div></div>
          <div className="bg-pink-50/60 border border-pink-200 rounded-xl p-3 text-xs text-stone-700 leading-relaxed"><strong>ECC {bcs}/9:</strong> {BCS_TEXT[bcs]}</div>
          <div><label className={labelClass}>Fator de manutenção atual para comparar déficit</label><input type="number" step="0.1" min="0.8" max="3" value={maintenanceFactor} onChange={e => setMaintenanceFactor(e.target.value)} className={inputClass} /></div>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 text-center"><div className="text-[10px] uppercase font-bold text-pink-600">Peso ideal estimado</div><div className="text-2xl font-extrabold text-pink-950">{estimatedIdeal ? `${estimatedIdeal.toFixed(1)} kg` : '—'}</div></div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center"><div className="text-[10px] uppercase font-bold text-emerald-700">Meta semanal</div><div className="text-lg font-extrabold text-emerald-900">{w && bcs > 5 ? `${(w * 0.01).toFixed(2)}–${(w * 0.02).toFixed(2)} kg` : '—'}</div><div className="text-[10px] text-stone-500">≈1–2% do peso/semana em programa de redução</div></div>
          </div>
          {bcs > 5 ? <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 space-y-1"><div><strong>Manutenção estimada atual:</strong> {estimatedMaintenance.toFixed(0)} kcal/dia</div><div><strong>Ponto de partida de perda:</strong> RER do peso-alvo ≈ {targetRer.toFixed(0)} kcal/dia</div><div><strong>Déficit estimado:</strong> {deficit.toFixed(0)} kcal/dia ({estimatedMaintenance ? ((deficit / estimatedMaintenance) * 100).toFixed(0) : 0}%)</div><p className="text-[10px] pt-1">Recalcular conforme o cão emagrece e interromper/reavaliar se houver perda excessiva, fraqueza ou perda de massa muscular.</p></div> : <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900">ECC na faixa ideal ou abaixo dela: o módulo não propõe déficit calórico automático.</div>}
          <button type="button" disabled={!patientId || !w} onClick={save} className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white py-2.5 rounded-xl text-xs font-bold">Registrar ECC e meta</button>
        </div>
      </div>
    </div></div>
  )
}

function ToxicFoods() {
  type CustomToxin = {
    id: string
    name: string
    risk: 'CRÍTICO' | 'ALTO' | 'MODERADO'
    effect: string
    action: string
  }

  type SpeciesKey = 'dog' | 'cat'

  const dogStorageKey = 'vet_custom_dog_toxins_v1'
  const catStorageKey = 'vet_custom_cat_toxins_v1'

  const loadCustom = (key: string): CustomToxin[] => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  }

  const [dogQuery, setDogQuery] = useState('')
  const [catQuery, setCatQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formSpecies, setFormSpecies] = useState<SpeciesKey>('dog')
  const [copiedSpecies, setCopiedSpecies] = useState<SpeciesKey | null>(null)

  const [customDogFoods, setCustomDogFoods] = useState<CustomToxin[]>(() => loadCustom(dogStorageKey))
  const [customCatFoods, setCustomCatFoods] = useState<CustomToxin[]>(() => loadCustom(catStorageKey))

  const [newName, setNewName] = useState('')
  const [newRisk, setNewRisk] = useState<'CRÍTICO' | 'ALTO' | 'MODERADO'>('ALTO')
  const [newEffect, setNewEffect] = useState('')
  const [newAction, setNewAction] = useState('')

  const dogFoods = useMemo(() => [
    ...DOG_TOXINS.map((item, index) => ({ ...item, id: `dog-default-${index}`, custom: false })),
    ...customDogFoods.map(item => ({ ...item, custom: true })),
  ], [customDogFoods])

  const catFoods = useMemo(() => [
    ...CAT_TOXINS.map((item, index) => ({ ...item, id: `cat-default-${index}`, custom: false })),
    ...customCatFoods.map(item => ({ ...item, custom: true })),
  ], [customCatFoods])

  const filterFoods = (foods: typeof dogFoods, query: string) => foods.filter(item =>
    `${item.name} ${item.risk} ${item.effect} ${item.action}`.toLowerCase().includes(query.trim().toLowerCase())
  )

  const filteredDogs = filterFoods(dogFoods, dogQuery)
  const filteredCats = filterFoods(catFoods, catQuery)

  const persistCustomFoods = (species: SpeciesKey, next: CustomToxin[]) => {
    if (species === 'dog') {
      setCustomDogFoods(next)
      if (typeof window !== 'undefined') localStorage.setItem(dogStorageKey, JSON.stringify(next))
    } else {
      setCustomCatFoods(next)
      if (typeof window !== 'undefined') localStorage.setItem(catStorageKey, JSON.stringify(next))
    }
  }

  const openAddForm = (species: SpeciesKey) => {
    setFormSpecies(species)
    setNewName('')
    setNewRisk('ALTO')
    setNewEffect('')
    setNewAction('')
    setShowForm(true)
  }

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newEffect.trim() || !newAction.trim()) return

    const foods = formSpecies === 'dog' ? dogFoods : catFoods
    if (foods.some(item => item.name.trim().toLowerCase() === newName.trim().toLowerCase())) {
      alert('Esse alimento já está cadastrado nessa lista.')
      return
    }

    const newItem: CustomToxin = {
      id: `custom-${formSpecies}-toxin-${Date.now()}`,
      name: newName.trim(),
      risk: newRisk,
      effect: newEffect.trim(),
      action: newAction.trim(),
    }

    persistCustomFoods(
      formSpecies,
      formSpecies === 'dog' ? [...customDogFoods, newItem] : [...customCatFoods, newItem]
    )

    setNewName('')
    setNewRisk('ALTO')
    setNewEffect('')
    setNewAction('')
    setShowForm(false)
  }

  const riskClass = (risk: string) => risk === 'CRÍTICO'
    ? 'bg-rose-100 text-rose-800 border-rose-200'
    : risk === 'ALTO'
      ? 'bg-orange-100 text-orange-800 border-orange-200'
      : 'bg-amber-100 text-amber-800 border-amber-200'

  const buildTutorText = (species: SpeciesKey) => {
    const label = species === 'dog' ? 'CÃES' : 'GATOS'
    const foods = species === 'dog' ? dogFoods : catFoods

    return [
      `ALIMENTOS / PRODUTOS A EVITAR — ${label}`,
      '',
      ...foods.map(item => `• ${item.name} — ${item.risk}\n  ${item.effect}`),
      '',
      'ATENÇÃO: em caso de ingestão acidental, informe ao médico-veterinário o alimento/produto, a quantidade aproximada, o horário e o peso do animal. Não provoque vômito e não ofereça “antídotos caseiros” sem orientação profissional.',
      '',
      'Material educativo. O risco real depende da substância, dose, concentração, peso, tempo desde a ingestão e estado clínico do animal.',
    ].join('\n')
  }

  const copyTutorText = async (species: SpeciesKey) => {
    const tutorText = buildTutorText(species)

    try {
      await navigator.clipboard.writeText(tutorText)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = tutorText
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    setCopiedSpecies(species)
    window.setTimeout(() => setCopiedSpecies(null), 1800)
  }

  const openWhatsApp = (species: SpeciesKey) => {
    const tutorText = buildTutorText(species)
    window.open(`https://wa.me/?text=${encodeURIComponent(tutorText)}`, '_blank', 'noopener,noreferrer')
  }

  const escapeHtml = (value: string) => value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

  const printTutorList = (species: SpeciesKey) => {
    const label = species === 'dog' ? 'Cães' : 'Gatos'
    const foods = species === 'dog' ? dogFoods : catFoods
    const printWindow = window.open('', '_blank', 'width=980,height=760')

    if (!printWindow) {
      alert('O navegador bloqueou a janela de impressão. Permita pop-ups para este site e tente novamente.')
      return
    }

    const rows = foods.map(item => `
      <tr>
        <td><strong>${escapeHtml(item.name)}</strong></td>
        <td class="risk">${escapeHtml(item.risk)}</td>
        <td>${escapeHtml(item.effect)}</td>
      </tr>
    `).join('')

    printWindow.document.write(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <title>Alimentos a evitar — ${label}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #3f1830; margin: 28px; }
            h1 { font-size: 22px; margin: 0 0 4px; }
            .subtitle { color: #666; font-size: 12px; margin-bottom: 18px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th, td { border: 1px solid #ead6df; padding: 8px; vertical-align: top; text-align: left; }
            th { background: #fff1f6; }
            .risk { white-space: nowrap; font-weight: 700; }
            .notice { margin-top: 18px; border: 1px solid #f1b7cc; background: #fff6f9; padding: 12px; border-radius: 8px; font-size: 11px; line-height: 1.45; }
            @media print { body { margin: 12mm; } }
          </style>
        </head>
        <body>
          <h1>Alimentos / produtos a evitar — ${label}</h1>
          <div class="subtitle">Material educativo para tutor • VetWorkspace — Dra. Beatriz</div>
          <table>
            <thead><tr><th>Alimento / produto</th><th>Risco</th><th>Por que evitar</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="notice">
            <strong>Em caso de ingestão acidental:</strong> entre em contato com um médico-veterinário e informe produto/alimento, quantidade aproximada, horário e peso do animal. Não provoque vômito nem ofereça soluções caseiras sem orientação profissional.
          </div>
          <script>window.onload = () => { window.print(); }</script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  const renderFoodSection = ({
    species,
    title,
    subtitle,
    foods,
    filtered,
    query,
    setQuery,
  }: {
    species: SpeciesKey
    title: string
    subtitle: string
    foods: typeof dogFoods
    filtered: typeof dogFoods
    query: string
    setQuery: (value: string) => void
  }) => (
    <section className="bg-white border border-pink-200 rounded-3xl p-5 md:p-6 space-y-5">
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{species === 'dog' ? '🐶' : '🐱'}</span>
            <div>
              <h2 className="text-lg font-extrabold text-pink-950">{title}</h2>
              <p className="text-[11px] text-stone-500 mt-0.5">{subtitle}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 text-[10px]">
            <span className="font-bold text-stone-500">{foods.length} itens cadastrados</span>
            <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-800 font-bold">CRÍTICO</span>
            <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-800 font-bold">ALTO</span>
            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">MODERADO</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => copyTutorText(species)} className="bg-white hover:bg-pink-50 border border-pink-200 text-pink-800 px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
            {copiedSpecies === species ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedSpecies === species ? 'Copiado!' : 'Copiar para tutor'}
          </button>
          <button type="button" onClick={() => openWhatsApp(species)} className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
            <Send className="w-4 h-4" /> Abrir WhatsApp
          </button>
          <button type="button" onClick={() => printTutorList(species)} className="bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
            <Printer className="w-4 h-4" /> Imprimir / PDF
          </button>
          <button type="button" onClick={() => openAddForm(species)} className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Adicionar alimento
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-pink-400" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={`${inputClass} pl-10`}
          placeholder={species === 'dog' ? 'Buscar xilitol, chocolate, uva, cebola, café...' : 'Buscar cebola, chocolate, café, peixe cru, fígado...'}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-pink-50/50 border border-dashed border-pink-200 rounded-2xl py-10 text-center text-xs text-stone-500">
          Nenhum item encontrado. Limpe a busca ou cadastre um novo alimento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(item => (
            <div key={item.id} className="bg-white border border-pink-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-sm text-pink-950">{item.name}</h3>
                  {item.custom && (
                    <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-pink-50 border border-pink-200 text-pink-700">
                      PERSONALIZADO
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-extrabold px-2 py-1 rounded-full border ${riskClass(item.risk)}`}>{item.risk}</span>
                  {item.custom && (
                    <button
                      type="button"
                      title="Excluir alimento personalizado"
                      onClick={() => {
                        if (!confirm('Excluir este alimento personalizado?')) return
                        const currentCustom = species === 'dog' ? customDogFoods : customCatFoods
                        persistCustomFoods(species, currentCustom.filter(x => x.id !== item.id))
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed"><strong>Efeito / risco:</strong> {item.effect}</p>
              <div className="bg-pink-50 rounded-xl p-3 text-[11px] text-pink-900 leading-relaxed">
                <strong>Orientação:</strong> {item.action}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className={cardClass}>
        <ModuleHeader
          icon={<AlertTriangle className="w-6 h-6" />}
          title="Consulta Rápida — Alimentos Tóxicos / Proibidos"
          subtitle="Listas separadas para cães e gatos + material pronto para tutor"
        />

        <SafetyBanner>
          Em suspeita de intoxicação, o risco depende de alimento/produto, quantidade, concentração, peso, tempo desde a ingestão e estado clínico. Não provoque vômito nem administre “antídotos caseiros” sem orientação veterinária. Itens classificados como “evitar” também podem representar risco mecânico, microbiológico ou nutricional, e não necessariamente intoxicação aguda.
        </SafetyBanner>

        <div className="mt-5 space-y-7">
          {renderFoodSection({
            species: 'dog',
            title: 'Alimentos tóxicos / proibidos para cães',
            subtitle: '20 itens-base de consulta rápida, além dos itens personalizados adicionados pela Beatriz.',
            foods: dogFoods,
            filtered: filteredDogs,
            query: dogQuery,
            setQuery: setDogQuery,
          })}

          {renderFoodSection({
            species: 'cat',
            title: 'Alimentos tóxicos / proibidos para gatos',
            subtitle: '20 itens-base específicos para felinos. A lista não replica automaticamente riscos exclusivos de cães, como xilitol e macadâmia.',
            foods: catFoods,
            filtered: filteredCats,
            query: catQuery,
            setQuery: setCatQuery,
          })}
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 bg-stone-950/35 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={handleAddFood} className="w-full max-w-2xl bg-white border border-pink-200 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-pink-950">Adicionar alimento — {formSpecies === 'dog' ? 'Cães' : 'Gatos'}</h3>
                  <p className="text-[11px] text-stone-500 mt-1">O item fica salvo neste navegador e entra também no material de copiar, WhatsApp e impressão.</p>
                </div>
                <button type="button" onClick={() => setShowForm(false)} className="p-2 rounded-xl text-stone-400 hover:bg-stone-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className={labelClass}>Alimento / produto</label>
                  <input value={newName} onChange={e => setNewName(e.target.value)} className={inputClass} placeholder="Nome do alimento ou produto" required />
                </div>
                <div>
                  <label className={labelClass}>Nível de risco</label>
                  <select value={newRisk} onChange={e => setNewRisk(e.target.value as any)} className={inputClass}>
                    <option value="CRÍTICO">CRÍTICO</option>
                    <option value="ALTO">ALTO</option>
                    <option value="MODERADO">MODERADO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Toxicidade / principais riscos</label>
                <textarea rows={3} value={newEffect} onChange={e => setNewEffect(e.target.value)} className={inputClass} placeholder="Descreva os principais riscos e sinais..." required />
              </div>

              <div>
                <label className={labelClass}>Orientação inicial</label>
                <textarea rows={3} value={newAction} onChange={e => setNewAction(e.target.value)} className={inputClass} placeholder="O que o tutor / veterinário deve observar ou fazer..." required />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Save className="w-4 h-4" /> Salvar alimento
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-white border border-stone-200 text-stone-600 px-4 py-2.5 rounded-xl text-xs font-bold">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

function HomeDiet({ patients, onAddTimelineEvent }: Pick<CanineNutritionFeatureProps, 'onAddTimelineEvent'> & { patients: ClinicalPatientLite[] }) {
  const [patientId, setPatientId] = useState('')
  const [manualPatientName, setManualPatientName] = useState('')
  const [dietType, setDietType] = useState<'cozida' | 'crua'>('cozida')
  const [protein, setProtein] = useState('')
  const [carb, setCarb] = useState('')
  const [veg, setVeg] = useState('')
  const [fat, setFat] = useState('')
  const [other, setOther] = useState('')
  const [calcium, setCalcium] = useState('')
  const [phosphorus, setPhosphorus] = useState('')
  const [cmv, setCmv] = useState(false)
  const [formulaNotes, setFormulaNotes] = useState('')

  const amounts = [Number(protein) || 0, Number(carb) || 0, Number(veg) || 0, Number(fat) || 0, Number(other) || 0]
  const total = amounts.reduce((a, b) => a + b, 0)
  const ratio = Number(calcium) > 0 && Number(phosphorus) > 0 ? Number(calcium) / Number(phosphorus) : 0
  const pct = (v: number) => total ? (v / total) * 100 : 0

  const save = () => {
    if (!patientId || !total) return
    onAddTimelineEvent?.(patientId, {
      id: `diet-${Date.now()}`,
      date: todayLocalIso(),
      type: 'nutricao',
      title: `Dieta caseira ${dietType} — registro de composição`,
      notes: `Total ${total.toFixed(0)} g: proteína ${pct(amounts[0]).toFixed(1)}%, carboidrato ${pct(amounts[1]).toFixed(1)}%, vegetais/fibras ${pct(amounts[2]).toFixed(1)}%, gordura ${pct(amounts[3]).toFixed(1)}%, outros ${pct(amounts[4]).toFixed(1)}%. CMV: ${cmv ? 'informado' : 'NÃO informado'}. Ca:P: ${ratio ? `${ratio.toFixed(2)}:1` : 'não calculada'}. ${formulaNotes}`,
    })
  }

  return (
    <div className="max-w-5xl mx-auto"><div className={cardClass}>
      <ModuleHeader icon={<Utensils className="w-6 h-6" />} title="Nutrição Canina — Dieta Caseira Cozida/Crua" subtitle="Registro de proporções, suplementação CMV e relação cálcio:fósforo" />
      <SafetyBanner>A maioria das receitas caseiras não formuladas é nutricionalmente incompleta. O módulo confere proporções e documentação, mas não “balanceia” micronutrientes sozinho. Receita terapêutica deve ser formulada/revisada por nutricionista veterinário e seguida exatamente.</SafetyBanner>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <div className="space-y-4">
          <PatientSelector patients={patients} value={patientId} onChange={setPatientId} manualName={manualPatientName} onManualNameChange={setManualPatientName} />
          <div><label className={labelClass}>Tipo</label><select value={dietType} onChange={e => setDietType(e.target.value as any)} className={inputClass}><option value="cozida">Cozida</option><option value="crua">Crua</option></select></div>
          <div className="grid grid-cols-2 gap-2">{[['Proteína animal (g)', protein, setProtein], ['Carboidratos (g)', carb, setCarb], ['Vegetais/fibras (g)', veg, setVeg], ['Gorduras/óleos (g)', fat, setFat], ['Outros ingredientes (g)', other, setOther]].map(([label, value, setter]: any) => <div key={label}><label className={labelClass}>{label}</label><input type="number" min="0" step="1" value={value} onChange={e => setter(e.target.value)} className={inputClass} /></div>)}</div>
          <label className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold ${cmv ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'}`}><input type="checkbox" checked={cmv} onChange={e => setCmv(e.target.checked)} className="accent-pink-500" /> Suplemento minero-vitamínico (CMV) específico da formulação está incluído</label>
          <div className="grid grid-cols-2 gap-2"><div><label className={labelClass}>Cálcio total informado (mg)</label><input type="number" min="0" value={calcium} onChange={e => setCalcium(e.target.value)} className={inputClass} /></div><div><label className={labelClass}>Fósforo total informado (mg)</label><input type="number" min="0" value={phosphorus} onChange={e => setPhosphorus(e.target.value)} className={inputClass} /></div></div>
          <div><label className={labelClass}>Observações da formulação</label><textarea rows={3} value={formulaNotes} onChange={e => setFormulaNotes(e.target.value)} className={inputClass} placeholder="Fonte/receita, suplemento, kcal, restrições..." /></div>
        </div>
        <div className="space-y-3">
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4"><div className="text-[10px] font-bold uppercase text-pink-600">Peso total registrado</div><div className="text-2xl font-extrabold text-pink-950">{total ? `${total.toFixed(0)} g` : '—'}</div></div>
          {total > 0 && <div className="grid grid-cols-2 gap-2 text-xs">{[['Proteína', amounts[0]], ['Carboidrato', amounts[1]], ['Vegetais/fibras', amounts[2]], ['Gordura', amounts[3]], ['Outros', amounts[4]]].map(([name, value]: any) => <div key={name} className="bg-white border border-pink-100 rounded-xl p-3"><strong>{name}</strong><div className="text-pink-700 font-extrabold">{pct(value).toFixed(1)}%</div></div>)}</div>}
          <div className={`border rounded-2xl p-4 text-xs ${ratio ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-stone-50 border-stone-200 text-stone-600'}`}><strong>Relação Ca:P:</strong> {ratio ? `${ratio.toFixed(2)} : 1` : 'informe cálcio e fósforo para calcular'}. <span className="block text-[10px] mt-1">A relação isolada não garante adequação: comparar com a formulação completa, fase de vida e recomendação do nutricionista.</span></div>
          {!cmv && <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 text-xs font-bold text-rose-900">⚠️ CMV não marcado: dieta caseira sem suplementação mineral/vitamínica formulada apresenta alto risco de desequilíbrio nutricional.</div>}
          {dietType === 'crua' && <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900">⚠️ Dietas cruas acrescentam risco microbiológico para o cão e para pessoas que manipulam alimento/fezes, especialmente crianças, idosos, gestantes e imunossuprimidos.</div>}
          <button type="button" disabled={!patientId || !total} onClick={save} className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white py-2.5 rounded-xl text-xs font-bold">Registrar dieta no prontuário</button>
        </div>
      </div>
    </div></div>
  )
}

export function GlobalPatientSearch({ patients, onSelectPatient }: { patients: ClinicalPatientLite[]; onSelectPatient: (id: string) => void }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return patients.filter(p => `${p.petName} ${p.tutor} ${p.species} ${p.neoplasia || ''}`.toLowerCase().includes(q)).slice(0, 8)
  }, [patients, query])

  return (
    <div className="relative w-72 max-w-[28vw]">
      <Search className="absolute left-3 top-2.5 w-4 h-4 text-pink-400 z-10" />
      <input value={query} onFocus={() => setOpen(true)} onChange={e => { setQuery(e.target.value); setOpen(true) }} className="w-full bg-pink-50/70 border border-pink-200 rounded-xl pl-9 pr-3 py-2 text-[11px] text-pink-950 focus:outline-none focus:border-pink-400" placeholder="Buscar pet, tutor, espécie ou neoplasia..." />
      {open && query && <div className="absolute top-11 left-0 right-0 bg-white border border-pink-200 rounded-2xl shadow-xl p-2 z-50 max-h-72 overflow-y-auto">{results.length === 0 ? <div className="p-3 text-[11px] text-stone-400 text-center">Nenhum paciente encontrado.</div> : results.map(p => <button key={p.id} type="button" onClick={() => { onSelectPatient(p.id); setOpen(false); setQuery('') }} className="w-full text-left p-2.5 rounded-xl hover:bg-pink-50 transition"><div className="text-xs font-extrabold text-pink-950">🐾 {p.petName}</div><div className="text-[10px] text-stone-500">{p.tutor} • {p.species}{p.neoplasia ? ` • ${p.neoplasia}` : ''}</div></button>)}</div>}
    </div>
  )
}

export function ClinicalDashboard({
  patients,
  events,
  tasks,
  onOpenPatient,
  onResolveAlert,
  onToggleTask,
}: {
  patients: ClinicalPatientLite[]
  events: CalendarEventLite[]
  tasks: TaskLite[]
  onOpenPatient: (id: string) => void
  onResolveAlert?: (patientId: string, alertId: string) => void
  onToggleTask: (taskId: string) => void
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const horizon = new Date(today)
  horizon.setDate(horizon.getDate() + 7)

  const inNextSeven = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number)
    const dt = new Date(y, m - 1, d)
    return dt >= today && dt <= horizon
  }

  const inferredCategory = (e: CalendarEventLite) => {
    if (e.category) return e.category
    if (e.clinicName || e.clinicId) return 'work'
    const text = `${e.title} ${e.description}`.toLowerCase()
    if (text.includes('retorno') || text.includes('reavalia')) return 'return'
    return 'other'
  }

  const returns = events
    .filter(e => inNextSeven(e.dateKey) && inferredCategory(e) === 'return')
    .sort((a, b) => {
      const dateCompare = a.dateKey.localeCompare(b.dateKey)
      if (dateCompare !== 0) return dateCompare
      if (a.time && b.time) return a.time.localeCompare(b.time)
      if (a.time) return -1
      if (b.time) return 1
      return a.title.localeCompare(b.title, 'pt-BR')
    })

  const workShifts = events
    .filter(e => inNextSeven(e.dateKey) && inferredCategory(e) === 'work')
    .sort((a, b) => {
      const dateCompare = a.dateKey.localeCompare(b.dateKey)
      if (dateCompare !== 0) return dateCompare
      if (a.time && b.time) return a.time.localeCompare(b.time)
      if (a.time) return -1
      if (b.time) return 1
      return a.title.localeCompare(b.title, 'pt-BR')
    })

  const pendingTasks = tasks.filter(t => !t.completed)
  const dashboardTasks = pendingTasks

  return (
    <div className="bg-white/95 border border-pink-100 rounded-3xl shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-pink-500">Visão dos próximos dias</div>
          <h2 className="text-lg font-extrabold text-pink-950">Dashboard Essencial</h2>
        </div>
        <span className="text-[10px] bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-bold">Atualização automática</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-violet-50/60 border border-violet-200 rounded-2xl p-5 min-h-[260px]">
          <div className="flex items-center justify-between gap-3">
            <div className="font-extrabold text-sm text-violet-950 flex items-center gap-2">
              <CheckSquare className="w-4 h-4" /> Lista de Tarefas
            </div>
            <span className="text-[10px] font-extrabold bg-white border border-violet-200 text-violet-700 px-2.5 py-1 rounded-full">
              {pendingTasks.length} pendente{pendingTasks.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="mt-4 space-y-2 max-h-72 overflow-y-auto pr-1">
            {dashboardTasks.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center bg-white/70 border border-dashed border-violet-200 rounded-2xl px-5">
                <CheckCircle2 className="w-7 h-7 text-emerald-500 mb-2" />
                <p className="text-xs font-bold text-stone-600">Tudo concluído por aqui.</p>
                <p className="text-[10px] text-stone-400 mt-1">Quando uma tarefa for concluída, ela sai automaticamente desta lista.</p>
              </div>
            ) : (
              dashboardTasks.map((task, idx) => (
                <label
                  key={task.id}
                  className="bg-white border border-violet-100 rounded-xl p-3 flex items-start gap-3 shadow-2xs cursor-pointer transition hover:border-violet-300 hover:bg-violet-50/40"
                >
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => onToggleTask(task.id)}
                    className="w-5 h-5 mt-0.5 accent-pink-500 cursor-pointer shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold leading-relaxed text-pink-950">
                      {task.text}
                    </div>
                    {task.category && (
                      <div className="text-[9px] font-bold uppercase tracking-wide text-violet-600 mt-1">
                        {task.category}
                      </div>
                    )}
                  </div>
                </label>
              ))
            )}
          </div>

          {dashboardTasks.length > 0 && (
            <div className="mt-3 pt-3 border-t border-violet-200/70">
              <span className="text-[9px] text-stone-400">Marcou como concluída? Ela sai automaticamente deste painel.</span>
            </div>
          )}
        </div>

        <div className="bg-sky-50/60 border border-sky-200 rounded-2xl p-5 min-h-[260px]">
          <div className="font-extrabold text-sm text-sky-900 flex items-center gap-2">
            <Stethoscope className="w-4 h-4" /> Retornos agendados ({returns.length})
          </div>
          <div className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-1">
            {returns.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-center bg-white/70 border border-dashed border-sky-200 rounded-2xl px-5">
                <p className="text-[11px] text-stone-400">Nenhum retorno de paciente nos próximos 7 dias.</p>
              </div>
            ) : (
              returns.map((e, idx) => (
                <div key={`${e.dateKey}-${idx}`} className="bg-white border border-sky-100 rounded-xl p-3">
                  <div className="text-xs font-bold text-pink-950">{e.title}</div>
                  <div className="text-[10px] text-sky-700 mt-0.5">{formatLocalDate(e.dateKey)} {e.time ? `• ${e.time}` : ''}</div>
                  {e.description && <div className="text-[10px] text-stone-500 mt-1 line-clamp-2">{e.description}</div>}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="md:col-span-2 bg-stone-50 border border-stone-200 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="font-extrabold text-sm text-stone-900 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" /> Trabalho / Plantões
            </div>
            <span className="text-[10px] font-extrabold bg-white border border-stone-200 text-stone-600 px-2.5 py-1 rounded-full">
              {workShifts.length} nos próximos 7 dias
            </span>
          </div>

          {workShifts.length === 0 ? (
            <div className="mt-4 py-8 text-center bg-white/70 border border-dashed border-stone-200 rounded-2xl">
              <p className="text-[11px] text-stone-400">Nenhum trabalho/plantão nos próximos 7 dias.</p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
              {workShifts.map((e, idx) => (
                <div
                  key={`${e.dateKey}-${e.time}-${idx}`}
                  className="bg-white border border-stone-200 rounded-xl p-3.5 border-l-4 shadow-2xs"
                  style={{ borderLeftColor: e.clinicColor || '#111827' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: e.clinicColor || '#111827' }} />
                    <div className="text-xs font-extrabold text-pink-950 truncate">{e.clinicName || e.title}</div>
                  </div>
                  <div className="text-[11px] font-bold text-stone-700 mt-2">
                    {formatLocalDate(e.dateKey)} {e.time ? `• ${e.time}` : ''}
                  </div>
                  {e.clinicName && e.title && e.title !== e.clinicName && (
                    <div className="text-[10px] text-stone-500 mt-1 line-clamp-2">{e.title}</div>
                  )}
                  {e.description && (
                    <div className="text-[10px] text-stone-400 mt-1 line-clamp-2">{e.description}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function PatientTimeline({
  events,
  legacyEvolutions = [],
  onAddEvent,
}: {
  events: PatientTimelineEvent[]
  legacyEvolutions?: Array<{ id: string; date: string; weight: string; temperature: string; notes: string }>
  onAddEvent: (event: PatientTimelineEvent) => void
}) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<TimelineEventType>('peso')
  const [date, setDate] = useState(() => todayLocalIso())
  const [weight, setWeight] = useState('')
  const [tumor, setTumor] = useState('')
  const [neutrophils, setNeutrophils] = useState('')
  const [platelets, setPlatelets] = useState('')
  const [hematocrit, setHematocrit] = useState('')
  const [chemo, setChemo] = useState('Doxorrubicina')
  const [cycle, setCycle] = useState('')
  const [notes, setNotes] = useState('')

  const merged = useMemo(() => {
    const legacy: PatientTimelineEvent[] = legacyEvolutions.map(e => ({ id: `legacy-${e.id}`, date: e.date, type: 'outro', title: 'Evolução clínica', notes: `${e.notes}${e.weight ? ` | Peso: ${e.weight}` : ''}${e.temperature ? ` | Temp: ${e.temperature}` : ''}` }))
    return [...events, ...legacy].sort((a, b) => {
      const da = new Date(a.date.split(' ')[0].split('/').reverse().join('-')).getTime() || new Date(a.date).getTime() || 0
      const db = new Date(b.date.split(' ')[0].split('/').reverse().join('-')).getTime() || new Date(b.date).getTime() || 0
      return db - da
    })
  }, [events, legacyEvolutions])

  const save = () => {
    const nadir = type === 'quimioterapia' ? getNadirWindow(chemo, date) : null
    const titles: Record<TimelineEventType, string> = {
      peso: `Peso: ${weight || 'N/I'} kg`,
      tumor: `Biometria tumoral: ${tumor || 'N/I'}`,
      hemograma: 'Hemograma de controle',
      quimioterapia: `${chemo}${cycle ? ` • Ciclo ${cycle}` : ''}`,
      toxicidade: 'Toxicidade / evento adverso',
      histologia: 'Histologia / anatomopatológico',
      nutricao: 'Avaliação nutricional',
      outro: 'Evento clínico',
    }
    onAddEvent({
      id: `timeline-${Date.now()}`,
      date,
      type,
      title: titles[type],
      notes,
      weightKg: type === 'peso' && Number(weight) ? Number(weight) : undefined,
      tumorMeasurementMm: type === 'tumor' ? tumor : undefined,
      neutrophils: type === 'hemograma' && Number(neutrophils) >= 0 && neutrophils !== '' ? Number(neutrophils) : undefined,
      platelets: type === 'hemograma' && Number(platelets) >= 0 && platelets !== '' ? Number(platelets) : undefined,
      hematocrit: type === 'hemograma' && Number(hematocrit) >= 0 && hematocrit !== '' ? Number(hematocrit) : undefined,
      chemoDrug: type === 'quimioterapia' ? chemo : undefined,
      chemoCycle: type === 'quimioterapia' ? cycle : undefined,
      nadirStart: nadir?.start,
      nadirEnd: nadir?.end,
    })
    setOpen(false)
    setNotes('')
    setWeight('')
    setTumor('')
    setNeutrophils('')
    setPlatelets('')
    setHematocrit('')
  }

  const iconFor = (t: TimelineEventType) => t === 'quimioterapia' ? '💉' : t === 'hemograma' ? '🩸' : t === 'tumor' ? '📏' : t === 'peso' ? '⚖️' : t === 'histologia' ? '🔬' : t === 'nutricao' ? '🥗' : t === 'toxicidade' ? '⚠️' : '🩺'

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between"><div className="text-xs font-extrabold text-pink-950 flex items-center gap-2"><Activity className="w-4 h-4 text-pink-500" /> Timeline Clínica Estruturada</div><button type="button" onClick={() => setOpen(!open)} className="text-[11px] font-bold text-pink-700 bg-pink-50 border border-pink-200 px-3 py-1.5 rounded-xl">{open ? 'Fechar' : '+ Evento estruturado'}</button></div>
      {open && <div className="bg-pink-50/50 border border-pink-200 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2"><div><label className={labelClass}>Tipo</label><select value={type} onChange={e => setType(e.target.value as TimelineEventType)} className={inputClass}><option value="peso">Peso</option><option value="tumor">Biometria tumoral</option><option value="hemograma">Hemograma</option><option value="quimioterapia">Ciclo de quimioterapia</option><option value="outro">Outro evento</option></select></div><div><label className={labelClass}>Data</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass} /></div></div>
        {type === 'peso' && <div><label className={labelClass}>Peso (kg)</label><input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} className={inputClass} /></div>}
        {type === 'tumor' && <div><label className={labelClass}>Medidas tumorais / biometria</label><input value={tumor} onChange={e => setTumor(e.target.value)} className={inputClass} placeholder="Ex.: 28 × 19 × 15 mm; linfonodo 12 mm" /></div>}
        {type === 'hemograma' && <div className="grid grid-cols-3 gap-2"><div><label className={labelClass}>Neutrófilos /µL</label><input type="number" value={neutrophils} onChange={e => setNeutrophils(e.target.value)} className={inputClass} /></div><div><label className={labelClass}>Plaquetas /µL</label><input type="number" value={platelets} onChange={e => setPlatelets(e.target.value)} className={inputClass} /></div><div><label className={labelClass}>Hematócrito %</label><input type="number" step="0.1" value={hematocrit} onChange={e => setHematocrit(e.target.value)} className={inputClass} /></div></div>}
        {type === 'quimioterapia' && <div className="grid grid-cols-2 gap-2"><div><label className={labelClass}>Fármaco</label><select value={chemo} onChange={e => setChemo(e.target.value)} className={inputClass}>{Object.keys(NADIR_WINDOWS).map(x => <option key={x}>{x}</option>)}</select></div><div><label className={labelClass}>Ciclo / semana</label><input value={cycle} onChange={e => setCycle(e.target.value)} className={inputClass} placeholder="Ex.: CHOP semana 4" /></div></div>}
        <div><label className={labelClass}>Notas</label><textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} className={inputClass} /></div>
        <button type="button" onClick={save} className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Salvar evento</button>
      </div>}
      <div className="relative pl-5 space-y-3 before:absolute before:left-[7px] before:top-1 before:bottom-1 before:w-px before:bg-pink-200 max-h-[520px] overflow-y-auto pr-1">
        {merged.length === 0 ? <p className="text-[11px] text-stone-400 py-3">Nenhum evento na timeline ainda.</p> : merged.map(event => <div key={event.id} className="relative bg-white border border-pink-100 rounded-2xl p-3 shadow-2xs"><span className="absolute -left-[22px] top-4 w-4 h-4 bg-pink-100 border-2 border-pink-400 rounded-full" /><div className="flex items-start justify-between gap-2"><div><div className="text-xs font-extrabold text-pink-950">{iconFor(event.type)} {event.title}</div><div className="text-[10px] text-stone-400 mt-0.5">{formatLocalDate(event.date)}</div></div>{event.grade ? <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${event.grade >= 3 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>G{event.grade}</span> : null}</div>{event.type === 'hemograma' && <div className="flex flex-wrap gap-2 text-[10px] mt-2">{event.neutrophils !== undefined && <span className="bg-rose-50 px-2 py-1 rounded-lg">Neut: {event.neutrophils}/µL</span>}{event.platelets !== undefined && <span className="bg-purple-50 px-2 py-1 rounded-lg">Plaq: {event.platelets}/µL</span>}{event.hematocrit !== undefined && <span className="bg-sky-50 px-2 py-1 rounded-lg">Hct: {event.hematocrit}%</span>}</div>}{event.nadirStart && event.nadirEnd && <div className="bg-rose-50 text-rose-800 text-[10px] font-bold px-2.5 py-1.5 rounded-lg mt-2">Nadir previsto: {formatLocalDate(event.nadirStart)} → {formatLocalDate(event.nadirEnd)}</div>}{event.notes && <p className="text-[11px] text-stone-600 mt-2 whitespace-pre-line leading-relaxed">{event.notes}</p>}</div>)}
      </div>
    </div>
  )
}



const PRESCRIPTION_TEMPLATES: Array<{
  id: string
  name: string
  description: string
  diagnosis: string
  medications: Omit<PrescriptionMedication, 'id'>[]
  generalInstructions: string
}> = [
  {
    id: 'blank',
    name: 'Receita em branco',
    description: 'Começar do zero e preencher todos os campos manualmente.',
    diagnosis: '',
    medications: [],
    generalInstructions: '',
  },
  {
    id: 'gastro-support',
    name: 'Suporte gastrointestinal',
    description: 'Modelo editável para pacientes com sinais gastrointestinais. Doses ficam em branco para confirmação clínica.',
    diagnosis: 'Afecção gastrointestinal — confirmar diagnóstico e gravidade',
    medications: [
      { name: 'Antiemético', presentation: '', dose: '[definir dose]', frequency: '[definir frequência]', duration: '[definir duração]', instructions: 'Administrar conforme avaliação clínica.' },
      { name: 'Protetor gastrointestinal (se indicado)', presentation: '', dose: '[definir dose]', frequency: '[definir frequência]', duration: '[definir duração]', instructions: 'Usar somente quando houver indicação clínica.' },
    ],
    generalInstructions: 'Manter hidratação conforme orientação. Retornar imediatamente se houver piora, hematêmese, melena, prostração importante, dor abdominal intensa ou incapacidade de manter água/alimento.',
  },
  {
    id: 'post-op',
    name: 'Pós-operatório',
    description: 'Modelo para alta pós-operatória com analgesia e cuidados locais, sempre editável.',
    diagnosis: 'Pós-operatório — procedimento: [preencher]',
    medications: [
      { name: 'Analgésico', presentation: '', dose: '[definir dose]', frequency: '[definir frequência]', duration: '[definir duração]', instructions: 'Administrar conforme prescrição e reavaliação.' },
      { name: 'Medicação adicional (se indicada)', presentation: '', dose: '[definir dose]', frequency: '[definir frequência]', duration: '[definir duração]', instructions: 'Preencher somente se houver indicação.' },
    ],
    generalInstructions: 'Manter repouso conforme orientação. Impedir lambedura da ferida. Observar sangramento, secreção, edema progressivo, abertura de pontos, dor intensa, vômitos persistentes ou apatia importante.',
  },
  {
    id: 'derm',
    name: 'Dermatologia — cuidados domiciliares',
    description: 'Modelo para tratamento dermatológico com espaço para terapia tópica e sistêmica.',
    diagnosis: 'Dermatopatia — diagnóstico: [preencher]',
    medications: [
      { name: 'Terapia tópica', presentation: '', dose: '[produto/concentração]', frequency: '[definir frequência]', duration: '[definir duração]', instructions: 'Descrever modo de aplicação e tempo de contato, quando aplicável.' },
      { name: 'Medicação sistêmica (se indicada)', presentation: '', dose: '[definir dose]', frequency: '[definir frequência]', duration: '[definir duração]', instructions: 'Ajustar ao diagnóstico e ao paciente.' },
    ],
    generalInstructions: 'Evitar produtos não prescritos. Observar piora do prurido, surgimento de pústulas, secreção, dor, edema facial ou outros sinais adversos.',
  },
  {
    id: 'onco-support',
    name: 'Pós-quimioterapia — suporte',
    description: 'Modelo de medicações de suporte e orientações após quimioterapia, sem doses automáticas.',
    diagnosis: 'Paciente oncológico — protocolo/ciclo: [preencher]',
    medications: [
      { name: 'Antiemético / suporte gastrointestinal (se indicado)', presentation: '', dose: '[definir dose]', frequency: '[definir frequência]', duration: '[definir duração]', instructions: 'Confirmar necessidade conforme protocolo e paciente.' },
      { name: 'Outro suporte', presentation: '', dose: '[definir dose]', frequency: '[definir frequência]', duration: '[definir duração]', instructions: 'Preencher conforme necessidade individual.' },
    ],
    generalInstructions: 'Monitorar apetite, vômitos, diarreia, apatia e temperatura quando orientado. Procurar atendimento se houver febre, prostração intensa, vômitos/diarreia persistentes, sangramento ou qualquer piora importante. Seguir as orientações de manejo de excretas fornecidas pela equipe.',
  },
]

function PrescriptionModule({
  patients,
  recipes,
  setRecipes,
  markMutation,
}: {
  patients: PatientRecord[]
  recipes: VetPrescription[]
  setRecipes: React.Dispatch<React.SetStateAction<VetPrescription[]>>
  markMutation: () => void
}) {
  const today = new Date().toISOString().slice(0, 10)
  const blankMedication = (): PrescriptionMedication => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: '',
    presentation: '',
    dose: '',
    frequency: '',
    duration: '',
    instructions: '',
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [patientId, setPatientId] = useState('')
  const [manualPatientName, setManualPatientName] = useState('')
  const [manualTutorName, setManualTutorName] = useState('')
  const [manualSpecies, setManualSpecies] = useState('Canino')
  const [date, setDate] = useState(today)
  const [veterinarian, setVeterinarian] = useState('Dra. Beatriz Contreiras')
  const [crmv] = useState('8379')
  const [diagnosis, setDiagnosis] = useState('')
  const [medications, setMedications] = useState<PrescriptionMedication[]>([blankMedication()])
  const [generalInstructions, setGeneralInstructions] = useState('')
  const [notes, setNotes] = useState('')
  const [historyQuery, setHistoryQuery] = useState('')

  const patient = patients.find(p => p.id === patientId)

  const resetForm = () => {
    setEditingId(null)
    setPatientId('')
    setManualPatientName('')
    setManualTutorName('')
    setManualSpecies('Canino')
    setDate(today)
    setDiagnosis('')
    setMedications([blankMedication()])
    setGeneralInstructions('')
    setNotes('')
  }

  const applyTemplate = (templateId: string) => {
    const template = PRESCRIPTION_TEMPLATES.find(t => t.id === templateId)
    if (!template) return
    setDiagnosis(template.diagnosis)
    setMedications(
      template.medications.length
        ? template.medications.map(m => ({ ...m, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` }))
        : [blankMedication()]
    )
    setGeneralInstructions(template.generalInstructions)
  }

  const updateMedication = (id: string, field: keyof PrescriptionMedication, value: string) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const removeMedication = (id: string) => {
    setMedications(prev => prev.length > 1 ? prev.filter(m => m.id !== id) : [blankMedication()])
  }

  const buildRecipe = (): VetPrescription | null => {
    const patientName = patient?.petName || manualPatientName.trim()
    const tutorName = patient?.tutor || manualTutorName.trim()
    const species = patient?.species || manualSpecies.trim()

    if (!patientName) {
      alert('Informe o nome do paciente.')
      return null
    }
    if (!tutorName) {
      alert('Informe o nome do tutor.')
      return null
    }

    const validMeds = medications.filter(m => m.name.trim())
    if (validMeds.length === 0) {
      alert('Adicione pelo menos uma medicação ou item de prescrição.')
      return null
    }
    if (validMeds.some(m => !m.dose.trim() || !m.frequency.trim() || !m.duration.trim())) {
      alert('Revise dose, frequência e duração de todos os itens antes de salvar ou imprimir.')
      return null
    }

    const now = new Date().toISOString()
    return {
      id: editingId || `rx-${Date.now()}`,
      createdAt: recipes.find(r => r.id === editingId)?.createdAt || now,
      updatedAt: now,
      patientId: patient?.id || '',
      patientName,
      tutorName,
      species,
      date,
      veterinarian: veterinarian.trim() || 'Médico(a)-veterinário(a)',
      crmv: crmv.trim(),
      diagnosis: diagnosis.trim(),
      medications: validMeds,
      generalInstructions: generalInstructions.trim(),
      notes: notes.trim(),
    }
  }

  const saveRecipe = () => {
    const recipe = buildRecipe()
    if (!recipe) return
    markMutation()
    setRecipes(prev => {
      const exists = prev.some(r => r.id === recipe.id)
      return exists ? prev.map(r => r.id === recipe.id ? recipe : r) : [recipe, ...prev]
    })
    setEditingId(recipe.id)
    alert('Receita salva com sucesso.')
  }

  const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }[char] || char))

  const printRecipe = (recipeArg?: VetPrescription) => {
    const recipe = recipeArg || buildRecipe()
    if (!recipe) return

    const w = window.open('', '_blank')
    if (!w) {
      alert('O navegador bloqueou a janela de impressão. Permita pop-ups para este site.')
      return
    }

    const medsHtml = recipe.medications.map((m, index) => `
      <div class="med">
        <div class="med-title">${index + 1}. ${escapeHtml(m.name)}</div>
        ${m.presentation ? `<div><strong>Apresentação:</strong> ${escapeHtml(m.presentation)}</div>` : ''}
        <div><strong>Dose:</strong> ${escapeHtml(m.dose)}</div>
        <div><strong>Frequência:</strong> ${escapeHtml(m.frequency)} &nbsp; <strong>Duração:</strong> ${escapeHtml(m.duration)}</div>
        ${m.instructions ? `<div class="instructions">${escapeHtml(m.instructions)}</div>` : ''}
      </div>
    `).join('')

    const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>Receita Veterinária - ${escapeHtml(recipe.patientName)}</title>
<style>
  @page { size: A4; margin: 18mm; }
  body { font-family: Arial, sans-serif; color: #222; font-size: 13px; line-height: 1.45; }
  .header { border-bottom: 2px solid #db2777; padding-bottom: 12px; margin-bottom: 18px; }
  h1 { margin: 0; font-size: 22px; color: #9d174d; }
  .muted { color: #666; font-size: 12px; }
  .patient { background: #fdf2f8; border: 1px solid #fbcfe8; padding: 12px; border-radius: 8px; margin-bottom: 18px; }
  .med { border-bottom: 1px solid #eee; padding: 10px 0; page-break-inside: avoid; }
  .med-title { font-size: 14px; font-weight: bold; margin-bottom: 4px; }
  .instructions { margin-top: 4px; white-space: pre-wrap; }
  .box { margin-top: 18px; padding: 12px; border: 1px solid #ddd; border-radius: 8px; white-space: pre-wrap; }
  .sign { margin-top: 55px; text-align: center; }
  .sign-line { border-top: 1px solid #333; width: 280px; margin: 0 auto 6px; }
  .footer { margin-top: 28px; font-size: 10px; color: #777; text-align: center; }
</style>
</head>
<body>
  <div class="header">
    <h1>Receita Veterinária</h1>
    <div class="muted">${escapeHtml(recipe.veterinarian)}${recipe.crmv ? ` • CRMV ${escapeHtml(recipe.crmv)}` : ''}</div>
  </div>

  <div class="patient">
    <div><strong>Paciente:</strong> ${escapeHtml(recipe.patientName)} &nbsp; <strong>Espécie:</strong> ${escapeHtml(recipe.species)}</div>
    <div><strong>Tutor(a):</strong> ${escapeHtml(recipe.tutorName)}</div>
    <div><strong>Data:</strong> ${escapeHtml(recipe.date.split('-').reverse().join('/'))}</div>
    ${recipe.diagnosis ? `<div><strong>Diagnóstico/indicação:</strong> ${escapeHtml(recipe.diagnosis)}</div>` : ''}
  </div>

  <h2 style="font-size:16px">Prescrição</h2>
  ${medsHtml}

  ${recipe.generalInstructions ? `<div class="box"><strong>Orientações gerais</strong><br>${escapeHtml(recipe.generalInstructions)}</div>` : ''}
  ${recipe.notes ? `<div class="box"><strong>Observações</strong><br>${escapeHtml(recipe.notes)}</div>` : ''}

  <div class="sign">
    <div class="sign-line"></div>
    <strong>${escapeHtml(recipe.veterinarian)}</strong><br>
    ${recipe.crmv ? `CRMV ${escapeHtml(recipe.crmv)}` : 'CRMV: __________________'}
  </div>

  <div class="footer">Documento gerado pelo VetWorkspace. Revise integralmente a prescrição antes de assinar/entregar.</div>
  <script>window.onload = () => window.print();</script>
</body>
</html>`
    w.document.write(html)
    w.document.close()
  }

  const loadRecipe = (recipe: VetPrescription) => {
    setEditingId(recipe.id)
    setPatientId(recipe.patientId || '')
    setManualPatientName(recipe.patientName || '')
    setManualTutorName(recipe.tutorName || '')
    setManualSpecies(recipe.species || 'Canino')
    setDate(recipe.date)
    setVeterinarian(recipe.veterinarian)
    setDiagnosis(recipe.diagnosis)
    setMedications(recipe.medications.length ? recipe.medications : [blankMedication()])
    setGeneralInstructions(recipe.generalInstructions)
    setNotes(recipe.notes)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteRecipe = (id: string) => {
    if (!confirm('Excluir esta receita salva?')) return
    markMutation()
    setRecipes(prev => prev.filter(r => r.id !== id))
    if (editingId === id) resetForm()
  }

  const filteredHistory = recipes.filter(r =>
    `${r.patientName} ${r.tutorName} ${r.diagnosis} ${r.date}`.toLowerCase().includes(historyQuery.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-7 rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-pink-100 pb-4">
          <div>
            <div className="text-[10px] font-extrabold text-pink-500 uppercase tracking-widest">🧾 Prescrição</div>
            <h2 className="text-xl font-extrabold text-pink-950">Receitas Veterinárias</h2>
            <p className="text-xs text-stone-500 mt-1">Crie, salve, edite e imprima receitas. Na janela de impressão, escolha “Salvar como PDF” para gerar o arquivo.</p>
          </div>
          <button type="button" onClick={resetForm} className="bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Nova receita
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-[11px] text-amber-900 leading-relaxed">
          <strong>Segurança:</strong> os modelos automáticos são rascunhos editáveis e não definem automaticamente dose clínica. Confirme paciente, fármaco, apresentação, dose, frequência, duração, contraindicações e interações antes de salvar, imprimir ou entregar ao tutor.
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">Modelos automáticos</label>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {PRESCRIPTION_TEMPLATES.map(t => (
              <button key={t.id} type="button" onClick={() => applyTemplate(t.id)} className="text-left bg-pink-50/60 hover:bg-pink-100 border border-pink-200 rounded-xl p-3 transition">
                <div className="text-xs font-extrabold text-pink-950">{t.name}</div>
                <div className="text-[10px] text-stone-500 mt-1 leading-relaxed">{t.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Usar paciente já cadastrado (opcional)</label>
            <select
              value={patientId}
              onChange={e => {
                const id = e.target.value
                setPatientId(id)
                const found = patients.find(p => p.id === id)
                if (found) {
                  setManualPatientName(found.petName)
                  setManualTutorName(found.tutor)
                  setManualSpecies(found.species || 'Canino')
                }
              }}
              className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none"
            >
              <option value="">Não vincular — digitar os dados abaixo</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.petName} — {p.tutor} ({p.species})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Nome do paciente</label>
              <input
                value={manualPatientName}
                onChange={e => { setManualPatientName(e.target.value); if (patientId) setPatientId('') }}
                placeholder="Ex: Mel"
                className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Tutor(a)</label>
              <input
                value={manualTutorName}
                onChange={e => { setManualTutorName(e.target.value); if (patientId) setPatientId('') }}
                placeholder="Ex: Maria"
                className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Espécie</label>
              <select
                value={manualSpecies}
                onChange={e => { setManualSpecies(e.target.value); if (patientId) setPatientId('') }}
                className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none"
              >
                <option value="Canino">Canino</option>
                <option value="Felino">Felino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Data</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">CRMV</label>
              <input value={crmv} readOnly className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-700 font-bold focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Registro</label>
              <div className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-800 font-bold">
                CRMV 8379
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">Médico(a)-veterinário(a)</label>
          <input value={veterinarian} onChange={e => setVeterinarian(e.target.value)} className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none" />
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">Diagnóstico / indicação</label>
          <input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="Diagnóstico, suspeita clínica ou indicação da prescrição..." className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-pink-950 uppercase tracking-wider">Itens da prescrição</h3>
            <button type="button" onClick={() => setMedications(prev => [...prev, blankMedication()])} className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Adicionar item
            </button>
          </div>

          {medications.map((m, index) => (
            <div key={m.id} className="bg-pink-50/40 border border-pink-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-pink-900">Item {index + 1}</span>
                <button type="button" onClick={() => removeMedication(m.id)} className="text-stone-400 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={m.name} onChange={e => updateMedication(m.id, 'name', e.target.value)} placeholder="Medicamento / produto" className="bg-white border border-pink-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none" />
                <input value={m.presentation} onChange={e => updateMedication(m.id, 'presentation', e.target.value)} placeholder="Apresentação (ex: comprimido, solução...)" className="bg-white border border-pink-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input value={m.dose} onChange={e => updateMedication(m.id, 'dose', e.target.value)} placeholder="Dose (obrigatório)" className="bg-white border border-pink-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none" />
                <input value={m.frequency} onChange={e => updateMedication(m.id, 'frequency', e.target.value)} placeholder="Frequência (obrigatório)" className="bg-white border border-pink-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none" />
                <input value={m.duration} onChange={e => updateMedication(m.id, 'duration', e.target.value)} placeholder="Duração (obrigatório)" className="bg-white border border-pink-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none" />
              </div>
              <textarea value={m.instructions} onChange={e => updateMedication(m.id, 'instructions', e.target.value)} rows={2} placeholder="Modo de uso / observações deste item..." className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none resize-none" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Orientações gerais ao tutor</label>
            <textarea value={generalInstructions} onChange={e => setGeneralInstructions(e.target.value)} rows={5} className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none resize-none" placeholder="Cuidados domiciliares, retorno, sinais de alarme..." />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Observações</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={5} className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none resize-none" placeholder="Observações adicionais..." />
          </div>
        </div>

        {(patient || manualPatientName.trim()) && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
            <strong>Paciente:</strong> {patient?.petName || manualPatientName || '—'} •
            <strong> Tutor(a):</strong> {patient?.tutor || manualTutorName || '—'} •
            <strong> Espécie:</strong> {patient?.species || manualSpecies || '—'}
            {patient ? ' • Vinculado ao prontuário cadastrado' : ' • Receita avulsa'}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={saveRecipe} className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Save className="w-4 h-4" /> {editingId ? 'Atualizar receita' : 'Salvar receita'}
          </button>
          <button type="button" onClick={() => printRecipe()} className="bg-stone-800 hover:bg-stone-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Printer className="w-4 h-4" /> Imprimir / Salvar PDF
          </button>
        </div>
      </div>

      <div className="bg-white/95 border border-pink-100 p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-pink-950">Receitas salvas</h3>
            <p className="text-[11px] text-stone-500">Reabra uma receita para editar, imprimir novamente ou excluir.</p>
          </div>
          <div className="relative md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-pink-400" />
            <input value={historyQuery} onChange={e => setHistoryQuery(e.target.value)} placeholder="Buscar paciente, tutor, diagnóstico..." className="w-full bg-pink-50/40 border border-pink-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none" />
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-xs text-stone-400 bg-pink-50/30 border border-dashed border-pink-200 rounded-2xl">Nenhuma receita salva ainda.</div>
        ) : (
          <div className="space-y-2">
            {filteredHistory.map(recipe => (
              <div key={recipe.id} className="border border-pink-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="font-extrabold text-sm text-pink-950">🐾 {recipe.patientName}</div>
                  <div className="text-[11px] text-stone-500">Tutor: {recipe.tutorName} • {recipe.date.split('-').reverse().join('/')} • {recipe.medications.length} item(ns)</div>
                  {recipe.diagnosis && <div className="text-[11px] text-pink-700 mt-1">{recipe.diagnosis}</div>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => loadRecipe(recipe)} className="bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 px-3 py-2 rounded-xl text-xs font-bold">Abrir / Editar</button>
                  <button type="button" onClick={() => printRecipe(recipe)} className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1"><Printer className="w-3.5 h-3.5" /> PDF</button>
                  <button type="button" onClick={() => deleteRecipe(recipe.id)} className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-xl text-xs font-bold"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


type PreChemoChecklistRecord = {
  id: string
  createdAt: string
  patientId: string
  patientName: string
  protocol: string
  cycle: string
  currentWeight: string
  previousWeight: string
  temperature: string
  appetite: string
  vomiting: string
  diarrhea: string
  activity: string
  intercurrences: string
  currentMeds: string
  cbcDone: boolean
  neutrophils: string
  neutrophilsPrevious: string
  neutrophilsFlagged: boolean
  platelets: string
  plateletsPrevious: string
  plateletsFlagged: boolean
  hematocrit: string
  hematocritPrevious: string
  hematocritFlagged: boolean
  creatinine: string
  creatininePrevious: string
  creatinineFlagged: boolean
  alt: string
  altPrevious: string
  altFlagged: boolean
  alp: string
  alpPrevious: string
  alpFlagged: boolean
  bilirubin: string
  bilirubinPrevious: string
  bilirubinFlagged: boolean
  previousToxicity: string
  notes: string
  reviewItems: string[]
}

function PreChemoChecklist({
  patients,
}: {
  patients: PatientRecord[]
}) {
  const storageKey = 'vet_prechemo_checklists_v28'

  const emptyFlags = {
    neutrophilsFlagged: false,
    plateletsFlagged: false,
    hematocritFlagged: false,
    creatinineFlagged: false,
    altFlagged: false,
    alpFlagged: false,
    bilirubinFlagged: false,
  }

  const [patientId, setPatientId] = useState('')
  const [manualPatientName, setManualPatientName] = useState('')
  const [protocol, setProtocol] = useState('')
  const [cycle, setCycle] = useState('')
  const [currentWeight, setCurrentWeight] = useState('')
  const [previousWeight, setPreviousWeight] = useState('')
  const [temperature, setTemperature] = useState('')
  const [appetite, setAppetite] = useState('Normal')
  const [vomiting, setVomiting] = useState('Não')
  const [diarrhea, setDiarrhea] = useState('Não')
  const [activity, setActivity] = useState('Normal')
  const [intercurrences, setIntercurrences] = useState('')
  const [currentMeds, setCurrentMeds] = useState('')
  const [cbcDone, setCbcDone] = useState(false)

  const [neutrophils, setNeutrophils] = useState('')
  const [neutrophilsPrevious, setNeutrophilsPrevious] = useState('')
  const [platelets, setPlatelets] = useState('')
  const [plateletsPrevious, setPlateletsPrevious] = useState('')
  const [hematocrit, setHematocrit] = useState('')
  const [hematocritPrevious, setHematocritPrevious] = useState('')
  const [creatinine, setCreatinine] = useState('')
  const [creatininePrevious, setCreatininePrevious] = useState('')
  const [alt, setAlt] = useState('')
  const [altPrevious, setAltPrevious] = useState('')
  const [alp, setAlp] = useState('')
  const [alpPrevious, setAlpPrevious] = useState('')
  const [bilirubin, setBilirubin] = useState('')
  const [bilirubinPrevious, setBilirubinPrevious] = useState('')

  const [flags, setFlags] = useState(emptyFlags)
  const [previousToxicity, setPreviousToxicity] = useState('Nenhuma relatada')
  const [notes, setNotes] = useState('')
  const [result, setResult] = useState<string[] | null>(null)
  const [history, setHistory] = useState<PreChemoChecklistRecord[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const selectedPatient = patients.find(p => p.id === patientId)
  const patientName = selectedPatient?.petName || manualPatientName.trim()

  const pctChange = (current: string, previous: string) => {
    const c = Number(current.replace(',', '.'))
    const p = Number(previous.replace(',', '.'))
    if (!Number.isFinite(c) || !Number.isFinite(p) || p === 0) return null
    return ((c - p) / p) * 100
  }

  const trend = (current: string, previous: string) => {
    const change = pctChange(current, previous)
    if (change === null) return '—'
    if (Math.abs(change) < 0.1) return '→ sem mudança relevante'
    return `${change > 0 ? '↑' : '↓'} ${Math.abs(change).toFixed(1)}%`
  }

  const weightTrend = trend(currentWeight, previousWeight)

  const buildReviewItems = () => {
    const items: string[] = []

    if (!cbcDone) items.push('Hemograma ainda não confirmado como disponível/revisado.')
    if (appetite !== 'Normal') items.push(`Apetite informado como: ${appetite}.`)
    if (vomiting !== 'Não') items.push(`Vômito desde o último ciclo: ${vomiting}.`)
    if (diarrhea !== 'Não') items.push(`Diarreia desde o último ciclo: ${diarrhea}.`)
    if (activity !== 'Normal') items.push(`Atividade/estado geral informado como: ${activity}.`)
    if (intercurrences.trim()) items.push('Há intercorrências clínicas registradas para revisão.')
    if (currentMeds.trim()) items.push('Há medicações de uso atual registradas; revisar interações e compatibilidade com o protocolo.')
    if (previousToxicity !== 'Nenhuma relatada') items.push(`Toxicidade do ciclo anterior: ${previousToxicity}.`)

    const labFlags: Array<[boolean, string]> = [
      [flags.neutrophilsFlagged, 'Neutrófilos'],
      [flags.plateletsFlagged, 'Plaquetas'],
      [flags.hematocritFlagged, 'Hematócrito'],
      [flags.creatinineFlagged, 'Creatinina'],
      [flags.altFlagged, 'ALT'],
      [flags.alpFlagged, 'FA'],
      [flags.bilirubinFlagged, 'Bilirrubina'],
    ]
    labFlags.forEach(([flagged, label]) => {
      if (flagged) items.push(`${label}: marcado como fora do intervalo de referência do laboratório/laudo.`)
    })

    if (currentWeight && previousWeight && weightTrend !== '—') {
      items.push(`Peso: ${weightTrend} em relação ao registro anterior.`)
    }

    if (temperature.trim()) {
      items.push(`Temperatura registrada: ${temperature} °C — interpretar conforme espécie, contexto e exame clínico.`)
    }

    if (items.length === 0) {
      items.push('Checklist preenchido sem alertas automáticos registrados. A decisão clínica permanece dependente da avaliação do paciente, protocolo e laudos.')
    }
    return items
  }

  const evaluate = () => {
    setResult(buildReviewItems())
  }

  const saveChecklist = () => {
    if (!patientName) {
      alert('Informe ou selecione o paciente antes de salvar.')
      return
    }
    const reviewItems = buildReviewItems()
    const record: PreChemoChecklistRecord = {
      id: `prechemo-${Date.now()}`,
      createdAt: new Date().toISOString(),
      patientId,
      patientName,
      protocol,
      cycle,
      currentWeight,
      previousWeight,
      temperature,
      appetite,
      vomiting,
      diarrhea,
      activity,
      intercurrences,
      currentMeds,
      cbcDone,
      neutrophils,
      neutrophilsPrevious,
      neutrophilsFlagged: flags.neutrophilsFlagged,
      platelets,
      plateletsPrevious,
      plateletsFlagged: flags.plateletsFlagged,
      hematocrit,
      hematocritPrevious,
      hematocritFlagged: flags.hematocritFlagged,
      creatinine,
      creatininePrevious,
      creatinineFlagged: flags.creatinineFlagged,
      alt,
      altPrevious,
      altFlagged: flags.altFlagged,
      alp,
      alpPrevious,
      alpFlagged: flags.alpFlagged,
      bilirubin,
      bilirubinPrevious,
      bilirubinFlagged: flags.bilirubinFlagged,
      previousToxicity,
      notes,
      reviewItems,
    }
    const next = [record, ...history].slice(0, 100)
    setHistory(next)
    setResult(reviewItems)
    if (typeof window !== 'undefined') localStorage.setItem(storageKey, JSON.stringify(next))
    alert('Checklist pré-quimioterapia salvo.')
  }

  const clear = () => {
    setPatientId('')
    setManualPatientName('')
    setProtocol('')
    setCycle('')
    setCurrentWeight('')
    setPreviousWeight('')
    setTemperature('')
    setAppetite('Normal')
    setVomiting('Não')
    setDiarrhea('Não')
    setActivity('Normal')
    setIntercurrences('')
    setCurrentMeds('')
    setCbcDone(false)
    setNeutrophils('')
    setNeutrophilsPrevious('')
    setPlatelets('')
    setPlateletsPrevious('')
    setHematocrit('')
    setHematocritPrevious('')
    setCreatinine('')
    setCreatininePrevious('')
    setAlt('')
    setAltPrevious('')
    setAlp('')
    setAlpPrevious('')
    setBilirubin('')
    setBilirubinPrevious('')
    setFlags(emptyFlags)
    setPreviousToxicity('Nenhuma relatada')
    setNotes('')
    setResult(null)
  }

  const loadHistory = (item: PreChemoChecklistRecord) => {
    setPatientId(item.patientId || '')
    setManualPatientName(item.patientName || '')
    setProtocol(item.protocol || '')
    setCycle(item.cycle || '')
    setCurrentWeight(item.currentWeight || '')
    setPreviousWeight(item.previousWeight || '')
    setTemperature(item.temperature || '')
    setAppetite(item.appetite || 'Normal')
    setVomiting(item.vomiting || 'Não')
    setDiarrhea(item.diarrhea || 'Não')
    setActivity(item.activity || 'Normal')
    setIntercurrences(item.intercurrences || '')
    setCurrentMeds(item.currentMeds || '')
    setCbcDone(!!item.cbcDone)
    setNeutrophils(item.neutrophils || '')
    setNeutrophilsPrevious(item.neutrophilsPrevious || '')
    setPlatelets(item.platelets || '')
    setPlateletsPrevious(item.plateletsPrevious || '')
    setHematocrit(item.hematocrit || '')
    setHematocritPrevious(item.hematocritPrevious || '')
    setCreatinine(item.creatinine || '')
    setCreatininePrevious(item.creatininePrevious || '')
    setAlt(item.alt || '')
    setAltPrevious(item.altPrevious || '')
    setAlp(item.alp || '')
    setAlpPrevious(item.alpPrevious || '')
    setBilirubin(item.bilirubin || '')
    setBilirubinPrevious(item.bilirubinPrevious || '')
    setFlags({
      neutrophilsFlagged: !!item.neutrophilsFlagged,
      plateletsFlagged: !!item.plateletsFlagged,
      hematocritFlagged: !!item.hematocritFlagged,
      creatinineFlagged: !!item.creatinineFlagged,
      altFlagged: !!item.altFlagged,
      alpFlagged: !!item.alpFlagged,
      bilirubinFlagged: !!item.bilirubinFlagged,
    })
    setPreviousToxicity(item.previousToxicity || 'Nenhuma relatada')
    setNotes(item.notes || '')
    setResult(item.reviewItems || null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const labRow = (
    label: string,
    current: string,
    setCurrent: React.Dispatch<React.SetStateAction<string>>,
    previous: string,
    setPrevious: React.Dispatch<React.SetStateAction<string>>,
    flagKey: keyof typeof flags,
    unit: string
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr_1fr_0.9fr] gap-2 items-end bg-white border border-pink-100 rounded-xl p-3">
      <div>
        <div className="text-xs font-extrabold text-pink-950">{label}</div>
        <div className="text-[10px] text-stone-400">{unit}</div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-stone-500 block mb-1">Anterior</label>
        <input value={previous} onChange={e => setPrevious(e.target.value)} className="w-full bg-pink-50/40 border border-pink-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none" />
      </div>
      <div>
        <label className="text-[10px] font-bold text-stone-500 block mb-1">Atual</label>
        <input value={current} onChange={e => setCurrent(e.target.value)} className="w-full bg-pink-50/40 border border-pink-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none" />
        <div className="text-[10px] font-bold text-pink-700 mt-1">{trend(current, previous)}</div>
      </div>
      <label className="flex items-center gap-2 text-[10px] font-bold text-stone-600 cursor-pointer p-2 rounded-lg bg-amber-50 border border-amber-100">
        <input
          type="checkbox"
          checked={flags[flagKey]}
          onChange={e => setFlags(prev => ({ ...prev, [flagKey]: e.target.checked }))}
          className="accent-pink-500"
        />
        Fora da referência do laudo
      </label>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-7 rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pink-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-pink-950">Checklist Pré-Quimioterapia</h2>
              <p className="text-xs text-pink-500 font-medium">Conferência clínica, laboratorial e de toxicidade antes do próximo ciclo</p>
            </div>
          </div>
          <button type="button" onClick={clear} className="bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-800 px-4 py-2.5 rounded-xl text-xs font-bold">
            Limpar checklist
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-[11px] text-amber-900 leading-relaxed">
          <strong>Importante:</strong> esta ferramenta não usa intervalos laboratoriais universais. Marque “fora da referência do laudo” conforme o laboratório que realizou o exame. O resumo organiza os pontos de revisão e não substitui a decisão clínica sobre realizar, adiar ou ajustar o ciclo.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Paciente cadastrado (opcional)</label>
            <select
              value={patientId}
              onChange={e => {
                const id = e.target.value
                setPatientId(id)
                const p = patients.find(x => x.id === id)
                if (p) setManualPatientName(p.petName)
              }}
              className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
            >
              <option value="">Digitar nome manualmente</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.petName} — {p.tutor}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Nome do paciente</label>
            <input value={manualPatientName} onChange={e => { setManualPatientName(e.target.value); if (patientId) setPatientId('') }} placeholder="Ex: Mel" className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Protocolo / quimioterápico</label>
            <input value={protocol} onChange={e => setProtocol(e.target.value)} placeholder="Ex: CHOP / Doxorrubicina..." className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Ciclo / semana</label>
            <input value={cycle} onChange={e => setCycle(e.target.value)} placeholder="Ex: Ciclo 3 / Semana 5" className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none" />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-extrabold text-pink-950 uppercase tracking-wider mb-3">1. Estado clínico desde o último ciclo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Peso anterior (kg)</label>
              <input value={previousWeight} onChange={e => setPreviousWeight(e.target.value)} className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2.5 text-xs" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Peso atual (kg)</label>
              <input value={currentWeight} onChange={e => setCurrentWeight(e.target.value)} className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2.5 text-xs" />
              <div className="text-[10px] font-bold text-pink-700 mt-1">{weightTrend}</div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Temperatura (°C)</label>
              <input value={temperature} onChange={e => setTemperature(e.target.value)} className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2.5 text-xs" />
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Apetite</label>
              <select value={appetite} onChange={e => setAppetite(e.target.value)} className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2.5 text-xs">
                <option>Normal</option><option>Reduzido</option><option>Ausente</option><option>Aumentado</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Vômito</label>
              <select value={vomiting} onChange={e => setVomiting(e.target.value)} className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2.5 text-xs">
                <option>Não</option><option>Episódio isolado</option><option>Recorrente</option><option>Persistente / importante</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Diarreia</label>
              <select value={diarrhea} onChange={e => setDiarrhea(e.target.value)} className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2.5 text-xs">
                <option>Não</option><option>Leve / ocasional</option><option>Recorrente</option><option>Persistente / importante</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Atividade / estado geral</label>
              <select value={activity} onChange={e => setActivity(e.target.value)} className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2.5 text-xs">
                <option>Normal</option><option>Discretamente reduzida</option><option>Apático</option><option>Muito comprometido</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Intercorrências desde o último ciclo</label>
              <input value={intercurrences} onChange={e => setIntercurrences(e.target.value)} placeholder="Infecção, internação, sangramento, dor, outros..." className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2.5 text-xs" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-extrabold text-pink-950 uppercase tracking-wider mb-3">2. Exames — compare com o laudo do próprio laboratório</h3>
          <label className="flex items-center gap-2 mb-3 text-xs font-bold text-stone-700 bg-pink-50/50 border border-pink-100 rounded-xl p-3 cursor-pointer">
            <input type="checkbox" checked={cbcDone} onChange={e => setCbcDone(e.target.checked)} className="accent-pink-500" />
            Hemograma disponível e revisado
          </label>
          <div className="space-y-2">
            {labRow('Neutrófilos', neutrophils, setNeutrophils, neutrophilsPrevious, setNeutrophilsPrevious, 'neutrophilsFlagged', 'usar unidade do laboratório')}
            {labRow('Plaquetas', platelets, setPlatelets, plateletsPrevious, setPlateletsPrevious, 'plateletsFlagged', 'usar unidade do laboratório')}
            {labRow('Hematócrito', hematocrit, setHematocrit, hematocritPrevious, setHematocritPrevious, 'hematocritFlagged', '%')}
            {labRow('Creatinina', creatinine, setCreatinine, creatininePrevious, setCreatininePrevious, 'creatinineFlagged', 'usar unidade do laboratório')}
            {labRow('ALT', alt, setAlt, altPrevious, setAltPrevious, 'altFlagged', 'usar unidade do laboratório')}
            {labRow('FA', alp, setAlp, alpPrevious, setAlpPrevious, 'alpFlagged', 'usar unidade do laboratório')}
            {labRow('Bilirrubina', bilirubin, setBilirubin, bilirubinPrevious, setBilirubinPrevious, 'bilirubinFlagged', 'usar unidade do laboratório')}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-extrabold text-pink-950 uppercase tracking-wider mb-3">3. Toxicidade e medicações atuais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Toxicidade do ciclo anterior</label>
              <select value={previousToxicity} onChange={e => setPreviousToxicity(e.target.value)} className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2.5 text-xs">
                <option>Nenhuma relatada</option>
                <option>Leve — revisar</option>
                <option>Moderada — revisar antes do ciclo</option>
                <option>Importante — requer reavaliação</option>
                <option>Classificada no módulo VCOG-CTCAE</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Medicações em uso</label>
              <input value={currentMeds} onChange={e => setCurrentMeds(e.target.value)} placeholder="AINE, corticoide, antibiótico, anticonvulsivante..." className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2.5 text-xs" />
            </div>
          </div>
          <div className="mt-3">
            <label className="text-[11px] font-bold text-stone-600 block mb-1">Observações clínicas</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2.5 text-xs resize-none" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={evaluate} className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4" /> Gerar resumo pré-quimio
          </button>
          <button type="button" onClick={saveChecklist} className="bg-stone-800 hover:bg-stone-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <Save className="w-4 h-4" /> Salvar checklist
          </button>
        </div>

        {result && (
          <div className="bg-pink-50/70 border border-pink-200 rounded-2xl p-5 space-y-3">
            <div className="font-extrabold text-sm text-pink-950">Resumo para revisão antes do próximo ciclo</div>
            <ul className="space-y-2">
              {result.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="text-[10px] text-stone-500 border-t border-pink-100 pt-3">
              O sistema organiza dados e tendências. A interpretação dos exames deve seguir o intervalo de referência informado no laudo e o contexto clínico do paciente.
            </div>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="bg-white/95 border border-pink-100 p-6 rounded-3xl shadow-sm space-y-3">
          <h3 className="text-sm font-extrabold text-pink-950">Checklists salvos</h3>
          <div className="space-y-2">
            {history.slice(0, 10).map(item => (
              <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 border border-pink-100 rounded-xl p-3">
                <div>
                  <div className="text-xs font-extrabold text-pink-950">{item.patientName}</div>
                  <div className="text-[10px] text-stone-500">
                    {new Date(item.createdAt).toLocaleString('pt-BR')} {item.protocol ? `• ${item.protocol}` : ''} {item.cycle ? `• ${item.cycle}` : ''}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => loadHistory(item)} className="bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 px-3 py-1.5 rounded-lg text-[11px] font-bold">Abrir</button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm('Excluir este checklist salvo?')) return
                      const next = history.filter(x => x.id !== item.id)
                      setHistory(next)
                      if (typeof window !== 'undefined') localStorage.setItem(storageKey, JSON.stringify(next))
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-[11px] font-bold"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


const readStudyFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error(`Não foi possível ler "${file.name}".`))
    reader.onload = () => resolve(String(reader.result || ''))
    reader.readAsDataURL(file)
  })

const compressStudyImage = async (
  file: File,
  maxSide = 1600,
  quality = 0.88
): Promise<string> => {
  const originalDataUrl = await readStudyFileAsDataUrl(file)

  return new Promise<string>((resolve, reject) => {
    const image = new Image()
    image.onerror = () => reject(new Error(`Não foi possível abrir a imagem "${file.name}".`))
    image.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height))
      const width = Math.max(1, Math.round(image.width * scale))
      const height = Math.max(1, Math.round(image.height * scale))
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('O navegador não conseguiu preparar a imagem.'))
        return
      }

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(image, 0, 0, width, height)

      const mime = file.type === 'image/png' && file.size < 2_000_000
        ? 'image/png'
        : 'image/jpeg'

      resolve(
        mime === 'image/png'
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/jpeg', quality)
      )
    }
    image.src = originalDataUrl
  })
}

const preparePersistentStudyAttachment = async (file: File): Promise<AttachedFile> => {
  const lower = file.name.toLowerCase()
  const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(lower)
  const isPdf = file.type === 'application/pdf' || lower.endsWith('.pdf')
  const isExcel = /\.(xlsx|xls|csv)$/i.test(lower)
  const isDocx = /\.(docx|doc)$/i.test(lower)

  if (!isImage && !isPdf && !isExcel && !isDocx) {
    throw new Error(`"${file.name}" não é um formato suportado.`)
  }

  if (isImage && file.size > 15 * 1024 * 1024) {
    throw new Error(`"${file.name}" ultrapassa 15 MB.`)
  }

  if (!isImage && file.size > 6 * 1024 * 1024) {
    throw new Error(`"${file.name}" ultrapassa 6 MB. Para materiais grandes, reduza o PDF antes de anexar.`)
  }

  const url = isImage
    ? await compressStudyImage(file, 1600, 0.88)
    : await readStudyFileAsDataUrl(file)

  const type: AttachedFile['type'] = isImage
    ? 'image'
    : isPdf
      ? 'pdf'
      : isExcel
        ? 'excel'
        : isDocx
          ? 'docx'
          : 'doc'

  const sizeMb = file.size / (1024 * 1024)
  const size = sizeMb < 0.1
    ? `${Math.max(1, Math.round(file.size / 1024))} KB`
    : `${sizeMb.toFixed(1)} MB`

  return {
    id: `att-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: file.name,
    type,
    size,
    url,
  }
}

const escapeStudyPlainText = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const normalizeStudyEditorValue = (value: string) => {
  if (!value) return ''
  const looksLikeHtml = /<(p|div|br|strong|b|em|i|u|s|strike|ol|ul|li|h1|h2|h3|blockquote|span|img|a|hr)\b/i.test(value)
  return looksLikeHtml ? value : escapeStudyPlainText(value).replace(/\n/g, '<br>')
}

const sanitizeStudyHtml = (html: string) => {
  if (typeof window === 'undefined') return html
  const parser = new DOMParser()
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstElementChild as HTMLElement | null
  if (!root) return ''

  root.querySelectorAll('script,style,iframe,object,embed,form,input,button,textarea,select').forEach(el => el.remove())

  root.querySelectorAll('*').forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      const name = attr.name.toLowerCase()
      const value = attr.value.trim().toLowerCase()

      if (name.startsWith('on')) el.removeAttribute(attr.name)
      if ((name === 'href' || name === 'src') && value.startsWith('javascript:')) {
        el.removeAttribute(attr.name)
      }
    })

    if (el.tagName === 'A') {
      el.setAttribute('target', '_blank')
      el.setAttribute('rel', 'noopener noreferrer')
    }

    if (el.tagName === 'IMG') {
      const img = el as HTMLImageElement
      img.style.maxWidth = '100%'
      img.style.height = 'auto'
      img.style.borderRadius = '12px'
      img.style.margin = '10px auto'
      img.style.display = 'block'
    }
  })

  return root.innerHTML
}

function StudyRichEditor({
  value,
  onChange,
  placeholder,
  onAttachMaterial,
}: {
  value: string
  onChange: (html: string) => void
  placeholder: string
  onAttachMaterial?: () => void
}) {
  const editorRef = useRef<HTMLDivElement>(null)
  const inlineImageInputRef = useRef<HTMLInputElement>(null)
  const savedRangeRef = useRef<Range | null>(null)
  const [isPreparingInlineImage, setIsPreparingInlineImage] = useState(false)

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    if (document.activeElement === editor) return

    const next = normalizeStudyEditorValue(value)
    if (editor.innerHTML !== next) editor.innerHTML = next
  }, [value])

  const rememberSelection = () => {
    const selection = window.getSelection()
    const editor = editorRef.current
    if (!selection || !editor || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    if (editor.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange()
    }
  }

  const restoreSelection = () => {
    const editor = editorRef.current
    if (!editor) return

    editor.focus()
    if (!savedRangeRef.current) return

    const selection = window.getSelection()
    if (!selection) return
    selection.removeAllRanges()
    selection.addRange(savedRangeRef.current)
  }

  const emitChange = () => {
    const editor = editorRef.current
    if (!editor) return
    const clean = sanitizeStudyHtml(editor.innerHTML)
    onChange(clean)
    rememberSelection()
  }

  const runCommand = (command: string, commandValue?: string) => {
    restoreSelection()
    document.execCommand(command, false, commandValue)
    emitChange()
  }

  const toolbarButton = (
    label: string,
    command: string,
    title: string,
    commandValue?: string,
    extraClass = ''
  ) => (
    <button
      type="button"
      title={title}
      onMouseDown={e => {
        e.preventDefault()
        runCommand(command, commandValue)
      }}
      className={`h-8 min-w-8 px-2 rounded-lg border border-stone-200 bg-white hover:bg-pink-50 hover:border-pink-300 text-[11px] font-extrabold text-stone-700 transition ${extraClass}`}
    >
      {label}
    </button>
  )

  const handleCreateLink = () => {
    rememberSelection()
    const url = window.prompt('Cole o endereço do link:')
    if (!url) return
    runCommand('createLink', url)
  }

  const insertInlineStudyImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('O conteúdo colado não é uma imagem válida.')
    }

    if (file.size > 15 * 1024 * 1024) {
      throw new Error('A imagem ultrapassa 15 MB.')
    }

    const dataUrl = await compressStudyImage(file, 1800, 0.92)
    restoreSelection()
    document.execCommand('insertImage', false, dataUrl)

    const editor = editorRef.current
    if (editor) {
      editor.querySelectorAll('img').forEach(img => {
        img.style.maxWidth = '100%'
        img.style.height = 'auto'
        img.style.borderRadius = '12px'
        img.style.margin = '12px auto'
        img.style.display = 'block'
      })
    }

    emitChange()
  }

  const handleInlineImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    try {
      setIsPreparingInlineImage(true)
      await insertInlineStudyImage(file)
    } catch (error: any) {
      alert(error instanceof Error ? error.message : 'Não foi possível inserir a imagem.')
    } finally {
      setIsPreparingInlineImage(false)
    }
  }

  const handleEditorPaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const clipboardItems = Array.from(e.clipboardData?.items || [])
    const imageFiles = clipboardItems
      .filter(item => item.kind === 'file' && item.type.startsWith('image/'))
      .map(item => item.getAsFile())
      .filter((file): file is File => Boolean(file))

    // Se não houver imagem, deixa o navegador colar texto normalmente.
    if (imageFiles.length === 0) return

    e.preventDefault()
    rememberSelection()

    try {
      setIsPreparingInlineImage(true)

      for (const file of imageFiles.slice(0, 4)) {
        await insertInlineStudyImage(file)
      }

      if (imageFiles.length > 4) {
        alert('Foram coladas as primeiras 4 imagens. Cole as demais em outro lote.')
      }
    } catch (error: any) {
      alert(error instanceof Error ? error.message : 'Não foi possível colar o print.')
    } finally {
      setIsPreparingInlineImage(false)
    }
  }

  const handlePrintEditor = () => {
    const html = sanitizeStudyHtml(editorRef.current?.innerHTML || normalizeStudyEditorValue(value))
    const printWindow = window.open('', '_blank', 'width=900,height=760')
    if (!printWindow) {
      alert('O navegador bloqueou a janela de impressão.')
      return
    }

    printWindow.document.write(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <title>Anotação VetWorkspace</title>
          <style>
            @page { size: A4; margin: 16mm; }
            body { font-family: Arial, sans-serif; color: #2f1b28; line-height: 1.55; font-size: 13px; }
            h1 { font-size: 24px; } h2 { font-size: 20px; } h3 { font-size: 16px; }
            img { max-width: 100%; height: auto; border-radius: 10px; }
            blockquote { border-left: 4px solid #f9a8d4; padding-left: 12px; color: #666; }
            table { border-collapse: collapse; width: 100%; }
            a { color: #9d174d; }
          </style>
        </head>
        <body>${html}</body>
        <script>window.onload = () => window.print()</script>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="border border-pink-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
      <input
        ref={inlineImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInlineImage}
      />

      <div className="bg-stone-50/90 border-b border-pink-100 p-2.5 flex flex-wrap items-center gap-1.5 sticky top-0 z-10">
        {toolbarButton('↶', 'undo', 'Desfazer')}
        {toolbarButton('↷', 'redo', 'Refazer')}

        <span className="w-px h-6 bg-stone-200 mx-0.5" />

        <select
          defaultValue="P"
          title="Estilo do parágrafo"
          onMouseDown={rememberSelection}
          onChange={e => {
            runCommand('formatBlock', e.target.value)
            e.target.value = 'P'
          }}
          className="h-8 bg-white border border-stone-200 rounded-lg px-2 text-[10px] font-bold text-stone-700"
        >
          <option value="P">Texto</option>
          <option value="H1">Título 1</option>
          <option value="H2">Título 2</option>
          <option value="H3">Título 3</option>
          <option value="BLOCKQUOTE">Citação</option>
        </select>

        <select
          defaultValue="3"
          title="Tamanho da fonte"
          onMouseDown={rememberSelection}
          onChange={e => {
            runCommand('fontSize', e.target.value)
            e.target.value = '3'
          }}
          className="h-8 bg-white border border-stone-200 rounded-lg px-2 text-[10px] font-bold text-stone-700"
        >
          <option value="2">Pequena</option>
          <option value="3">Normal</option>
          <option value="4">Grande</option>
          <option value="5">Muito grande</option>
        </select>

        <span className="w-px h-6 bg-stone-200 mx-0.5" />

        {toolbarButton('B', 'bold', 'Negrito', undefined, 'font-black')}
        {toolbarButton('I', 'italic', 'Itálico', undefined, 'italic')}
        {toolbarButton('U', 'underline', 'Sublinhado', undefined, 'underline')}
        {toolbarButton('S', 'strikeThrough', 'Tachado', undefined, 'line-through')}

        <label title="Cor do texto" className="h-8 px-2 rounded-lg border border-stone-200 bg-white hover:bg-pink-50 flex items-center gap-1 text-[9px] font-bold text-stone-500 cursor-pointer">
          A
          <input
            type="color"
            defaultValue="#5b213d"
            className="w-4 h-4 p-0 border-0 bg-transparent cursor-pointer"
            onMouseDown={rememberSelection}
            onChange={e => runCommand('foreColor', e.target.value)}
          />
        </label>

        <label title="Marca-texto" className="h-8 px-2 rounded-lg border border-stone-200 bg-white hover:bg-pink-50 flex items-center gap-1 text-[9px] font-bold text-stone-500 cursor-pointer">
          🖍
          <input
            type="color"
            defaultValue="#fff3a3"
            className="w-4 h-4 p-0 border-0 bg-transparent cursor-pointer"
            onMouseDown={rememberSelection}
            onChange={e => runCommand('hiliteColor', e.target.value)}
          />
        </label>

        <span className="w-px h-6 bg-stone-200 mx-0.5" />

        {toolbarButton('• Lista', 'insertUnorderedList', 'Lista com marcadores')}
        {toolbarButton('1. Lista', 'insertOrderedList', 'Lista numerada')}
        {toolbarButton('←', 'outdent', 'Diminuir recuo')}
        {toolbarButton('→', 'indent', 'Aumentar recuo')}

        <span className="w-px h-6 bg-stone-200 mx-0.5" />

        {toolbarButton('≡', 'justifyLeft', 'Alinhar à esquerda')}
        {toolbarButton('≣', 'justifyCenter', 'Centralizar')}
        {toolbarButton('☷', 'justifyRight', 'Alinhar à direita')}
        {toolbarButton('―', 'insertHorizontalRule', 'Linha horizontal')}

        <span className="w-px h-6 bg-stone-200 mx-0.5" />

        <button
          type="button"
          title="Inserir link"
          onMouseDown={e => {
            e.preventDefault()
            handleCreateLink()
          }}
          className="h-8 px-2 rounded-lg border border-stone-200 bg-white hover:bg-pink-50 text-[10px] font-bold text-stone-700"
        >
          🔗 Link
        </button>

        <button
          type="button"
          title="Inserir imagem dentro da anotação"
          disabled={isPreparingInlineImage}
          onMouseDown={e => {
            e.preventDefault()
            rememberSelection()
            inlineImageInputRef.current?.click()
          }}
          className="h-8 px-2 rounded-lg border border-stone-200 bg-white hover:bg-pink-50 disabled:opacity-50 text-[10px] font-bold text-stone-700"
        >
          {isPreparingInlineImage ? 'Preparando…' : '🖼 Imagem'}
        </button>

        {onAttachMaterial && (
          <button
            type="button"
            title="Anexar PDF, imagem, Word ou planilha"
            onMouseDown={e => {
              e.preventDefault()
              rememberSelection()
              onAttachMaterial()
            }}
            className="h-8 px-2 rounded-lg border border-pink-200 bg-pink-50 hover:bg-pink-100 text-[10px] font-bold text-pink-800"
          >
            📎 Anexar
          </button>
        )}

        <button
          type="button"
          title="Remover formatação"
          onMouseDown={e => {
            e.preventDefault()
            runCommand('removeFormat')
          }}
          className="h-8 px-2 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-[10px] font-bold text-stone-600"
        >
          Limpar
        </button>

        <button
          type="button"
          title="Imprimir ou salvar em PDF"
          onMouseDown={e => {
            e.preventDefault()
            handlePrintEditor()
          }}
          className="h-8 px-2 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-[10px] font-bold text-stone-700"
        >
          🖨 Imprimir
        </button>

        <span
          className="ml-auto text-[9px] font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-1 rounded-lg"
          title="No Windows: use Win + Shift + S, depois clique no texto e pressione Ctrl + V"
        >
          📋 Cole prints com Ctrl + V
        </span>
        <span className="text-[9px] font-bold text-emerald-600 px-2">
          ✓ Salvamento automático
        </span>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emitChange}
        onPaste={handleEditorPaste}
        onMouseUp={rememberSelection}
        onKeyUp={rememberSelection}
        onFocus={rememberSelection}
        onBlur={() => {
          rememberSelection()
          emitChange()
        }}
        className="min-h-[360px] max-h-[620px] overflow-y-auto p-5 md:p-6 text-sm leading-relaxed text-stone-800 focus:outline-none
          empty:before:content-[attr(data-placeholder)] empty:before:text-stone-300
          [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-pink-950 [&_h1]:mb-3
          [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-pink-950 [&_h2]:mb-2
          [&_h3]:text-base [&_h3]:font-extrabold [&_h3]:text-pink-900 [&_h3]:mb-2
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2
          [&_li]:my-1
          [&_blockquote]:border-l-4 [&_blockquote]:border-pink-200 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-stone-600
          [&_a]:text-pink-700 [&_a]:underline
          [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-3"
      />
    </div>
  )
}


const buildStudySections = (item: DocumentItem): DocumentSection[] => {
  if (Array.isArray(item.sections) && item.sections.length > 0) {
    return [...item.sections]
      .map((section, index) => ({
        id: section.id || `section-${index}`,
        title: section.title?.trim() || `Aba ${index + 1}`,
        content: section.content || '',
        order: Number.isFinite(section.order) ? section.order : index,
      }))
      .sort((a, b) => a.order - b.order)
  }

  // Migração transparente das três abas antigas para o novo sistema.
  return [
    {
      id: 'resumo',
      title: 'Prescrição & Conteúdo',
      content: item.content || '',
      order: 0,
    },
    {
      id: 'diferenciais',
      title: 'Diagnósticos Diferenciais',
      content: item.differential || '',
      order: 1,
    },
    {
      id: 'pontos',
      title: 'Observações & Posologia',
      content: item.notes || '',
      order: 2,
    },
  ]
}

const syncLegacyStudyFields = (
  item: DocumentItem,
  sections: DocumentSection[]
): Partial<DocumentItem> => ({
  // Mantém compatibilidade com versões antigas do VetWorkspace.
  content: sections.find(section => section.id === 'resumo')?.content ?? item.content ?? '',
  differential: sections.find(section => section.id === 'diferenciais')?.content ?? item.differential ?? '',
  notes: sections.find(section => section.id === 'pontos')?.content ?? item.notes ?? '',
})

export default function VetWorkspaceBeatrizV28() {
  const [isMounted, setIsMounted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const lastLocalMutationRef = useRef<number>(0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const [activeTab, setActiveTab] = useState<'painel' | 'estudos' | 'pacientes' | 'calculadora' | 'bsa' | 'ia' | 'condolencias' | 'tarefas' | 'calendario' | 'financas' | 'wishlist' | 'clinicas' | 'especialistas' | 'pessoal' | 'labref' | 'protocolos' | 'nadir' | 'extravasamento' | 'ajustes' | 'funcaorganica' | 'toxicidadevcog' | 'interacoesonco' | 'posquimio' | 'histologia' | 'nutricaoenergia' | 'nutricaoecc' | 'nutricaotoxicos' | 'nutricaodieta' | 'receitas'>('painel')
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

  const parseCurrencyInput = (raw: string) => {
    const cleaned = String(raw || '')
      .trim()
      .replace(/R\$/gi, '')
      .replace(/\s+/g, '')
      .replace(/[^0-9,.-]/g, '')

    if (!cleaned) return NaN

    const lastComma = cleaned.lastIndexOf(',')
    const lastDot = cleaned.lastIndexOf('.')
    let normalized = cleaned

    if (lastComma > lastDot) {
      // Formato brasileiro: 55.853,43 / 1500,50
      normalized = cleaned.replace(/\./g, '').replace(',', '.')
    } else if (lastDot > lastComma) {
      if (lastComma >= 0) {
        // Formato internacional: 55,853.43
        normalized = cleaned.replace(/,/g, '')
      } else {
        const parts = cleaned.split('.')
        // No Brasil, "55.853" normalmente significa 55 mil 853.
        if (parts.length > 1 && parts.slice(1).every(part => part.length === 3)) {
          normalized = parts.join('')
        } else if (parts.length > 2) {
          const decimal = parts.pop() || ''
          normalized = `${parts.join('')}.${decimal}`
        }
      }
    } else if (lastComma >= 0) {
      normalized = cleaned.replace(',', '.')
    }

    const value = Number(normalized)
    return Number.isFinite(value) ? value : NaN
  }

  const maskValue = (val: number) => {
    if (!showValues) return 'R$ •••••'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(val) || 0)
  }

  const [todayObj, setTodayObj] = useState(() => new Date())

  // Mantém data/mês/ano sincronizados com o relógio real do dispositivo.
  // Assim, se o site ficar aberto durante a virada do dia ou do mês,
  // o calendário se atualiza sozinho sem precisar recarregar a página.
  useEffect(() => {
    const refreshCurrentDate = () => setTodayObj(new Date())
    refreshCurrentDate()
    const timer = window.setInterval(refreshCurrentDate, 60_000)
    return () => window.clearInterval(timer)
  }, [])

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
  const [isStudyFileProcessing, setIsStudyFileProcessing] = useState(false)
  const shiftPhotoInputRef = useRef<HTMLInputElement>(null)
  const petPhotoInputRef = useRef<HTMLInputElement>(null)

  const [studySubTab, setStudySubTab] = useState<string>('resumo')
  const [isAddingStudyTab, setIsAddingStudyTab] = useState(false)
  const [newStudyTabTitle, setNewStudyTabTitle] = useState('')
  const [editingStudyTabId, setEditingStudyTabId] = useState<string | null>(null)
  const [editingStudyTabTitle, setEditingStudyTabTitle] = useState('')

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
  const [aiStatus, setAiStatus] = useState<'ready' | 'online' | 'error'>('ready')
  const [aiErrorDetail, setAiErrorDetail] = useState('')
  const [aiPatientContextId, setAiPatientContextId] = useState('')
  const [aiResponseMode, setAiResponseMode] = useState<'clinical' | 'tutor' | 'record'>('clinical')
  const [aiAttachments, setAiAttachments] = useState<AiAttachment[]>([])
  const [isPreparingAiAttachment, setIsPreparingAiAttachment] = useState(false)
  const [lastAiRequestFiles, setLastAiRequestFiles] = useState<Record<string, string[]>>({})
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const aiAttachmentInputRef = useRef<HTMLInputElement>(null)

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

  // Specialist Consultations state ("finanças extras" por fora) com suporte a clínica e edição
  const [specialistConsultations, setSpecialistConsultations] = useState<SpecialistConsultationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_specialist_consultations_v28')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return []
  })
  const [specClinicId, setSpecClinicId] = useState('c-1')
  const [specSpecialty, setSpecSpecialty] = useState('')
  const [specQuantity, setSpecQuantity] = useState('1')
  const [specUnitValue, setSpecUnitValue] = useState('')
  const [specDate, setSpecDate] = useState(todayDateKey)
  const [specNotes, setSpecNotes] = useState('')

  // Estados para edição de consulta de especialista
  const [editingSpecialistId, setEditingSpecialistId] = useState<string | null>(null)
  const [editSpecClinicId, setEditSpecClinicId] = useState('')
  const [editSpecSpecialty, setEditSpecSpecialty] = useState('')
  const [editSpecQuantity, setEditSpecQuantity] = useState('1')
  const [editSpecUnitValue, setEditSpecUnitValue] = useState('')
  const [editSpecDate, setEditSpecDate] = useState('')
  const [editSpecNotes, setEditSpecNotes] = useState('')

  const handleAddSpecialistConsultation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!specSpecialty.trim() || !specUnitValue) return
    lastLocalMutationRef.current = Date.now()
    const newSpec: SpecialistConsultationItem = {
      id: Date.now().toString(),
      clinicId: specClinicId,
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
  const [wishlistSyncData, setWishlistSyncData] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vet_wishlist')
        return saved ? JSON.parse(saved) : []
      } catch(e) {}
    }
    return []
  })
  const wishlistLocalSnapshotRef = useRef<string>('')
  const wishlistLastSyncedRef = useRef<string>('')
  const [wishlistCloudReady, setWishlistCloudReady] = useState(false)
  const [wishlistRemoteVersion, setWishlistRemoteVersion] = useState(0)

  const [descompressaoNotes, setDescompressaoNotes] = useState<string>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('vet_descomp_v28') || ''
    return ''
  })

  useEffect(() => {
    let cancelled = false

    const applyWishlistFromCloud = (items: any[]) => {
      if (cancelled) return
      const normalized = Array.isArray(items) ? items : []
      const json = JSON.stringify(normalized)
      wishlistLastSyncedRef.current = json
      wishlistLocalSnapshotRef.current = json
      localStorage.setItem('vet_wishlist', json)
      setWishlistSyncData(normalized)
      setWishlistRemoteVersion(version => version + 1)
    }

    const loadWishlistCloud = async () => {
      try {
        const { data: dedicated, error: dedicatedError } = await supabase
          .from('app_data')
          .select('data')
          .eq('id', 'beatriz_wishlist_v28')
          .maybeSingle()

        if (!dedicatedError && dedicated?.data && Array.isArray(dedicated.data.items)) {
          applyWishlistFromCloud(dedicated.data.items)
          return
        }

        // Migração: busca a lista que eventualmente já estava salva dentro do workspace principal.
        const { data: workspace } = await supabase
          .from('app_data')
          .select('data')
          .eq('id', 'beatriz_workspace_v28')
          .maybeSingle()

        if (workspace?.data && Array.isArray(workspace.data.wishlist)) {
          applyWishlistFromCloud(workspace.data.wishlist)
          return
        }

        // Se nunca houve lista na nuvem, usa o que existe neste navegador como ponto inicial.
        const localRaw = localStorage.getItem('vet_wishlist') || '[]'
        try {
          const localItems = JSON.parse(localRaw)
          applyWishlistFromCloud(Array.isArray(localItems) ? localItems : [])
        } catch {
          applyWishlistFromCloud([])
        }
      } finally {
        if (!cancelled) setWishlistCloudReady(true)
      }
    }

    loadWishlistCloud()

    const channel = supabase
      .channel('wishlist_realtime_v28')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'app_data', filter: 'id=eq.beatriz_wishlist_v28' },
        (payload: any) => {
          const remoteItems = payload?.new?.data?.items
          if (!Array.isArray(remoteItems)) return

          const json = JSON.stringify(remoteItems)
          if (json === wishlistLastSyncedRef.current) return
          applyWishlistFromCloud(remoteItems)
        }
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [])

  // WishlistTab ainda mantém seu estado interno no localStorage. Esta ponte captura
  // somente alterações feitas neste navegador e leva para o estado sincronizado.
  useEffect(() => {
    if (typeof window === 'undefined' || !wishlistCloudReady) return

    const readWishlistFromLocalComponent = () => {
      const raw = localStorage.getItem('vet_wishlist') || '[]'
      if (raw === wishlistLocalSnapshotRef.current) return

      try {
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) return
        wishlistLocalSnapshotRef.current = raw
        setWishlistSyncData(parsed)
      } catch(e) {}
    }

    readWishlistFromLocalComponent()
    const timer = window.setInterval(readWishlistFromLocalComponent, 500)
    return () => window.clearInterval(timer)
  }, [wishlistCloudReady])

  // Salva a lista em uma linha própria. Assim alterações em finanças, tarefas,
  // estudos etc. não conseguem sobrescrever uma wishlist nova com uma cópia antiga.
  useEffect(() => {
    if (!wishlistCloudReady) return

    const json = JSON.stringify(wishlistSyncData)
    localStorage.setItem('vet_wishlist', json)
    wishlistLocalSnapshotRef.current = json

    if (json === wishlistLastSyncedRef.current) return

    const timer = window.setTimeout(async () => {
      const { error } = await supabase
        .from('app_data')
        .upsert({
          id: 'beatriz_wishlist_v28',
          data: { items: wishlistSyncData },
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })

      if (!error) {
        wishlistLastSyncedRef.current = json
      } else {
        console.error('Erro ao sincronizar wishlist:', error)
      }
    }, 500)

    return () => window.clearTimeout(timer)
  }, [wishlistCloudReady, wishlistSyncData])

  const [gameIndex, setGameIndex] = useState(0)
  const [cafeIndex, setCafeIndex] = useState(0)
  const [podcastIndex, setPodcastIndex] = useState(0)
  const [entertainmentIndex, setEntertainmentIndex] = useState(0)

  const [personalMediaItems, setPersonalMediaItems] = useState<PersonalMediaItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_personal_media_v28')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          return Array.isArray(parsed) ? parsed : []
        } catch(e) {}
      }
    }
    return []
  })
  const [personalMediaGoals, setPersonalMediaGoals] = useState<PersonalMediaGoals>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_personal_media_goals_v28')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          return {
            Livro: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Livro, ...(parsed.Livro || {}) },
            Filme: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Filme, ...(parsed.Filme || {}) },
            Série: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Série, ...(parsed.Série || {}) },
            Jogo: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Jogo, ...(parsed.Jogo || {}) },
            Cafeteria: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Cafeteria, ...(parsed.Cafeteria || {}) },
            Podcast: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Podcast, ...(parsed.Podcast || {}) },
          }
        } catch(e) {}
      }
    }
    return DEFAULT_PERSONAL_MEDIA_GOALS
  })
  const [newPersonalMediaType, setNewPersonalMediaType] = useState<PersonalMediaType>('Livro')
  const [newPersonalMediaTitle, setNewPersonalMediaTitle] = useState('')
  const [newPersonalMediaNotes, setNewPersonalMediaNotes] = useState('')
  const [newPersonalMediaImageUrl, setNewPersonalMediaImageUrl] = useState('')
  const [editingPersonalMediaId, setEditingPersonalMediaId] = useState<string | null>(null)
  const [editingPersonalMediaTitle, setEditingPersonalMediaTitle] = useState('')
  const [editingPersonalMediaNotes, setEditingPersonalMediaNotes] = useState('')
  const [editingPersonalMediaReview, setEditingPersonalMediaReview] = useState('')
  const [editingProgressCurrent, setEditingProgressCurrent] = useState('')
  const [editingProgressTotal, setEditingProgressTotal] = useState('')
  const [editingProgressNote, setEditingProgressNote] = useState('')
  const [isPreparingPersonalMediaImage, setIsPreparingPersonalMediaImage] = useState(false)
  const [openMediaHistory, setOpenMediaHistory] = useState<Record<PersonalMediaType, boolean>>({
    Livro: false,
    Filme: false,
    Série: false,
    Jogo: false,
    Cafeteria: false,
    Podcast: false,
  })
  const [personalMediaFilterByType, setPersonalMediaFilterByType] = useState<Record<PersonalMediaType, PersonalMediaFilter>>({
    Livro: 'todos',
    Filme: 'todos',
    Série: 'todos',
    Jogo: 'todos',
    Cafeteria: 'todos',
    Podcast: 'todos',
  })
  const [personalMediaSortByType, setPersonalMediaSortByType] = useState<Record<PersonalMediaType, PersonalMediaSort>>({
    Livro: 'recentes',
    Filme: 'recentes',
    Série: 'recentes',
    Jogo: 'recentes',
    Cafeteria: 'recentes',
    Podcast: 'recentes',
  })
  const [personalMediaPickByType, setPersonalMediaPickByType] = useState<Record<PersonalMediaType, string>>({
    Livro: '',
    Filme: '',
    Série: '',
    Jogo: '',
    Cafeteria: '',
    Podcast: '',
  })

  const personalMediaStatusMeta = (type: PersonalMediaType, status: PersonalMediaStatus) => {
    if (type === 'Cafeteria') {
      if (status === 'concluido') return { label: 'Visitado', shortLabel: 'Visitado', color: 'emerald' }
      if (status === 'em_andamento') return { label: 'Visita planejada', shortLabel: 'Planejado', color: 'amber' }
      return { label: 'Quero conhecer', shortLabel: 'Quero conhecer', color: 'rose' }
    }
    if (type === 'Podcast') {
      if (status === 'concluido') return { label: 'Ouvido', shortLabel: 'Ouvido', color: 'emerald' }
      if (status === 'em_andamento') return { label: 'Ouvindo', shortLabel: 'Ouvindo', color: 'amber' }
      return { label: 'Quero ouvir', shortLabel: 'Quero ouvir', color: 'rose' }
    }
    if (type === 'Livro') {
      if (status === 'concluido') return { label: 'Lido', shortLabel: 'Lido', color: 'emerald' }
      if (status === 'em_andamento') return { label: 'Lendo', shortLabel: 'Lendo', color: 'amber' }
      return { label: 'Quero ler', shortLabel: 'Quero ler', color: 'rose' }
    }
    if (type === 'Jogo') {
      if (status === 'concluido') return { label: 'Concluído / zerado', shortLabel: 'Concluído', color: 'emerald' }
      if (status === 'em_andamento') return { label: 'Jogando', shortLabel: 'Jogando', color: 'amber' }
      return { label: 'Quero jogar', shortLabel: 'Quero jogar', color: 'rose' }
    }
    if (type === 'Série') {
      if (status === 'concluido') return { label: 'Concluída', shortLabel: 'Concluída', color: 'emerald' }
      if (status === 'em_andamento') return { label: 'Assistindo', shortLabel: 'Assistindo', color: 'amber' }
      return { label: 'Quero assistir', shortLabel: 'Quero assistir', color: 'rose' }
    }
    if (status === 'concluido') return { label: 'Assistido', shortLabel: 'Assistido', color: 'emerald' }
    if (status === 'em_andamento') return { label: 'Assistindo', shortLabel: 'Assistindo', color: 'amber' }
    return { label: 'Quero assistir', shortLabel: 'Quero assistir', color: 'rose' }
  }

  const addPersonalMediaItem = (
    type: PersonalMediaType,
    title: string,
    notes = '',
    status: PersonalMediaStatus = 'quero',
    imageUrl = ''
  ) => {
    const cleanTitle = title.trim()
    if (!cleanTitle) return

    const alreadyExists = personalMediaItems.some(item =>
      item.type === type &&
      item.title.trim().toLocaleLowerCase('pt-BR') === cleanTitle.toLocaleLowerCase('pt-BR')
    )
    if (alreadyExists) {
      alert(`"${cleanTitle}" já está salvo na lista de ${type.toLocaleLowerCase('pt-BR')}.`)
      return
    }

    lastLocalMutationRef.current = Date.now()
    setPersonalMediaItems(prev => [
      {
        id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        title: cleanTitle,
        notes: notes.trim(),
        status,
        createdAt: new Date().toISOString(),
        completedAt: status === 'concluido' ? new Date().toISOString() : undefined,
        archived: false,
        imageUrl: imageUrl || undefined,
        rating: 0,
        favorite: false,
        review: '',
      },
      ...prev,
    ])
  }

  const handleAddPersonalMedia = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPersonalMediaTitle.trim()) return
    addPersonalMediaItem(
      newPersonalMediaType,
      newPersonalMediaTitle,
      newPersonalMediaNotes,
      'quero',
      newPersonalMediaImageUrl
    )
    setNewPersonalMediaTitle('')
    setNewPersonalMediaNotes('')
    setNewPersonalMediaImageUrl('')
  }

  const patchPersonalMediaItem = (id: string, patch: Partial<PersonalMediaItem>) => {
    lastLocalMutationRef.current = Date.now()
    setPersonalMediaItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...patch } : item
    ))
  }

  const updatePersonalMediaStatus = (id: string, status: PersonalMediaStatus) => {
    lastLocalMutationRef.current = Date.now()
    setPersonalMediaItems(prev => prev.map(item =>
      item.id === id
        ? {
            ...item,
            status,
            completedAt: status === 'concluido'
              ? (item.completedAt || new Date().toISOString())
              : undefined,
          }
        : item
    ))
  }

  const preparePersonalMediaImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Escolha ou cole uma imagem válida.')
    }
    if (file.size > 15 * 1024 * 1024) {
      throw new Error('A imagem ultrapassa 15 MB.')
    }
    return compressStudyImage(file, 900, 0.84)
  }

  const setPersonalMediaItemImage = async (id: string, file: File) => {
    try {
      setIsPreparingPersonalMediaImage(true)
      const imageUrl = await preparePersonalMediaImage(file)
      patchPersonalMediaItem(id, { imageUrl })
    } catch (error: any) {
      alert(error instanceof Error ? error.message : 'Não foi possível preparar a capa.')
    } finally {
      setIsPreparingPersonalMediaImage(false)
    }
  }

  const setNewPersonalMediaImage = async (type: PersonalMediaType, file: File) => {
    try {
      setIsPreparingPersonalMediaImage(true)
      const imageUrl = await preparePersonalMediaImage(file)
      setNewPersonalMediaType(type)
      setNewPersonalMediaImageUrl(imageUrl)
    } catch (error: any) {
      alert(error instanceof Error ? error.message : 'Não foi possível preparar a capa.')
    } finally {
      setIsPreparingPersonalMediaImage(false)
    }
  }

  const handlePersonalMediaCardPaste = async (
    id: string,
    e: React.ClipboardEvent<HTMLElement>
  ) => {
    const imageFile = Array.from(e.clipboardData?.items || [])
      .find(item => item.kind === 'file' && item.type.startsWith('image/'))
      ?.getAsFile()
    if (!imageFile) return
    e.preventDefault()
    await setPersonalMediaItemImage(id, imageFile)
  }

  const handleNewPersonalMediaPaste = async (
    type: PersonalMediaType,
    e: React.ClipboardEvent<HTMLElement>
  ) => {
    const imageFile = Array.from(e.clipboardData?.items || [])
      .find(item => item.kind === 'file' && item.type.startsWith('image/'))
      ?.getAsFile()
    if (!imageFile) return
    e.preventDefault()
    await setNewPersonalMediaImage(type, imageFile)
  }

  const savePersonalMediaEdit = (id: string) => {
    const title = editingPersonalMediaTitle.trim()
    if (!title) return

    const currentRaw = Number(editingProgressCurrent.replace(',', '.'))
    const totalRaw = Number(editingProgressTotal.replace(',', '.'))

    patchPersonalMediaItem(id, {
      title,
      notes: editingPersonalMediaNotes.trim(),
      review: editingPersonalMediaReview.trim(),
      progressCurrent: Number.isFinite(currentRaw) && currentRaw >= 0 ? currentRaw : undefined,
      progressTotal: Number.isFinite(totalRaw) && totalRaw > 0 ? totalRaw : undefined,
      progressNote: editingProgressNote.trim() || undefined,
    })

    setEditingPersonalMediaId(null)
    setEditingPersonalMediaTitle('')
    setEditingPersonalMediaNotes('')
    setEditingPersonalMediaReview('')
    setEditingProgressCurrent('')
    setEditingProgressTotal('')
    setEditingProgressNote('')
  }

  const startPersonalMediaEdit = (item: PersonalMediaItem) => {
    setEditingPersonalMediaId(item.id)
    setEditingPersonalMediaTitle(item.title)
    setEditingPersonalMediaNotes(item.notes || '')
    setEditingPersonalMediaReview(item.review || '')
    setEditingProgressCurrent(item.progressCurrent !== undefined ? String(item.progressCurrent) : '')
    setEditingProgressTotal(item.progressTotal !== undefined ? String(item.progressTotal) : '')
    setEditingProgressNote(item.progressNote || '')
  }

  const cancelPersonalMediaEdit = () => {
    setEditingPersonalMediaId(null)
    setEditingPersonalMediaTitle('')
    setEditingPersonalMediaNotes('')
    setEditingPersonalMediaReview('')
    setEditingProgressCurrent('')
    setEditingProgressTotal('')
    setEditingProgressNote('')
  }

  const archivePersonalMediaItem = (id: string) => {
    patchPersonalMediaItem(id, { archived: true })
  }

  const restorePersonalMediaItem = (id: string) => {
    patchPersonalMediaItem(id, { archived: false })
  }

  const archiveCompletedPersonalMedia = (type: PersonalMediaType) => {
    const hasCompleted = personalMediaItems.some(item =>
      item.type === type && item.status === 'concluido' && !item.archived
    )
    if (!hasCompleted) return
    lastLocalMutationRef.current = Date.now()
    setPersonalMediaItems(prev => prev.map(item =>
      item.type === type && item.status === 'concluido'
        ? { ...item, archived: true }
        : item
    ))
  }

  const updatePersonalMediaGoal = (
    type: PersonalMediaType,
    field: keyof PersonalMediaGoal,
    value: number
  ) => {
    const safeValue = Math.max(0, Math.floor(Number(value) || 0))
    lastLocalMutationRef.current = Date.now()
    setPersonalMediaGoals(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: safeValue,
      },
    }))
  }

  const choosePersonalMediaForMe = (type: PersonalMediaType) => {
    const candidates = personalMediaItems.filter(item =>
      item.type === type &&
      !item.archived &&
      item.status !== 'concluido'
    )
    if (candidates.length === 0) {
      alert('Não há itens pendentes nessa lista para sortear.')
      return
    }
    const chosen = candidates[Math.floor(Math.random() * candidates.length)]
    setPersonalMediaPickByType(prev => ({ ...prev, [type]: chosen.id }))
  }

  const deletePersonalMediaItem = (id: string) => {
    if (!confirm('Excluir este item definitivamente, inclusive do histórico?')) return
    lastLocalMutationRef.current = Date.now()
    setPersonalMediaItems(prev => prev.filter(item => item.id !== id))
  }


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
  const [isPetPhotoProcessing, setIsPetPhotoProcessing] = useState(false)

  const handleAddPersonalPet = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPetBiaName.trim() || isPetPhotoProcessing) return
    lastLocalMutationRef.current = Date.now()
    const newP: PersonalPet = {
      id: Date.now().toString(),
      name: newPetBiaName.trim(),
      species: newPetBiaSpecies.trim(),
      age: newPetBiaAge.trim() || 'Idade não informada',
      tribute: newPetBiaTribute.trim() || 'Amor eterno',
      photoUrl: newPetBiaPhotoUrl || '',
      isMemorial: newPetBiaMemorial
    }
    setPersonalPets([newP, ...personalPets])
    setNewPetBiaName('')
    setNewPetBiaAge('')
    setNewPetBiaTribute('')
    setNewPetBiaPhotoUrl('')
    setNewPetBiaMemorial(false)
  }

  const handlePetPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Selecione uma imagem válida.')
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('A foto é muito grande. Escolha uma imagem com até 15 MB.')
      return
    }

    setIsPetPhotoProcessing(true)

    try {
      const originalDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => reject(new Error('Não foi possível ler a foto.'))
        reader.onload = () => resolve(String(reader.result || ''))
        reader.readAsDataURL(file)
      })

      const persistentDataUrl = await new Promise<string>((resolve, reject) => {
        const image = new Image()
        image.onerror = () => reject(new Error('Não foi possível abrir a foto selecionada.'))
        image.onload = () => {
          const maxSide = 1000
          const scale = Math.min(1, maxSide / Math.max(image.width, image.height))
          const width = Math.max(1, Math.round(image.width * scale))
          const height = Math.max(1, Math.round(image.height * scale))

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('O navegador não conseguiu preparar a foto.'))
            return
          }

          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(image, 0, 0, width, height)

          resolve(canvas.toDataURL('image/jpeg', 0.82))
        }
        image.src = originalDataUrl
      })

      setNewPetBiaPhotoUrl(persistentDataUrl)
    } catch (error: any) {
      alert(error instanceof Error ? error.message : 'Não foi possível preparar a foto.')
    } finally {
      setIsPetPhotoProcessing(false)
    }
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

    const rate = shiftBaseRate.trim() === '' ? 0 : Number(shiftBaseRate)
    const comm = shiftCommission.trim() === '' ? 0 : Number(shiftCommission)

    if (!Number.isFinite(rate) || rate < 0 || !Number.isFinite(comm) || comm < 0) {
      alert('Confira os valores da diária e da comissão.')
      return
    }

    if (rate === 0 && comm === 0) {
      alert('Informe pelo menos o valor da diária ou o valor da comissão.')
      return
    }

    const automaticDetails =
      rate > 0 && comm > 0
        ? 'Diária + comissão'
        : rate > 0
          ? 'Somente diária'
          : 'Somente comissão'

    lastLocalMutationRef.current = Date.now()

    const newS: ShiftRecord = {
      id: Date.now().toString(),
      clinicId: selectedShiftClinicId,
      date: shiftDate,
      baseRate: rate,
      commission: comm,
      status: shiftStatus,
      details: shiftDetails.trim() || automaticDetails,
      paidDate: shiftStatus === 'Pago' ? shiftDate : undefined
    }

    setShifts([newS, ...shifts])
    setShiftBaseRate('')
    setShiftCommission('')
    setShiftDetails('')
  }

  const getShiftValue = (shift: ShiftRecord) => (Number(shift.baseRate) || 0) + (Number(shift.commission) || 0)
  const totalShiftsAmount = shifts.reduce((acc, s) => acc + getShiftValue(s), 0)
  const totalShiftDailyAmount = shifts.reduce((acc, s) => acc + (Number(s.baseRate) || 0), 0)
  const totalShiftCommissionAmount = shifts.reduce((acc, s) => acc + (Number(s.commission) || 0), 0)
  const totalShiftsPaidAmount = shifts.filter(s => s.status === 'Pago').reduce((acc, s) => acc + getShiftValue(s), 0)
  const totalShiftsPendingAmount = shifts.filter(s => s.status !== 'Pago').reduce((acc, s) => acc + getShiftValue(s), 0)

  const handleToggleShiftStatus = (shiftId: string) => {
    lastLocalMutationRef.current = Date.now()
    setShifts(prev => prev.map(shift => {
      if (shift.id !== shiftId) return shift
      if (shift.status === 'Pago') {
        return { ...shift, status: 'Pendente', paidDate: undefined }
      }
      return { ...shift, status: 'Pago', paidDate: todayDateKey }
    }))
  }

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

  // Estados de Oncologia Avançada — precisam ficar no nível superior do componente.
  // Hooks dentro dos blocos condicionais das abas quebravam a ordem de Hooks do React.
  const [selectedProtocol, setSelectedProtocol] = useState<number>(0)
  const [protWeight, setProtWeight] = useState<string>('')
  const [protSpecies, setProtSpecies] = useState<'cao' | 'gato'>('cao')
  const [protResults, setProtResults] = useState<any[]>([])

  const [nadirDate, setNadirDate] = useState<string>('')
  const [nadirDrug, setNadirDrug] = useState<string>('Doxorrubicina')
  const [nadirPatientId, setNadirPatientId] = useState<string>('')
  const [nadirResult, setNadirResult] = useState<any>(null)

  const [adjWeight, setAdjWeight] = useState<string>('')
  const [adjSpecies, setAdjSpecies] = useState<'cao' | 'gato'>('cao')
  const [adjECC, setAdjECC] = useState<string>('5')
  const [adjDrug, setAdjDrug] = useState<string>('Doxorrubicina')
  const [adjResult, setAdjResult] = useState<any>(null)

  const [foChemo, setFoChemo] = useState<string>('Doxorrubicina')
  const [foCreat, setFoCreat] = useState<string>('')
  const [foALT, setFoALT] = useState<string>('')
  const [foFA, setFoFA] = useState<string>('')
  const [foSpecies, setFoSpecies] = useState<'cao' | 'gato'>('cao')
  const [foResult, setFoResult] = useState<any[]>([])

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

  const MAX_AI_ATTACHMENTS = 5
  const MAX_AI_FILE_BYTES = 15 * 1024 * 1024

  const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error(`Não foi possível ler o arquivo ${file.name}.`))
    reader.onload = () => resolve(String(reader.result || ''))
    reader.readAsDataURL(file)
  })

  const prepareAiAttachment = async (file: File): Promise<AiAttachment> => {
    const isImage = file.type.startsWith('image/')
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

    if (!isImage && !isPdf) {
      throw new Error(`"${file.name}" não é uma imagem nem um PDF compatível.`)
    }
    if (file.size > MAX_AI_FILE_BYTES) {
      throw new Error(`"${file.name}" ultrapassa 15 MB. Use um arquivo menor.`)
    }

    if (isPdf) {
      const dataUrl = await fileToDataUrl(file)
      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        mimeType: 'application/pdf',
        dataUrl,
        kind: 'pdf',
      }
    }

    const originalDataUrl = await fileToDataUrl(file)

    // Para fotos de laudo/exame e screenshots, preservar o arquivo original
    // é muito melhor para leitura de letras pequenas do que recomprimir tudo.
    const preserveOriginal =
      file.size <= 7 * 1024 * 1024 &&
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type.toLowerCase())

    if (preserveOriginal) {
      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        mimeType: file.type || 'image/jpeg',
        dataUrl: originalDataUrl,
        previewUrl: originalDataUrl,
        kind: 'image',
      }
    }

    // Só reduz imagens realmente grandes. Mantém resolução alta para texto pequeno.
    return new Promise<AiAttachment>((resolve, reject) => {
      const image = new Image()
      image.onerror = () => reject(new Error(`A imagem "${file.name}" não pôde ser aberta.`))
      image.onload = () => {
        const maxSide = 3200
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))

        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Seu navegador não conseguiu preparar a imagem.'))

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

        const outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        const dataUrl = outputMime === 'image/png'
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/jpeg', 0.95)

        resolve({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          mimeType: outputMime,
          dataUrl,
          previewUrl: dataUrl,
          kind: 'image',
        })
      }
      image.src = originalDataUrl
    })
  }

  const handleAiAttachmentsSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    e.target.value = ''
    if (!selectedFiles.length) return

    const availableSlots = Math.max(0, MAX_AI_ATTACHMENTS - aiAttachments.length)
    if (!availableSlots) {
      setAiErrorDetail(`O limite é de ${MAX_AI_ATTACHMENTS} arquivos por mensagem.`)
      return
    }

    try {
      setIsPreparingAiAttachment(true)
      setAiErrorDetail('')
      const prepared: AiAttachment[] = []
      for (const file of selectedFiles.slice(0, availableSlots)) {
        prepared.push(await prepareAiAttachment(file))
      }
      setAiAttachments(prev => [...prev, ...prepared])

      if (selectedFiles.length > availableSlots) {
        setAiErrorDetail(`Foram adicionados ${availableSlots} arquivo(s). O limite é ${MAX_AI_ATTACHMENTS}.`)
      }
    } catch (error: any) {
      setAiErrorDetail(error instanceof Error ? error.message : 'Não foi possível preparar os arquivos.')
    } finally {
      setIsPreparingAiAttachment(false)
    }
  }

  const removeAiAttachment = (id: string) => {
    setAiAttachments(prev => prev.filter(file => file.id !== id))
  }

  const clearAiAttachments = () => {
    setAiAttachments([])
    if (aiAttachmentInputRef.current) aiAttachmentInputRef.current.value = ''
  }

  const escapePrintHtml = (value: string) => value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

  const printAiResponse = (responseText: string, messageIndex: number) => {
    const patient = patients.find(p => p.id === aiPatientContextId)
    const fileNames = lastAiRequestFiles[`${currentChatSession.id}-${messageIndex}`] || []
    const printWindow = window.open('', '_blank', 'width=900,height=760')

    if (!printWindow) {
      alert('O navegador bloqueou a janela de impressão. Permita pop-ups e tente novamente.')
      return
    }

    const filesHtml = fileNames.length
      ? `<div class="files"><strong>Arquivos analisados:</strong> ${fileNames.map(escapePrintHtml).join(', ')}</div>`
      : ''

    printWindow.document.write(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <title>Resposta do Copiloto IA Veterinária</title>
          <style>
            body { font-family: Arial, sans-serif; color: #351628; margin: 30px; line-height: 1.55; }
            h1 { font-size: 21px; margin: 0 0 6px; }
            .meta { color: #666; font-size: 11px; margin-bottom: 16px; }
            .files { font-size: 11px; background: #faf5f8; border: 1px solid #ead6df; padding: 10px; border-radius: 8px; margin-bottom: 16px; }
            .answer { white-space: pre-wrap; font-size: 13px; }
            .notice { margin-top: 22px; border-top: 1px solid #ead6df; padding-top: 12px; font-size: 10px; color: #777; }
            @media print { body { margin: 12mm; } }
          </style>
        </head>
        <body>
          <h1>Copiloto IA Veterinária</h1>
          <div class="meta">
            Dra. Beatriz • ${escapePrintHtml(new Date().toLocaleString('pt-BR'))}
            ${patient ? ` • Paciente: ${escapePrintHtml(patient.petName)}` : ''}
          </div>
          ${filesHtml}
          <div class="answer">${escapePrintHtml(responseText)}</div>
          <div class="notice">
            Material de apoio gerado por IA. A resposta deve ser revisada pela médica-veterinária antes de integrar o prontuário ou orientar conduta.
          </div>
          <script>window.onload = () => window.print()</script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const currentChatSession = chatSessions.find(s => s.id === currentChatId) || chatSessions[0] || {
    id: 'temporary-session',
    title: 'Novo Caso Clínico',
    messages: [{ sender: 'ai' as const, text: 'Olá, Dra. Beatriz! Descreva o caso clínico para começarmos.' }]
  }

  useEffect(() => {
    if (chatSessions.length === 0) return
    if (!chatSessions.some(session => session.id === currentChatId)) {
      setCurrentChatId(chatSessions[0].id)
    }
  }, [chatSessions, currentChatId])

  useEffect(() => {
    if (activeTab !== 'ia') return
    const timer = window.setTimeout(() => {
      const el = chatScrollRef.current
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }, 80)
    return () => window.clearTimeout(timer)
  }, [activeTab, currentChatId, chatSessions, isAiLoading])

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
  const [recipes, setRecipes] = useState<VetPrescription[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_recipes_v28')
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
  const [newNeoplasia, setNewNeoplasia] = useState('')
  const [newComplaint, setNewComplaint] = useState('')
  const [newStatus, setNewStatus] = useState<'Em Atendimento' | 'Internado' | 'Alta' | 'Observação'>('Em Atendimento')
  const [focusedPatientId, setFocusedPatientId] = useState<string | null>(null)

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
          <p><strong>Neoplasia / Diagnóstico:</strong> ${p.neoplasia || 'Não informado'}</p>
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
  const [baseIncomeAddInput, setBaseIncomeAddInput] = useState<string>('')

  const [otherIncome, setOtherIncome] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_other_income_v28')
      if (saved) {
        const parsed = parseFloat(saved)
        if (!isNaN(parsed)) return parsed
      }
    }
    return 0
  })
  const [isEditingOtherIncome, setIsEditingOtherIncome] = useState(false)
  const [tempOtherIncomeInput, setTempOtherIncomeInput] = useState<string>('')
  const [otherIncomeAddInput, setOtherIncomeAddInput] = useState<string>('')

  const currentFinanceMonthKey = todayDateKey.slice(0, 7)
  const [financeSelectedMonth, setFinanceSelectedMonth] = useState(currentFinanceMonthKey)
  const [monthlyIncomeByMonth, setMonthlyIncomeByMonth] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_monthly_income_map_v28')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return {}
  })
  const [otherIncomeByMonth, setOtherIncomeByMonth] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_other_income_map_v28')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return {}
  })
  const [financeHistoryFilter, setFinanceHistoryFilter] = useState<'all' | 'expense' | 'received' | 'pending'>('all')
  const [financeHistorySearch, setFinanceHistorySearch] = useState('')

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
  const [finDate, setFinDate] = useState(todayDateKey)
  const [finStatus, setFinStatus] = useState<'Pago' | 'Pendente'>('Pendente')

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
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as CalendarEvent[]
          return parsed
            .map(ev => ({ ...ev, time: normalizeCalendarTime(ev.time) }))
            .sort((a, b) => {
              const dateCompare = a.dateKey.localeCompare(b.dateKey)
              if (dateCompare !== 0) return dateCompare

              const minutesA = eventTimeToMinutes(a.time)
              const minutesB = eventTimeToMinutes(b.time)
              if (minutesA !== minutesB) return minutesA - minutesB

              return a.title.localeCompare(b.title, 'pt-BR')
            })
        } catch(e) {}
      }
    }
    return []
  })
  const [selectedDate, setSelectedDate] = useState<string>(todayDateKey)
  const lastTodayDateKeyRef = useRef(todayDateKey)

  useEffect(() => {
    if (lastTodayDateKeyRef.current !== todayDateKey) {
      lastTodayDateKeyRef.current = todayDateKey
      setSelectedDate(todayDateKey)
    }
  }, [todayDateKey])
  const [eventTitle, setEventTitle] = useState('')
  const [eventDesc, setEventDesc] = useState('')
  const [eventTime, setEventTime] = useState('08:00')
  const [eventClinicName, setEventClinicName] = useState('')
  const [eventClinicColor, setEventClinicColor] = useState('#111827')
  const [eventCategory, setEventCategory] = useState<'work' | 'return' | 'other'>('work')
  const [repeatWeeklyUntilMonthEnd, setRepeatWeeklyUntilMonthEnd] = useState(false)
  const calendarColorPresets = [
    '#111827', '#ef4444', '#f97316', '#f59e0b',
    '#22c55e', '#10b981', '#06b6d4', '#3b82f6',
    '#6366f1', '#8b5cf6', '#d946ef', '#ec4899'
  ]

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
          if (d.recipes) { setRecipes(d.recipes); localStorage.setItem('vet_recipes_v28', JSON.stringify(d.recipes)); }
          if (d.customDrugs) { setCustomDrugs(d.customDrugs); localStorage.setItem('vet_custom_drugs_v28', JSON.stringify(d.customDrugs)); }
          if (d.monthlyIncome !== undefined) { 
            setMonthlyIncome(d.monthlyIncome); 
            localStorage.setItem('vet_income_v28', d.monthlyIncome.toString()); 
          }
          if (d.otherIncome !== undefined) {
            setOtherIncome(d.otherIncome)
            localStorage.setItem('vet_other_income_v28', d.otherIncome.toString())
          }
          if (d.monthlyIncomeByMonth) {
            setMonthlyIncomeByMonth(d.monthlyIncomeByMonth)
            localStorage.setItem('vet_monthly_income_map_v28', JSON.stringify(d.monthlyIncomeByMonth))
          } else if (d.monthlyIncome !== undefined) {
            setMonthlyIncomeByMonth(prev => prev[currentFinanceMonthKey] !== undefined ? prev : { ...prev, [currentFinanceMonthKey]: Number(d.monthlyIncome) || 0 })
          }
          if (d.otherIncomeByMonth) {
            setOtherIncomeByMonth(d.otherIncomeByMonth)
            localStorage.setItem('vet_other_income_map_v28', JSON.stringify(d.otherIncomeByMonth))
          } else if (d.otherIncome !== undefined) {
            setOtherIncomeByMonth(prev => prev[currentFinanceMonthKey] !== undefined ? prev : { ...prev, [currentFinanceMonthKey]: Number(d.otherIncome) || 0 })
          }
          if (d.cofrinhoAmount !== undefined) {
            setCofrinhoAmount(d.cofrinhoAmount);
            localStorage.setItem('vet_cofrinho_v28', d.cofrinhoAmount.toString());
          }
          if (d.finances) { setFinances(d.finances); localStorage.setItem('vet_finances_v28', JSON.stringify(d.finances)); }
          if (d.tasks) { setTasks(d.tasks); localStorage.setItem('vet_tasks_v28', JSON.stringify(d.tasks)); }
          if (d.events) {
            const normalizedEvents = sortAllCalendarEvents(
              (d.events as CalendarEvent[]).map(ev => ({ ...ev, time: normalizeCalendarTime(ev.time) }))
            )
            setEvents(normalizedEvents)
            localStorage.setItem('vet_events_v28', JSON.stringify(normalizedEvents))
          }
          if (Array.isArray(d.chatSessions) && d.chatSessions.length > 0) {
            setChatSessions(prevSessions => {
              const meaningfulLocal = prevSessions.filter(session => !(session.id === 'default-session' && session.messages.length === 1))
              const merged = d.chatSessions.map((remoteSession: ChatSession) => {
                const localSession = meaningfulLocal.find(session => session.id === remoteSession.id)
                return localSession && localSession.messages.length > remoteSession.messages.length
                  ? localSession
                  : remoteSession
              })
              const remoteIds = new Set(d.chatSessions.map((session: ChatSession) => session.id))
              const localOnly = meaningfulLocal.filter(session => !remoteIds.has(session.id))
              const finalSessions = [...merged, ...localOnly]
              localStorage.setItem('vet_chat_sessions_v28', JSON.stringify(finalSessions))
              return finalSessions
            })
          }
          if (d.clinics) { setClinics(d.clinics); localStorage.setItem('vet_clinics_v28', JSON.stringify(d.clinics)); }
          if (d.shifts) { setShifts(d.shifts); localStorage.setItem('vet_shifts_v28', JSON.stringify(d.shifts)); }
          if (d.specialistConsultations) { setSpecialistConsultations(d.specialistConsultations); localStorage.setItem('vet_specialist_consultations_v28', JSON.stringify(d.specialistConsultations)); }
          if (d.personalPets) { setPersonalPets(d.personalPets); localStorage.setItem('vet_personal_pets_v28', JSON.stringify(d.personalPets)); }
          if (Array.isArray(d.personalMediaItems)) {
            setPersonalMediaItems(d.personalMediaItems)
            localStorage.setItem('vet_personal_media_v28', JSON.stringify(d.personalMediaItems))
          }
          if (d.personalMediaGoals) {
            const goals = {
              Livro: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Livro, ...(d.personalMediaGoals.Livro || {}) },
              Filme: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Filme, ...(d.personalMediaGoals.Filme || {}) },
              Série: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Série, ...(d.personalMediaGoals.Série || {}) },
              Jogo: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Jogo, ...(d.personalMediaGoals.Jogo || {}) },
              Cafeteria: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Cafeteria, ...(d.personalMediaGoals.Cafeteria || {}) },
              Podcast: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Podcast, ...(d.personalMediaGoals.Podcast || {}) },
            }
            setPersonalMediaGoals(goals)
            localStorage.setItem('vet_personal_media_goals_v28', JSON.stringify(goals))
          }
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
          if (d.recipes) { setRecipes(d.recipes); localStorage.setItem('vet_recipes_v28', JSON.stringify(d.recipes)); }
            if (d.customDrugs) { setCustomDrugs(d.customDrugs); localStorage.setItem('vet_custom_drugs_v28', JSON.stringify(d.customDrugs)); }
            if (d.monthlyIncome !== undefined) { 
              setMonthlyIncome(d.monthlyIncome); 
              localStorage.setItem('vet_income_v28', d.monthlyIncome.toString()); 
            }
            if (d.otherIncome !== undefined) {
              setOtherIncome(d.otherIncome)
              localStorage.setItem('vet_other_income_v28', d.otherIncome.toString())
            }
            if (d.monthlyIncomeByMonth) {
              setMonthlyIncomeByMonth(d.monthlyIncomeByMonth)
              localStorage.setItem('vet_monthly_income_map_v28', JSON.stringify(d.monthlyIncomeByMonth))
            } else if (d.monthlyIncome !== undefined) {
              setMonthlyIncomeByMonth(prev => prev[currentFinanceMonthKey] !== undefined ? prev : { ...prev, [currentFinanceMonthKey]: Number(d.monthlyIncome) || 0 })
            }
            if (d.otherIncomeByMonth) {
              setOtherIncomeByMonth(d.otherIncomeByMonth)
              localStorage.setItem('vet_other_income_map_v28', JSON.stringify(d.otherIncomeByMonth))
            } else if (d.otherIncome !== undefined) {
              setOtherIncomeByMonth(prev => prev[currentFinanceMonthKey] !== undefined ? prev : { ...prev, [currentFinanceMonthKey]: Number(d.otherIncome) || 0 })
            }
            if (d.cofrinhoAmount !== undefined) {
              setCofrinhoAmount(d.cofrinhoAmount);
              localStorage.setItem('vet_cofrinho_v28', d.cofrinhoAmount.toString());
            }
            if (d.finances) { setFinances(d.finances); localStorage.setItem('vet_finances_v28', JSON.stringify(d.finances)); }
            if (d.tasks) { setTasks(d.tasks); localStorage.setItem('vet_tasks_v28', JSON.stringify(d.tasks)); }
            if (d.events) {
            const normalizedEvents = sortAllCalendarEvents(
              (d.events as CalendarEvent[]).map(ev => ({ ...ev, time: normalizeCalendarTime(ev.time) }))
            )
            setEvents(normalizedEvents)
            localStorage.setItem('vet_events_v28', JSON.stringify(normalizedEvents))
          }
            
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
            if (Array.isArray(d.personalMediaItems)) {
              setPersonalMediaItems(d.personalMediaItems)
              localStorage.setItem('vet_personal_media_v28', JSON.stringify(d.personalMediaItems))
            }
            if (d.personalMediaGoals) {
              const goals = {
                Livro: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Livro, ...(d.personalMediaGoals.Livro || {}) },
                Filme: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Filme, ...(d.personalMediaGoals.Filme || {}) },
                Série: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Série, ...(d.personalMediaGoals.Série || {}) },
                Jogo: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Jogo, ...(d.personalMediaGoals.Jogo || {}) },
                Cafeteria: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Cafeteria, ...(d.personalMediaGoals.Cafeteria || {}) },
                Podcast: { ...DEFAULT_PERSONAL_MEDIA_GOALS.Podcast, ...(d.personalMediaGoals.Podcast || {}) },
              }
              setPersonalMediaGoals(goals)
              localStorage.setItem('vet_personal_media_goals_v28', JSON.stringify(goals))
            }
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
    localStorage.setItem('vet_recipes_v28', JSON.stringify(recipes))
    localStorage.setItem('vet_custom_drugs_v28', JSON.stringify(customDrugs))
    localStorage.setItem('vet_income_v28', monthlyIncome.toString())
    localStorage.setItem('vet_other_income_v28', otherIncome.toString())
    localStorage.setItem('vet_monthly_income_map_v28', JSON.stringify(monthlyIncomeByMonth))
    localStorage.setItem('vet_other_income_map_v28', JSON.stringify(otherIncomeByMonth))
    localStorage.setItem('vet_cofrinho_v28', cofrinhoAmount.toString())
    localStorage.setItem('vet_finances_v28', JSON.stringify(finances))
    localStorage.setItem('vet_tasks_v28', JSON.stringify(tasks))
    localStorage.setItem('vet_events_v28', JSON.stringify(events))
    localStorage.setItem('vet_chat_sessions_v28', JSON.stringify(chatSessions))
    localStorage.setItem('vet_clinics_v28', JSON.stringify(clinics))
    localStorage.setItem('vet_shifts_v28', JSON.stringify(shifts))
    localStorage.setItem('vet_specialist_consultations_v28', JSON.stringify(specialistConsultations))
    localStorage.setItem('vet_personal_pets_v28', JSON.stringify(personalPets))
    localStorage.setItem('vet_personal_media_v28', JSON.stringify(personalMediaItems))
    localStorage.setItem('vet_personal_media_goals_v28', JSON.stringify(personalMediaGoals))
    localStorage.setItem('vet_skincare_checked_v28', JSON.stringify(skincareDone))
    localStorage.setItem('vet_mimos_v28', mimosWishlist)
    localStorage.setItem('vet_descomp_v28', descompressaoNotes)

    setSaveStatus('Salvando...')

    const syncToCloud = async () => {
      try {
        const payload = {
          items,
          patients,
          recipes,
          customDrugs,
          monthlyIncome,
          otherIncome,
          monthlyIncomeByMonth,
          otherIncomeByMonth,
          cofrinhoAmount,
          finances,
          tasks,
          events,
          chatSessions,
          clinics,
          shifts,
          specialistConsultations,
          personalPets,
          personalMediaItems,
          personalMediaGoals,
          skincareDone,
          mimosWishlist,
          descompressaoNotes
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
  }, [isInitialized, items, patients, recipes, customDrugs, monthlyIncome, otherIncome, monthlyIncomeByMonth, otherIncomeByMonth, cofrinhoAmount, finances, tasks, events, chatSessions, clinics, shifts, specialistConsultations, personalPets, personalMediaItems, personalMediaGoals, skincareDone, mimosWishlist, descompressaoNotes])

  const renderPersonalMediaCategory = (
    type: PersonalMediaType,
    title: string,
    subtitle: string,
    emoji: string
  ) => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    const categoryItems = personalMediaItems.filter(item => item.type === type)
    const currentItems = categoryItems.filter(item => !item.archived)
    const archivedItems = categoryItems
      .filter(item => item.archived)
      .sort((a, b) => (b.completedAt || b.createdAt).localeCompare(a.completedAt || a.createdAt))

    const completedCurrent = currentItems.filter(item => item.status === 'concluido').length
    const currentListProgress = currentItems.length > 0
      ? Math.round((completedCurrent / currentItems.length) * 100)
      : 0

    const completedThisYear = categoryItems.filter(item => {
      if (!item.completedAt) return false
      const date = new Date(item.completedAt)
      return date.getFullYear() === currentYear
    }).length

    const completedThisMonth = categoryItems.filter(item => {
      if (!item.completedAt) return false
      const date = new Date(item.completedAt)
      return date.getFullYear() === currentYear && date.getMonth() === currentMonth
    }).length

    const favoriteCount = categoryItems.filter(item => item.favorite).length
    const ratings = categoryItems
      .map(item => Number(item.rating) || 0)
      .filter(value => value > 0)
    const averageRating = ratings.length
      ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length
      : 0

    const goals = personalMediaGoals[type]
    const addPlaceholder =
      type === 'Cafeteria'
        ? 'Adicionar café ou local...'
        : type === 'Podcast'
          ? 'Adicionar podcast / true crime...'
          : `Adicionar ${type.toLocaleLowerCase('pt-BR')}...`
    const notesPlaceholder =
      type === 'Cafeteria'
        ? 'Bairro, endereço, pedido que quer provar ou observação...'
        : type === 'Podcast'
          ? 'Plataforma, episódio, temporada ou observação...'
          : 'Autor, plataforma, temporada ou observação...'
    const completedMetricLabel =
      type === 'Cafeteria'
        ? `Visitados em ${currentYear}`
        : type === 'Podcast'
          ? `Ouvidos em ${currentYear}`
          : `Concluídos em ${currentYear}`
    const historyLabel =
      type === 'Cafeteria'
        ? '☕ Histórico de locais visitados'
        : type === 'Podcast'
          ? '🎧 Histórico de podcasts ouvidos'
          : '📚 Histórico concluído'

    const annualGoalProgress = goals.annual > 0
      ? Math.min(100, Math.round((completedThisYear / goals.annual) * 100))
      : 0
    const monthlyGoalProgress = goals.monthly > 0
      ? Math.min(100, Math.round((completedThisMonth / goals.monthly) * 100))
      : 0

    const filter = personalMediaFilterByType[type]
    const sort = personalMediaSortByType[type]

    const filteredCurrentItems = currentItems.filter(item => {
      if (filter === 'todos') return true
      if (filter === 'favoritos') return !!item.favorite
      return item.status === filter
    })

    const visibleCurrentItems = [...filteredCurrentItems].sort((a, b) => {
      if (sort === 'alfabetico') return a.title.localeCompare(b.title, 'pt-BR')
      if (sort === 'nota') return (Number(b.rating) || 0) - (Number(a.rating) || 0)
      if (sort === 'concluidos') {
        const aTime = a.completedAt ? new Date(a.completedAt).getTime() : 0
        const bTime = b.completedAt ? new Date(b.completedAt).getTime() : 0
        return bTime - aTime
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    const chosenItem = currentItems.find(item => item.id === personalMediaPickByType[type])

    const statusClass = (status: PersonalMediaStatus) => {
      if (status === 'concluido') return 'bg-emerald-50 border-emerald-200 text-emerald-900'
      if (status === 'em_andamento') return 'bg-amber-50 border-amber-200 text-amber-900'
      return 'bg-rose-50/60 border-rose-200 text-rose-900'
    }

    const internalProgress = (item: PersonalMediaItem) => {
      if (type === 'Livro' && item.progressTotal && item.progressTotal > 0) {
        return Math.min(100, Math.max(0, Math.round(((item.progressCurrent || 0) / item.progressTotal) * 100)))
      }
      if (type === 'Jogo' && item.progressCurrent !== undefined) {
        return Math.min(100, Math.max(0, Math.round(item.progressCurrent)))
      }
      return null
    }

    return (
      <div className="bg-white/95 border border-pink-100 rounded-3xl p-5 md:p-6 shadow-sm space-y-5">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-5">
          <div className="min-w-0">
            <h4 className="text-sm font-extrabold text-pink-950 flex items-center gap-2">
              <span>{emoji}</span> {title}
            </h4>
            <p className="text-[10px] text-stone-500 mt-1">{subtitle}</p>
          </div>

          <div className="w-full xl:w-[330px] space-y-3">
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
                <span className="text-stone-500">Lista atual</span>
                <span className="text-pink-700">{completedCurrent}/{currentItems.length} • {currentListProgress}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-pink-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${currentListProgress}%` }}
                />
              </div>
              <div className="text-[9px] text-stone-400 mt-1">
                Cada item atual vale a mesma parte da barra. Arquivados ficam no histórico.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-violet-50 border border-violet-100 rounded-xl p-2.5">
                <div className="text-[9px] font-extrabold text-violet-700 uppercase">Meta {currentYear}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm font-extrabold text-violet-950">{completedThisYear}</span>
                  <span className="text-[9px] text-violet-500">de</span>
                  <input
                    type="number"
                    min="0"
                    value={goals.annual}
                    onChange={(e) => updatePersonalMediaGoal(type, 'annual', Number(e.target.value))}
                    className="w-14 bg-white border border-violet-200 rounded-lg px-1.5 py-1 text-[10px] font-bold text-violet-900 focus:outline-none"
                    title="Meta anual"
                  />
                </div>
                <div className="h-1.5 bg-white rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${annualGoalProgress}%` }} />
                </div>
              </div>

              <div className="bg-sky-50 border border-sky-100 rounded-xl p-2.5">
                <div className="text-[9px] font-extrabold text-sky-700 uppercase">Meta do mês</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm font-extrabold text-sky-950">{completedThisMonth}</span>
                  <span className="text-[9px] text-sky-500">de</span>
                  <input
                    type="number"
                    min="0"
                    value={goals.monthly}
                    onChange={(e) => updatePersonalMediaGoal(type, 'monthly', Number(e.target.value))}
                    className="w-14 bg-white border border-sky-200 rounded-lg px-1.5 py-1 text-[10px] font-bold text-sky-900 focus:outline-none"
                    title="Meta mensal"
                  />
                </div>
                <div className="h-1.5 bg-white rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${monthlyGoalProgress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="bg-stone-50 border border-stone-100 rounded-xl p-3">
            <div className="text-[9px] uppercase font-bold text-stone-400">{completedMetricLabel}</div>
            <div className="text-lg font-extrabold text-pink-950 mt-0.5">{completedThisYear}</div>
          </div>
          <div className="bg-stone-50 border border-stone-100 rounded-xl p-3">
            <div className="text-[9px] uppercase font-bold text-stone-400">Neste mês</div>
            <div className="text-lg font-extrabold text-pink-950 mt-0.5">{completedThisMonth}</div>
          </div>
          <div className="bg-stone-50 border border-stone-100 rounded-xl p-3">
            <div className="text-[9px] uppercase font-bold text-stone-400">Favoritos</div>
            <div className="text-lg font-extrabold text-pink-950 mt-0.5">{favoriteCount}</div>
          </div>
          <div className="bg-stone-50 border border-stone-100 rounded-xl p-3">
            <div className="text-[9px] uppercase font-bold text-stone-400">Nota média</div>
            <div className="text-lg font-extrabold text-pink-950 mt-0.5">
              {averageRating ? `${averageRating.toFixed(1)} ★` : '—'}
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (newPersonalMediaType !== type) setNewPersonalMediaType(type)
            if (!newPersonalMediaTitle.trim()) return
            addPersonalMediaItem(
              type,
              newPersonalMediaTitle,
              newPersonalMediaNotes,
              'quero',
              newPersonalMediaType === type ? newPersonalMediaImageUrl : ''
            )
            setNewPersonalMediaTitle('')
            setNewPersonalMediaNotes('')
            setNewPersonalMediaImageUrl('')
          }}
          onPaste={(e) => handleNewPersonalMediaPaste(type, e)}
          className="bg-pink-50/40 border border-pink-100 rounded-2xl p-3 space-y-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
            <input
              value={newPersonalMediaType === type ? newPersonalMediaTitle : ''}
              onFocus={() => {
                setNewPersonalMediaType(type)
                if (newPersonalMediaType !== type) setNewPersonalMediaImageUrl('')
              }}
              onChange={(e) => {
                setNewPersonalMediaType(type)
                setNewPersonalMediaTitle(e.target.value)
              }}
              placeholder={addPlaceholder}
              className="bg-white border border-pink-200 rounded-xl px-3 py-2.5 text-xs text-pink-950 focus:outline-none focus:border-pink-400"
            />
            <input
              value={newPersonalMediaType === type ? newPersonalMediaNotes : ''}
              onFocus={() => setNewPersonalMediaType(type)}
              onChange={(e) => {
                setNewPersonalMediaType(type)
                setNewPersonalMediaNotes(e.target.value)
              }}
              placeholder={notesPlaceholder}
              className="bg-white border border-pink-200 rounded-xl px-3 py-2.5 text-xs text-pink-950 focus:outline-none focus:border-pink-400"
            />
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="bg-white hover:bg-pink-50 border border-pink-200 text-pink-700 px-3 py-2 rounded-xl text-[10px] font-bold cursor-pointer flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              {isPreparingPersonalMediaImage
                ? 'Preparando imagem...'
                : newPersonalMediaType === type && newPersonalMediaImageUrl
                  ? 'Trocar capa'
                  : 'Adicionar capa'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  e.target.value = ''
                  if (file) await setNewPersonalMediaImage(type, file)
                }}
              />
            </label>

            <span className="text-[9px] text-stone-400">
              ou tire um print e pressione <strong>Ctrl + V</strong> neste formulário.
            </span>

            {newPersonalMediaType === type && newPersonalMediaImageUrl && (
              <div className="flex items-center gap-2">
                <img src={newPersonalMediaImageUrl} alt="Prévia da capa" className="w-10 h-12 rounded-lg object-cover border border-pink-200" />
                <button
                  type="button"
                  onClick={() => setNewPersonalMediaImageUrl('')}
                  className="text-[9px] font-bold text-rose-600 hover:underline"
                >
                  remover
                </button>
              </div>
            )}
          </div>
        </form>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {([
              ['todos', 'Todos'],
              ['quero', personalMediaStatusMeta(type, 'quero').shortLabel],
              ['em_andamento', personalMediaStatusMeta(type, 'em_andamento').shortLabel],
              ['concluido', personalMediaStatusMeta(type, 'concluido').shortLabel],
              ['favoritos', '❤️ Favoritos'],
            ] as Array<[PersonalMediaFilter, string]>).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setPersonalMediaFilterByType(prev => ({ ...prev, [type]: value }))}
                className={`px-2.5 py-1.5 rounded-xl border text-[9px] font-bold transition ${
                  filter === value
                    ? 'bg-pink-500 border-pink-500 text-white'
                    : 'bg-white border-pink-100 text-stone-600 hover:bg-pink-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setPersonalMediaSortByType(prev => ({
                ...prev,
                [type]: e.target.value as PersonalMediaSort,
              }))}
              className="bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-[9px] font-bold text-stone-600 focus:outline-none"
            >
              <option value="recentes">Mais recentes</option>
              <option value="alfabetico">A–Z</option>
              <option value="nota">Maior nota</option>
              <option value="concluidos">Concluídos recentemente</option>
            </select>

            <button
              type="button"
              onClick={() => choosePersonalMediaForMe(type)}
              className="bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-800 px-3 py-1.5 rounded-xl text-[9px] font-extrabold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Escolhe por mim
            </button>

            {completedCurrent > 0 && (
              <button
                type="button"
                onClick={() => archiveCompletedPersonalMedia(type)}
                className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-[9px] font-bold"
              >
                ✓ Arquivar concluídos
              </button>
            )}
          </div>
        </div>

        {chosenItem && (
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-[9px] font-extrabold uppercase text-violet-600">✨ Escolha da vez</div>
              <div className="text-xs font-extrabold text-violet-950 mt-0.5">{chosenItem.title}</div>
            </div>
            <button
              type="button"
              onClick={() => setPersonalMediaPickByType(prev => ({ ...prev, [type]: '' }))}
              className="text-violet-500 hover:text-violet-800 p-1"
              title="Fechar sugestão"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {visibleCurrentItems.length === 0 ? (
          <div className="border border-dashed border-pink-200 rounded-2xl p-6 text-center">
            <p className="text-xs font-bold text-stone-500">
              {currentItems.length === 0 ? 'Nenhum item nessa lista agora.' : 'Nenhum item corresponde ao filtro.'}
            </p>
            <p className="text-[10px] text-stone-400 mt-1">
              Adicione acima, troque o filtro ou use uma recomendação.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleCurrentItems.map(item => {
              const meta = personalMediaStatusMeta(type, item.status)
              const isEditing = editingPersonalMediaId === item.id
              const progressValue = internalProgress(item)
              const isChosen = personalMediaPickByType[type] === item.id

              return (
                <div
                  key={item.id}
                  tabIndex={0}
                  onPaste={(e) => handlePersonalMediaCardPaste(item.id, e)}
                  className={`border rounded-2xl p-3.5 transition outline-none focus:ring-2 focus:ring-pink-200 ${
                    statusClass(item.status)
                  } ${isChosen ? 'ring-2 ring-violet-300 shadow-md' : ''}`}
                  title="Você também pode clicar neste card e colar uma capa com Ctrl + V"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-stone-500 block mb-1">Título</label>
                          <input
                            autoFocus
                            value={editingPersonalMediaTitle}
                            onChange={(e) => setEditingPersonalMediaTitle(e.target.value)}
                            className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-stone-500 block mb-1">Autor / plataforma / observação</label>
                          <input
                            value={editingPersonalMediaNotes}
                            onChange={(e) => setEditingPersonalMediaNotes(e.target.value)}
                            className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none"
                            placeholder="Observação..."
                          />
                        </div>
                      </div>

                      {type === 'Livro' && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-bold text-stone-500 block mb-1">Página atual</label>
                            <input
                              type="number"
                              min="0"
                              value={editingProgressCurrent}
                              onChange={(e) => setEditingProgressCurrent(e.target.value)}
                              className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-stone-500 block mb-1">Total de páginas</label>
                            <input
                              type="number"
                              min="1"
                              value={editingProgressTotal}
                              onChange={(e) => setEditingProgressTotal(e.target.value)}
                              className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {type === 'Jogo' && (
                        <div>
                          <label className="text-[9px] font-bold text-stone-500 block mb-1">Progresso do jogo (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editingProgressCurrent}
                            onChange={(e) => setEditingProgressCurrent(e.target.value)}
                            className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            placeholder="Ex.: 40"
                          />
                        </div>
                      )}

                      {(type === 'Série' || type === 'Podcast') && (
                        <div>
                          <label className="text-[9px] font-bold text-stone-500 block mb-1">
                            {type === 'Podcast' ? 'Onde parou / episódio atual' : 'Onde parou'}
                          </label>
                          <input
                            value={editingProgressNote}
                            onChange={(e) => setEditingProgressNote(e.target.value)}
                            className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            placeholder={type === 'Podcast' ? 'Ex.: Episódio 7 • Caso X' : 'Ex.: Temporada 2 • Episódio 5'}
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-[9px] font-bold text-stone-500 block mb-1">Mini resenha / o que achei</label>
                        <textarea
                          rows={3}
                          value={editingPersonalMediaReview}
                          onChange={(e) => setEditingPersonalMediaReview(e.target.value)}
                          className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs focus:outline-none resize-none"
                          placeholder="O que mais gostou, se recomendaria, personagem favorito..."
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => savePersonalMediaEdit(item.id)}
                          className="bg-pink-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold"
                        >
                          Salvar alterações
                        </button>
                        <button
                          type="button"
                          onClick={cancelPersonalMediaEdit}
                          className="bg-white border border-stone-200 text-stone-600 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="shrink-0">
                        {item.imageUrl ? (
                          <div className="relative group">
                            <img
                              src={item.imageUrl}
                              alt={`Capa de ${item.title}`}
                              className="w-20 h-24 rounded-xl object-cover border border-white/80 shadow-sm bg-white"
                            />
                            <label
                              className="absolute inset-x-1 bottom-1 bg-black/60 hover:bg-black/75 text-white text-[8px] font-bold rounded-md py-1 text-center cursor-pointer opacity-0 group-hover:opacity-100 transition"
                              title="Trocar capa"
                            >
                              trocar capa
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0]
                                  e.target.value = ''
                                  if (file) await setPersonalMediaItemImage(item.id, file)
                                }}
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="w-20 h-24 rounded-xl bg-white/70 border border-dashed border-pink-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-white transition text-pink-500">
                            <Camera className="w-5 h-5" />
                            <span className="text-[8px] font-bold text-center px-1">capa / print</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                e.target.value = ''
                                if (file) await setPersonalMediaItemImage(item.id, file)
                              }}
                            />
                          </label>
                        )}
                        <div className="text-[8px] text-stone-400 text-center mt-1">ou Ctrl + V</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => updatePersonalMediaStatus(
                          item.id,
                          item.status === 'quero'
                            ? 'em_andamento'
                            : item.status === 'em_andamento'
                              ? 'concluido'
                              : 'quero'
                        )}
                        className={`w-8 h-8 rounded-full border-2 shrink-0 flex items-center justify-center ${
                          item.status === 'concluido'
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : item.status === 'em_andamento'
                              ? 'bg-amber-400 border-amber-400 text-white'
                              : 'bg-white border-rose-300 text-rose-300'
                        }`}
                        title="Clique para avançar o status"
                      >
                        {item.status === 'concluido'
                          ? <Check className="w-4 h-4" />
                          : item.status === 'em_andamento'
                            ? '◐'
                            : <Circle className="w-4 h-4" />}
                      </button>

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-start gap-2">
                          <div className={`text-xs font-extrabold flex-1 min-w-[160px] ${
                            item.status === 'concluido' ? 'line-through decoration-emerald-400' : ''
                          }`}>
                            {item.title}
                          </div>

                          <button
                            type="button"
                            onClick={() => patchPersonalMediaItem(item.id, { favorite: !item.favorite })}
                            className={`p-1 rounded-lg transition ${
                              item.favorite
                                ? 'bg-rose-100 text-rose-600'
                                : 'bg-white/70 text-stone-400 hover:text-rose-500'
                            }`}
                            title={item.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                          >
                            <Heart className={`w-4 h-4 ${item.favorite ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {item.notes && <div className="text-[10px] opacity-75">{item.notes}</div>}

                        <div className="flex flex-wrap items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => patchPersonalMediaItem(item.id, {
                                rating: item.rating === star ? 0 : star
                              })}
                              className={`text-base leading-none transition ${
                                (item.rating || 0) >= star ? 'text-amber-500' : 'text-stone-300 hover:text-amber-300'
                              }`}
                              title={`${star} estrela${star === 1 ? '' : 's'}`}
                            >
                              ★
                            </button>
                          ))}
                          {item.rating ? <span className="text-[9px] font-bold text-amber-700 ml-1">{item.rating}/5</span> : null}
                        </div>

                        {progressValue !== null && (
                          <div>
                            <div className="flex justify-between text-[9px] font-bold mb-1">
                              <span className="text-stone-500">
                                {type === 'Livro' ? 'Progresso de leitura' : 'Progresso do jogo'}
                              </span>
                              <span className="text-pink-700">{progressValue}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/70 overflow-hidden border border-white">
                              <div className="h-full bg-pink-500 rounded-full" style={{ width: `${progressValue}%` }} />
                            </div>
                            {type === 'Livro' && item.progressTotal ? (
                              <div className="text-[8px] text-stone-400 mt-1">
                                Página {Math.min(item.progressCurrent || 0, item.progressTotal)} de {item.progressTotal}
                              </div>
                            ) : null}
                          </div>
                        )}

                        {(type === 'Série' || type === 'Podcast') && item.progressNote && (
                          <div className="inline-flex bg-white/70 border border-white px-2 py-1 rounded-lg text-[9px] font-bold text-pink-800">
                            {type === 'Podcast' ? '🎧' : '📺'} {item.progressNote}
                          </div>
                        )}

                        {item.review && (
                          <div className="bg-white/60 border border-white rounded-xl p-2.5 text-[10px] leading-relaxed">
                            <strong>Minha resenha:</strong> {item.review}
                          </div>
                        )}

                        {item.completedAt && item.status === 'concluido' && (
                          <div className="text-[9px] text-emerald-700">
                            Concluído em {new Date(item.completedAt).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap md:flex-col items-center md:items-stretch gap-1.5 shrink-0">
                        <select
                          value={item.status}
                          onChange={(e) => updatePersonalMediaStatus(item.id, e.target.value as PersonalMediaStatus)}
                          className={`border rounded-xl px-2.5 py-1.5 text-[9px] font-bold focus:outline-none ${
                            item.status === 'concluido'
                              ? 'bg-emerald-100 border-emerald-200 text-emerald-800'
                              : item.status === 'em_andamento'
                                ? 'bg-amber-100 border-amber-200 text-amber-800'
                                : 'bg-rose-100 border-rose-200 text-rose-800'
                          }`}
                        >
                          <option value="quero">{personalMediaStatusMeta(type, 'quero').label}</option>
                          <option value="em_andamento">{personalMediaStatusMeta(type, 'em_andamento').label}</option>
                          <option value="concluido">{personalMediaStatusMeta(type, 'concluido').label}</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => startPersonalMediaEdit(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/70 hover:bg-white text-pink-700 text-[9px] font-bold flex items-center justify-center gap-1"
                          title="Editar, resenha e progresso"
                        >
                          <Edit3 className="w-3 h-3" /> Editar
                        </button>

                        {item.status === 'concluido' && (
                          <button
                            type="button"
                            onClick={() => archivePersonalMediaItem(item.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-white/80 hover:bg-white text-emerald-800 text-[9px] font-bold"
                            title="Tira da lista atual, mas mantém salvo no histórico"
                          >
                            Arquivar
                          </button>
                        )}

                        {item.imageUrl && (
                          <button
                            type="button"
                            onClick={() => patchPersonalMediaItem(item.id, { imageUrl: undefined })}
                            className="px-2.5 py-1.5 rounded-lg bg-white/70 hover:bg-white text-stone-500 text-[8px] font-bold"
                          >
                            Remover capa
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => deletePersonalMediaItem(item.id)}
                          className="p-1.5 rounded-lg bg-white/70 hover:bg-red-50 text-stone-400 hover:text-red-500"
                          title="Excluir definitivamente"
                        >
                          <Trash2 className="w-3.5 h-3.5 mx-auto" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {archivedItems.length > 0 && (
          <div className="pt-2 border-t border-pink-100">
            <button
              type="button"
              onClick={() => setOpenMediaHistory(prev => ({ ...prev, [type]: !prev[type] }))}
              className="w-full flex items-center justify-between bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl px-3 py-2.5 text-[10px] font-bold text-stone-700"
            >
              <span>{historyLabel} ({archivedItems.length})</span>
              {openMediaHistory[type] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {openMediaHistory[type] && (
              <div className="mt-2 space-y-2">
                {archivedItems.map(item => (
                  <div key={`history-${item.id}`} className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-10 h-12 rounded-lg object-cover border border-emerald-100 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-extrabold text-emerald-950 truncate">
                        {item.favorite ? '❤️ ' : ''}{item.title}
                      </div>
                      <div className="text-[9px] text-emerald-700">
                        {personalMediaStatusMeta(type, 'concluido').label}
                        {item.completedAt ? ` • ${new Date(item.completedAt).toLocaleDateString('pt-BR')}` : ''}
                        {item.rating ? ` • ${'★'.repeat(item.rating)}` : ''}
                      </div>
                      {item.review && <div className="text-[9px] text-stone-500 mt-1 line-clamp-2">{item.review}</div>}
                    </div>
                    <button
                      type="button"
                      onClick={() => restorePersonalMediaItem(item.id)}
                      className="bg-white border border-emerald-200 text-emerald-700 px-2.5 py-1.5 rounded-lg text-[9px] font-bold"
                    >
                      Restaurar
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePersonalMediaItem(item.id)}
                      className="p-1.5 text-stone-400 hover:text-red-500"
                      title="Excluir definitivamente"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const selectedItem = items.find(i => i.id === selectedItemId && i.type === 'page') || items.find(i => i.type === 'page')

  const selectedStudySections = selectedItem ? buildStudySections(selectedItem) : []
  const activeStudySection =
    selectedStudySections.find(section => section.id === studySubTab) ||
    selectedStudySections[0] ||
    null

  const updateStudySections = (
    itemId: string,
    updater: (sections: DocumentSection[]) => DocumentSection[]
  ) => {
    lastLocalMutationRef.current = Date.now()
    setItems(prev => prev.map(item => {
      if (item.id !== itemId || item.type !== 'page') return item

      const currentSections = buildStudySections(item)
      const nextSections = updater(currentSections)
        .map((section, index) => ({
          ...section,
          title: section.title.trim() || `Aba ${index + 1}`,
          order: index,
        }))

      return {
        ...item,
        ...syncLegacyStudyFields(item, nextSections),
        sections: nextSections,
      }
    }))
  }

  const handleAddStudyTab = () => {
    if (!selectedItem) return
    const title = newStudyTabTitle.trim()
    if (!title) return

    if (selectedStudySections.some(section =>
      section.title.trim().toLocaleLowerCase('pt-BR') === title.toLocaleLowerCase('pt-BR')
    )) {
      alert('Já existe uma aba com esse nome nesta página.')
      return
    }

    const id = `study-tab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    updateStudySections(selectedItem.id, sections => [
      ...sections,
      {
        id,
        title,
        content: '',
        order: sections.length,
      },
    ])

    setStudySubTab(id)
    setNewStudyTabTitle('')
    setIsAddingStudyTab(false)
  }

  const handleRenameStudyTab = (sectionId: string) => {
    if (!selectedItem) return
    const title = editingStudyTabTitle.trim()
    if (!title) return

    if (selectedStudySections.some(section =>
      section.id !== sectionId &&
      section.title.trim().toLocaleLowerCase('pt-BR') === title.toLocaleLowerCase('pt-BR')
    )) {
      alert('Já existe outra aba com esse nome.')
      return
    }

    updateStudySections(selectedItem.id, sections =>
      sections.map(section =>
        section.id === sectionId ? { ...section, title } : section
      )
    )

    setEditingStudyTabId(null)
    setEditingStudyTabTitle('')
  }

  const handleDeleteStudyTab = (sectionId: string) => {
    if (!selectedItem) return
    if (selectedStudySections.length <= 1) {
      alert('A página precisa ter pelo menos uma aba.')
      return
    }

    const section = selectedStudySections.find(item => item.id === sectionId)
    if (!section) return

    if (!confirm(`Excluir a aba "${section.title}" e todo o conteúdo dela?`)) return

    const remaining = selectedStudySections.filter(item => item.id !== sectionId)
    updateStudySections(selectedItem.id, sections =>
      sections.filter(item => item.id !== sectionId)
    )

    if (studySubTab === sectionId) {
      setStudySubTab(remaining[0]?.id || '')
    }

    if (editingStudyTabId === sectionId) {
      setEditingStudyTabId(null)
      setEditingStudyTabTitle('')
    }
  }

  const moveStudyTab = (sectionId: string, direction: -1 | 1) => {
    if (!selectedItem) return
    const currentIndex = selectedStudySections.findIndex(section => section.id === sectionId)
    const targetIndex = currentIndex + direction
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= selectedStudySections.length) return

    updateStudySections(selectedItem.id, sections => {
      const next = [...sections]
      const [moved] = next.splice(currentIndex, 1)
      next.splice(targetIndex, 0, moved)
      return next
    })
  }

  // Ao abrir uma página antiga, migra as três abas legadas sem perder o texto já escrito.
  useEffect(() => {
    if (!selectedItem || selectedItem.type !== 'page') return
    if (Array.isArray(selectedItem.sections) && selectedItem.sections.length > 0) return

    const migrated = buildStudySections(selectedItem)
    lastLocalMutationRef.current = Date.now()
    setItems(prev => prev.map(item =>
      item.id === selectedItem.id
        ? { ...item, sections: migrated }
        : item
    ))
  }, [selectedItem?.id])

  // Se trocar de página ou apagar uma aba ativa, abre automaticamente uma aba válida.
  useEffect(() => {
    if (!selectedItem || selectedStudySections.length === 0) return
    if (!selectedStudySections.some(section => section.id === studySubTab)) {
      setStudySubTab(selectedStudySections[0].id)
    }
  }, [selectedItem?.id, selectedStudySections.map(section => section.id).join('|'), studySubTab])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (files.length === 0) return

    const targetTaskId = activeTaskForAttach
    const targetItemId = targetTaskId ? null : selectedItem?.id || null

    try {
      setIsStudyFileProcessing(true)
      const prepared: AttachedFile[] = []

      for (const file of files.slice(0, 8)) {
        prepared.push(await preparePersistentStudyAttachment(file))
      }

      lastLocalMutationRef.current = Date.now()

      if (targetTaskId) {
        setTasks(prev => prev.map(task =>
          task.id === targetTaskId
            ? { ...task, attachments: [...(task.attachments || []), ...prepared] }
            : task
        ))
        setActiveTaskForAttach(null)
      } else if (targetItemId) {
        setItems(prev => prev.map(item =>
          item.id === targetItemId
            ? { ...item, attachments: [...(item.attachments || []), ...prepared] }
            : item
        ))
      }

      if (files.length > 8) {
        alert('Foram adicionados os primeiros 8 arquivos. Para manter a página leve, envie os demais em outro lote.')
      }
    } catch (error: any) {
      alert(error instanceof Error ? error.message : 'Não foi possível anexar o material.')
    } finally {
      setIsStudyFileProcessing(false)
    }
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

  const financeNow = new Date()

  const setFinanceMonth = (monthKey: string) => {
    if (!/^\d{4}-\d{2}$/.test(monthKey)) return
    setFinanceSelectedMonth(monthKey)
    setIsEditingIncome(false)
    setIsEditingOtherIncome(false)
    setBaseIncomeAddInput('')
    setOtherIncomeAddInput('')
    setFinanceHistoryFilter('all')
    setFinanceHistorySearch('')
    setFinDate(monthKey === currentFinanceMonthKey ? todayDateKey : `${monthKey}-01`)
  }

  const changeFinanceMonth = (offset: number) => {
    const [year, month] = financeSelectedMonth.split('-').map(Number)
    const target = new Date(year, (month - 1) + offset, 1)
    const nextKey = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}`
    setFinanceMonth(nextKey)
  }

  const financeMonthLabel = (() => {
    const [year, month] = financeSelectedMonth.split('-').map(Number)
    if (!year || !month) return financeSelectedMonth
    const value = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    })
    return value.charAt(0).toUpperCase() + value.slice(1)
  })()

  const isIsoInFinanceMonth = (value?: string, monthKey = financeSelectedMonth) => {
    if (!value) return false
    return value.slice(0, 7) === monthKey
  }

  const isBrDateInFinanceMonth = (value?: string, monthKey = financeSelectedMonth) => {
    if (!value) return false
    const [day, month, year] = value.split('/').map(Number)
    if (!day || !month || !year) return false
    const key = `${year}-${String(month).padStart(2, '0')}`
    return key === monthKey
  }

  const isoToBrDate = (iso: string) => {
    const [year, month, day] = iso.split('-')
    if (!year || !month || !day) return new Date().toLocaleDateString('pt-BR')
    return `${day}/${month}/${year}`
  }

  const financeDateTimestamp = (value: string) => {
    if (!value) return 0
    if (value.includes('-')) {
      const [year, month, day] = value.split('-').map(Number)
      return new Date(year || 0, (month || 1) - 1, day || 1).getTime()
    }
    const [day, month, year] = value.split('/').map(Number)
    return new Date(year || 0, (month || 1) - 1, day || 1).getTime()
  }

  const pendingDays = (isoDate: string) => {
    const [year, month, day] = isoDate.split('-').map(Number)
    if (!year || !month || !day) return 0
    const start = new Date(year, month - 1, day)
    start.setHours(0, 0, 0, 0)
    const end = new Date()
    end.setHours(0, 0, 0, 0)
    return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 86_400_000))
  }

  const selectedBaseIncome =
    monthlyIncomeByMonth[financeSelectedMonth] ??
    (financeSelectedMonth === currentFinanceMonthKey ? monthlyIncome : 0)

  const selectedOtherIncome =
    otherIncomeByMonth[financeSelectedMonth] ??
    (financeSelectedMonth === currentFinanceMonthKey ? otherIncome : 0)

  const currentBaseIncome =
    monthlyIncomeByMonth[currentFinanceMonthKey] ?? monthlyIncome

  const currentOtherIncome =
    otherIncomeByMonth[currentFinanceMonthKey] ?? otherIncome

  const paidShiftsThisMonth = shifts.filter(
    shift => shift.status === 'Pago' && isIsoInFinanceMonth(shift.paidDate || shift.date)
  )
  const pendingShiftsForFinance = shifts.filter(shift => shift.status !== 'Pago')
  const pendingShiftsSelectedMonth = pendingShiftsForFinance.filter(
    shift => isIsoInFinanceMonth(shift.date)
  )

  const totalPaidShiftsThisMonth = paidShiftsThisMonth.reduce((acc, shift) => acc + getShiftValue(shift), 0)
  const totalPendingShiftsForFinance = pendingShiftsForFinance.reduce((acc, shift) => acc + getShiftValue(shift), 0)
  const totalPaidDailyThisMonth = paidShiftsThisMonth.reduce((acc, shift) => acc + (Number(shift.baseRate) || 0), 0)
  const totalPaidCommissionThisMonth = paidShiftsThisMonth.reduce((acc, shift) => acc + (Number(shift.commission) || 0), 0)

  const specialistIncomeThisMonth = specialistConsultations
    .filter(item => isIsoInFinanceMonth(item.date))
    .reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.unitValue) || 0), 0)

  const getExpenseStatus = (item: FinancialItem): 'Pago' | 'Pendente' => {
    if (item.status === 'Pago' || item.status === 'Pendente') return item.status
    // Compatibilidade com lançamentos antigos: compras/faturas de cartão entram como pendentes
    // para que possam ser marcadas como pagas; demais gastos antigos permanecem como pagos.
    return item.category.toLocaleLowerCase('pt-BR').includes('cartão') ? 'Pendente' : 'Pago'
  }

  const financesThisMonth = finances.filter(item => isBrDateInFinanceMonth(item.date))

  // CONTAS A PAGAR: ficam aqui até a confirmação do pagamento.
  // Enquanto estiverem pendentes, não reduzem o saldo disponível.
  const pendingExpensesForFinance = finances
    .filter(item => getExpenseStatus(item) === 'Pendente')

  const totalPendingExpensesForFinance = pendingExpensesForFinance
    .reduce((acc, item) => acc + (Number(item.amount) || 0), 0)

  const pendingExpensesThisMonth = pendingExpensesForFinance
    .filter(item => isBrDateInFinanceMonth(item.date))

  const totalPendingExpensesThisMonth = pendingExpensesThisMonth
    .reduce((acc, item) => acc + (Number(item.amount) || 0), 0)

  // DESPESAS PAGAS: saem do caixa no mês em que foram realmente pagas.
  // Registros antigos sem paidDate usam a data original do lançamento.
  const paidExpensesThisMonth = finances.filter(item => {
    if (getExpenseStatus(item) !== 'Pago') return false
    return item.paidDate
      ? isIsoInFinanceMonth(item.paidDate)
      : isBrDateInFinanceMonth(item.date)
  })

  const totalPaidExpensesThisMonth = paidExpensesThisMonth
    .reduce((acc, item) => acc + (Number(item.amount) || 0), 0)

  const totalGastosLancadosThisMonth = financesThisMonth
    .reduce((acc, item) => acc + (Number(item.amount) || 0), 0)

  // "totalGastos" representa o dinheiro que efetivamente saiu do caixa.
  const totalGastos = totalPaidExpensesThisMonth

  const totalRendaGeral = selectedBaseIncome + selectedOtherIncome + totalPaidShiftsThisMonth + specialistIncomeThisMonth
  const saldoRestante = totalRendaGeral - totalPaidExpensesThisMonth

  // Dashboard principal sempre usa o mês atual, independentemente do mês aberto em Finanças.
  const currentPaidShiftsAmount = shifts
    .filter(shift => shift.status === 'Pago' && isIsoInFinanceMonth(shift.paidDate || shift.date, currentFinanceMonthKey))
    .reduce((acc, shift) => acc + getShiftValue(shift), 0)

  const currentSpecialistIncome = specialistConsultations
    .filter(item => isIsoInFinanceMonth(item.date, currentFinanceMonthKey))
    .reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.unitValue) || 0), 0)

  const totalRendaAtualDashboard = currentBaseIncome + currentOtherIncome + currentPaidShiftsAmount + currentSpecialistIncome

  const expensePalette = ['#db2777', '#7c3aed', '#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626', '#64748b']

  const expenseDescriptionMap = new Map<string, { label: string; category: string; amount: number }>()
  paidExpensesThisMonth.forEach(item => {
    const key = item.description.trim().toLocaleLowerCase('pt-BR') || item.category
    const current = expenseDescriptionMap.get(key)
    if (current) {
      current.amount += Number(item.amount) || 0
    } else {
      expenseDescriptionMap.set(key, {
        label: item.description.trim() || item.category,
        category: item.category,
        amount: Number(item.amount) || 0,
      })
    }
  })

  const expenseByDescription = Array.from(expenseDescriptionMap.values())
    .sort((a, b) => b.amount - a.amount)

  const expenseChartItems = (() => {
    if (expenseByDescription.length <= 7) return expenseByDescription
    const visible = expenseByDescription.slice(0, 7)
    const remaining = expenseByDescription.slice(7).reduce((acc, item) => acc + item.amount, 0)
    return [...visible, { label: 'Outros lançamentos', category: 'Outros', amount: remaining }]
  })()

  const totalIncomeCommittedPct = totalRendaGeral > 0 ? (totalGastos / totalRendaGeral) * 100 : 0
  const incomeCommitmentBarPct = Math.min(100, Math.max(0, totalIncomeCommittedPct))
  const chartUsesIncomeScale = totalRendaGeral > 0 && totalGastos <= totalRendaGeral
  const expenseChartBase = chartUsesIncomeScale ? totalRendaGeral : Math.max(totalGastos, 1)

  let expenseChartCursor = 0
  const expenseChartSegments = expenseChartItems.map((item, index) => {
    const start = expenseChartCursor
    const share = (item.amount / expenseChartBase) * 100
    const end = Math.min(100, start + share)
    expenseChartCursor = end
    return {
      ...item,
      color: expensePalette[index % expensePalette.length],
      incomePercent: totalRendaGeral > 0 ? (item.amount / totalRendaGeral) * 100 : 0,
      start,
      end,
    }
  })

  const availableChartPct = chartUsesIncomeScale ? Math.max(0, 100 - expenseChartCursor) : 0
  const expenseDonutGradient = expenseChartSegments.length > 0
    ? `conic-gradient(${[
        ...expenseChartSegments.map(segment => `${segment.color} ${segment.start.toFixed(2)}% ${segment.end.toFixed(2)}%`),
        ...(availableChartPct > 0 ? [`#e7e5e4 ${expenseChartCursor.toFixed(2)}% 100%`] : []),
      ].join(', ')})`
    : 'conic-gradient(#e7e5e4 0% 100%)'

  const expensesForFinanceHistory = [
    ...paidExpensesThisMonth,
    ...pendingExpensesThisMonth.filter(
      pending => !paidExpensesThisMonth.some(paid => paid.id === pending.id)
    ),
  ]

  const financeHistoryEntries: FinanceHistoryEntry[] = [
    ...expensesForFinanceHistory.map(item => ({
      id: `expense-${item.id}`,
      type: 'expense' as const,
      source: 'expense' as const,
      label: item.description,
      category: item.category,
      amount: Number(item.amount) || 0,
      date: getExpenseStatus(item) === 'Pago' && item.paidDate ? item.paidDate : item.date,
      expenseId: item.id,
      expenseStatus: getExpenseStatus(item),
      expensePaidDate: item.paidDate,
    })),
    ...paidShiftsThisMonth.map(shift => {
      const clinic = clinics.find(item => item.id === shift.clinicId)
      return {
        id: `paid-shift-${shift.id}`,
        type: 'received' as const,
        source: 'shift' as const,
        label: `${clinic?.name || 'Clínica'} • plantão/comissão`,
        category: 'Plantões e comissões',
        amount: getShiftValue(shift),
        date: shift.paidDate || shift.date,
        shiftId: shift.id,
      }
    }),
    ...pendingShiftsSelectedMonth.map(shift => {
      const clinic = clinics.find(item => item.id === shift.clinicId)
      return {
        id: `pending-shift-${shift.id}`,
        type: 'pending' as const,
        source: 'shift' as const,
        label: `${clinic?.name || 'Clínica'} • a receber`,
        category: 'Plantões e comissões',
        amount: getShiftValue(shift),
        date: shift.date,
        shiftId: shift.id,
      }
    }),
    ...specialistConsultations
      .filter(item => isIsoInFinanceMonth(item.date))
      .map(item => {
        const clinic = clinics.find(clinicItem => clinicItem.id === item.clinicId)
        return {
          id: `specialist-${item.id}`,
          type: 'received' as const,
          source: 'specialist' as const,
          label: `${item.specialty}${clinic?.name ? ` • ${clinic.name}` : ''}`,
          category: 'Consultas especialistas',
          amount: (Number(item.quantity) || 0) * (Number(item.unitValue) || 0),
          date: item.date,
        }
      }),
    ...(selectedBaseIncome > 0 ? [{
      id: `base-${financeSelectedMonth}`,
      type: 'received' as const,
      source: 'base' as const,
      label: 'Renda base do mês',
      category: 'Renda base',
      amount: selectedBaseIncome,
      date: `${financeSelectedMonth}-01`,
    }] : []),
    ...(selectedOtherIncome > 0 ? [{
      id: `other-${financeSelectedMonth}`,
      type: 'received' as const,
      source: 'other' as const,
      label: 'Outras rendas recebidas',
      category: 'Outras rendas',
      amount: selectedOtherIncome,
      date: `${financeSelectedMonth}-01`,
    }] : []),
  ].sort((a, b) => financeDateTimestamp(b.date) - financeDateTimestamp(a.date))

  const filteredFinanceHistoryEntries = financeHistoryEntries.filter(entry => {
    const matchesFilter =
      financeHistoryFilter === 'all' ||
      (financeHistoryFilter === 'expense' && entry.source === 'expense') ||
      (financeHistoryFilter === 'received' && entry.type === 'received') ||
      (financeHistoryFilter === 'pending' && (
        entry.type === 'pending' ||
        (entry.source === 'expense' && entry.expenseStatus === 'Pendente')
      ))

    const query = financeHistorySearch.trim().toLocaleLowerCase('pt-BR')
    const matchesSearch =
      !query ||
      `${entry.label} ${entry.category}`.toLocaleLowerCase('pt-BR').includes(query)

    return matchesFilter && matchesSearch
  })

  const handleAddFinancial = (e: React.FormEvent) => {
    e.preventDefault()
    if (!finDesc || !finAmount) return

    const parsedAmount = parseCurrencyInput(finAmount)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      alert('Informe um valor válido. Ex.: 1.500,00 ou 1500.00')
      return
    }

    lastLocalMutationRef.current = Date.now()
    const catFinal = finCategory === 'Outro' && finCustomCategory.trim() ? finCustomCategory.trim() : finCategory
    const newF: FinancialItem = {
      id: Date.now().toString(),
      description: finDesc.trim(),
      category: catFinal,
      amount: parsedAmount,
      date: isoToBrDate(finDate),
      status: finStatus,
      paidDate: finStatus === 'Pago' ? finDate : undefined,
    }
    setFinances(prev => [newF, ...prev])
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
      evolutions: [initialEvo],
      neoplasia: newNeoplasia.trim(),
      timeline: [],
      alerts: [],
      continuousMedications: []
    }
    setPatients([newP, ...patients])
    setNewPetName('')
    setNewBreed('')
    setNewAge('')
    setNewWeight('')
    setNewTutor('')
    setNewNeoplasia('')
    setNewComplaint('')
  }

  const handleAddTimelineEvent = (patientId: string, event: PatientTimelineEvent) => {
    lastLocalMutationRef.current = Date.now()
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, timeline: [event, ...(p.timeline || [])] } : p))
  }

  const handleAddPatientAlert = (patientId: string, alert: PatientAlert) => {
    lastLocalMutationRef.current = Date.now()
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, alerts: [alert, ...(p.alerts || [])] } : p))
  }

  const handleResolvePatientAlert = (patientId: string, alertId: string) => {
    lastLocalMutationRef.current = Date.now()
    setPatients(prev => prev.map(p => p.id === patientId ? {
      ...p,
      alerts: (p.alerts || []).map(a => a.id === alertId ? { ...a, resolved: true } : a)
    } : p))
  }

  const handleUpdateContinuousMedications = (patientId: string, medications: string[]) => {
    lastLocalMutationRef.current = Date.now()
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, continuousMedications: medications } : p))
  }

  const handleOpenPatient = (patientId: string) => {
    setFocusedPatientId(patientId)
    setActiveTab('pacientes')
    window.setTimeout(() => {
      document.getElementById(`patient-${patientId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
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

  const buildAiPatientContext = (patientId: string) => {
    if (!patientId) return ''
    const patient = patients.find(p => p.id === patientId)
    if (!patient) return ''

    const recentEvolutions = (patient.evolutions || []).slice(0, 5).map(evolution =>
      `- ${evolution.date}: peso ${evolution.weight || 'N/I'}; temperatura ${evolution.temperature || 'N/I'}; ${evolution.notes || 'sem observações'}`
    )

    const recentTimeline = (patient.timeline || []).slice(0, 6).map(item =>
      `- ${item.date}: ${item.title}${item.notes ? ` — ${item.notes}` : ''}`
    )

    const activeAlerts = (patient.alerts || []).filter(alert => !alert.resolved).slice(0, 5).map(alert =>
      `- ${alert.title}: ${alert.message}`
    )

    return [
      'CONTEXTO CLÍNICO DO PRONTUÁRIO SELECIONADO:',
      `Paciente: ${patient.petName}`,
      `Espécie: ${patient.species || 'N/I'}`,
      `Raça: ${patient.breed || 'N/I'}`,
      `Idade: ${patient.age || 'N/I'}`,
      `Status: ${patient.status || 'N/I'}`,
      patient.neoplasia ? `Neoplasia/diagnóstico registrado: ${patient.neoplasia}` : '',
      patient.complaint ? `Queixa registrada: ${patient.complaint}` : '',
      patient.continuousMedications?.length ? `Medicações contínuas: ${patient.continuousMedications.join(', ')}` : '',
      recentEvolutions.length ? `Evoluções recentes:\n${recentEvolutions.join('\n')}` : '',
      recentTimeline.length ? `Timeline recente:\n${recentTimeline.join('\n')}` : '',
      activeAlerts.length ? `Alertas ativos:\n${activeAlerts.join('\n')}` : '',
      'Observação de privacidade: o nome do tutor não foi incluído neste contexto.'
    ].filter(Boolean).join('\n')
  }

  const buildCopilotInstruction = () => {
    const common = [
      'Você está auxiliando uma médica-veterinária em contexto profissional.',
      'Responda em português do Brasil, com linguagem técnica clara e objetiva.',
      'Não invente dados do paciente, resultados de exames, doses, referências laboratoriais ou protocolos.',
      'Quando faltarem informações relevantes, diga explicitamente o que falta e faça perguntas clínicas úteis.',
      'Diferencie fato fornecido, hipótese/diferencial e recomendação a ser confirmada pela veterinária.',
      'Destaque sinais de alarme e situações que exigem atendimento imediato quando forem pertinentes.',
      'Em fármacos, quimioterapia ou situações de maior risco, priorize checagem de dose, concentração, protocolo, contraindicações e referências profissionais antes da decisão final.'
    ]

    if (aiResponseMode === 'tutor') {
      return [...common,
        'MODO: EXPLICAÇÃO AO TUTOR.',
        'Transforme a orientação em texto compreensível ao tutor, sem alarmismo e sem afirmar diagnóstico que não esteja confirmado.',
        'Inclua sinais de alerta e quando procurar atendimento, se aplicável.'
      ].join('\n')
    }

    if (aiResponseMode === 'record') {
      return [...common,
        'MODO: ORGANIZAÇÃO DE PRONTUÁRIO.',
        'Organize a resposta de forma concisa e clínica, adequada para revisão pela veterinária antes de salvar no prontuário.',
        'Não acrescente achados que não foram fornecidos.'
      ].join('\n')
    }

    return [...common,
      'MODO: ANÁLISE CLÍNICA.',
      'Quando fizer sentido, estruture em: resumo do caso, dados críticos/red flags, principais diferenciais, exames/avaliações úteis, próximos passos e informações ainda faltantes.',
      'Evite listas enormes de diferenciais sem priorização.'
    ].join('\n')
  }

  const extractAiReply = (payload: any) => {
    const candidates = [
      payload?.reply,
      payload?.message,
      payload?.text,
      payload?.content,
      payload?.answer,
      payload?.result,
      payload?.rawText,
      payload?.choices?.[0]?.message?.content,
      payload?.choices?.[0]?.text
    ]

    const found = candidates.find(value => typeof value === 'string' && value.trim())
    return typeof found === 'string' ? found.trim() : ''
  }

  const requestVetAi = async (payload: any) => {
    let lastError: Error | null = null

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const controller = new AbortController()
      const timeout = window.setTimeout(() => controller.abort(), 35000)

      try {
        const response = await fetch('/api/vet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        })

        const rawText = await response.text()
        let data: any = {}

        if (rawText) {
          try {
            data = JSON.parse(rawText)
          } catch {
            data = { rawText }
          }
        }

        if (!response.ok) {
          const serverMessage = typeof data?.error === 'string'
            ? data.error
            : typeof data?.message === 'string'
              ? data.message
              : ''

          let friendlyMessage = serverMessage || `O servidor da IA respondeu com erro ${response.status}.`
          if (response.status === 404) friendlyMessage = 'A rota /api/vet não foi encontrada no deploy. O backend do Copiloto precisa estar publicado.'
          if (response.status === 401 || response.status === 403) friendlyMessage = 'O backend da IA recusou a autenticação. Verifique a chave/configuração do provedor no servidor.'
          if (response.status === 429) friendlyMessage = 'O serviço de IA atingiu um limite temporário de requisições. Tente novamente em instantes.'
          if (response.status === 413) friendlyMessage = 'A imagem ficou grande demais para o servidor. Tente uma foto menor ou recortada.'
          if (response.status === 415) friendlyMessage = 'A rota /api/vet ainda não está aceitando imagens. O backend do Copiloto precisa ser atualizado para visão.'
          if (response.status >= 500) friendlyMessage = `O servidor da IA está indisponível no momento (${response.status}).`

          const error = new Error(friendlyMessage) as Error & { retryable?: boolean }
          error.retryable = [408, 429, 500, 502, 503, 504].includes(response.status)
          throw error
        }

        const reply = extractAiReply(data)
        if (!reply) {
          throw new Error('A IA respondeu, mas o servidor não retornou um texto utilizável.')
        }

        return reply
      } catch (error: any) {
        if (error?.name === 'AbortError') {
          lastError = new Error('A resposta da IA demorou mais de 35 segundos e foi interrompida.')
        } else {
          lastError = error instanceof Error ? error : new Error('Falha desconhecida ao consultar a IA.')
        }

        const retryable = error?.name === 'AbortError' || error?.retryable === true || error instanceof TypeError
        if (!retryable || attempt === 1) break
        await new Promise(resolve => window.setTimeout(resolve, 900))
      } finally {
        window.clearTimeout(timeout)
      }
    }

    throw lastError || new Error('Não foi possível consultar a IA.')
  }

  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!chatInput.trim() && aiAttachments.length === 0) || isAiLoading || isPreparingAiAttachment) return

    const attachedFiles = [...aiAttachments]
    const typedText = chatInput.trim()
    const userText = typedText || (
      attachedFiles.length === 1
        ? `Analise este ${attachedFiles[0].kind === 'pdf' ? 'PDF' : 'arquivo'} e descreva os achados relevantes para o caso clínico.`
        : 'Analise estes arquivos em conjunto, correlacione as informações e destaque achados relevantes, concordâncias e diferenças.'
    )
    const targetSession = chatSessions.find(session => session.id === currentChatId) || chatSessions[0]

    if (!targetSession) {
      setAiStatus('error')
      setAiErrorDetail('Não foi possível localizar a conversa atual. Crie um novo caso e tente novamente.')
      return
    }

    const targetSessionId = targetSession.id
    if (currentChatId !== targetSessionId) setCurrentChatId(targetSessionId)

    const isDefaultTitle = targetSession.title === 'Novo Caso Clínico' || targetSession.title === 'Caso Clínico Inicial'
    const newTitle = isDefaultTitle
      ? (userText.length > 34 ? userText.substring(0, 34) + '...' : userText)
      : targetSession.title

    const attachmentSummary = attachedFiles.length
      ? attachedFiles.map(file => `${file.kind === 'pdf' ? '📄' : '📷'} ${file.name}`).join('\n')
      : ''

    const userMsg: ChatMessage = {
      sender: 'user',
      text: attachmentSummary
        ? `${attachmentSummary}${typedText ? `\n\n${typedText}` : '\n\nSolicitação: analisar os arquivos anexados.'}`
        : userText
    }

    setChatInput('')
    setAiAttachments([])
    setIsAiLoading(true)
    setAiStatus('ready')
    setAiErrorDetail('')
    lastLocalMutationRef.current = Date.now()

    setChatSessions(prevSessions => {
      const updated = prevSessions.map(session =>
        session.id === targetSessionId
          ? { ...session, title: newTitle, messages: [...session.messages, userMsg] }
          : session
      )
      localStorage.setItem('vet_chat_sessions_v28', JSON.stringify(updated))
      return updated
    })

    const patientContext = buildAiPatientContext(aiPatientContextId)
    const copilotInstruction = buildCopilotInstruction()
    const imageInstruction = attachedFiles.length
      ? [
          `${attachedFiles.length} ARQUIVO(S) ANEXADO(S) À SOLICITAÇÃO.`,
          'Analise todos os arquivos fornecidos junto com a pergunta e correlacione as informações quando fizer sentido.',
          'Para arquivos com texto (laudos, exames, prescrições, resultados, telas ou documentos), LEIA PRIMEIRO e só depois interprete.',
          'Faça uma checagem visual cuidadosa de nomes, números, unidades, datas, siglas e valores antes de responder.',
          'Não autocorrija nem complete palavras duvidosas. Quando um trecho não puder ser lido com segurança, marque como [ilegível] ou [incerto] em vez de adivinhar.',
          'Para imagens, descreva apenas o que é realmente visível. Para PDFs, use apenas conteúdo efetivamente legível no documento.',
          'Diferencie claramente: 1) texto/achado observado; 2) interpretação clínica.',
          'Se algum arquivo estiver desfocado, cortado, ilegível, incompleto ou insuficiente, identifique qual arquivo apresenta a limitação.',
          'Não invente texto, resultados, medidas, estruturas anatômicas, diagnóstico ou achados ausentes.'
        ].join('\n')
      : ''

    const enrichedPrompt = [
      copilotInstruction,
      patientContext,
      imageInstruction,
      'SOLICITAÇÃO DA DRA. BEATRIZ:',
      userText
    ].filter(Boolean).join('\n\n')

    const historyForApi: ChatMessage[] = [
      ...targetSession.messages.slice(-14),
      { sender: 'user', text: enrichedPrompt }
    ]

    try {
      const replyText = await requestVetAi({
        prompt: enrichedPrompt,
        messages: historyForApi,
        responseMode: aiResponseMode,
        patientId: aiPatientContextId || null,
        files: attachedFiles.map(file => ({
          name: file.name,
          mimeType: file.mimeType,
          dataUrl: file.dataUrl,
          kind: file.kind,
        })),
        image: attachedFiles.length === 1 && attachedFiles[0].kind === 'image'
          ? {
              name: attachedFiles[0].name,
              mimeType: attachedFiles[0].mimeType,
              dataUrl: attachedFiles[0].dataUrl
            }
          : null
      })

      lastLocalMutationRef.current = Date.now()
      setAiStatus('online')

      setChatSessions(prevSessions => {
        let aiMessageIndex = -1
        const updated = prevSessions.map(session => {
          if (session.id !== targetSessionId) return session
          aiMessageIndex = session.messages.length
          return { ...session, messages: [...session.messages, { sender: 'ai' as const, text: replyText }] }
        })

        if (attachedFiles.length && aiMessageIndex >= 0) {
          setLastAiRequestFiles(prev => ({
            ...prev,
            [`${targetSessionId}-${aiMessageIndex}`]: attachedFiles.map(file => file.name)
          }))
        }

        localStorage.setItem('vet_chat_sessions_v28', JSON.stringify(updated))
        return updated
      })
    } catch (error: any) {
      const message = error instanceof Error ? error.message : 'Falha na conexão com a IA.'
      setAiStatus('error')
      setAiErrorDetail(message)
      setChatInput(typedText)
      if (attachedFiles.length) setAiAttachments(attachedFiles)

      lastLocalMutationRef.current = Date.now()
      setChatSessions(prevSessions => {
        const updated = prevSessions.map(session =>
          session.id === targetSessionId
            ? {
                ...session,
                messages: [
                  ...session.messages,
                  {
                    sender: 'ai' as const,
                    text: `⚠️ Não consegui concluir esta resposta. ${message}\n\nSua pergunta foi mantida no campo abaixo para você tentar novamente.`
                  }
                ]
              }
            : session
        )
        localStorage.setItem('vet_chat_sessions_v28', JSON.stringify(updated))
        return updated
      })
    } finally {
      lastLocalMutationRef.current = Date.now()
      setIsAiLoading(false)
    }
  }

  const getClinicById = (clinicId?: string) => clinics.find(c => c.id === clinicId)

  const getEventClinicName = (ev: CalendarEvent) => {
    if (ev.clinicName?.trim()) return ev.clinicName.trim()
    return getClinicById(ev.clinicId)?.name || ''
  }

  const getEventClinicColor = (ev: CalendarEvent) => {
    if (ev.clinicColor?.trim()) return ev.clinicColor
    const clinicIndex = clinics.findIndex(c => c.id === ev.clinicId)
    const fallback = ['#111827', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4', '#d946ef']
    return clinicIndex >= 0 ? fallback[clinicIndex % fallback.length] : '#9ca3af'
  }

  const getContrastTextColor = (hex?: string) => {
    const value = (hex || '#ec4899').replace('#', '')
    if (!/^[0-9a-fA-F]{6}$/.test(value)) return '#ffffff'
    const r = parseInt(value.slice(0, 2), 16)
    const g = parseInt(value.slice(2, 4), 16)
    const b = parseInt(value.slice(4, 6), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b)
    return luminance > 165 ? '#3f1830' : '#ffffff'
  }

  const eventTimeToMinutes = (time?: string) => {
    if (!time?.trim()) return Number.POSITIVE_INFINITY

    const normalized = time
      .trim()
      .toLowerCase()
      .replace('h', ':')
      .replace(/\s+/g, '')

    const match = normalized.match(/^(\d{1,2})(?::(\d{1,2}))?$/)
    if (!match) return Number.POSITIVE_INFINITY

    const hours = Number(match[1])
    const minutes = Number(match[2] || '0')

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return Number.POSITIVE_INFINITY
    }

    return hours * 60 + minutes
  }

  const normalizeCalendarTime = (time?: string) => {
    if (!time?.trim()) return time

    const normalized = time
      .trim()
      .toLowerCase()
      .replace('h', ':')
      .replace(/\s+/g, '')

    const match = normalized.match(/^(\d{1,2})(?::(\d{1,2}))?$/)
    if (!match) return time.trim()

    const hours = Number(match[1])
    const minutes = Number(match[2] || '0')

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return time.trim()
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  const sortEventsChronologically = (eventList: CalendarEvent[]) => {
    return [...eventList].sort((a, b) => {
      const minutesA = eventTimeToMinutes(a.time)
      const minutesB = eventTimeToMinutes(b.time)

      if (minutesA !== minutesB) return minutesA - minutesB
      return a.title.localeCompare(b.title, 'pt-BR')
    })
  }

  const sortAllCalendarEvents = (eventList: CalendarEvent[]) => {
    return [...eventList].sort((a, b) => {
      const dateCompare = a.dateKey.localeCompare(b.dateKey)
      if (dateCompare !== 0) return dateCompare

      const minutesA = eventTimeToMinutes(a.time)
      const minutesB = eventTimeToMinutes(b.time)

      if (minutesA !== minutesB) return minutesA - minutesB
      return a.title.localeCompare(b.title, 'pt-BR')
    })
  }

  const filteredDrugs = customDrugs.filter(d => d.name.toLowerCase().includes(drugSearchQuery.toLowerCase()) || d.category.toLowerCase().includes(drugSearchQuery.toLowerCase()))

  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstWeekdayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
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

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept=".docx,.doc,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.webp,.pdf,image/*,application/pdf" />

      {/* BARRA LATERAL */}
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
                  <span className="truncate">Livros, Filmes & Séries</span>
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

          <button onClick={() => setActiveTab('receitas')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'receitas' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <FileText className="w-4 h-4" /> Receitas Veterinárias 🧾
          </button>

          <div className="pt-2 border-t border-pink-100/60 mt-2 space-y-1">
            <div className="px-3 py-1 text-[10px] font-extrabold text-pink-400 uppercase tracking-widest">🔬 Oncologia Avançada</div>
            <button onClick={() => setActiveTab('labref')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'labref' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <ClipboardList className="w-4 h-4" /> Checklist Pré-Quimioterapia
            </button>
            <button onClick={() => setActiveTab('protocolos')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'protocolos' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <Syringe className="w-4 h-4" /> Simulador Protocolos (CHOP etc.)
            </button>
            <button onClick={() => setActiveTab('nadir')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'nadir' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <Activity className="w-4 h-4" /> Calculadora de Nadir & Hemograma
            </button>
            <button onClick={() => setActiveTab('extravasamento')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'extravasamento' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <ShieldAlert className="w-4 h-4" /> Guia de Extravasamento
            </button>
            <button onClick={() => setActiveTab('ajustes')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'ajustes' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <Scale className="w-4 h-4" /> Ajustes para Pacientes Extremos
            </button>
            <button onClick={() => setActiveTab('funcaorganica')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'funcaorganica' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <ClipboardList className="w-4 h-4" /> Cruzamento Função Orgânica
            </button>
            <button onClick={() => setActiveTab('toxicidadevcog')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'toxicidadevcog' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <Activity className="w-4 h-4" /> Graduação Toxicidade (VCOG)
            </button>
            <button onClick={() => setActiveTab('interacoesonco')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'interacoesonco' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <ShieldAlert className="w-4 h-4" /> Interações Medicamentosas
            </button>
            <button onClick={() => setActiveTab('posquimio')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'posquimio' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <FileText className="w-4 h-4" /> Orientações Pós-Quimio
            </button>
            <button onClick={() => setActiveTab('histologia')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'histologia' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <ClipboardList className="w-4 h-4" /> Laudos & Graduação Histológica
            </button>
          </div>

          <div className="pt-2 border-t border-pink-100/60 mt-2 space-y-1">
            <div className="px-3 py-1 text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">🥗 Nutrição Canina</div>
            <button onClick={() => setActiveTab('nutricaoenergia')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'nutricaoenergia' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <Calculator className="w-4 h-4" /> Necessidade Energética (RER/MER)
            </button>
            <button onClick={() => setActiveTab('nutricaoecc')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'nutricaoecc' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <Scale className="w-4 h-4" /> ECC 1–9 & Meta de Peso
            </button>
            <button onClick={() => setActiveTab('nutricaotoxicos')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'nutricaotoxicos' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <AlertTriangle className="w-4 h-4" /> Alimentos Tóxicos / Proibidos
            </button>
            <button onClick={() => setActiveTab('nutricaodieta')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'nutricaodieta' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <ClipboardList className="w-4 h-4" /> Dieta Caseira (Cozida/Crua)
            </button>
          </div>
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
            <GlobalPatientSearch patients={patients} onSelectPatient={handleOpenPatient} />
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
              <ClinicalDashboard
                patients={patients}
                events={events}
                tasks={tasks}
                onOpenPatient={handleOpenPatient}
                onResolveAlert={handleResolvePatientAlert}
                onToggleTask={(taskId) => {
                  lastLocalMutationRef.current = Date.now()
                  setTasks(prevTasks =>
                    prevTasks.map(task =>
                      task.id === taskId ? { ...task, completed: !task.completed } : task
                    )
                  )
                }}
              />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div onClick={() => setActiveTab('financas')} className="bg-white/90 backdrop-blur-sm border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-300 transition">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Renda Recebida no Mês</span>
                    <div className="text-2xl font-extrabold text-emerald-600 mt-1">{maskValue(totalRendaAtualDashboard)}</div>
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

              {/* COMPROMISSOS DE HOJE */}
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-extrabold text-pink-500 uppercase tracking-widest">
                      <CalendarIcon className="w-4 h-4" /> Agenda de hoje
                    </div>
                    <h2 className="text-lg font-extrabold text-pink-950 mt-1">Compromissos do Dia</h2>
                    <p className="text-xs text-stone-500 capitalize">{formattedHeaderDate}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('calendario'); setSelectedDate(todayDateKey); }}
                    className="bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 px-4 py-2 rounded-xl text-xs font-bold transition"
                  >
                    Abrir calendário
                  </button>
                </div>

                {events.filter(ev => ev.dateKey === todayDateKey).length === 0 ? (
                  <div className="py-6 text-center">
                    <div className="text-2xl mb-2">🌷</div>
                    <p className="text-xs font-bold text-stone-500">Nenhum compromisso marcado para hoje.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {sortEventsChronologically(events.filter(ev => ev.dateKey === todayDateKey))
                      .map((ev, idx) => (
                        <button
                          type="button"
                          key={`${ev.dateKey}-${ev.time}-${ev.title}-${idx}`}
                          onClick={() => { setActiveTab('calendario'); setSelectedDate(ev.dateKey); }}
                          className="text-left bg-pink-50/30 hover:bg-pink-50 border border-pink-100 rounded-2xl p-4 transition border-l-4"
                          style={{ borderLeftColor: getEventClinicColor(ev) }}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0 mt-1 ring-2 ring-white shadow-sm"
                              style={{ backgroundColor: getEventClinicColor(ev) }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                {ev.time && <span className="text-[10px] font-extrabold text-pink-700 bg-white border border-pink-100 px-2 py-0.5 rounded-lg">{ev.time}</span>}
                                {getEventClinicName(ev) && <span className="text-[10px] font-bold text-stone-500 truncate">{getEventClinicName(ev)}</span>}
                              </div>
                              <div className="text-sm font-extrabold text-pink-950 mt-1 truncate">{ev.title}</div>
                              {ev.description && <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{ev.description}</p>}
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* MURAL DE PETS */}
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-pink-100 pb-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold text-pink-500 uppercase tracking-wider">
                      <Heart className="w-4 h-4 text-pink-500 fill-pink-200" /> Cantinho Especial & Mural de Homenagem aos Pets
                    </div>
                    <h2 className="text-xl font-extrabold text-pink-950 mt-1">A Família de Quatro Patas da Dra. Beatriz (Atuais e Eternos)</h2>
                    <p className="text-xs text-stone-500 mt-0.5">Cadastre seus pets informando nome, idade, foto e homenagem. Fotos enviadas agora ficam sincronizadas entre os dispositivos.</p>
                  </div>

                  <input type="file" ref={petPhotoInputRef} onChange={handlePetPhotoUpload} className="hidden" accept="image/*" />

                  <form onSubmit={handleAddPersonalPet} className="flex flex-wrap items-center gap-2 bg-pink-50/60 p-3 rounded-2xl border border-pink-200">
                    <input type="text" placeholder="Nome do Pet" value={newPetBiaName} onChange={(e) => setNewPetBiaName(e.target.value)} className="bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs font-medium text-pink-950 focus:outline-none w-28" required />
                    <input type="text" placeholder="Idade (ex: 5 anos)" value={newPetBiaAge} onChange={(e) => setNewPetBiaAge(e.target.value)} className="bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs font-medium text-pink-950 focus:outline-none w-28" />
                    <input type="text" placeholder="Homenagem / Descrição" value={newPetBiaTribute} onChange={(e) => setNewPetBiaTribute(e.target.value)} className="bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs font-medium text-pink-950 focus:outline-none w-36" />
                    
                    <div className="flex items-center gap-1">
                      <input type="text" placeholder="URL externa (opcional)" value={newPetBiaPhotoUrl.startsWith('data:image/') ? 'Foto enviada ✓' : newPetBiaPhotoUrl} onChange={(e) => { if (!newPetBiaPhotoUrl.startsWith('data:image/')) setNewPetBiaPhotoUrl(e.target.value) }} readOnly={newPetBiaPhotoUrl.startsWith('data:image/')} className="bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs font-medium text-pink-950 focus:outline-none w-32" />
                      <button 
                        type="button"
                        onClick={() => petPhotoInputRef.current?.click()}
                        disabled={isPetPhotoProcessing}
                        className="bg-pink-100 hover:bg-pink-200 disabled:opacity-50 text-pink-800 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
                        title="Enviar foto do computador"
                      >
                        {isPetPhotoProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        {isPetPhotoProcessing ? 'Preparando...' : newPetBiaPhotoUrl.startsWith('data:image/') ? 'Foto pronta ✓' : 'Foto'}
                      </button>
                    </div>

                    <label className="flex items-center gap-1 text-[11px] font-bold text-stone-700 cursor-pointer">
                      <input type="checkbox" checked={newPetBiaMemorial} onChange={(e) => setNewPetBiaMemorial(e.target.checked)} className="accent-pink-500 w-3.5 h-3.5" /> Memorial 🕊️
                    </label>
                    <button type="submit" disabled={isPetPhotoProcessing} className="bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1">
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
                          {pet.photoUrl && !pet.photoUrl.startsWith('blob:') ? (
                            <img
                              src={pet.photoUrl}
                              alt={pet.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              onError={(e) => {
                                const img = e.currentTarget
                                img.style.display = 'none'
                                const fallback = img.nextElementSibling as HTMLElement | null
                                if (fallback) fallback.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <div
                            className="w-full h-full bg-pink-50 flex-col items-center justify-center text-pink-400 gap-2"
                            style={{ display: !pet.photoUrl || pet.photoUrl.startsWith('blob:') ? 'flex' : 'none' }}
                          >
                            <Camera className="w-8 h-8" />
                            <span className="text-[10px] font-bold text-center px-3">
                              {pet.photoUrl?.startsWith('blob:') ? 'Foto antiga precisa ser reenviada' : 'Sem foto'}
                            </span>
                          </div>
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
                    <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Registrar diária / comissão</h3>
                     
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
                            if (found && shiftBaseRate.trim() === '') {
                              setShiftBaseRate(found.defaultRate.toString())
                            }
                          }} 
                          className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium"
                        >
                          {clinics.map(c => (
                            <option key={c.id} value={c.id}>🏥 {c.name} (Base: R$ {c.defaultRate})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">{shiftStatus === 'Pago' ? 'Data do recebimento' : 'Data do lançamento / previsão'}</label>
                        <input type="date" value={shiftDate} onChange={(e) => setShiftDate(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium" required />
                        <p className="text-[10px] text-stone-400 mt-1">{shiftStatus === 'Pago' ? 'Como está Pago, esta data entra no caixa financeiro.' : 'Enquanto estiver Pendente, este valor fica apenas em “A receber” e não entra na renda.'}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <label className="text-xs font-bold text-stone-700">Valor da diária (R$) <span className="font-normal text-stone-400">— opcional</span></label>
                            {shiftBaseRate !== '' && (
                              <button type="button" onClick={() => setShiftBaseRate('')} className="text-[9px] font-bold text-pink-600 hover:underline">Sem diária</button>
                            )}
                          </div>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Deixe vazio se não houver diária"
                            value={shiftBaseRate}
                            onChange={(e) => setShiftBaseRate(e.target.value)}
                            className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Comissão (R$) <span className="font-normal text-stone-400">— opcional</span></label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Deixe vazio se não houver comissão"
                            value={shiftCommission}
                            onChange={(e) => setShiftCommission(e.target.value)}
                            className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium"
                          />
                        </div>
                      </div>

                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-[10px] text-emerald-900 leading-relaxed">
                        <strong>Os valores são independentes:</strong> pode salvar somente a diária, somente a comissão ou os dois juntos. Pelo menos um dos dois precisa ter valor.
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Tipo do lançamento</label>
                          <div className="h-[34px] flex items-center px-3.5 rounded-xl bg-stone-50 border border-stone-200 text-[10px] font-bold text-stone-600">
                            {shiftBaseRate.trim() !== '' && Number(shiftBaseRate) > 0 && shiftCommission.trim() !== '' && Number(shiftCommission) > 0
                              ? 'Diária + comissão'
                              : shiftBaseRate.trim() !== '' && Number(shiftBaseRate) > 0
                                ? 'Somente diária'
                                : shiftCommission.trim() !== '' && Number(shiftCommission) > 0
                                  ? 'Somente comissão'
                                  : 'Informe um dos valores'}
                          </div>
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
                        <label className="text-xs font-bold text-stone-700 block mb-1">Detalhes / referência <span className="font-normal text-stone-400">— opcional</span></label>
                        <input
                          type="text"
                          placeholder="Ex.: comissão referente a agosto / 2 cirurgias..."
                          value={shiftDetails}
                          onChange={(e) => setShiftDetails(e.target.value)}
                          className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium"
                        />
                      </div>

                      <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
                        <Plus className="w-4 h-4" /> Salvar lançamento
                      </button>
                    </form>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Consolidado Geral das Clínicas</h3>
                    <div className="bg-pink-50 border border-pink-200 p-5 rounded-2xl space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                          <div className="text-[9px] font-bold text-emerald-700 uppercase">Recebido</div>
                          <div className="text-lg font-extrabold text-emerald-800 mt-0.5">{maskValue(totalShiftsPaidAmount)}</div>
                          <div className="text-[9px] text-emerald-600 mt-1">Somente lançamentos marcados como Pago</div>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                          <div className="text-[9px] font-bold text-amber-700 uppercase">A receber</div>
                          <div className="text-lg font-extrabold text-amber-800 mt-0.5">{maskValue(totalShiftsPendingAmount)}</div>
                          <div className="text-[9px] text-amber-600 mt-1">Ainda não entra como renda</div>
                        </div>
                        <div className="bg-white border border-pink-200 rounded-xl p-3">
                          <div className="text-[9px] font-bold text-stone-500 uppercase">Total lançado</div>
                          <div className="text-lg font-extrabold text-pink-950 mt-0.5">{maskValue(totalShiftsAmount)}</div>
                          <div className="text-[9px] text-stone-400 mt-1">Pago + pendente</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white border border-pink-100 rounded-xl p-2.5">
                          <div className="text-[9px] font-bold text-stone-400 uppercase">Diárias lançadas</div>
                          <div className="text-sm font-extrabold text-pink-950 mt-0.5">{maskValue(totalShiftDailyAmount)}</div>
                        </div>
                        <div className="bg-white border border-pink-100 rounded-xl p-2.5">
                          <div className="text-[9px] font-bold text-stone-400 uppercase">Comissões lançadas</div>
                          <div className="text-sm font-extrabold text-pink-950 mt-0.5">{maskValue(totalShiftCommissionAmount)}</div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-pink-200/60 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-extrabold text-pink-950">Extrato de Plantões e Comissões</span>
                          <span className="text-[9px] text-stone-400">Clique no status para alterar</span>
                        </div>
                        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                          {shifts.length === 0 ? (
                            <p className="text-xs text-stone-400 text-center py-6">Nenhum lançamento registrado ainda.</p>
                          ) : (
                            shifts.map(s => {
                              const clinicObj = clinics.find(c => c.id === s.clinicId)
                              return (
                                <div key={s.id} className="bg-white border border-pink-200 p-3 rounded-xl text-xs shadow-2xs">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="font-extrabold text-pink-950">{clinicObj?.name || 'Clínica'}</div>
                                      <div className="text-[10px] text-stone-500 mt-0.5">
                                        Lançado/previsão: {formatLocalDate(s.date)}
                                        {s.status === 'Pago' && <span className="text-emerald-700 font-bold"> • Recebido: {formatLocalDate(s.paidDate || s.date)}</span>}
                                      </div>
                                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-stone-600 mt-1">
                                        {(Number(s.baseRate) || 0) > 0 && <span>Diária: <strong>{maskValue(Number(s.baseRate) || 0)}</strong></span>}
                                        {(Number(s.commission) || 0) > 0 && <span>Comissão: <strong>{maskValue(Number(s.commission) || 0)}</strong></span>}
                                        <span>Total: <strong>{maskValue(getShiftValue(s))}</strong></span>
                                      </div>
                                      {s.details && <div className="text-[10px] text-stone-400 mt-1">{s.details}</div>}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleShiftStatus(s.id)}
                                        className={`text-[10px] font-extrabold px-3 py-1.5 rounded-xl border transition ${
                                          s.status === 'Pago'
                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                                        }`}
                                        title={s.status === 'Pago' ? 'Marcar novamente como pendente' : 'Confirmar que este valor foi recebido'}
                                      >
                                        {s.status === 'Pago' ? '✓ Pago' : '○ Pendente'} ↔
                                      </button>
                                      <button onClick={() => { lastLocalMutationRef.current = Date.now(); setShifts(shifts.filter(item => item.id !== s.id)); }} className="text-stone-400 hover:text-red-500">
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
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
                    <h2 className="text-base font-extrabold text-pink-950">Consultas com Especialistas 🩺</h2>
                    <p className="text-xs text-pink-500 font-medium">Selecione a clínica, cadastre a especialidade e o valor recebido. O mês da data informada entra automaticamente na composição da renda.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Registrar Consulta Especializada</h3>
                    <form onSubmit={handleAddSpecialistConsultation} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Clínica de Atendimento</label>
                        <select 
                          value={specClinicId} 
                          onChange={(e) => setSpecClinicId(e.target.value)} 
                          className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium"
                        >
                          {clinics.map(c => (
                            <option key={c.id} value={c.id}>🏥 {c.name}</option>
                          ))}
                        </select>
                      </div>

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
                        <p className="text-[11px] text-stone-500 mt-1">Este valor entra automaticamente em “Especialistas” nas finanças do mês correspondente à data cadastrada.</p>
                      </div>

                      <div className="pt-3 border-t border-pink-200/60 space-y-2">
                        <span className="text-xs font-extrabold text-pink-950">Histórico de Consultas (Com Clínicas, Edição e Exclusão):</span>
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                          {specialistConsultations.length === 0 ? (
                            <p className="text-xs text-stone-400 text-center py-6">Nenhuma consulta com especialista registrada.</p>
                          ) : (
                            specialistConsultations.map(item => {
                              const isEditing = editingSpecialistId === item.id
                              const clinicObj = clinics.find(c => c.id === item.clinicId)
                              return (
                                <div key={item.id} className="bg-white border border-pink-200 p-3 rounded-xl text-xs shadow-2xs space-y-2">
                                  {isEditing ? (
                                    <div className="space-y-2">
                                      <div>
                                        <label className="text-[10px] font-bold text-stone-500 block mb-0.5">Clínica</label>
                                        <select 
                                          value={editSpecClinicId} 
                                          onChange={(e) => setEditSpecClinicId(e.target.value)} 
                                          className="w-full bg-pink-50 border border-pink-200 rounded-lg px-2.5 py-1 text-xs text-pink-950 font-bold"
                                        >
                                          {clinics.map(c => (
                                            <option key={c.id} value={c.id}>🏥 {c.name}</option>
                                          ))}
                                        </select>
                                      </div>
                                      <input 
                                        type="text" 
                                        value={editSpecSpecialty} 
                                        onChange={(e) => setEditSpecSpecialty(e.target.value)} 
                                        className="w-full bg-pink-50 border border-pink-200 rounded-lg px-2.5 py-1 text-xs text-pink-950 font-bold"
                                        placeholder="Especialidade"
                                      />
                                      <div className="grid grid-cols-2 gap-2">
                                        <input 
                                          type="number" 
                                          min="1" 
                                          value={editSpecQuantity} 
                                          onChange={(e) => setEditSpecQuantity(e.target.value)} 
                                          className="bg-pink-50 border border-pink-200 rounded-lg px-2.5 py-1 text-xs text-pink-950"
                                          placeholder="Qtd"
                                        />
                                        <input 
                                          type="number" 
                                          step="0.01" 
                                          value={editSpecUnitValue} 
                                          onChange={(e) => setEditSpecUnitValue(e.target.value)} 
                                          className="bg-pink-50 border border-pink-200 rounded-lg px-2.5 py-1 text-xs text-pink-950"
                                          placeholder="Valor Unitário R$"
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <input 
                                          type="date" 
                                          value={editSpecDate} 
                                          onChange={(e) => setEditSpecDate(e.target.value)} 
                                          className="bg-pink-50 border border-pink-200 rounded-lg px-2.5 py-1 text-xs text-pink-950"
                                        />
                                        <input 
                                          type="text" 
                                          value={editSpecNotes} 
                                          onChange={(e) => setEditSpecNotes(e.target.value)} 
                                          className="bg-pink-50 border border-pink-200 rounded-lg px-2.5 py-1 text-xs text-pink-950"
                                          placeholder="Observações"
                                        />
                                      </div>
                                      <div className="flex items-center gap-2 pt-1">
                                        <button 
                                          onClick={() => {
                                            const qty = parseInt(editSpecQuantity) || 1
                                            const val = parseFloat(editSpecUnitValue) || 0
                                            if (editSpecSpecialty.trim() && !isNaN(val)) {
                                              lastLocalMutationRef.current = Date.now()
                                              setSpecialistConsultations(specialistConsultations.map(s => s.id === item.id ? {
                                                ...s,
                                                clinicId: editSpecClinicId,
                                                specialty: editSpecSpecialty.trim(),
                                                quantity: qty,
                                                unitValue: val,
                                                date: editSpecDate || s.date,
                                                notes: editSpecNotes.trim()
                                              } : s))
                                              setEditingSpecialistId(null)
                                            }
                                          }} 
                                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg font-bold"
                                        >
                                          Salvar
                                        </button>
                                        <button 
                                          onClick={() => setEditingSpecialistId(null)} 
                                          className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-3 py-1 rounded-lg font-bold"
                                        >
                                          Cancelar
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="font-extrabold text-pink-950">
                                          🩺 {item.specialty} <span className="text-pink-600 font-semibold">({clinicObj?.name || 'Clínica'})</span> - {item.date}
                                        </div>
                                        <div className="text-[10px] text-stone-600">Qtd: {item.quantity} | Unit: {maskValue(item.unitValue)} | Total: <span className="font-bold text-emerald-600">{maskValue(item.quantity * item.unitValue)}</span> {item.notes ? `• ${item.notes}` : ''}</div>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <button 
                                          onClick={() => {
                                            setEditingSpecialistId(item.id)
                                            setEditSpecClinicId(item.clinicId || clinics[0]?.id || '')
                                            setEditSpecSpecialty(item.specialty)
                                            setEditSpecQuantity(item.quantity.toString())
                                            setEditSpecUnitValue(item.unitValue.toString())
                                            setEditSpecDate(item.date)
                                            setEditSpecNotes(item.notes || '')
                                          }}
                                          className="text-pink-600 hover:bg-pink-50 p-1 rounded-lg transition"
                                          title="Editar Consulta"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                          onClick={() => { lastLocalMutationRef.current = Date.now(); setSpecialistConsultations(specialistConsultations.filter(s => s.id !== item.id)); }} 
                                          className="text-stone-400 hover:text-red-500 p-1 transition"
                                          title="Excluir Consulta"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  )}
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
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-pink-950 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-pink-500" /> Livros, Filmes & Séries
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Status, capas, estrelas, favoritos, resenhas, metas e progresso automático.
                        </p>
                      </div>
                      <div className="text-[10px] bg-pink-50 border border-pink-100 text-pink-700 px-3 py-2 rounded-xl font-bold">
                        🔴 Quero começar • 🟡 Em andamento • 🟢 Concluído
                      </div>
                    </div>

                    <textarea
                      value={descompressaoNotes}
                      onChange={(e) => {
                        lastLocalMutationRef.current = Date.now()
                        setDescompressaoNotes(e.target.value)
                      }}
                      rows={3}
                      className="w-full bg-pink-50/25 border border-pink-200 p-4 rounded-2xl text-stone-800 text-xs leading-relaxed focus:outline-none focus:border-pink-400 resize-none font-normal placeholder-stone-300 select-text"
                      placeholder="Anotações gerais, autores favoritos, gêneros, plataformas..."
                    />

                    {renderPersonalMediaCategory(
                      'Livro',
                      'Livros',
                      'Marque como Quero ler, Lendo ou Lido. Os livros concluídos podem sair da lista atual sem serem apagados do histórico.',
                      '📚'
                    )}

                    {renderPersonalMediaCategory(
                      'Filme',
                      'Filmes',
                      'Organize o que quer assistir, o que está vendo e o que já foi concluído.',
                      '🎬'
                    )}

                    {renderPersonalMediaCategory(
                      'Série',
                      'Séries',
                      'Acompanhe séries desejadas, em andamento e já finalizadas.',
                      '📺'
                    )}

                    <div className="bg-white/95 border border-pink-100 rounded-3xl p-5 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="text-xs font-extrabold text-pink-950">✨ Recomendações rotativas</h4>
                          <p className="text-[10px] text-stone-500 mt-1">As recomendações antigas continuam aqui e agora entram de verdade na lista.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEntertainmentIndex((prev) => (prev + 2) % ENTERTAINMENT_POOL.length)}
                          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Ver outras opções
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[0, 1].map((offset) => {
                          const item = ENTERTAINMENT_POOL[(entertainmentIndex + offset) % ENTERTAINMENT_POOL.length]
                          return (
                            <div key={`${item.type}-${item.title}`} className="bg-pink-50/30 p-5 rounded-2xl border border-pink-100 space-y-2 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-extrabold text-sm text-pink-950">{item.title}</h4>
                                  <span className="text-[9px] bg-white border border-pink-100 text-pink-700 px-2 py-0.5 rounded-md font-bold">{item.type}</span>
                                </div>
                                <p className="text-xs text-stone-600 mt-2 leading-relaxed">{item.desc}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => addPersonalMediaItem(item.type as PersonalMediaType, item.title, item.desc)}
                                className="w-full mt-3 bg-white hover:bg-pink-100 text-pink-800 border border-pink-200 py-2 rounded-xl text-xs font-bold transition"
                              >
                                + Adicionar à minha lista
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {personalSubTab === 'jogos' && (
                  <div className="space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-pink-950 flex items-center gap-2">
                          <Gamepad2 className="w-4 h-4 text-pink-500" /> Jogos
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Quero jogar, Jogando e Concluído, com capa, nota, favoritos, metas e progresso do jogo.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setGameIndex((prev) => (prev + 2) % GAMES_POOL.length)}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Outras recomendações
                      </button>
                    </div>

                    {renderPersonalMediaCategory(
                      'Jogo',
                      'Minha lista de jogos',
                      'Cada jogo concluído aumenta a barra. Você pode arquivar o que terminou e manter salvo no histórico.',
                      '🎮'
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[0, 1].map((offset) => {
                        const item = GAMES_POOL[(gameIndex + offset) % GAMES_POOL.length]
                        return (
                          <div key={item.title} className="bg-white p-5 rounded-2xl border border-pink-200 shadow-2xs space-y-2 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-extrabold text-sm text-pink-950">{item.title}</h4>
                                <span className="text-[9px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md font-bold">🎮 Recomendação</span>
                              </div>
                              <p className="text-xs text-stone-600 mt-2 leading-relaxed">{item.desc}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => addPersonalMediaItem('Jogo', item.title, item.desc)}
                              className="w-full mt-3 bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 py-2 rounded-xl text-xs font-bold transition"
                            >
                              + Adicionar à minha lista
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {personalSubTab === 'locais' && (
                  <div className="space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-pink-950 flex items-center gap-2">
                          <Coffee className="w-4 h-4 text-pink-500" /> Cafés & Locais
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Quero conhecer, visita planejada e visitado — com favoritos, estrelas, resenha, metas e histórico.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCafeIndex((prev) => (prev + 2) % CAFES_POOL.length)}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Outras recomendações
                      </button>
                    </div>

                    {renderPersonalMediaCategory(
                      'Cafeteria',
                      'Minha lista de cafés & locais',
                      'Salve lugares que quer conhecer, planeje visitas e arquive os que já visitou sem perder o histórico.',
                      '☕'
                    )}

                    <div className="bg-white/95 border border-pink-100 rounded-3xl p-5 shadow-sm space-y-4">
                      <div>
                        <h4 className="text-xs font-extrabold text-pink-950">✨ Recomendações de cafés & locais</h4>
                        <p className="text-[10px] text-stone-500 mt-1">
                          As recomendações continuam aqui e agora podem entrar direto na lista pessoal.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[0, 1].map((offset) => {
                          const item = CAFES_POOL[(cafeIndex + offset) % CAFES_POOL.length]
                          return (
                            <div key={item.name} className="bg-pink-50/30 p-5 rounded-2xl border border-pink-100 space-y-2 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-extrabold text-sm text-pink-950">{item.name}</h4>
                                  <span className="text-[9px] bg-white border border-pink-100 text-pink-700 px-2 py-0.5 rounded-md font-bold">☕ Recomendação</span>
                                </div>
                                <p className="text-xs text-stone-600 mt-2 leading-relaxed">{item.desc}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => addPersonalMediaItem('Cafeteria', item.name, item.desc)}
                                className="w-full mt-3 bg-white hover:bg-pink-100 text-pink-800 border border-pink-200 py-2 rounded-xl text-xs font-bold transition"
                              >
                                + Adicionar à minha lista
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {personalSubTab === 'podcasts' && (
                  <div className="space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-pink-950 flex items-center gap-2">
                          <Headphones className="w-4 h-4 text-pink-500" /> Podcasts & True Crime
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Quero ouvir, ouvindo e ouvido — com episódio atual, favoritos, estrelas, resenha, metas e histórico.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPodcastIndex((prev) => (prev + 2) % PODCASTS_POOL.length)}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Outras recomendações
                      </button>
                    </div>

                    {renderPersonalMediaCategory(
                      'Podcast',
                      'Minha lista de podcasts & true crime',
                      'Salve o que quer ouvir, registre onde parou e mantenha o que já concluiu no histórico.',
                      '🎧'
                    )}

                    <div className="bg-white/95 border border-pink-100 rounded-3xl p-5 shadow-sm space-y-4">
                      <div>
                        <h4 className="text-xs font-extrabold text-pink-950">✨ Recomendações de podcasts & true crime</h4>
                        <p className="text-[10px] text-stone-500 mt-1">
                          Um clique adiciona a indicação à lista para acompanhar, avaliar e arquivar depois.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[0, 1].map((offset) => {
                          const item = PODCASTS_POOL[(podcastIndex + offset) % PODCASTS_POOL.length]
                          return (
                            <div key={item.title} className="bg-pink-50/30 p-5 rounded-2xl border border-pink-100 space-y-2 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-extrabold text-sm text-pink-950">{item.title}</h4>
                                  <span className="text-[9px] bg-white border border-pink-100 text-pink-700 px-2 py-0.5 rounded-md font-bold">🎧 True Crime</span>
                                </div>
                                <p className="text-xs text-stone-600 mt-2 leading-relaxed">{item.desc}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => addPersonalMediaItem('Podcast', item.title, item.desc)}
                                className="w-full mt-3 bg-white hover:bg-pink-100 text-pink-800 border border-pink-200 py-2 rounded-xl text-xs font-bold transition"
                              >
                                + Adicionar à minha lista
                              </button>
                            </div>
                          )
                        })}
                      </div>
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
                  <button
                    disabled={isStudyFileProcessing}
                    onClick={() => { setActiveTaskForAttach(null); fileInputRef.current?.click(); }}
                    className="bg-pink-100 hover:bg-pink-200 disabled:opacity-50 text-pink-800 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {isStudyFileProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                    {isStudyFileProcessing ? 'Salvando material...' : `Anexar Material (${selectedItem.attachments?.length || 0})`}
                  </button>
                </div>
              </div>

              {selectedItem.attachments && selectedItem.attachments.length > 0 && (
                <div className="bg-pink-50/70 border border-pink-200 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-extrabold text-pink-950">Materiais desta página</span>
                      <p className="text-[9px] text-stone-400 mt-0.5">Fotos e arquivos novos ficam salvos junto do workspace e aparecem nos outros dispositivos.</p>
                    </div>
                    <span className="text-[9px] font-bold text-pink-600">{selectedItem.attachments.length} arquivo(s)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                    {selectedItem.attachments.map(att => {
                      const legacyBlob = att.url?.startsWith('blob:')
                      return (
                        <div key={att.id} className="bg-white border border-pink-200 rounded-xl p-2.5 shadow-2xs min-w-0">
                          {att.type === 'image' && !legacyBlob ? (
                            <a href={att.url} target="_blank" rel="noopener noreferrer" className="block">
                              <img src={att.url} alt={att.name} className="w-full h-28 object-cover rounded-lg border border-pink-100" />
                            </a>
                          ) : (
                            <div className={`h-20 rounded-lg flex items-center justify-center text-3xl border ${
                              legacyBlob ? 'bg-amber-50 border-amber-200' : att.type === 'pdf' ? 'bg-rose-50 border-rose-100' : 'bg-stone-50 border-stone-100'
                            }`}>
                              {legacyBlob ? '⚠️' : att.type === 'pdf' ? '📄' : att.type === 'excel' ? '📊' : '📝'}
                            </div>
                          )}

                          <div className="mt-2 min-w-0">
                            <div className="text-[10px] font-extrabold text-pink-950 truncate" title={att.name}>{att.name}</div>
                            <div className="text-[9px] text-stone-400 mt-0.5">{att.size}</div>
                            {legacyBlob && (
                              <div className="text-[9px] text-amber-700 font-bold mt-1">Anexo antigo local — precisa ser reenviado.</div>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 mt-2">
                            {!legacyBlob && (
                              <a
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={att.url.startsWith('data:') ? att.name : undefined}
                                className="flex-1 text-center bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-700 px-2 py-1.5 rounded-lg text-[9px] font-bold"
                              >
                                {att.type === 'pdf' ? 'Abrir / Baixar PDF' : 'Abrir / Baixar'}
                              </a>
                            )}
                            <button
                              type="button"
                              title="Excluir anexo"
                              onClick={() => {
                                lastLocalMutationRef.current = Date.now()
                                handleRemoveAttachment(selectedItem.id, att.id)
                              }}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="bg-white border border-pink-100 rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] font-extrabold text-pink-900 uppercase tracking-wider">Editor de estudos estilo mini Word</div>
                  <div className="text-[9px] text-stone-400 mt-0.5">Formatação, listas, títulos, cores, links, imagens no texto, impressão, anexos persistentes e prints colados direto com Ctrl + V.</div>
                </div>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">Salva automaticamente</span>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-extrabold text-pink-900 uppercase tracking-wider">Abas desta página</div>
                    <div className="text-[9px] text-stone-400 mt-0.5">
                      Renomeie, crie, exclua ou reorganize as abas. Cada uma tem seu próprio editor e conteúdo.
                    </div>
                  </div>

                  {isAddingStudyTab ? (
                    <div className="flex items-center gap-2 w-full xl:w-auto">
                      <input
                        autoFocus
                        type="text"
                        maxLength={80}
                        value={newStudyTabTitle}
                        onChange={e => setNewStudyTabTitle(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddStudyTab()
                          }
                          if (e.key === 'Escape') {
                            setIsAddingStudyTab(false)
                            setNewStudyTabTitle('')
                          }
                        }}
                        placeholder="Ex.: Epidemiologia, Protocolo, Aula 2..."
                        className="w-full xl:w-72 bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none focus:border-pink-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddStudyTab}
                        disabled={!newStudyTabTitle.trim()}
                        className="bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white px-3 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap"
                      >
                        Criar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingStudyTab(false)
                          setNewStudyTabTitle('')
                        }}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-600 px-3 py-2 rounded-xl text-[10px] font-bold"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingStudyTab(true)}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-3.5 py-2 rounded-xl text-[10px] font-extrabold flex items-center gap-1.5 w-fit"
                    >
                      <Plus className="w-3.5 h-3.5" /> Nova aba
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 border-b border-pink-100 pb-3 overflow-x-auto">
                  {selectedStudySections.map((section, index) => {
                    const active = activeStudySection?.id === section.id
                    const editing = editingStudyTabId === section.id

                    return (
                      <div
                        key={section.id}
                        className={`group shrink-0 flex items-center rounded-xl border transition ${
                          active
                            ? 'bg-pink-500 border-pink-500 text-white shadow-xs'
                            : 'bg-pink-50 border-pink-100 text-pink-900 hover:bg-pink-100'
                        }`}
                      >
                        {editing ? (
                          <div className="flex items-center gap-1 p-1">
                            <input
                              autoFocus
                              type="text"
                              maxLength={80}
                              value={editingStudyTabTitle}
                              onChange={e => setEditingStudyTabTitle(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  handleRenameStudyTab(section.id)
                                }
                                if (e.key === 'Escape') {
                                  setEditingStudyTabId(null)
                                  setEditingStudyTabTitle('')
                                }
                              }}
                              className="w-44 bg-white text-pink-950 border border-pink-200 rounded-lg px-2 py-1.5 text-[10px] font-bold focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRenameStudyTab(section.id)}
                              className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center"
                              title="Salvar nome"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingStudyTabId(null)
                                setEditingStudyTabTitle('')
                              }}
                              className="w-7 h-7 rounded-lg bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center"
                              title="Cancelar"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => setStudySubTab(section.id)}
                              className="px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 max-w-[230px]"
                              title={section.title}
                            >
                              {section.id === 'diferenciais'
                                ? <Layers className="w-3.5 h-3.5 shrink-0" />
                                : section.id === 'pontos'
                                  ? <Bookmark className="w-3.5 h-3.5 shrink-0" />
                                  : <FileText className="w-3.5 h-3.5 shrink-0" />}
                              <span className="truncate">{section.title}</span>
                            </button>

                            <div className={`flex items-center pr-1 ${
                              active ? 'text-pink-100' : 'text-pink-500'
                            }`}>
                              <button
                                type="button"
                                onClick={() => moveStudyTab(section.id, -1)}
                                disabled={index === 0}
                                className="w-6 h-7 rounded-md hover:bg-white/20 disabled:opacity-20 flex items-center justify-center"
                                title="Mover aba para a esquerda"
                              >
                                ‹
                              </button>
                              <button
                                type="button"
                                onClick={() => moveStudyTab(section.id, 1)}
                                disabled={index === selectedStudySections.length - 1}
                                className="w-6 h-7 rounded-md hover:bg-white/20 disabled:opacity-20 flex items-center justify-center"
                                title="Mover aba para a direita"
                              >
                                ›
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingStudyTabId(section.id)
                                  setEditingStudyTabTitle(section.title)
                                }}
                                className="w-7 h-7 rounded-md hover:bg-white/20 flex items-center justify-center"
                                title="Renomear aba"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              {selectedStudySections.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteStudyTab(section.id)}
                                  className="w-7 h-7 rounded-md hover:bg-red-500/20 flex items-center justify-center"
                                  title="Excluir aba"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}

                  <button
                    type="button"
                    onClick={() => setIsAddingStudyTab(true)}
                    className="shrink-0 px-3 py-2 rounded-xl border border-dashed border-pink-300 text-pink-600 hover:bg-pink-50 text-[10px] font-extrabold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Aba
                  </button>
                </div>
              </div>

              {activeStudySection ? (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-bold text-pink-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-pink-500" />
                      {activeStudySection.title}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStudyTabId(activeStudySection.id)
                        setEditingStudyTabTitle(activeStudySection.title)
                      }}
                      className="text-[9px] font-bold text-pink-600 hover:bg-pink-50 border border-pink-100 px-2.5 py-1 rounded-lg w-fit flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Renomear esta aba
                    </button>
                  </div>

                  <StudyRichEditor
                    key={`${selectedItem.id}-${activeStudySection.id}`}
                    value={activeStudySection.content || ''}
                    placeholder={`Escreva em "${activeStudySection.title}". Use títulos, listas, negrito, marca-texto, links, imagens e anexos...`}
                    onAttachMaterial={() => {
                      setActiveTaskForAttach(null)
                      fileInputRef.current?.click()
                    }}
                    onChange={(html) => {
                      if (!selectedItem) return
                      updateStudySections(selectedItem.id, sections =>
                        sections.map(section =>
                          section.id === activeStudySection.id
                            ? { ...section, content: html }
                            : section
                        )
                      )
                    }}
                  />
                </div>
              ) : (
                <div className="border border-dashed border-pink-200 rounded-2xl p-8 text-center">
                  <p className="text-xs font-bold text-stone-500">Nenhuma aba disponível.</p>
                  <button
                    type="button"
                    onClick={() => setIsAddingStudyTab(true)}
                    className="mt-3 bg-pink-500 text-white px-4 py-2 rounded-xl text-[10px] font-bold"
                  >
                    + Criar primeira aba
                  </button>
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
                      <p className="text-[11px] text-pink-500 font-medium">Apoio clínico com histórico da conversa, contexto opcional do prontuário e respostas estruturadas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={handleNewChatSession} className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition">+ Novo Caso</button>
                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                      isAiLoading
                        ? 'bg-amber-100 text-amber-800'
                        : aiStatus === 'online'
                          ? 'bg-emerald-100 text-emerald-800'
                          : aiStatus === 'error'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-pink-100 text-pink-700'
                    }`}>
                      {isAiLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : aiStatus === 'error' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      {isAiLoading ? 'Analisando...' : aiStatus === 'online' ? 'IA respondeu' : aiStatus === 'error' ? 'Falha na IA' : 'Pronto'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-pink-100/60 overflow-x-auto pb-1">
                  <span className="text-[11px] font-bold text-stone-500 whitespace-nowrap">Templates Rápidos:</span>
                  <button onClick={() => applyAnamnesisTemplate('cao_ gastro')} className="bg-white hover:bg-pink-100 text-pink-800 border border-pink-200 px-3 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap shadow-2xs">🐕 Cão: Vômito/Gastro</button>
                  <button onClick={() => applyAnamnesisTemplate('gato_flutd')} className="bg-white hover:bg-pink-100 text-pink-800 border border-pink-200 px-3 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap shadow-2xs">🐈 Gato: Urinário (FLUTD)</button>
                  <button onClick={() => applyAnamnesisTemplate('dermato')} className="bg-white hover:bg-pink-100 text-pink-800 border border-pink-200 px-3 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap shadow-2xs">🩺 Dermatologia Geral</button>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] font-extrabold text-pink-800 uppercase tracking-wider block mb-1">Usar prontuário como contexto</label>
                    <select
                      value={aiPatientContextId}
                      onChange={(e) => setAiPatientContextId(e.target.value)}
                      className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-[11px] text-pink-950 font-medium focus:outline-none"
                    >
                      <option value="">Sem prontuário — conversa livre</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>🐾 {patient.petName} • {patient.species} • {patient.age || 'idade N/I'}</option>
                      ))}
                    </select>
                    <p className="text-[9px] text-stone-400 mt-1">Envia apenas contexto clínico do animal; o nome do tutor não é incluído automaticamente.</p>
                    <p className="text-[9px] text-violet-500 mt-0.5">📎 Você pode enviar até 5 fotos/PDFs juntos para comparar exames, laudos e imagens.</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-pink-800 uppercase tracking-wider block mb-1">Formato da resposta</label>
                    <select
                      value={aiResponseMode}
                      onChange={(e) => setAiResponseMode(e.target.value as 'clinical' | 'tutor' | 'record')}
                      className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-[11px] text-pink-950 font-medium focus:outline-none"
                    >
                      <option value="clinical">🩺 Análise clínica estruturada</option>
                      <option value="tutor">💬 Explicação para o tutor</option>
                      <option value="record">📋 Organizar para prontuário</option>
                    </select>
                  </div>
                </div>

                {aiErrorDetail && (
                  <div className="flex items-start justify-between gap-3 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5">
                    <div className="flex items-start gap-2 min-w-0">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-extrabold text-rose-800">O Copiloto encontrou um problema</div>
                        <div className="text-[10px] text-rose-700 mt-0.5 break-words">{aiErrorDetail}</div>
                      </div>
                    </div>
                    <button type="button" onClick={() => setAiErrorDetail('')} className="text-rose-500 hover:text-rose-800 p-1"><X className="w-3.5 h-3.5" /></button>
                  </div>
                )}
              </div>

              <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
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

                        {msg.sender === 'ai' && (
                          <button
                            type="button"
                            onClick={() => printAiResponse(msg.text, idx)}
                            className="text-[10px] font-bold text-stone-700 hover:text-pink-950 flex items-center gap-1 bg-white hover:bg-pink-50 px-2.5 py-1 rounded-lg border border-stone-200 transition cursor-pointer shadow-2xs select-none"
                            title="Imprimir ou salvar esta resposta como PDF"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Imprimir / PDF</span>
                          </button>
                        )}

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
                              📥 Anexar ao Prontuário
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
                      <Sparkles className="w-4 h-4 animate-spin" /> Analisando o caso e preparando uma resposta estruturada...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendAiMessage} className="p-4 border-t border-pink-100 bg-white flex gap-2 items-end select-none">
                <input
                  ref={aiAttachmentInputRef}
                  type="file"
                  accept="image/*,application/pdf,.pdf"
                  multiple
                  onChange={handleAiAttachmentsSelect}
                  className="hidden"
                />

                <div className="flex gap-2 mb-0.5">
                  <button
                    type="button"
                    onClick={() => aiAttachmentInputRef.current?.click()}
                    disabled={isAiLoading || isPreparingAiAttachment || aiAttachments.length >= MAX_AI_ATTACHMENTS}
                    title="Anexar fotos ou PDFs"
                    className="p-3 rounded-xl transition flex items-center justify-center bg-violet-100 hover:bg-violet-200 text-violet-700 disabled:opacity-50"
                  >
                    {isPreparingAiAttachment ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                  </button>

                  <button type="button" onClick={toggleListening} title={isListening ? "Ouvindo..." : "Falar por voz"} className={`p-3 rounded-xl transition flex items-center justify-center ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-pink-100 hover:bg-pink-200 text-pink-700'}`}>
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex-1">
                  {aiAttachments.length > 0 && (
                    <div className="mb-2 bg-violet-50 border border-violet-200 rounded-2xl p-2.5">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="text-[10px] font-extrabold text-violet-900">
                          📎 {aiAttachments.length} arquivo(s) pronto(s) para análise
                        </div>
                        <button type="button" onClick={clearAiAttachments} className="text-[9px] font-bold text-violet-600 hover:underline">
                          Remover todos
                        </button>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {aiAttachments.map(file => (
                          <div key={file.id} className="relative shrink-0 w-24 bg-white border border-violet-200 rounded-xl p-2">
                            {file.kind === 'image' && file.previewUrl ? (
                              <img src={file.previewUrl} alt={file.name} className="w-full h-14 object-cover rounded-lg mb-1.5" />
                            ) : (
                              <div className="w-full h-14 rounded-lg bg-rose-50 flex items-center justify-center text-2xl mb-1.5">📄</div>
                            )}
                            <div className="text-[8px] text-stone-600 truncate" title={file.name}>{file.name}</div>
                            <button
                              type="button"
                              onClick={() => removeAiAttachment(file.id)}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white border border-violet-200 rounded-full flex items-center justify-center text-violet-600 hover:text-rose-600 shadow-sm"
                              title="Remover arquivo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <textarea
                    rows={2}
                    placeholder={isListening ? "Ouvindo sua fala..." : aiAttachments.length ? "Pergunte algo sobre os arquivos (opcional)..." : "Digite o caso ou anexe fotos/PDFs..."}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        e.currentTarget.form?.requestSubmit()
                      }
                    }}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-4 py-3 text-xs text-pink-950 focus:outline-none font-medium resize-none select-text"
                  />
                  <div className="text-[9px] text-stone-400 mt-1 px-1">📎 Até 5 fotos/PDFs • imagens nítidas são enviadas em alta qualidade • para laudos/exames, a IA lê primeiro e interpreta depois</div>
                </div>
                <button type="submit" disabled={isAiLoading || isPreparingAiAttachment || (!chatInput.trim() && aiAttachments.length === 0)} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-0.5">
                  {isAiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isAiLoading ? 'Aguarde' : 'Perguntar'}
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
            <WishlistTab key={`wishlist-cloud-${wishlistRemoteVersion}`} />
          )}

          {activeTab === 'receitas' && (
            <PrescriptionModule
              patients={patients}
              recipes={recipes}
              setRecipes={setRecipes}
              markMutation={() => { lastLocalMutationRef.current = Date.now() }}
            />
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input type="text" placeholder="Neoplasia / Diagnóstico oncológico" value={newNeoplasia} onChange={(e) => setNewNeoplasia(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
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
                    <div id={`patient-${p.id}`} key={p.id} className={`bg-white/95 backdrop-blur-md border p-6 rounded-2xl shadow-xs space-y-4 scroll-mt-24 transition ${focusedPatientId === p.id ? 'border-pink-500 ring-2 ring-pink-100' : 'border-pink-100'}`}>
                      <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">🐾</div>
                          <div>
                            <h4 className="text-sm font-extrabold text-pink-950">{p.petName} <span className="text-xs font-normal text-stone-500">({p.species} - {p.breed})</span></h4>
                            <p className="text-[11px] text-stone-400">Tutor: {p.tutor} • Idade: {p.age}</p>
                            <div className="mt-1 flex items-center gap-1.5">
                              <span className="text-[10px] text-pink-500">🎗️</span>
                              <input
                                type="text"
                                value={p.neoplasia || ''}
                                onChange={(e) => {
                                  lastLocalMutationRef.current = Date.now()
                                  setPatients(prev => prev.map(item => item.id === p.id ? { ...item, neoplasia: e.target.value } : item))
                                }}
                                placeholder="Neoplasia / diagnóstico"
                                className="bg-transparent border-b border-pink-100 focus:border-pink-400 outline-none text-[11px] text-pink-700 font-bold w-56 max-w-full"
                              />
                            </div>
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
                        {(p.alerts || []).some(a => !a.resolved) && (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">Alertas clínicos pendentes</div>
                            {(p.alerts || []).filter(a => !a.resolved).map(a => (
                              <div key={a.id} className="bg-white border border-amber-100 rounded-lg p-2.5 flex items-start justify-between gap-3">
                                <div><div className="text-xs font-bold text-amber-950">{a.title}</div><div className="text-[10px] text-stone-600 mt-0.5">{a.message}</div></div>
                                <button type="button" onClick={() => handleResolvePatientAlert(p.id, a.id)} className="text-[10px] font-bold text-emerald-700 whitespace-nowrap hover:underline">Resolver</button>
                              </div>
                            ))}
                          </div>
                        )}
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

                        <PatientTimeline
                          events={p.timeline || []}
                          legacyEvolutions={p.evolutions}
                          onAddEvent={(event) => handleAddTimelineEvent(p.id, event)}
                        />
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
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-pink-50/40 border border-pink-100 rounded-2xl px-4 py-3">
                  <span className="text-[10px] font-extrabold text-pink-700 uppercase tracking-wider">Cores usadas neste mês:</span>
                  {Array.from(
                    new Map(
                      events
                        .filter(ev => ev.dateKey.startsWith(`${currentYear}-${padZero(currentMonth + 1)}-`))
                        .map(ev => [`${getEventClinicName(ev) || ev.title}|${getEventClinicColor(ev)}`, ev] as const)
                    ).values()
                  ).map(ev => (
                    <div key={`${getEventClinicName(ev) || ev.title}-${getEventClinicColor(ev)}`} className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-stone-200"
                        style={{ backgroundColor: getEventClinicColor(ev) }}
                      />
                      <span className="text-[10px] font-bold text-stone-600">{getEventClinicName(ev) || ev.title}</span>
                    </div>
                  ))}
                  <span className="text-[10px] text-stone-400">cada compromisso pode ter a cor que Beatriz escolher</span>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((d, i) => (
                    <span key={i} className="text-[11px] font-extrabold text-pink-500 py-1">{d}</span>
                  ))}
                  {Array.from({ length: firstWeekdayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-20 bg-pink-50/20 rounded-2xl border border-transparent"></div>
                  ))}
                  {calendarDays.map(cd => {
                    const dayEvents = sortEventsChronologically(events.filter(ev => ev.dateKey === cd.dateKey))
                    const isSelected = selectedDate === cd.dateKey
                    const isToday = cd.dateKey === todayDateKey
                    return (
                      <div 
                        key={cd.dateKey} 
                        onClick={() => setSelectedDate(cd.dateKey)}
                        className={`h-24 p-2 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer overflow-y-auto ${isSelected ? 'border-pink-500 bg-pink-50 shadow-sm' : isToday ? 'border-pink-400 bg-white ring-2 ring-pink-300' : 'border-pink-100 bg-white/70 hover:border-pink-300'}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`text-xs font-extrabold shrink-0 ${isToday ? 'bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-xs' : 'text-pink-950'}`}>
                              {cd.day}
                            </span>
                            <div className="flex items-center gap-1 flex-wrap">
                              {Array.from(
                                new Map(
                                  dayEvents
                                    .map(ev => [`${getEventClinicName(ev) || ev.title}|${getEventClinicColor(ev)}`, ev] as const)
                                ).values()
                              ).map(ev => (
                                <span
                                  key={`${getEventClinicName(ev) || ev.title}-${getEventClinicColor(ev)}`}
                                  title={getEventClinicName(ev) || ev.title}
                                  className="w-3 h-3 rounded-full shrink-0 ring-2 ring-white shadow-sm"
                                  style={{ backgroundColor: getEventClinicColor(ev) }}
                                />
                              ))}
                            </div>
                          </div>
                          {dayEvents.length > 0 && <span className="text-[9px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-full font-bold shrink-0">{dayEvents.length}</span>}
                        </div>
                        <div className="space-y-0.5 mt-1">
                          {dayEvents.slice(0, 2).map((ev, idx) => (
                            <div
                              key={idx}
                              className="text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1 min-w-0"
                              style={{
                                backgroundColor: getEventClinicColor(ev),
                                color: getContrastTextColor(getEventClinicColor(ev))
                              }}
                            >
                              <span
                                title={getEventClinicName(ev) || ev.title}
                                className="w-2 h-2 rounded-full shrink-0 ring-1 ring-white"
                                style={{ backgroundColor: getEventClinicColor(ev) }}
                              />
                              <span className="truncate">{ev.time ? `${ev.time} - ` : ''}{ev.title}</span>
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
                    const cleanTitle = eventTitle.trim()
                    const cleanClinic = eventClinicName.trim()

                    if (eventCategory === 'work' && !cleanClinic && !cleanTitle) {
                      alert('Selecione ou informe a clínica para salvar o trabalho/plantão.')
                      return
                    }

                    if (eventCategory !== 'work' && !cleanTitle) {
                      alert('Informe um título para este compromisso.')
                      return
                    }

                    const resolvedTitle = cleanTitle || cleanClinic || 'Trabalho / Plantão'

                    const buildEvent = (dateKey: string): CalendarEvent => ({
                      dateKey,
                      title: resolvedTitle,
                      description: eventDesc,
                      time: eventTime,
                      clinicName: cleanClinic || undefined,
                      clinicColor: eventClinicColor,
                      category: eventCategory
                    })

                    const newEvents: CalendarEvent[] = [buildEvent(selectedDate)]

                    if (repeatWeeklyUntilMonthEnd) {
                      const [y, m, d] = selectedDate.split('-').map(Number)
                      const baseDate = new Date(y, m - 1, d)
                      const monthIndex = baseDate.getMonth()

                      const nextDate = new Date(baseDate)
                      nextDate.setDate(nextDate.getDate() + 7)

                      while (nextDate.getMonth() === monthIndex) {
                        const yy = nextDate.getFullYear()
                        const mm = padZero(nextDate.getMonth() + 1)
                        const dd = padZero(nextDate.getDate())
                        newEvents.push(buildEvent(`${yy}-${mm}-${dd}`))
                        nextDate.setDate(nextDate.getDate() + 7)
                      }
                    }

                    const existingKeys = new Set(
                      events.map(ev => `${ev.dateKey}|${ev.time || ''}|${ev.title}|${ev.clinicName || ''}|${ev.category || ''}`)
                    )

                    const nonDuplicateEvents = newEvents.filter(ev => {
                      const key = `${ev.dateKey}|${ev.time || ''}|${ev.title}|${ev.clinicName || ''}|${ev.category || ''}`
                      return !existingKeys.has(key)
                    })

                    lastLocalMutationRef.current = Date.now()
                    setEvents(
                      sortAllCalendarEvents([
                        ...events,
                        ...nonDuplicateEvents.map(ev => ({ ...ev, time: normalizeCalendarTime(ev.time) }))
                      ])
                    )
                    setEventTitle('')
                    setEventDesc('')
                    setEventClinicName('')
                    setEventClinicColor('#111827')
                    setEventCategory('work')
                    setRepeatWeeklyUntilMonthEnd(false)
                  }} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-2">
                      <input
                        type="text"
                        placeholder={eventCategory === 'work' ? 'Título extra (opcional)' : 'Título do compromisso'}
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium"
                      />
                      <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                    </div>
                    {eventCategory === 'work' && (
                      <p className="text-[10px] text-stone-400 -mt-1">
                        Para trabalho/plantão, o título é opcional. Se deixar vazio, o nome da clínica será usado automaticamente.
                      </p>
                    )}

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-extrabold text-pink-800 uppercase tracking-wider block mb-2">Tipo de compromisso</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setEventCategory('work')}
                            className={`px-3 py-2.5 rounded-xl border text-[11px] font-bold transition ${
                              eventCategory === 'work'
                                ? 'bg-stone-800 border-stone-800 text-white'
                                : 'bg-white border-pink-200 text-stone-700 hover:bg-pink-50'
                            }`}
                          >
                            🏥 Trabalho / Plantão
                          </button>
                          <button
                            type="button"
                            onClick={() => setEventCategory('return')}
                            className={`px-3 py-2.5 rounded-xl border text-[11px] font-bold transition ${
                              eventCategory === 'return'
                                ? 'bg-sky-500 border-sky-500 text-white'
                                : 'bg-white border-pink-200 text-stone-700 hover:bg-pink-50'
                            }`}
                          >
                            🩺 Retorno de paciente
                          </button>
                          <button
                            type="button"
                            onClick={() => setEventCategory('other')}
                            className={`px-3 py-2.5 rounded-xl border text-[11px] font-bold transition ${
                              eventCategory === 'other'
                                ? 'bg-pink-500 border-pink-500 text-white'
                                : 'bg-white border-pink-200 text-stone-700 hover:bg-pink-50'
                            }`}
                          >
                            📌 Outro compromisso
                          </button>
                        </div>
                      </div>

                      {eventCategory === 'work' && (
                        <div>
                        <label className="text-[10px] font-extrabold text-pink-800 uppercase tracking-wider block mb-1">Clínica / Local</label>
                        <input
                          type="text"
                          list="calendar-clinic-options"
                          value={eventClinicName}
                          onChange={(e) => setEventClinicName(e.target.value)}
                          placeholder="Ex.: Popular Sete Portas"
                          className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium"
                        />
                        <datalist id="calendar-clinic-options">
                          {clinics.map(clinic => <option key={clinic.id} value={clinic.name} />)}
                        </datalist>

                        {clinics.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {clinics.map(clinic => (
                              <button
                                key={clinic.id}
                                type="button"
                                onClick={() => setEventClinicName(clinic.name)}
                                className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition ${
                                  eventClinicName === clinic.name
                                    ? 'bg-pink-500 border-pink-500 text-white'
                                    : 'bg-white border-pink-200 text-pink-700 hover:bg-pink-50'
                                }`}
                              >
                                {clinic.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      )}

                      <div>
                        <label className="text-[10px] font-extrabold text-pink-800 uppercase tracking-wider block mb-2">
                          {eventCategory === 'work' ? 'Cor da clínica' : 'Cor do compromisso'}
                        </label>

                        <div className="flex flex-wrap items-center gap-2">
                          {calendarColorPresets.map(color => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setEventClinicColor(color)}
                              title={`Usar cor ${color}`}
                              className={`w-8 h-8 rounded-full transition ring-offset-2 ${
                                eventClinicColor.toLowerCase() === color.toLowerCase()
                                  ? 'ring-2 ring-pink-500 scale-110'
                                  : 'ring-1 ring-stone-200 hover:scale-105'
                              }`}
                              style={{ backgroundColor: color }}
                              aria-label={`Selecionar cor ${color}`}
                            />
                          ))}

                          <label className="ml-1 inline-flex items-center gap-2 bg-white border border-pink-200 rounded-xl px-3 py-2 cursor-pointer">
                            <span
                              className="w-4 h-4 rounded-full ring-1 ring-stone-200"
                              style={{ backgroundColor: eventClinicColor }}
                            />
                            <span className="text-[10px] font-bold text-stone-600">Outra cor</span>
                            <input
                              type="color"
                              value={eventClinicColor}
                              onInput={(e) => setEventClinicColor((e.target as HTMLInputElement).value)}
                              onChange={(e) => setEventClinicColor(e.target.value)}
                              className="w-8 h-8 cursor-pointer"
                              aria-label="Escolher outra cor"
                            />
                          </label>
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-[10px] text-stone-500">
                          <span>Selecionada:</span>
                          <span
                            className="w-3 h-3 rounded-full ring-1 ring-stone-200"
                            style={{ backgroundColor: eventClinicColor }}
                          />
                          <strong className="text-stone-700">{eventClinicColor.toUpperCase()}</strong>
                        </div>
                      </div>
                    </div>

                    <label className="flex items-start gap-3 bg-violet-50/60 border border-violet-200 rounded-xl p-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={repeatWeeklyUntilMonthEnd}
                        onChange={(e) => setRepeatWeeklyUntilMonthEnd(e.target.checked)}
                        className="mt-0.5 accent-violet-600"
                      />
                      <div>
                        <div className="text-[11px] font-extrabold text-violet-900">Esse compromisso se repete semanalmente até o fim do mês?</div>
                        <div className="text-[10px] text-violet-700 mt-0.5">
                          Funciona para qualquer tipo de compromisso: plantão, retorno, terapia, academia, curso ou compromisso pessoal. O sistema repete no mesmo dia da semana até terminar o mês.
                        </div>
                      </div>
                    </label>

                    <textarea placeholder="Detalhes ou notas do compromisso..." value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} rows={2} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium resize-none select-text" />
                    <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-xs font-bold transition shadow-md cursor-pointer">
                      {eventCategory === 'work' ? 'Salvar Trabalho / Plantão' : 'Salvar na Agenda'}
                    </button>
                  </form>
                </div>

                <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Compromissos do Dia {selectedDate}</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {events.filter(ev => ev.dateKey === selectedDate).length === 0 ? (
                      <p className="text-xs text-stone-400 py-6 text-center">Nenhum evento registrado para este dia.</p>
                    ) : (
                      sortEventsChronologically(events.filter(ev => ev.dateKey === selectedDate)).map((ev, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-pink-50/40 border border-pink-100 p-3.5 rounded-2xl border-l-4"
                          style={{ borderLeftColor: getEventClinicColor(ev) }}
                        >
                          <div>
                            <div className="text-xs font-bold text-pink-950 flex items-center gap-2 select-text">
                              {ev.time && <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded-lg text-[10px] font-extrabold">{ev.time}</span>}
                              <span className="text-[9px] font-extrabold uppercase tracking-wide text-stone-400">
                                {(ev.category || (getEventClinicName(ev) ? 'work' : 'other')) === 'work' ? '🏥 Trabalho' : ev.category === 'return' ? '🩺 Retorno' : '📌 Outro'}
                              </span>
                              {getEventClinicName(ev) && (
                                <span className="inline-flex items-center gap-1 bg-white border border-pink-100 px-2 py-0.5 rounded-lg text-[10px] font-bold text-stone-600">
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: getEventClinicColor(ev) }}
                                  />
                                  {getEventClinicName(ev)}
                                </span>
                              )}
                              {ev.title}
                            </div>
                            {ev.description && <div className="text-[11px] text-stone-600 mt-0.5 select-text">{ev.description}</div>}
                          </div>
                          <div className="flex items-center gap-2">
                            <details className="relative">
                              <summary className="list-none cursor-pointer w-8 h-8 rounded-lg border border-pink-100 bg-white flex items-center justify-center" title="Alterar cor">
                                <span
                                  className="w-4 h-4 rounded-full ring-1 ring-stone-200"
                                  style={{ backgroundColor: getEventClinicColor(ev) }}
                                />
                              </summary>
                              <div className="absolute right-0 z-30 mt-2 bg-white border border-pink-200 rounded-xl p-3 shadow-lg w-44">
                                <div className="text-[9px] font-extrabold text-pink-700 uppercase mb-2">Alterar cor</div>
                                <div className="flex flex-wrap gap-2">
                                  {calendarColorPresets.map(color => (
                                    <button
                                      key={color}
                                      type="button"
                                      onClick={() => {
                                        lastLocalMutationRef.current = Date.now()
                                        setEvents(sortAllCalendarEvents(events.map(item =>
                                          item === ev ? {
                                            ...item,
                                            clinicName: getEventClinicName(ev) || ev.title,
                                            clinicColor: color
                                          } : item
                                        )))
                                      }}
                                      className={`w-6 h-6 rounded-full ${
                                        getEventClinicColor(ev).toLowerCase() === color.toLowerCase()
                                          ? 'ring-2 ring-pink-500 ring-offset-1'
                                          : 'ring-1 ring-stone-200'
                                      }`}
                                      style={{ backgroundColor: color }}
                                      aria-label={`Trocar para ${color}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </details>
                            <button onClick={() => { lastLocalMutationRef.current = Date.now(); setEvents(events.filter(item => !(item.title === ev.title && item.dateKey === ev.dateKey))); }} className="text-stone-400 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                          </div>
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
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-pink-950">Controle Financeiro & Gráficos</h2>
                  <p className="text-xs text-stone-400 mt-1">Visão mensal de caixa • {financeMonthLabel}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center bg-white border border-pink-200 rounded-xl p-1 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => changeFinanceMonth(-1)}
                      className="w-8 h-8 rounded-lg hover:bg-pink-50 text-pink-700 font-extrabold text-lg"
                      title="Mês anterior"
                    >
                      ‹
                    </button>
                    <input
                      type="month"
                      value={financeSelectedMonth}
                      onChange={(e) => setFinanceMonth(e.target.value)}
                      className="bg-transparent px-2 py-1 text-xs font-extrabold text-pink-950 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => changeFinanceMonth(1)}
                      className="w-8 h-8 rounded-lg hover:bg-pink-50 text-pink-700 font-extrabold text-lg"
                      title="Próximo mês"
                    >
                      ›
                    </button>
                  </div>

                  {financeSelectedMonth !== currentFinanceMonthKey && (
                    <button
                      type="button"
                      onClick={() => setFinanceMonth(currentFinanceMonthKey)}
                      className="bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 px-3 py-2 rounded-xl text-[10px] font-bold"
                    >
                      Voltar ao mês atual
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowValues(!showValues)}
                    className="flex items-center gap-2 bg-white hover:bg-pink-100 text-pink-800 px-4 py-2 rounded-xl text-xs font-bold transition border border-pink-200 cursor-pointer shadow-2xs w-fit"
                    title={showValues ? "Ocultar valores financeiros" : "Mostrar valores financeiros"}
                  >
                    {showValues ? <EyeOff className="w-4 h-4 text-pink-600" /> : <Eye className="w-4 h-4 text-pink-600" />}
                    <span>{showValues ? 'Ocultar Valores' : 'Mostrar Valores'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-5 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Renda base do mês</h3>
                      <p className="text-[10px] text-stone-400 mt-1">Salário/fixo. Não inclua plantões, comissões ou especialistas aqui.</p>
                    </div>
                    {!isEditingIncome && (
                      <button
                        type="button"
                        onClick={() => { setIsEditingIncome(true); setTempIncomeInput(selectedBaseIncome.toString()) }}
                        className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-lg border border-pink-200"
                      >
                        ✏️ Editar
                      </button>
                    )}
                  </div>

                  {isEditingIncome ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={tempIncomeInput}
                        onChange={(e) => setTempIncomeInput(e.target.value)}
                        className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium"
                        placeholder="Ex.: 3.500,00"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const val = parseCurrencyInput(tempIncomeInput)
                            if (Number.isFinite(val) && val >= 0) {
                              lastLocalMutationRef.current = Date.now()
                              setMonthlyIncomeByMonth(prev => ({ ...prev, [financeSelectedMonth]: val }))
                              if (financeSelectedMonth === currentFinanceMonthKey) setMonthlyIncome(val)
                              setIsEditingIncome(false)
                            }
                          }}
                          className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-xl text-xs font-bold"
                        >
                          Salvar
                        </button>
                        <button type="button" onClick={() => setIsEditingIncome(false)} className="px-3 py-2 rounded-xl text-xs font-bold bg-stone-100 text-stone-600">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-2xl font-extrabold text-emerald-600">{maskValue(selectedBaseIncome)}</div>

                      <div className="pt-3 border-t border-pink-100">
                        <div className="text-[10px] font-extrabold text-stone-600 mb-1.5">Somar um novo valor à renda base</div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={baseIncomeAddInput}
                            onChange={(e) => setBaseIncomeAddInput(e.target.value)}
                            placeholder="Ex.: 1.500,00"
                            className="min-w-0 flex-1 bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none focus:border-emerald-400"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const addValue = parseCurrencyInput(baseIncomeAddInput)
                              if (!Number.isFinite(addValue) || addValue <= 0) {
                                alert('Digite um valor válido para somar.')
                                return
                              }
                              const nextValue = selectedBaseIncome + addValue
                              lastLocalMutationRef.current = Date.now()
                              setMonthlyIncomeByMonth(prev => ({ ...prev, [financeSelectedMonth]: nextValue }))
                              if (financeSelectedMonth === currentFinanceMonthKey) setMonthlyIncome(nextValue)
                              setBaseIncomeAddInput('')
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-[10px] font-extrabold whitespace-nowrap"
                          >
                            + Somar
                          </button>
                        </div>
                        <p className="text-[9px] text-stone-400 mt-1.5">
                          Ex.: se já tem {maskValue(selectedBaseIncome)}, digite 1.500,00 e o sistema soma automaticamente.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white/95 backdrop-blur-md border border-violet-100 p-5 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-violet-900 uppercase tracking-wider">Outras rendas recebidas</h3>
                      <p className="text-[10px] text-stone-400 mt-1">Somente valores que não estejam em plantões/comissões ou especialistas.</p>
                    </div>
                    {!isEditingOtherIncome && (
                      <button
                        type="button"
                        onClick={() => { setIsEditingOtherIncome(true); setTempOtherIncomeInput(selectedOtherIncome.toString()) }}
                        className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-200"
                      >
                        ✏️ Editar
                      </button>
                    )}
                  </div>

                  {isEditingOtherIncome ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={tempOtherIncomeInput}
                        onChange={(e) => setTempOtherIncomeInput(e.target.value)}
                        className="w-full bg-violet-50/50 border border-violet-200 rounded-xl px-3.5 py-2.5 text-xs text-violet-950 focus:outline-none font-medium"
                        placeholder="Ex.: 400,00"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const val = parseCurrencyInput(tempOtherIncomeInput)
                            if (Number.isFinite(val) && val >= 0) {
                              lastLocalMutationRef.current = Date.now()
                              setOtherIncomeByMonth(prev => ({ ...prev, [financeSelectedMonth]: val }))
                              if (financeSelectedMonth === currentFinanceMonthKey) setOtherIncome(val)
                              setIsEditingOtherIncome(false)
                            }
                          }}
                          className="flex-1 bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-xl text-xs font-bold"
                        >
                          Salvar
                        </button>
                        <button type="button" onClick={() => setIsEditingOtherIncome(false)} className="px-3 py-2 rounded-xl text-xs font-bold bg-stone-100 text-stone-600">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-2xl font-extrabold text-violet-700">{maskValue(selectedOtherIncome)}</div>

                      <div className="pt-3 border-t border-violet-100">
                        <div className="text-[10px] font-extrabold text-stone-600 mb-1.5">Somar outra entrada recebida</div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={otherIncomeAddInput}
                            onChange={(e) => setOtherIncomeAddInput(e.target.value)}
                            placeholder="Ex.: 500,00"
                            className="min-w-0 flex-1 bg-violet-50/40 border border-violet-200 rounded-xl px-3 py-2 text-xs text-violet-950 focus:outline-none focus:border-violet-400"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const addValue = parseCurrencyInput(otherIncomeAddInput)
                              if (!Number.isFinite(addValue) || addValue <= 0) {
                                alert('Digite um valor válido para somar.')
                                return
                              }
                              const nextValue = selectedOtherIncome + addValue
                              lastLocalMutationRef.current = Date.now()
                              setOtherIncomeByMonth(prev => ({ ...prev, [financeSelectedMonth]: nextValue }))
                              if (financeSelectedMonth === currentFinanceMonthKey) setOtherIncome(nextValue)
                              setOtherIncomeAddInput('')
                            }}
                            className="bg-violet-600 hover:bg-violet-700 text-white px-3.5 py-2 rounded-xl text-[10px] font-extrabold whitespace-nowrap"
                          >
                            + Somar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
                  <div className="w-full sm:flex-1">
                    <input 
                      type="text"
                      inputMode="decimal"
                      placeholder="Ex.: 55.853,43" 
                      value={cofrinhoInput} 
                      onChange={(e) => setCofrinhoInput(e.target.value)} 
                      className="w-full bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none focus:border-pink-400 font-medium"
                    />
                    <p className="text-[9px] text-pink-600/70 mt-1">
                      Aceita 55.853,43, 55853,43 ou 55853.43.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button 
                      type="button" 
                      onClick={() => {
                        const val = parseCurrencyInput(cofrinhoInput)
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
                        const val = parseCurrencyInput(cofrinhoInput)
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
                    <button
                      type="button"
                      onClick={() => {
                        const val = parseCurrencyInput(cofrinhoInput)
                        if (!Number.isFinite(val) || val < 0) {
                          alert('Digite um saldo válido. Ex.: 55.853,43')
                          return
                        }
                        lastLocalMutationRef.current = Date.now()
                        setCofrinhoAmount(val)
                        setCofrinhoInput('')
                      }}
                      className="flex-1 sm:flex-none bg-white hover:bg-pink-50 text-pink-700 border border-pink-300 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-2xs flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                      title="Use para cadastrar o saldo total que já existe hoje"
                    >
                      🎯 Definir saldo
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
                <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Total recebido no mês</span>
                  <div className="text-xl font-extrabold text-emerald-800 mt-1">{maskValue(totalRendaGeral)}</div>
                  <div className="text-[9px] text-emerald-600 mt-1">Somente dinheiro recebido</div>
                </div>

                <div className="bg-white border border-pink-100 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-stone-500 uppercase">Plantões/comissões pagos</span>
                  <div className="text-xl font-extrabold text-pink-950 mt-1">{maskValue(totalPaidShiftsThisMonth)}</div>
                  <div className="text-[9px] text-stone-400 mt-1">Diárias {maskValue(totalPaidDailyThisMonth)} • Comissões {maskValue(totalPaidCommissionThisMonth)}</div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-amber-700 uppercase">A receber</span>
                  <div className="text-xl font-extrabold text-amber-800 mt-1">{maskValue(totalPendingShiftsForFinance)}</div>
                  <div className="text-[9px] text-amber-600 mt-1">Total pendente • não entra no saldo</div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-amber-700 uppercase">Despesas a pagar</span>
                  <div className="text-xl font-extrabold text-amber-800 mt-1">{maskValue(totalPendingExpensesForFinance)}</div>
                  <div className="text-[9px] text-amber-600 mt-1">Pendências em aberto • não saíram do caixa</div>
                </div>

                <div className="bg-white border border-rose-100 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-stone-500 uppercase">Despesas pagas no mês</span>
                  <div className="text-xl font-extrabold text-rose-600 mt-1">{maskValue(totalPaidExpensesThisMonth)}</div>
                  <div className="text-[9px] text-stone-400 mt-1">Valor que realmente saiu do caixa</div>
                </div>

                <div className={`border p-4 rounded-2xl ${saldoRestante >= 0 ? 'bg-sky-50/70 border-sky-200' : 'bg-rose-50 border-rose-200'}`}>
                  <span className={`text-[10px] font-bold uppercase ${saldoRestante >= 0 ? 'text-sky-700' : 'text-rose-700'}`}>Saldo disponível</span>
                  <div className={`text-xl font-extrabold mt-1 ${saldoRestante >= 0 ? 'text-sky-800' : 'text-rose-700'}`}>{maskValue(saldoRestante)}</div>
                  <div className="text-[9px] text-stone-400 mt-1">Recebido − despesas já pagas</div>
                </div>
              </div>

              <div className="bg-white/95 border border-pink-100 p-5 rounded-2xl shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-extrabold text-pink-950 uppercase tracking-wider">Comprometimento da renda</h3>
                    <p className="text-[10px] text-stone-400 mt-1">
                      {maskValue(totalPaidExpensesThisMonth)} já pagos de {maskValue(totalRendaGeral)} recebidos em {financeMonthLabel}.
                    </p>
                  </div>
                  <div className={`text-sm font-extrabold ${
                    totalIncomeCommittedPct <= 70
                      ? 'text-emerald-700'
                      : totalIncomeCommittedPct <= 100
                        ? 'text-amber-700'
                        : 'text-rose-700'
                  }`}>
                    {totalRendaGeral > 0 ? `${totalIncomeCommittedPct.toFixed(1)}%` : '—'}
                  </div>
                </div>

                <div className="h-4 bg-stone-100 rounded-full overflow-hidden mt-4 border border-stone-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      totalIncomeCommittedPct <= 70
                        ? 'bg-emerald-500'
                        : totalIncomeCommittedPct <= 100
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                    }`}
                    style={{ width: `${incomeCommitmentBarPct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[9px] text-stone-400 mt-1.5">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>

                {totalRendaGeral > 0 && (
                  <div className={`mt-3 text-[10px] font-bold ${
                    saldoRestante >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {saldoRestante >= 0
                      ? `${maskValue(saldoRestante)} da renda ainda está disponível.`
                      : `Os gastos ultrapassaram a renda recebida em ${maskValue(Math.abs(saldoRestante))}.`}
                  </div>
                )}
              </div>

              <div className="bg-white/95 border border-pink-100 p-5 rounded-2xl shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-extrabold text-pink-950 uppercase tracking-wider">Composição da renda recebida</h3>
                    <p className="text-[10px] text-stone-400 mt-1">Cada valor entra uma vez, sem duplicar plantões ou especialistas.</p>
                  </div>
                  <span className="text-[10px] font-bold text-stone-500">{financeMonthLabel}</span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
                  <div className="bg-pink-50 rounded-xl p-3"><div className="text-[9px] text-stone-400 uppercase font-bold">Renda base</div><div className="text-sm font-extrabold text-pink-950 mt-1">{maskValue(selectedBaseIncome)}</div></div>
                  <div className="bg-pink-50 rounded-xl p-3"><div className="text-[9px] text-stone-400 uppercase font-bold">Plantões + comissões pagos</div><div className="text-sm font-extrabold text-pink-950 mt-1">{maskValue(totalPaidShiftsThisMonth)}</div></div>
                  <div className="bg-pink-50 rounded-xl p-3"><div className="text-[9px] text-stone-400 uppercase font-bold">Especialistas</div><div className="text-sm font-extrabold text-pink-950 mt-1">{maskValue(specialistIncomeThisMonth)}</div></div>
                  <div className="bg-pink-50 rounded-xl p-3"><div className="text-[9px] text-stone-400 uppercase font-bold">Outras rendas</div><div className="text-sm font-extrabold text-pink-950 mt-1">{maskValue(selectedOtherIncome)}</div></div>
                </div>
              </div>

              <div className="bg-amber-50/50 border border-amber-200 p-5 rounded-3xl shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">Dinheiro que ainda vão me pagar</h3>
                    <p className="text-[10px] text-amber-700/70 mt-1">Pendências de clínicas e comissões. Confirmar aqui atualiza a renda automaticamente.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-bold uppercase text-amber-600">Total a receber</div>
                    <div className="text-xl font-extrabold text-amber-900">{maskValue(totalPendingShiftsForFinance)}</div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {pendingShiftsForFinance.length === 0 ? (
                    <div className="bg-white/70 border border-dashed border-amber-200 rounded-2xl p-6 text-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                      <p className="text-xs font-bold text-stone-600">Nenhum valor pendente.</p>
                    </div>
                  ) : (
                    [...pendingShiftsForFinance]
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map(shift => {
                        const clinic = clinics.find(item => item.id === shift.clinicId)
                        const days = pendingDays(shift.date)
                        return (
                          <div key={`finance-pending-${shift.id}`} className="bg-white border border-amber-200 rounded-xl p-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-xs font-extrabold text-pink-950">{clinic?.name || 'Clínica'}</div>
                                <div className="text-[10px] text-stone-500 mt-1">
                                  {formatLocalDate(shift.date)}
                                  {days > 0 ? ` • pendente há ${days} dia${days === 1 ? '' : 's'}` : ' • lançado hoje'}
                                </div>
                                <div className="text-[10px] text-stone-600 mt-1 flex flex-wrap gap-x-2">
                                  {(Number(shift.baseRate) || 0) > 0 && <span>Diária: <strong>{maskValue(Number(shift.baseRate) || 0)}</strong></span>}
                                  {(Number(shift.commission) || 0) > 0 && <span>Comissão: <strong>{maskValue(Number(shift.commission) || 0)}</strong></span>}
                                </div>
                                {shift.details && <div className="text-[9px] text-stone-400 mt-1">{shift.details}</div>}
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <div className="text-sm font-extrabold text-amber-900">{maskValue(getShiftValue(shift))}</div>
                                <button
                                  type="button"
                                  onClick={() => handleToggleShiftStatus(shift.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-[10px] font-extrabold transition"
                                >
                                  ✓ Marcar como recebido
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })
                  )}
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-3xl shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-extrabold text-pink-950 uppercase tracking-wider">Gastos x renda recebida</h3>
                    <p className="text-[10px] text-stone-400 mt-1">Atualiza automaticamente conforme a renda recebida e os gastos lançados no mês.</p>
                  </div>
                  <div className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full ${
                    totalIncomeCommittedPct <= 70
                      ? 'bg-emerald-50 text-emerald-700'
                      : totalIncomeCommittedPct <= 100
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                  }`}>
                    {totalRendaGeral > 0 ? `${totalIncomeCommittedPct.toFixed(1)}% da renda comprometida` : 'Informe a renda para calcular %'}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-center mt-5">
                  <div className="flex justify-center">
                    <div
                      className="w-56 h-56 rounded-full p-6 shadow-inner"
                      style={{ background: expenseDonutGradient }}
                      aria-label={`Gráfico circular: ${totalIncomeCommittedPct.toFixed(1)}% da renda comprometida com gastos`}
                    >
                      <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-center px-4 shadow-sm">
                        <div className="text-[10px] font-bold text-stone-400 uppercase">Gasto no mês</div>
                        <div className="text-xl font-extrabold text-rose-600 mt-1">{maskValue(totalGastos)}</div>
                        <div className="text-[11px] font-bold text-stone-600 mt-1">
                          {totalRendaGeral > 0 ? `${totalIncomeCommittedPct.toFixed(1)}% da renda` : 'Renda não informada'}
                        </div>
                        <div className="text-[9px] text-stone-400 mt-1">Renda: {maskValue(totalRendaGeral)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {expenseChartSegments.length === 0 ? (
                      <div className="border border-dashed border-pink-200 bg-pink-50/30 rounded-2xl p-8 text-center">
                        <p className="text-xs font-bold text-stone-600">Nenhum gasto neste mês.</p>
                        <p className="text-[10px] text-stone-400 mt-1">Quando uma despesa for lançada, ela aparecerá aqui com a porcentagem que representa da renda recebida.</p>
                      </div>
                    ) : (
                      <>
                        {expenseChartSegments.map((segment, index) => (
                          <div key={`${segment.label}-${segment.category}`} className="flex items-center justify-between gap-3 bg-stone-50/70 border border-stone-100 rounded-xl p-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-[10px] font-extrabold text-stone-500 shrink-0">
                                {index + 1}º
                              </div>
                              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: segment.color }} />
                              <div className="min-w-0">
                                <div className="text-xs font-extrabold text-pink-950 truncate">{segment.label}</div>
                                <div className="text-[9px] text-stone-400 truncate">{segment.category}</div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-xs font-extrabold text-stone-700">{maskValue(segment.amount)}</div>
                              <div className={`text-[10px] font-bold ${
                                segment.incomePercent >= 70 ? 'text-rose-600' : segment.incomePercent >= 40 ? 'text-amber-600' : 'text-emerald-600'
                              }`}>
                                {totalRendaGeral > 0 ? `${segment.incomePercent.toFixed(1)}% da renda` : '—'}
                              </div>
                            </div>
                          </div>
                        ))}

                        {chartUsesIncomeScale && availableChartPct > 0 && (
                          <div className="flex items-center justify-between gap-3 bg-emerald-50/50 border border-emerald-100 rounded-xl p-3">
                            <div className="flex items-center gap-3">
                              <span className="w-3 h-3 rounded-full bg-stone-200 shrink-0" />
                              <div>
                                <div className="text-xs font-extrabold text-emerald-800">Renda ainda disponível</div>
                                <div className="text-[9px] text-emerald-600">Parte não consumida pelos gastos lançados</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-extrabold text-emerald-800">{maskValue(Math.max(0, saldoRestante))}</div>
                              <div className="text-[10px] font-bold text-emerald-600">{availableChartPct.toFixed(1)}%</div>
                            </div>
                          </div>
                        )}

                        {totalRendaGeral > 0 && totalGastos > totalRendaGeral && (
                          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-[10px] text-rose-800">
                            <strong>Atenção:</strong> os gastos ultrapassam a renda recebida em {maskValue(totalGastos - totalRendaGeral)}. As porcentagens ao lado continuam calculadas sobre a renda recebida.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/50 border border-amber-200 p-5 rounded-3xl shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">Despesas que ainda preciso pagar</h3>
                    <p className="text-[10px] text-amber-700/70 mt-1">
                      Enquanto estiverem aqui, são pendências e não reduzem o saldo disponível. Ao pagar, confirme abaixo.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-bold uppercase text-amber-600">Total a pagar</div>
                    <div className="text-xl font-extrabold text-amber-900">{maskValue(totalPendingExpensesForFinance)}</div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {pendingExpensesForFinance.length === 0 ? (
                    <div className="bg-white/70 border border-dashed border-amber-200 rounded-2xl p-6 text-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                      <p className="text-xs font-bold text-stone-600">Nenhuma despesa pendente.</p>
                      <p className="text-[10px] text-stone-400 mt-1">Tudo que foi confirmado como pago já saiu desta lista.</p>
                    </div>
                  ) : (
                    [...pendingExpensesForFinance]
                      .sort((a, b) => financeDateTimestamp(a.date) - financeDateTimestamp(b.date))
                      .map(expense => (
                        <div key={`pending-expense-${expense.id}`} className="bg-white border border-amber-200 rounded-xl p-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-xs font-extrabold text-pink-950">{expense.description}</div>
                              <div className="text-[10px] text-stone-500 mt-1">{expense.date} • {expense.category}</div>
                              <div className="text-sm font-extrabold text-amber-800 mt-1">{maskValue(Number(expense.amount) || 0)}</div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                lastLocalMutationRef.current = Date.now()
                                setFinances(prev => prev.map(item =>
                                  item.id === expense.id
                                    ? { ...item, status: 'Pago' as const, paidDate: todayDateKey }
                                    : item
                                ))
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1.5 whitespace-nowrap"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Marcar como pago
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Adicionar despesa do mês</h3>
                <form onSubmit={handleAddFinancial} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    <input type="text" placeholder="Descrição do Gasto" value={finDesc} onChange={(e) => setFinDesc(e.target.value)} className="md:col-span-2 bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                    <select
                      value={finCategory}
                      onChange={(e) => {
                        const nextCategory = e.target.value
                        setFinCategory(nextCategory)
                        setFinStatus(nextCategory === 'Cartão de Crédito' ? 'Pendente' : 'Pago')
                      }}
                      className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium"
                    >
                      <option value="Cartão de Crédito">Cartão de Crédito</option>
                      <option value="Insumos / Clínica">Insumos / Clínica</option>
                      <option value="Alimentação">Alimentação</option>
                      <option value="Transporte">Transporte</option>
                      <option value="Outro">Outro (Personalizado)</option>
                    </select>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Valor (Ex.: 10.000,00)"
                      value={finAmount}
                      onChange={(e) => setFinAmount(e.target.value)}
                      className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium"
                      required
                    />
                    <input type="date" value={finDate} onChange={(e) => setFinDate(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                    <select
                      value={finStatus}
                      onChange={(e) => setFinStatus(e.target.value as 'Pago' | 'Pendente')}
                      className={`border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none font-bold ${
                        finStatus === 'Pago'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-amber-50 border-amber-200 text-amber-800'
                      }`}
                      title="Situação do pagamento"
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Pago">Pago</option>
                    </select>
                  </div>
                  <p className="text-[9px] text-stone-400">
                    Deixe como <strong>Pendente</strong> enquanto ainda não saiu dinheiro da conta. Quando pagar a fatura ou despesa, use <strong>Marcar como pago</strong> em “Despesas que ainda preciso pagar”. Ela sai da pendência, desconta do saldo do mês do pagamento e permanece no histórico.
                  </p>

                  {finCategory === 'Outro' && (
                    <input type="text" placeholder="Nome da Categoria Personalizada" value={finCustomCategory} onChange={(e) => setFinCustomCategory(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                  )}

                  <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer">
                    <Plus className="w-4 h-4" /> Adicionar Despesa
                  </button>
                </form>
              </div>

              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-3xl shadow-xs space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-extrabold text-pink-950 uppercase tracking-wider">Histórico financeiro • {financeMonthLabel}</h3>
                    <p className="text-[10px] text-stone-400 mt-1">Gastos, recebimentos e pendências em uma única linha do tempo.</p>
                  </div>

                  <div className="relative w-full lg:w-72">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={financeHistorySearch}
                      onChange={(e) => setFinanceHistorySearch(e.target.value)}
                      placeholder="Buscar no histórico..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-pink-950 focus:outline-none focus:border-pink-300"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'expense', label: 'Gastos' },
                    { id: 'received', label: 'Recebidos' },
                    { id: 'pending', label: 'Pendentes' },
                  ].map(filter => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setFinanceHistoryFilter(filter.id as 'all' | 'expense' | 'received' | 'pending')}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold border transition ${
                        financeHistoryFilter === filter.id
                          ? 'bg-pink-500 text-white border-pink-500'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-pink-300'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {filteredFinanceHistoryEntries.length === 0 ? (
                    <div className="border border-dashed border-pink-200 rounded-2xl py-10 text-center">
                      <p className="text-xs font-bold text-stone-500">Nenhum lançamento encontrado.</p>
                      <p className="text-[10px] text-stone-400 mt-1">Tente outro filtro, busca ou mês.</p>
                    </div>
                  ) : (
                    filteredFinanceHistoryEntries.map(entry => {
                      const isExpenseEditing = entry.source === 'expense' && editingExpenseId === entry.expenseId
                      const displayDate = entry.date.includes('-') ? formatLocalDate(entry.date) : entry.date

                      return (
                        <div
                          key={entry.id}
                          className={`border rounded-xl p-3.5 text-xs ${
                            entry.type === 'expense'
                              ? 'bg-rose-50/40 border-rose-100'
                              : entry.type === 'pending'
                                ? 'bg-amber-50/50 border-amber-200'
                                : 'bg-emerald-50/40 border-emerald-100'
                          }`}
                        >
                          {isExpenseEditing ? (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <input
                                type="text"
                                value={editDescInput}
                                onChange={(e) => setEditDescInput(e.target.value)}
                                className="bg-white border border-pink-200 rounded-lg px-2.5 py-2 text-xs text-pink-950 flex-1"
                                placeholder="Descrição"
                              />
                              <input
                                type="text"
                                inputMode="decimal"
                                value={editAmountInput}
                                onChange={(e) => setEditAmountInput(e.target.value)}
                                className="bg-white border border-pink-200 rounded-lg px-2.5 py-2 text-xs text-pink-950 w-full sm:w-28"
                                placeholder="Valor"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const amt = parseCurrencyInput(editAmountInput)
                                  if (Number.isFinite(amt) && amt >= 0 && entry.expenseId) {
                                    lastLocalMutationRef.current = Date.now()
                                    setFinances(prev => prev.map(item =>
                                      item.id === entry.expenseId
                                        ? { ...item, description: editDescInput.trim() || item.description, amount: amt }
                                        : item
                                    ))
                                    setEditingExpenseId(null)
                                  }
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg font-bold"
                              >
                                Salvar
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingExpenseId(null)}
                                className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-3 py-2 rounded-lg"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                                    entry.type === 'expense'
                                      ? 'bg-rose-100 text-rose-700'
                                      : entry.type === 'pending'
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-emerald-100 text-emerald-700'
                                  }`}>
                                    {entry.type === 'expense' ? 'GASTO' : entry.type === 'pending' ? 'PENDENTE' : 'RECEBIDO'}
                                  </span>
                                  <span className="font-extrabold text-pink-950">{entry.label}</span>
                                  {entry.source === 'expense' && (
                                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      entry.expenseStatus === 'Pago'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-amber-50 text-amber-800 border-amber-200'
                                    }`}>
                                      {entry.expenseStatus === 'Pago' ? 'PAGO' : 'PENDENTE'}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-stone-400 mt-1">
                                  {displayDate} • {entry.category}
                                  {entry.source === 'expense' && entry.expenseStatus === 'Pago' && entry.expensePaidDate
                                    ? ` • pago em ${formatLocalDate(entry.expensePaidDate)}`
                                    : ''}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 shrink-0">
                                <span className={`text-sm font-extrabold ${
                                  entry.type === 'expense'
                                    ? 'text-rose-600'
                                    : entry.type === 'pending'
                                      ? 'text-amber-800'
                                      : 'text-emerald-700'
                                }`}>
                                  {entry.type === 'expense' ? '− ' : entry.type === 'received' ? '+ ' : ''}{maskValue(entry.amount)}
                                </span>

                                {entry.source === 'expense' && entry.expenseId && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        lastLocalMutationRef.current = Date.now()
                                        setFinances(prev => prev.map(item => {
                                          if (item.id !== entry.expenseId) return item
                                          const currentStatus = getExpenseStatus(item)
                                          return currentStatus === 'Pago'
                                            ? { ...item, status: 'Pendente' as const, paidDate: undefined }
                                            : { ...item, status: 'Pago' as const, paidDate: todayDateKey }
                                        }))
                                      }}
                                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border ${
                                        entry.expenseStatus === 'Pago'
                                          ? 'bg-white hover:bg-amber-50 text-amber-700 border-amber-200'
                                          : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                                      }`}
                                      title={entry.expenseStatus === 'Pago' ? 'Voltar despesa para pendente' : 'Confirmar pagamento da despesa/fatura'}
                                    >
                                      {entry.expenseStatus === 'Pago' ? 'Voltar p/ pendente' : '✓ Marcar como pago'}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const expense = finances.find(item => item.id === entry.expenseId)
                                        if (!expense) return
                                        setEditingExpenseId(expense.id)
                                        setEditDescInput(expense.description)
                                        setEditAmountInput(expense.amount.toString())
                                      }}
                                      className="text-pink-600 hover:bg-pink-100 p-1.5 rounded-lg"
                                      title="Editar despesa"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (!confirm('Excluir esta despesa do histórico?')) return
                                        lastLocalMutationRef.current = Date.now()
                                        setFinances(prev => prev.filter(item => item.id !== entry.expenseId))
                                      }}
                                      className="text-stone-400 hover:text-red-500 p-1.5"
                                      title="Excluir despesa"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}

                                {entry.source === 'shift' && entry.shiftId && entry.type === 'pending' && (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleShiftStatus(entry.shiftId!)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold"
                                  >
                                    Marcar recebido
                                  </button>
                                )}

                                {entry.source === 'shift' && entry.shiftId && entry.type === 'received' && (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleShiftStatus(entry.shiftId!)}
                                    className="bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                                  >
                                    Voltar p/ pendente
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'toxicidadevcog' && (
            <AdvancedOncologyFeature
              mode="toxicity"
              patients={patients}
              onAddTimelineEvent={handleAddTimelineEvent}
              onAddAlert={handleAddPatientAlert}
            />
          )}

          {activeTab === 'interacoesonco' && (
            <AdvancedOncologyFeature
              mode="interactions"
              patients={patients}
              onUpdateContinuousMedications={handleUpdateContinuousMedications}
            />
          )}

          {activeTab === 'posquimio' && (
            <AdvancedOncologyFeature
              mode="postchemo"
              patients={patients}
              onAddTimelineEvent={handleAddTimelineEvent}
            />
          )}

          {activeTab === 'histologia' && (
            <AdvancedOncologyFeature
              mode="histology"
              patients={patients}
              onAddTimelineEvent={handleAddTimelineEvent}
            />
          )}

          {activeTab === 'nutricaoenergia' && (
            <CanineNutritionFeature mode="energy" patients={patients} onAddTimelineEvent={handleAddTimelineEvent} />
          )}

          {activeTab === 'nutricaoecc' && (
            <CanineNutritionFeature mode="bcs" patients={patients} onAddTimelineEvent={handleAddTimelineEvent} />
          )}

          {activeTab === 'nutricaotoxicos' && (
            <CanineNutritionFeature mode="toxins" patients={patients} onAddTimelineEvent={handleAddTimelineEvent} />
          )}

          {activeTab === 'nutricaodieta' && (
            <CanineNutritionFeature mode="diet" patients={patients} onAddTimelineEvent={handleAddTimelineEvent} />
          )}

          {activeTab === 'labref' && (
            <PreChemoChecklist patients={patients} />
          )}

          {activeTab === 'protocolos' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm"><Syringe className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-base font-extrabold text-pink-950">💉 Simulador de Protocolos Combinados (CHOP e outros)</h2>
                    <p className="text-xs text-pink-500 font-medium">Selecione o protocolo, informe o peso — o sistema calcula automaticamente a dose de cada fármaco da sessão</p>
                  </div>
                </div>

                {(() => {
                  const CHOP_PROTOCOLS = [
                    {
                      name: 'CHOP – Semana 1 (Vincristina + Prednisona)',
                      drugs: [
                        { drug: 'Vincristina', dosePerM2: 0.7, conc: 1, unit: 'mg/m²', route: 'IV lento' },
                        { drug: 'Prednisona', dosePerKg: 2, unit: 'mg/kg/dia', oral: true, days: 7, conc: 5 },
                      ]
                    },
                    {
                      name: 'CHOP – Semana 2 (Ciclofosfamida + Prednisona)',
                      drugs: [
                        { drug: 'Ciclofosfamida', dosePerM2: 250, conc: 50, unit: 'mg/m²', route: 'IV ou VO' },
                        { drug: 'Prednisona', dosePerKg: 1.5, unit: 'mg/kg/dia', oral: true, days: 7, conc: 5 },
                      ]
                    },
                    {
                      name: 'CHOP – Semana 3 (Doxorrubicina + Prednisona)',
                      drugs: [
                        { drug: 'Doxorrubicina', dosePerM2: 30, conc: 2, unit: 'mg/m²', route: 'IV lento (infusão 30min)' },
                        { drug: 'Prednisona', dosePerKg: 1.0, unit: 'mg/kg/dia', oral: true, days: 7, conc: 5 },
                      ]
                    },
                    {
                      name: 'CHOP – Semana 4 (Vincristina + Prednisona)',
                      drugs: [
                        { drug: 'Vincristina', dosePerM2: 0.7, conc: 1, unit: 'mg/m²', route: 'IV lento' },
                        { drug: 'Prednisona', dosePerKg: 0.5, unit: 'mg/kg/dia', oral: true, days: 7, conc: 5 },
                      ]
                    },
                    {
                      name: 'Clorambucil + Prednisona (Felinos – Linfoma Baixo Grau)',
                      drugs: [
                        { drug: 'Clorambucil', dosePerKg: 0.2, conc: 2, unit: 'mg/kg/dia', oral: true, days: 14 },
                        { drug: 'Prednisona', dosePerKg: 1, unit: 'mg/kg/dia', oral: true, days: 14, conc: 5 },
                      ]
                    },
                    {
                      name: 'Lomustina (CCNU) – Protocolo Dose Única',
                      drugs: [
                        { drug: 'Lomustina (CCNU)', dosePerM2: 60, conc: 40, unit: 'mg/m²', oral: true, days: 1 },
                      ]
                    },
                  ];

                  const calcProtocol = () => {
                    const w = parseFloat(protWeight) || 0
                    if (w <= 0) return
                    const k = protSpecies === 'cao' ? 10.1 : 10.0
                    const bsa = (k * Math.pow(w, 2/3)) / 100
                    const proto = CHOP_PROTOCOLS[selectedProtocol]
                    const results = proto.drugs.map(d => {
                      let totalMg = 0
                      let totalMl = 0
                      if ((d as any).dosePerM2) {
                        totalMg = bsa * (d as any).dosePerM2
                        totalMl = totalMg / (d.conc || 1)
                      } else if ((d as any).dosePerKg) {
                        totalMg = w * (d as any).dosePerKg
                        totalMl = totalMg / (d.conc || 1)
                      }
                      return { ...d, totalMg, totalMl, bsa }
                    })
                    setProtResults(results)
                  }

                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="text-xs font-bold text-stone-700 block mb-1">Protocolo / Sessão</label>
                          <select value={selectedProtocol} onChange={(e) => { setSelectedProtocol(Number(e.target.value)); setProtResults([]); }} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                            {CHOP_PROTOCOLS.map((p, i) => <option key={i} value={i}>{p.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Espécie</label>
                          <select value={protSpecies} onChange={(e) => { setProtSpecies(e.target.value as any); setProtResults([]); }} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                            <option value="cao">Canino (K=10.1)</option>
                            <option value="gato">Felino (K=10.0)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <label className="text-xs font-bold text-stone-700 block mb-1">Peso do Paciente (kg)</label>
                          <input type="number" step="0.1" placeholder="Ex: 18.5" value={protWeight} onChange={(e) => { setProtWeight(e.target.value); setProtResults([]); }} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                        </div>
                        <button onClick={calcProtocol} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-2">
                          <Calculator className="w-4 h-4" /> Calcular Protocolo Completo
                        </button>
                      </div>

                      {protResults.length > 0 && (
                        <div className="space-y-4">
                          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs">
                            <span className="font-extrabold text-emerald-900">BSA calculada: {protResults[0]?.bsa?.toFixed(3)} m² | Peso: {protWeight} kg | Protocolo: {CHOP_PROTOCOLS[selectedProtocol].name}</span>
                          </div>
                          <div className="space-y-3">
                            {protResults.map((r, i) => (
                              <div key={i} className="bg-white border border-pink-200 p-5 rounded-2xl shadow-2xs space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-extrabold text-sm text-pink-950">{r.drug}</h4>
                                  <span className="text-[10px] bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full font-bold">{r.route || (r.oral ? 'Via Oral (VO)' : 'IV')}</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <div className="bg-pink-50 p-3 rounded-xl text-center">
                                    <div className="text-[10px] font-bold text-pink-600 uppercase">Dose Total</div>
                                    <div className="text-lg font-extrabold text-pink-950">{r.totalMg.toFixed(2)} mg</div>
                                  </div>
                                  <div className="bg-pink-50 p-3 rounded-xl text-center">
                                    <div className="text-[10px] font-bold text-pink-600 uppercase">Volume (ml)</div>
                                    <div className="text-lg font-extrabold text-rose-600">{r.totalMl.toFixed(2)} ml</div>
                                  </div>
                                  <div className="bg-pink-50 p-3 rounded-xl text-center">
                                    <div className="text-[10px] font-bold text-pink-600 uppercase">Conc. (mg/ml)</div>
                                    <div className="text-lg font-extrabold text-pink-950">{r.conc}</div>
                                  </div>
                                  <div className="bg-pink-50 p-3 rounded-xl text-center">
                                    <div className="text-[10px] font-bold text-pink-600 uppercase">Duração</div>
                                    <div className="text-lg font-extrabold text-pink-950">{r.days ? r.days + ' dia(s)' : '1 aplicação'}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

          {activeTab === 'nadir' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm"><Activity className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-base font-extrabold text-pink-950">📉 Calculadora de Nadir & Alerta de Hemograma de Controle</h2>
                    <p className="text-xs text-pink-500 font-medium">Insira a data de aplicação do quimioterápico — o sistema calcula automaticamente a janela de risco de nadir e gera alertas</p>
                  </div>
                </div>

                {(() => {
                  const NADIR_DATA: Record<string, { d7: number, d14: number, notes: string }> = {
                    'Doxorrubicina': { d7: 7, d14: 14, notes: 'Nadir mais severo entre Dia 7 e 14. Risco alto de neutropenia e trombocitopenia.' },
                    'Ciclofosfamida': { d7: 7, d14: 14, notes: 'Nadir geralmente entre 7–14 dias. Monitorar cistite hemorrágica concomitante.' },
                    'Vincristina': { d7: 7, d14: 10, notes: 'Mielossupressão mais branda. Pico por volta do Dia 7–10.' },
                    'Lomustina (CCNU)': { d7: 7, d14: 21, notes: 'Mielossupressão bifásica tardia! Nadir pode ocorrer em até 3–5 semanas. Hemograma a cada 7 dias.' },
                    'Clorambucil': { d7: 7, d14: 14, notes: 'Mielossupressão branda a moderada. Monitorar semanalmente em protocolos contínuos.' },
                  }

                  const calcNadir = () => {
                    if (!nadirDate) return
                    const [year, month, day] = nadirDate.split('-').map(Number)
                    const base = new Date(year, month - 1, day)
                    const info = NADIR_DATA[nadirDrug]
                    const d7 = new Date(base); d7.setDate(d7.getDate() + info.d7)
                    const d14 = new Date(base); d14.setDate(d14.getDate() + info.d14)
                    const fmt = (d: Date) => d.toLocaleDateString('pt-BR')
                    const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
                    setNadirResult({ drug: nadirDrug, applicationDate: fmt(base), applicationDateIso: iso(base), nadirStart: fmt(d7), nadirEnd: fmt(d14), nadirStartIso: iso(d7), nadirEndIso: iso(d14), notes: info.notes })
                  }

                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Paciente (para dashboard/timeline)</label>
                          <select value={nadirPatientId} onChange={(e) => setNadirPatientId(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                            <option value="">Somente simular</option>
                            {patients.filter(p => p.species === 'Canino' || p.species === 'Felino').map(p => <option key={p.id} value={p.id}>{p.petName} • {p.tutor}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Fármaco Aplicado</label>
                          <select value={nadirDrug} onChange={(e) => { setNadirDrug(e.target.value); setNadirResult(null); }} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                            {Object.keys(NADIR_DATA).map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Data de Aplicação</label>
                          <input type="date" value={nadirDate} onChange={(e) => { setNadirDate(e.target.value); setNadirResult(null); }} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                        </div>
                      </div>

                      <button onClick={calcNadir} className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center justify-center gap-2">
                        <Activity className="w-4 h-4" /> Calcular Janela de Risco de Nadir
                      </button>

                      {nadirResult && (
                        <div className="space-y-4">
                          <div className="bg-rose-50 border-2 border-rose-400 p-6 rounded-2xl space-y-4">
                            <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm">
                              <AlertTriangle className="w-5 h-5 text-rose-600" />
                              ⚠️ JANELA DE RISCO DE NADIR — {nadirResult.drug}
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-white border border-rose-200 p-4 rounded-xl text-center">
                                <div className="text-[10px] font-bold text-stone-500 uppercase">Data de Aplicação</div>
                                <div className="text-base font-extrabold text-pink-950 mt-1">{nadirResult.applicationDate}</div>
                              </div>
                              <div className="bg-rose-100 border-2 border-rose-400 p-4 rounded-xl text-center">
                                <div className="text-[10px] font-bold text-rose-700 uppercase">Início do Nadir</div>
                                <div className="text-base font-extrabold text-rose-900 mt-1">{nadirResult.nadirStart}</div>
                              </div>
                              <div className="bg-rose-100 border-2 border-rose-400 p-4 rounded-xl text-center">
                                <div className="text-[10px] font-bold text-rose-700 uppercase">Fim do Nadir</div>
                                <div className="text-base font-extrabold text-rose-900 mt-1">{nadirResult.nadirEnd}</div>
                              </div>
                            </div>
                            <div className="bg-white border border-rose-200 p-4 rounded-xl text-xs text-stone-700 leading-relaxed">
                              <span className="font-extrabold text-rose-800">📋 Conduta Recomendada: </span>{nadirResult.notes}
                            </div>
                            <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                              ⚠️ Agendar hemograma de controle para o período: {nadirResult.nadirStart} → {nadirResult.nadirEnd}
                            </div>
                            {nadirPatientId && (
                              <button type="button" onClick={() => {
                                handleAddTimelineEvent(nadirPatientId, {
                                  id: `nadir-${Date.now()}`,
                                  date: nadirResult.applicationDateIso,
                                  type: 'quimioterapia',
                                  title: `${nadirResult.drug} — janela de nadir calculada`,
                                  chemoDrug: nadirResult.drug,
                                  nadirStart: nadirResult.nadirStartIso,
                                  nadirEnd: nadirResult.nadirEndIso,
                                  notes: nadirResult.notes
                                })
                                alert('Janela de nadir registrada na timeline e no dashboard clínico.')
                              }} className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2.5 rounded-xl text-xs font-bold">
                                Salvar nadir no prontuário / dashboard
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="bg-pink-50/60 border border-pink-200 p-5 rounded-2xl space-y-3">
                        <h4 className="text-xs font-extrabold text-pink-950">📊 Referência de Nadir por Fármaco</h4>
                        <div className="overflow-hidden rounded-xl border border-pink-100">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-pink-100">
                                <th className="px-3 py-2 text-left font-extrabold text-pink-900">Fármaco</th>
                                <th className="px-3 py-2 text-left font-extrabold text-pink-700">Nadir Típico</th>
                                <th className="px-3 py-2 text-left font-extrabold text-pink-700">Severidade</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-pink-50">
                              {[
                                ['Doxorrubicina', 'Dias 7–14', 'Alta ⚠️'],
                                ['Ciclofosfamida', 'Dias 7–14', 'Moderada'],
                                ['Vincristina', 'Dias 7–10', 'Branda'],
                                ['Lomustina (CCNU)', 'Dias 7–21 (bifásico)', 'Alta ⚠️ (tardio)'],
                                ['Clorambucil', 'Dias 7–14', 'Branda a Moderada'],
                              ].map(([drug, nadir, sev], i) => (
                                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-pink-50/30'}>
                                  <td className="px-3 py-2 font-semibold text-stone-700">{drug}</td>
                                  <td className="px-3 py-2 text-pink-800 font-bold">{nadir}</td>
                                  <td className="px-3 py-2 font-bold"><span className={sev.includes('Alta') ? 'text-rose-700' : 'text-amber-700'}>{sev}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

          {activeTab === 'extravasamento' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-sm"><ShieldAlert className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-base font-extrabold text-pink-950">🚨 Guia de Conduta para Extravasamento de Vesicantes</h2>
                    <p className="text-xs text-rose-600 font-bold">EMERGÊNCIA ONCOLÓGICA — Fármacos vesicantes causam necrose tecidual severa se extravasarem para o subcutâneo durante a infusão IV</p>
                  </div>
                </div>

                <div className="bg-rose-50 border-2 border-rose-500 p-5 rounded-2xl space-y-3">
                  <div className="font-extrabold text-rose-900 text-sm flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-600" /> PROTOCOLO GERAL DE EXTRAVASAMENTO — PASSOS IMEDIATOS
                  </div>
                  <ol className="space-y-2 text-xs text-stone-800">
                    {[
                      { step: '1', action: 'PARAR a infusão IMEDIATAMENTE', detail: 'NÃO retirar o cateter ainda — ele será utilizado para aspiração do fármaco residual.' },
                      { step: '2', action: 'ASPIRAR com seringa', detail: 'Tentar aspirar o máximo possível de sangue e resíduo do fármaco pelo cateter antes de removê-lo.' },
                      { step: '3', action: 'REMOVER o cateter suavemente', detail: 'Após aspiração máxima, remover o cateter com cuidado. Não pressionar o local.' },
                      { step: '4', action: 'DEMARCAR a área afetada', detail: 'Marcar com caneta dermatográfica o perímetro visível da área de extravasamento para acompanhamento.' },
                      { step: '5', action: 'APLICAR o antídoto específico (ver abaixo)', detail: 'O antídoto varia conforme o fármaco extravasado. Veja os cards individuais abaixo.' },
                      { step: '6', action: 'DOCUMENTAR e monitorar', detail: 'Fotografar a área, anotar o volume extravasado, notificar o tutor e agendar revisão em 24–48h.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 bg-white border border-rose-200 p-3 rounded-xl">
                        <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">{item.step}</span>
                        <div>
                          <div className="font-extrabold text-rose-900">{item.action}</div>
                          <div className="text-stone-600 mt-0.5 leading-relaxed">{item.detail}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-pink-950 uppercase tracking-wider">Antídotos por Fármaco Vesicante</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        drug: '🔴 Doxorrubicina',
                        vesicant: 'VESICANTE POTENTE',
                        antidote: 'Dexrazoxana (Savene/Totect)',
                        protocol: 'Dose: 1000 mg/m² IV por 3 dias consecutivos. Iniciar nas primeiras 6h após extravasamento.',
                        complementary: 'EVITAR compressas quentes. Compressas frias por 15 min, 4x/dia nas primeiras 72h.',
                        color: 'rose'
                      },
                      {
                        drug: '🟠 Vincristina / Vinblastina',
                        vesicant: 'VESICANTE SEVERO',
                        antidote: 'Hialuronidase + Compressas QUENTES',
                        protocol: 'Hialuronidase 150–1500 UI SC em múltiplos pontos ao redor do extravasamento. Aplicar CALOR (não frio!) para dispersar o fármaco.',
                        complementary: 'Compressas mornas por 15 min, 4x/dia. NÃO usar compressas frias (efeito oposto ao da Doxorrubicina).',
                        color: 'amber'
                      },
                      {
                        drug: '🟡 Ciclofosfamida',
                        vesicant: 'IRRITANTE (menor risco)',
                        antidote: 'Compressas frias + Hidratação local',
                        protocol: 'Compressas frias por 20 minutos, 4x/dia. Monitorar por 48–72h. Em casos graves, corticoide local.',
                        complementary: 'Risco de lesão tecidual é menor que os alcalóides da vinca e antraciclinas. Monitorar atentamente.',
                        color: 'yellow'
                      },
                    ].map((item, i) => (
                      <div key={i} className={`bg-white border-2 ${item.color === 'rose' ? 'border-rose-400' : item.color === 'amber' ? 'border-amber-400' : 'border-yellow-300'} p-5 rounded-2xl space-y-3`}>
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-sm text-pink-950">{item.drug}</h4>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${item.color === 'rose' ? 'bg-rose-100 text-rose-800' : item.color === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.vesicant}</span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <div className="font-extrabold text-stone-700">Antídoto: <span className="text-pink-700">{item.antidote}</span></div>
                          <div className="bg-pink-50 border border-pink-100 p-2.5 rounded-lg text-stone-700 leading-relaxed">{item.protocol}</div>
                          <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-amber-800 leading-relaxed font-medium">{item.complementary}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ajustes' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm"><Scale className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-base font-extrabold text-pink-950">⚖️ Ajustes Críticos para Pacientes Extremos (Obesos, Toy e Gatos)</h2>
                    <p className="text-xs text-pink-500 font-medium">O cálculo puro de BSA pode superestimar ou subestimar a dose em pacientes extremos. Use esta calculadora com correções automáticas.</p>
                  </div>
                </div>

                {(() => {
                  const DOSE_TABLE: Record<string, number> = {
                    'Doxorrubicina': 30, 'Ciclofosfamida': 250, 'Vincristina': 0.7,
                    'Lomustina (CCNU)': 60, 'Clorambucil': 20
                  }
                  const CONC_TABLE: Record<string, number> = {
                    'Doxorrubicina': 2, 'Ciclofosfamida': 50, 'Vincristina': 1,
                    'Lomustina (CCNU)': 40, 'Clorambucil': 2
                  }

                  const calcAdj = () => {
                    const w = parseFloat(adjWeight) || 0
                    const ecc = parseInt(adjECC) || 5
                    if (w <= 0) return
                    const k = adjSpecies === 'cao' ? 10.1 : 10.0
                    const bsaStd = (k * Math.pow(w, 2/3)) / 100

                    // Metabolic weight
                    const metaWeight = Math.pow(w, 0.75)
                    const bsaMeta = (k * Math.pow(metaWeight, 2/3)) / 100

                    // Correction factor
                    let correctionFactor = 1.0
                    let correctionNote = 'Peso normal — sem ajuste necessário.'
                    let useMetabolic = false

                    const isToy = (adjSpecies === 'cao' && w < 10) || (adjSpecies === 'gato' && w < 3)
                    const isObese = ecc >= 8

                    if (isObese) {
                      correctionFactor = 0.75
                      correctionNote = 'Paciente obeso (ECC ≥ 8/9): redução de 25% da dose recomendada. O tecido adiposo não metaboliza fármacos eficientemente.'
                    } else if (isToy) {
                      useMetabolic = true
                      correctionNote = `Paciente ${adjSpecies === 'cao' ? 'toy/miniatura' : 'gato'} (< ${adjSpecies === 'cao' ? '10' : '3'} kg): uso do Peso Metabólico (kg^0.75) recomendado para evitar subdosagem ou toxicidade desproporcionada.`
                    }

                    const doseM2 = DOSE_TABLE[adjDrug] || 30
                    const conc = CONC_TABLE[adjDrug] || 2

                    const mgStd = bsaStd * doseM2 * correctionFactor
                    const mlStd = mgStd / conc
                    const mgMeta = bsaMeta * doseM2 * correctionFactor
                    const mlMeta = mgMeta / conc

                    setAdjResult({ bsaStd, bsaMeta, metaWeight, mgStd, mlStd, mgMeta, mlMeta, correctionFactor, correctionNote, useMetabolic, isToy, isObese, doseM2 })
                  }

                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Peso Real (kg)</label>
                          <input type="number" step="0.1" placeholder="Ex: 4.5" value={adjWeight} onChange={(e) => { setAdjWeight(e.target.value); setAdjResult(null); }} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Espécie</label>
                          <select value={adjSpecies} onChange={(e) => { setAdjSpecies(e.target.value as any); setAdjResult(null); }} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                            <option value="cao">Canino</option>
                            <option value="gato">Felino</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">ECC (1–9)</label>
                          <select value={adjECC} onChange={(e) => { setAdjECC(e.target.value); setAdjResult(null); }} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                            {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n} {n <= 3 ? '(Caquético)' : n <= 5 ? '(Normal)' : n <= 7 ? '(Sobrepeso)' : '(Obeso)'}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Fármaco</label>
                          <select value={adjDrug} onChange={(e) => { setAdjDrug(e.target.value); setAdjResult(null); }} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                            {Object.keys(DOSE_TABLE).map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                      </div>

                      <button onClick={calcAdj} className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center justify-center gap-2">
                        <Scale className="w-4 h-4" /> Calcular com Ajuste para Paciente Extremo
                      </button>

                      {adjResult && (
                        <div className="space-y-4">
                          <div className={`p-4 rounded-2xl border-2 text-xs font-bold flex items-start gap-2 ${adjResult.isObese ? 'bg-rose-50 border-rose-400 text-rose-900' : adjResult.isToy ? 'bg-amber-50 border-amber-400 text-amber-900' : 'bg-emerald-50 border-emerald-400 text-emerald-900'}`}>
                            <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${adjResult.isObese ? 'text-rose-600' : adjResult.isToy ? 'text-amber-600' : 'text-emerald-600'}`} />
                            {adjResult.correctionNote}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-pink-50 border border-pink-200 p-5 rounded-2xl space-y-3 text-center">
                              <div className="text-xs font-extrabold text-pink-700 uppercase">📐 BSA Padrão (kg²/³ × K)</div>
                              <div className="text-2xl font-extrabold text-pink-950">{adjResult.bsaStd.toFixed(3)} m²</div>
                              <div className="text-xs text-stone-600">Dose {adjDrug}: <span className="font-bold text-pink-900">{adjResult.mgStd.toFixed(2)} mg</span></div>
                              <div className="text-xs text-stone-600">Volume: <span className="font-bold text-rose-600">{adjResult.mlStd.toFixed(2)} ml</span></div>
                              {adjResult.correctionFactor < 1 && <div className="text-[10px] bg-rose-100 text-rose-800 px-2 py-1 rounded-lg font-bold">Com fator de correção: {(adjResult.correctionFactor * 100).toFixed(0)}% da dose</div>}
                            </div>

                            <div className={`border-2 p-5 rounded-2xl space-y-3 text-center ${adjResult.useMetabolic ? 'bg-amber-50 border-amber-400' : 'bg-stone-50 border-stone-200 opacity-60'}`}>
                              <div className="text-xs font-extrabold text-amber-700 uppercase">⚡ Peso Metabólico (kg^0.75)</div>
                              <div className="text-2xl font-extrabold text-pink-950">{adjResult.bsaMeta.toFixed(3)} m²</div>
                              <div className="text-xs text-stone-600">Dose {adjDrug}: <span className="font-bold text-pink-900">{adjResult.mgMeta.toFixed(2)} mg</span></div>
                              <div className="text-xs text-stone-600">Volume: <span className="font-bold text-rose-600">{adjResult.mlMeta.toFixed(2)} ml</span></div>
                              {adjResult.useMetabolic && <div className="text-[10px] bg-amber-200 text-amber-900 px-2 py-1 rounded-lg font-extrabold">✅ RECOMENDADO PARA ESTE PACIENTE</div>}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-pink-50/60 border border-pink-200 p-5 rounded-2xl space-y-3">
                        <h4 className="text-xs font-extrabold text-pink-950">📋 Critérios de Ajuste de Dose Rápidos</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          {[
                            { crit: 'Cão < 10 kg ou Gato < 3 kg', rec: 'Usar Peso Metabólico (kg^0.75) para BSA', color: 'amber' },
                            { crit: 'ECC ≥ 8/9 (Obeso)', rec: 'Reduzir dose em 25–30% sobre a BSA padrão', color: 'rose' },
                            { crit: 'ECC ≤ 3 (Caquético)', rec: 'Considerar redução de 10–20% e suporte nutricional antes da QT', color: 'yellow' },
                          ].map((item, i) => (
                            <div key={i} className={`bg-white border p-3 rounded-xl ${item.color === 'rose' ? 'border-rose-200' : item.color === 'amber' ? 'border-amber-200' : 'border-yellow-200'}`}>
                              <div className="font-extrabold text-stone-800">{item.crit}</div>
                              <div className={`mt-1 ${item.color === 'rose' ? 'text-rose-700' : item.color === 'amber' ? 'text-amber-700' : 'text-yellow-700'}`}>{item.rec}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

          {activeTab === 'funcaorganica' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm"><ClipboardList className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-base font-extrabold text-pink-950">🏥 Cruzamento com Exames de Função Orgânica (Renal e Hepática)</h2>
                    <p className="text-xs text-pink-500 font-medium">Pré-quimioterapia: insira os valores laboratoriais — o sistema emite alertas e sugere reduções de dose automaticamente</p>
                  </div>
                </div>

                {(() => {
                  const LIMITS = {
                    cao: { creat: { normal: 1.5, mild: 2.0, severe: 3.0 }, alt: { normal: 88, mild: 176, severe: 264 }, fa: { normal: 150, mild: 300, severe: 600 } },
                    gato: { creat: { normal: 1.8, mild: 2.5, severe: 4.0 }, alt: { normal: 130, mild: 260, severe: 390 }, fa: { normal: 111, mild: 222, severe: 333 } }
                  }

                  const CHEMO_ORGAN: Record<string, { hepatic: boolean, renal: boolean }> = {
                    'Doxorrubicina': { hepatic: true, renal: false },
                    'Ciclofosfamida': { hepatic: false, renal: true },
                    'Vincristina': { hepatic: true, renal: false },
                    'Lomustina (CCNU)': { hepatic: true, renal: false },
                    'Clorambucil': { hepatic: true, renal: false },
                    'Carboplatina': { hepatic: false, renal: true },
                  }

                  const evalOrgan = () => {
                    if (!foCreat.trim() && !foALT.trim() && !foFA.trim()) {
                      setFoResult([{
                        param: 'Dados laboratoriais ausentes',
                        sev: 'Preencha ao menos um valor',
                        color: 'yellow',
                        note: 'Nenhum parâmetro renal ou hepático foi informado para avaliação.',
                        action: 'Informe creatinina, ALT/TGP e/ou fosfatase alcalina antes de gerar a análise.'
                      }])
                      return
                    }

                    const lim = LIMITS[foSpecies]
                    const alerts: any[] = []
                    const drug = CHEMO_ORGAN[foChemo] || { hepatic: false, renal: false }

                    const creat = parseFloat(foCreat)
                    const alt = parseFloat(foALT)
                    const fa = parseFloat(foFA)

                    if (!isNaN(creat)) {
                      let sev = 'normal', reduction = 0, color = 'green'
                      if (creat > lim.creat.severe) { sev = 'Grave'; reduction = 50; color = 'rose' }
                      else if (creat > lim.creat.mild) { sev = 'Moderada'; reduction = 25; color = 'amber' }
                      else if (creat > lim.creat.normal) { sev = 'Leve'; reduction = 10; color = 'yellow' }
                      if (sev !== 'normal') {
                        alerts.push({
                          param: `Creatinina: ${creat} mg/dL`,
                          sev,
                          color,
                          note: drug.renal ? `⚠️ ${foChemo} depende da filtração glomerular! Redução de ${reduction}% da dose recomendada.` : `Disfunção renal ${sev.toLowerCase()} detectada. ${foChemo} tem menor dependência renal, mas monitorar hidratação.`,
                          action: drug.renal ? `Reduzir dose de ${foChemo} em ${reduction}% ou avaliar substituição por agente não-nefrotóxico.` : `Garantir hidratação adequada antes e após administração de ${foChemo}.`
                        })
                      }
                    }

                    if (!isNaN(alt)) {
                      let sev = 'normal', reduction = 0, color = 'green'
                      if (alt > lim.alt.severe) { sev = 'Grave (>3x normal)'; reduction = 50; color = 'rose' }
                      else if (alt > lim.alt.mild) { sev = 'Moderada (>2x normal)'; reduction = 25; color = 'amber' }
                      else if (alt > lim.alt.normal) { sev = 'Leve (>1x normal)'; reduction = 10; color = 'yellow' }
                      if (sev !== 'normal') {
                        alerts.push({
                          param: `ALT/TGP: ${alt} U/L`,
                          sev,
                          color,
                          note: drug.hepatic ? `⚠️ ${foChemo} é metabolizado pelo fígado! Redução de ${reduction}% recomendada.` : `Hepatotoxicidade ${sev.toLowerCase()}. Avaliar causa e monitorar.`,
                          action: drug.hepatic ? `Reduzir dose de ${foChemo} em ${reduction}%. Considerar hepatoprotetor (SAMe, silimarina). Repetir bioquímico em 7 dias.` : `Investigar causa da elevação de ALT. Monitorar antes do próximo ciclo.`
                        })
                      }
                    }

                    if (!isNaN(fa)) {
                      let sev = 'normal', color = 'green'
                      if (fa > lim.fa.severe) { sev = 'Grave (>4x normal)'; color = 'rose' }
                      else if (fa > lim.fa.mild) { sev = 'Moderada (>2x normal)'; color = 'amber' }
                      else if (fa > lim.fa.normal) { sev = 'Leve'; color = 'yellow' }
                      if (sev !== 'normal') {
                        alerts.push({
                          param: `Fosfatase Alcalina: ${fa} U/L`,
                          sev,
                          color,
                          note: `FA elevada detectada. Em Lomustina, avaliar cumulação hepática. Pode ser induzida por corticoides (FA cortisol-induzida em cães).`,
                          action: `Investigar origem (hepática vs óssea vs corticoide). Se origem hepática confirmada, adiar ciclo de Lomustina/Clorambucil.`
                        })
                      }
                    }

                    if (alerts.length === 0) {
                      alerts.push({ param: 'Todos os valores avaliados', sev: 'Dentro do normal', color: 'green', note: 'Parâmetros compatíveis com administração do quimioterápico sem ajuste de dose.', action: 'Prosseguir com o protocolo conforme planejado.' })
                    }

                    setFoResult(alerts)
                  }

                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="md:col-span-2">
                          <label className="text-xs font-bold text-stone-700 block mb-1">Fármaco a Administrar</label>
                          <select value={foChemo} onChange={(e) => { setFoChemo(e.target.value); setFoResult([]); }} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                            {Object.keys(CHEMO_ORGAN).map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Espécie</label>
                          <select value={foSpecies} onChange={(e) => { setFoSpecies(e.target.value as any); setFoResult([]); }} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                            <option value="cao">Canino</option>
                            <option value="gato">Felino</option>
                          </select>
                        </div>
                      </div>

                      <div className="bg-pink-50/60 border border-pink-200 p-4 rounded-2xl space-y-3">
                        <h4 className="text-xs font-extrabold text-pink-950">📋 Valores Laboratoriais Pré-QT</h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-stone-600 block mb-1">Creatinina (mg/dL)</label>
                            <input type="number" step="0.1" placeholder="Ex: 1.2" value={foCreat} onChange={(e) => { setFoCreat(e.target.value); setFoResult([]); }} className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none font-medium" />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-stone-600 block mb-1">ALT / TGP (U/L)</label>
                            <input type="number" step="1" placeholder="Ex: 95" value={foALT} onChange={(e) => { setFoALT(e.target.value); setFoResult([]); }} className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none font-medium" />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-stone-600 block mb-1">Fosfatase Alcalina (U/L)</label>
                            <input type="number" step="1" placeholder="Ex: 180" value={foFA} onChange={(e) => { setFoFA(e.target.value); setFoResult([]); }} className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none font-medium" />
                          </div>
                        </div>
                      </div>

                      <button onClick={evalOrgan} className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center justify-center gap-2">
                        <ClipboardList className="w-4 h-4" /> Avaliar Função Orgânica & Gerar Alertas de Dose
                      </button>

                      {foResult.length > 0 && (
                        <div className="space-y-3">
                          {foResult.map((item, i) => (
                            <div key={i} className={`border-2 p-5 rounded-2xl space-y-2 ${item.color === 'rose' ? 'bg-rose-50 border-rose-400' : item.color === 'amber' ? 'bg-amber-50 border-amber-400' : item.color === 'yellow' ? 'bg-yellow-50 border-yellow-300' : 'bg-emerald-50 border-emerald-400'}`}>
                              <div className="flex items-center justify-between">
                                <div className="font-extrabold text-sm text-pink-950">{item.param}</div>
                                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${item.color === 'rose' ? 'bg-rose-200 text-rose-900' : item.color === 'amber' ? 'bg-amber-200 text-amber-900' : item.color === 'yellow' ? 'bg-yellow-200 text-yellow-900' : 'bg-emerald-200 text-emerald-900'}`}>{item.sev}</span>
                              </div>
                              <p className="text-xs text-stone-700 leading-relaxed">{item.note}</p>
                              <div className="bg-white border border-pink-100 p-3 rounded-xl text-xs font-semibold text-pink-900">
                                <span className="font-extrabold">📌 Conduta: </span>{item.action}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}