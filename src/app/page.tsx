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
}: {
  patients: ClinicalPatientLite[]
  value: string
  onChange: (value: string) => void
  label?: string
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className={inputClass}>
        <option value="">Sem vincular a prontuário</option>
        {patients.map(p => (
          <option key={p.id} value={p.id}>{p.petName} • {p.tutor} • {p.species}{p.neoplasia ? ` • ${p.neoplasia}` : ''}</option>
        ))}
      </select>
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
            <PatientSelector patients={patientOptions} value={patientId} onChange={setPatientId} />
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
            <PatientSelector patients={patientOptions} value={patientId} onChange={setPatientId} />
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
  const [drug, setDrug] = useState('Doxorrubicina')
  const [date, setDate] = useState(() => todayLocalIso())
  const [hours, setHours] = useState('72')
  const [extra, setExtra] = useState('')
  const [copied, setCopied] = useState(false)

  const guidance = useMemo(() => {
    const pet = selectedPatient?.petName || '[nome do pet]'
    const tutor = selectedPatient?.tutor || '[tutor]'
    return `ORIENTAÇÕES APÓS QUIMIOTERAPIA\n\nPaciente: ${pet}\nTutor(a): ${tutor}\nFármaco: ${drug}\nData da aplicação: ${formatLocalDate(date)}\n\n1. MEDICAÇÕES E ALIMENTAÇÃO\n• Ofereça água e alimentação conforme orientação da equipe.\n• Administre somente as medicações prescritas. Não acrescente anti-inflamatórios, corticoides ou outros medicamentos por conta própria.\n\n2. URINA, FEZES E VÔMITO\n• Durante aproximadamente ${hours || '72'} horas (ou pelo período específico informado pela equipe), use luvas descartáveis ao limpar urina, fezes ou vômito.\n• Recolha os resíduos com material descartável, acondicione em saco fechado e higienize a área.\n• Gestantes, crianças pequenas e pessoas imunossuprimidas devem evitar contato direto com dejetos nesse período.\n\n3. SINAIS DE ALARME — CONTATE A EQUIPE\n• Febre medida ou temperatura fora do intervalo orientado pela clínica.\n• Apatia intensa, fraqueza ou piora súbita do estado geral.\n• Vômitos repetidos, diarreia intensa ou recusa persistente de água/alimento.\n• Sangramento, dificuldade respiratória, dor importante ou redução importante da urina.\n\n4. RETORNO\n• Realize hemograma e retorno nas datas orientadas, especialmente durante a janela prevista de nadir.\n${extra ? `\nObservações específicas:\n${extra}\n` : ''}\nEm caso de dúvida ou piora, entre em contato com a equipe veterinária responsável.`
  }, [selectedPatient, drug, date, hours, extra])

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
            <PatientSelector patients={patientOptions} value={patientId} onChange={setPatientId} label="Paciente" />
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
    const base = [`Paciente: ${selectedPatient?.petName || '[não vinculado]'}`, `Neoplasia cadastrada: ${selectedPatient?.neoplasia || 'não informada'}`]
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
  }, [selectedPatient, tumorType, patnaik, mctClassification, mitosesMct, multinucleated, bizarre, karyomegaly, mammaryTotal, mammaryGrade, tubule, pleomorphism, mammaryMitosis, genericGrade, margins, lvi, notes])

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
            <PatientSelector patients={patientOptions} value={patientId} onChange={setPatientId} label="Paciente" />
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
  { name: 'Xilitol', risk: 'CRÍTICO', effect: 'Hipoglicemia rápida e, em exposições maiores, lesão/insuficiência hepática.', action: 'Contato veterinário imediato. Não induzir vômito em casa sem orientação; a hipoglicemia pode começar rapidamente.' },
  { name: 'Chocolate / cacau', risk: 'ALTO', effect: 'Metilxantinas podem causar vômito, agitação, taquicardia, arritmias, tremores e convulsões.', action: 'Identificar tipo, quantidade, peso do cão e horário; contatar serviço veterinário/toxicologia rapidamente.' },
  { name: 'Uvas / passas', risk: 'ALTO', effect: 'Risco variável de lesão renal aguda; não existe quantidade doméstica considerada previsivelmente segura.', action: 'Avaliação veterinária precoce após ingestão e monitoramento renal conforme orientação.' },
  { name: 'Cebola / alho / cebolinha / alho-poró', risk: 'ALTO', effect: 'Oxidantes de Allium podem causar hemólise e anemia, inclusive após formas cozidas ou desidratadas.', action: 'Registrar forma e quantidade ingerida; procurar orientação veterinária, sobretudo se houver fraqueza, palidez ou icterícia.' },
  { name: 'Macadâmia', risk: 'MODERADO', effect: 'Pode causar vômito, fraqueza, ataxia, tremores e hipertermia em cães.', action: 'Contatar veterinário para avaliação; quadros graves podem necessitar suporte.' },
  { name: 'Massa crua com fermento', risk: 'ALTO', effect: 'Pode expandir no estômago e produzir etanol, levando a distensão e intoxicação alcoólica.', action: 'Atendimento veterinário imediato.' },
  { name: 'Álcool / bebidas alcoólicas', risk: 'CRÍTICO', effect: 'Pode causar vômito, depressão do sistema nervoso central, incoordenação, hipotermia, dificuldade respiratória, coma e morte.', action: 'Atendimento veterinário imediato. Informar tipo de bebida/alimento, teor alcoólico, quantidade e horário.' },
  { name: 'Café / cafeína / energéticos / chá concentrado', risk: 'ALTO', effect: 'Metilxantinas podem causar agitação, taquicardia, hipertensão, arritmias, tremores, hipertermia e convulsões.', action: 'Contato veterinário rápido. Levar embalagem ou informar concentração, quantidade e horário.' },
  { name: 'Lúpulo / resíduos de fabricação de cerveja', risk: 'CRÍTICO', effect: 'Pode provocar hipertermia grave, taquicardia, ansiedade, ofegação e deterioração rápida.', action: 'Emergência veterinária. Não aguardar surgimento de sinais.' },
  { name: 'Excesso de sal / massa de sal / água muito salgada', risk: 'ALTO', effect: 'Pode causar vômito, diarreia, sede intensa, alterações neurológicas, tremores e convulsões.', action: 'Avaliação veterinária urgente. A correção de sódio deve ser controlada.' },
  { name: 'Alimentos mofados / lixo orgânico / composto', risk: 'ALTO', effect: 'Alguns fungos produzem micotoxinas tremorgênicas, com risco de vômito, agitação, tremores, hipertermia e convulsões.', action: 'Atendimento veterinário rápido. Se possível, levar foto ou informação sobre o material ingerido.' },
  { name: 'Noz-moscada em grande quantidade', risk: 'MODERADO', effect: 'Exposições relevantes podem provocar sinais gastrointestinais e neurológicos, como desorientação e tremores.', action: 'Contatar o veterinário com quantidade, forma do produto, peso e horário.' },
  { name: 'Abacate — caroço, casca e grande quantidade', risk: 'MODERADO', effect: 'Em cães, pode causar sinais gastrointestinais; o caroço representa importante risco de obstrução gastrointestinal.', action: 'Se houve ingestão do caroço, grande quantidade ou vômitos/dor abdominal, procurar avaliação veterinária.' },
  { name: 'Comestíveis com cannabis / THC', risk: 'ALTO', effect: 'Podem causar depressão, ataxia, hipersensibilidade, alterações de frequência cardíaca, hipotermia e incontinência; chocolate ou xilitol no produto somam riscos.', action: 'Procurar atendimento veterinário e informar composição, quantidade e horário.' },
  { name: 'Cogumelos silvestres / desconhecidos', risk: 'CRÍTICO', effect: 'A toxicidade varia conforme a espécie e pode incluir sinais gastrointestinais, neurológicos, hepáticos ou renais graves.', action: 'Atendimento veterinário imediato. Fotografar o cogumelo e, se seguro, levar uma amostra separada para identificação.' },
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
          <PatientSelector patients={patients} value={patientId} onChange={setPatientId} />
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
          <PatientSelector patients={patients} value={patientId} onChange={setPatientId} />
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

  const storageKey = 'vet_custom_dog_toxins_v1'
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [customFoods, setCustomFoods] = useState<CustomToxin[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [newName, setNewName] = useState('')
  const [newRisk, setNewRisk] = useState<'CRÍTICO' | 'ALTO' | 'MODERADO'>('ALTO')
  const [newEffect, setNewEffect] = useState('')
  const [newAction, setNewAction] = useState('')

  const allFoods = useMemo(() => [
    ...DOG_TOXINS.map((item, index) => ({ ...item, id: `default-${index}`, custom: false })),
    ...customFoods.map(item => ({ ...item, custom: true })),
  ], [customFoods])

  const filtered = allFoods.filter(item =>
    `${item.name} ${item.risk} ${item.effect} ${item.action}`.toLowerCase().includes(query.trim().toLowerCase())
  )

  const persistCustomFoods = (next: CustomToxin[]) => {
    setCustomFoods(next)
    if (typeof window !== 'undefined') localStorage.setItem(storageKey, JSON.stringify(next))
  }

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newEffect.trim() || !newAction.trim()) return
    if (allFoods.some(item => item.name.trim().toLowerCase() === newName.trim().toLowerCase())) {
      alert('Esse alimento já está cadastrado na lista.')
      return
    }
    persistCustomFoods([...customFoods, {
      id: `custom-toxin-${Date.now()}`,
      name: newName.trim(),
      risk: newRisk,
      effect: newEffect.trim(),
      action: newAction.trim(),
    }])
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

  return (
    <div className="max-w-6xl mx-auto"><div className={cardClass}>
      <ModuleHeader icon={<AlertTriangle className="w-6 h-6" />} title="Consulta Rápida — Alimentos Tóxicos para Cães" subtitle="Banco ampliado de exposições alimentares + cadastro de novos itens" />
      <SafetyBanner>Em suspeita de intoxicação, a conduta depende de quantidade, concentração, peso, tempo desde a ingestão e estado clínico. Não induza vômito nem administre “antídotos caseiros” sem orientação veterinária. Esta tela é uma referência rápida e não substitui avaliação toxicológica individual.</SafetyBanner>

      <div className="flex flex-col md:flex-row gap-3 mt-5 mb-4">
        <div className="relative flex-1"><Search className="absolute left-3.5 top-3 w-4 h-4 text-pink-400" /><input value={query} onChange={e => setQuery(e.target.value)} className={`${inputClass} pl-10`} placeholder="Buscar xilitol, chocolate, uva, café, álcool, cogumelo..." /></div>
        <button type="button" onClick={() => setShowForm(v => !v)} className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {showForm ? 'Fechar cadastro' : 'Adicionar alimento'}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5 text-[10px]">
        <span className="font-bold text-stone-500">{allFoods.length} itens cadastrados</span>
        <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-800 font-bold">CRÍTICO</span>
        <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-800 font-bold">ALTO</span>
        <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">MODERADO</span>
        {customFoods.length > 0 && <span className="px-2 py-1 rounded-full bg-pink-100 text-pink-800 font-bold">+ {customFoods.length} personalizado{customFoods.length !== 1 ? 's' : ''}</span>}
      </div>

      {showForm && (
        <form onSubmit={handleAddFood} className="mb-6 bg-pink-50/70 border border-pink-200 rounded-2xl p-5 space-y-4">
          <div><h3 className="text-sm font-extrabold text-pink-950">➕ Adicionar novo alimento / exposição</h3><p className="text-[11px] text-stone-500 mt-1">O item personalizado fica salvo neste navegador e reaparece nas próximas consultas.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2"><label className={labelClass}>Alimento / produto</label><input value={newName} onChange={e => setNewName(e.target.value)} className={inputClass} placeholder="Nome do alimento ou produto" required /></div>
            <div><label className={labelClass}>Nível de risco</label><select value={newRisk} onChange={e => setNewRisk(e.target.value as any)} className={inputClass}><option value="CRÍTICO">CRÍTICO</option><option value="ALTO">ALTO</option><option value="MODERADO">MODERADO</option></select></div>
          </div>
          <div><label className={labelClass}>Toxicidade / principais efeitos</label><textarea rows={3} value={newEffect} onChange={e => setNewEffect(e.target.value)} className={inputClass} placeholder="Descreva os principais riscos e sinais clínicos..." required /></div>
          <div><label className={labelClass}>Conduta inicial / observações</label><textarea rows={3} value={newAction} onChange={e => setNewAction(e.target.value)} className={inputClass} placeholder="Descreva a conduta inicial ou o que deve ser avaliado..." required /></div>
          <div className="flex gap-2"><button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"><Save className="w-4 h-4" /> Salvar alimento</button><button type="button" onClick={() => setShowForm(false)} className="bg-white border border-stone-200 text-stone-600 px-4 py-2.5 rounded-xl text-xs font-bold">Cancelar</button></div>
        </form>
      )}

      {filtered.length === 0 ? <div className="bg-pink-50/50 border border-dashed border-pink-200 rounded-2xl py-10 text-center text-xs text-stone-500">Nenhum alimento encontrado. Limpe a busca ou cadastre um novo item.</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{filtered.map(item => <div key={item.id} className="bg-white border border-pink-200 rounded-2xl p-4 space-y-2"><div className="flex items-start justify-between gap-3"><div><h3 className="font-extrabold text-sm text-pink-950">{item.name}</h3>{item.custom && <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-pink-50 border border-pink-200 text-pink-700">PERSONALIZADO</span>}</div><div className="flex items-center gap-1.5"><span className={`text-[10px] font-extrabold px-2 py-1 rounded-full border ${riskClass(item.risk)}`}>{item.risk}</span>{item.custom && <button type="button" title="Excluir alimento personalizado" onClick={() => { if (confirm('Excluir este alimento personalizado?')) persistCustomFoods(customFoods.filter(x => x.id !== item.id)) }} className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>}</div></div><p className="text-xs text-stone-700 leading-relaxed"><strong>Efeito:</strong> {item.effect}</p><div className="bg-pink-50 rounded-xl p-3 text-[11px] text-pink-900 leading-relaxed"><strong>Conduta inicial:</strong> {item.action}</div></div>)}</div>
      )}
    </div></div>
  )
}

function HomeDiet({ patients, onAddTimelineEvent }: Pick<CanineNutritionFeatureProps, 'onAddTimelineEvent'> & { patients: ClinicalPatientLite[] }) {
  const [patientId, setPatientId] = useState('')
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
          <PatientSelector patients={patients} value={patientId} onChange={setPatientId} />
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
}: {
  patients: ClinicalPatientLite[]
  events: CalendarEventLite[]
  tasks: TaskLite[]
  onOpenPatient: (id: string) => void
  onResolveAlert?: (patientId: string, alertId: string) => void
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

  const nadirs = patients.flatMap(p => (p.timeline || []).filter(e => e.nadirStart && e.nadirEnd && (inNextSeven(e.nadirStart) || inNextSeven(e.nadirEnd))).map(e => ({ patient: p, event: e })))
  const returns = events.filter(e => inNextSeven(e.dateKey)).sort((a, b) => a.dateKey.localeCompare(b.dateKey))
  const alerts = patients.flatMap(p => (p.alerts || []).filter(a => !a.resolved).map(a => ({ patient: p, alert: a })))
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 5)

  return (
    <div className="bg-white/95 border border-pink-100 rounded-3xl shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between"><div><div className="text-[10px] font-extrabold uppercase tracking-widest text-pink-500">Visão clínica dos próximos 7 dias</div><h2 className="text-lg font-extrabold text-pink-950">Dashboard Assistencial</h2></div><span className="text-[10px] bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-bold">Atualização automática</span></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-4"><div className="font-extrabold text-xs text-rose-900 flex items-center gap-2"><Activity className="w-4 h-4" /> Nadir previsto ({nadirs.length})</div><div className="mt-3 space-y-2 max-h-44 overflow-y-auto">{nadirs.length === 0 ? <p className="text-[11px] text-stone-400">Nenhum nadir registrado para a semana.</p> : nadirs.map(({ patient, event }) => <button key={`${patient.id}-${event.id}`} type="button" onClick={() => onOpenPatient(patient.id)} className="w-full text-left bg-white border border-rose-100 rounded-xl p-2.5"><div className="text-xs font-bold text-pink-950">{patient.petName} • {event.chemoDrug || event.title}</div><div className="text-[10px] text-rose-700">{formatLocalDate(event.nadirStart!)} → {formatLocalDate(event.nadirEnd!)}</div></button>)}</div></div>
        <div className="bg-sky-50/60 border border-sky-200 rounded-2xl p-4"><div className="font-extrabold text-xs text-sky-900 flex items-center gap-2"><Stethoscope className="w-4 h-4" /> Retornos agendados ({returns.length})</div><div className="mt-3 space-y-2 max-h-44 overflow-y-auto">{returns.length === 0 ? <p className="text-[11px] text-stone-400">Nenhum retorno/evento nos próximos 7 dias.</p> : returns.map((e, idx) => <div key={`${e.dateKey}-${idx}`} className="bg-white border border-sky-100 rounded-xl p-2.5"><div className="text-xs font-bold text-pink-950">{e.title}</div><div className="text-[10px] text-sky-700">{formatLocalDate(e.dateKey)} {e.time ? `• ${e.time}` : ''}</div><div className="text-[10px] text-stone-500 truncate">{e.description}</div></div>)}</div></div>
        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4"><div className="font-extrabold text-xs text-amber-900 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Alertas pendentes ({alerts.length})</div><div className="mt-3 space-y-2 max-h-44 overflow-y-auto">{alerts.length === 0 ? <p className="text-[11px] text-stone-400">Nenhum alerta clínico pendente.</p> : alerts.map(({ patient, alert }) => <div key={alert.id} className="bg-white border border-amber-100 rounded-xl p-2.5"><button type="button" onClick={() => onOpenPatient(patient.id)} className="text-left w-full"><div className="text-xs font-bold text-pink-950">{patient.petName} • {alert.title}</div><div className="text-[10px] text-stone-500 line-clamp-2">{alert.message}</div></button>{onResolveAlert && <button type="button" onClick={() => onResolveAlert(patient.id, alert.id)} className="text-[10px] font-bold text-emerald-700 mt-1 hover:underline">Marcar como resolvido</button>}</div>)}</div></div>
      </div>
      {pendingTasks.length > 0 && <div className="border-t border-pink-100 pt-3 flex flex-wrap gap-2">{pendingTasks.map(t => <span key={t.id} className="text-[10px] bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full">☐ {t.text}</span>)}</div>}
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
    setCrmv(recipe.crmv)
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
          if (d.recipes) { setRecipes(d.recipes); localStorage.setItem('vet_recipes_v28', JSON.stringify(d.recipes)); }
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
          if (d.recipes) { setRecipes(d.recipes); localStorage.setItem('vet_recipes_v28', JSON.stringify(d.recipes)); }
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
    localStorage.setItem('vet_recipes_v28', JSON.stringify(recipes))
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
          recipes,
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
  }, [isInitialized, items, patients, recipes, customDrugs, monthlyIncome, cofrinhoAmount, finances, tasks, events, chatSessions, clinics, shifts, specialistConsultations, personalPets, skincareDone, mimosWishlist, descompressaoNotes])

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

          <button onClick={() => setActiveTab('receitas')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'receitas' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <FileText className="w-4 h-4" /> Receitas Veterinárias 🧾
          </button>

          <div className="pt-2 border-t border-pink-100/60 mt-2 space-y-1">
            <div className="px-3 py-1 text-[10px] font-extrabold text-pink-400 uppercase tracking-widest">🔬 Oncologia Avançada</div>
            <button onClick={() => setActiveTab('labref')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'labref' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <FlaskConical className="w-4 h-4" /> Guia de Parâmetros Laboratoriais
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
              />
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
                    <p className="text-xs text-pink-500 font-medium">Selecione a clínica onde o atendimento foi realizado, cadastre a especialidade e o valor. Integrado automaticamente com as finanças.</p>
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
                        <p className="text-[11px] text-stone-500 mt-1">Este valor soma automaticamente nas suas finanças totais ("por fora").</p>
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
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm"><FlaskConical className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-base font-extrabold text-pink-950">🔬 Guia Rápido de Parâmetros Laboratoriais</h2>
                    <p className="text-xs text-pink-500 font-medium">Valores de referência de hemograma e bioquímicos para cães e gatos — consulta rápida para cruzar com os prontuários</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* HEMOGRAMA */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold text-pink-900 uppercase tracking-wider flex items-center gap-1.5">🩸 Hemograma Completo</h3>
                    <div className="overflow-hidden rounded-2xl border border-pink-100">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-pink-50">
                            <th className="px-3 py-2.5 text-left font-extrabold text-pink-900">Parâmetro</th>
                            <th className="px-3 py-2.5 text-left font-extrabold text-pink-700">🐕 Cão</th>
                            <th className="px-3 py-2.5 text-left font-extrabold text-pink-700">🐈 Gato</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-pink-50">
                          {[
                            ['Eritrócitos (x10⁶/µL)', '5,5 – 8,5', '5,0 – 10,0'],
                            ['Hemoglobina (g/dL)', '12 – 18', '8 – 15'],
                            ['Hematócrito (%)', '37 – 55', '24 – 45'],
                            ['VGM (fL)', '60 – 77', '39 – 55'],
                            ['CHGM (g/dL)', '32 – 36', '30 – 36'],
                            ['Leucócitos (x10³/µL)', '6 – 17', '5,5 – 19,5'],
                            ['Neutrófilos Segm. (%)', '60 – 77', '35 – 75'],
                            ['Neutrófilos Bastão (%)', '0 – 3', '0 – 3'],
                            ['Linfócitos (%)', '12 – 30', '20 – 55'],
                            ['Monócitos (%)', '3 – 10', '1 – 4'],
                            ['Eosinófilos (%)', '2 – 10', '2 – 12'],
                            ['Plaquetas (x10³/µL)', '200 – 500', '300 – 700'],
                          ].map(([param, cao, gato], i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-pink-50/30'}>
                              <td className="px-3 py-2 font-semibold text-stone-700">{param}</td>
                              <td className="px-3 py-2 text-pink-800 font-bold">{cao}</td>
                              <td className="px-3 py-2 text-pink-600 font-bold">{gato}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* BIOQUÍMICOS */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold text-pink-900 uppercase tracking-wider flex items-center gap-1.5">🧪 Bioquímicos (ALT, FA, Creatinina, Ureia, Eletrólitos)</h3>
                    <div className="overflow-hidden rounded-2xl border border-pink-100">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-pink-50">
                            <th className="px-3 py-2.5 text-left font-extrabold text-pink-900">Parâmetro</th>
                            <th className="px-3 py-2.5 text-left font-extrabold text-pink-700">🐕 Cão</th>
                            <th className="px-3 py-2.5 text-left font-extrabold text-pink-700">🐈 Gato</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-pink-50">
                          {[
                            ['ALT / TGP (U/L)', '10 – 88', '12 – 130'],
                            ['AST / TGO (U/L)', '0 – 50', '0 – 48'],
                            ['Fosfatase Alcalina (U/L)', '20 – 150', '14 – 111'],
                            ['GGT (U/L)', '0 – 14', '0 – 4'],
                            ['Bilirrubina Total (mg/dL)', '0,1 – 0,6', '0,15 – 0,5'],
                            ['Creatinina (mg/dL)', '0,5 – 1,5', '0,8 – 1,8'],
                            ['Ureia (mg/dL)', '21 – 60', '30 – 65'],
                            ['Sódio (mEq/L)', '140 – 155', '145 – 158'],
                            ['Potássio (mEq/L)', '3,5 – 5,8', '3,5 – 5,8'],
                            ['Cloro (mEq/L)', '105 – 122', '107 – 129'],
                            ['Cálcio Total (mg/dL)', '7,9 – 12,0', '7,5 – 11,3'],
                            ['Fósforo (mg/dL)', '2,5 – 6,8', '2,4 – 8,2'],
                            ['Glicose (mg/dL)', '70 – 138', '63 – 170'],
                            ['Albumina (g/dL)', '2,6 – 4,0', '2,1 – 4,0'],
                            ['Proteína Total (g/dL)', '5,0 – 7,4', '5,0 – 8,8'],
                          ].map(([param, cao, gato], i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-pink-50/30'}>
                              <td className="px-3 py-2 font-semibold text-stone-700">{param}</td>
                              <td className="px-3 py-2 text-pink-800 font-bold">{cao}</td>
                              <td className="px-3 py-2 text-pink-600 font-bold">{gato}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Cruzamento com Pacientes */}
                <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-2">
                  <div className="font-extrabold text-amber-900 flex items-center gap-2 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Interpretação Oncológica Rápida
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                    {[
                      { param: 'Neutrófilos < 1.500/µL', label: 'Neutropenia Grave', action: 'Adiar quimioterapia. Iniciar antibioticoprofilaxia. Repetir hemograma em 48h.' },
                      { param: 'Plaquetas < 50.000/µL', label: 'Trombocitopenia Grave', action: 'Suspender QT. Avaliar sangramento. Considerar transfusão.' },
                      { param: 'ALT > 3x valor normal', label: 'Hepatotoxicidade', action: 'Reduzir dose de Lomustina/Clorambucil em 25-50%. Reavaliar com hepatoprotetor.' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white border border-amber-200 p-3 rounded-xl text-xs space-y-1">
                        <div className="font-extrabold text-amber-900">{item.param}</div>
                        <div className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold inline-block">{item.label}</div>
                        <p className="text-stone-700 leading-relaxed">{item.action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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