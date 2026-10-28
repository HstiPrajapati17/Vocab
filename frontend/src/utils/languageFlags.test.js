import { getLanguageFlag } from "./languageFlags";

test("uses a backend image URL when one is provided", () => {
  const imageUrl =
    "https://ki-language-learning.s3.us-east-1.amazonaws.com/uploads/1785229787252_italy.png";

  expect(getLanguageFlag("Italy", imageUrl)).toBe(imageUrl);
});
