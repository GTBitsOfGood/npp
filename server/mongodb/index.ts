import mongoose, { Document } from "mongoose";

export async function connectToDB(): Promise<void> {
  if (mongoose.connections[0].readyState) return;

  await mongoose
    .connect(process.env.DATABASE_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .catch((e) => {
      console.error("Error connecting to database.");

      throw e;
    });
}

export * from "./UserDocument";
export * from "./ApplicationDocument";
export { default as meeting } from "./MeetingDocument";
export type EntityDoc = Document & { [key: string]: any };
