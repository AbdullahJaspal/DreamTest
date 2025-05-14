import {Platform} from 'react-native';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import * as ImagePicker from 'react-native-image-picker';
import * as DocumentPicker from 'react-native-document-picker';
import Toast from 'react-native-simple-toast';

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  RECEIVED = 'received',
}

export const URL_REGEX = /(https?:\/\/[^\s]+)/g;
export const IMAGE_URL_REGEX =
  /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)(\?[^\s]*)?|https?:\/\/picsum\.photos\/[^\s]*|https?:\/\/[^\s]+\/photos?\/[^\s]+)/i;
export const VIDEO_URL_REGEX =
  /(https?:\/\/[^\s]+\.(mp4|mov|avi|wmv|flv|webm|mkv)(\?[^\s]*)?|https?:\/\/[^\s]*video[^\s]*|https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[^\s]+)/i;

export interface ExtendedMessage {
  _id: string;
  text?: string;
  createdAt: Date;
  user: {
    _id: string | number;
    name?: string;
    avatar?: string;
  };
  senderId?: string | number;
  receiverId?: string | number;
  status?: MessageStatus;
  uploadProgress?: number;
  retryFunction?: () => void;
  duration: string;
  type?: string;
  image?: string;
  video?: string;
  audio?: string;
  document?: string;
  contactName?: string;
  contactPhone?: string;
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  color?: string;
  roomId?: string;
  parentMessageId?: string;
  isRead?: boolean;
  system?: boolean;
}

export const generateUniqueId = (): string => {
  return 'msg_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
};

export const formatMessageTime = (
  timestamp: string | number | Date,
): string => {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12;

  return `${formattedHours}:${minutes} ${ampm}`;
};

export const formatMessageDate = (
  timestamp: string | number | Date,
): string => {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset hours to compare just the dates
  const messageDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const todayDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const yesterdayDay = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
  );

  if (messageDay.getTime() === todayDay.getTime()) {
    return 'Today';
  } else if (messageDay.getTime() === yesterdayDay.getTime()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
};

export const formatDuration = (seconds: number): string => {
  if (!seconds) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export const MEDIA_UPLOAD_ENDPOINT = 'https://api.dreamlived.com/upload/single';

export const GET_MEDIA_ENDPOINT =
  'https://api.dreamlived.com/users/getAllMedia/';
export const requestPermission = async (permission: any): Promise<boolean> => {
  try {
    const result = await request(permission);
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error('Error requesting permission:', error);
    return false;
  }
};

export const requestCameraPermission = async (): Promise<boolean> => {
  const permission =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.CAMERA
      : PERMISSIONS.IOS.CAMERA;
  return requestPermission(permission);
};

export const requestMicrophonePermission = async (): Promise<boolean> => {
  const permission =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.RECORD_AUDIO
      : PERMISSIONS.IOS.MICROPHONE;
  return requestPermission(permission);
};

// Get contacts permission
export const requestContactPermission = async (): Promise<boolean> => {
  const permission =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.READ_CONTACTS
      : PERMISSIONS.IOS.CONTACTS;
  return requestPermission(permission);
};

// Get location permission
export const requestLocationPermission = async (): Promise<boolean> => {
  const permission =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
  return requestPermission(permission);
};

// Pick image or video from gallery
export const pickMediaFromGallery = async (
  options: {
    mediaType?: 'photo' | 'video' | 'mixed';
    selectionLimit?: number;
  } = {},
): Promise<any> => {
  try {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: options.mediaType ?? 'mixed',
      quality: 0.8,
      selectionLimit: options.selectionLimit ?? 1, // 👈 make sure this is a number
      includeBase64: false,
      includeExtra: true,
      duration: 180,
    });

    if (result.didCancel) {
      return {cancelled: true};
    }

    return {
      assets: result.assets,
      cancelled: false,
    };
  } catch (error) {
    console.error('Error picking media:', error);
    return {error};
  }
};

// Take photo or video with camera
export const takeMediaWithCamera = async (
  options: {mediaType: 'photo' | 'video' | 'mixed'} = {mediaType: 'photo'},
): Promise<any> => {
  try {
    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      Toast.show('Camera permission is required', Toast.SHORT);
      return {permissionDenied: true};
    }

    const result = await ImagePicker.launchCamera({
      mediaType: options.mediaType,
      quality: 0.8,
      includeBase64: false,
      includeExtra: true,
      saveToPhotos: true,
    });

    if (result.didCancel) {
      return {cancelled: true};
    }

    if (result.errorCode) {
      Toast.show(`Error: ${result.errorMessage}`, Toast.SHORT);
      return {error: result.errorMessage};
    }

    return {
      assets: result.assets,
      cancelled: false,
    };
  } catch (error) {
    console.error('Error taking media:', error);
    return {error};
  }
};

