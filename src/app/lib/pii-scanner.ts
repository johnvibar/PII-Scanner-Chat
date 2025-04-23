import pdfParse from 'pdf-parse/lib/pdf-parse.js';

// Regular expressions for detecting common PII patterns
const PII_PATTERNS = {
  EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  PHONE: /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
  SSN: /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g,
  CREDIT_CARD: /\b(?:\d{4}[-\s]?){3}\d{4}\b|\b\d{16}\b/g,
  // Basic name detection - will have false positives but serves as starting point
  NAME: /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g
};

export async function handlePIIScan(fileData: string, fileName: string, fileType: string) {
  try {
    let textContent = '';
    
    if (fileData && fileType.includes('pdf')) {      
      const dataBuffer = Buffer.from(fileData.split(',')[1], 'base64');
      const pdfData = await pdfParse(dataBuffer);
      textContent = pdfData.text;
    } else {
      return `Unsupported file type: ${fileType}. Please upload a PDF or image.`;
    }
    
    const findings = scanTextForPII(textContent);
    
    return formatScanResults(fileName, findings);
  } catch (error) {
    console.error('Error during PII scan:', error);
    return 'Error processing the file. Please try again with a different file.';
  }
}

function scanTextForPII(text: string) {
  const findings: Record<string, string[]> = {
    EMAIL: [],
    PHONE: [],
    SSN: [],
    CREDIT_CARD: [],
    NAME: []
  };
  
  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    const matches = [...new Set(text.match(pattern) || [])];
    if (matches.length > 0) {
      findings[type] = matches;
    }
  }
  
  return findings;
}

function formatScanResults(fileName: string, findings: Record<string, string[]>) {
  const piiFound = Object.values(findings).some(matches => matches.length > 0);
  
  if (!piiFound) {
    return `No PII detected in ${fileName}.`;
  }
  
  let result = `## PII Scan Results for: ${fileName}\n\n`;
  
  for (const [type, matches] of Object.entries(findings)) {
    if (matches.length > 0) {
      result += `### ${formatPIIType(type)}: ${matches.length} found\n`;
      const examples = matches.slice(0, 5);
      result += `Examples: ${examples.join(', ')}\n\n`;
    }
  }
  
  result += "**Note:** This scan provides potential PII matches and may include false positives. Please review the results carefully.";
  
  return result;
}

function formatPIIType(type: string): string {
  const typeMap: Record<string, string> = {
    EMAIL: 'Email Addresses',
    PHONE: 'Phone Numbers',
    SSN: 'Social Security Numbers',
    CREDIT_CARD: 'Credit Card Numbers',
    NAME: 'Potential Names'
  };
  
  return typeMap[type] || type;
}
