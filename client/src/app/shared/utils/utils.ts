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
      getBase64(new File([blob], "image.jpg", { type: "image/jpeg" })),
    );
}

export function formatCurrency(data: number, currency = "VND") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(data);
}

export function formatDiscountPercentage(data: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(data) / 100);
}

export function formatNumber(data: number, format = "en-US") {
  return new Intl.NumberFormat(format).format(data);
}
