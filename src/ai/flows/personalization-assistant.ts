'use server';
/**
 * @fileOverview A Genkit flow for an AI assistant to help customers draft personalized engraving messages or dedications.
 *
 * - personalizationAssistant - A function that handles the message generation process.
 * - PersonalizationAssistantInput - The input type for the personalizationAssistant function.
 * - PersonalizationAssistantOutput - The return type for the personalizationAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizationAssistantInputSchema = z.object({
  occasion: z
    .string()
    .describe(
      'The occasion for the gift (e.g., "Wedding", "Birthday", "Graduation").'
    ),
  recipient: z
    .string()
    .describe('The recipient of the gift (e.g., "Spouse", "Best Friend").'),
  tone: z
    .string()
    .describe(
      'The desired tone for the message (e.g., "Heartfelt", "Humorous", "Inspirational").'
    ),
  keywords: z
    .string()
    .optional()
    .describe(
      'Optional: Comma-separated keywords or phrases to include in the message.'
    ),
});
export type PersonalizationAssistantInput = z.infer<
  typeof PersonalizationAssistantInputSchema
>;

const PersonalizationAssistantOutputSchema = z.object({
  suggestion: z.string().describe('The primary suggested engraving message.'),
  variations: z
    .array(z.string())
    .describe('A list of alternative suggested engraving messages.'),
});
export type PersonalizationAssistantOutput = z.infer<
  typeof PersonalizationAssistantOutputSchema
>;

export async function personalizationAssistant(
  input: PersonalizationAssistantInput
): Promise<PersonalizationAssistantOutput> {
  return personalizationAssistantFlow(input);
}

const personalizationAssistantPrompt = ai.definePrompt({
  name: 'personalizationAssistantPrompt',
  input: {schema: PersonalizationAssistantInputSchema},
  output: {schema: PersonalizationAssistantOutputSchema},
  prompt: `You are an AI assistant specializing in crafting personalized engraving messages and dedications for gifts.
Your goal is to help customers create meaningful and unique presents by suggesting creative text based on their input.

Generate a primary engraving message and a few variations. The messages should be concise and suitable for engraving.

Occasion: {{{occasion}}}
Recipient: {{{recipient}}}
Desired Tone: {{{tone}}}
{{#if keywords}}Keywords to include: {{{keywords}}}{{/if}}

Consider the occasion, recipient, and desired tone when crafting the messages. Focus on creating heartfelt, memorable, and appropriate text for the specific context.`,
});

const personalizationAssistantFlow = ai.defineFlow(
  {
    name: 'personalizationAssistantFlow',
    inputSchema: PersonalizationAssistantInputSchema,
    outputSchema: PersonalizationAssistantOutputSchema,
  },
  async input => {
    const {output} = await personalizationAssistantPrompt(input);
    return output!;
  }
);
