import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;

export const generateToken = (userId) => {
    return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
    const decoded = jwt.verify(token, secretKey);
    return decoded.userId; // or return whole decoded object if you want
};
