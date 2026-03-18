const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');
const Tesseract = require('tesseract.js');
const fs = require('fs');

class FileService {
    async extractText(file) {
        let { buffer, originalname, mimetype, path } = file;
        const extension = originalname.split('.').pop().toLowerCase();

        // If using disk storage, read buffer from path
        if (!buffer && path) {
            try {
                buffer = fs.readFileSync(path);
            } catch (err) {
                console.error(`Failed to read file from path ${path}:`, err);
            }
        }

        if (!buffer) {
            return `[Error: No content found for ${originalname}]`;
        }

        console.log(`📄 Extracting text from: ${originalname} (${mimetype})`);

        try {
            if (mimetype === 'application/pdf' || extension === 'pdf') {
                return await this.extractFromPDF(buffer);
            } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || extension === 'docx') {
                return await this.extractFromDocx(buffer);
            } else if (mimetype === 'text/plain' || extension === 'txt') {
                return buffer.toString('utf8');
            } else if (mimetype.startsWith('image/')) {
                return await this.extractFromImage(buffer);
            } else {
                return `[Unsupported file format: ${originalname}]`;
            }
        } catch (error) {
            console.error(`❌ Error extracting text from ${originalname}:`, error);
            return `[Error extracting text from ${originalname}]`;
        }
    }

    async extractFromPDF(buffer) {
        try {
            const parser = new PDFParse({ data: buffer });
            const data = await parser.getText();
            await parser.destroy(); // Free memory
            return data.text;
        } catch (error) {
            console.error('PDF extraction error:', error);
            throw new Error('Failed to parse PDF');
        }
    }

    async extractFromDocx(buffer) {
        try {
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        } catch (error) {
            console.error('DOCX extraction error:', error);
            throw new Error('Failed to parse DOCX');
        }
    }

    async extractFromImage(buffer) {
        try {
            const { data: { text } } = await Tesseract.recognize(
                buffer,
                'eng',
                { logger: m => console.log(m) }
            );
            return text;
        } catch (error) {
            console.error('OCR error:', error);
            throw new Error('Failed to perform OCR on image');
        }
    }
}

module.exports = new FileService();
