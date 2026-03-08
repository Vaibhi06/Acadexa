import Syllabus from '../models/Syllabus.js';

// --- Existing Functions ---
export const saveSyllabus = async (req, res) => {
    try {
        const { class: className, subject, chapters } = req.body;

        // Remove existing syllabus for this class/subject to overwrite (or update logic as needed)
        await Syllabus.destroy({
            where: { class: className, subject }
        });

        // Create new records
        const records = chapters.map(chapter => ({
            class: className,
            subject,
            chapterTitle: chapter.title,
            topics: chapter.topics // handled by JSON type
        }));

        await Syllabus.bulkCreate(records);
        res.status(201).json({ message: 'Syllabus saved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSyllabus = async (req, res) => {
    try {
        const { class: className, subject } = req.query;
        // if (!className) return res.status(400).json({ message: 'Class is required' }); // Removed to allow fetching all

        const whereClause = {};
        if (className) {
            whereClause.class = className;
        }
        if (subject && subject !== 'All') {
            whereClause.subject = subject;
        }

        const syllabus = await Syllabus.findAll({ where: whereClause });

        // Group by subject for easier frontend consumption if needed, 
        // OR return raw list. The frontend currently expects a list of chapters.
        // Let's format it to match the Expected frontend structure:
        // { id, title: chapterTitle, topics: [...] }

        // Since the current frontend maps raw DB rows to UI, we will return the raw rows 
        // but note that the frontend might need adjusting to group them by subject if viewing 'All'.
        // For the specific 'getSyllabus' call which usually filters by subject, this is fine.

        res.json(syllabus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- NEW AI GENERATION FUNCTION (Smart Mock) ---
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- NEW AI GENERATION FUNCTION (Google Gemini) ---
export const generateSyllabus = async (req, res) => {
    try {
        const { prompt, subject, class: className } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            console.warn('⚠️ GEMINI_API_KEY missing. Falling back to mock.');
            return mockGenerateSyllabus(req, res);
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const fullPrompt = `
        You are an expert academic curriculum designer.
        Your task is to generate a COMPREHENSIVE and DETAILED syllabus for: "${prompt}".
        Context: Class: ${className || 'General'}, Subject: ${subject || 'General'}.

        CRITICAL INSTRUCTIONS:
        1. ALWAYS generate a FULL syllabus with AT LEAST 12-15 chapters unless the user explicitly asks for a small summary.
        2. IF the prompt asks for "Questions", "MCQs", or "Quiz":
           - Create "Chapters" as the Question Categories (e.g., "Basic Concepts", "Advanced Application").
           - Create "Topics" as the actual Questions.
        3. IF the prompt is for a standard Syllabus:
           - Cover the ENTIRE curriculum for that standard/subject. Do not take shortcuts.
           - Ensure the structure is deep and detailed.
        
        REQUIRED JSON OUTPUT FORMAT:
        [
            { 
                "title": "Chapter 1: Name", 
                "topics": [
                    { "name": "Topic 1" }, 
                    { "name": "Topic 2" },
                    { "name": "Topic 3" }
                ] 
            }
        ]
        
        Return ONLY valid JSON. No markdown formatting.
        `;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown if AI adds it despite instructions
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let generatedChapters;
        try {
            generatedChapters = JSON.parse(cleanText);

            // Normalize data structure if AI returns slightly different keys
            generatedChapters = generatedChapters.map((ch, idx) => ({
                id: Date.now() + idx,
                title: ch.title || ch.chapter || `Chapter ${idx + 1}`,
                topics: (ch.topics || []).map((t, tIdx) => ({
                    id: Date.now() + idx + tIdx + 1000,
                    name: typeof t === 'string' ? t : (t.name || t.topic || 'Topic')
                }))
            }));

        } catch (parseError) {
            console.error('Failed to parse AI response:', cleanText);
            throw new Error('AI generated invalid data format');
        }

        res.json({
            success: true,
            data: generatedChapters
        });

    } catch (error) {
        console.error('AI Generation Error:', error);
        // Fallback to mock on error
        mockGenerateSyllabus(req, res);
    }
};

const mockGenerateSyllabus = async (req, res) => {
    // ... existing mock logic moved here as fallback ...
    const { prompt, subject } = req.body;
    await new Promise(resolve => setTimeout(resolve, 1000));

    const p = prompt.toLowerCase();
    let generatedChapters = [];

    if (p.includes('math') || subject?.toLowerCase().includes('math')) {
        generatedChapters = [
            { id: 1, title: 'Real Numbers', topics: [{ id: 101, name: 'Euclid’s Division Lemma' }, { id: 102, name: 'Fundamental Theorem of Arithmetic' }] },
            { id: 2, title: 'Polynomials', topics: [{ id: 201, name: 'Geometrical Meaning of Zeroes' }, { id: 202, name: 'Relationship between Zeroes and Coefficients' }] },
            { id: 3, title: 'Pair of Linear Equations', topics: [{ id: 301, name: 'Graphical Method of Solution' }, { id: 302, name: 'Algebraic Methods' }] },
            { id: 4, title: 'Quadratic Equations', topics: [{ id: 401, name: 'Standard Form' }, { id: 402, name: 'Nature of Roots' }] },
            { id: 5, title: 'Arithmetic Progressions', topics: [{ id: 501, name: 'nth Term of an AP' }, { id: 502, name: 'Sum of First n Terms' }] }
        ];
    } else {
        generatedChapters = [
            { id: 1, title: `Introduction to ${subject || 'Topic'}`, topics: [{ id: 101, name: 'Basic Concepts' }, { id: 102, name: 'History and Scope' }] },
            { id: 2, title: 'Core Principles', topics: [{ id: 201, name: 'Fundamental Laws' }, { id: 202, name: 'Key Terminologies' }] },
            { id: 3, title: 'Advanced Applications', topics: [{ id: 301, name: 'Real-world Examples' }, { id: 302, name: 'Future Trends' }] }
        ];
    }

    if (!res.headersSent) {
        res.json({ success: true, data: generatedChapters });
    }
};
