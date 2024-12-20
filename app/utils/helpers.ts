import parse from "words-to-numbers";

/**
 * Parses a chat message to extract the total price in numerical format.
 *
 * @param messages - An array of chat messages, each containing a role and content.
 * @returns The total price as a number if found, or null if no price is detected.
 */
export const parseTotalPrice = (
  messages: { role: string; content: string }[]
) => {
  const priceMessage = messages.find((msg) =>
    msg.content.toLowerCase().includes("total is")
  );

  if (!priceMessage) return null;

  const priceMatch = priceMessage.content.match(
    /total is ([\w\s-]+) dollars?/i
  );
  if (!priceMatch) return null;

  const wordPrice = priceMatch[1];
  const convertedPrice = parse(wordPrice);

  const centsMatch = priceMessage.content.match(/and ([\w\s-]+) cents?/i);
  if (centsMatch) {
    const wordCents = centsMatch[1];
    const convertedCents = parse(wordCents);
    return parseFloat(`${convertedPrice}.${convertedCents}`);
  }

  return parseFloat(`${convertedPrice}`);
};
