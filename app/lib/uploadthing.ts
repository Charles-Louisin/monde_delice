import { createUploadthing, type FileRouter } from "uploadthing/next";
import { verifyAdminToken } from './auth';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Vérifier l'authentification admin
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Token d\'authentification requis');
      }

      const token = authHeader.substring(7);
      const payload = verifyAdminToken(token);
      if (!payload || !payload.admin) {
        throw new Error('Token invalide');
      }

      return { adminId: 'admin' };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.adminId);
      console.log("file url", file.url);

      return { uploadedBy: metadata.adminId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
