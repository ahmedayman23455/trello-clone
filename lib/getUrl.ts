/* 
    We store the image bucket and file Id in todo document  as  > image   
    >> the problem is that not gives you a URL to render on the screen      
*/

import { storage } from "@/appwrite";

export const getUrl = (image: Iimage) => {
  const url = storage.getFilePreview(image.buckedId, image.fileId);
  console.log("🚀 ~ file: getUrl.ts:10 ~ getUrl ~ url:", url)
  return url;
};
