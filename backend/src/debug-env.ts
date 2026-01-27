import 'dotenv/config';
console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'undefined');
console.log('PORT:', process.env.PORT);
