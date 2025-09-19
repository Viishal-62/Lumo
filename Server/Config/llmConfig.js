import { ChatGroq } from "@langchain/groq";
import { ENV } from "./envConfig.js";
import { createEvent, getEvents } from "./CustomTools.config.js";

const tools = [createEvent, getEvents]; // list of custom tools

// return model bound with tools
const LLM = async () => {
  return new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: ENV.GROQ,
    temperature: 0,
    maxRetries: 3,
  }).bindTools(tools);
};

export { tools, LLM };
