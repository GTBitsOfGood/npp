import mongoose from "mongoose";

export default async (): Promise<void> => {
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
};
