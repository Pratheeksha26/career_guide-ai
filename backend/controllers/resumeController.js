const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const groqService = require('../services/groqService');

exports.analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        let resumeText = '';
        const fileContent = req.file.buffer;
        const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

        if (fileExtension === 'pdf') {
            const data = await pdfParse(fileContent);
            resumeText = data.text;
        } else if (fileExtension === 'docx') {
            const result = await mammoth.extractRawText({ buffer: fileContent });
            resumeText = result.value;
        } else {
            return res.status(400).json({ success: false, message: 'Unsupported file format. Please upload PDF or DOCX.' });
        }

        // Truncate resume text to avoid exceeding Groq request size limits
        const MAX_RESUME_CHARS = 3000;
        if (resumeText.length > MAX_RESUME_CHARS) {
            resumeText = resumeText.slice(0, MAX_RESUME_CHARS) + '\n... (truncated)';
        }

        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({ success: false, message: 'Could not extract sufficient text from resume.' });
        }

        const prompt = `You are an expert ATS (Applicant Tracking System) optimizer and professional resume reviewer.
        Analyze the following raw resume text extracted from a PDF/DOCX file and provide an accurate, highly specific compatibility critique.
        
        Strict Guidelines for Analysis:
        1. Base your critique strictly on the provided text. Do not make generic recommendations or assumptions.
        2. Before stating that a section, heading, or format is missing, verify if similar headings or content are present (e.g., "Internship Experience", "Project", "Skills", "Certification", "Achievement" are standard, valid headings; bullet point symbols like "•", "o", "-", and "*" indicate bullet formatting is present).
        3. Identify specific technical and industry-relevant keywords that are *already present* in the text, and suggest specific missing keywords that would genuinely strengthen their targeted career path (e.g. Data Science, Web Development, etc.) based on their projects.
        4. Focus on content clarity, keyword optimization, section completeness (e.g., presence of a professional summary), and formatting clarity.
        5. Do not critique visual aspects like margins, fonts, colors, or page count layout since you are analyzing raw extracted text, not the visual document.

        Resume Text to Analyze:
        ---
        ${resumeText}
        ---

        Respond ONLY in a clean JSON format (no backticks, markdown code blocks, or extra conversational text) with the following structure:
        {
          "score": number,
          "pros": ["specific strength 1", "specific strength 2", ...],
          "cons": ["specific area for improvement 1", "specific area for improvement 2", ...],
          "keywords": { "found": ["found keyword 1", ...], "missing": ["highly relevant missing keyword 1", ...] },
          "recommendation": "detailed actionable recommendation for improvements"
        }`;

        const aiResponse = await groqService.getResponse(prompt);
        
        let analysis;
        try {
            // Clean the response in case AI adds markdown code blocks
            const cleanedResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            analysis = JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.error('AI Response Parsing Error:', parseError, 'Raw response:', aiResponse);
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to parse AI analysis. Please try again.',
                rawResponse: aiResponse // Fallback for debugging
            });
        }

        res.json({
            success: true,
            analysis
        });

    } catch (error) {
        console.error('Resume Analysis Error:', error);
        res.status(500).json({ success: false, message: 'Server error during resume analysis' });
    }
};
