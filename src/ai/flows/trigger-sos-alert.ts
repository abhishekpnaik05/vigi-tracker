
'use server';
/**
 * @fileOverview A flow to handle SOS emergency alerts.
 *
 * - triggerSOSAlert - A function that simulates triggering an SOS alert.
 * - TriggerSOSAlertInput - The input type for the triggerSOSAlert function.
 * - TriggerSOSAlertOutput - The return type for the triggerSOSAlert function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TriggerSOSAlertInputSchema = z.object({
  userName: z.string().describe('The name of the user triggering the alert.'),
  userEmail: z.string().describe('The email of the user triggering the alert.'),
  location: z.object({
    lat: z.number(),
    lon: z.number(),
  }).describe('The current location of the user.'),
});
export type TriggerSOSAlertInput = z.infer<typeof TriggerSOSAlertInputSchema>;

const TriggerSOSAlertOutputSchema = z.object({
  confirmationMessage: z.string().describe('A message confirming the action taken.'),
  alertDetails: z.string().describe('Details of the alert that was sent.'),
});
export type TriggerSOSAlertOutput = z.infer<typeof TriggerSOSAlertOutputSchema>;

export async function triggerSOSAlert(input: TriggerSOSAlertInput): Promise<TriggerSOSAlertOutput> {
  return triggerSOSAlertFlow(input);
}

const prompt = ai.definePrompt({
  name: 'triggerSOSAlertPrompt',
  input: { schema: TriggerSOSAlertInputSchema },
  output: { schema: TriggerSOSAlertOutputSchema },
  prompt: `You are an emergency dispatch system. An SOS alert has been triggered by a user.

  User Name: {{{userName}}}
  User Email: {{{userEmail}}}
  Location: Lat {{{location.lat}}}, Lon {{{location.lon}}}

  Generate a confirmation message for the user and an alert message that would be sent to emergency contacts and authorities.
  The confirmation message should be reassuring and inform the user that help is on the way.
  The alert details should be a clear and concise summary of the emergency.
  `,
});

const triggerSOSAlertFlow = ai.defineFlow(
  {
    name: 'triggerSOSAlertFlow',
    inputSchema: TriggerSOSAlertInputSchema,
    outputSchema: TriggerSOSAlertOutputSchema,
  },
  async (input) => {
    console.log(`SOS Alert triggered by ${input.userName} at location ${input.location.lat}, ${input.location.lon}`);

    // In a real application, this is where you would integrate with services
    // like Twilio for SMS, SendGrid for email, or a push notification service.
    // For this simulation, we will just log the event and use the LLM to generate responses.

    const { output } = await prompt(input);
    return output!;
  }
);