// Pick document
export const pickDocument = async (type?: string): Promise<any> => {
  try {
    const options: DocumentPicker.DocumentPickerOptions = {
      type: type ? [type] : [DocumentPicker.types.allFiles],
      copyTo: 'cachesDirectory',
    };

    const result = await DocumentPicker.pickSingle(options);

    return {
      uri: result.fileCopyUri || result.uri,
      type: result.type,
      name: result.name,
      size: result.size,
      cancelled: false,
    };
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      return {cancelled: true};
    }
    console.error('Error picking document:', error);
    return {error};
  }
};

// Pick audio
export const pickAudio = async (): Promise<any> => {
  return pickDocument(DocumentPicker.types.audio);
};

// Upload media to server
export const uploadMedia = async (
  mediaUri: string,
  mediaType: 'image' | 'video' | 'audio' | 'document',
  authToken: string,
  fileName?: string,
  mimeType?: string,
): Promise<string> => {
  try {
    // Determine file extension and content type based on mediaType
    let fileExtension = '.file';
    let contentType = 'application/octet-stream';
    let fieldName = 'file';

    switch (mediaType) {
      case 'video':
        fileExtension = '.mp4';
        contentType = 'video/mp4';
        fieldName = 'video';
        break;
      case 'image':
        fileExtension = '.jpg';
        contentType = 'image/jpeg';
        fieldName = 'image';
        break;
      case 'audio':
        fileExtension = '.mp3';
        contentType = 'audio/mpeg';
        fieldName = 'audio';
        break;
      case 'document':
        if (mimeType) {
          contentType = mimeType;
          const ext = mimeType.split('/')[1];
          fileExtension = ext ? `.${ext}` : '.doc';
        }
        fieldName = 'document';
        break;
    }

    const uniqueName = fileName || `${mediaType}_${Date.now()}${fileExtension}`;
    const formData = new FormData();

    formData.append('file', {
      uri: mediaUri,
      type: contentType,
      name: uniqueName,
    } as any);

    const response = await fetch(MEDIA_UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response);

    const result = await response.json();

    console.log(result);

    if (result.success) {
      return result.url;
    } else {
      throw new Error(result.message || 'Media upload failed');
    }
  } catch (error) {
    console.error(`Error uploading ${mediaType}:`, error);
    throw error;
  }
};

export const detectContentType = (url: string) => {
  // First check common patterns
  if (IMAGE_URL_REGEX.test(url)) {
    return 'image';
  }

  if (VIDEO_URL_REGEX.test(url)) {
    return 'video';
  }

  // Check for specific services and patterns
  if (url.includes('picsum.photos')) {
    return 'image';
  }

  if (url.includes('/video/') || url.includes('/videos/')) {
    return 'video';
  }

  // Default to website
  return 'website';
};

export const messageType = (message: string) => {
  if (message.system) return 'system';

  return (
    message.type ||
    (message.text &&
    !message.image &&
    !message.video &&
    !message.audio &&
    !message.document &&
    !message.location
      ? 'text'
      : message.image
      ? 'image'
      : message.video
      ? 'video'
      : message.audio
      ? 'audio'
      : message.document
      ? 'file'
      : message.location
      ? 'location'
      : message.contactName
      ? 'contact'
      : 'text')
  );
};

export const getDomainFromUrl = (url: string) => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace('www.', '');
  } catch (e) {
    return url;
  }
};

export const fetchLinkPreviewMetadata = async (url: string) => {
  // Default/fallback metadata
  const defaultMetadata = {
    title: '',
    description: '',
    image: '',
    favicon: '',
    siteName: getDomainFromUrl(url),
  };

  if (!url) return defaultMetadata;

  try {
    // Create request options
    const options = {
      method: 'GET',
      headers: {
        Accept: 'text/html',
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
      },
      timeout: 5000,
    };

    // Fetch the HTML of the page
    const response = await fetch(url, options);
    const html = await response.text();

    // Extract metadata using regular expressions
    const metadata = {
      ...defaultMetadata,
      ...extractMetadataFromHtml(html, url),
    };

    return metadata;
  } catch (error) {
    console.error('Error fetching link preview:', error);
    return defaultMetadata;
  }
};

