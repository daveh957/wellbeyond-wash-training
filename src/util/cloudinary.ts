import { cloudinaryConfig } from "../CLOUDINARY_CONFIG";

export const getPublicId = (url:string) : string => {
  let re = new RegExp('^https?://res.cloudinary.com/'+cloudinaryConfig.cloudName+'/(image|video)/upload');
  if (url.match(re)) {
    let publicId = url.replace(re, '');
    publicId = publicId.replace(new RegExp('^/v[0-9]*/'), ''); // Strip out version number
    return publicId;
  }
  return url;
}
