import { Client, Databases, ID, Query } from "appwrite";
import conf from "../conf/conf";

export class DatabaseService {
    client = new Client();
    databases;

    constructor() {
        this.client.setEndpoint(conf.appwriteURL).setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(conf.appwritedatabaseId, conf.appwriteCollectionUsersId, slug);
        } catch (error) {
            console.log("Error in getPost function in DatabaseService::::",error);
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(conf.appwritedatabaseId,conf.appwriteCollectionUsersId, queries)
        } catch (error) {
            console.log("AppWrite Service :: in getPosts() function", error);
            return false;
        }
    }

    async createPost({ title, slug, content, featuredImage, status, userId}) {
        try {
            this.databases.createDocument(conf.appwritedatabaseId,conf.appwriteCollectionUsersId,slug,
                {title,featuredImage,content,status,userId})
        } catch (error) {
            console.log("AppWrite Service :: in createPost() function", error);
            return false;
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            return await this.databases.updateDocument(
                conf.appwritedatabaseId,
                conf.appwriteCollectionUsersId,
                slug,
                {
                    title, content, featuredImage, status
                }
            )
        } catch (error) {
            console.log("Appwrite service :: updateDocument() :: ", error);
            return false
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwritedatabaseId,
                conf.appwriteCollectionUsersId,
                slug,
                )
            return true;    
        } catch (error) {
            console.log("Appwrite service :: deleteDocument() :: ", error);
            return false
        }
    }
}