export function extractHashtags(text: string): string[] {
  const hashtagPattern = /#\w+/g;

  const hashtags = text.match(hashtagPattern);

  return hashtags || [];
}
