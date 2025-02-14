import { NextFunction, Request, Response } from "express";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import z from "zod";

export const JWT_TYPES = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
};

export type JWTTokenObject = {
  accessToken: string;
  refreshToken: string;
};
export type CustomRequest = Request & {
  data?:
    | {
        data: string;
        iat: number;
        exp: number;
      }
    | JwtPayload; // User data from the token payload
};

export const RefreshTokenCreateDTOSchema = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenCreateDTO = z.infer<typeof RefreshTokenCreateDTOSchema>;

export const generateTokens = (data: any, type: string): JWTTokenObject => {
  console.log("🚀 ~ generateTokens ~ type:", type);
  console.log("🚀 ~ generateTokens ~ type:", data);
  let accessKey = process.env.ACCESS_JWT_PRIVATE_KEY;
  let refreshKey = process.env.REFRESH_JWT_PRIVATE_KEY;
  let accessTime = process.env.ACCESS_JWT_EXPIRE_TIME;
  let refreshTime = process.env.REFRESH_JWT_EXPIRE_TIME;

  switch (type) {
    case JWT_TYPES.CUSTOMER:
      accessKey = process.env.CUSTOMER_ACCESS_JWT_PRIVATE_KEY;
      refreshKey = process.env.CUSTOMER_REFRESH_JWT_PRIVATE_KEY;
      accessTime = process.env.CUSTOMER_ACCESS_JWT_EXPIRE_TIME;
      refreshTime = process.env.CUSTOMER_REFRESH_JWT_EXPIRE_TIME;
      console.log("🚀 ~ generateTokens ~ accessKey:", accessKey);
      break;
    case JWT_TYPES.ADMIN:
      accessKey = process.env.ACCESS_JWT_PRIVATE_KEY;
      refreshKey = process.env.REFRESH_JWT_PRIVATE_KEY;
      accessTime = process.env.ACCESS_JWT_EXPIRE_TIME;
      refreshTime = process.env.REFRESH_JWT_EXPIRE_TIME;
      break;
    default:
      break;
  }

  const accessToken = sign({ data }, accessKey as string, {
    expiresIn: accessTime,
  });
  const refreshToken = sign({ data }, refreshKey as string, {
    expiresIn: refreshTime,
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const jwtSign = (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = res.locals.username;
    const type = res.locals.type;
    const { accessToken, refreshToken } = generateTokens(username, type);
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
    const type = res.locals.type;
    const accessToken = req.headers.authorization?.split(" ")[1] || "";
    let accessPrivateKey = process.env.ACCESS_JWT_PRIVATE_KEY;
    switch (type) {
      case JWT_TYPES.CUSTOMER:
        accessPrivateKey = process.env.CUSTOMER_ACCESS_JWT_PRIVATE_KEY;
        break;
      case JWT_TYPES.ADMIN:
        accessPrivateKey = process.env.ACCESS_JWT_PRIVATE_KEY;
        break;
      default:
        break;
    }
    if (!accessToken) {
      res.status(401).send({
        message: "Unathorized! Access denied",
      });
    }
    const decoded = verify(
      accessToken,
      accessPrivateKey as string
    ) as JwtPayload;
    req.data = decoded;
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
  const { refreshToken } = data!;
  const type = res.locals.type;
  try {
    let refreshPrivateKey = process.env.REFRESH_JWT_PRIVATE_KEY as string;
    switch (type) {
      case JWT_TYPES.CUSTOMER:
        refreshPrivateKey = process.env
          .CUSTOMER_REFRESH_JWT_PRIVATE_KEY as string;
        break;
      case JWT_TYPES.ADMIN:
        refreshPrivateKey = process.env.REFRESH_JWT_PRIVATE_KEY as string;
      default:
        break;
    }
    if (!refreshToken) res.status(400).send({ message: "Invalid request" });
    const decoded = verify(refreshToken, refreshPrivateKey) as JwtPayload;
    const username = decoded.data as string;
    if (!decoded) res.status(403).send({ message: "Unauthorized" });
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      generateTokens(username, type);
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
