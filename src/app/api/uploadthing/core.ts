import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { db } from "@/db";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import pinecone from "@/lib/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";
 
const f = createUploadthing();

const middleware = async () => {
  const {getUser} = getKindeServerSession();
      const user = getUser();
      if(!user || !user.id) throw new Error("UNAUTHORIZED");

      const subscriptionPlan = await getUserSubscriptionPlan();
      return { subscriptionPlan , userId: user.id };
}

const onUploadComplete = async ({
  metadata, file
}: {
  metadata: Awaited<ReturnType<typeof middleware>>
  file: {
    key: string,
    name: string,
    url: string,
  }
}) => {

  const isFileExists = await db.file.findFirst({
    where: {
      key: file.key,
    }
  })
  if(isFileExists) {
    return;
  }
  const createdFile = await db.file.create({
    data: {
      key: file.key,
      name: file.name,
      userId: metadata.userId,
      url: `https://utfs.io/f/${file.key}`,
      uploadStatus: 'PROCESSING',
    }
  })


  try {
    const response = await fetch(`https://utfs.io/f/${file.key}`);
    const blob = await response.blob()
    const loader = new PDFLoader(blob);

    const pageLevelDocs = await loader.load();
    const pagesAmt = pageLevelDocs.length;
    const {subscriptionPlan} = metadata;
    const {isSubscribed} = subscriptionPlan;

    const isProExceeded = pagesAmt > PLANS.find((plan) => plan.name === "Pro")!.pagesPerPdf;
    const isFreeExceeded = pagesAmt > PLANS.find((plan) => plan.name === "Free")!.pagesPerPdf;
    if((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
      await db.file.update({
        data: {
          uploadStatus: "FAILED",
        },
        where: {
          id: createdFile.id,
        }
      });
    }

    // vectorize and index the entire document
    const pineconeIndex = pinecone.index("pdfninja");
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    const documents = pageLevelDocs.map(doc => {
      return {
        pageContent: doc.pageContent,
        metadata: {
          fileid: createdFile.id,
        }
      };
    });
    if(false) {
      // do nothing comment for test
    }
    await PineconeStore.fromDocuments(documents, embeddings, {
      pineconeIndex,
    })
    await db.file.update({
      data: {
        uploadStatus: "SUCCESS",
      },
      where: {
        id: createdFile.id,
      }
    })

  } catch (error) {
    await db.file.update({
      data: {
        uploadStatus: "FAILED",
      },
      where: {
        id: createdFile.id,
      }
    })
  }
}
 
export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "2MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: "8MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;