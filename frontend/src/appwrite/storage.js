import { Client, ID, Storage } from "appwrite";
import conf from "../conf/conf";

export class StorageService {
    client = new Client();
    bucket;

    constructor() {
        this.client.setEndpoint(conf.appwriteURL).setProject(conf.appwriteProjectId);
        this.bucket = new Storage(this.client);
    }

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite service :: uploadFile() :: ", error);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            return await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
                
            )
        } catch (error) {
            console.log("Appwrite service :: deleteFile() :: ", error);
            return false
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        ).href
    }
}