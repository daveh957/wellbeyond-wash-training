export interface CloudinaryUploadResult {
  access_mode: 'string';      //The accessibility mode of the media asset: public, or authenticated.
  aggregations: 'array';      //The aggregation counts data requested when using the Search API. For aggregation fields without discrete values, the results are divided into categories:
  audio: 'object';            //The audio information of the media asset, including the codec, bit_rate, frequency, channels, and channel_layout.
  backup: 'boolean';          //Indicates whether the asset is backed up to secondary storage.
  bit_rate: 'number';         //The bitrate of the video.
  bytes: 'number';            //The size of the media asset in bytes.
  colors: 'array';            //The color histogram of the first 32 colors in the image. If all colors are opaque, then 6-digit RGB hex values are returned, but if one or more colors contain an alpha channel, then 8-digit RGBA hex values are returned.
  context: 'object';          //The key-value pairs of general textual context metadata attached to the media asset.
  coordinates: 'object';      //The coordinates of a single region contained in an image that is subsequently used for cropping the image using the custom gravity mode. The region is specified by the X & Y coordinates of the top left corner and the width & height of the region.
  created_at: 'string';       //The UTC date and time when the asset was originally uploaded in ISO8601 syntax: [yyyy-mm-dd]T[hh:mm:ss]Z.
  data: 'object';             //The requested information when managing adaptive streaming profiles.
  delete_token: 'string';     //A token that can be used to delete the uploaded media asset within the next 10 minutes using an unauthenticated API deletion request.
  deleted: 'array';           //The list of media assets requested for deletion, with the status of each asset (deleted unless there was an issue).
  derived: 'array';           //The list of derived assets generated (and cached) from the original media asset, including the transformation applied, size and URL for accessing the derived media asset.
  duration: 'number';         //The duration of the media asset in seconds (video or audio).
  eager: 'array';             //The derived images generated as per the requested eager transformations of the method call.
  etag: 'string';             //Used to determine whether two versions of an asset are identical.
  faces: 'array';             //The coordinates of the faces automatically detected in an image. Each face is specified by the X & Y coordinates of the top left corner and the width & height of the face.
  folders: 'array';           //A list of all root folders or the subfolders of a specified root folder. Each folder is listed with a name and path.
  format: 'string';           //The format of the media asset.
  frame_rate: 'number';       //The frame rate of the video.
  grayscale: 'boolean';       //If the image only contains a single grayscale channel.
  height: 'number';           //The height of the media asset in pixels.
  illustration_score: 'number';   //The likelihood that the image is an illustration as opposed to a photograph. A value between 0 (photo) and 1.0 (illustration).
  image_metadata: 'object';   //The IPTC, XMP, and detailed Exif metadata of the image.
  info: 'object';             //Any requested information from executing one of the Cloudinary Add-ons on the media asset.
  last_updated: 'string';     //The last time the account was updated. This is one of the details returned when requesting account usage details.
  mappings: 'array';          //A listing of all auto-upload mappings by folder and its mapped template (URL).
  message: 'string';          //Any additional information regarding the API method request. For example, this could be a confirmation message (e.g., updated) or an indication of any error encountered (e.g., Resource not found).
  moderation: 'object';       //The current moderation status and details if any.
  next_cursor: 'string';      //When a request has more results to return than max_results, the response includes the partial boolean parameter set to true, as well as a next_cursor value. You can then specify the value as the next_cursor parameter of the following request (for methods supporting the parameter).
  original_filename: 'string';    //The name of the media asset when originally uploaded. Relevant when delivering assets as attachments (setting the flag transformation parameter to attachment).
  pages: 'number';            //The number of pages in the image: included if the image has multiple pages (e.g., PDF or animated GIF).
  partial: 'boolean';         //When a request has more results to return than max_results, the response includes the partial boolean parameter set to true, as well as a next_cursor value. You can then specify the value as the next_cursor parameter of the following request (for methods supporting the parameter).
  phash: 'string';            //The perceptual hash (pHash) of the image acts as a fingerprint that allows checking image similarity.
  pixels: 'number';           //The number of pixels in the image (width x height).
  placeholder: 'boolean';     //Indicates if a placeholder (default image) is currently used instead of displaying the image (due to moderation).
  plan: 'string';             //The Cloudinary Plan associated with the account. One of the details returned when requesting account usage details.
  presets: 'array';           //A listing of all upload presets. Each preset has the following attributes:
  predominant: 'object';      //The predominant colors in the image according to both a Google palette and a Cloudinary palette.
  public_id: 'string';        //The public identifier that is used for accessing the media asset. The Public ID may contain a full path including folders separated by a slash (/).
  resources: 'array';         //The list of media assets matching the specified criteria.
  resource_type: 'string';    //The type of media asset: image, raw, or video.
  secure_url: 'string';       //The HTTPS URL for securely accessing the media asset.
  semi_transparent: 'boolean';    //If the image has an alpha (transparency) channel.
  signature: 'string';        //The signature for verifying the response is a valid response from Cloudinary.
  transformations: 'array';   //A listing of all transformations specified in your account. Each transformation has the following fields:
  tags: 'string';             //The list of tags currently assigned to the media asset.
  time: 'number';             //The time taken to process the request in seconds.
  total_count: 'number';      //The total number of assets matching the search criteria.
  thumbnail_url: 'string';
  type: 'string';             //The delivery type of the media asset. In most cases, upload, private or authenticated. For details on all possible types, see Delivery types.
  url: 'string';              //The HTTP URL for accessing the media asset.
  version: 'number';          //The current version of the image used in the Media Library, Admin API, and delivery URLs.
  video: 'array';             //The video encoding information, including pix_format, codec, level, and bit_rate.
  width: 'number';            //The width of the media asset in pixels.
};
