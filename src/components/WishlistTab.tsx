'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Gift,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Image as ImageIcon,
  ExternalLink,
  ClipboardPaste,
  X,
  RefreshCw
} from 'lucide-react'

interface WishItem {
  id: string
  title: string
  price: string
  url: string
  imageUrl?: string
  purchased: boolean
}

const WISHLIST_STORAGE_KEY = 'vet_wishlist'
const LEGACY_WISHLIST_STORAGE_KEY = 'beatriz_wishlist_v2'

const readWishlistStorage = (): WishItem[] => {
  if (typeof window === 'undefined') return []

  const readKey = (key: string): WishItem[] => {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const current = readKey(WISHLIST_STORAGE_KEY)
  if (current.length > 0) return current

  // Migra automaticamente a lista antiga para a chave usada pelo page.tsx/Supabase.
  const legacy = readKey(LEGACY_WISHLIST_STORAGE_KEY)
  if (legacy.length > 0) {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(legacy))
    return legacy
  }

  return []
}

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'))
    reader.onload = () => resolve(String(reader.result || ''))
    reader.readAsDataURL(file)
  })

const prepareWishlistImage = async (file: File): Promise<string> => {
  if (!file.type.startsWith('image/')) {
    throw new Error('Escolha ou cole uma imagem válida.')
  }

  if (file.size > 15 * 1024 * 1024) {
    throw new Error('A imagem ultrapassa 15 MB. Use uma imagem menor.')
  }

  const original = await fileToDataUrl(file)

  return new Promise<string>((resolve, reject) => {
    const image = new Image()

    image.onerror = () => reject(new Error('Não foi possível abrir a imagem.'))
    image.onload = () => {
      // Mantém o print nítido, mas reduz o peso para localStorage + Supabase.
      const maxSide = 1200
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

      const outputMime = file.type === 'image/png' && file.size < 1_500_000
        ? 'image/png'
        : 'image/jpeg'

      const dataUrl = outputMime === 'image/png'
        ? canvas.toDataURL('image/png')
        : canvas.toDataURL('image/jpeg', 0.86)

      resolve(dataUrl)
    }

    image.src = original
  })
}

