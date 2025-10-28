
'use server';

/**
 * @fileOverview Summarizes the route history of a device.
 *
 * - summarizeRouteHistory - A function that summarizes the route history of a device.
 * - SummarizeRouteHistoryInput - The input type for the summarizeRouteHistory function.
 * - SummarizeRouteHistoryOutput - The return type for the summarizeRouteHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRouteHistoryInputSchema = z.object({
  deviceId: z.string().describe('The ID of the device to summarize the route history for.'),
  startTime: z.string().describe('The start time of the period to summarize.'),
  endTime: z.string().describe('The end time of the period to summarize.'),
  routeHistory: z.string().describe('The detailed route history of the device.'),
});
export type SummarizeRouteHistoryInput = z.infer<typeof SummarizeRouteHistoryInputSchema>;

const SummarizeRouteHistoryOutputSchema = z.object({
  summary: z.string().describe('A summary of the device route history.'),
});
export type SummarizeRouteHistoryOutput = z.infer<typeof SummarizeRouteHistoryOutputSchema>;

export async function summarizeRouteHistory(input: SummarizeRouteHistoryInput): Promise<SummarizeRouteHistoryOutput> {
  return summarizeRouteHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRouteHistoryPrompt',
  input: {schema: SummarizeRouteHistoryInputSchema},
  output: {schema: SummarizeRouteHistoryOutputSchema},
  prompt: `You are an expert summarizer of route history for GPS devices.

  You will be provided with the route history of a device, a start time, and an end time.
  You will generate a summary of the device\'s movements during that time period, highlighting key events and patterns.

  Device ID: {{{deviceId}}}
  Start Time: {{{startTime}}}
  End Time: {{{endTime}}}
  Route History: {{{routeHistory}}}

  Summary:`,
});

const summarizeRouteHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeRouteHistoryFlow',
    inputSchema: SummarizeRouteHistoryInputSchema,
    outputSchema: SummarizeRouteHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
