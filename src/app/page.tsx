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
  Save
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
  type: 'entrada' | 'saida'
  amount: number
  date: string
}

export default function VetWorkspaceBeatrizPersistent() {
  const [activeTab, setActiveTab] = useState<'painel' | 'documentos' | 'estudos' | 'tarefas' | 'calendario' | 'financas'>('painel')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [saveStatus, setSaveStatus] = useState('Salvo automaticamente')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carrega do navegador ou usa os dados iniciais
  const [items, setItems] = useState<DocumentItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_workspace_items')
      if (saved) {
        try { return JSON.parse(saved) } catch (e) { /* fallback */ }
      }
    }
    return [
      { id: 'f-pos', title: 'Pós-graduação & Residência', parentId: null, type: 'folder', isOpen: true },
      { id: 'p-1', title: 'Cirurgia de Pequenos Animais', parentId: 'f-pos', type: 'page', content: 'Anotações sobre técnicas cirúrgicas...', attachments: [] },
      { id: 'f-estudos', title: 'Artigos & Casos Clínicos', parentId: null, type: 'folder', isOpen: true },
      { id: 'p-3', title: 'Caso: Insuficiência Renal Felina', parentId: 'f-estudos', type: 'page', content: 'Acompanhamento clínico...', attachments: [] }
    ]
  })

  const [selectedItemId, setSelectedItemId] = useState<string>('p-1')

  const [finances, setFinances] = useState<FinancialItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vet_workspace_finances')
      if (saved) {
        try { return JSON.parse(saved) } catch (e) { /* fallback */ }
      }
    }
    return [
      { id: '1', description: 'Atendimento Clínico / Plantão', type: 'entrada', amount: 450.00, date: '24/08/2026' },
      { id: '2', description: 'Livro de Cirurgia Veterinária', type: 'saida', amount: 180.00, date: '22/08/2026' }
    ]
  })

  const [newDesc, setNewDesc] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [newType, setNewType] = useState<'entrada' | 'saida'>('entrada')

  // Salva automaticamente no navegador sempre que houver alteração
  useEffect(() => {
    localStorage.setItem('vet_workspace_items', JSON.stringify(items))
    localStorage.setItem('vet_workspace_finances', JSON.stringify(finances))
    setSaveStatus('Salvo com sucesso!')
    const timer = setTimeout(() => setSaveStatus('Salvo automaticamente'), 2000)
    return () => clearTimeout(timer)
  }, [items, finances])

  const selectedItem = items.find(i => i.id === selectedItemId && i.type === 'page') || items.find(i => i.type === 'page')

  const handleCreateFolder = (parentId: string | null = null) => {
    const name = prompt('Nome da nova pasta:')
    if (!name) return
    setItems([...items, { id: Date.now().toString(), title: name, parentId, type: 'folder', isOpen: true }])
  }

  const handleCreatePage = (parentId: string | null = null) => {
    const title = prompt('Título da nova página de estudo/pós:')
    if (!title) return
    const newPage: DocumentItem = {
      id: Date.now().toString(),
      title,
      parentId,
      type: 'page',
      content: 'Escreva seus resumos e anotações aqui...',
      attachments: []
    }
    setItems([...items, newPage])
    setSelectedItemId(newPage.id)
    setActiveTab('estudos')
  }

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = items.filter(i => i.id !== id && i.parentId !== id)
    setItems(updated)
    if (selectedItemId === id) {
      const first = updated.find(i => i.type === 'page')
      if (first) setSelectedItemId(first.id)
    }
  }

  const toggleFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setItems(items.map(i => i.id === id ? { ...i, isOpen: !i.isOpen } : i))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const fileUrl = URL.createObjectURL(file)
    const fileName = file.name
    const fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB'

    let fileType: 'image' | 'excel' | 'docx' | 'doc' = 'doc'
    const lower = fileName.toLowerCase()

    if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
      fileType = 'image'
    } else if (lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.csv')) {
      fileType = 'excel'
    } else if (lower.endsWith('.docx') || lower.endsWith('.doc')) {
      fileType = 'docx'
    }

    const newAttachment: AttachedFile = {
      id: Date.now().toString(),
      name: fileName,
      type: fileType,
      size: fileSize,
      url: fileUrl
    }

    setItems(items.map(i => {
      if (i.id === selectedItemId) {
        return { ...i, attachments: [...(i.attachments || []), newAttachment] }
      }
      return i
    }))

    e.target.value = ''
  }

  const handleRemoveAttachment = (attId: string) => {
    setItems(items.map(i => {
      if (i.id === selectedItemId) {
        return { ...i, attachments: (i.attachments || []).filter(a => a.id !== attId) }
      }
      return i
    }))
  }

  const renderTree = (parentId: string | null = null) => {
    return items.filter(i => i.parentId === parentId).map(item => {
      if (item.type === 'folder') {
        return (
          <div key={item.id} className="space-y-1 my-1">
            <div 
              onClick={(e) => toggleFolder(item.id, e)}
              className="group flex items-center justify-between px-2 py-1 rounded-md text-xs text-pink-800 hover:bg-pink-100/60 cursor-pointer font-medium transition"
            >
              <div className="flex items-center gap-1.5 truncate">
                <ChevronRight className={`w-3.5 h-3.5 text-pink-400 transition-transform ${item.isOpen ? 'rotate-90' : ''}`} />
                <Folder className="w-3.5 h-3.5 text-pink-500 fill-pink-100" />
                <span className="truncate">{item.title}</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                <Plus onClick={(e) => { e.stopPropagation(); handleCreatePage(item.id) }} className="w-3 h-3 text-pink-500 hover:text-pink-800" title="Nova página" />
                <Trash2 onClick={(e) => handleDeleteItem(item.id, e)} className="w-3 h-3 text-pink-400 hover:text-red-500" />
              </div>
            </div>
            {item.isOpen && <div className="pl-4 border-l border-pink-200 ml-2 space-y-1">{renderTree(item.id)}</div>}
          </div>
        )
      } else {
        return (
          <div 
            key={item.id}
            onClick={() => { setSelectedItemId(item.id); setActiveTab('estudos'); }}
            className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition ${selectedItemId === item.id && activeTab === 'estudos' ? 'bg-pink-200/80 text-pink-950 font-semibold shadow-xs' : 'text-pink-700/80 hover:bg-pink-100/50 hover:text-pink-950'}`}
          >
            <div className="flex items-center gap-2 truncate pl-3">
              <FileText className={`w-3.5 h-3.5 ${selectedItemId === item.id ? 'text-pink-600' : 'text-pink-400'}`} />
              <span className="truncate">{item.title}</span>
            </div>
            <button onClick={(e) => handleDeleteItem(item.id, e)} className="opacity-0 group-hover:opacity-100 text-pink-400 hover:text-red-500 p-0.5">
              <Trash2 className="w-3.5 h-3" />
            </button>
          </div>
        )
      }
    })
  }

  const handleAddFinancial = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDesc || !newAmount) return
    setFinances([{ id: Date.now().toString(), description: newDesc, type: newType, amount: parseFloat(newAmount), date: new Date().toLocaleDateString('pt-BR') }, ...finances])
    setNewDesc('')
    setNewAmount('')
  }

  const totalEntradas = finances.filter(f => f.type === 'entrada').reduce((acc, f) => acc + f.amount, 0)
  const totalSaidas = finances.filter(f => f.type === 'saida').reduce((acc, f) => acc + f.amount, 0)
  const saldoMes = totalEntradas - totalSaidas

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
          <button onClick={() => setActiveTab('documentos')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'documentos' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <FileText className="w-4 h-4" /> Documentos
          </button>
          <button onClick={() => setActiveTab('estudos')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'estudos' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <BookOpen className="w-4 h-4" /> Estudos & Pós
          </button>
          <button onClick={() => setActiveTab('tarefas')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'tarefas' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <CheckSquare className="w-4 h-4" /> Tarefas
          </button>
          <button onClick={() => setActiveTab('calendario')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'calendario' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <CalendarIcon className="w-4 h-4" /> Calendário
          </button>
          <button onClick={() => setActiveTab('financas')} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${activeTab === 'financas' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-900/70 hover:bg-pink-50'}`}>
            <DollarSign className="w-4 h-4" /> Finanças
          </button>

          <div className="pt-4 border-t border-pink-100 mt-4">
            <div className="flex items-center justify-between text-[11px] font-bold text-pink-400 uppercase tracking-wider px-2 mb-2">
              <span>Pastas da Pós</span>
              <div className="flex items-center gap-1">
                <Plus onClick={() => handleCreatePage(null)} className="w-3.5 h-3.5 cursor-pointer hover:text-pink-700" title="Nova Página" />
                <FolderPlus onClick={() => handleCreateFolder(null)} className="w-3.5 h-3.5 cursor-pointer hover:text-pink-700" title="Nova Pasta" />
              </div>
            </div>
            {renderTree(null)}
          </div>
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
              <h1 className="text-base font-extrabold text-pink-950 capitalize">Boa noite, Beatriz!</h1>
              <p className="text-xs text-pink-400 font-medium">Segunda-Feira, 24 De Agosto De 2026</p>
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
          {activeTab === 'painel' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Pós-graduações ativas</span>
                    <div className="text-2xl font-extrabold text-pink-950 mt-1">1</div>
                    <span className="text-[10px] text-pink-500 font-medium">Progresso: 35%</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500"><BookOpen className="w-5 h-5" /></div>
                </div>
                <div className="bg-white border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Tarefas pendentes</span>
                    <div className="text-2xl font-extrabold text-pink-950 mt-1">3</div>
                    <span className="text-[10px] text-pink-500 font-medium">Concluídas este mês</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500"><CheckSquare className="w-5 h-5" /></div>
                </div>
                <div className="bg-white border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Saldo do mês</span>
                    <div className="text-2xl font-extrabold text-pink-600 mt-1">R$ {saldoMes.toFixed(2)}</div>
                    <span className="text-[10px] text-pink-500 font-medium">Receitas: R$ {totalEntradas.toFixed(2)}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500"><TrendingUp className="w-5 h-5" /></div>
                </div>
                <div className="bg-white border border-pink-100 p-5 rounded-2xl shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-pink-400">Despesas do mês</span>
                    <div className="text-2xl font-extrabold text-rose-500 mt-1">R$ {totalSaidas.toFixed(2)}</div>
                    <span className="text-[10px] text-pink-500 font-medium">Gastos no período atual</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500"><TrendingDown className="w-5 h-5" /></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'estudos' && selectedItem && (
            <div className="max-w-4xl mx-auto bg-white border border-pink-100 p-10 rounded-2xl shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-pink-100 pb-4">
                <div className="flex-1 mr-4">
                  <span className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Módulo de Estudos & Pós</span>
                  <input 
                    type="text" 
                    value={selectedItem.title}
                    onChange={(e) => setItems(items.map(i => i.id === selectedItem.id ? { ...i, title: e.target.value } : i))}
                    className="w-full bg-transparent text-2xl font-extrabold text-pink-950 focus:outline-none mt-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => fileInputRef.current?.click()} className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer">
                    <Paperclip className="w-4 h-4" /> Anexar do PC
                  </button>
                  <button onClick={() => handleCreatePage(null)} className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Nova Página
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
                          <button onClick={() => handleRemoveAttachment(att.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50">
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
                placeholder="Insira os resumos da pós-graduação, artigos e anotações clínicas aqui..."
              />
            </div>
          )}

          {activeTab === 'financas' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-xl font-extrabold text-pink-950">Controle Financeiro da Beatriz</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-pink-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-pink-400">Entradas</span>
                  <div className="text-2xl font-extrabold text-pink-600 mt-1">R$ {totalEntradas.toFixed(2)}</div>
                </div>
                <div className="bg-white border border-pink-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-pink-400">Saídas</span>
                  <div className="text-2xl font-extrabold text-rose-500 mt-1">R$ {totalSaidas.toFixed(2)}</div>
                </div>
                <div className="bg-white border border-pink-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-pink-400">Saldo Líquido</span>
                  <div className="text-2xl font-extrabold text-pink-950 mt-1">R$ {saldoMes.toFixed(2)}</div>
                </div>
              </div>

              <div className="bg-white border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Novo Lançamento Financeiro</h3>
                <form onSubmit={handleAddFinancial} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input type="text" placeholder="Descrição" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                  <input type="number" step="0.01" placeholder="Valor (R$)" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" required />
                  <select value={newType} onChange={(e) => setNewType(e.target.value as 'entrada' | 'saida')} className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium">
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                  <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold transition shadow-md">Adicionar</button>
                </form>
              </div>

              <div className="bg-white border border-pink-100 rounded-2xl overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-pink-100 text-xs font-bold text-pink-900">Histórico de Transações</div>
                <div className="divide-y divide-pink-50">
                  {finances.map(f => (
                    <div key={f.id} className="px-6 py-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-pink-950">{f.description}</div>
                        <div className="text-[10px] text-pink-400">{f.date}</div>
                      </div>
                      <div className={`font-extrabold ${f.type === 'entrada' ? 'text-pink-600' : 'text-rose-500'}`}>
                        {f.type === 'entrada' ? '+' : '-'} R$ {f.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'documentos' || activeTab === 'tarefas' || activeTab === 'calendario') && (
            <div className="max-w-3xl mx-auto bg-white border border-pink-100 p-10 rounded-2xl shadow-xs text-center space-y-4">
              <h2 className="text-xl font-bold text-pink-950 capitalize">Módulo de {activeTab}</h2>
              <p className="text-xs text-stone-500">Esta seção está pronta para a rotina da Dra. Beatriz Contreiras.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}