# PII Scanner Chat

Integrates AI chat capabilities with document analysis for detecting Personally Identifiable Information (PII).

## Overview

This application provides a chat interface powered by OpenAI models via the Vercel AI SDK. It features a document scanner that can process PDFs to detect potential PII, such as email addresses, phone numbers, social security numbers, credit card numbers, and names.

## Features

- **AI Chat Interface**: Interactive chat powered by OpenAI models
- **File Upload**: Support for PDF uploads
- **PII Detection**: Automated scanning for common PII patterns
- **Tool Integration**: AI-powered document analysis as a tool function

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- NPM or Yarn
- OpenAI API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/johnvibar/pii-scanner-chat.git
   cd pii-scanner-chat
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root with your OpenAI API key:

   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture and Design Decisions

### Technology Stack

- **Frontend**: Next.js with React
- **AI Integration**: Vercel AI SDK with OpenAI
- **Styling**: TailwindCSS for responsive design
- **Document Processing**:
  - PDF processing with pdf-parse

### Design Decisions

1. **Streaming Response Architecture**

   - Used Vercel AI SDK's streaming capabilities to provide real-time feedback
   - Implemented loading states to indicate processing status

2. **Tool-based Approach**

   - Separated the PII scanning logic as a tool function for modular design
   - Allows for future expansion of additional document analysis features

3. **Pattern Recognition**
   - Used regex patterns for common PII detection

The tool implementation:

1. **Document Text Extraction**:

   - Extracts text from PDFs using pdf-parse

2. **PII Pattern Detection**:

   - Searches for common PII patterns using regular expressions
   - Identifies:
     - Email addresses
     - Phone numbers
     - Social security numbers
     - Credit card numbers
     - Names (using capitalization patterns)

3. **Result Formatting**:

   - Organizes findings by PII type
   - Provides counts and examples of detected PII
   - Warns about potential false positives

4. **Integration with AI Chat**:
   - Results are returned through the AI chat interface
   - Enables natural language interaction with the PII scanning tool

## Future Enhancements

- Advanced name detection with NLP techniques
- Support for additional document formats, image as well
- Customizable PII detection rules

## Potential issues

- We have to create test pdf in the /test/data/05-versions-space.pdf caused by pdf-parse module issue, we might need to find other module to avoid this issue.
