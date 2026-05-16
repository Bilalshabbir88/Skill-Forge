/**
 * Upload file directly to Cloudinary from frontend
 * @param {File} file - The file to upload (image or video)
 * @param {string} folder - Cloudinary folder path (default: 'skill-forge')
 * @returns {Promise<string>} - Cloudinary secure_url
 */
const uploadToCloudinary = async (file, folder = 'skill-forge') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    throw new Error('Failed to upload to Cloudinary');
  }

  const data = await res.json();
  return data.secure_url; // This URL should be stored in MongoDB
};

export default uploadToCloudinary;
