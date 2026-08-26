'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Gift, Plus, Trash2, CheckCircle2, Circle, Image as ImageIcon, ExternalLink } from 'lucide-react'

interface WishItem {
  id: string
  title: string
  price: string
  url: string
  imageUrl?: string
  purchased: boolean
}

export default function WishlistTab() {
  const [items, setItems] = useState<WishItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('beatriz_wishlist_v2')
      if (saved) { try { return JSON.parse(saved) } catch (e) {} }
    }
    return []
  })
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [url, setUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    localStorage.setItem('beatriz_wishlist_v2', JSON.stringify(items))
  }, [items])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      setImageUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const newItem: WishItem = {
      id: Date.now().toString(),
      title: title.trim(),
      price: price.trim(),
      url: url.trim(),
      imageUrl: imageUrl.trim(),
      purchased: false
    }
    setItems([newItem, ...items])
    setTitle('')
    setPrice('')
    setUrl('')
    setImageUrl('')
  }

  const togglePurchased = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, purchased: !item.purchased } : item))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-pink-100 pb-4 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm">
          <Gift className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-pink-950">Lista de Desejos de Beatriz Contreiras 🎁</h2>
          <p className="text-xs text-pink-500 font-medium">Guarde seus desejos, links, preços e fotos dos produtos para uso pessoal ou profissional</p>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Adicionar Novo Item com Foto</h3>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input 
              type="text" 
              placeholder="O que você quer comprar/ganhar?" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="md:col-span-2 bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" 
              required 
            />
            <input 
              type="text" 
              placeholder="Preço (Ex: R$ 150,00)" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <input 
              type="text" 
              placeholder="Link do produto (opcional)" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              className="md:col-span-2 bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none font-medium" 
            />
            <div className="flex items-center gap-2">
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                className="w-full bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-xl py-2.5 px-3 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-pink-500" /> {imageUrl ? 'Foto Anexada ✓' : 'Anexar Foto'}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-xl py-3 text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
            <Plus className="w-4 h-4" /> Adicionar à Lista de Desejos
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-8 rounded-3xl text-center text-xs text-stone-400">
            Sua lista de desejos está vazia. Adicione o primeiro item acima!
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className={`bg-white/95 backdrop-blur-md border p-4 rounded-2xl shadow-xs flex items-center justify-between transition ${item.purchased ? 'border-emerald-200 bg-emerald-50/30 opacity-75' : 'border-pink-100'}`}>
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <button onClick={() => togglePurchased(item.id)} className="text-pink-500 hover:text-pink-700 transition cursor-pointer">
                  {item.purchased ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Circle className="w-5 h-5 text-pink-300" />}
                </button>

                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded-xl object-cover border border-pink-200 shrink-0" />
                )}

                <div className="min-w-0 flex-1">
                  <div className={`text-xs font-bold truncate ${item.purchased ? 'line-through text-stone-400' : 'text-pink-950'}`}>
                    {item.title}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {item.price && <span className="text-[11px] font-extrabold text-pink-600">{item.price}</span>}
                    {item.url && (
                      <a href={item.url.startsWith('http') ? item.url : `https://${item.url}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-pink-500 hover:underline flex items-center gap-1 truncate">
                        <ExternalLink className="w-3 h-3" /> Acessar Link
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => deleteItem(item.id)} className="text-stone-400 hover:text-red-500 p-1.5 ml-2 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}