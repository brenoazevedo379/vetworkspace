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
  FileText as DocIcon,
  Download,
  Eye,
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
  MicOff
} from 'lucide-react'

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
  { name: 'Meloxicam (Cão)', category: 'Anti-inflamatório', defaultDosage: 0.1, defaultConcentration: 2 },
  { name: 'Meloxicam (Gato)', category: 'Anti-inflamatório', defaultDosage: 0.05, defaultConcentration: 0.5 },
  { name: 'Dipirona', category: 'Analgésico / Antitérmico', defaultDosage: 25, defaultConcentration: 500 },
  { name: 'Tramadol', category: 'Analgésico Opióide', defaultDosage: 2, defaultConcentration: 50 },
  { name: 'Omeprazol', category: 'Protetor Gástrico', defaultDosage: 1, defaultConcentration: 20 },
  { name: 'Maropitant (Cerenia)', category: 'Antiemético', defaultDosage: 1, defaultConcentration: 10 },
  { name: 'Cloridrato de Doxiciclina', category: 'Antibiótico', defaultDosage: 10, defaultConcentration: 50 },
  { name: 'Amoxicilina + Ácido Clavulânico', category: 'Antibiótico', defaultDosage: 20, defaultConcentration: 50 },
  { name: 'Prednisolona', category: 'Corticoide', defaultDosage: 1, defaultConcentration: 3 },
  { name: 'Furosemida', category: 'Diurético', defaultDosage: 2, defaultConcentration: 10 }
]

