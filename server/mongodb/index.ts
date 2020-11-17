import mongoose, { Document } from "mongoose";

// Initialize models at load to make sure they are ready before use
import "./ApplicationDocument";
import "./AvailabilityDocument";
import "./ContactSchema";
import "./IssueDocument";
import "./MeetingDocument";
import "./UserDocument";

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

export type EntityDoc = Document & { [key: string]: any };
