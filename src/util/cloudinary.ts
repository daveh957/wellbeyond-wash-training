import { cloudinaryConfig } from "../CLOUDINARY_CONFIG";
import {Cloudinary} from 'cloudinary-core';

const cl = Cloudinary.new({cloud_name: cloudinaryConfig.cloudName});

export const getPublicId = (url:string) : string => {
  let re = new RegExp('^https?://res.cloudinary.com/'+cloudinaryConfig.cloudName+'/(image|video)/upload');
  if (url.match(re)) {
    let publicId = url.replace(re, '');
    publicId = publicId.replace(new RegExp('^/v[0-9]*/'), ''); // Strip out version number
    return publicId;
  }
  return url;
}

export const getLessonIconUrl = (url:string, completed:boolean) => {
  if (completed) {
    return cl.url(getPublicId(url),
      {secure: true,
        transformation: [
          {width: 400, crop: 'scale'},
          {overlay: 'text:helvetica_100_bold:Completed', gravity:"north", y:20, angle:-45, color:"#999999", opacity:50},
          {quality: 'auto'},
          {format: 'auto'},
        ]});
  }
  else {
    return cl.url(getPublicId(url),
      {secure: true,
    transformation: [
      {width: 400, crop: 'scale'},
      {quality: 'auto'},
      {format: 'auto'},
    ]});
  }
}
