import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';

export const generateUsername = (name: string, applicationNo: string): string => {
    const firstName = name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const last4 = applicationNo.slice(-4);
    return `${firstName}.${last4}`;
};

export const generateTemporaryPassword = (phone: string): string => {
    const last4 = phone.slice(-4);
    return `DEV@${last4}`;
};

export const createStudentAccount = async (formData: any) => {
    console.log('[STUDENT_SERVICE] Received Form Data:', formData);
    const { 
        name, 
        phone, 
        dob, 
        place, 
        district, 
        address, 
        whatsapp, 
        hifzCenter, 
        hifzInstitution,
        dawrasCount, 
        schoolEducation, 
        kitabsStudied, 
        firstOption, 
        secondOption, 
        thirdOption, 
        parentName,
        motherName,
        documents
    } = formData;

    try {
        // Check if user already exists
        const email = formData.email || `${name.split(' ')[0].toLowerCase()}.${phone.slice(-4)}@tharqiya.edu`;
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new Error('An account with this email/phone already exists. If you have already applied, please login to your portal.');
        }

        // 1. Generate Application Number: TQ-2026-XXXX
        const count = await prisma.student.count();
        const applicationNo = `TQ-2026-${(count + 1).toString().padStart(4, '0')}`;
        console.log('[STUDENT_SERVICE] Generated Application No:', applicationNo);

        // 2. Generate Credentials
        const username = generateUsername(name, applicationNo);
        const tempPassword = generateTemporaryPassword(phone);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        console.log('[STUDENT_SERVICE] Generated Username:', username);

        // 3. Create User and Student (Transaction)
        return await prisma.$transaction(async (tx) => {
            console.log('[STUDENT_SERVICE] Starting Transaction...');
            
            const user = await tx.user.create({
                data: {
                    email, 
                    username,
                    password: hashedPassword,
                    role: 'STUDENT',
                    name,
                    phone,
                    isFirstLogin: true,
                }
            });
            console.log('[STUDENT_SERVICE] User Created:', user.id);

            const student = await tx.student.create({
                data: {
                    userId: user.id,
                    applicationNo,
                    dob: dob ? new Date(dob) : new Date(),
                    place: place || 'N/A',
                    district: district || 'N/A',
                    address: address || 'N/A',
                    whatsapp: whatsapp || phone,
                    hifzCenter: hifzCenter || hifzInstitution || 'N/A',
                    dawrasCount: dawrasCount?.toString() || '0',
                    schoolEducation: schoolEducation || 'N/A',
                    kitabsStudied: kitabsStudied || '',
                    firstOption: firstOption || 'N/A',
                    secondOption: secondOption || 'N/A',
                    thirdOption: thirdOption || 'N/A',
                    fatherName: parentName || 'N/A',
                    motherName: motherName || 'N/A',
                    status: 'PENDING',
                    documents: documents || {},
                }
            });
            console.log('[STUDENT_SERVICE] Student Profile Created:', student.id);

            await tx.application.create({
                data: {
                    studentId: student.id,
                    status: 'PENDING',
                }
            });
            console.log('[STUDENT_SERVICE] Application Record Created');

            return { user, student, tempPassword };
        });
    } catch (error: any) {
        console.error('[STUDENT_SERVICE] Error in createStudentAccount:', error);
        throw error;
    }
};
