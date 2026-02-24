import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import { triggerNotification } from './notificationService.js';
import { executeWithRetry, generateNextApplicationNo } from '../utils/applicationUtils.js';

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
        fatherName, motherName, documents, email, primeHifzMentor,
        pincode, state, country, madrasaEducation
    } = formData;

    return await executeWithRetry(async (tx) => {
        // 1. Generate Application Number
        const applicationNo = await generateNextApplicationNo(tx);

        // 2. Generate Credentials
        const username = generateUsername(name, applicationNo);
        const tempPassword = generateTemporaryPassword(whatsapp || phone || '');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const loginUrl = `${process.env.FRONTEND_URL || 'https://darussalameduvillage.com'}/login`;

        // 3. Create User, Student and Application
        const photoUrl = documents?.photo || '';
        const photoId = documents?.photoPublicId || '';

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
                fatherName: fatherName || 'N/A',
                motherName: motherName || 'N/A',
                primeHifzMentor: primeHifzMentor || 'N/A',
                madrasaEducation: madrasaEducation || 'N/A',
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

        // 4. Trigger Unified Welcome Notification
        // Note: We trigger this outside the transaction if we want to be safe, 
        // but here executeWithRetry handles the transaction.
        // We can keep it inside if it's async and doesn't block the transaction too much, 
        // or just after return.
        
        // Actually, triggerNotification is called with background: true at the end of the original function.
        // Let's keep the core logic inside the transaction and return result.

        return { user, student, application, username, tempPassword, loginUrl, applicationNo };
    }).then(result => {
        // Trigger notification after transaction success
        triggerNotification(result.user.id, 'APPLICATION_RECEIVED', {
            StudentName: name,
            ApplicationID: result.applicationNo,
            Username: result.username,
            TempPassword: result.tempPassword,
            LoginUrl: result.loginUrl
        }, true);

        return result;
    });
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
        // Use background: true to prevent blocking the UI
        const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
        
        triggerNotification(user.id, 'APPLICATION_CREDENTIALS_CREATED', {
            StudentName: student.name,
            Username: username,
            TempPassword: tempPassword,
            LoginUrl: loginUrl
        }, true);

        return { user, student: updatedStudent, tempPassword };
    });
};
