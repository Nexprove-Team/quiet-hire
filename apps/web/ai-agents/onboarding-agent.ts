import { ToolLoopAgent } from 'ai';
import { google } from "@ai-sdk/google";

const onBoardingAgent = new ToolLoopAgent({
    model: google("gemini-2.5-flash"),
    instructions: 'You are a helpful assistant.',
    tools: {
        // Your tools here
    },
});