// Cloudinary — free image/video hosting for admin uploads (no credit card needed).
// Set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET
// (an *unsigned* upload preset). See FIREBASE_SETUP.md → "Cloudinary".

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const FOLDER = "rasha/projects";

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

// Free-plan limits: 10 MB per image, 100 MB per video.
const MAX_IMAGE_BYTES = 9.5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const MAX_IMAGE_EDGE = 3200; // px — plenty for full-screen display

/**
 * Upload one file. Resolves to { type: "image" | "video", src: <https url> }.
 * `onProgress(fraction)` is called with 0..1 while uploading.
 */
export async function uploadMedia(file, onProgress) {
  if (!isCloudinaryConfigured) {
    throw new Error("העלאת קבצים לא מוגדרת (חסרים פרטי Cloudinary בקובץ .env).");
  }

  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");
  if (!isVideo && !isImage) throw new Error(`"${file.name}" אינו תמונה או וידאו.`);

  let payload = file;
  if (isImage) payload = await shrinkImage(file);

  const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (payload.size > limit) {
    throw new Error(`"${file.name}" גדול מדי (מקסימום ${isVideo ? "100MB לווידאו" : "10MB לתמונה"}).`);
  }

  const form = new FormData();
  form.append("file", payload, file.name);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder", FOLDER);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${isVideo ? "video" : "image"}/upload`;
  const res = await xhrPost(endpoint, form, onProgress);
  if (!res.secure_url) throw new Error(res.error?.message || "ההעלאה נכשלה.");
  return { type: isVideo ? "video" : "image", src: res.secure_url };
}

/**
 * For Cloudinary URLs, ask for an auto-format / auto-quality / resized rendition.
 * Any other URL (e.g. /images/foo.jpg) is returned unchanged.
 */
export function optimizedUrl(src, width = 1600) {
  if (typeof src !== "string" || !src.includes("res.cloudinary.com")) return src;
  const marker = src.includes("/video/upload/") ? "/video/upload/" : "/image/upload/";
  if (!src.includes(marker)) return src;
  const transform = marker === "/video/upload/"
    ? "q_auto"
    : `f_auto,q_auto,c_limit,w_${width}`;
  return src.replace(marker, `${marker}${transform}/`);
}

/* ---------- internals ---------- */

function xhrPost(url, body, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      let json = {};
      try { json = JSON.parse(xhr.responseText); } catch { /* ignore */ }
      if (xhr.status >= 200 && xhr.status < 300) resolve(json);
      else reject(new Error(json.error?.message || `ההעלאה נכשלה (${xhr.status}).`));
    };
    xhr.onerror = () => reject(new Error("שגיאת רשת בזמן ההעלאה."));
    xhr.send(body);
  });
}

/** Downscale very large photos in the browser so they fit the free-plan size limit. */
async function shrinkImage(file) {
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file;
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file; // unsupported format in this browser (e.g. HEIC) — let Cloudinary handle it
  }
  const { width, height } = bitmap;
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(width, height));
  if (scale === 1 && file.size <= MAX_IMAGE_BYTES) {
    bitmap.close?.();
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.88));
  return blob || file;
}
