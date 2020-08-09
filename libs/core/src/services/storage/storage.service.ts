import * as S3 from 'aws-sdk/clients/s3';
import * as fs from 'fs-extra';
import * as archiver from 'archiver';
import * as asyncLib from 'async';
import { createGuid } from '../helper/helper.service';

export interface IFilePath {
  path: string;
  name: string;
}

export class StorageService {
  private s3 = new S3({
    apiVersion: '2006-03-01',
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET,
  });

  async store(file: Buffer, path: string): Promise<{ path: string }> {
    return await new Promise((resolve, reject) => {
      this.s3.putObject(
        {
          Body: file,
          Key: path,
          Bucket: process.env.S3_BUCKET_NAME,
        },
        (err) => {
          if (err) return reject(err);

          return resolve({
            path,
          });
        }
      );
    });
  }

  async getFile(path: string): Promise<{ body: S3.Body; path: string }> {
    return await new Promise((resolve, reject) => {
      this.s3.getObject(
        {
          Key: path,
          Bucket: process.env.S3_BUCKET_NAME,
        },
        (err, file) => {
          if (err) return reject(err);

          return resolve({
            path,
            body: file.Body,
          });
        }
      );
    });
  }

  async downloadMultipleFilesZip(paths: IFilePath[]): Promise<string> {
    // eslint-disable-next-line no-async-promise-executor
    return await new Promise(async (resolve, reject) => {
      const results = await this.downloadFiles(paths);
      const outputPath = `/tmp/${createGuid()}.zip`;
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });

      output.on('close', () => {
        resolve(outputPath);
      });

      output.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);

      for (const result of results) {
        archive.append(result.file.body, {
          name: result.name,
        });
      }

      archive.finalize();
    });
  }

  async downloadFiles(files: IFilePath[]): Promise<{ file: { path: string; body: Buffer }; name: string }[]> {
    const results = [];

    return await new Promise((resolve, reject) => {
      asyncLib.parallelLimit(
        files.map((file) => {
          return async (done: (error?: Error) => void) => {
            try {
              const result = await this.getFile(file.path);

              results.push({
                file: result,
                name: file.name,
              });
              done();
            } catch (e) {
              done(e);
            }
          };
        }),
        5,
        (err) => {
          if (err) return reject(err);

          return resolve(results);
        }
      );
    });
  }
}
