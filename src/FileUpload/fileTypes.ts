type CommonImageExtension =
  | '.jpg'
  | '.jpeg'
  | '.png'
  | '.gif'
  | '.bmp'
  | '.webp'
  | '.svg'
  | '.tiff'
  | '.ico'
  | '.exr'

type CommonVideoExtension = '.mp4' | '.mov' | '.avi' | '.wmv' | '.flv' | '.webm' | '.mkv'

type FileMime =
  | 'application/*'
  | 'application/pdf'
  | 'application/msword'
  | 'application/vnd.ms-excel'
  | 'application/vnd.ms-powerpoint'
  | 'application/zip'
  | 'application/x-rar-compressed'
  | 'application/x-tar'
  | 'application/x-7z-compressed'
  | 'application/x-gzip'
  | 'application/x-bzip2'
  | 'application/x-iso9660-image'
  | 'application/x-apple-diskimage'
  | 'application/javascript'
  | 'application/json'
  | 'application/xml'
  | 'audio/*'
  | 'audio/mpeg'
  | 'audio/wav'
  | 'audio/ogg'
  | 'video/*'
  | 'video/mp4'
  | 'video/quicktime'
  | 'video/x-msvideo'
  | 'image/*'
  | 'image/png'
  | 'image/jpeg'
  | 'image/gif'
  | 'image/bmp'
  | 'image/webp'
  | 'image/svg+xml'
  | 'text/*'
  | 'text/plain'
  | 'text/html'
  | 'text/css'

//   helper type
export type AcceptType = CommonImageExtension | CommonVideoExtension | FileMime | '*'
