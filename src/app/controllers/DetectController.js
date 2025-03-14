import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import FormData from 'form-data';
import dotenv from 'dotenv';

import { console } from 'inspector';

dotenv.config();

// ✅ Fix lỗi `__dirname` khi dùng ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DetectController {

    // GET 
    index(req, res) {
        res.render('detect', { title: 'Detect' });
    }

    // POST - Nhận ảnh từ Vue và xử lý
    async predict(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            const filePath = path.join(__dirname, '../../public/uploads', req.file.filename);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: "File not found" });
            }

            const formData = new FormData();
            formData.append('file', fs.createReadStream(filePath));

            const response = await fetch('http://localhost:5000/analyze/', {
                method: 'POST',
                body: formData,
                headers: formData.getHeaders(), 
            });

            if (!response.ok) {
                throw new Error(`FastAPI error: ${response.statusText}`);
            }

            const result = await response.json();

            if (!result.detections || result.detections.length === 0) {
                return res.json({
                    error: "No condition detected",
                    imageDetected: `http://localhost:5000/static/result_detected.png`,
                    gradcamImages: [],
                    predictions: [],
                    explanations: []
                });
            }

            const predictions = result.detections.map((d, index) => ({
                predicted_class: d.predicted_class,
                confidence: d.confidence,
                gradcam_image: d.gradcam_image,
                gradcam_explanation: d.explanation, 
            }));

            res.status(200).json({
                message: "Image processed successfully",
                imageDetected: `http://localhost:5000/static/result_detected.png`,
                predictions: predictions
            });
        } catch (error) {
            console.error("Error in prediction:", error);
            res.status(500).json({ error: "Error in processing the image." });
        }
    }

    async explain(req, res) {
        try {
            const { condition } = req.body;
    
            const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4-turbo",
                    messages: [
                        {
                            role: "system",
                            content: `You are a medical AI assistant specialized in dermatology. Based on the detected skin condition, generate a structured JSON response with the following format:
                            {
                            "Overview": "Short medical overview of the condition.",
                            "Causes & Risk Factors": "List common causes and risk factors.",
                            "Symptoms": ["Symptom 1", "Symptom 2", "Symptom 3"],
                            "Treatment & Remedies": "Medical treatments and home remedies.",
                            "Prevention Tips": "Actionable steps to prevent this condition.",
                            "When to See a Doctor": "When the user should consult a doctor.",
                            "References": [
                                {"title": "Trusted Source Name", "url": "https://trusted-source.com"},
                                {"title": "Another Trusted Source", "url": "https://another-trusted-source.com"}
                            ]
                            }
    
                            Ensure that:
                            - The response is in **valid JSON format** without extra text.
                            - Provide **at least 2 references** with credible sources such as WHO, Mayo Clinic, WebMD, NIH, or other reputable health websites.
                            - The references must be relevant to **${condition}**.
                            - No additional explanations or descriptions beyond the JSON format.`
                        }
                    ],
                    max_tokens: 700,
                    temperature: 0.7,
                })
            });
    
            if (!openAIResponse.ok) {
                throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
            }
    
            const openAIResult = await openAIResponse.json();
            let aiExplanation = "No explanation available.";
            
            if (openAIResult.choices && openAIResult.choices.length > 0) {
                try {
                    aiExplanation = JSON.parse(openAIResult.choices[0].message.content);
                } catch (error) {
                    console.error("Error parsing OpenAI JSON:", error);
                    aiExplanation = "Invalid JSON format received from OpenAI.";
                }
            }
    
            res.json(aiExplanation);
        } catch (error) {
            console.error("Error fetching condition info:", error);
            res.status(500).json({ error: "Error fetching condition information." });
        }
    }
    
    async chat(req, res) {
        try {
            const { message } = req.body;
        
            if (!message) {
                return res.status(400).json({ error: 'No message provided' });
            }
        
            const { franc } = await import('franc');
            const langCode = franc(message); 
            const languageMapping = {
                vie: "tiếng Việt",
                eng: "English",
            };

            const languageToUse = languageMapping[langCode] || "tiếng Việt";

            const systemPrompt = `Bạn là một bác sĩ AI chuyên về y học, đặc biệt là các bệnh da liễu, là một chatbot AI cuar SkiSen web - một website chuẩn đoán bệnh trên da. Hãy trả lời bằng ${languageToUse} với câu trả lời ngắn gọn và dễ hiểu.`;

            const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4-turbo", 
                    messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: message
                    }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });
        
            if (!openAIResponse.ok) {
              return res.status(500).json({ error: 'Error calling OpenAI API' });
            }
        
            const openAIResult = await openAIResponse.json();
            const responseMessage = openAIResult.choices[0].message.content;
        
            res.json({ response: responseMessage });
          } catch (error) {
            console.error("Error in chat backend:", error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
        }
}

export default new DetectController();
