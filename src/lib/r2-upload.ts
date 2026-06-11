// ─── R2 presigned URL per upload diretto dal browser ─────────────────────────
import { AwsClient } from "aws4fetch";

const R2_ACCOUNT_ID    = "b4a2bcff1a5784e0ade3f840cd87c94f";
const R2_ACCESS_KEY_ID = "817163d3d36b771bb11b3d621ee24171";
const R2_SECRET_KEY    = "17b9189e836f9bbae72cc43459978235c62b4e4f2a2120e6a2678f0f815339ab";
const R2_BUCKET        = "portfolio";
const R2_ENDPOINT      = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

export async function generatePresignedUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  const client = new AwsClient({
    accessKeyId:     R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_KEY,
    region:          "auto",
    service:         "s3",
  });

  const url = new URL(`${R2_ENDPOINT}/${R2_BUCKET}/${key}`);
  url.searchParams.set("X-Amz-Expires", String(expiresIn));

  const signed = await client.sign(
    new Request(url.toString(), { method: "PUT" }),
    {
      aws: { signQuery: true },
      headers: { "Content-Type": contentType },
    }
  );

  return signed.url;
}
