import crypto from "crypto";

const algorithm = "aes-256-gcm";

// 🎯 FIX: Fallback if ENCRYPTION_SECRET not set
function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET;

  if (!secret) {
    console.warn("⚠️ ENCRYPTION_SECRET not set! Using fallback key.");
    // Generate a random key for this session (won't persist between restarts!)
    return crypto.randomBytes(32);
  }

  // If secret is hex string, convert to buffer
  if (secret.length === 64) {
    return Buffer.from(secret, "hex");
  }

  // If secret is regular string, hash it to 32 bytes
  return Buffer.from(
    crypto.createHash("sha256").update(secret).digest("hex"),
    "hex"
  );
}

const key = getEncryptionKey();

export function encrypt(text: string): string {
  if (!text) throw new Error("No text provided to encrypt");

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decrypt(data: string): string {
  if (!data) throw new Error("No data provided to decrypt");

  try {
    const buffer = Buffer.from(data, "base64");

    const iv = buffer.subarray(0, 12);
    const tag = buffer.subarray(12, 28);
    const encrypted = buffer.subarray(28);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(tag);

    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString("utf8");
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data");
  }
}
