import OpenAI from "openai";

export const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// async function main() {
//   try {
//     const completion = await openai.chat.completions.create({
//       messages: [{ role: "system", content: "Install deepseek using npm" }],
//       model: "deepseek-chat",
//     });

//     console.log(completion.choices[0].message.content);
//   } catch (error) {
//     console.log(`[Open AI error] -> ${error}`);
//   }
// }

// main();
