'use server';
/**
 * @fileOverview An AI agent for generating engaging and SEO-friendly product descriptions.
 *
 * - generateProductDescription - A function that handles the product description generation process.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z.string().describe('The category the product belongs to (e.g., Trophies, Awards, Medals, Personalized Gifts, Decorative Items).'),
  material: z.string().describe('The primary material of the product (e.g., Crystal, Metal, Wood, Acrylic, Gold-plated).'),
  shortDescription: z.string().optional().describe('A brief, existing description of the product, if any.'),
  targetAudience: z.string().optional().describe('The intended audience for the product (e.g., Corporate clients, Wedding guests, Sports teams).'),
  occasion: z.string().optional().describe('The occasion for which the product is typically given (e.g., Graduation, Birthday, Anniversary).'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated engaging and SEO-friendly product description.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const productDescriptionPrompt = ai.definePrompt({
  name: 'productDescriptionPrompt',
  input: { schema: GenerateProductDescriptionInputSchema },
  output: { schema: GenerateProductDescriptionOutputSchema },
  prompt: `You are an expert copywriter for an e-commerce gift shop named "Gift Shop Agadir", specializing in luxury trophies, awards, medals, and personalized gifts. Your task is to generate an engaging and SEO-friendly product description.

Craft a compelling description that highlights the product's unique features, benefits, and emotional appeal. Use persuasive language, relevant keywords, and a tone suitable for a premium brand.

Product Details:
Product Name: {{{productName}}}
Category: {{{category}}}
Material: {{{material}}}

{{#if shortDescription}}
Short Description: {{{shortDescription}}}
{{/if}}

{{#if targetAudience}}
Target Audience: {{{targetAudience}}}
{{/if}}

{{#if occasion}}
Occasion: {{{occasion}}}
{{/if}}

Generate the description in markdown format, focusing on engaging prospective customers and optimizing for search engines. The description should be at least 150 words.
`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await productDescriptionPrompt(input);
    if (!output) {
      throw new Error('Failed to generate product description.');
    }
    return output;
  }
);
