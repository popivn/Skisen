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
            const lang = req.headers['accept-language'] || 'vi';
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
                  status: "error",
                  message: "No condition detected",
                  predictions: []
                });
            }

            const predictions = result.detections.map((d, index) => ({
                predicted_class: d.predicted_class,
                confidence: d.confidence,
                gradcam_image: d.gradcam_image,
                gradcam_explanation: d.explanation, 
            }));

            res.status(200).json({
                status: "success",
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
            const { condition, language } = req.body;
    
            // Adjust the system message based on the requested language
            const systemMessage = language === "vi"
                ? `Bạn là một trợ lý AI y tế chuyên về da liễu. Dựa trên tình trạng da đã phát hiện, hãy tạo ra một phản hồi JSON có cấu trúc sau:
                {
                  "Tổng quan": "Mô tả ngắn gọn về tình trạng bệnh.",
                  "Nguyên nhân & Yếu tố nguy cơ": "Liệt kê các nguyên nhân và yếu tố nguy cơ phổ biến.",
                  "Triệu chứng": ["Triệu chứng 1", "Triệu chứng 2", "Triệu chứng 3"],
                  "Điều trị & Biện pháp khắc phục": "Các phương pháp điều trị y tế và các biện pháp khắc phục tại nhà.",
                  "Lời khuyên phòng ngừa": "Các bước hành động để phòng ngừa tình trạng này.",
                  "Khi nào cần gặp bác sĩ": "Khi nào người dùng nên tham khảo ý kiến bác sĩ.",
                  "Tài liệu tham khảo": [
                    {"title": "Tên nguồn tin đáng tin cậy", "url": "https://trusted-source.com"},
                    {"title": "Nguồn đáng tin cậy khác", "url": "https://another-trusted-source.com"}
                  ]
                }
                  Đảm bảo rằng:
                            - Phản hồi ở định dạng **JSON hợp lệ** mà không có văn bản phụ.
                            - Cung cấp **ít nhất 2 nguồn tham khảo** từ các nguồn đáng tin cậy như WHO, Mayo Clinic, WebMD, NIH hoặc các trang web y tế uy tín khác.
                            - Các nguồn tham khảo phải liên quan đến **${condition}**.
                            - Không có giải thích hoặc mô tả bổ sung ngoài định dạng JSON.`
                : `You are a medical AI assistant specialized in dermatology. Based on the detected skin condition, generate a structured JSON response with the following format:
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
                            - No additional explanations or descriptions beyond the JSON format.`;
    
            // Send the request to OpenAI API
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
                            content: systemMessage
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
          const { message, language } = req.body;
          
          if (!message) {
            return res.status(400).json({ error: 'No message provided' });
          }
      
          // Map language codes to friendly strings
          const languageMapping = {
            'vi': 'tiếng Việt',
            'en': 'English'
          };
          const languageToUse = languageMapping[language] || 'tiếng Việt';
      
          const systemPrompt = `Bạn là một bác sĩ AI chuyên về y học, đặc biệt là các bệnh da liễu, là một chatbot AI của SkiSen web - một website chuẩn đoán bệnh trên da. Hãy trả lời bằng ${languageToUse} với câu trả lời ngắn gọn và dễ hiểu.`;
      
          const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: "gpt-4-turbo",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
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
      
    // Add this function to your DetectController class
    async generateImage(req, res) {
      try {
        const { prompt, language } = req.body;

        if (!prompt) {
          return res.status(400).json({ error: "No prompt provided for image generation" });
        }

        // Map language codes to friendly strings
        const languageMapping = {
          'vi': 'tiếng Việt',
          'en': 'English'
        };
        const languageToUse = languageMapping[language] || 'tiếng Việt';

        const systemPrompt = `You are a medical AI assistant specializing in dermatology. Based on the prompt: "${prompt}", generate an image depicting the described skin condition. Return only the image URL in the response.`;

        // Call DALL·E API
        const openAIResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            prompt: systemPrompt,
            n: 1, // Number of images to generate
            size: "512x512" // Specify image size (can adjust as per your needs)
          })
        });

        if (!openAIResponse.ok) {
          throw new Error(`OpenAI Image Generation error: ${openAIResponse.statusText}`);
        }

        const openAIResult = await openAIResponse.json();
        const imageUrl = openAIResult.data[0].url; // Get the image URL

        res.json({
          status: "success",
          message: "Image generated successfully",
          imageUrl: imageUrl
        });

      } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({ error: "Error generating the image." });
      }
    }

}

export default new DetectController();
