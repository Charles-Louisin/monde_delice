import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "10MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      console.log("✅ UploadThing - Upload complete:", file.url);
      return { uploadedBy: 'client' };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
