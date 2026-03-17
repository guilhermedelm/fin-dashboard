// background/index.ts  


import { Storage } from "@plasmohq/storage"

const storage = new Storage({area:"local"})


chrome.runtime.onInstalled.addListener(() => {
  //console.log("onInstalled disparou")
  chrome.alarms.create("fetch-news", { periodInMinutes: 1 })
})

// ✅ Garante que o alarme existe toda vez que o SW acorda
chrome.alarms.get("fetch-news", (alarm) => {
  if (!alarm) {
    //console.log("Alarme não existia, criando...")
    chrome.alarms.create("fetch-news", { periodInMinutes: 1 })
  } else {
    //console.log("Alarme já existe:", alarm)
  }
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  //console.log("Alarme disparou:", alarm.name)
  if (alarm.name !== "fetch-news") return
  await fetchAndSave()
})

fetchAndSave()


chrome.runtime.onInstalled.addListener(() => {
    //console.log("addlistenercriado")
  chrome.alarms.create("fetch-news", {
    periodInMinutes: 1
  })
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
    //console.log("alarm created")
  if (alarm.name !== "fetch-news") return
  await fetchAndSave()
})

// Busca ao iniciar o service worker também
fetchAndSave()

async function fetchAndSave() {
  const syncresult = await chrome.storage.sync.get(["my-stocks", "last-links"])
  const localresult = await chrome.storage.local.get(["news-data"])
  //const stocks: string[] = result["my-stocks"] ?? []
  //const savedNews: Record<string, any[]> = result["notifications-by-news"] ?? {}
  //console.log("RAW notifications-by-news:", result["notifications-by-news"])
  
  let stocks: string[] = []
  try {
    const raw = syncresult["my-stocks"]
    stocks = typeof raw === "string" ? JSON.parse(raw) : raw ?? []
  } catch {
    stocks = []
  }

  let savedNews: Record<string, any[]> = {}
  try {
    const raw = localresult["news-data"]
    savedNews = typeof raw === "string" ? JSON.parse(raw) : raw ?? {}
  } catch {
    savedNews = {}
  }
  console.log("savedNews após parse:", JSON.stringify(savedNews))

  let lastLinks:Record<string,string> = {}
  try{
    const raw = syncresult["last-links"]
    console.log("RAW last-links:", raw, "tipo:", typeof raw)  // 👈
    lastLinks = typeof raw === "string" ? JSON.parse(raw) : raw?? {}
    console.log("lastLinks após parse:", lastLinks)  // 👈
  } catch {
    lastLinks = {}
  }
  //console.log("stocks:", stocks)
  if (stocks.length === 0) return

  for (const stock of stocks) {
    try {
        //console.log(stock)
      const response = await fetch(
        `https://news.google.com/rss/search?q=${stock}&hl=pt-BR&gl=BR&ceid=BR:pt-150`
      )
      const text = await response.text()
      const freshNews = parseRSS(text)

      // Verifica se há notícia nova
      const previousLink = lastLinks[stock]
      
      console.log(`previous link : ${previousLink}`)
      console.log(`novo link do fetch : ${freshNews[0].link}`)

      if (previousLink !== freshNews[0].link ) {
        //console.log(`message passed : ${savedNews[stock]}`)
        //console.log()
        chrome.notifications.create({
          type: "basic",
          iconUrl: chrome.runtime.getURL("icon16.plasmo.9f44d99c.png"),
          title: stock,
          message: freshNews[0].title   
        })
        lastLinks[stock] = freshNews[0].link
        await chrome.storage.sync.set({"last-links":lastLinks})
      }

      savedNews[stock] = freshNews

      console.log()


    } catch (error) {
      console.error(`Erro ao buscar notícias de ${stock}:`, error)
    }
  }

  // Salva tudo de uma vez no storage
  //await chrome.storage.local.set({ "news-data": savedNews })
  await storage.set ("news-data", savedNews)
}

function parseRSS(xml: string) {
  const items = xml.split("<item>").slice(1)

  const news = items.map((item) => {
    const getTag = (tag: string) => {
      const match = item.match(new RegExp(`<${tag}>(.*?)</${tag}>`))
      return match ? match[1] : ""
    }

    const pubDate = getTag("pubDate")

    return {
      title: getTag("title"),
      link: getTag("link"),
      description: getTag("description"),
      pubDate,
      timestamp: new Date(pubDate).getTime()
    }
  })

  return news.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5)
}