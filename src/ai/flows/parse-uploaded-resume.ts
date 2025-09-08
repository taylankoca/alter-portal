'use server';
/**
 * @fileOverview A flow for parsing resumes to extract work experience and education.
 *
 * - parseUploadedResume - A function that handles the resume parsing process.
 */

import {ai} from '@/ai/genkit';
import {
  ParseResumeInputSchema,
  ParseResumeOutputSchema,
  ParseResumeInput,
  ParseResumeOutput,
} from '@/ai/schemas';


const parseUploadedResumeFlow = ai.defineFlow(
  {
    name: 'parseUploadedResumeFlow',
    inputSchema: ParseResumeInputSchema,
    outputSchema: ParseResumeOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'parseUploadedResumePrompt',
      input: {schema: ParseResumeInputSchema},
      output: {schema: ParseResumeOutputSchema},
      prompt: `You are an expert resume parser. Your task is to analyze the provided resume and extract the user's work experience and education history in a structured format.

Please extract the following information:
- For work experience, identify the company name, the position or job title, the years of employment, and a brief description of the responsibilities and achievements.
- For education, identify the educational institution, the degree or field of study, the years of attendance, and any notable details like honors or thesis topics.

Here is the resume:
{{media url=resumeDataUri}}`,
    });
    
    const {output} = await prompt(input);
    return output!;
  }
);


export async function parseUploadedResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  return parseUploadedResumeFlow(input);
}