export default function WishlistTab() {
  const [items, setItems] = useState<WishItem[]>(readWishlistStorage)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [url, setUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isPreparingImage, setIsPreparingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Esta é a mesma chave observada pelo page.tsx.
    // O page.tsx envia o conteúdo dela para o registro dedicado da Wish List no Supabase.
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const setPreparedImage = async (file: File) => {
    try {
      setIsPreparingImage(true)
      const prepared = await prepareWishlistImage(file)
      setImageUrl(prepared)
    } catch (error: any) {
      alert(error instanceof Error ? error.message : 'Não foi possível preparar a imagem.')
    } finally {
      setIsPreparingImage(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    await setPreparedImage(file)
  }

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const imageFile = Array.from(e.clipboardData?.items || [])
      .find(item => item.kind === 'file' && item.type.startsWith('image/'))
      ?.getAsFile()

    // Se for texto/link, não interfere no Ctrl + V normal dos inputs.
    if (!imageFile) return

    e.preventDefault()
    await setPreparedImage(imageFile)
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || isPreparingImage) return

    const newItem: WishItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: title.trim(),
      price: price.trim(),
      url: url.trim(),
      imageUrl: imageUrl.trim(),
      purchased: false
    }

    setItems(prev => [newItem, ...prev])
    setTitle('')
    setPrice('')
    setUrl('')
    setImageUrl('')
  }

  const togglePurchased = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    )
  }

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div
      className="max-w-4xl mx-auto space-y-6"
      onPaste={handlePaste}
    >
      <div className="flex items-center gap-3 border-b border-pink-100 pb-4 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm">
          <Gift className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-extrabold text-pink-950">
            Lista de Desejos de Beatriz Contreiras 🎁
          </h2>
          <p className="text-xs text-pink-500 font-medium">
            Guarde desejos, links, preços e fotos. Você também pode colar um print direto com Ctrl + V.
          </p>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-md border border-pink-100 p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider">
              Adicionar novo item
            </h3>
            <p className="text-[10px] text-stone-400 mt-1">
              Tire um print com Win + Shift + S e pressione Ctrl + V nesta área.
            </p>
          </div>

          <div className={`text-[10px] font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${
            imageUrl
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-violet-50 text-violet-700 border-violet-200'
          }`}>
            <ClipboardPaste className="w-3.5 h-3.5" />
            {imageUrl ? 'Print pronto ✓' : 'Ctrl + V para colar print'}
          </div>
        </div>

        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="O que você quer comprar/ganhar?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="md:col-span-2 bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none focus:border-pink-400 font-medium"
              required
            />
            <input
              type="text"
              placeholder="Preço (Ex: R$ 150,00)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none focus:border-pink-400 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <input
              type="text"
              placeholder="Link do produto (opcional)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="md:col-span-2 bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-pink-950 focus:outline-none focus:border-pink-400 font-medium"
            />

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
              <button
                type="button"
                disabled={isPreparingImage}
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-pink-50 hover:bg-pink-100 disabled:opacity-50 text-pink-700 border border-pink-200 rounded-xl py-2.5 px-3 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isPreparingImage ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-pink-500" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-pink-500" />
                )}
                {isPreparingImage
                  ? 'Preparando...'
                  : imageUrl
                    ? 'Trocar foto'
                    : 'Anexar foto'}
              </button>
            </div>
          </div>

          {imageUrl && (
            <div className="bg-pink-50/60 border border-pink-200 rounded-2xl p-3">
              <div className="flex items-start gap-3">
                <img
                  src={imageUrl}
                  alt="Prévia do desejo"
                  className="w-28 h-28 object-cover rounded-xl border border-pink-200 bg-white shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-extrabold text-pink-950">
                    Imagem pronta para este item
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1 leading-relaxed">
                    A imagem foi reduzida para ficar mais leve e será salva junto do item,
                    permitindo que a sincronização envie a foto para os outros dispositivos.
                  </div>

                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="mt-3 inline-flex items-center gap-1.5 bg-white border border-pink-200 hover:bg-rose-50 text-rose-600 px-2.5 py-1.5 rounded-lg text-[10px] font-bold"
                  >
                    <X className="w-3.5 h-3.5" />
                    Remover imagem
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isPreparingImage || !title.trim()}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3 text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Adicionar à Lista de Desejos
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
            <div
              key={item.id}
              className={`bg-white/95 backdrop-blur-md border p-4 rounded-2xl shadow-xs flex items-center justify-between transition ${
                item.purchased
                  ? 'border-emerald-200 bg-emerald-50/30 opacity-75'
                  : 'border-pink-100'
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => togglePurchased(item.id)}
                  className="text-pink-500 hover:text-pink-700 transition cursor-pointer shrink-0"
                  title={item.purchased ? 'Marcar como não comprado' : 'Marcar como comprado'}
                >
                  {item.purchased ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-pink-300" />
                  )}
                </button>

                {item.imageUrl ? (
                  <button
                    type="button"
                    onClick={() => window.open(item.imageUrl, '_blank')}
                    className="shrink-0"
                    title="Abrir imagem"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover border border-pink-200 hover:scale-105 transition bg-white"
                    />
                  </button>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5 text-pink-300" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div
                    className={`text-xs font-bold truncate ${
                      item.purchased
                        ? 'line-through text-stone-400'
                        : 'text-pink-950'
                    }`}
                  >
                    {item.title}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    {item.price && (
                      <span className="text-[11px] font-extrabold text-pink-600">
                        {item.price}
                      </span>
                    )}

                    {item.url && (
                      <a
                        href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-pink-500 hover:underline flex items-center gap-1 min-w-0"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span>Acessar link</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                className="text-stone-400 hover:text-red-500 p-1.5 ml-2 cursor-pointer shrink-0"
                title="Excluir item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