export const extractMetadataFromHtml = (html, url) => {
  const metadata = {
    title: '',
    description: '',
    image: '',
    favicon: '',
    siteName: '',
  };

  // Extract Open Graph title
  const ogTitleMatch = html.match(
    /<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i,
  );
  if (ogTitleMatch) metadata.title = ogTitleMatch[1];

  // If no OG title, try regular title
  if (!metadata.title) {
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch) metadata.title = titleMatch[1];
  }

  // Extract description
  const ogDescMatch = html.match(
    /<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i,
  );
  if (ogDescMatch) metadata.description = ogDescMatch[1];

  // If no OG description, try meta description
  if (!metadata.description) {
    const metaDescMatch = html.match(
      /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i,
    );
    if (metaDescMatch) metadata.description = metaDescMatch[1];
  }

  // Extract image
  const ogImageMatch = html.match(
    /<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i,
  );
  if (ogImageMatch) metadata.image = ogImageMatch[1];

  // Extract site name
  const ogSiteNameMatch = html.match(
    /<meta\s+property=["']og:site_name["']\s+content=["']([^"']*)["']/i,
  );
  if (ogSiteNameMatch) metadata.siteName = ogSiteNameMatch[1];

  // Make image URL absolute if it's relative
  if (metadata.image && !metadata.image.startsWith('http')) {
    const urlObj = new URL(url);
    if (metadata.image.startsWith('/')) {
      metadata.image = `${urlObj.protocol}//${urlObj.host}${metadata.image}`;
    } else {
      metadata.image = `${urlObj.protocol}//${urlObj.host}/${metadata.image}`;
    }
  }

  // Get favicon if not found
  if (!metadata.favicon) {
    metadata.favicon = getFaviconFromUrl(url);
  }

  // Default siteName to domain if not found
  if (!metadata.siteName) {
    metadata.siteName = getDomainFromUrl(url);
  }

  return metadata;
};

export const getFaviconFromUrl = (url: string) => {
  try {
    const {protocol, hostname} = new URL(url);
    return `${protocol}//${hostname}/favicon.ico`;
  } catch (e) {
    return '';
  }
};

export const processMessageLinkPreview = (text: string) => {
  if (!text || typeof text !== 'string') return null;

  const urls = text.match(URL_REGEX);
  if (!urls || urls.length === 0) return null;

  let previewUrl = null;
  let previewType = null;

  // First check for media URLs
  for (const url of urls) {
    const contentType = detectContentType(url);
    if (contentType === 'image' || contentType === 'video') {
      previewUrl = url;
      previewType = contentType;
      break;
    }
  }

  // If no media URLs, use the first URL as website
  if (!previewUrl) {
    previewUrl = urls[0];
    previewType = 'website';
  }

  return previewUrl ? {url: previewUrl, type: previewType} : null;
};

export const sanitizeHtml = (html: string) => {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export const getVideoPlatformInfo = (url: string) => {
  try {
    const domain = getDomainFromUrl(url);
    console.log('domain===:[]', domain);

    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
      return {
        name: 'YouTube',
        logo: 'https://www.youtube.com/s/desktop/e4d15d2c/img/favicon_144x144.png',
        color: '#FF0000',
      };
    }

    if (domain.includes('tiktok.com')) {
      return {
        name: 'TikTok',
        logo: 'https://sf16-scmcdn-va.ibytedtos.com/goofy/tiktok/web/node/_next/static/images/logo-blue-1825a9e7.png',
        color: '#000000',
      };
    }

    // Vimeo
    if (domain.includes('vimeo.com')) {
      return {
        name: 'Vimeo',
        logo: 'https://i.vimeocdn.com/favicon/main-touch_180',
        color: '#1AB7EA',
      };
    }

    // Facebook/Meta
    if (domain.includes('facebook.com') || domain.includes('fb.watch')) {
      return {
        name: 'Facebook',
        logo: 'https://static.xx.fbcdn.net/rsrc.php/yD/r/d4ZIVX-5C-b.ico',
        color: '#1877F2',
      };
    }

    // Instagram
    if (domain.includes('instagram.com')) {
      return {
        name: 'Instagram',
        logo: 'https://static.cdninstagram.com/rsrc.php/v3/yt/r/30PrGfR3xhB.png',
        color: '#E1306C',
      };
    }

    // Twitter/X
    if (domain.includes('twitter.com') || domain.includes('x.com')) {
      return {
        name: 'Twitter',
        logo: 'https://abs.twimg.com/responsive-web/client-web/icon-default.522d363a.png',
        color: '#1DA1F2',
      };
    }

    // Twitch
    if (domain.includes('twitch.tv')) {
      return {
        name: 'Twitch',
        logo: 'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png',
        color: '#9146FF',
      };
    }

    // Generic video
    return {
      name: 'Video',
      logo: null,
      color: '#3d3d3d',
    };
  } catch (e) {
    console.error('Error in getVideoPlatformInfo:', e);
    return {
      name: 'Video',
      logo: null,
      color: '#3d3d3d',
    };
  }
};

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  RECEIVED = 'received',
}
