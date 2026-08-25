'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Settings, 
  ChevronRight, 
  Folder, 
  FolderPlus, 
  Plus, 
  Trash2, 
  Sparkles, 
  LogOut,
  TrendingUp,
  TrendingDown,
  Clock,
  Paperclip,
  Image as ImageIcon,
  FileSpreadsheet,
  FileText as DocIcon,
  Download,
  Eye,
  Save,
  CreditCard,
  Baby,
  Wallet,
  AlertCircle
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
  isOpen?: boolean 
  attachments?: AttachedFile[]
}

interface FinancialItem {
  id: string
  description: string
  category: 'cartao' | 'filha' | 'outro'
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
  dateKey: string // YYYY-MM-DD
  title: string
  description: string
}

export default function VetWorkspaceBeatrizMaster() {
  const [activeTab, setActiveTab] = useState<'painel' | 'documentos' | 'estudos' | 'tarefas' | 'calendario' | 'financas'>('painel')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [saveStatus, setSaveStatus] = useState('Salvo automaticamente')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. Moleskine / Estudos & Pós
  const [items, setItems] = useState<DocumentItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_items_v3')
      if (saved) { try { return JSON.parse(saved) } catch (e) {} }
    }
    return [
      { id: 'f-pos', title: 'Pós-graduação & Residência', parentId: null, type: 'folder', isOpen: true },
      { id: 'p-1', title: 'Cirurgia de Pequenos Animais', parentId: 'f-pos', type: 'page', content: 'Anotações sobre técnicas cirúrgicas...', attachments: [] },
      { id: 'f-estudos', title: 'Artigos & Casos Clínicos', parentId: null, type: 'folder', isOpen: true },
      { id: 'p-3', title: 'Caso: Insuficiência Renal Felina', parentId: 'f-estudos', type: 'page', content: 'Acompanhamento clínico...', attachments: [] }
    ]
  })
  const [selectedItemId, setSelectedItemId] = useState<string>('p-1')

  // 2. Finanças Inteligentes (Renda + Despesas Cartão/Filha)
  const [monthlyIncome, setMonthlyIncome] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_income_v3')
      if (saved) return parseFloat(saved)
    }
    return 4500.00
  })

  const [finances, setFinances] = useState<FinancialItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_finances_v3')
      if (saved) { try { return JSON.parse(saved) } catch (e) {} }
    }
    return [
      { id: '1', description: 'Fatura Cartão de Crédito', category: 'cartao', amount: 3000.00, date: '25/08/2026' },
      { id: '2', description: 'Escola / Material Filha', category: 'filha', amount: 450.00, date: '22/08/2026' }
    ]
  })
  const [finDesc, setFinDesc] = useState('')
  const [finCategory, setFinCategory] = useState<'cartao' | 'filha' | 'outro'>('cartao')
  const [finAmount, setFinAmount] = useState('')
  const [editingIncome, setEditingIncome] = useState(false)
  const [tempIncome, setTempIncome] = useState(monthlyIncome.toString())

  // 3. Tarefas
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_tasks_v3')
      if (saved) { try { return JSON.parse(saved) } catch (e) {} }
    }
    return [
      { id: 't-1', text: 'Revisar exames de sangue do felino', completed: false, category: 'Clínica', notes: 'Verificar taxas renais.', attachments: [] }
    ]
  })
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState('Geral')
  const [newTaskNotes, setNewTaskNotes] = useState('')
  const [activeTaskForAttach, setActiveTaskForAttach] = useState<string | null>(null)

  // 4. Calendário Interativo por Dia (Metas, Vendas, Atendimentos)
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_events_v3')
      if (saved) { try { return JSON.parse(saved) } catch (e) {} }
    }
    return [
      { dateKey: '2026-08-25', title: 'Meta do Dia', description: 'Realizar 10 atendimentos / vendas na clínica.' }
    ]
  })
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-25')
  const [eventTitle, setEventTitle] = useState('')
  const [eventDesc, setEventDesc] = useState('')

  // Sincronização automática
  useEffect(() => {
    localStorage.setItem('vet_items_v3', JSON.stringify(items))
    localStorage.setItem('vet_income_v3', monthlyIncome.toString())
    localStorage.setItem('vet_finances_v3', JSON.stringify(finances))
    localStorage.setItem('vet_tasks_v3', JSON.stringify(tasks))
    localStorage.setItem('vet_events_v3', JSON.stringify(events))
    setSaveStatus('Salvo com sucesso!')
    const timer = setTimeout(() => setSaveStatus('Salvo automaticamente'), 2000)
    return () => clearTimeout(timer)
  }, [items, monthlyIncome, finances, tasks, events])

  const selectedItem = items.find(i => i.id === selectedItemId && i.type === 'page') || items.find(i => i.type === 'page')

  // Manipulação de Arquivos
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

  // Cálculos Financeiros
  const totalCartao = finances.filter(f => f.category === 'cartao').reduce((acc, f) => acc + f.amount, 0)
  const totalFilha = finances.filter(f => f.category === 'filha').reduce((acc, f) => acc + f.amount, 0)
  const totalOutros = finances.filter(f => f.category === 'outro').reduce((acc, f) => acc + f.amount, 0)
  const totalGastos = totalCartao + totalFilha + totalOutros
  const saldoRestante = monthlyIncome - totalGastos

  const handleAddFinancial = (e: React.FormEvent) => {
    e.preventDefault()
    if (!finDesc || !finAmount) return
    const newF: FinancialItem = {
      id: Date.now().toString(),
      description: finDesc,
      category: finCategory,
      amount: parseFloat(finAmount),
      date: new Date().toLocaleDateString('pt-BR')
    }
    setFinances([newF, ...finances])
    setFinDesc('')
    setFinAmount('')
  }

  // Calendário Dias de Agosto/2026
  const calendarDays = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1
    const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`
    return { day: dayNum, dateKey: `2026-08-${formattedDay}` }
  })

  return (
    <div className="flex h-screen bg-pink-50/40 text-stone-800 font-sans overflow-hidden select-none">
      
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg,.pdf" />

      {/* BARRA LATERAL */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-200 bg-white border-r border-pink-100 flex flex-col z-10 overflow-hidden shadow-xs`}>
        <div className="p-4 border-b border-pink-100 flex items-center gap-2.5 bg-pink-50/30">
          <div className="w-8 h-8 rounded-xl bg-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">V</div>
          <div>
            <div className="font-extrabold text-sm text-pink-950 tracking-tight">VetWorkspace</div>
            <div className="text-[10px] font-semibold text-pink-500 uppercase tracking-wide">Dra. Beatriz Contreiras</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-xs">
          <button onClick={() => setActiveTab('painel')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'painel' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <LayoutDashboard className="w-4 h-4" /> Painel
          </button>
          <button onClick={() => setActiveTab('estudos')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'estudos' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <BookOpen className="w-4 h-4" /> Moleskine & Pós
          </button>
          <button onClick={() => setActiveTab('tarefas')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'tarefas' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <CheckSquare className="w-4 h-4" /> Tarefas ({tasks.filter(t => !t.completed).length})
          </button>
          <button onClick={() => setActiveTab('calendario')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'calendario' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <CalendarIcon className="w-4 h-4" /> Calendário & Metas
          </button>
          <button onClick={() => setActiveTab('financas')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'financas' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <DollarSign className="w-4 h-4" /> Finanças
          </button>
        </div>

        <div className="p-3 border-t border-pink-100 space-y-2 text-xs bg-pink-50/20">
          <div className="flex items-center gap-2 text-pink-900/70 px-2 py-1.5 rounded-lg hover:bg-pink-50 cursor-pointer font-medium">
            <Settings className="w-4 h-4 text-pink-500" /> Configurações
          </div>
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center text-[10px]">B</div>
              <span className="font-bold text-pink-950 text-xs">beatriz</span>
            </div>
            <LogOut className="w-3.5 h-3.5 text-pink-400 hover:text-red-500 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col h-full bg-pink-50/30 overflow-hidden">
        <div className="h-16 border-b border-pink-100 flex items-center justify-between px-8 bg-white shadow-xs">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl text-pink-600 hover:bg-pink-50 transition">
              <ChevronRight className={`w-4 h-4 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
            </button>
            <div>
              <h1 className="text-base font-extrabold text-pink-950 capitalize">Boa noite, Breno & Beatriz!</h1>
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
                <div onClick={() => setActiveTab('financas')} className="bg-white border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-300 transition">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Renda do Mês</span>
                    <div className="text-2xl font-extrabold text-emerald-600 mt-1">R$ {monthlyIncome.toFixed(2)}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Wallet className="w-5 h-5" /></div>
                </div>
                <div onClick={() => setActiveTab('financas')} className="bg-white border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-300 transition">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Cartão de Crédito</span>
                    <div className="text-2xl font-extrabold text-rose-500 mt-1">R$ {totalCartao.toFixed(2)}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500"><CreditCard className="w-5 h-5" /></div>
                </div>
                <div onClick={() => setActiveTab('financas')} className="bg-white border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-300 transition">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Gastos com a Filha</span>
                    <div className="text-2xl font-extrabold text-pink-600 mt-1">R$ {totalFilha.toFixed(2)}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500"><Baby className="w-5 h-5" /></div>
                </div>
                <div onClick={() => setActiveTab('tarefas')} className="bg-white border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-300 transition">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Tarefas Pendentes</span>
                    <div className="text-2xl font-extrabold text-pink-950 mt-1">{tasks.filter(t => !t.completed).length}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500"><CheckSquare className="w-5 h-5" /></div>
                </div>
              </div>
            </div>
          )}

          {/* MOLESKINE / ESTUDOS & PÓS */}
          {activeTab === 'estudos' && selectedItem && (
            <div className="max-w-4xl mx-auto bg-white border border-pink-100 p-10 rounded-2xl shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-pink-100 pb-4">
                <div className="flex-1 mr-4">
                  <span className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Moleskine / Estudos & Pós</span>
                  <input 
                    type="text" 
                    value={selectedItem.title}
                    onChange={(e) => setItems(items.map(i => i.id === selectedItem.id ? { ...i, title: e.target.value } : i))}
                    className="w-full bg-transparent text-2xl font-extrabold text-pink-950 focus:outline-none mt-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setActiveTaskForAttach(null); fileInputRef.current?.click(); }} className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer">
                    <Paperclip className="w-4 h-4" /> Anexar Arquivo (.docx, .xlsx...)
                  </button>
                </div>
              </div>

              {selectedItem.attachments && selectedItem.attachments.length > 0 && (
                <div className="space-y-2 bg-pink-50/40 p-4 rounded-xl border border-pink-100">
                  <span className="text-xs font-bold text-pink-900 flex items-center gap-1.5 mb-2">
                    <Paperclip className="w-3.5 h-3.5 text-pink-500" /> Arquivos Anexados ({selectedItem.attachments.length})
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedItem.attachments.map(att => (
                      <div key={att.id} className="flex items-center justify-between bg-white border border-pink-200/60 p-3 rounded-xl shadow-xs">
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                            <DocIcon className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-stone-800 truncate">{att.name}</div>
                            <div className="text-[10px] text-stone-400">{att.size}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <a href={att.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-pink-600 bg-pink-50 hover:bg-pink-100 text-[11px] font-bold flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> Abrir
                          </a>
                          <a href={att.url} download={att.name} className="p-1.5 rounded-lg text-white bg-pink-500 hover:bg-pink-600 text-[11px] font-bold flex items-center gap-1 shadow-xs">
                            <Download className="w-3.5 h-3.5" /> Baixar
                          </a>
                          <button onClick={() => setItems(items.map(i => i.id === selectedItem.id ? { ...i, attachments: i.attachments?.filter(a => a.id !== att.id) } : i))} className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <textarea 
                value={selectedItem.content || ''}
                onChange={(e) => setItems(items.map(i => i.id === selectedItem.id ? { ...i, content: e.target.value } : i))}
                rows={12}
                className="w-full bg-transparent text-stone-700 text-sm leading-relaxed focus:outline-none resize-none font-normal placeholder-stone-300"
                placeholder="Insira suas anotações do Moleskine, resumos e casos clínicos aqui..."
              />
            </div>
          )}

          {/* TAREFAS */}
          {activeTab === 'tarefas' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-xl font-extrabold text-pink-950">Gerenciador de Tarefas</h2>
              
              <div className="bg-white border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
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
                    <input type="text" placeholder="Categoria (Ex: Clínica, Vendas)" value={newTaskCategory} onChange={(e) => setNewTaskCategory(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" />
                  </div>
                  <textarea placeholder="Detalhes ou observações..." value={newTaskNotes} onChange={(e) => setNewTaskNotes(e.target.value)} rows={2} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium resize-none" />
                  <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Adicionar Tarefa
                  </button>
                </form>
              </div>

              <div className="space-y-3">
                {tasks.map(t => (
                  <div key={t.id} className={`bg-white border p-4 rounded-2xl shadow-xs flex flex-col gap-3 transition ${t.completed ? 'border-emerald-200 bg-emerald-50/20 opacity-80' : 'border-pink-100'}`}>
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

          {/* CALENDÁRIO INTERATIVO */}
          {activeTab === 'calendario' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-xl font-extrabold text-pink-950">Calendário Diário & Metas de Vendas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
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
                  <div className="bg-white border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                    <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Adicionar Meta ou Vendas para o dia {selectedDate}</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      if (!eventTitle.trim()) return
                      setEvents([...events, { dateKey: selectedDate, title: eventTitle, description: eventDesc }])
                      setEventTitle('')
                      setEventDesc('')
                    }} className="space-y-3">
                      <input type="text" placeholder="Título (Ex: Vendas: 10 atendimentos hoje)" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                      <textarea placeholder="Detalhes da meta..." value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} rows={2} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-pink-950 focus:outline-none font-medium resize-none" />
                      <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs">Salvar no Dia</button>
                    </form>
                  </div>

                  <div className="bg-white border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
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

          {/* FINANÇAS INTELIGENTES (Com cálculo de sobra e balanço) */}
          {activeTab === 'financas' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-xl font-extrabold text-pink-950">Controle Financeiro Inteligente</h2>
              
              {/* Bloco de Renda & Balanço */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-pink-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
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

                <div className="bg-white border border-pink-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-stone-400">Total de Gastos (Cartão + Filha)</span>
                  <div className="text-2xl font-extrabold text-rose-500 mt-2">R$ {totalGastos.toFixed(2)}</div>
                  <span className="text-[10px] text-stone-400 mt-1 block">Cartão: R$ {totalCartao.toFixed(2)} | Filha: R$ {totalFilha.toFixed(2)}</span>
                </div>

                <div className={`border p-5 rounded-2xl shadow-xs flex flex-col justify-between ${saldoRestante >= 0 ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'}`}>
                  <span className="text-xs font-bold text-stone-500">Saldo Restante</span>
                  <div className={`text-2xl font-extrabold mt-2 ${saldoRestante >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    R$ {saldoRestante.toFixed(2)}
                  </div>
                  <span className="text-[10px] font-semibold text-stone-500 mt-1">
                    {saldoRestante >= 0 ? 'Orçamento sob controle' : 'Atenção: Gastos acima da renda!'}
                  </span>
                </div>
              </div>

              {/* Alerta inteligente se o cartão pesou muito */}
              {totalCartao > monthlyIncome * 0.5 && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900">
                    <span className="font-bold">Aviso financeiro:</span> O seu cartão de crédito (R$ {totalCartao.toFixed(2)}) está consumindo mais de 50% da sua entrada mensal. Vale a pena revisar os lançamentos!
                  </div>
                </div>
              )}

              {/* Novo Lançamento */}
              <div className="bg-white border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Adicionar Novo Gasto</h3>
                <form onSubmit={handleAddFinancial} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <input type="text" placeholder="Descrição (Ex: Fatura Nubank, Escola)" value={finDesc} onChange={(e) => setFinDesc(e.target.value)} className="md:col-span-2 bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                  <select value={finCategory} onChange={(e) => setFinCategory(e.target.value as 'cartao' | 'filha' | 'outro')} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                    <option value="cartao">Cartão de Crédito</option>
                    <option value="filha">Gastos com a Filha</option>
                    <option value="outro">Outros Gastos</option>
                  </select>
                  <input type="number" step="0.01" placeholder="Valor (R$)" value={finAmount} onChange={(e) => setFinAmount(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                  <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold transition shadow-md">Adicionar Gasto</button>
                </form>
              </div>

              {/* Histórico */}
              <div className="bg-white border border-pink-100 rounded-2xl overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-pink-100 text-xs font-bold text-pink-900">Histórico de Gastos</div>
                <div className="divide-y divide-pink-50">
                  {finances.map(f => (
                    <div key={f.id} className="px-6 py-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-pink-950">{f.description}</div>
                        <div className="text-[10px] text-stone-400">
                          {f.date} • <span className="uppercase font-semibold text-pink-600">
                            {f.category === 'cartao' ? 'Cartão de Crédito' : f.category === 'filha' ? 'Gastos Filha' : 'Outros'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-extrabold text-rose-500">- R$ {f.amount.toFixed(2)}</span>
                        <button onClick={() => setFinances(finances.filter(item => item.id !== f.id))} className="text-stone-400 hover:text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}