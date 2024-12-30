import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export function getBase64FromUrl(url: string) {
  return fetch(url)
    .then((res) => res.blob())
    .then((blob) =>
      getBase64(new File([blob], "image.jpg", { type: "image/jpeg" }))
    );
}
