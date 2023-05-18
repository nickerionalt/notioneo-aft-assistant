export function getSecretValueFromLink(link: string): string | null {
  const regex = /.*\/(.*)$/; // Regex pattern to match everything after the last '/'
  const match = regex.exec(link);

  if (match && match[1]) {
    return match[1];
  }

  return null; // Return null if no match found
}

const link = Deno.env.get("DATABASE_PAGE"); // Retrieve the secret link from Deno environment variables
if (!link) {
  console.log("Secret link not found in the environment variables.");
  Deno.exit(1);
}

const secretValue = getSecretValueFromLink(link);

if (secretValue) {
  console.log(secretValue);
} else {
  console.log("Unable to retrieve the secret value from the link.");
}
