'use server';

/**
 * @fileOverview A resume parsing AI agent.
 *
 * - parseUploadedResume - A function that handles the resume parsing process.
 * - ParseUploadedResumeInput - The input type for the parseUploadedResume function.
 * - ParseUploadedResumeOutput - The return type for the parseUploadedResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseUploadedResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseUploadedResumeInput = z.infer<typeof ParseUploadedResumeInputSchema>;

const ParseUploadedResumeOutputSchema = z.object({
  name: z.string().describe("The applicant's full name.").optional(),
  email: z.string().email().describe("The applicant's email address.").optional(),
  phone: z.string().describe("The applicant's phone number.").optional(),
  education: z.array(z.string()).describe("The applicant's education history.").optional(),
  experience: z.array(z.string()).describe("The applicant's work experience.").optional(),
  hobbies: z.array(z.string()).describe("The applicant's hobbies.").optional(),
});
export type ParseUploadedResumeOutput = z.infer<typeof ParseUploadedResumeOutputSchema>;

export async function parseUploadedResume(input: ParseUploadedResumeInput): Promise<ParseUploadedResumeOutput> {
  return parseUploadedResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseUploadedResumePrompt',
  input: {schema: ParseUploadedResumeInputSchema},
  output: {schema: ParseUploadedResumeOutputSchema},
  prompt: `You are an AI assistant that extracts information from resumes.

  Given a resume, extract the following information:
  - Name
  - Email
  - Phone Number
  - Education
  - Experience
  - Hobbies

  Resume: {{media url=resumeDataUri}}
  `,
});

const parseUploadedResumeFlow = ai.defineFlow(
  {
    name: 'parseUploadedResumeFlow',
    inputSchema: ParseUploadedResumeInputSchema,
    outputSchema: ParseUploadedResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
