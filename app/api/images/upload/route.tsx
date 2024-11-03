// app/api/upload/route.ts

import formidable, { File } from "formidable";
import fs from "fs";
import { IncomingMessage } from "http";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "/public/uploads/temp")
const form = formidable({
  uploadDir,
  keepExtensions: true,
  multiples: false,
});

if (!fs.existsSync(uploadDir as string)) {
  fs.mkdirSync(uploadDir as string, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    
    const [_fields, files] = await form.parse(
      req as unknown as IncomingMessage
    );
    if (!files.file || !files.file.length)
      throw new Error('File not found!')

    const file = files.file[0] as File;
    const filePath = file.filepath.replace(process.cwd() + "/public", "");

    return NextResponse.json({ filePath });
  } catch (error: any) {
    return NextResponse.json({ error: "Upload Error: " + error.message }, { status: 500 });
  }
}