export default function VetWorkspaceBeatrizV13() {
  const [activeTab, setActiveTab] = useState<'painel' | 'estudos' | 'pacientes' | 'calculadora' | 'ia' | 'tarefas' | 'calendario' | 'financas'>('painel')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [saveStatus, setSaveStatus] = useState('Salvo automaticamente')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [studySubTab, setStudySubTab] = useState<'resumo' | 'diferenciais' | 'pontos'>('resumo')

  // Estado de Sessões do Copiloto IA Salvas
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_chat_sessions_v22')
      if (saved) { try { return JSON.parse(saved) } catch (e) {} }
    }
    return [
      {
        id: 'default-session',
        title: 'Caso Clínico Inicial',
        messages: [
          { sender: 'ai', text: 'Olá, Dra. Beatriz! Sou seu copiloto clínico. Pode digitar o caso, os sintomas ou usar o microfone para ditar.' }
        ]
      }
    ]
  })
  const [currentChatId, setCurrentChatId] = useState<string>('default-session')
  const [chatInput, setChatInput] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)

  // Sincronizar salvamento automático das sessões de IA
  useEffect(() => {
    localStorage.setItem('vet_chat_sessions_v22', JSON.stringify(chatSessions))
  }, [chatSessions])

  const currentChatSession = chatSessions.find(s => s.id === currentChatId) || chatSessions[0]

  const handleNewChatSession = () => {
    const newId = Date.now().toString()
    const newSession: ChatSession = {
      id: newId,
      title: 'Novo Caso Clínico',
      messages: [
        { sender: 'ai', text: 'Olá, Dra. Beatriz! Novo caso clínico iniciado. Pode descrever os sintomas ou o histórico.' }
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

  // Função de Reconhecimento de Voz (Ditado)
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Seu navegador não suporta reconhecimento de voz. Tente usar o Google Chrome.')
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

  // 1. Estudos & Pós
  const [items, setItems] = useState<DocumentItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_items_v18')
      if (saved) { try { return JSON.parse(saved) } catch (e) {} }
    }
    return [
      { id: 'f-pos', title: 'Pós-graduação & Residência', parentId: null, type: 'folder', isOpen: true },
      { id: 'p-1', title: 'Módulos e Aulas Teóricas', parentId: 'f-pos', type: 'page', content: '', differential: '', notes: '', attachments: [] }
    ]
  })
  const [selectedItemId, setSelectedItemId] = useState<string>('p-1')

  // 2. Pacientes & Timeline
  const [patients, setPatients] = useState<PatientRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_patients_v18')
      if (saved) { try { return JSON.parse(saved) } catch (e) {} }
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

  // 3. Calculadora
  const [calcMode, setCalcMode] = useState<'dose' | 'fluido'>('dose')
  const [customDrugs, setCustomDrugs] = useState<VetDrug[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_custom_drugs_v18')
      if (saved) { try { return JSON.parse(saved) } catch (e) {} }
    }
    return INITIAL_DRUGS
  })
  const [calcWeight, setCalcWeight] = useState<string>('')
  const [drugSearchQuery, setDrugSearchQuery] = useState<string>('')
  const [selectedDrugName, setSelectedDrugName] = useState<string>('Selecione ou adicione...')
  const [calcDosage, setCalcDosage] = useState<string>('')
  const [calcConcentration, setCalcConcentration] = useState<string>('')
  const [calcResult, setCalcResult] = useState<number | null>(null)

  const [fluidWeight, setFluidWeight] = useState<string>('')
  const [fluidRateType, setFluidRateType] = useState<string>('manutencao')
  const [fluidResultMlHour, setFluidResultMlHour] = useState<number | null>(null)

  const [newDrugName, setNewDrugName] = useState('')
  const [newDrugCat, setNewDrugCat] = useState('Personalizado')
  const [newDrugDosage, setNewDrugDosage] = useState('')
  const [newDrugConc, setNewDrugConc] = useState('')

  // 4. Finanças
  const [monthlyIncome, setMonthlyIncome] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_income_v18')
      if (saved) return parseFloat(saved)
    }
    return 0.00
  })
  const [finances, setFinances] = useState<FinancialItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_finances_v18')
      if (saved) { try { return JSON.parse(saved) } catch (e) {} }
    }
    return []
  })
  const [finDesc, setFinDesc] = useState('')
  const [finCategory, setFinCategory] = useState('Cartão de Crédito')
  const [finCustomCategory, setFinCustomCategory] = useState('')
  const [finAmount, setFinAmount] = useState('')
  const [editingIncome, setEditingIncome] = useState(false)
  const [tempIncome, setTempIncome] = useState('0')

  // 5. Tarefas
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_tasks_v18')
      if (saved) { try { return JSON.parse(saved) } catch (e) {} }
    }
    return []
  })
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState('Geral')
  const [newTaskNotes, setNewTaskNotes] = useState('')
  const [activeTaskForAttach, setActiveTaskForAttach] = useState<string | null>(null)

  // 6. Calendário
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_events_v18')
      if (saved) { try { return JSON.parse(saved) } catch (e) {} }
    }
    return []
  })
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-25')
  const [eventTitle, setEventTitle] = useState('')
  const [eventDesc, setEventDesc] = useState('')

  useEffect(() => {
    localStorage.setItem('vet_items_v18', JSON.stringify(items))
    localStorage.setItem('vet_patients_v18', JSON.stringify(patients))
    localStorage.setItem('vet_custom_drugs_v18', JSON.stringify(customDrugs))
    localStorage.setItem('vet_income_v18', monthlyIncome.toString())
    localStorage.setItem('vet_finances_v18', JSON.stringify(finances))
    localStorage.setItem('vet_tasks_v18', JSON.stringify(tasks))
    localStorage.setItem('vet_events_v18', JSON.stringify(events))
    setSaveStatus('Salvo com sucesso!')
    const timer = setTimeout(() => setSaveStatus('Salvo automaticamente'), 2000)
    return () => clearTimeout(timer)
  }, [items, patients, customDrugs, monthlyIncome, finances, tasks, events])

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
  const percentualGastos = monthlyIncome > 0 ? Math.min(100, (totalGastos / monthlyIncome) * 100) : 0

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
      defaultConcentration: parseFloat(newDrugConc) || 1
    }
    setCustomDrugs([newD, ...customDrugs])
    setSelectedDrugName(newD.name)
    setCalcDosage(newD.defaultDosage.toString())
    setCalcConcentration(newD.defaultConcentration.toString())
    setNewDrugName('')
    setNewDrugDosage('')
    setNewDrugConc('')
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
      <div className="space-y-1 pl-3 border-l border-pink-100/80 ml-1">
        {children.map(item => {
          if (item.type === 'folder') {
            return (
              <div key={item.id} className="space-y-1 pt-1">
                <div className="flex items-center justify-between group px-2 py-1 rounded-lg hover:bg-pink-100/60 text-pink-900 cursor-pointer">
                  <div className="flex items-center gap-1.5 truncate" onClick={() => toggleFolder(item.id)}>
                    <button className="text-pink-400">
                      {item.isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                    <Folder className="w-3.5 h-3.5 text-pink-500 fill-pink-200" />
                    <span className="font-bold text-xs truncate">{item.title}</span>
                  </div>
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button title="Adicionar Subpasta" onClick={() => handleAddFolder(item.id)} className="p-0.5 text-pink-600 hover:text-pink-950 bg-pink-50 rounded"><FolderPlus className="w-3.5 h-3.5" /></button>
                    <button title="Adicionar Página" onClick={() => handleAddPage(item.id)} className="p-0.5 text-pink-600 hover:text-pink-950 bg-pink-50 rounded"><Plus className="w-3.5 h-3.5" /></button>
                    <button title="Excluir Pasta" onClick={() => deleteItem(item.id)} className="p-0.5 text-stone-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
                {item.isOpen && renderTree(item.id)}
              </div>
            )
          } else {
            const isSelected = selectedItemId === item.id
            return (
              <div key={item.id} className={`flex items-center justify-between group px-2 py-1.5 rounded-lg cursor-pointer transition ${isSelected ? 'bg-pink-500 text-white font-bold shadow-xs' : 'text-pink-900/80 hover:bg-pink-50'}`} onClick={() => { setSelectedItemId(item.id); setActiveTab('estudos'); }}>
                <div className="flex items-center gap-2 truncate">
                  <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-pink-400'}`} />
                  <span className="text-xs truncate">{item.title}</span>
                </div>
                <button title="Excluir Página" onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} className={`opacity-0 group-hover:opacity-100 p-0.5 ${isSelected ? 'text-white/80 hover:text-white' : 'text-stone-400 hover:text-red-500'}`}>
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )
          }
        })}
      </div>
    )
  }

  // Enviar mensagem para a IA e atualizar/salvar histórico de sessões
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

  const calendarDays = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1
    const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`
    return { day: dayNum, dateKey: `2026-08-${formattedDay}` }
  })

  return (
    <div className="relative flex h-screen bg-pink-50/40 text-stone-800 font-sans overflow-hidden select-none">
      
      {/* ANIMAÇÃO DE FUNDO */}
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

          {/* Seção Copiloto IA Vet com Histórico de Casos Salvos */}
          <div className="pt-1">
            <div className="flex items-center justify-between">
              <button onClick={() => setActiveTab('ia')} className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'ia' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
                <Bot className="w-4 h-4" /> Copiloto IA Vet 🐾 ({chatSessions.length})
              </button>
              <button title="Novo Caso de IA" onClick={handleNewChatSession} className="p-2 text-pink-600 hover:bg-pink-100 rounded-xl ml-1">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* LISTA DE HISTÓRICO DE CONVERSAS SALVAS */}
            <div className="pl-3 pr-1 space-y-1 my-1 max-h-40 overflow-y-auto border-l border-pink-200 ml-2">
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

          <button onClick={() => setActiveTab('calculadora')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'calculadora' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <Calculator className="w-4 h-4" /> Calculadora & Soro
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
              <p className="text-xs text-pink-400 font-medium">Terça-Feira, 25 De Agosto De 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200 flex items-center gap-1">
              <Save className="w-3 h-3" /> {saveStatus}
            </span>
            <span className="text-xs bg-pink-100 text-pink-700 px-3.5 py-1.5 rounded-full border border-pink-200 font-bold flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" /> Sincronizado
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:px-12 space-y-6">
          
          {/* PAINEL */}
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
                <div onClick={() => setActiveTab('ia')} className="bg-white/90 backdrop-blur-sm border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-300 transition">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Copiloto IA Vet</span>
                    <div className="text-xs font-bold text-pink-600 mt-1 flex items-center gap-1">Pronto para uso <Sparkles className="w-3 h-3" /></div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500"><Bot className="w-5 h-5" /></div>
                </div>
              </div>
            </div>
          )}

          {/* ESTUDOS & PÓS */}
          {activeTab === 'estudos' && selectedItem && (
            <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md border border-pink-100 p-8 lg:p-10 rounded-3xl shadow-sm space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-pink-100 pb-5 gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-extrabold text-pink-500 uppercase tracking-wider mb-1">
                    <BookOpen className="w-3.5 h-3.5" /> Módulo Acadêmico / Pós-Graduação
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
                    <Paperclip className="w-4 h-4" /> Anexar Material
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 border-b border-pink-100 pb-3">
                <button 
                  onClick={() => setStudySubTab('resumo')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${studySubTab === 'resumo' ? 'bg-pink-500 text-white shadow-xs' : 'bg-pink-50 text-pink-900/70 hover:bg-pink-100'}`}
                >
                  <FileText className="w-3.5 h-3.5" /> Resumo Teórico & Aulas
                </button>
                <button 
                  onClick={() => setStudySubTab('diferenciais')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${studySubTab === 'diferenciais' ? 'bg-pink-500 text-white shadow-xs' : 'bg-pink-50 text-pink-900/70 hover:bg-pink-100'}`}
                >
                  <Layers className="w-3.5 h-3.5" /> Diagnósticos Diferenciais
                </button>
                <button 
                  onClick={() => setStudySubTab('pontos')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${studySubTab === 'pontos' ? 'bg-pink-500 text-white shadow-xs' : 'bg-pink-50 text-pink-900/70 hover:bg-pink-100'}`}
                >
                  <Bookmark className="w-3.5 h-3.5" /> Pontos de Atenção / Prova
                </button>
              </div>

              {studySubTab === 'resumo' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-pink-900 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-pink-500" /> Resumo e Anotações da Matéria
                  </label>
                  <textarea 
                    value={selectedItem.content || ''}
                    onChange={(e) => setItems(items.map(i => i.id === selectedItem.id ? { ...i, content: e.target.value } : i))}
                    rows={12}
                    className="w-full bg-pink-50/20 border border-pink-100 p-4 rounded-2xl text-stone-700 text-sm leading-relaxed focus:outline-none focus:border-pink-300 resize-none font-normal placeholder-stone-300"
                    placeholder="Digite aqui as explicações, fisiopatologia, posologias e conceitos abordados na pós..."
                  />
                </div>
              )}

              {studySubTab === 'diferenciais' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-pink-900 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-pink-500" /> Diagnósticos Diferenciais por Sistema
                  </label>
                  <textarea 
                    value={selectedItem.differential || ''}
                    onChange={(e) => setItems(items.map(i => i.id === selectedItem.id ? { ...i, differential: e.target.value } : i))}
                    rows={12}
                    className="w-full bg-pink-50/20 border border-pink-100 p-4 rounded-2xl text-stone-700 text-sm leading-relaxed focus:outline-none focus:border-pink-300 resize-none font-normal placeholder-stone-300"
                    placeholder="Liste aqui os diferenciais clínicos, exames necessários para exclusão e achados laboratoriais..."
                  />
                </div>
              )}

              {studySubTab === 'pontos' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-pink-900 flex items-center gap-1">
                    <Bookmark className="w-3.5 h-3.5 text-pink-500" /> Alertas Críticos & Pegadinhas de Prova / Residência
                  </label>
                  <textarea 
                    value={selectedItem.notes || ''}
                    onChange={(e) => setItems(items.map(i => i.id === selectedItem.id ? { ...i, notes: e.target.value } : i))}
                    rows={12}
                    className="w-full bg-pink-50/20 border border-pink-100 p-4 rounded-2xl text-stone-700 text-sm leading-relaxed focus:outline-none focus:border-pink-300 resize-none font-normal placeholder-stone-300"
                    placeholder="Anotações importantes que costumam cair em provas, contraindicações severas ou detalhes que não podem ser esquecidos..."
                  />
                </div>
              )}

              {selectedItem.attachments && selectedItem.attachments.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-pink-100">
                  <span className="text-xs font-bold text-pink-900 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-pink-500" /> Materiais de Estudo Anexados ({selectedItem.attachments.length})
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedItem.attachments.map(att => (
                      <div key={att.id} className="flex items-center justify-between bg-pink-50/30 border border-pink-200/60 p-3 rounded-xl shadow-2xs">
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
                            <DocIcon className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-stone-800 truncate">{att.name}</div>
                            <div className="text-[10px] text-stone-400">{att.size}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <a href={att.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-pink-600 bg-white hover:bg-pink-100 text-[11px] font-bold flex items-center gap-1 border border-pink-200">
                            <Eye className="w-3.5 h-3.5" /> Abrir
                          </a>
                          <a href={att.url} download={att.name} className="p-1.5 rounded-lg text-white bg-pink-500 hover:bg-pink-600 text-[11px] font-bold flex items-center gap-1 shadow-xs">
                            <Download className="w-3.5 h-3.5" /> Baixar
                          </a>
                          <button onClick={() => setItems(items.map(i => i.id === selectedItem.id ? { ...i, attachments: i.attachments?.filter(a => a.id !== att.id) } : i))} className="p-1.5 rounded-lg text-stone-400 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* COPILOTO IA VETERINÁRIA (COM HISTÓRICO DE CASOS SALVOS + BOTÃO DE VOZ) */}
          {activeTab === 'ia' && (
            <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white/95 backdrop-blur-md border border-pink-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-pink-100 bg-pink-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-pink-950">Copiloto IA Veterinária - {currentChatSession.title}</h2>
                    <p className="text-[11px] text-pink-500 font-medium">Assistente de raciocínio clínico com inteligência artificial avançada</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleNewChatSession} className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition">
                    + Novo Caso
                  </button>
                  <span className="text-[10px] bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-bold">API Conectada</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {currentChatSession.messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-xs ${msg.sender === 'user' ? 'bg-pink-500 text-white rounded-br-xs' : 'bg-pink-50/70 border border-pink-100 text-stone-800 rounded-bl-xs'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-pink-50/70 border border-pink-100 p-4 rounded-2xl text-xs text-pink-600 flex items-center gap-2 animate-pulse">
                      <Sparkles className="w-4 h-4 animate-spin" /> A IA está analisando o caso clínico e a literatura veterinária...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendAiMessage} className="p-4 border-t border-pink-100 bg-white flex gap-2 items-center">
                <button
                  type="button"
                  onClick={toggleListening}
                  title={isListening ? "Ouvindo..." : "Falar por voz"}
                  className={`p-3 rounded-xl transition flex items-center justify-center ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-pink-100 hover:bg-pink-200 text-pink-700'}`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <input 
                  type="text" 
                  placeholder={isListening ? "Ouvindo sua fala..." : "Ex: Cão 12kg, vômito com sangue... (ou clique no microfone para falar)"} 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-pink-50/50 border border-pink-200 rounded-xl px-4 py-3 text-xs text-pink-950 focus:outline-none font-medium"
                />
                <button type="submit" disabled={isAiLoading} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                  <Send className="w-4 h-4" /> Perguntar
                </button>
              </form>
            </div>
          )}

          {/* PACIENTES & CASOS CLÍNICOS REAIS */}
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
                          <button 
                            onClick={() => handlePrintPatient(p)} 
                            className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            title="Imprimir ou Salvar Ficha em PDF"
                          >
                            <Printer className="w-3.5 h-3.5" /> Imprimir / PDF
                          </button>
                          <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${p.status === 'Internado' ? 'bg-amber-100 text-amber-800' : p.status === 'Alta' ? 'bg-emerald-100 text-emerald-800' : 'bg-pink-100 text-pink-800'}`}>
                            {p.status}
                          </span>
                          <button onClick={() => setPatients(patients.filter(item => item.id !== p.id))} className="text-stone-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-pink-900 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-pink-500" /> Linha do Tempo (Evoluções & Retornos)
                          </span>
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

          {/* CALCULADORA */}
          {activeTab === 'calculadora' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-pink-950">Calculadora Veterinária & Fluidoterapia</h2>
                <div className="flex gap-2">
                  <button onClick={() => setCalcMode('dose')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${calcMode === 'dose' ? 'bg-pink-500 text-white shadow-sm' : 'bg-white text-pink-900 border border-pink-200'}`}>
                    💊 Dose de Fármacos
                  </button>
                  <button onClick={() => setCalcMode('fluido')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${calcMode === 'fluido' ? 'bg-pink-500 text-white shadow-sm' : 'bg-white text-pink-900 border border-pink-200'}`}>
                    💧 Taxa de Soro (Fluidoterapia)
                  </button>
                </div>
              </div>

              {calcMode === 'dose' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                    <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">1. Selecionar ou Pesquisar Fármaco</h3>
                    
                    <div className="relative">
                      <Search className="absolute left-3.5 top-3 w-4 h-4 text-pink-400" />
                      <input 
                        type="text" 
                        placeholder="Pesquisar remédio salvo..." 
                        value={drugSearchQuery}
                        onChange={(e) => setDrugSearchQuery(e.target.value)}
                        className="w-full bg-pink-50/50 border border-pink-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium"
                      />
                    </div>

                    <div className="max-h-36 overflow-y-auto space-y-1 pr-1 border border-pink-100 p-2 rounded-xl bg-pink-50/20">
                      {filteredDrugs.length === 0 ? (
                        <p className="text-[11px] text-stone-400 text-center py-4">Nenhum remédio encontrado. Cadastre abaixo!</p>
                      ) : (
                        filteredDrugs.map((drug, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setSelectedDrugName(drug.name)
                              setCalcDosage(drug.defaultDosage.toString())
                              setCalcConcentration(drug.defaultConcentration.toString())
                            }}
                            className={`p-2 rounded-lg text-xs cursor-pointer transition flex justify-between items-center ${selectedDrugName === drug.name ? 'bg-pink-500 text-white font-bold' : 'bg-white text-stone-700 hover:bg-pink-100'}`}
                          >
                            <div>
                              <span className="font-bold">{drug.name}</span>
                              <span className="text-[10px] ml-1 opacity-80">({drug.category})</span>
                            </div>
                            <span className="text-[10px] opacity-90">{drug.defaultDosage} mg/kg</span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="text-[11px] font-bold text-stone-600 block mb-1">Peso do Animal (kg)</label>
                        <input type="number" step="0.1" placeholder="Ex: 15" value={calcWeight} onChange={(e) => setCalcWeight(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-stone-600 block mb-1">Dose (mg/kg)</label>
                        <input type="number" step="0.01" placeholder="Ex: 0.1" value={calcDosage} onChange={(e) => setCalcDosage(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-stone-600 block mb-1">Concentração (mg/ml)</label>
                        <input type="number" step="0.01" placeholder="Ex: 2" value={calcConcentration} onChange={(e) => setCalcConcentration(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                      </div>
                      <button onClick={() => {
                        const w = parseFloat(calcWeight) || 0
                        const d = parseFloat(calcDosage) || 0
                        const c = parseFloat(calcConcentration) || 1
                        const totalMg = w * d
                        const totalMl = totalMg / c
                        setCalcResult(totalMl)
                      }} className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-xs font-bold transition shadow-md">
                        Calcular Volume (ml)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                      <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Resultado ({selectedDrugName})</h3>
                      {calcResult !== null ? (
                        <div className="bg-pink-50 border border-pink-200 p-5 rounded-2xl text-center space-y-1">
                          <span className="text-[11px] font-bold text-pink-600 uppercase">Volume Total Necessário</span>
                          <div className="text-3xl font-extrabold text-pink-950">{calcResult.toFixed(2)} ml</div>
                        </div>
                      ) : (
                        <p className="text-xs text-stone-400 text-center py-6">Selecione um remédio, preencha o peso e calcule.</p>
                      )}
                    </div>

                    <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-3">
                      <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">2. Salvar Novo Fármaco Permanentemente</h3>
                      <form onSubmit={handleSaveNewDrug} className="space-y-2.5">
                        <input type="text" placeholder="Nome do Fármaco" value={newDrugName} onChange={(e) => setNewDrugName(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium" required />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="number" step="0.01" placeholder="Dose (mg/kg)" value={newDrugDosage} onChange={(e) => setNewDrugDosage(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none font-medium" required />
                          <input type="number" step="0.01" placeholder="Conc. (mg/ml)" value={newDrugConc} onChange={(e) => setNewDrugConc(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-pink-950 focus:outline-none font-medium" required />
                        </div>
                        <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5">
                          <Plus className="w-3.5 h-3.5" /> Salvar Fármaco na Lista
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                    <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Cálculo de Taxa de Infusão Contínua (Soro)</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-stone-600 block mb-1">Peso do Animal (kg)</label>
                        <input type="number" step="0.1" placeholder="Ex: 10" value={fluidWeight} onChange={(e) => setFluidWeight(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-stone-600 block mb-1">Tipo de Manutenção / Perda</label>
                        <select value={fluidRateType} onChange={(e) => setFluidRateType(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                          <option value="manutencao">Manutenção Padrão (50 ml/kg/dia)</option>
                          <option value="moderada">Desidratação Moderada (60 - 80 ml/kg/dia)</option>
                          <option value="alta">Perdas Altas / Choque leve (100 ml/kg/dia)</option>
                        </select>
                      </div>
                      <button onClick={() => {
                        const w = parseFloat(fluidWeight) || 0
                        let multiplier = 50
                        if (fluidRateType === 'moderada') multiplier = 70
                        if (fluidRateType === 'alta') multiplier = 100
                        const totalMlDia = w * multiplier
                        const mlHora = totalMlDia / 24
                        setFluidResultMlHour(mlHora)
                      }} className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-xs font-bold transition shadow-md">
                        Calcular Vazão (ml / hora)
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider mb-4">Resultado da Fluidoterapia</h3>
                      {fluidResultMlHour !== null ? (
                        <div className="bg-pink-50 border border-pink-200 p-6 rounded-2xl text-center space-y-2">
                          <span className="text-xs font-bold text-pink-600 uppercase">Taxa de Infusão Recomendada</span>
                          <div className="text-3xl font-extrabold text-pink-950">{fluidResultMlHour.toFixed(1)} ml / hora</div>
                        </div>
                      ) : (
                        <p className="text-xs text-stone-400 text-center py-12">Insira o peso e clique em calcular.</p>
                      )}
                    </div>
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-[11px] text-stone-600">
                      💡 <strong>Dica Vet:</strong> Monitore sempre a frequência cardíaca e respiratória durante a fluidoterapia.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAREFAS */}
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
                  <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Adicionar Tarefa
                  </button>
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
                        <button onClick={() => { setActiveTaskForAttach(t.id); fileInputRef.current?.click(); }} className="text-xs text-pink-600 hover:bg-pink-50 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 border border-pink-200">
                          <Paperclip className="w-3 h-3" /> Anexar
                        </button>
                        <button onClick={() => setTasks(tasks.filter(item => item.id !== t.id))} className="text-stone-400 hover:text-red-500 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {t.notes && <p className="text-xs text-stone-600 pl-7">{t.notes}</p>}
                    {t.attachments && t.attachments.length > 0 && (
                      <div className="pl-7 flex flex-wrap gap-2 pt-1">
                        {t.attachments.map(att => (
                          <div key={att.id} className="flex items-center gap-2 bg-pink-50 border border-pink-200 px-2.5 py-1 rounded-lg text-[11px]">
                            <span className="font-bold text-stone-700">{att.name}</span>
                            <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-pink-600 font-bold hover:underline">Abrir</a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CALENDÁRIO */}
          {activeTab === 'calendario' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-xl font-extrabold text-pink-950">Calendário Diário & Metas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Agosto / 2026</h3>
                  <div className="grid grid-cols-7 gap-1.5 text-center">
                    {['D','S','T','Q','Q','S','S'].map((d, i) => (
                      <span key={i} className="text-[10px] font-bold text-pink-400">{d}</span>
                    ))}
                    {calendarDays.map(cd => {
                      const hasEv = events.some(ev => ev.dateKey === cd.dateKey)
                      const isSelected = selectedDate === cd.dateKey
                      return (
                        <button 
                          key={cd.dateKey}
                          onClick={() => setSelectedDate(cd.dateKey)}
                          className={`h-9 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition relative ${isSelected ? 'bg-pink-500 text-white shadow-sm' : 'bg-pink-50/50 text-pink-950 hover:bg-pink-100'}`}
                        >
                          {cd.day}
                          {hasEv && <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-pink-500'} mt-0.5`}></span>}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                    <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Adicionar Evento para o dia {selectedDate}</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      if (!eventTitle.trim()) return
                      setEvents([...events, { dateKey: selectedDate, title: eventTitle, description: eventDesc }])
                      setEventTitle('')
                      setEventDesc('')
                    }} className="space-y-3">
                      <input type="text" placeholder="Título" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                      <textarea placeholder="Detalhes..." value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} rows={2} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium resize-none" />
                      <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs">Salvar no Dia</button>
                    </form>
                  </div>

                  <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                    <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Registros do dia {selectedDate}</h3>
                    <div className="space-y-2">
                      {events.filter(ev => ev.dateKey === selectedDate).length === 0 ? (
                        <p className="text-xs text-stone-400 py-4 text-center">Nenhum evento registrado para este dia.</p>
                      ) : (
                        events.filter(ev => ev.dateKey === selectedDate).map((ev, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-pink-50/40 border border-pink-100 p-3.5 rounded-xl">
                            <div>
                              <div className="text-xs font-bold text-pink-950">{ev.title}</div>
                              {ev.description && <div className="text-[11px] text-stone-600 mt-0.5">{ev.description}</div>}
                            </div>
                            <button onClick={() => setEvents(events.filter(item => !(item.title === ev.title && item.dateKey === ev.dateKey)))} className="text-stone-400 hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FINANÇAS */}
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
                        <button onClick={() => { setMonthlyIncome(parseFloat(tempIncome) || 0); setEditingIncome(false); }} className="bg-pink-500 text-white px-2 py-1 rounded-lg text-xs font-bold">Salvar</button>
                      </div>
                    ) : (
                      <>
                        <span className="text-2xl font-extrabold text-emerald-600">R$ {monthlyIncome.toFixed(2)}</span>
                        <button onClick={() => { setTempIncome(monthlyIncome.toString()); setEditingIncome(true); }} className="text-xs text-pink-500 hover:underline font-semibold">Editar</button>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-stone-400">Total de Despesas</span>
                  <div className="text-2xl font-extrabold text-rose-500 mt-2">R$ {totalGastos.toFixed(2)}</div>
                </div>

                <div className={`border p-5 rounded-2xl shadow-xs flex flex-col justify-between backdrop-blur-md ${saldoRestante >= 0 ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'}`}>
                  <span className="text-xs font-bold text-stone-500">Saldo Restante</span>
                  <div className={`text-2xl font-extrabold mt-2 ${saldoRestante >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    R$ {saldoRestante.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* GRÁFICO VISUAL */}
              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-pink-950">Progresso do Orçamento (Gastos vs Renda)</span>
                  <span className={percentualGastos > 85 ? 'text-rose-500' : 'text-emerald-600'}>{percentualGastos.toFixed(1)}% comprometido</span>
                </div>
                <div className="w-full bg-pink-100 h-3 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${percentualGastos > 85 ? 'bg-rose-500' : 'bg-pink-500'}`} style={{ width: `${percentualGastos}%` }}></div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Adicionar Despesa</h3>
                <form onSubmit={handleAddFinancial} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <input type="text" placeholder="Descrição" value={finDesc} onChange={(e) => setFinDesc(e.target.value)} className="md:col-span-2 bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                  <select value={finCategory} onChange={(e) => setFinCategory(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Filha">Filha</option>
                    <option value="Filho">Filho</option>
                    <option value="Outro">Outro (Personalizado)</option>
                  </select>
                  {finCategory === 'Outro' ? (
                    <input type="text" placeholder="Nome da categoria" value={finCustomCategory} onChange={(e) => setFinCustomCategory(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                  ) : (
                    <input type="number" step="0.01" placeholder="Valor (R$)" value={finAmount} onChange={(e) => setFinAmount(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                  )}
                  {finCategory === 'Outro' ? null : (
                    <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold transition shadow-md">Adicionar</button>
                  )}
                </form>
                {finCategory === 'Outro' && (
                  <form onSubmit={handleAddFinancial} className="flex gap-3">
                    <input type="number" step="0.01" placeholder="Valor (R$)" value={finAmount} onChange={(e) => setFinAmount(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                    <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-6 rounded-xl text-xs font-bold transition shadow-md">Adicionar</button>
                  </form>
                )}
              </div>

              <div className="bg-white/95 backdrop-blur-md border border-pink-100 rounded-2xl overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-pink-100 text-xs font-bold text-pink-900">Histórico de Despesas</div>
                <div className="divide-y divide-pink-50">
                  {finances.length === 0 ? (
                    <p className="text-xs text-stone-400 py-6 text-center">Nenhuma despesa registrada ainda.</p>
                  ) : (
                    finances.map(f => (
                      <div key={f.id} className="px-6 py-3.5 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-pink-950">{f.description}</div>
                          <div className="text-[10px] text-stone-400">
                            {f.date} • <span className="uppercase font-semibold text-pink-600">{f.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-extrabold text-rose-500">- R$ {f.amount.toFixed(2)}</span>
                          <button onClick={() => setFinances(finances.filter(item => item.id !== f.id))} className="text-stone-400 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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