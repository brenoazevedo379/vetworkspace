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
  Printer,
  Bot,
  Send,
  Mic,
  MicOff,
  HeartHandshake,
  AlertTriangle,
  Scale,
  Calculator,
  Search,
  Clock,
  Folder,
  FolderPlus,
  FileText,
  Bookmark,
  Layers,
  Wallet,
  CreditCard,
  Cat,
  Flower2,
  Stethoscope,
  Gift,
  ExternalLink,
  CheckCircle,
  Upload
} from 'lucide-react'
import { dbService } from '@/lib/supabase'

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
  id: string
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

interface WishItem {
  id: string
  title: string
  price: number
  url?: string
  imageUrl?: string
  purchased: boolean
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
  { name: 'Dipirona', category: 'Analgésico / Antitérmico', defaultDosage: 25, defaultConcentration: 500, maxDays: 7 },
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
  }
]

export default function VetWorkspaceBeatrizV26() {
  const [activeTab, setActiveTab] = useState<'painel' | 'estudos' | 'pacientes' | 'calculadora' | 'bsa' | 'ia' | 'condolencias' | 'tarefas' | 'calendario' | 'financas' | 'wishlist'>('painel')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [saveStatus, setSaveStatus] = useState('Sincronizado na Nuvem')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Chat / IA
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 'default-session',
      title: 'Caso Clínico Inicial',
      messages: [
        { sender: 'ai', text: 'Olá, Dra. Beatriz! Sou seu copiloto clínico veterinário. Como posso ajudar com os casos de hoje?' }
      ]
    }
  ])
  const [currentChatId, setCurrentChatId] = useState<string>('default-session')
  const [chatInput, setChatInput] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)

  // Estudos & Pós
  const [items, setItems] = useState<DocumentItem[]>([
    { id: 'f-pos', title: 'Pós-graduação & Residência', parentId: null, type: 'folder', isOpen: true },
    { id: 'p-1', title: 'Módulos e Aulas Teóricas', parentId: 'f-pos', type: 'page', content: '', differential: '', notes: '', attachments: [] }
  ])
  const [selectedItemId, setSelectedItemId] = useState<string>('p-1')

  // Casos Clínicos & Pacientes
  const [patients, setPatients] = useState<PatientRecord[]>([])
  const [newPetName, setNewPetName] = useState('')
  const [newSpecies, setNewSpecies] = useState('Canino')
  const [newBreed, setNewBreed] = useState('')
  const [newAge, setNewAge] = useState('')
  const [newWeight, setNewWeight] = useState('')
  const [newTutor, setNewTutor] = useState('')
  const [newComplaint, setNewComplaint] = useState('')
  const [newStatus, setNewStatus] = useState<'Em Atendimento' | 'Internado' | 'Alta' | 'Observação'>('Em Atendimento')
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [evoWeight, setEvoWeight] = useState('')
  const [evoTemp, setEvoTemp] = useState('')
  const [evoNotes, setEvoNotes] = useState('')

  // Calculadora & Soro
  const [calcWeight, setCalcWeight] = useState<string>('')
  const [customDrugs, setCustomDrugs] = useState<VetDrug[]>(INITIAL_DRUGS)
  const [selectedDrugName, setSelectedDrugName] = useState<string>('Selecione ou adicione...')
  const [calcDosage, setCalcDosage] = useState<string>('')
  const [calcConcentration, setCalcConcentration] = useState<string>('')
  const [calcResultMl, setCalcResultMl] = useState<number | null>(null)

  const [fluidWeight, setFluidWeight] = useState<string>('')
  const [fluidSpecies, setFluidSpecies] = useState<'cao' | 'gato'>('cao')
  const [fluidMode, setFluidMode] = useState<'manutencao' | 'reposicao'>('manutencao')
  const [fluidDehydrationPercent, setFluidDehydrationPercent] = useState<string>('8')
  const [fluidResultSummary, setFluidResultSummary] = useState<{
    mlHour: number
    ml24hRange?: string
    notes: string
  } | null>(null)

  // BSA & Onco
  const [bsaWeightKg, setBsaWeightKg] = useState('')
  const [bsaSpecies, setBsaSpecies] = useState<'cao' | 'gato'>('cao')
  const [selectedOncoDrugName, setSelectedOncoDrugName] = useState<string>('Doxorrubicina')
  const [oncoResultMg, setOncoResultMg] = useState<number | null>(null)
  const [oncoResultMl, setOncoResultMl] = useState<number | null>(null)
  const [calculatedBsaValue, setCalculatedBsaValue] = useState<number | null>(null)

  // Mensagem de Apoio
  const [condolenceTutor, setCondolenceTutor] = useState('')
  const [condolencePet, setCondolencePet] = useState('')
  const [condolenceTone, setCondolenceTone] = useState<'acolhedor' | 'curto' | 'luta_longa'>('acolhedor')
  const [generatedCondolence, setGeneratedCondolence] = useState('')

  // Finanças & Gráficos
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0.00)
  const [editingIncome, setEditingIncome] = useState(false)
  const [tempIncome, setTempIncome] = useState('0')
  const [finances, setFinances] = useState<FinancialItem[]>([])
  const [finDesc, setFinDesc] = useState('')
  const [finCategory, setFinCategory] = useState('Cartão de Crédito')
  const [finAmount, setFinAmount] = useState('')

  // Tarefas
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState('Geral')
  const [newTaskNotes, setNewTaskNotes] = useState('')

  // Calendário & Metas (Estilo Google Agenda com Horários)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [eventTitle, setEventTitle] = useState('')
  const [eventDesc, setEventDesc] = useState('')
  const [eventTime, setEventTime] = useState('08:00')

  // Lista de Desejos Avançada
  const [wishes, setWishes] = useState<WishItem[]>([
    { id: '1', title: 'Livro de Clínica Médica de Pequenos Animais - Ettinger', price: 450.00, url: 'https://amazon.com.br', purchased: false }
  ])
  const [newWishTitle, setNewWishTitle] = useState('')
  const [newWishPrice, setNewWishPrice] = useState('')
  const [newWishUrl, setNewWishUrl] = useState('')

  // CARREGAR DO SUPABASE
  useEffect(() => {
    async function loadFromSupabase() {
      try {
        const loadedStudies = await dbService.getAppData('studies')
        if (loadedStudies && Array.isArray(loadedStudies) && loadedStudies.length > 0) setItems(loadedStudies)

        const loadedPatients = await dbService.getPatients()
        if (loadedPatients && loadedPatients.length > 0) setPatients(loadedPatients)

        const loadedTasks = await dbService.getAppData('tasks')
        if (loadedTasks) setTasks(loadedTasks)

        const loadedFinances = await dbService.getAppData('finances')
        if (loadedFinances) setFinances(loadedFinances)

        const loadedIncome = await dbService.getAppData('income')
        if (loadedIncome !== null && loadedIncome !== undefined) setMonthlyIncome(loadedIncome)

        const loadedEvents = await dbService.getAppData('events')
        if (loadedEvents) setEvents(loadedEvents)

        const loadedWishes = await dbService.getAppData('wishes')
        if (loadedWishes) setWishes(loadedWishes)

        setSaveStatus('Sincronizado na Nuvem')
      } catch (e) {
        console.error('Erro ao carregar dados:', e)
      }
    }
    loadFromSupabase()
  }, [])

  // SALVAR NO SUPABASE AUTOMATICAMENTE
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await dbService.saveAppData('studies', items)
        await dbService.saveAppData('tasks', tasks)
        await dbService.saveAppData('finances', finances)
        await dbService.saveAppData('income', monthlyIncome)
        await dbService.saveAppData('events', events)
        await dbService.saveAppData('wishes', wishes)
        setSaveStatus('Sincronizado na Nuvem')
      } catch (e) {
        setSaveStatus('Erro ao sincronizar')
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [items, tasks, finances, monthlyIncome, events, wishes])

  const currentChatSession = chatSessions.find(s => s.id === currentChatId) || chatSessions[0]
  const selectedItem = items.find(i => i.id === selectedItemId && i.type === 'page') || items.find(i => i.type === 'page')
  const selectedPatient = patients.find(p => p.id === selectedPatientId)

  // Anexar Arquivos Reais
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    const fileUrl = typeof window !== 'undefined' ? URL.createObjectURL(file) : ''
    const fileName = file.name
    const fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB'
    let fileType: 'image' | 'excel' | 'docx' | 'doc' = 'doc'
    const lower = fileName.toLowerCase()
    if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) fileType = 'image'
    else if (lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.csv')) fileType = 'excel'
    else if (lower.endsWith('.docx') || lower.endsWith('.doc')) fileType = 'docx'

    const newAtt: AttachedFile = { id: Date.now().toString(), name: fileName, type: fileType, size: fileSize, url: fileUrl }
    if (selectedItem) {
      setItems(items.map(i => i.id === selectedItem.id ? { ...i, attachments: [...(i.attachments || []), newAtt] } : i))
    }
    e.target.value = ''
  }

  // Importar Planilha de Finanças (CSV/Excel básico)
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      if (!text) return
      const lines = text.split('\n')
      const newItems: FinancialItem[] = []
      lines.slice(1).forEach((line, idx) => {
        const parts = line.split(',')
        if (parts.length >= 2) {
          newItems.push({
            id: Date.now() + '-' + idx,
            description: parts[0]?.trim() || 'Importado',
            category: parts[1]?.trim() || 'Geral',
            amount: parseFloat(parts[2]?.trim()) || 0.00,
            date: new Date().toLocaleDateString('pt-BR')
          })
        }
      })
      if (newItems.length > 0) {
        setFinances([...finances, ...newItems])
        alert(`${newItems.length} itens importados com sucesso!`)
      }
    }
    reader.readAsText(file)
  }

  const totalGastos = finances.reduce((acc, f) => acc + f.amount, 0)
  const saldoRestante = monthlyIncome - totalGastos

  return (
    <div className="relative flex h-screen bg-pink-50/40 text-stone-800 font-sans overflow-hidden select-none">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <div className="absolute top-10 left-20 animate-bounce text-pink-400"><Cat className="w-12 h-12" /></div>
        <div className="absolute bottom-20 right-32 text-pink-300"><Flower2 className="w-16 h-16" /></div>
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
                <button title="Nova Pasta Raiz" onClick={() => {
                  const title = prompt('Nome da pasta:')
                  if (title) setItems([...items, { id: 'f-' + Date.now(), title, parentId: null, type: 'folder', isOpen: true }])
                }} className="p-1 rounded hover:bg-pink-100 text-pink-600"><FolderPlus className="w-3.5 h-3.5" /></button>
                <button title="Nova Página Raiz" onClick={() => {
                  const title = prompt('Nome da página:')
                  if (title) setItems([...items, { id: 'p-' + Date.now(), title, parentId: null, type: 'page', content: '', attachments: [] }])
                }} className="p-1 rounded hover:bg-pink-100 text-pink-600"><Plus className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="mt-1">
              {items.filter(i => i.parentId === null).map(item => (
                <div key={item.id} className="space-y-1">
                  <div className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer ${selectedItemId === item.id ? 'bg-pink-500 text-white font-bold' : 'hover:bg-pink-50 text-pink-950'}`} onClick={() => { if (item.type === 'page') { setSelectedItemId(item.id); setActiveTab('estudos'); } else { setItems(items.map(x => x.id === item.id ? { ...x, isOpen: !x.isOpen } : x)); } }}>
                    <div className="flex items-center gap-2 truncate">
                      {item.type === 'folder' ? <Folder className="w-4 h-4 text-pink-500" /> : <FileText className="w-4 h-4" />}
                      <span className="truncate">{item.title}</span>
                    </div>
                  </div>
                  {item.type === 'folder' && item.isOpen && items.filter(sub => sub.parentId === item.id).map(sub => (
                    <div key={sub.id} className="ml-4 pl-2 border-l border-pink-200 py-1 cursor-pointer text-pink-900 hover:text-pink-600 font-medium truncate" onClick={() => { setSelectedItemId(sub.id); setActiveTab('estudos'); }}>
                      📄 {sub.title}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setActiveTab('pacientes')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'pacientes' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <Stethoscope className="w-4 h-4" /> Casos Clínicos & Pacientes ({patients.length})
          </button>

          <button onClick={() => setActiveTab('ia')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'ia' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <Bot className="w-4 h-4" /> Copiloto IA Vet 🐾
          </button>

          <button onClick={() => setActiveTab('condolencias')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'condolencias' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <HeartHandshake className="w-4 h-4 text-pink-500" /> Mensagem de Apoio 🕊️
          </button>

          <button onClick={() => setActiveTab('calculadora')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'calculadora' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <Calculator className="w-4 h-4" /> Calculadora & Soro
          </button>

          <button onClick={() => setActiveTab('bsa')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'bsa' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <Scale className="w-4 h-4 text-pink-500" /> Calculadora BSA & Onco
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
              <p className="text-xs text-pink-400 font-medium">Terça-Feira, 25 De Agosto De 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
              {saveStatus}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:px-12 space-y-6">
          {activeTab === 'painel' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div onClick={() => setActiveTab('financas')} className="bg-white/90 border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-300 transition">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Renda do Mês</span>
                    <div className="text-2xl font-extrabold text-emerald-600 mt-1">R$ {monthlyIncome.toFixed(2)}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Wallet className="w-5 h-5" /></div>
                </div>
                <div onClick={() => setActiveTab('financas')} className="bg-white/90 border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-300 transition">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Total de Despesas</span>
                    <div className="text-2xl font-extrabold text-rose-500 mt-1">R$ {totalGastos.toFixed(2)}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500"><CreditCard className="w-5 h-5" /></div>
                </div>
                <div onClick={() => setActiveTab('pacientes')} className="bg-white/90 border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-300 transition">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Casos Clínicos</span>
                    <div className="text-2xl font-extrabold text-pink-950 mt-1">{patients.length}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500"><Stethoscope className="w-5 h-5" /></div>
                </div>
                <div onClick={() => setActiveTab('bsa')} className="bg-white/90 border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-300 transition">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Calculadora BSA & Onco</span>
                    <div className="text-xs font-bold text-pink-600 mt-1">Superfície Corporal</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500"><Scale className="w-5 h-5" /></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'estudos' && selectedItem && (
            <div className="max-w-5xl mx-auto bg-white/95 border border-pink-100 p-8 rounded-3xl shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-pink-100 pb-5">
                <input 
                  type="text" 
                  value={selectedItem.title}
                  onChange={(e) => setItems(items.map(i => i.id === selectedItem.id ? { ...i, title: e.target.value } : i))}
                  className="w-full bg-transparent text-2xl font-extrabold text-pink-950 focus:outline-none"
                />
                <button onClick={() => fileInputRef.current?.click()} className="bg-pink-100 text-pink-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-pink-200 transition">
                  <Paperclip className="w-4 h-4" /> Anexar Arquivo
                </button>
              </div>
              <textarea 
                value={selectedItem.content || ''} 
                onChange={(e) => setItems(items.map(i => i.id === selectedItem.id ? { ...i, content: e.target.value } : i))} 
                rows={12} 
                className="w-full bg-pink-50/25 border border-pink-200 p-5 rounded-2xl text-stone-800 text-sm focus:outline-none resize-none" 
                placeholder="Escreva seus resumos de estudos e anotações aqui..." 
              />
              {selectedItem.attachments && selectedItem.attachments.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-pink-100">
                  <h4 className="font-bold text-xs text-pink-950">Arquivos Anexados:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.attachments.map(att => (
                      <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-pink-50 border border-pink-200 px-3 py-2 rounded-xl text-xs font-semibold text-pink-900 hover:bg-pink-100 transition">
                        <span>📎 {att.name}</span>
                        <span className="text-[10px] text-stone-400">({att.size})</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ia' && (
            <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white/95 border border-pink-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-pink-100 bg-pink-50/50 flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-pink-950">Copiloto IA Veterinária 🐾</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {currentChatSession.messages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-pink-500 text-white' : 'bg-pink-50/70 border border-pink-100 text-stone-800'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendAiMessage} className="p-4 border-t border-pink-100 bg-white flex gap-2 items-center">
                <input type="text" placeholder="Digite sua dúvida clínica ou peça suporte..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 bg-pink-50/50 border border-pink-200 rounded-xl px-4 py-3 text-xs text-pink-950 focus:outline-none" />
                <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md">Enviar</button>
              </form>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-pink-950">🎁 Lista de Desejos & Metas de Conquistas</h2>
                    <p className="text-xs text-pink-500 font-medium">Itens, preços, links e status de aquisição</p>
                  </div>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  if (!newWishTitle.trim()) return
                  setWishes([...wishes, { id: Date.now().toString(), title: newWishTitle, price: parseFloat(newWishPrice) || 0, url: newWishUrl, purchased: false }])
                  setNewWishTitle('')
                  setNewWishPrice('')
                  setNewWishUrl('')
                }} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input type="text" placeholder="Nome do item..." value={newWishTitle} onChange={(e) => setNewWishTitle(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2.5 text-xs text-pink-950 focus:outline-none" required />
                  <input type="number" placeholder="Preço (R$)" value={newWishPrice} onChange={(e) => setNewWishPrice(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2.5 text-xs text-pink-950 focus:outline-none" />
                  <div className="flex gap-2">
                    <input type="text" placeholder="Link URL..." value={newWishUrl} onChange={(e) => setNewWishUrl(e.target.value)} className="flex-1 bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2.5 text-xs text-pink-950 focus:outline-none" />
                    <button type="submit" className="bg-pink-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold">Adicionar</button>
                  </div>
                </form>

                <div className="space-y-3">
                  {wishes.map(wish => (
                    <div key={wish.id} className="flex items-center justify-between bg-pink-50/40 border border-pink-100 p-4 rounded-2xl text-xs">
                      <div className="space-y-1">
                        <div className={`font-extrabold text-pink-950 ${wish.purchased ? 'line-through text-stone-400' : ''}`}>{wish.title}</div>
                        <div className="text-emerald-600 font-bold">R$ {wish.price.toFixed(2)}</div>
                        {wish.url && <a href={wish.url} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline flex items-center gap-1 font-semibold">Acessar Link <ExternalLink className="w-3 h-3" /></a>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setWishes(wishes.map(w => w.id === wish.id ? { ...w, purchased: !w.purchased } : w))} className={`px-3 py-1.5 rounded-xl font-bold ${wish.purchased ? 'bg-emerald-100 text-emerald-800' : 'bg-pink-100 text-pink-800'}`}>
                          {wish.purchased ? 'Conquistado' : 'Marcar como Comprado'}
                        </button>
                        <button onClick={() => setWishes(wishes.filter(w => w.id !== wish.id))} className="text-stone-400 hover:text-red-500 p-1.5"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pacientes' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-xl font-extrabold text-pink-950">Casos Clínicos & Prontuários Veterinários</h2>
              <form onSubmit={(e) => {
                e.preventDefault()
                if (!newPetName.trim()) return
                const newP: PatientRecord = {
                  id: Date.now().toString(),
                  petName: newPetName,
                  species: newSpecies,
                  breed: newBreed || 'Não informada',
                  age: newAge || 'Não informada',
                  tutor: newTutor || 'Não informado',
                  complaint: newComplaint || 'Sem queixa',
                  status: newStatus,
                  date: new Date().toLocaleDateString('pt-BR'),
                  evolutions: []
                }
                setPatients([newP, ...patients])
                setNewPetName('')
                setNewBreed('')
                setNewAge('')
                setNewWeight('')
                setNewTutor('')
                setNewComplaint('')
              }} className="bg-white/95 border border-pink-100 p-6 rounded-2xl space-y-3 shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input type="text" placeholder="Nome do Pet" value={newPetName} onChange={(e) => setNewPetName(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs" required />
                  <select value={newSpecies} onChange={(e) => setNewSpecies(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs">
                    <option value="Canino">Canino</option>
                    <option value="Felino">Felino</option>
                    <option value="Silvestre/Outros">Silvestre / Outros</option>
                  </select>
                  <input type="text" placeholder="Raça" value={newBreed} onChange={(e) => setNewBreed(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs" />
                  <input type="text" placeholder="Idade" value={newAge} onChange={(e) => setNewAge(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs" />
                  <input type="text" placeholder="Tutor" value={newTutor} onChange={(e) => setNewTutor(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs" />
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as any)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs">
                    <option value="Em Atendimento">Em Atendimento</option>
                    <option value="Internado">Internado</option>
                    <option value="Observação">Observação</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
                <textarea placeholder="Queixa principal e histórico clínico..." value={newComplaint} onChange={(e) => setNewComplaint(e.target.value)} rows={3} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl p-3 text-xs resize-none" />
                <button type="submit" className="bg-pink-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold">Cadastrar Prontuário</button>
              </form>

              <div className="space-y-3">
                {patients.map(p => (
                  <div key={p.id} className="bg-white border border-pink-100 p-5 rounded-2xl flex justify-between items-start shadow-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-pink-950">{p.petName} ({p.species} - {p.breed})</h3>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800">{p.status}</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">Tutor: {p.tutor} | Data: {p.date}</p>
                      <p className="text-xs text-stone-700 mt-2 bg-pink-50/40 p-2.5 rounded-xl border border-pink-100"><b>Queixa:</b> {p.complaint}</p>
                    </div>
                    <button onClick={() => setPatients(patients.filter(x => x.id !== p.id))} className="text-stone-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'financas' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-xl font-extrabold text-pink-950">Controle Financeiro & Gráficos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-pink-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs text-stone-500 font-semibold">Renda Mensal</span>
                  <div className="text-2xl font-extrabold text-emerald-600 mt-1">R$ {monthlyIncome.toFixed(2)}</div>
                  <button onClick={() => {
                    const val = prompt('Digite a nova renda mensal (R$):', monthlyIncome.toString())
                    if (val !== null) setMonthlyIncome(parseFloat(val) || 0)
                  }} className="mt-3 text-[11px] font-bold text-pink-600 hover:underline">Editar Renda</button>
                </div>
                <div className="bg-white border border-pink-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs text-stone-500 font-semibold">Total de Despesas</span>
                  <div className="text-2xl font-extrabold text-rose-500 mt-1">R$ {totalGastos.toFixed(2)}</div>
                </div>
                <div className="bg-white border border-pink-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs text-stone-500 font-semibold">Saldo Restante</span>
                  <div className="text-2xl font-extrabold text-pink-950 mt-1">R$ {saldoRestante.toFixed(2)}</div>
                </div>
              </div>

              <div className="bg-white border border-pink-100 p-6 rounded-2xl space-y-4 shadow-xs">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-pink-950">Adicionar Despesa ou Importar Planilha</h3>
                  <label className="cursor-pointer bg-pink-100 hover:bg-pink-200 text-pink-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition">
                    <Upload className="w-3.5 h-3.5" /> Importar Excel/CSV
                    <input type="file" onChange={handleExcelImport} className="hidden" accept=".csv,.xlsx,.xls" />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input type="text" placeholder="Descrição" value={finDesc} onChange={(e) => setFinDesc(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs" />
                  <select value={finCategory} onChange={(e) => setFinCategory(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs">
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Insumos Veterinários">Insumos Veterinários</option>
                    <option value="Fixas / Aluguel">Fixas / Aluguel</option>
                    <option value="Outros">Outros</option>
                  </select>
                  <input type="number" placeholder="Valor (R$)" value={finAmount} onChange={(e) => setFinAmount(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs" />
                  <button onClick={() => {
                    if (!finDesc || !finAmount) return
                    setFinances([...finances, { id: Date.now().toString(), description: finDesc, category: finCategory, amount: parseFloat(finAmount), date: new Date().toLocaleDateString('pt-BR') }])
                    setFinDesc('')
                    setFinAmount('')
                  }} className="bg-pink-500 text-white font-bold rounded-xl text-xs py-2 shadow-xs">Adicionar</button>
                </div>

                <div className="space-y-2 pt-2">
                  {finances.map(f => (
                    <div key={f.id} className="flex justify-between items-center bg-pink-50/30 p-3 rounded-xl border border-pink-100 text-xs">
                      <div>
                        <span className="font-extrabold text-pink-950">{f.description}</span> <span className="text-stone-400">({f.category} - {f.date})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-rose-500">R$ {f.amount.toFixed(2)}</span>
                        <button onClick={() => setFinances(finances.filter(x => x.id !== f.id))} className="text-stone-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calculadora' && (
            <div className="max-w-4xl mx-auto bg-white border border-pink-100 p-8 rounded-3xl space-y-6 shadow-xs">
              <h2 className="text-xl font-extrabold text-pink-950">Calculadora de Medicamentos & Fluidoterapia Soro</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-pink-50/30 p-5 rounded-2xl border border-pink-100">
                  <h3 className="font-bold text-xs text-pink-900 uppercase">Cálculo de Dosagem (mg/ml)</h3>
                  <input type="number" placeholder="Peso do Paciente (kg)" value={calcWeight} onChange={(e) => setCalcWeight(e.target.value)} className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs" />
                  <select value={selectedDrugName} onChange={(e) => {
                    setSelectedDrugName(e.target.value)
                    const found = customDrugs.find(d => d.name === e.target.value)
                    if (found) {
                      setCalcDosage(found.defaultDosage.toString())
                      setCalcConcentration(found.defaultConcentration.toString())
                    }
                  }} className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs">
                    <option>Selecione medicamento pré-cadastrado...</option>
                    {customDrugs.map(d => <option key={d.name} value={d.name}>{d.name} ({d.category})</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" placeholder="Dose (mg/kg)" value={calcDosage} onChange={(e) => setCalcDosage(e.target.value)} className="bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs" />
                    <input type="number" placeholder="Concentração (mg/ml)" value={calcConcentration} onChange={(e) => setCalcConcentration(e.target.value)} className="bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs" />
                  </div>
                  <button onClick={() => {
                    const w = parseFloat(calcWeight)
                    const d = parseFloat(calcDosage)
                    const c = parseFloat(calcConcentration)
                    if (w && d && c) setCalcResultMl((w * d) / c)
                  }} className="w-full bg-pink-500 text-white font-bold rounded-xl py-2.5 text-xs">Calcular Volume (ml)</button>
                  {calcResultMl !== null && <div className="p-3 bg-white rounded-xl border border-pink-200 text-xs font-bold text-emerald-600">Volume a administrar: {calcResultMl.toFixed(2)} ml</div>}
                </div>

                <div className="space-y-4 bg-pink-50/30 p-5 rounded-2xl border border-pink-100">
                  <h3 className="font-bold text-xs text-pink-900 uppercase">Fluidoterapia & Taxa de Infusão</h3>
                  <input type="number" placeholder="Peso do Paciente (kg)" value={fluidWeight} onChange={(e) => setFluidWeight(e.target.value)} className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs" />
                  <select value={fluidSpecies} onChange={(e) => setFluidSpecies(e.target.value as any)} className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs">
                    <option value="cao">Canino (Manutenção 50-60 ml/kg/dia)</option>
                    <option value="gato">Felino (Manutenção 40-50 ml/kg/dia)</option>
                  </select>
                  <button onClick={() => {
                    const w = parseFloat(fluidWeight)
                    if (!w) return
                    const rate = fluidSpecies === 'cao' ? 55 : 45
                    const totalDay = w * rate
                    setFluidResultSummary({ mlHour: totalDay / 24, notes: `Manutenção diária calculada para ${w}kg.` })
                  }} className="w-full bg-pink-500 text-white font-bold rounded-xl py-2.5 text-xs">Calcular Soro</button>
                  {fluidResultSummary && <div className="p-3 bg-white rounded-xl border border-pink-200 text-xs font-bold text-emerald-600">Taxa: {fluidResultSummary.mlHour.toFixed(1)} ml/hora</div>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bsa' && (
            <div className="max-w-3xl mx-auto bg-white border border-pink-100 p-8 rounded-3xl space-y-6 shadow-xs">
              <h2 className="text-xl font-extrabold text-pink-950">Calculadora BSA & Protocolos Oncológicos</h2>
              <div className="space-y-4">
                <input type="number" placeholder="Peso do Paciente (kg)" value={bsaWeightKg} onChange={(e) => setBsaWeightKg(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-4 py-2.5 text-xs" />
                <select value={selectedOncoDrugName} onChange={(e) => setSelectedOncoDrugName(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-4 py-2.5 text-xs">
                  {ONCO_DRUGS.map(d => <option key={d.name} value={d.name}>{d.name} ({d.category})</option>)}
                </select>
                <button onClick={() => {
                  const w = parseFloat(bsaWeightKg)
                  if (!w) return
                  const constK = 10.1
                  const bsa = (9.0 * Math.pow(w, 2/3)) / constK
                  setCalculatedBsaValue(bsa)
                  const drug = ONCO_DRUGS.find(d => d.name === selectedOncoDrugName)
                  if (drug) {
                    const totalMg = bsa * drug.dosagePerM2
                    setOncoResultMg(totalMg)
                    setOncoResultMl(totalMg / drug.concentration)
                  }
                }} className="bg-pink-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs">Calcular BSA & Dose Quimioterápica</button>

                {calculatedBsaValue !== null && (
                  <div className="p-4 bg-pink-50/40 rounded-2xl border border-pink-200 space-y-2 text-xs">
                    <div className="font-extrabold text-pink-950">Superfície Corporal (BSA): {calculatedBsaValue.toFixed(3)} m²</div>
                    {oncoResultMg !== null && <div className="font-extrabold text-emerald-600">Dose Total ({selectedOncoDrugName}): {oncoResultMg.toFixed(2)} mg ({oncoResultMl?.toFixed(2)} ml)</div>}
                    {ONCO_DRUGS.find(d => d.name === selectedOncoDrugName)?.alertDesc && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 whitespace-pre-line font-medium">
                        {ONCO_DRUGS.find(d => d.name === selectedOncoDrugName)?.alertTitle}
                        {'\n'}{ONCO_DRUGS.find(d => d.name === selectedOncoDrugName)?.alertDesc}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'condolencias' && (
            <div className="max-w-3xl mx-auto bg-white border border-pink-100 p-8 rounded-3xl space-y-6 shadow-xs">
              <h2 className="text-xl font-extrabold text-pink-950">Gerador de Mensagens de Apoio 🕊️</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Nome do Tutor" value={condolenceTutor} onChange={(e) => setCondolenceTutor(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-4 py-2.5 text-xs" />
                <input type="text" placeholder="Nome do Pet" value={condolencePet} onChange={(e) => setCondolencePet(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-4 py-2.5 text-xs" />
                <button onClick={() => {
                  setGeneratedCondolence(`Prezado(a) ${condolenceTutor || 'Tutor(a)'},\n\nÉ com profundo pesar que nos solidarizamos com a partida do(a) querido(a) ${condolencePet || 'Pet'}. Agradecemos imensamente pela confiança depositada em nossa equipe veterinária e desejamos muita serenidade e força neste momento de luto.\n\nCom todo nosso carinho e respeito,\nDra. Beatriz Contreiras`)
                }} className="bg-pink-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs">Gerar Mensagem Empática</button>
                {generatedCondolence && <textarea readOnly value={generatedCondolence} rows={6} className="w-full bg-pink-50/30 border border-pink-200 rounded-2xl p-4 text-xs text-stone-800 font-medium" />}
              </div>
            </div>
          )}

          {activeTab === 'tarefas' && (
            <div className="max-w-3xl mx-auto bg-white border border-pink-100 p-8 rounded-3xl space-y-6 shadow-xs">
              <h2 className="text-xl font-extrabold text-pink-950">Lista de Tarefas & Pendências</h2>
              <div className="flex gap-2">
                <input type="text" placeholder="Adicionar nova tarefa..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} className="flex-1 bg-pink-50/50 border border-pink-200 rounded-xl px-4 py-2.5 text-xs" />
                <button onClick={() => { if (!newTaskText.trim()) return; setTasks([...tasks, { id: Date.now().toString(), text: newTaskText, completed: false, category: newTaskCategory }]); setNewTaskText(''); }} className="bg-pink-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold">Adicionar</button>
              </div>
              <div className="space-y-2">
                {tasks.map(t => (
                  <div key={t.id} className="flex items-center justify-between bg-pink-50/30 p-3.5 rounded-xl border border-pink-100">
                    <span className={`text-xs ${t.completed ? 'line-through text-stone-400' : 'text-pink-950 font-medium'}`}>{t.text}</span>
                    <button onClick={() => setTasks(tasks.map(x => x.id === t.id ? { ...x, completed: !x.completed } : x))} className={`px-3 py-1 rounded-lg text-xs font-bold ${t.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-pink-100 text-pink-800'}`}>{t.completed ? 'Concluída' : 'Concluir'}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'calendario' && (
            <div className="max-w-3xl mx-auto bg-white border border-pink-100 p-8 rounded-3xl space-y-6 shadow-xs">
              <h2 className="text-xl font-extrabold text-pink-950">Calendário & Agenda Estilo Google</h2>
              <div className="space-y-4 bg-pink-50/30 p-5 rounded-2xl border border-pink-100">
                <h3 className="font-bold text-xs text-pink-950 uppercase">Adicionar Compromisso / Plantão</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs" />
                  <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs" />
                  <input type="text" placeholder="Título (ex: Plantão Hospital)" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className="bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs" />
                </div>
                <textarea placeholder="Detalhes ou notas..." value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} rows={2} className="w-full bg-white border border-pink-200 rounded-xl p-3 text-xs resize-none" />
                <button onClick={() => {
                  if (!eventTitle.trim()) return
                  setEvents([...events, { id: Date.now().toString(), dateKey: selectedDate, title: eventTitle, description: eventDesc, time: eventTime }])
                  setEventTitle('')
                  setEventDesc('')
                }} className="bg-pink-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs">Salvar na Agenda</button>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-xs text-pink-950 uppercase">Compromissos Registrados</h3>
                {events.map(ev => (
                  <div key={ev.id} className="flex justify-between items-center bg-white border border-pink-200 p-4 rounded-2xl text-xs shadow-xs">
                    <div>
                      <div className="font-extrabold text-pink-950">{ev.title} ⏰ {ev.time} ({ev.dateKey})</div>
                      <div className="text-stone-500 mt-1">{ev.description}</div>
                    </div>
                    <button onClick={() => setEvents(events.filter(x => x.id !== ev.id))} className="text-stone-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}