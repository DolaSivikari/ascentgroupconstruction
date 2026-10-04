export async function healthTokenMatches(
  header: string | null,
  expected: string | undefined,
): Promise<boolean> {
  if (!expected || expected.length < 32 || !header?.startsWith("Bearer "))
    return false;
  const digest = async (value: string) =>
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
    );
  const [actual, wanted] = await Promise.all([
    digest(header.slice(7)),
    digest(expected),
  ]);
  let difference = 0;
  for (let index = 0; index < wanted.length; index++)
    difference |= actual[index] ^ wanted[index];
  return difference === 0;
}
export const healthJson = (
  body: Record<string, unknown>,
  status = 200,
  cors = false,
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...(cors
        ? {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "authorization, apikey, content-type, x-client-info",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          }
        : {}),
    },
  });
