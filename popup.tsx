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
    <div className="flex flex-col items-center p-6 w-80 bg-slate-900 text-slate-300 text-center">
      <div className="flex justify-end w-full mb-2">
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
      </div>
      <div className="w-16 h-16 bg-blue-600 rounded-full mb-4 flex items-center justify-center">
        <span className="text-2xl">📈</span>
      </div>
      <h1 className="text-xl font-bold">FinDash UnB</h1>
      <p className="text-sm text-slate-400 mt-2">
        O seu terminal financeiro pessoal. Notícias em tempo real e análise de mercado.
      </p>

      {/* Input para adicionar stock */}
      <div className="flex gap-2 mt-4 w-full">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addStock()}  
          placeholder="Ex: PETR4, AAPL..."
          className="flex-1 px-3 py-2 rounded-lg bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-300 text-sm outline-none"
        />
        <button
          onClick={addStock}
          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-semibold transition-all">
          +
        </button>
      </div>

      {/* Lista de stocks adicionados */}
      <div className="flex flex-wrap gap-2 mt-3 w-full">
        {stocks.map((ticker) => (
          <span
            key={ticker}
            className="flex items-center gap-1 px-2 py-1 bg-slate-700 rounded-full text-xs">
            {ticker}
            <button
              onClick={() => removeStock(ticker)}
              className="text-slate-400 hover:text-red-400 transition-all">
              ✕
            </button>
          </span>
        ))}
      </div>

      <button
        onClick={onFinish}
        className="mt-6 w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all">
        Começar agora
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
      console.log("RAW storage:", result)
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
          {(news[selectedStock || stocks[0]] ?? []).map((item , index:number) => (
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
            </a>
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

