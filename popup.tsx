import { useEffect, useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
import { sendToBackground } from "@plasmohq/messaging"
import "./style.css"





function IntroPopup({ onFinish, stocks, setStocks,setNotifications }){

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
    <div className="flex flex-col items-center p-6 w-80 bg-slate-900 text-white text-center">
      <div className="w-16 h-16 bg-blue-600 rounded-full mb-4 flex items-center justify-center">
        <span className="text-2xl">📈</span>
      </div>
      <h1 className="text-xl font-bold">FinDash UnB</h1>
      <p className="text-sm text-slate-400 mt-2">
        O teu terminal financeiro pessoal. Notícias em tempo real e análise de mercado.
      </p>

      {/* Input para adicionar stock */}
      <div className="flex gap-2 mt-4 w-full">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addStock()}
          placeholder="Ex: PETR4, AAPL..."
          className="flex-1 px-3 py-2 rounded-lg bg-slate-700 text-white text-sm outline-none"
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

function DashboardPopup({ stocks, setHasSeenIntro, news, setNews }) {
  const [data, setData] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newsByStock, setNewsByStock] = useState<Record<string, any[]>>({})
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

  console.log(news)



  return (
    <div className="p-4 w-80 bg-slate-50 text-slate-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Mercado Hoje</h2>
        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded">AO VIVO</span>
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
              selectedStock === stock ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-700"
            }`}>
            {stock}
          </button>
        ))}
      </div>

       {/* Lista de notícias da stock selecionada */}
        <div className="space-y-3">
          {loading && <p className="text-sm text-slate-400">Carregando...</p>}
          {(news[selectedStock] ?? []).map((item , index) => (
            <a
              key={index} // Agora está dentro da tag de abertura
              href={item.link}
              target="_blank"
              rel="noopener noreferrer" // Boa prática de segurança para target="_blank"
              className="block p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-300 transition-all mb-3"
            >
              <p className="text-xs font-semibold text-blue-600">{selectedStock}</p>
              <p className="text-sm font-medium text-slate-800">{item.title}</p>
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



  const [stocks,setStocks] = useStorage("my-stocks",[])
  const [news, setNews] = useStorage({
    key: "news-data",
    instance: new Storage({ area: "local" }) // 👈 especifica local
  }, {})
  // const [news,setNews] = useStorage("news-data",new Map())
  const [lastNews,setLastnews] = useStorage("last-links",new Map())
  const [ hasSeenIntro, setHasSeenIntro ] = useStorage("has-seen-intro", false)

  useEffect(() => {
    console.log("chrome objeto:", chrome)
    console.log("chrome.alarms:", chrome?.alarms)
  }, [])

  if (!hasSeenIntro || stocks.length === 0){
    return <IntroPopup
             stocks = {stocks}
             setStocks={setStocks}
             setNotifications = {setNews}
             onFinish={() => setHasSeenIntro(true)} 
             />
  }
  return <DashboardPopup 
            stocks = {stocks}
            setHasSeenIntro = {setHasSeenIntro}
            news = {news}
            setNews={setNews}
           />
}

