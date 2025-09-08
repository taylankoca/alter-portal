'use server';
/**
 * @fileOverview A flow for parsing resumes to extract work experience and education.
 *
 * - parseUploadedResume - A function that handles the resume parsing process.
 * - ParseResumeInput - The input type for the parseUploadedResume function.
 * - ParseResumeOutput - The return type for the parseUploadedResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExperienceSchema = z.object({
  company: z.string().describe('The name of the company.'),
  position: z.string().describe('The job title or position.'),
  years: z.string().describe('The start and end years of the employment. (e.g., "2020-2023")'),
});

const EducationSchema = z.object({
  institution: z.string().describe('The name of the educational institution.'),
  degree: z.string().describe('The degree or field of study.'),
  years: z.string().describe('The start and end years of the education. (e.g., "2016-2020")'),
});

export const ParseResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

export const ParseResumeOutputSchema = z.object({
  experience: z.array(ExperienceSchema).describe('The extracted work experience from the resume.'),
  education: z.array(EducationSchema).describe('The extracted education history from the resume.'),
});
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;


export async function parseUploadedResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  return parseUploadedResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseUploadedResumePrompt',
  input: {schema: ParseResumeInputSchema},
  output: {schema: ParseResumeOutputSchema},
  prompt: `You are an expert resume parser. Your task is to analyze the provided resume and extract the user's work experience and education history in a structured format.

Please extract the following information:
- For work experience, identify the company name, the position or job title, and the years of employment.
- For education, identify the educational institution, the degree or field of study, and the years of attendance.

Here is the resume:
{{media url=resumeDataUri}}`,
});

const parseUploadedResumeFlow = ai.defineFlow(
  {
    name: 'parseUploadedResumeFlow',
    inputSchema: ParseResumeInputSchema,
    outputSchema: ParseResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
