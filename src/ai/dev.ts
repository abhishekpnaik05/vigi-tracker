
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-geofence-alert.ts';
import '@/ai/flows/summarize-route-history.ts';
import '@/ai/flows/trigger-sos-alert.ts';
