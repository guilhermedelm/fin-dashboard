import type { PlasmoMessaging } from "~node_modules/@plasmohq/messaging/";


const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    
    const { title, message } = req.body

    chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icon.png"),
        title: title,
        message: message
    })

  res.send({ success: true })
}

export default handler 