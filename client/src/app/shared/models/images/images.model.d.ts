export type ImageResponse = {
  message: string;
  status: "ACTIVE";
  id: string;
  url: string;
  cloudinary_id: string;
  type: ImageType;
  updated_at: string;
  created_at: string;
};
