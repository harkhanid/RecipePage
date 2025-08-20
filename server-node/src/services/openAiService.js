import OpenAI from "openai";

const OPENAI_ACCESS_KEY = process.env.OPENAI_ACCESS_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_ACCESS_KEY,
});

export const moderateText = async (text) => {
  const response = await openai.moderations.create({
    model: "omni-moderation-latest",
    input: text,
  });
  return response.results[0].flagged || false;
};
