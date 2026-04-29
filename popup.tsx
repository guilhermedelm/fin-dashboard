import { useEffect, useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
import { sendToBackground } from "@plasmohq/messaging"
import "./style.css"





interface IntroPopupProps {
  onFinish: () => void
  stocks: string[]
  setStocks: (value: string[]) => Promise<void>;
  darkMode: boolean
  setdarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

function IntroPopup({ onFinish, stocks, setStocks, darkMode, setdarkMode }: IntroPopupProps){

  const [inputValue,setInputValue] = useState("")

  const addStock = () => {
    const ticker = inputValue.trim().toUpperCase()
    if (!ticker || stocks.includes(ticker)) return
    setStocks([...stocks, ticker])
    setInputValue("")
  }



  const removeStock = (ticker: string) => {
    setStocks(stocks.filter((s) => s !== ticker))
  }
return (
  <div className="p-6 w-80 bg-slate-300 text-slate-900 dark:bg-slate-900 dark:text-slate-300">
    {/* Header: badge + toggle dark mode */}
    <div className="flex justify-between items-center mb-5">
      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-semibold tracking-wide">
        BEM-VINDO
      </span>
      <button
        type="button"
        onClick={() => setdarkMode(!darkMode)}
        aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
        title={darkMode ? "Modo claro" : "Modo escuro"}
        className="font-medium rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <span className="group inline-flex shrink-0 justify-center items-center size-9">
          {darkMode ? (
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2"/><path d="M12 20v2"/>
              <path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>
              <path d="M2 12h2"/><path d="M20 12h2"/>
              <path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
            </svg>
          ) : (
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          )}
        </span>
      </button>
    </div>

    {/* Branding */}
    <div className="flex flex-col items-center text-center mb-6">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl mb-3 flex items-center justify-center shadow-lg shadow-blue-500/20">
        <span className="text-3xl">📈</span>
      </div>
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">FinDash UnB</h1>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed px-2">
        O seu terminal financeiro pessoal. Notícias em tempo real e análise de mercado.
      </p>
    </div>

    {/* Seção: adicionar ativos */}
    <div className="mb-5">
      <label
        htmlFor="ticker-input"
        className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2"
      >
        Acompanhar ativos
      </label>
      <div className="flex gap-2">
        <input
          id="ticker-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addStock()}
          placeholder="Ex: PETR4, AAPL..."
          className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 text-sm border border-slate-200 dark:border-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
        <button
          onClick={addStock}
          aria-label="Adicionar ativo"
          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm shadow-blue-500/20 transition-all"
        >
          +
        </button>
      </div>

      {/* Lista de stocks adicionados */}
      {stocks.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {stocks.map((ticker) => (
            <span
              key={ticker}
              className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-xs font-medium text-slate-700 dark:text-slate-200"
            >
              {ticker}
              <button
                onClick={() => removeStock(ticker)}
                aria-label={`Remover ${ticker}`}
                className="flex items-center justify-center size-4 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-500/20 transition-all"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-2 italic">
          Nenhum ativo adicionado ainda.
        </p>
      )}
    </div>

    {/* CTA principal */}
    <button
      onClick={onFinish}
      className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
    >
      Começar agora →
    </button>
  </div>
)

}

  interface NewsArticles {
    title: string
    link: string
    description: string
    pubDate: string
    timestamp: number
  }

interface DashboardPopupProps {
  stocks: string[]
  setHasSeenIntro: (value: boolean | ((v?: boolean, isHydrated?: boolean) => boolean)) => Promise<void>;
  news: Record<string,NewsArticles[]>
  setNews: React.Dispatch<React.SetStateAction<Record<string,NewsArticles[]>>>
  darkMode: boolean
  setdarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

function DashboardPopup({ stocks, setHasSeenIntro, news, darkMode, setdarkMode }: DashboardPopupProps) {
 
  const [loading, setLoading] = useState(false)
  const [selectedStock, setSelectedStock] = useState<string>("")
  


  const insertAcao = () => {
    setHasSeenIntro(false)
  }

  //TERMINAR FUNCAO DE BUSCAR NOTICIAS, EXPLICACAO NO GEMINI E INTEGRAR COM O HTML
  useEffect(() => {
    chrome.storage.sync.get([ "my-stocks"], (result) => {
      //console.log("RAW storage:", result)
    })
    chrome.storage.local.get(["news-data"])
  }, [news])





  return (
    <div className="p-4 w-80 bg-slate-300 text-slate-900 dark:bg-slate-900 dark:text-slate-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Mercado Hoje</h2>
        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded">AO VIVO</span>
        <button
          type="button"
          onClick={() => setdarkMode(!darkMode)}
          className="font-medium text-foreground rounded-full hover:bg-surface-hover focus:outline-hidden focus:bg-surface-focus"
        >
          <span className="group inline-flex shrink-0 justify-center items-center size-9">
            {darkMode ? (
              // Ícone Sol (modo claro)
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2"/><path d="M12 20v2"/>
                <path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>
                <path d="M2 12h2"/><path d="M20 12h2"/>
                <path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
              </svg>
            ) : (
              // Ícone Lua (modo escuro)
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            )}
          </span>
        </button>
        <button
          onClick={insertAcao}
          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-semibold transition-all">
          +
        </button>
      </div>
    
      {/* Abas para selecionar a stock */}
      <div className="flex gap-2 mb-3">
        {stocks.map((stock) => (
          <button
            key={stock}
            onClick={() => setSelectedStock(stock)}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              selectedStock === stock ? "bg-blue-500 text-slate-300" : "bg-slate-200 text-slate-700"
            }`}>
            {stock}
          </button>
        ))}
      </div>

       {/* Lista de notícias da stock selecionada */}
        <div className="space-y-3">
          {loading && <p className="text-sm text-slate-400 dark:text-slate-300">Carregando...</p>}
          {(news[selectedStock] ?? []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-slate-400">Nenhuma notícia encontrada</p>
              </div>

              
            ) : (
          
          
          (news[selectedStock] ?? []).map((item , index:number) => (
            <a
              key={index} // Agora está dentro da tag de abertura
              href={item.link}
              target="_blank"
              rel="noopener noreferrer" // Boa prática de segurança para target="_blank"
              className="block p-3 bg-slate-300 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm hover:border-blue-300 transition-all mb-3"
            >
              <p className="text-xs font-semibold text-blue-600">{selectedStock}</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-300">{item.title}</p>
              <p className="text-[10px] text-slate-400 mt-1">
                {new Date(item.pubDate).toLocaleDateString("pt-BR")}
              </p>
            </a>)
          ))}
 
            </div>
    </div>
  )
}

export default function IndexPopup() {



  const [darkMode,setdarkMode] = useState(true)
  const [stocks,setStocks] = useStorage<string[]>("my-stocks",[])
  const [news, setNews] = useStorage({
    key: "news-data",
    instance: new Storage({ area: "local" }) // 👈 especifica local
  }, {})

  const [ hasSeenIntro, setHasSeenIntro ] = useStorage("has-seen-intro", false)

  //mecânica para aplicar o dark mode, adicionando ou removendo a classe "dark" do html
  useEffect(() => {
    if (darkMode){
      document.documentElement.classList.add("dark")
    }
    else{
      document.documentElement.classList.remove("dark") 
    }
  },[darkMode])

  if (!hasSeenIntro || stocks.length === 0){
    return <IntroPopup
             stocks = {stocks}
             setStocks={setStocks}
             onFinish={() => setHasSeenIntro(true)} 
             darkMode={darkMode}
             setdarkMode={setdarkMode}
             />
  }
  return <DashboardPopup 
            stocks = {stocks}
            setHasSeenIntro = {setHasSeenIntro}
            news = {news}
            setNews={setNews}
            darkMode={darkMode}
            setdarkMode={setdarkMode}

           />
}

