import fernet from "fernet";

class Crypto {
  private ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "";
  private secret = new fernet.Secret(this.ENCRYPTION_KEY);

  encrypt = (value: string | null): string | null => {
    if (!value) return null;

    const token = new fernet.Token({
      secret: this.secret,
      time: Date.now(),
      iv: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    });

    return token.encode(value);
  };

  decrypt = (value: string | null): string | null => {
    if (!value) return null;

    try {
      const token = new fernet.Token({
        secret: this.secret,
        token: value,
        ttl: 0,
      });
      return token.decode();
    } catch (error) {
      console.warn("Decryption failed. Returning raw value.");
      return value;
    }
  };
}

export const crypto = new Crypto();
