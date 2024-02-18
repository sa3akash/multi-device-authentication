import dotenv from "dotenv";

dotenv.config();

class Config {
  public MONGO_URI = process.env.MONGO_URI;
  public PORT = process.env.PORT;
  public NODE_ENV = process.env.NODE_ENV;
  public JWT_SECRET = process.env.JWT_SECRET;

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined || value === null) {
        throw new Error(`${key} env is not defined.`);
      }
    }
  }
}

export const config: Config = new Config();
