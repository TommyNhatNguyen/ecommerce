import { NextFunction, Request, Response } from "express";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import z from "zod";

export type JWTTokenObject = {
  accessToken: string;
  refreshToken: string;
};
export type CustomRequest = Request & {
  username?: string | JwtPayload; // User data from the token payload
};

export const RefreshTokenCreateDTOSchema = z.object({
  username: z.string(),
  refreshToken: z.string(),
});

export type RefreshTokenCreateDTO = z.infer<typeof RefreshTokenCreateDTOSchema>;

export const generateTokens = (data: any): JWTTokenObject => {
  const accessToken = sign(
    { data },
    process.env.ACCESS_JWT_PRIVATE_KEY as string,
    {
      expiresIn: process.env.ACCESS_JWT_EXPIRE_TIME,
    }
  );
  const refreshToken = sign(
    { data },
    process.env.REFRESH_JWT_PRIVATE_KEY as string,
    {
      expiresIn: process.env.REFRESH_JWT_EXPIRE_TIME,
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const jwtSign = (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = res.locals.username;
    const { accessToken, refreshToken } = generateTokens(username);
    if (accessToken && refreshToken) {
      res.status(200).send({
        message: "Login successful",
        data: {
          accessToken,
          refreshToken,
        },
      });
    } else {
      res.status(500).send({
        messgae: "Internal server error",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const jwtVerify = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1] || "";
    if (!accessToken) {
      res.status(401).send({
        message: "Unathorized! Access denied",
      });
    }
    const decoded = verify(
      accessToken,
      process.env.ACCESS_JWT_PRIVATE_KEY as string
    ) as JwtPayload;
    req.username = decoded;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Please log in again." });
      return;
    }
    res.status(401).json({ message: "Invalid token." });
    return;
  }
};

export const jwtRefresh = (req: Request, res: Response, next: NextFunction) => {
  const { data, success } = RefreshTokenCreateDTOSchema.safeParse(req.body);
  if (!success) {
    res.status(400).send({
      message: "Wrong payload",
    });
  }
  const { username, refreshToken } = data!;
  try {
    const refreshPrivateKey = process.env.REFRESH_JWT_PRIVATE_KEY as string;
    if (!refreshToken) res.status(400).send({ message: "Invalid request" });
    const decoded = verify(refreshToken, refreshPrivateKey) as JwtPayload;
    if (!decoded) res.status(406).send({ message: "Unauthorized" });
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      generateTokens(username);
    if (newAccessToken && newRefreshToken) {
      res.status(200).send({
        message: "Successful",
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
