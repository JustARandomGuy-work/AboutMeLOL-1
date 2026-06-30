import axios from 'axios';

export class BunnyService {
  static readonly STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE || 'aboutme-media';
  static readonly STORAGE_URL = `https://${process.env.BUNNY_STORAGE_REGION || 'ny'}.storage.bunnycdn.com/${BunnyService.STORAGE_ZONE}`;
  static readonly CDN_URL = process.env.BUNNY_CDN_URL || `https://${BunnyService.STORAGE_ZONE}.b-cdn.net`;
  static readonly API_KEY = process.env.BUNNY_API_KEY;

  static async uploadFile(fileName: string, fileBuffer: Buffer, path: string = ''): Promise<string> {
    const fullPath = path ? `${path}/${fileName}` : fileName;
    const uploadUrl = `${this.STORAGE_URL}/${fullPath}`;

    try {
      await axios.put(uploadUrl, fileBuffer, {
        headers: {
          'AccessKey': this.API_KEY,
          'Content-Type': 'application/octet-stream'
        }
      });

      return `${this.CDN_URL}/${fullPath}`;
    } catch (error) {
      console.error('Bunny upload error:', error);
      throw error;
    }
  }

  static async deleteFile(fileName: string, path: string = ''): Promise<boolean> {
    const fullPath = path ? `${path}/${fileName}` : fileName;
    const deleteUrl = `${this.STORAGE_URL}/${fullPath}`;

    try {
      await axios.delete(deleteUrl, {
        headers: { 'AccessKey': this.API_KEY }
      });
      return true;
    } catch (error) {
      console.error('Bunny delete error:', error);
      throw error;
    }
  }

  static generateFileName(userId: string, ext: string): string {
    return `${userId}-${Date.now()}.${ext}`;
  }
}

export default BunnyService;
