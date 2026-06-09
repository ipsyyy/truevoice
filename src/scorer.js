import Anthropic from "@anthropic-ai/sdk";
import { Langfuse } from "langfuse";

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

const langfuse = new Langfuse({
  publicKey: import.meta.env.VITE_LANGFUSE_PUBLIC_KEY,
  secretKey: import.meta.env.VITE_LANGFUSE_SECRET_KEY,
  baseUrl: import.meta.env.VITE_LANGFUSE_HOST,
});

export async function scoreBrandVoice(brandConfig, messages) {
  const trace = langfuse.trace({
    name: "truevoice-scoring",
    metadata: { brand: brandConfig.name },
  });

  const prompt = `You are an expert brand voice analyst. Analyze the following brand messages and score their voice consistency.

BRAND CONFIGURATION:
- Brand Name: ${brandConfig.name}
- Tone Style: ${brandConfig.tone} (1=very irreverent, 5=very sincere)
- Formality Level: ${brandConfig.formality} (1=very casual, 5=very professional)
- Words this brand would NEVER use: ${brandConfig.forbiddenWords}

MESSAGES TO ANALYZE:
${messages.map((m, i) => `Message ${i + 1}: "${m}"`).join("\n")}

Score each message and the overall consistency across these 5 dimensions:
1. TONE: How well does it match the brand's tone style (irreverent vs sincere)?
2. FORMALITY: Does the formality level match the brand config?
3. PERSONALITY: Does it have distinctive brand personality markers?
4. VOCABULARY: Are word choices appropriate for this brand?
5. VISUAL LANGUAGE: Emoji usage, punctuation, capitalization patterns consistent?

Return a JSON object in exactly this format, nothing else:
{
  "overallScore": <number 0-100>,
  "dimensions": {
    "tone": <number 0-100>,
    "formality": <number 0-100>,
    "personality": <number 0-100>,
    "vocabulary": <number 0-100>,
    "visualLanguage": <number 0-100>
  },
  "flaggedMessages": [
    {
      "index": <message index starting at 0>,
      "original": "<original message>",
      "issue": "<specific reason why this is off-brand in one sentence>",
      "rewrite": "<rewritten version that matches the brand voice>"
    }
  ],
  "diagnosis": "<one sentence summary of the brand voice pattern and biggest consistency issue>",
  "consistency": "<Consistent|Drifting|Fragmented>"
}

Only flag the 3 most inconsistent messages in flaggedMessages. If all messages are consistent, flag the 3 lowest scoring ones anyway.`;

  const generation = trace.generation({
    name: "voice-scoring",
    model: "claude-sonnet-4-5",
    input: prompt,
  });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = response.content[0].text;

  generation.end({ output: rawText });
  await langfuse.flushAsync();

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Could not parse scoring response");

  return JSON.parse(jsonMatch[0]);
}