import { NextFunction, Request, Response } from "express";
import { handleUpload } from "src/share/cloudinary";

/**
 * This middleware is used to upload image to cloudinary and return the url of the image through req.body.url
 * @param req
 * @param res
 * @param next
 * @returns
 */

export async function cloudinaryBase64Middleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.files) {
    // @ts-ignore
    req.files.forEach(async (file) => {
      const b64 = Buffer.from(file!.buffer).toString("base64");
      let dataURI = "data:" + file!.mimetype + ";base64," + b64;
      try {
        const cldRes = await handleUpload(dataURI);
        req.body.url = cldRes.secure_url;
        req.body.cloudinary_id = cldRes.public_id;
        next();
      } catch (error) {
        res.status(500).json({ message: "Image uploaded failed" });
        return;
      }
    })
  }

  if (req.file?.buffer) {
    const b64 = Buffer.from(req!.file!.buffer).toString("base64");
    let dataURI = "data:" + req!.file!.mimetype + ";base64," + b64;
    try {
      const cldRes = await handleUpload(dataURI);
      req.body.url = cldRes.secure_url;
      req.body.cloudinary_id = cldRes.public_id;
      next();
    } catch (error) {
      res.status(500).json({ message: "Image uploaded failed" });
      return;
    }
  } else {
    return;
  }
}
