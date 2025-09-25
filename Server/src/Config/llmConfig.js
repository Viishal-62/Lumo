import { ChatGroq } from "@langchain/groq";
import {TavilySearch} from "@langchain/tavily"
import {ChatGoogleGenerativeAI} from "@langchain/google-genai"
import { ENV } from "./envConfig.js";
import { createEvent, createSheet, deleteEvent, deleteSheet, editEvent, getEvents, getSheet, updateSheet , getEmails, createPlaylist,  llmEmailAutomation, generatePdf } from "./CustomTools.config.js";


let tavilySearch = new TavilySearch({
  tavilyApiKey : ENV.TAVILY,
  maxResults : 3
})

const tools = [createEvent, getEvents , deleteEvent , editEvent , createSheet , deleteSheet  , updateSheet , getSheet , getEmails , createPlaylist , llmEmailAutomation , generatePdf , tavilySearch];  

// return model bound with tools
const LLM = async () => {
  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-pro",
    apiKey : ENV.GEMINI_API_KEY,
    temperature: 0,
    maxRetries: 3,
 
  }).bindTools(tools);
};

export { tools, LLM };
