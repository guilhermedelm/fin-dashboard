

/// <reference types="chrome" />

import { Storage } from "@plasmohq/storage"

const storage = new Storage({area:"local"})


chrome.runtime.onInstalled.addListener(() => {
  
  chrome.alarms.create("fetch-news", { periodInMinutes: 1 })
  chrome.alarms.create("fetch-prices", { periodInMinutes: 1 / 6 })
})

// ✅ Garante que o alarme existe toda vez que o SW acorda
chrome.alarms.get("fetch-news", (alarm) => {
  if (!alarm) {
  
    chrome.alarms.create("fetch-news", { periodInMinutes: 1 })
  } else {
   
  }
})
chrome.alarms.get("fetch-prices", (alarm) => {
  if (!alarm) {
   
    chrome.alarms.create("fetch-prices", { periodInMinutes: 1 / 6 })
  } else {
   
  }
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  
  if (alarm.name === "fetch-news") 
    await fetchAndSave()
  //if (alarm.name === "fetch-prices")
    //await fetchAndSavePrices()
  else return
})

//Atualizar ao mudar as ações também
chrome.storage.onChanged.addListener((changes, areaName) => {
  // Verifica se a mudança ocorreu no storage "sync" e se a chave "my-stocks" foi alterada
  if (areaName === "sync" && changes["my-stocks"]) {

    fetchAndSave()
  }
})

// Busca ao iniciar o service worker também
fetchAndSave()

async function fetchAndSavePrices() {return}

async function fetchAndSave() {
  const syncresult = await chrome.storage.sync.get(["my-stocks", "last-links"])
  const localresult = await chrome.storage.local.get(["news-data"])
  //const stocks: string[] = result["my-stocks"] ?? []
  //const savedNews: Record<string, any[]> = result["notifications-by-news"] ?? {}

  
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
  for (const key in savedNews) {
    if (!stocks.includes(key)) {
      delete savedNews[key]
    }
  }
  let lastLinks:Record<string,string> = {}
  try{
    const raw = syncresult["last-links"]

    lastLinks = typeof raw === "string" ? JSON.parse(raw) : raw?? {}

  } catch {
    lastLinks = {}
  }

  if (stocks.length === 0) return

  for (const stock of stocks) {
    try {

      const response = await fetch(
        `https://news.google.com/rss/search?q=${stock}&hl=pt-BR&gl=BR&ceid=BR:pt-150`
      )
      const text = await response.text()
      const freshNews = parseRSS(text)

      // Verifica se há notícia nova
      const previousLink = lastLinks[stock]
      
      if (!freshNews || freshNews.length === 0){
        return
        
      }

      if (previousLink !== freshNews[0].link ) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: chrome.runtime.getURL("./public/icon.png"),
          title: stock,
          message: freshNews[0].title   
        })
        lastLinks[stock] = freshNews[0].link
        await chrome.storage.sync.set({"last-links":lastLinks})
      }

      savedNews[stock] = freshNews



    } catch (error) {
      console.error(`Erro ao buscar notícias de ${stock}:`, error)
    }
  }
  // Salva tudo de uma vez no storage
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