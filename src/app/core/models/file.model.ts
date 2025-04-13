export interface FileModel {
    id: string;
    hash: string;
    checksum: string;
    name: string;
    path: string;
    format: string;
    mimeType: string;
    length: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    provider: StorageProvider;
}
export enum StorageProvider {
    Local = 0,
    AzureBlob = 1,
    AmazonS3 = 2,
    GoogleCloudStorage = 3,
    Aliyun = 4,
    Tencent = 5
}
