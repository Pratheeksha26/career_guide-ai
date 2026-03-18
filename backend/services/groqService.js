const Groq = require('groq-sdk');
require('dotenv').config();

class GroqService {
    constructor() {
        this.groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });
        this.systemPrompt = `You are a Senior Career Guidance Counselor and Industry Expert with deep knowledge of global job markets, educational systems, and recruitment trends.

        Your goal is to provide comprehensive, detailed, and actionable career advice. 
        
        Guidelines for your responses:
        1. **Depth over Brevity**: Never give one-sentence answers. Always provide context, explanations, and multiple perspectives.
        2. **Structure**: Use clear headings (###), bold text for emphasis, and bullet points for readability.
        3. **Actionable Steps**: Always include a "Next Steps" or "Pro-Tips" section with specific actions the user can take.
        4. **Tone**: Be professional, encouraging, and highly informative.
        5. **Examples**: Use real-world examples of companies, roles, or skills where relevant.
        6. **Formatting**: Use Markdown extensively. Ensure lists are properly indented.
        
        Areas of Expertise:
        - Detailed Career Path Mapping (Science, Commerce, Arts, Tech, etc.)
        - Comprehensive Preparation Guides for Exams (JEE, CAT, UPSC, GATE, etc.)
        - Resume & Portfolio Optimization
        - Interview Strategies (Technical, Behavioral, HR)
        - Skill Acquisition Roadmaps
        - Global Study Opportunities & Scholarships
        
        Always aim to exceed expectations with the richness of your information.`;
    }

    async getResponse(message, conversationHistory = []) {
        try {
            const messages = [
                { role: 'system', content: this.systemPrompt },
                ...conversationHistory.slice(-10),
                { role: 'user', content: message }
            ];

            const completion = await this.groq.chat.completions.create({
                messages: messages,
                model: 'llama-3.3-70b-versatile',
                temperature: 0.8,
                max_tokens: 3000,
                top_p: 1,
                stream: false,
            });

            return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
        } catch (error) {
            console.error('GROQ Service Error:', error);
            throw error;
        }
    }
}

module.exports = new GroqService();
