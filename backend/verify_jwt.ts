import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET;

console.log('JWT_SECRET exists:', !!secret);
if (secret) {
    console.log('JWT_SECRET length:', secret.length);
    try {
        const token = jwt.sign({ test: 'payload' }, secret, { expiresIn: '1h' });
        console.log('Token generated successfully');
        const decoded = jwt.verify(token, secret);
        console.log('Token verified successfully:', decoded);
    } catch (err) {
        console.error('JWT Operation failed:', err.message);
    }
} else {
    console.error('JWT_SECRET is missing from environment variables');
}
