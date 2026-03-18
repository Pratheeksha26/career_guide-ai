const { PDFParse } = require('pdf-parse');
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
            const parser = new PDFParse({ data: fileContent });
            const data = await parser.getText();
            resumeText = data.text;
            await parser.destroy(); // Free memory
        } else if (fileExtension === 'docx') {
            const result = await mammoth.extractRawText({ buffer: fileContent });
            resumeText = result.value;
        } else {
            return res.status(400).json({ success: false, message: 'Unsupported file format. Please upload PDF or DOCX.' });
        }

        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({ success: false, message: 'Could not extract sufficient text from resume.' });
        }

        const prompt = `Analyze this resume text for ATS (Applicant Tracking System) compatibility.
        Provide a detailed evaluation including:
        1. An overall ATS Score (out of 100).
        2. Pros: List 3-5 things that are well-optimized.
        3. Cons: List 3-5 areas that need improvement.
        4. Key keywords found and missing keywords.
        5. Detailed recommendation for improvement.

        Resume Text:
        ${resumeText}

        Respond ONLY in a clean JSON format (no backticks or extra text) with the following structure:
        {
          "score": number,
          "pros": ["string"],
          "cons": ["string"],
          "keywords": { "found": ["string"], "missing": ["string"] },
          "recommendation": "string"
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
