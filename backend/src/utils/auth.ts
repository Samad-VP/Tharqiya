import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const generateToken = (id: string): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (enteredPassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};
