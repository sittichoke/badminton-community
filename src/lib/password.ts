import crypto from "node:crypto";

const ITERATIONS = 210000;
const KEY_LENGTH = 32;
const DIGEST = "sha256";

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await pbkdf2Async(password, salt);
  return [ITERATIONS, DIGEST, salt, derivedKey].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [iterationStr, digest, salt, originalKey] = stored.split("$");
  if (!iterationStr || !digest || !salt || !originalKey) return false;
  const iterations = Number(iterationStr);
  if (!Number.isFinite(iterations)) return false;
  const derivedKey = await pbkdf2Async(password, salt, iterations, digest as crypto.BinaryToTextEncoding);
  const original = Buffer.from(originalKey, "hex");
  const comparison = Buffer.from(derivedKey, "hex");
  return original.length === comparison.length && crypto.timingSafeEqual(original, comparison);
}

async function pbkdf2Async(
  password: string,
  salt: string,
  iterations = ITERATIONS,
  digest: crypto.BinaryToTextEncoding = DIGEST,
) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, KEY_LENGTH, digest, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(derivedKey.toString("hex"));
    });
  });
}
