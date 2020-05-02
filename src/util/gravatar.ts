import {createHash} from 'crypto';

export const getGravatarUrl = (email?:string) => {
  if (!email) {
    return 'https://www.gravatar.com/avatar?d=mm&s=140'
  }
  const hash = createHash('md5')
    .update(email.toLowerCase().trim())
    .digest('hex');

  return 'https://www.gravatar.com/avatar/' + hash + '?d=mm&s=140'
}

