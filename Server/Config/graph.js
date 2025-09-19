// workFlow(graph).config.js
import { END, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { LLM, tools } from "./llmConfig.js";
import { MemorySaver } from "@langchain/langgraph";
import readline from "readline-sync";

const toolNodes = new ToolNode(tools);
const memory = new MemorySaver(); // saves chat context across turns

// decide whether to call tools or end conversation
async function shouldContinue(state) {
  const lastMessage = state.messages[state.messages.length - 1];
  return lastMessage.tool_calls?.length ? "toolNode" : "__end__";
}

// call LLM and append response to state
async function callModel(state) {
  const model = await LLM();
  const response = await model.invoke(state.messages);
  return { messages: [response] }; //  append messages
}

// build state graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("callModel", callModel)
  .addNode("toolNode", toolNodes)
  .addEdge("__start__", "callModel")
  .addEdge("toolNode", "callModel")
  .addConditionalEdges("callModel", shouldContinue, {
    "__end__": END,
    toolNode: "toolNode",
  });

const app = workflow.compile({
  checkpointer: memory, //enable memory for multi-turn conversation
});

// interactive CLI run loop
async function run() {
  console.log("🚀 Welcome to Lumo AI Backend (CLI Mode)");

  while (true) {
    const query = readline.question("Enter your query: ");
    if (query.toLowerCase() === "exit") {
      console.log("👋 Goodbye!");
      break;
    }

    try {
      const response = await app.invoke(
        {
          messages: [
            {
              role: "system",
              content: `You are a helpful AI named Lumo AI. Reply concisely and call tools if needed. Current time: ${new Date().toLocaleString("sv-SE").replace(" ", "T")}`,
            },
            { role: "user", content: query },
          ],
        },
        {
          configurable: { thread_id: "1" }, // keeps memory in same thread
        }
      );
        
   
      console.log("AI Response ❤️ :", response?.messages.at(-1)?.content);
    } catch (error) {
      console.log("Workflow Error:", error);
    }
  }
}

await run();
