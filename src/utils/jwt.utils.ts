import jwt from "jsonwebtoken";

// sign jwt
export const signJWT = (payload: object, expiresIn: string | number) => {
  return jwt.sign(payload, process.env.PRIVATE_KEY as string, {
    algorithm: "RS256",
    expiresIn,
  });
};

// verify jwt
export const verifyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.PUBLIC_KEY as string);
    return {
      payload: decoded,
      expired: false,
    };
  } catch (error: any) {
    return {
      payload: null,
      expired: error.message.includes("jwt expired"),
    };
  }
};
