// // workFlow(graph).config.js
// import { END, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
// import { ToolNode } from "@langchain/langgraph/prebuilt";
// import { LLM, tools } from "./llmConfig.js";
// import { MemorySaver } from "@langchain/langgraph";
// import crypto from "crypto";
 
 

// const toolNodes = new ToolNode(tools);
// const memory = new MemorySaver(); // saves chat context across turns

// // decide whether to call tools or end conversation
// async function shouldContinue(state) {
//   const lastMessage = state.messages[state.messages.length - 1];
//   return lastMessage.tool_calls?.length ? "toolNode" : "__end__";
// }

// // call LLM and append response to state
// async function callModel(state) {
//   const model = await LLM();
//   const response = await model.invoke(state.messages);
//   return { messages: [response] }; //  append messages
// }

// // build state graph
// const workflow = new StateGraph(MessagesAnnotation)
//   .addNode("callModel", callModel)
//   .addNode("toolNode", toolNodes)
//   .addEdge("__start__", "callModel")
//   .addEdge("toolNode", "callModel")
//   .addConditionalEdges("callModel", shouldContinue, {
//     "__end__": END,
//     toolNode: "toolNode",
//   });

// const app = workflow.compile({
//   checkpointer: memory, //enable memory for multi-turn conversation
// });

// // interactive CLI run loop
// export async function run(req, res) {
//   console.log("🚀 Welcome to Lumo AI Backend");
//   console.log(req.body)

//   const email = req.user?.email;

//   const {message : query , sessionId} = req.body;


//   if (query.toLowerCase() === "exit") {
//     return res.status(200).json({ success: true, message: "Goodbye!" });
//   }

//   try {
//     // 🔑 Generate a new thread_id per request (reset memory on refresh)
    

//     // Don't load any previous memory (start fresh)
//     const messagesToSend = [
//     {
//   role: "system",
//   content: `You are a helpful AI named Lumo AI. 
// Reply concisely in 100–150 words max for normal answers. 

// if user asks for a list, provide it in bullet points.
// If user asks for a step-by-step guide, provide it in numbered steps.
// if user ask for resource, provide some youtube videos also .

// When calling tools, strictly follow their schema:
// - Always return a valid JSON object for tool arguments.
// - Do not include extra keys outside the schema.
// - Do not add comments, explanations, or natural language around JSON.
// - Ensure correct syntax: matching brackets, double quotes, no trailing commas.

// If user asks for create PDF, generate sheet, or any tool action,
// output arguments that exactly match the tool schema, nothing more.

// Current time: ${new Date().toLocaleString("sv-SE").replace(" ", "T")}`
// },

//       { role: "user", content: query },
//     ];

//     // Invoke the workflow with NEW thread_id
//     const response = await app.invoke(
//       { messages: messagesToSend },
//       { configurable: { thread_id: sessionId }, context: { email } }
//     );

//     res.status(200).json({
//       success: true,
//       response: response?.messages.at(-1)?.content,
//     });
//   } catch (error) {
//     console.log("Workflow Error:", error);
//     if (error.code === "rate_limit_exceeded") {
//       const waitTime = parseFloat(error.headers["retry-after"]) || 5;
//       return res.status(429).json({
//         success: false,
//         message: `Please try again in ${waitTime}s`,
//       });
//     }
//   }
// }

 

// workFlow(graph).config.js
import { END, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { LLM, tools } from "./llmConfig.js";
import { MemorySaver } from "@langchain/langgraph";

const toolNodes = new ToolNode(tools);
const memory = new MemorySaver();

async function shouldContinue(state) {
  const lastMessage = state.messages[state.messages.length - 1];
  return lastMessage.tool_calls?.length ? "toolNode" : "__end__";
}

async function callModel(state) {
  const model = await LLM();
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

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
  checkpointer: memory,
});

export async function run(req, res) {
  console.log("🚀 Lumo AI Backend");
  console.log(req.body);

  const email = req.user?.email;
  const { message: query, sessionId } = req.body;

  if (query.toLowerCase() === "exit") {
    return res.status(200).json({ success: true, message: "Goodbye!" });
  }

  try {
    
    const previousState = await memory.get(sessionId);
    const history = (previousState?.messages || [])
      .filter(m => m.role !== "system"); // drop old system messages

    // Build system prompt
    const systemPrompt = `You are a helpful AI named Lumo AI.
Reply concisely in 100–150 words max for normal answers.

If user asks for a list, provide it in bullet points.
If user asks for a step-by-step guide, provide it in numbered steps.
If user asks for resources, include relevant YouTube links.

When calling tools, strictly follow their schema:
- Always return a valid JSON object for tool arguments.
- No extra keys outside the schema.
- No comments, explanations, or natural language around JSON.
- Ensure correct syntax (brackets, double quotes, no trailing commas).

If user asks for create PDF, generate sheet, or any tool action,
output arguments that exactly match the tool schema.

Current time: ${new Date().toLocaleString("sv-SE").replace(" ", "T")}`;

    
    const messagesToSend = [
   { role: "user", content: systemPrompt } , 
     

      ...history,
      { role: "user", content: query },
    ];

    const response = await app.invoke(
      { messages: messagesToSend },
      { configurable: { thread_id: sessionId }, context: { email } }
    );

    res.status(200).json({
      success: true,
      response: response?.messages.at(-1)?.content,
    });
  } catch (error) {
    console.log("Workflow Error:", error);
    if (error.code === "rate_limit_exceeded") {
      const waitTime = parseFloat(error.headers["retry-after"]) || 5;
      return res.status(429).json({
        success: false,
        message: `Please try again in ${waitTime}s`,
      });
    }
  }
}

