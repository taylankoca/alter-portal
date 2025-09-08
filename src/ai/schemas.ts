/**
 * @fileOverview Shared schemas and types for AI flows.
 */

import {z} from 'genkit';

const ExperienceSchema = z.object({
  company: z.string().describe('The name of the company.'),
  position: z.string().describe('The job title or position.'),
  years: z.string().describe('The start and end years of the employment. (e.g., "2020-2023")'),
  description: z.string().describe('A brief description of the role and responsibilities.').optional(),
});

const EducationSchema = z.object({
  institution: z.string().describe('The name of the educational institution.'),
  degree: z.string().describe('The degree or field of study.'),
  years: z.string().describe('The start and end years of the education. (e.g., "2016-2020")'),
  description: z.string().describe('Any additional details about the education, like honors or special projects.').optional(),
});

export const ParseResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

export const ParseResumeOutputSchema = z.object({
  experience: z.array(ExperienceSchema).describe('The extracted work experience from the resume.'),
  education: z.array(EducationSchema).describe('The extracted education history from the resume.'),
});
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;
