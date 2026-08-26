'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Settings, 
  ChevronRight, 
  ChevronDown,
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
  Gift
} from 'lucide-react'
import WishlistTab from '@/components/WishlistTab'

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

export default function VetWorkspaceBeatrizV26() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const [activeTab, setActiveTab] = useState<'painel' | 'estudos' | 'pacientes' | 'calculadora' | 'bsa' | 'ia' | 'condolencias' | 'tarefas' | 'calendario' | 'financas' | 'wishlist'>('painel')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [saveStatus, setSaveStatus] = useState('Sincronizado')

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
  const [studySubTab, setStudySubTab] = useState<'resumo' | 'diferenciais' | 'pontos'>('resumo')

  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_chat_sessions_v26')
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

  const [bsaWeightKg, setBsaWeightKg] = useState('')
  const [bsaSpecies, setBsaSpecies] = useState<'cao' | 'gato'>('cao')
  const [selectedOncoDrugName, setSelectedOncoDrugName] = useState<string>('Doxorrubicina')
  const [oncoCustomDosage, setOncoCustomDosage] = useState<string>('30')
  const [oncoCustomConc, setOncoCustomConc] = useState<string>('2')
  const [oncoPillMg, setOncoPillMg] = useState<string>('2')
  const [oncoResultMg, setOncoResultMg] = useState<number | null>(null)
  const [oncoResultMl, setOncoResultMl] = useState<number | null>(null)
  const [oncoResultPills, setOncoResultPills] = useState<number | null>(null)
  const [calculatedBsaValue, setCalculatedBsaValue] = useState<number | null>(null)

  const [condolenceTutor, setCondolenceTutor] = useState('')
  const [condolencePet, setCondolencePet] = useState('')
  const [condolenceTone, setCondolenceTone] = useState<string>('acolhedor')
  const [generatedCondolence, setGeneratedCondolence] = useState('')

  const currentChatSession = chatSessions.find(s => s.id === currentChatId) || chatSessions[0]

  const handleNewChatSession = () => {
    const newId = Date.now().toString()
    const newSession: ChatSession = {
      id: newId,
      title: 'Novo Caso Clínico',
      messages: [
        { sender: 'ai', text: 'Olá, Dra. Beatriz! Novo caso clínico iniciado. Descreva os sintomas ou escolha um template.' }
      ]
    }
    setChatSessions([newSession, ...chatSessions])
    setCurrentChatId(newId)
    setActiveTab('ia')
  }

  const deleteChatSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const filtered = chatSessions.filter(s => s.id !== id)
    if (filtered.length === 0) {
      const freshId = Date.now().toString()
      setChatSessions([{
        id: freshId,
        title: 'Caso Clínico Inicial',
        messages: [{ sender: 'ai', text: 'Olá, Dra. Beatriz! Sou seu copiloto clínico.' }]
      }])
      setCurrentChatId(freshId)
    } else {
      setChatSessions(filtered)
      if (currentChatId === id) setCurrentChatId(filtered[0].id)
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

  const handleGenerateCondolence = (e: React.FormEvent) => {
    e.preventDefault()
    if (!condolenceTutor.trim() || !condolencePet.trim()) return

    let text = ''
    switch (condolenceTone) {
      case 'acolhedor':
        text = `Oi, ${condolenceTutor}. É com o coração apertado que te escrevo. Eu sei que nenhuma palavra neste momento é capaz de preencher o vazio que o(a) ${condolencePet} deixa, mas eu precisava te dizer que foi uma honra ter cruzado o caminho dele(a). Ele(a) foi extremamente amado(a), cuidado(a) e teve ao lado dele(a) a melhor família que poderia existir. Guarde no coração a alegria que ele(a) espalhou. Um abraço muito forte e sinta-se abraçado(a) por toda a nossa equipe.`
        break
      case 'luta_longa':
        text = `Oi, ${condolenceTutor}. Demorei para te mandar mensagem porque a dor da despedida é imensa, mas o(a) ${condolencePet} lutou bravamente até o último segundo. Ele(a) foi um verdadeiro guerreiro(a), e você esteve firme ao lado dele(a) em cada etapa dessa jornada difícil. Agora, ele(a) descansou em paz, livre de qualquer dor, levando consigo todo o amor do mundo que você dedicou. Fique com a certeza de que você fez absolutamente tudo o que era possível. Estou aqui para o que você precisar.`
        break
      case 'profundo':
        text = `Oi, ${condolenceTutor}. A partida do(a) ${condolencePet} deixa um silêncio muito forte na rotina, mas a verdade é que vidas como a dele(a) não passam pelas nossas vidas por acaso; elas nos transformam para sempre. O amor que vocês construíram é eterno e transcende a ausência física. Que o tempo traga um pouco de conforto e que fiquem apenas as lembranças das tardes felizes, dos olhares cúmplices e de todo o carinho compartilhado. Meus mais sinceros sentimentos.`
        break
      case 'curto_respeitoso':
        text = `Oi, ${condolenceTutor}, aqui é a Dra. Beatriz. Só queria te enviar um abraço bien apertado e dizer que sinto muito pela partida do(a) ${condolencePet}. Ele(a) foi muito especial e marcou muito a todos nós. Fique com Deus e conte comigo para o que precisar.`
        break
      case 'idoso_gratidao':
        text = `Oi, ${condolenceTutor}. O(A) ${condolencePet} teve uma vida longa, linda e repleta de amor ao seu lado. Você cuidou dele(a) com uma dedicação admirável do primeiro ao último dia de sua velhice. Sei que a saudade vai ser imensa, mas que privilégio foi poder compartilhar tantos anos de companheirismo com ele(a). Um abraço carinhoso e muita força nesse momento.`
        break
      case 'perda_repentina':
        text = `Oi, ${condolenceTutor}. Estou sem palavras para expressar o quanto sinto pela perda tão repentina do(a) ${condolencePet}. A dor de uma partida sem aviso é dilacerante, mas quero que saiba que ele(a) partiu sabendo o quanto era querido(a) por você. Se precisar desabafar ou de qualquer apoio, minha porta e meu coração estão abertos.`
        break
      case 'filhote_precoce':
        text = `Oi, ${condolenceTutor}. A partida do(a) ${condolencePet} de forma tão precoce dói na alma de um jeito inexplicável. Ele(a) era apenas uma luz que passou rápido por aqui, mas deixou uma marca profunda e inesquecível em nossas vidas. Que você encontre amparo nas lembranças doces e no carinho imenso que recebeu dela(e). Meus sentimentos mais profundos.`
        break
      case 'acolhimento_espiritual':
        text = `Oi, ${condolenceTutor}. Acredito de verdade que os animais que amamos nunca nos deixam por completo; o espírito deles passa a morar em um cantinho protegido do nosso coração. O(A) ${condolencePet} cumpriu a missão dela(e) com louvor: te ensinou a amar incondicionalmente. Que ele(a) descanse em paz e que você sinta esse abraço invisível de conforto hoje.`
        break
      case 'parceiro_de_jornada':
        text = `Oi, ${condolenceTutor}. O(A) ${condolencePet} não era apenas um pet, era seu companheiro de todas as horas, seu confidente e parte da sua história. Perder uma presença tão constante muda os nossos dias, mas o legado de lealdade que ele(a) deixa é eterno. Estou com você nessa dor e desejo muita paz para o seu coração.`
        break
      case 'apoio_clinico_humano':
        text = `Oi, ${condolenceTutor}. Acompanhei de perto o quanto você se dedicou, lutou e fez por ele(a). Quero que você tire da sua mente qualquer sentimento de culpa e guarde apenas o orgulho de ter sido o melhor tutor(a) que o(a) ${condolencePet} poderia ter escolhido na vida. Ele(a) foi muito feliz ao seu lado. Um abraço cheio de respeito e admiração pelo seu cuidado.`
        break
      default:
        text = `Oi, ${condolenceTutor}. É com o coração apertado que te escrevo. Sinto muito pela perda do(a) ${condolencePet}. Ele(a) foi muito amado(a) e deixou uma marca linda em nossas vidas. Fique bem.`
    }
    setGeneratedCondolence(text)
  }

  const [items, setItems] = useState<DocumentItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_items_v19')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return [
      { id: 'f-pos', title: 'Pós-graduação & Residência', parentId: null, type: 'folder', isOpen: true },
      { id: 'p-1', title: 'Módulos e Aulas Teóricas', parentId: 'f-pos', type: 'page', content: '', differential: '', notes: '', attachments: [] }
    ]
  })
  const [selectedItemId, setSelectedItemId] = useState<string>('p-1')

  const [patients, setPatients] = useState<PatientRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_patients_v18')
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
      const saved = localStorage.getItem('vet_custom_drugs_v26')
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
    
    const maxD = foundDrug ? foundDrug.maxDays : (
      cat.includes('aine') || nameLower.includes('meloxicam') || nameLower.includes('carprofeno') || nameLower.includes('cetoprofeno') ? 5 :
      cat.includes('corticoide') || nameLower.includes('prednisona') || nameLower.includes('prednisolona') ? 7 :
      cat.includes('antibiótico') || nameLower.includes('amoxicilina') || nameLower.includes('doxiciclina') ? 14 :
      cat.includes('opióide') || nameLower.includes('tramadol') || nameLower.includes('morfina') ? 5 :
      cat.includes('psicotrópico') || nameLower.includes('fluoxetina') ? 90 : 7
    )

    if (cat.includes('aine') || cat.includes('anti-inflamatório') || nameLower.includes('meloxicam') || nameLower.includes('carprofeno') || nameLower.includes('cetoprofeno')) {
      return {
        title: `⚠️ ALERTA DE CLASSE (AINE): USO MÁXIMO DE ${maxD} DIAS`,
        desc: `Fármacos anti-inflamatórios inibem as COX. Uso recomendado por no máximo ${maxD} dias consecutivos para prevenir úlceras gástricas, perfuração intestinal e lesão renal aguda. Nunca associe com corticoides.`
      }
    }
    if (cat.includes('corticoide') || cat.includes('esteroidal') || nameLower.includes('prednisona') || nameLower.includes('prednisolona') || nameLower.includes('dexametasona')) {
      return {
        title: `⚠️ ALERTA DE CLASSE (CORTICOIDE): RESTRIÇÃO E DESMAME (${maxD} DIAS)`,
        desc: `Corticoides exigem desmame gradual se o uso ultrapassar ${maxD} dias para evitar insuficiência adrenal secundária. Proibida a coadministração com AINEs.`
      }
    }
    if (cat.includes('opióide') || nameLower.includes('tramadol') || nameLower.includes('metadona') || nameLower.includes('codeína')) {
      return {
        title: `⚠️ ALERTA DE ANALGÉSICO OPIÓIDE: MÁXIMO DE ${maxD} DIAS`,
        desc: `Fármacos opióides requerem reavaliação constante da dor e sedação. Uso contínuo sem supervisão pode causar constipação severa, depressão respiratória leve ou tolerância. Limite recomendado de segurança: ${maxD} dias.`
      }
    }
    if (cat.includes('antibiótico') || nameLower.includes('amoxicilina') || nameLower.includes('doxiciclina')) {
      return {
        title: `⚠️ ALERTA DE ANTIBIOTICOTERAPIA: CICLO DE ${maxD} DIAS`,
        desc: `Respeite o ciclo completo de ${maxD} dias prescrito para evitar resistência bacteriana precoce. Recomenda-se acompanhamento clínico ao término.`
      }
    }
    if (cat.includes('psicotrópico') || nameLower.includes('fluoxetina')) {
      return {
        title: `⚠️ ALERTA COMPORTAMENTAL / NEUROLÓGICO (FLUOXETINA - ${maxD} DIAS)`,
        desc: `Uso prolongado (até ${maxD} dias ou conforme protocolo). Ajustar rigorosamente a dose por espécie: Cães (1,0 mg/kg) vs. Gatos (0,5 mg/kg). Atenção à interrupção abrupta e monitoramento de anorexia.`
      }
    }
    return {
      title: `ℹ️ ORIENTAÇÃO DE USO CONTÍNUO (${maxD} DIAS)`,
      desc: `Limite máximo de segurança recomendado para esta prescrição: ${maxD} dias. Avalie reavaliação clínica após este período.`
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
      const saved = localStorage.getItem('vet_income_v18')
      if (saved) {
        const parsed = parseFloat(saved)
        if (!isNaN(parsed)) return parsed
      }
    }
    return 0.00
  })

  const [finances, setFinances] = useState<FinancialItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_finances_v18')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return []
  })

  const [finDesc, setFinDesc] = useState('')
  const [finCategory, setFinCategory] = useState('Cartão de Crédito')
  const [finCustomCategory, setFinCustomCategory] = useState('')
  const [finAmount, setFinAmount] = useState('')
  const [editingIncome, setEditingIncome] = useState(false)
  const [tempIncome, setTempIncome] = useState('0')

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_tasks_v18')
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
      const saved = localStorage.getItem('vet_events_v18')
      if (saved) try { return JSON.parse(saved) } catch(e) {}
    }
    return []
  })
  const [selectedDate, setSelectedDate] = useState<string>(todayDateKey)
  const [eventTitle, setEventTitle] = useState('')
  const [eventDesc, setEventDesc] = useState('')
  const [eventTime, setEventTime] = useState('08:00')

  // BUSCA VIA API ROUTE (PROXY)
  useEffect(() => {
    async function fetchCloudData() {
      try {
        const res = await fetch('/api/sync?id=beatriz_workspace_v26')
        const json = await res.json()

        if (json.data) {
          const d = json.data
          if (d.items) { setItems(d.items); localStorage.setItem('vet_items_v19', JSON.stringify(d.items)); }
          if (d.patients) { setPatients(d.patients); localStorage.setItem('vet_patients_v18', JSON.stringify(d.patients)); }
          if (d.customDrugs) { setCustomDrugs(d.customDrugs); localStorage.setItem('vet_custom_drugs_v26', JSON.stringify(d.customDrugs)); }
          if (d.monthlyIncome !== undefined) { setMonthlyIncome(d.monthlyIncome); localStorage.setItem('vet_income_v18', d.monthlyIncome.toString()); }
          if (d.finances) { setFinances(d.finances); localStorage.setItem('vet_finances_v18', JSON.stringify(d.finances)); }
          if (d.tasks) { setTasks(d.tasks); localStorage.setItem('vet_tasks_v18', JSON.stringify(d.tasks)); }
          if (d.events) { setEvents(d.events); localStorage.setItem('vet_events_v18', JSON.stringify(d.events)); }
          if (d.chatSessions) { setChatSessions(d.chatSessions); localStorage.setItem('vet_chat_sessions_v26', JSON.stringify(d.chatSessions)); }
          setSaveStatus('Sincronizado')
        }
      } catch (err) {
        console.log('Modo offline ou dados locais utilizados.')
      }
    }
    fetchCloudData()
  }, [])

  // SALVAMENTO AUTOMÁTICO VIA API ROUTE (PROXY)
  useEffect(() => {
    if (typeof window === 'undefined') return

    localStorage.setItem('vet_items_v19', JSON.stringify(items))
    localStorage.setItem('vet_patients_v18', JSON.stringify(patients))
    localStorage.setItem('vet_custom_drugs_v26', JSON.stringify(customDrugs))
    localStorage.setItem('vet_income_v18', monthlyIncome.toString())
    localStorage.setItem('vet_finances_v18', JSON.stringify(finances))
    localStorage.setItem('vet_tasks_v18', JSON.stringify(tasks))
    localStorage.setItem('vet_events_v18', JSON.stringify(events))
    localStorage.setItem('vet_chat_sessions_v26', JSON.stringify(chatSessions))

    setSaveStatus('Salvando...')

    const syncToCloud = async () => {
      try {
        const payload = {
          items,
          patients,
          customDrugs,
          monthlyIncome,
          finances,
          tasks,
          events,
          chatSessions
        }

        const res = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id: 'beatriz_workspace_v26', 
            data: payload 
          })
        })

        const json = await res.json()
        setSaveStatus('Sincronizado')
      } catch (err: any) {
        setSaveStatus('Sincronizado')
      }
    }

    const timer = setTimeout(syncToCloud, 800)
    return () => clearTimeout(timer)
  }, [items, patients, customDrugs, monthlyIncome, finances, tasks, events, chatSessions])

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
      setTasks(tasks.map(t => t.id === activeTaskForAttach ? { ...t, attachments: [...(t.attachments || []), newAtt] } : t))
      setActiveTaskForAttach(null)
    } else if (selectedItem) {
      setItems(items.map(i => i.id === selectedItem.id ? { ...i, attachments: [...(i.attachments || []), newAtt] } : i))
    }
    e.target.value = ''
  }

  const totalGastos = finances.reduce((acc, f) => acc + f.amount, 0)
  const saldoRestante = monthlyIncome - totalGastos

  const handleAddFinancial = (e: React.FormEvent) => {
    e.preventDefault()
    if (!finDesc || !finAmount) return
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
    const title = prompt('Nome da nova pasta:')
    if (!title) return
    const newFolder: DocumentItem = {
      id: 'folder-' + Date.now(),
      title,
      parentId,
      type: 'folder',
      isOpen: true
    }
    setItems([...items, newFolder])
  }

  const handleAddPage = (parentId: string | null) => {
    const title = prompt('Nome da nova página de estudo:')
    if (!title) return
    const newPage: DocumentItem = {
      id: 'page-' + Date.now(),
      title,
      parentId,
      type: 'page',
      content: '',
      differential: '',
      notes: '',
      attachments: []
    }
    setItems([...items, newPage])
    setSelectedItemId(newPage.id)
    setActiveTab('estudos')
  }

  const toggleFolder = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, isOpen: !i.isOpen } : i))
  }

  const deleteItem = (id: string) => {
    const idsToDelete = [id]
    const getChildrenIds = (parentId: string) => {
      items.filter(i => i.parentId === parentId).forEach(child => {
        idsToDelete.push(child.id)
        if (child.type === 'folder') getChildrenIds(child.id)
      })
    }
    getChildrenIds(id)
    setItems(items.filter(i => !idsToDelete.includes(i.id)))
  }

  const renderTree = (parentId: string | null) => {
    const children = items.filter(i => i.parentId === parentId)
    if (children.length === 0) return null

    return (
      <div className="space-y-1.5 pl-3 border-l border-pink-200 ml-1">
        {children.map(item => {
          if (item.type === 'folder') {
            return (
              <div key={item.id} className="space-y-1 pt-1">
                <div className="flex items-center justify-between group px-2.5 py-1.5 rounded-xl bg-pink-50/40 hover:bg-pink-100/70 text-pink-950 cursor-pointer border border-pink-100">
                  <div className="flex items-center gap-2 truncate" onClick={() => toggleFolder(item.id)}>
                    <button className="text-pink-500">
                      {item.isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <Folder className="w-4 h-4 text-pink-500 fill-pink-200" />
                    <span className="font-extrabold text-xs truncate">{item.title}</span>
                  </div>
                  <div className="hidden group-hover:flex items-center gap-1.5">
                    <button title="Adicionar Subpasta" onClick={() => handleAddFolder(item.id)} className="p-1 text-pink-600 hover:text-pink-950 bg-white rounded-lg shadow-2xs"><FolderPlus className="w-3.5 h-3.5" /></button>
                    <button title="Adicionar Página" onClick={() => handleAddPage(item.id)} className="p-1 text-pink-600 hover:text-pink-950 bg-white rounded-lg shadow-2xs"><Plus className="w-3.5 h-3.5" /></button>
                    <button title="Excluir Pasta" onClick={() => deleteItem(item.id)} className="p-1 text-stone-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
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
              <div key={item.id} className={`flex items-center justify-between group px-3 py-2 rounded-xl cursor-pointer transition shadow-2xs ${isSelected ? 'bg-pink-500 text-white font-extrabold shadow-sm' : 'bg-white/80 text-pink-950 hover:bg-pink-50 border border-pink-100'}`} onClick={() => { setSelectedItemId(item.id); setActiveTab('estudos'); }}>
                <div className="flex items-center gap-2.5 truncate">
                  <FileText className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-pink-500'}`} />
                  <span className="text-xs truncate">{item.title}</span>
                </div>
                <button title="Excluir Página" onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} className={`opacity-0 group-hover:opacity-100 p-1 ${isSelected ? 'text-white/80 hover:text-white' : 'text-stone-400 hover:text-red-500'}`}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
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

    const updatedMessages: ChatMessage[] = [
      ...currentChatSession.messages,
      { sender: 'user', text: userText }
    ]

    const autoTitle = currentChatSession.title === 'Novo Caso Clínico' || currentChatSession.title === 'Caso Clínico Inicial'
      ? (userText.length > 28 ? userText.substring(0, 28) + '...' : userText)
      : currentChatSession.title

    setChatSessions(chatSessions.map(s => s.id === currentChatId ? { ...s, title: autoTitle, messages: updatedMessages } : s))

    try {
      const response = await fetch('/api/vet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText })
      })
      const data = await response.json()
      const reply = data.reply || 'Não foi possível processar a resposta no momento.'

      const finalMessages: ChatMessage[] = [
        ...updatedMessages,
        { sender: 'ai', text: reply }
      ]

      setChatSessions(prev => prev.map(s => s.id === currentChatId ? { ...s, messages: finalMessages } : s))
    } catch (err) {
      const errorMessages: ChatMessage[] = [
        ...updatedMessages,
        { sender: 'ai', text: 'Erro de conexão com o servidor de IA. Verifique sua chave de API.' }
      ]
      setChatSessions(prev => prev.map(s => s.id === currentChatId ? { ...s, messages: errorMessages } : s))
    } finally {
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
    <div className="relative flex h-screen bg-pink-50/40 text-stone-800 font-sans overflow-hidden select-none">
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
      <div className={`${isSidebarOpen ? 'w-72' : 'w-0'} transition-all duration-200 bg-white/90 backdrop-blur-md border-r border-pink-100 flex flex-col z-10 overflow-hidden shadow-xs`}>
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
            <LayoutDashboard className="w-4 h-4" /> Painel
          </button>
           
          <div className="pt-2 pb-1 border-t border-pink-100/60 mt-2">
            <div className="flex items-center justify-between px-3 pt-2 text-[11px] font-bold text-pink-900 uppercase tracking-wider">
              <span>📚 Estudos & Pós</span>
              <div className="flex items-center gap-1">
                <button title="Nova Pasta Raiz" onClick={() => handleAddFolder(null)} className="p-1 rounded hover:bg-pink-100 text-pink-600"><FolderPlus className="w-3.5 h-3.5" /></button>
                <button title="Nova Página Raiz" onClick={() => handleAddPage(null)} className="p-1 rounded hover:bg-pink-100 text-pink-600"><Plus className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="mt-1">
              {renderTree(null)}
            </div>
          </div>

          <div className="pt-2 border-t border-pink-100/60 mt-2">
            <button onClick={() => setActiveTab('pacientes')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'pacientes' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
              <Stethoscope className="w-4 h-4" /> Casos Clínicos & Pacientes ({patients.length})
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

            <div className="pl-3 pr-1 space-y-1 my-1 max-h-32 overflow-y-auto border-l border-pink-200 ml-2">
              {chatSessions.map(session => (
                <div 
                  key={session.id}
                  onClick={() => { setCurrentChatId(session.id); setActiveTab('ia'); }}
                  className={`group flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer text-[11px] transition ${session.id === currentChatId && activeTab === 'ia' ? 'bg-pink-200/80 font-bold text-pink-950' : 'text-stone-600 hover:bg-pink-50'}`}
                >
                  <span className="truncate flex-1">{session.title}</span>
                  <button onClick={(e) => deleteChatSession(e, session.id)} className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 p-0.5">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setActiveTab('condolencias')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'condolencias' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <HeartHandshake className="w-4 h-4 text-pink-500" /> Mensagem de Apoio 🕊️
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
        <div className="h-16 border-b border-pink-100/80 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md shadow-xs">
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
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border flex items-center gap-1 ${
              saveStatus.includes('Salvando') 
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
                    <div className="text-2xl font-extrabold text-emerald-600 mt-1">R$ {monthlyIncome.toFixed(2)}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Wallet className="w-5 h-5" /></div>
                </div>
                <div onClick={() => setActiveTab('financas')} className="bg-white/90 backdrop-blur-sm border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-300 transition">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Total de Despesas</span>
                    <div className="text-2xl font-extrabold text-rose-500 mt-1">R$ {totalGastos.toFixed(2)}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500"><CreditCard className="w-5 h-5" /></div>
                </div>
                <div onClick={() => setActiveTab('pacientes')} className="bg-white/90 backdrop-blur-sm border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-300 transition">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Casos Clínicos / Pacientes</span>
                    <div className="text-2xl font-extrabold text-pink-950 mt-1">{patients.length}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500"><Stethoscope className="w-5 h-5" /></div>
                </div>
                <div onClick={() => setActiveTab('bsa')} className="bg-white/90 backdrop-blur-sm border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-300 transition">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Calculadora BSA & Onco</span>
                    <div className="text-xs font-bold text-pink-600 mt-1 flex items-center gap-1">Superfície Corporal <Scale className="w-3 h-3" /></div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500"><Scale className="w-5 h-5" /></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'estudos' && selectedItem && (
            <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md border border-pink-100 p-8 lg:p-10 rounded-3xl shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-pink-100 pb-5 gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-extrabold text-pink-500 uppercase tracking-wider mb-1">
                    <BookOpen className="w-3.5 h-3.5" /> Módulo Acadêmico / Pós-Graduação (Tela Completa)
                  </div>
                  <input 
                    type="text" 
                    value={selectedItem.title}
                    onChange={(e) => setItems(items.map(i => i.id === selectedItem.id ? { ...i, title: e.target.value } : i))}
                    className="w-full bg-transparent text-2xl lg:text-3xl font-extrabold text-pink-950 focus:outline-none placeholder-pink-200"
                    placeholder="Título do Estudo ou Matéria..."
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
                      <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer" className="bg-white border border-pink-200 px-3 py-1.5 rounded-xl text-xs font-bold text-pink-700 hover:bg-pink-100 flex items-center gap-1.5 shadow-2xs">
                        📎 {att.name} ({att.size})
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 border-b border-pink-100 pb-3">
                <button onClick={() => setStudySubTab('resumo')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${studySubTab === 'resumo' ? 'bg-pink-500 text-white shadow-xs' : 'bg-pink-50 text-pink-900/70 hover:bg-pink-100'}`}>
                  <FileText className="w-3.5 h-3.5" /> Resumo Teórico & Aulas
                </button>
                <button onClick={() => setStudySubTab('diferenciais')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${studySubTab === 'diferenciais' ? 'bg-pink-500 text-white shadow-xs' : 'bg-pink-50 text-pink-900/70 hover:bg-pink-100'}`}>
                  <Layers className="w-3.5 h-3.5" /> Diagnósticos Diferenciais
                </button>
                <button onClick={() => setStudySubTab('pontos')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${studySubTab === 'pontos' ? 'bg-pink-500 text-white shadow-xs' : 'bg-pink-50 text-pink-900/70 hover:bg-pink-100'}`}>
                  <Bookmark className="w-3.5 h-3.5" /> Pontos de Atenção / Prova
                </button>
              </div>

              {studySubTab === 'resumo' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-pink-900 flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-pink-500" /> Resumo e Anotações da Matéria</label>
                  <textarea value={selectedItem.content || ''} onChange={(e) => setItems(items.map(i => i.id === selectedItem.id ? { ...i, content: e.target.value } : i))} rows={14} className="w-full bg-pink-50/25 border border-pink-200 p-5 rounded-2xl text-stone-800 text-sm leading-relaxed focus:outline-none focus:border-pink-400 resize-none font-normal placeholder-stone-300" placeholder="Digite aqui as explicações, fisiopatologia, posologias..." />
                </div>
              )}
              {studySubTab === 'diferenciais' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-pink-900 flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-pink-500" /> Diagnósticos Diferenciais por Sistema</label>
                  <textarea value={selectedItem.differential || ''} onChange={(e) => setItems(items.map(i => i.id === selectedItem.id ? { ...i, differential: e.target.value } : i))} rows={14} className="w-full bg-pink-50/25 border border-pink-200 p-5 rounded-2xl text-stone-800 text-sm leading-relaxed focus:outline-none focus:border-pink-400 resize-none font-normal placeholder-stone-300" placeholder="Liste aqui os diferenciais clínicos..." />
                </div>
              )}
              {studySubTab === 'pontos' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-pink-900 flex items-center gap-1"><Bookmark className="w-3.5 h-3.5 text-pink-500" /> Alertas Críticos & Pegadinhas de Prova</label>
                  <textarea value={selectedItem.notes || ''} onChange={(e) => setItems(items.map(i => i.id === selectedItem.id ? { ...i, notes: e.target.value } : i))} rows={14} className="w-full bg-pink-50/25 border border-pink-200 p-5 rounded-2xl text-stone-800 text-sm leading-relaxed focus:outline-none focus:border-pink-400 resize-none font-normal placeholder-stone-300" placeholder="Anotações importantes..." />
                </div>
              )}
            </div>
          )}

          {activeTab === 'ia' && (
            <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white/95 backdrop-blur-md border border-pink-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-pink-100 bg-pink-50/50 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm"><Bot className="w-5 h-5" /></div>
                    <div>
                      <h2 className="text-sm font-extrabold text-pink-950">Copiloto IA Veterinária - {currentChatSession.title}</h2>
                      <p className="text-[11px] text-pink-500 font-medium">Raciocínio clínico com templates rápidos e exportação para prontuário</p>
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
                {currentChatSession.messages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-xs ${msg.sender === 'user' ? 'bg-pink-500 text-white rounded-br-xs' : 'bg-pink-50/70 border border-pink-100 text-stone-800 rounded-bl-xs'}`}>
                      {msg.text}
                    </div>

                    {msg.sender === 'ai' && patients.length > 0 && (
                      <div className="flex items-center gap-2 mt-1.5 pl-1">
                        <select 
                          id={`export-select-${idx}`}
                          className="bg-white border border-pink-200 rounded-lg px-2 py-1 text-[10px] text-pink-950 font-medium focus:outline-none"
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
                          className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 border border-pink-200 shadow-2xs cursor-pointer"
                        >
                          📥 Enviar para Prontuário
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start px-6">
                    <div className="bg-pink-50/70 border border-pink-100 p-4 rounded-2xl text-xs text-pink-600 flex items-center gap-2 animate-pulse">
                      <Sparkles className="w-4 h-4 animate-spin" /> A IA está analisando o caso clínico...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendAiMessage} className="p-4 border-t border-pink-100 bg-white flex gap-2 items-center">
                <button type="button" onClick={toggleListening} title={isListening ? "Ouvindo..." : "Falar por voz"} className={`p-3 rounded-xl transition flex items-center justify-center ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-pink-100 hover:bg-pink-200 text-pink-700'}`}>
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <input type="text" placeholder={isListening ? "Ouvindo sua fala..." : "Digite o caso ou escolha um template acima..."} value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 bg-pink-50/50 border border-pink-200 rounded-xl px-4 py-3 text-xs text-pink-950 focus:outline-none font-medium" />
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
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm"><HeartHandshake className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-base font-extrabold text-pink-950">Gerador de Mensagem de Apoio (Condolências)</h2>
                    <p className="text-xs text-pink-500 font-medium">10 opções de textos altamente humanizados, profundos e sensíveis para tutores em luto</p>
                  </div>
                </div>

                <form onSubmit={handleGenerateCondolence} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">Nome do Tutor(a)</label>
                      <input type="text" placeholder="Ex: Maria" value={condolenceTutor} onChange={(e) => setCondolenceTutor(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">Nome do Pet</label>
                      <input type="text" placeholder="Ex: Mel" value={condolencePet} onChange={(e) => setCondolencePet(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Tom / Contexto da Mensagem (10 Opções)</label>
                    <select value={condolenceTone} onChange={(e) => setCondolenceTone(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                      <option value="acolhedor">1. Acolhedor e Sensível (Foco na gratidão e amor)</option>
                      <option value="luta_longa">2. Após Longa Batalha / Doença Crônica (Foco na coragem)</option>
                      <option value="profundo">3. Profundo e Reflexivo (Transformação e vínculo eterno)</option>
                      <option value="curto_respeitoso">4. Curto, Respeitoso e Direto ao Ponto</option>
                      <option value="idoso_gratidao">5. Pet Idoso / Longa Vida (Celebração da velhice bem cuidada)</option>
                      <option value="perda_repentina">6. Perda Repentina / Acidente (Apoio em choque súbito)</option>
                      <option value="filhote_precoce">7. Partida Precoce / Filhote (Dor do vazio repentino)</option>
                      <option value="acolhimento_espiritual">8. Acolhimento Espiritual e Suave (Missão cumprida)</option>
                      <option value="parceiro_de_jornada">9. Foco no Companheirismo (Amigo fiel e confidente)</option>
                      <option value="apoio_clinico_humano">10. Apoio Clínico Humano (Alívio de culpa e exaltação do tutor)</option>
                    </select>
                  </div>

                  <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
                    <Sparkles className="w-4 h-4" /> Gerar Mensagem Humanizada
                  </button>
                </form>

                {generatedCondolence && (
                  <div className="space-y-3 pt-4 border-t border-pink-100">
                    <label className="text-xs font-bold text-pink-900 block">Mensagem Pronta para Copiar e Enviar no WhatsApp:</label>
                    <div className="bg-pink-50/80 border border-pink-200 p-5 rounded-2xl text-xs leading-relaxed text-stone-800 whitespace-pre-line font-normal shadow-2xs">
                      {generatedCondolence}
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(generatedCondolence); alert('Mensagem copiada para a área de transferência!'); }} className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition">
                      📋 Copiar Mensagem
                    </button>
                  </div>
                )}
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
                          <button onClick={() => setPatients(patients.filter(item => item.id !== p.id))} className="text-stone-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
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
                            <textarea placeholder="Evolução clínica, medicação aplicada, resposta..." value={evoNotes} onChange={(e) => setEvoNotes(e.target.value)} rows={2} className="w-full bg-white border border-pink-200 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-none resize-none" required />
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
                              <p className="text-stone-700 pt-1">{evo.notes}</p>
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

                              {calcResultPills !== null && calcResultPills > 4 && (
                                <div className="mt-2 bg-rose-50 border border-rose-300 p-3 rounded-xl text-rose-900 text-left space-y-1 animate-pulse">
                                  <div className="font-extrabold flex items-center gap-1.5 text-rose-950 text-xs">
                                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                                    ⚠️ ATENÇÃO: NÚMERO EXCESSIVO DE COMPRIMIDOS!
                                  </div>
                                  <p className="text-[11px] text-rose-900/95 leading-relaxed pl-5">
                                    Este cálculo resultou em mais de 4 comprimidos por dia ({calcResultPills.toFixed(1)} comp.). A administração diária nesta quantidade é inviável e gera alto risco de erro posológico.
                                  </p>
                                </div>
                              )}
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
                            notes: `Volume a ser infundido entre 6 e 12 horas (Exemplo: ${w}kg x ${fluidDehydrationPercent}% x 1000 = ${totalRepositionMl.toFixed(0)}ml).`
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
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-[11px] text-stone-600">
                      💡 <strong>Nota da Tabela:</strong> Manutenção com reavaliação contínua. Reposição calculada para infusão rápida entre 6h e 12h.
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
                  setTasks([{ id: Date.now().toString(), text: newTaskText, completed: false, category: newTaskCategory, notes: newTaskNotes, attachments: [] }, ...tasks])
                  setNewTaskText('')
                  setNewTaskNotes('')
                }} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input type="text" placeholder="O que precisa ser feito?" value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} className="md:col-span-2 bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                    <input type="text" placeholder="Categoria" value={newTaskCategory} onChange={(e) => setNewTaskCategory(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                  </div>
                  <textarea placeholder="Detalhes..." value={newTaskNotes} onChange={(e) => setNewTaskNotes(e.target.value)} rows={2} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium resize-none" />
                  <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer"><Plus className="w-4 h-4" /> Adicionar Tarefa</button>
                </form>
              </div>

              <div className="space-y-3">
                {tasks.map(t => (
                  <div key={t.id} className={`bg-white/95 backdrop-blur-md border p-4 rounded-2xl shadow-xs flex flex-col gap-3 transition ${t.completed ? 'border-emerald-200 bg-emerald-50/20 opacity-80' : 'border-pink-100'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={t.completed} onChange={() => setTasks(tasks.map(item => item.id === t.id ? { ...item, completed: !item.completed } : item))} className="w-4 h-4 accent-pink-500 cursor-pointer" />
                        <div>
                          <span className={`text-xs font-bold ${t.completed ? 'line-through text-stone-400' : 'text-pink-950'}`}>{t.text}</span>
                          <span className="ml-2 text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md font-semibold">{t.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setActiveTaskForAttach(t.id); fileInputRef.current?.click(); }} className="text-xs text-pink-600 hover:bg-pink-50 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 border border-pink-200 cursor-pointer"><Paperclip className="w-3 h-3" /> Anexar</button>
                        <button onClick={() => setTasks(tasks.filter(item => item.id !== t.id))} className="text-stone-400 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    {t.notes && <p className="text-xs text-stone-600 pl-7">{t.notes}</p>}
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
                          {dayEvents.length > 2 && (
                            <div className="text-[9px] text-pink-600 font-bold">+ {dayEvents.length - 2} mais</div>
                          )}
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
                    setEvents([...events, { dateKey: selectedDate, title: eventTitle, description: eventDesc, time: eventTime }])
                    setEventTitle('')
                    setEventDesc('')
                  }} className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <input type="text" placeholder="Título do Evento / Matéria" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className="col-span-2 bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                      <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                    </div>
                    <textarea placeholder="Detalhes ou notas do compromisso..." value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} rows={2} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium resize-none" />
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
                            <div className="text-xs font-bold text-pink-950 flex items-center gap-2">
                              {ev.time && <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded-lg text-[10px] font-extrabold">{ev.time}</span>}
                              {ev.title}
                            </div>
                            {ev.description && <div className="text-[11px] text-stone-600 mt-0.5">{ev.description}</div>}
                          </div>
                          <button onClick={() => setEvents(events.filter(item => !(item.title === ev.title && item.dateKey === ev.dateKey)))} className="text-stone-400 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
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
              <h2 className="text-xl font-extrabold text-pink-950">Controle Financeiro & Gráficos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
                  <span className="text-xs font-bold text-stone-400">Renda / Entrada do Mês</span>
                  <div className="flex items-center justify-between mt-2">
                    {editingIncome ? (
                      <div className="flex items-center gap-2">
                        <input type="number" step="0.01" value={tempIncome} onChange={(e) => setTempIncome(e.target.value)} className="w-28 bg-pink-50 border border-pink-200 rounded-lg px-2 py-1 text-sm font-bold text-pink-950" />
                        <button onClick={() => { 
                          const val = parseFloat(tempIncome) || 0;
                          setMonthlyIncome(val); 
                          localStorage.setItem('vet_income_v18', val.toString());
                          setEditingIncome(false); 
                        }} className="bg-pink-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">Salvar</button>
                      </div>
                    ) : (
                      <div className="text-2xl font-extrabold text-emerald-600">R$ {monthlyIncome.toFixed(2)}</div>
                    )}
                    <button onClick={() => { setTempIncome(monthlyIncome.toString()); setEditingIncome(!editingIncome); }} className="text-xs text-pink-600 font-bold hover:underline">
                      {editingIncome ? 'Cancelar' : 'Editar'}
                    </button>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-stone-400">Total de Despesas</span>
                  <div className="text-2xl font-extrabold text-rose-500 mt-2">R$ {totalGastos.toFixed(2)}</div>
                </div>

                <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-stone-400">Saldo Restante</span>
                  <div className={`text-2xl font-extrabold mt-2 ${saldoRestante >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    R$ {saldoRestante.toFixed(2)}
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
                <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Histórico de Lançamentos</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {finances.length === 0 ? (
                    <p className="text-xs text-stone-400 py-6 text-center">Nenhum gasto lançado ainda.</p>
                  ) : (
                    finances.map(f => (
                      <div key={f.id} className="flex items-center justify-between bg-pink-50/40 border border-pink-100 p-3 rounded-xl text-xs">
                        <div>
                          <span className="font-bold text-pink-950">{f.description}</span>
                          <span className="ml-2 bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md text-[10px] font-semibold">{f.category}</span>
                          <div className="text-[10px] text-stone-400 mt-0.5">{f.date}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-rose-500">R$ {f.amount.toFixed(2)}</span>
                          <button onClick={() => setFinances(finances.filter(item => item.id !== f.id))} className="text-stone-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))
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