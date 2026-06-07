export const formatPrice = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export const BASE_URL = (import.meta.env.VITE_BASE_URL || "https://umafood.pythonanywhere.com").replace(/\/+$/, "");

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const cleanPath = imagePath.replace(/^\/+/, "");
  return `${BASE_URL}/${cleanPath}`;
};

