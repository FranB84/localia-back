//bcryp for secure password
import bcrypt from "bcrypt";
//env config  BCRYPT ROUNDS settings
import env from "../../env";

export const hashPassword = async (password: string) => {
	//parametros son el passwrod que entra aca y lacatidad e veces que pasa esto por parametros
	return bcrypt.hash(password, env.BCRYPT_ROUNDS);
};

//compare hash: compare if a plain text password matches a stored hash during loging to check if user entered correct passwrod

export const comparePasswords = async (
	password: string,
	hashedPassword: string,
) => {
	return bcrypt.compare(password, hashedPassword);
};
