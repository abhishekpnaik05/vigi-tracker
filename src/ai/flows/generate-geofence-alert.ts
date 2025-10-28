
'use server';
/**
 * @fileOverview Generates geofence zone suggestions based on device historical location data.
 *
 * - generateGeofenceSuggestions - A function that generates geofence suggestions.
 * - GenerateGeofenceSuggestionsInput - The input type for the generateGeofenceSuggestions function.
 * - GenerateGeofenceSuggestionsOutput - The return type for the generateGeofenceSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGeofenceSuggestionsInputSchema = z.object({
  deviceHistory: z.string().describe('Historical location data of the device.'),
});
export type GenerateGeofenceSuggestionsInput = z.infer<typeof GenerateGeofenceSuggestionsInputSchema>;

const GenerateGeofenceSuggestionsOutputSchema = z.object({
  geofenceSuggestions: z
    .array(z.string())
    .describe('Suggested geofence zones based on historical location data.'),
});
export type GenerateGeofenceSuggestionsOutput = z.infer<typeof GenerateGeofenceSuggestionsOutputSchema>;

export async function generateGeofenceSuggestions(input: GenerateGeofenceSuggestionsInput): Promise<GenerateGeofenceSuggestionsOutput> {
  return generateGeofenceSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGeofenceSuggestionsPrompt',
  input: {schema: GenerateGeofenceSuggestionsInputSchema},
  output: {schema: GenerateGeofenceSuggestionsOutputSchema},
  prompt: `You are an expert system for generating geofence suggestions based on device history data.

  Analyze the provided device history data and suggest relevant geofence zones.

  Device History Data: {{{deviceHistory}}}

  Provide the geofence suggestions as a list of strings.
  Example:
  [
    "Home",
    "Work",
    "School",
  ]
  `,
});

const generateGeofenceSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateGeofenceSuggestionsFlow',
    inputSchema: GenerateGeofenceSuggestionsInputSchema,
    outputSchema: GenerateGeofenceSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
