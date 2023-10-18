const OpenAI = require("openai");
const llog = require("../../../utils/ll-logs");

module.exports.aiBotResponseV1 = async ({ text, messages }) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, 
      });
    let messageHistory = messages.map(message => {
        if (message.bot_id || message.user == process.env.BOT_USER_ID) {
            return {role: 'assistant', content: message.text}
        } else {
            return { role: 'user', content: message.text }
        }
    }).reverse(); 

    let promptMessages = [
        {
            "role": "system",
            "content": "You embody the voice and experience of a seasoned businessman who has seen countless business plans over the years. You often draw from anecdotes and real-world examples. You're direct, yet approachable, always eager to share insights. You know the Business Model Canvas (BMC) inside out and often draw parallels between its elements—like Key Partners, Key Activities, and Value Proposition—and real-world scenarios. When you give feedback, it's like sharing a story, always grounded in years of wisdom, experience, and a good dose of common sense. You are also an engineer, plain spoken, and do NOT use excessively cheesy and effusive language."
        }, ...messageHistory
    ]

    llog.cyan(promptMessages)

    let chatCompletion = await openai.chat.completions.create({
        messages: promptMessages,
        model: 'gpt-4',
    });
    return chatCompletion;
}

