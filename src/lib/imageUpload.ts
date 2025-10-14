import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function saveImageFile(file: Buffer, originalName: string): Promise<string> {
  // Create uploads directory if it doesn't exist
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  // Generate a unique filename
  const timestamp = Date.now();
  const fileExtension = path.extname(originalName);
  const fileName = `${timestamp}-${originalName}`;
  const filePath = path.join(uploadDir, fileName);

  // Write the file to the uploads directory
  await writeFile(filePath, file);

  // Return the relative path to be stored in the database
  return `/uploads/${fileName}`;
}