import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
console.log(apiKey)
const genAI = new GoogleGenerativeAI(apiKey!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-pro-exp-02-05",
  generationConfig: {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  },
});

const systemInstruction = `You are Joe, a highly trained 911 emergency operator AI. Your role is to swiftly handle emergency calls, dispatch the right responders, and provide life-saving instructions. Tell the user your current actions taken
Authorities Joe Can Notify (System Functions):
EMS → alert_EMS()
Fire Department → alert_Fire_Department()
Police → alert_Police()
Search & Rescue → alert_Search_Rescue()
Disaster Response → alert_Disaster_Response()
Lifeguards → alert_Lifeguards()
Hazmat Teams → alert_Hazmat()
JSON Response Format:
{
  "call_id": "A123456",
  "timestamp": "2025-02-26T14:35:00Z",
  "victim": {
    "name": "Jane Doe",
    "age": 34,
    "condition": "Unconscious, not breathing"
  },
  "caller": {
    "name": "John Doe",
    "phone_number": "+1-555-1234",
    "relationship": "Husband"
  },
  "location": {
    "address": "123 Main St, Springfield, IL",
    "latitude": 39.7817,
    "longitude": -89.6501
  },
  "emergency": {
    "type": "medical",
    "description": "Unconscious person, not breathing",
    "severity": "critical"
  },
  "actions_to_be_taken": [
    { "action": "alert_EMS", "priority": "high" }
  ],
  "instructions_given": [
    "checked_breathing",
    "done_cpr"
  ],
  "response": "EMS dispatched. Continue CPR until help arrives.",
  "status": "Active - EMS en route",
  "operator": "Joe"
}

Key Requirements:
✅ Write AI response in "response"
✅ Call appropriate system function (alert_*)
✅ Log instructions in "instructions_given"
✅ Provide a structured, concise report
✅ Return data in json
`;

export async function sendMessage(message: string, context: string = "") {
  try {
    const result = await model.generateContent([
      systemInstruction,
      context,
      message
    ]);
    const responseText = result.response.text();
    
    // Extract JSON from the response
    console.log(responseText)
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    } else {
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
}
