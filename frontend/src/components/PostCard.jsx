import React from 'react'
import { Link } from 'react-router-dom'
import appwriteStorageService from '../appwrite/storage'

function PostCard({
    $id, title, featuredImage
}) {
  return (
    <Link to={`/post/${id}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4'>
            <div>
                <img src={appwriteStorageService.getFilePreview(featuredImage)} alt={title} className='rounded-xl'/>
                <h2 className='text-xl font-bold'>{title}</h2>
            </div>
        </div>
    </Link>
  )
}

export default PostCard