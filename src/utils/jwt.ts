//crea tokens y verifica
//para el password y el hash usar libreria bcrypt y el types npm install --save-dev @types/bcrypt
//alias para uq eno exista conflicto con laue vamos apersonalziar
//sign-> create new token
//jwtVerify-> verify and decodes tokens
//jwtpayload->ts type for jwt payload

//import para cryptto function  creates secret keys for signing tokens
import { createSecretKey } from "node:crypto";
import { type JWTPayload as JoseJWTPayload, jwtVerify, SignJWT } from "jose";
import env from "../../env";

//interface personalizada jwt payload
export interface CustomJWTPayload extends JoseJWTPayload {
	id: string;
	email: string;
	role: string;
}

//generacion del token nuevo token para autentifricar usuario . se llama despues del logim o registro
//1.takes user data (id, email, and username), gets secret key from nv config , creates jwt with userdata in payload,
//an algorithm for singing, a timestamp, an expiration time. Then it employs the token with secret key and returns the compelte token string when signging

export const generateToken = async (payload: CustomJWTPayload) => {
	const secret = env.JWT_SECRET;
	//utf-8 :
	const secretKey = createSecretKey(secret, "utf-8");
	const token = await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(env.JWT_EXPIRES_IN)
		.sign(secretKey);
	//return token
	return token;
};

//token verification function
//verifies and decodes a jwt token used in auth to validate requests
//promise:
export const verifyToken = async (token: string): Promise<CustomJWTPayload> => {
	const secret = env.JWT_SECRET;
	const secretKey = createSecretKey(secret, "utf-8");
	const { payload } = await jwtVerify(token, secretKey);

	//if this matches customjwtpayload structure
	return payload as CustomJWTPayload;
};
