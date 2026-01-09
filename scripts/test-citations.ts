
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
if (!apiKey) throw new Error("API Key not found");

const ai = new GoogleGenerativeAI(apiKey);

async function testCitation() {
    console.log("Testing Citations with Gemini 2.5 Flash...");
    
    const resourceName = "fileSearchStores/hospitalguidestorev2fixed-nntiy5lzyybo";
    
    // Exact logic from route.ts
    const model = ai.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        tools: [{ 
            fileSearch: {
                fileSearchStoreNames: [resourceName]
            } 
        }]
    });

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: `당신은 산업재해 전문가 AI 상담원입니다. 
제공된 산재 가이드 문서를 기반으로 답변해주세요.` }],
            },
            {
                role: "model",
                parts: [{ text: "네, 알겠습니다." }],
            }
        ]
    });

    const question = "요양급여 신청 방법 알려줘";
    console.log(`Question: ${question}`);
    
    const result = await chat.sendMessage(question);
    const response = result.response;
    
    console.log("\n--- Full Response Object ---");
    // console.dir is better for depth, but stringify works for logs
    console.log(JSON.stringify(response, null, 2));
    
    console.log("\n--- Candidates ---");
    if (response.candidates) {
        response.candidates.forEach((c, i) => {
            console.log(`Candidate ${i}:`);
            console.log(`  CitationMetadata:`, JSON.stringify(c.citationMetadata, null, 2));
            console.log(`  SafetyRatings:`, c.safetyRatings);
            console.log(`  Text:`, c.content?.parts?.[0]?.text?.substring(0, 50) + "...");
        });
    }
}

testCitation();
