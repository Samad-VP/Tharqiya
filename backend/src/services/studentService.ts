import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import { triggerNotification } from './notificationService.js';

export const generateUsername = (name: string, applicationNo: string): string => {
    const firstName = name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const last4 = applicationNo.slice(-4);
    return `${firstName}.${last4}`;
};

export const generateTemporaryPassword = (phone: string): string => {
    const last4 = phone.slice(-4);
    return `DEV@${last4}`;
};

/**
 * Creates a pending student application without a User account.
 * Credentials will be generated only after admin approval.
 */
export const createPendingApplication = async (formData: any) => {
    console.log('[STUDENT_SERVICE] Creating Pending Application:', formData);
    const { 
        name, phone, dob, place, district, address, 
        whatsapp, hifzCenter, hifzInstitution,
        dawrasCount, schoolEducation, kitabsStudied, 
        firstOption, secondOption, thirdOption, 
        parentName, motherName, documents, email, primeHifzMentor,
        pincode, state, country
    } = formData;

    try {
        // 1. Generate Application Number
        const count = await prisma.student.count();
        const applicationNo = `TQ-2026-${(count + 1).toString().padStart(4, '0')}`;

        // 2. Generate Credentials
        const username = generateUsername(name, applicationNo);
        const tempPassword = generateTemporaryPassword(whatsapp || phone || '');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const loginUrl = `${process.env.FRONTEND_URL || 'https://darussalameduvillage.com'}/login`;

        // 3. Create User, Student and Application (Transaction)
        const photoUrl = documents?.photo || '';
        const photoId = documents?.photoPublicId || '';

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: email || `${username}@tharqiya.edu`,
                    username,
                    password: hashedPassword,
                    role: 'STUDENT',
                    name,
                    phone: whatsapp || phone,
                    whatsapp: whatsapp || phone,
                    isFirstLogin: false,
                    profileImageUrl: photoUrl,
                    profileImagePublicId: photoId
                }
            });

            const student = await tx.student.create({
                data: {
                    userId: user.id,
                    applicationNo,
                    name,
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
                    primeHifzMentor: primeHifzMentor || 'N/A',
                    pincode: pincode || 'N/A',
                    state: state || 'N/A',
                    country: country || 'India',
                    status: 'PENDING',
                    documents: documents || {},
                    resources: { email: email || null } as any
                }
            });

            const application = await tx.application.create({
                data: {
                    studentId: student.id,
                    status: 'PENDING',
                }
            });

            return { user, student, application };
        });

        // 4. Trigger Unified Welcome Notification
        // This template now includes both confirmation and credentials
        await triggerNotification(result.user.id, 'APPLICATION_RECEIVED', {
            StudentName: name,
            ApplicationID: applicationNo,
            Username: username,
            TempPassword: tempPassword,
            LoginUrl: loginUrl
        });

        return result;
    } catch (error: any) {
        console.error('[STUDENT_SERVICE] Error in createPendingApplication:', error);
        throw error;
    }
};

/**
 * Promotes a pending application to a full Student account.
 * Generates credentials and sends notifications.
 */
export const promoteToStudentAccount = async (studentId: string) => {
    console.log('[STUDENT_SERVICE] Promoting Student to Account:', studentId);

    const student = await prisma.student.findUnique({
        where: { id: studentId },
    });

    if (!student) throw new Error('Student application not found');
    if (student.userId) return student; // Already promoted

    // Extract email from resources or generate one
    const resources = student.resources as any;
    const email = resources?.email || `${student.name.split(' ')[0].toLowerCase()}.${student.applicationNo.slice(-4)}@tharqiya.edu`;

    // 1. Generate Credentials
    const username = generateUsername(student.name, student.applicationNo);
    const tempPassword = generateTemporaryPassword(student.whatsapp || '');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 2. Create User and Link to Student (Transaction)
    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                role: 'STUDENT',
                name: student.name,
                phone: student.whatsapp,
                whatsapp: student.whatsapp,
                isFirstLogin: false,
            }
        });

        const updatedStudent = await tx.student.update({
            where: { id: student.id },
            data: { userId: user.id }
        });

        // 3. Send Credentials Notification
        const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
        
        await triggerNotification(user.id, 'APPLICATION_CREDENTIALS_CREATED', {
            StudentName: student.name,
            Username: username,
            TempPassword: tempPassword,
            LoginUrl: loginUrl
        });

        return { user, student: updatedStudent, tempPassword };
    });
};
