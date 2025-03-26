import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { fileURLToPath } from "url";
import axios from "axios";
import 'dotenv/config'

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extract text from a PDF file using pdfjs-dist
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} Extracted text
 */
async function extractPDFText(filePath) {
    const dataBuffer = new Uint8Array(fs.readFileSync(filePath));
    const pdf = await getDocument({ data: dataBuffer }).promise;
    
    let extractedText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        extractedText += textContent.items.map(item => item.str).join(" ") + "\n";
    }

    return extractedText;
}

/**
 * Extract text from a DOCX file using Mammoth
 * @param {string} filePath - Path to the DOCX file
 * @returns {Promise<string>} Extracted text
 */
async function extractDOCXText(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const { value } = await mammoth.extractRawText({ buffer: dataBuffer });
    return value;
}

/**
 * Extract text from a resume file (PDF or DOCX)
 * @param {string} filePath - Path to the resume file
 * @returns {Promise<string>} Extracted text
 */
export async function extractResumeText(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === ".pdf") {
        return await extractPDFText(filePath);
    } else if (ext === ".docx") {
        return await extractDOCXText(filePath);
    } else {
        throw new Error("Unsupported file type. Only PDF and DOCX are supported.");
    }
}

function extractJsonFromResponse(responseText) {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/); // Match everything between { and }
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
}

export async function analyzeResumeWithDeepSeek(resumeText) {
    const apiKey = process.env.OPENROUTER_API_KEY; // Ensure this is set in your .env file
    const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

    const prompt2 = `
        Find out the various skills/tools used in the following resume.
        Return json object with following keys:
        name,
        skills,
        location.
        
        If any not found set as empty.

        Resume Text:
        ${resumeText}

        Output the result as a JSON object with structured fields.
    `;

    const prompt = `
        Analyze the following resume text, and ONLY output a json with the following structure 3 keys:
        {skills : all the skills and tools in the resume, work experience : total work experience in years (0 if not found), location : null if not present in resume}
        Only return the json object. Absolutley nothing else.
        ${resumeText}
    `;

    const requestData = {
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [{ role: "user", content: prompt }],
    };

    try {
        const response = await axios.post(apiUrl, requestData, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "your-site.com", // Replace with your actual site domain
            },
        });

        if (!response.data.choices || response.data.choices.length === 0) {
            throw new Error('Unexpected API response structure: "choices" array is missing or empty.');
        }

        const structuredData = response.data.choices[0].message.content.trim();
        return extractJsonFromResponse(structuredData);
        
    } catch (error) {
        console.error("Error analyzing resume:", error.response ? error.response.data : error.message);
        throw error;
    }
}