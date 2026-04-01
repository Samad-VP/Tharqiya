import { PDFDocument, rgb, StandardFonts, PDFFont, PageSizes } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Brand Colors
const COLORS = {
    TEAL: rgb(95/255, 178/255, 192/255),
    CORAL: rgb(238/255, 109/255, 82/255),
    CREAM: rgb(253/255, 245/255, 230/255),
    DEEP: rgb(74/255, 74/255, 74/255),
    TEXT: rgb(30/255, 41/255, 59/255),
    SLATE: rgb(100/255, 116/255, 139/255),
    WHITE: rgb(1, 1, 1),
    GOLD: rgb(184/255, 134/255, 11/255),
};

// HELPER: Sanitize text for Standard Fonts (Helvetica/WinAnsi)
// Standard fonts in pdf-lib throw errors on characters they can't encode.
const sanitizeText = (text: string | null | undefined): string => {
    if (!text) return '';
    // Replace non-WinAnsi/extended characters with fallback.
    // This is a basic filter to keep it safe for Helvetica.
    return text.toString().replace(/[^\x20-\x7E\xA0-\xFF]/g, '?');
};

const safeMeasure = (font: any, text: string, size: number) => {
    try {
        return font.widthOfTextAtSize(sanitizeText(text), size);
    } catch (e) {
        return font.widthOfTextAtSize('?', size) * text.length;
    }
};

const embedImage = async (pdfDoc: PDFDocument, filename: string) => {
    try {
        // Check multiple possible paths for production and development
        const possiblePaths = [
            path.join(__dirname, `../assets/${filename}`), // Case when running from dist/services/pdfService.js
            path.join(__dirname, `../../src/assets/${filename}`), // Case when running from src/services/pdfService.ts with tsx
            path.join(process.cwd(), `assets/${filename}`),
            path.join(process.cwd(), `dist/assets/${filename}`),
            path.join(process.cwd(), `backend/assets/${filename}`),
            path.join(process.cwd(), `backend/dist/assets/${filename}`)
        ];

        for (const imagePath of possiblePaths) {
            if (fs.existsSync(imagePath)) {
                const imageBytes = fs.readFileSync(imagePath);
                return await pdfDoc.embedPng(imageBytes);
            }
        }
        console.warn(`[PDF_SERVICE] Image not found in any of these paths: ${filename}`);
    } catch (error) {
        console.error(`Error embedding image ${filename}:`, error);
    }
    return null;
};

const fetchAndEmbedPhoto = async (pdfDoc: PDFDocument, url?: string) => {
    if (!url) return null;
    try {
        let fetchUrl = url;
        
        // TRANSFORM CLOUDINARY URLS TO JPG
        // pdf-lib does not support WEBP. Cloudinary can convert on the fly.
        if (url.includes('res.cloudinary.com')) {
            // Replace the extension with .jpg or add /f_jpg to the path
            fetchUrl = url.replace(/\.[a-z0-9]+$/i, '.jpg');
        }

        const response = await axios.get(fetchUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);

        // MAGIC NUMBER DETECTION
        // PNG: 89 50 4E 47
        // JPEG: FF D8 FF
        const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
        const isJpg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;

        if (isPng) {
            return await pdfDoc.embedPng(buffer);
        } else if (isJpg) {
            return await pdfDoc.embedJpg(buffer);
        } else {
            console.warn(`[PDF_SERVICE] Unsupported image format from URL: ${url}. Content-Type: ${response.headers['content-type']}`);
            // Last resort: try PNG if URL says so, otherwise try JPG
            if (url.toLowerCase().endsWith('.png')) return await pdfDoc.embedPng(buffer);
            return await pdfDoc.embedJpg(buffer);
        }
    } catch (error) {
        console.error('[PDF_SERVICE] Error fetching/embedding student photo:', error);
    }
    return null;
};

export const generateApplicationPDF = async (studentData: any) => {
    if (!studentData) throw new Error("No student data provided for PDF generation");
    
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const primaryLogo = await embedImage(pdfDoc, 'edu_village_logo.png');
    const studentPhoto = await fetchAndEmbedPhoto(pdfDoc, studentData.user?.profileImageUrl || studentData.documents?.photo);

    // Page Border
    page.drawRectangle({
        x: 20,
        y: 20,
        width: width - 40,
        height: height - 40,
        borderColor: COLORS.TEAL,
        borderWidth: 1.5,
    });

    // Header Area
    const headerHeight = 160;
    const headerY = height - headerHeight - 30; // 30pt padding from top
    page.drawRectangle({
        x: 20,
        y: headerY,
        width: width - 40,
        height: headerHeight,
        color: COLORS.WHITE,
    });

    // Student Photo (Right Aligned) - Standard Passport Size (approx 3.5x4.5cm)
    const photoWidth = 100;
    const photoHeight = 125;
    const photoX = width - 40 - photoWidth - 10;
    const photoY = headerY + 15;

    if (studentPhoto) {
        page.drawImage(studentPhoto, {
            x: photoX,
            y: photoY,
            width: photoWidth,
            height: photoHeight,
        });
    } else {
        // Placeholder box for photo
        page.drawRectangle({
            x: photoX,
            y: photoY,
            width: photoWidth,
            height: photoHeight,
            borderColor: COLORS.SLATE,
            borderWidth: 1,
            color: rgb(0.98, 0.98, 0.98),
        });
        page.drawText('PHOTO', { x: photoX + 32, y: photoY + 58, size: 10, font: boldFont, color: COLORS.SLATE });
    }

    // Brand Header - Website Style (Logo Only)
    const logoScale = 0.07; // Made small again
    const logoWidth = primaryLogo ? primaryLogo.scale(logoScale).width : 0;
    const logoHeight = primaryLogo ? primaryLogo.scale(logoScale).height : 0;
    
    // Logo Position (Top Left of Header)
    const logoX = 50;
    const logoY = headerY + headerHeight - logoHeight - 20;

    if (primaryLogo) {
        page.drawImage(primaryLogo, {
            x: logoX,
            y: logoY,
            width: logoWidth,
            height: logoHeight,
        });
    }

    // Define targetCenter for centered text elements
    const targetCenter = width / 2;

    // Restore Centered Main Header
    const centerBrand1 = 'Darussalam';
    const centerBrand2 = ' Edu Village';
    const centerSize = 22;
    
    const cw1 = boldFont.widthOfTextAtSize(centerBrand1, centerSize);
    const cw2 = boldFont.widthOfTextAtSize(centerBrand2, centerSize);
    const totalCenterWidth = cw1 + cw2;
    const centerStartX = targetCenter - totalCenterWidth / 2;
    const centerBrandY = headerY + headerHeight - 45;

    page.drawText(centerBrand1, { x: centerStartX, y: centerBrandY, size: centerSize, font: boldFont, color: COLORS.CORAL });
    page.drawText(centerBrand2, { x: centerStartX + cw1, y: centerBrandY, size: centerSize, font: boldFont, color: COLORS.DEEP });
    
    // University Affiliation (Centered)
    const affilText = 'Under Darussalam Islamic University (DIU)';
    const affilWidth = italicFont.widthOfTextAtSize(affilText, 10);
    page.drawText(affilText, {
        x: targetCenter - affilWidth / 2,
        y: headerY + headerHeight - 65,
        size: 10,
        font: italicFont,
        color: COLORS.TEAL,
    });

    const subtText = 'Center for Advanced Qur\'anic Studies & Academic Excellence';
    const subtWidth = italicFont.widthOfTextAtSize(subtText, 10);
    page.drawText(subtText, {
        x: targetCenter - subtWidth / 2,
        y: headerY + headerHeight - 85,
        size: 10,
        font: italicFont,
        color: COLORS.SLATE,
    });

    // Form Subject
    let yPos = height - 205;
    page.drawText('Application for Tharqiya Course - 2026', {
        x: width / 2 - 140,
        y: yPos,
        size: 14,
        font: boldFont,
        color: COLORS.TEXT,
    });

    // Separator line
    yPos -= 8;
    page.drawLine({
        start: { x: 50, y: yPos },
        end: { x: 545, y: yPos },
        thickness: 1.5,
        color: COLORS.TEAL,
    });

    // App ID Badge
    yPos -= 28;
    page.drawRectangle({
        x: 50,
        y: yPos - 5,
        width: 140,
        height: 20,
        color: COLORS.TEAL,
        opacity: 0.1,
    });
    page.drawText(`APP ID: ${studentData.applicationNo || 'N/A'}`, {
        x: 60,
        y: yPos + 3,
        size: 10,
        font: boldFont,
        color: COLORS.TEAL,
    });

    yPos = height - 260;

    const drawSectionHeader = (title: string) => {
        yPos -= 12; // Increased padding from 5 for better separation
        page.drawRectangle({
            x: 50,
            y: yPos - 5,
            width: width - 100,
            height: 20,
            color: COLORS.CREAM,
            borderColor: COLORS.TEAL,
            borderWidth: 0.5,
        });
        page.drawText(title, {
            x: 60,
            y: yPos,
            size: 11,
            font: boldFont,
            color: COLORS.TEXT,
        });
        yPos -= 28;
    };

    const drawRow = (label: string, value: string, secondLabel?: string, secondValue?: string) => {
        page.drawText(`${label}:`, { x: 60, y: yPos, size: 10, font: boldFont, color: COLORS.SLATE });
        page.drawText(sanitizeText(String(value || 'N/A')), { x: 160, y: yPos, size: 10, font, color: COLORS.TEXT });
        
        if (secondLabel) {
            page.drawText(`${secondLabel}:`, { x: 330, y: yPos, size: 10, font: boldFont, color: COLORS.SLATE });
            page.drawText(sanitizeText(String(secondValue || 'N/A')), { x: 430, y: yPos, size: 10, font, color: COLORS.TEXT });
        }
        
        yPos -= 17; // Slightly tighter spacing to ensure signature area fits
    };

    // Personal Details
    drawSectionHeader('I. Candidate Personal Information');
    drawRow('Full Name', studentData.user?.name || studentData.name || 'Unknown');
    drawRow('Date of Birth', studentData.dob ? new Date(studentData.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A', 'Gender', 'Male');
    drawRow('Place of Birth', studentData.place, 'District', studentData.district);
    drawRow('Father/Guardian', studentData.fatherName);
    
    yPos -= 5;
    drawSectionHeader('II. Contact & Residence Particulars');
    drawRow('Primary Phone', studentData.user?.phone || studentData.phone, 'WhatsApp', studentData.whatsapp);
    drawRow('Email Address', studentData.user?.email || studentData.email || 'N/A');
    drawRow('Postal Address', studentData.address);

    yPos -= 5;
    drawSectionHeader('III. Academic & Hifz Background');
    drawRow('Hifz Institution', studentData.hifzCenter);
    drawRow('Dawras Completed', String(studentData.dawrasCount || '0'), 'General Educ.', studentData.schoolEducation);
    drawRow('Madrasa Educ.', studentData.madrasaEducation || 'N/A', 'Prime Hifz Mentor', studentData.primeHifzMentor || 'N/A');

    yPos -= 5;
    drawSectionHeader('IV. Institutional Preferences');
    drawRow('First Option', studentData.firstOption);
    drawRow('Second Option', studentData.secondOption);
    drawRow('Third Option', studentData.thirdOption);

    // Certification
    yPos -= 15;
    page.drawText('DECLARATION & UNDERTAKING', { x: 50, y: yPos, size: 11, font: boldFont, color: COLORS.DEEP });
    yPos -= 15;
    const undertakingText = 'I, the undersigned, hereby declare that the information provided in this application is true and complete to the best of my knowledge. I understand that any misrepresentation may lead to my disqualification or expulsion from the course.';
    page.drawText(undertakingText, {
        x: 50,
        y: yPos,
        size: 9,
        font: italicFont,
        color: COLORS.SLATE,
        maxWidth: 500,
        lineHeight: 11,
    });

    // Signatures - Elevated position to guarantee visibility
    yPos -= 50;
    page.drawLine({ start: { x: 50, y: yPos }, end: { x: 180, y: yPos }, thickness: 1, color: COLORS.SLATE });
    page.drawText("Applicant's Signature", { x: 55, y: yPos - 12, size: 8, font, color: COLORS.SLATE });

    page.drawLine({ start: { x: 420, y: yPos }, end: { x: 550, y: yPos }, thickness: 1, color: COLORS.SLATE });
    page.drawText("Guardian's Signature", { x: 425, y: yPos - 12, size: 8, font, color: COLORS.SLATE });

    // Footer
    page.drawRectangle({
        x: 20,
        y: 20,
        width: width - 40,
        height: 50,
        color: COLORS.WHITE,
        borderColor: COLORS.TEAL,
        borderWidth: 0.5,
    });

    const footerText1 = 'Darussalam Edu Village © 2026 | Tharqiya Admission System';
    const footerText2 = 'For more info, visit: www.darussalameduvillage.com';
    const footerText3 = 'This is a digitally generated official application record.';
    
    const f1w = boldFont.widthOfTextAtSize(footerText1, 9);
    const f2w = font.widthOfTextAtSize(footerText2, 9);
    const f3w = font.widthOfTextAtSize(footerText3, 8);

    page.drawText(footerText1, {
        x: width / 2 - f1w / 2,
        y: 50,
        size: 9,
        font: boldFont,
        color: COLORS.TEAL,
    });
    
    page.drawText(footerText2, {
        x: width / 2 - f2w / 2,
        y: 40,
        size: 9,
        font,
        color: COLORS.DEEP,
    });

    page.drawText(footerText3, {
        x: width / 2 - f3w / 2,
        y: 30,
        size: 8,
        font,
        color: COLORS.SLATE,
    });

    return await pdfDoc.save();
};

export const generateResultPDF = async (studentData: any, resultData: any, evaluations: any[] = []) => {
    if (!studentData || !resultData) throw new Error("Incomplete data for result PDF generation");
    
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const primaryLogo = await embedImage(pdfDoc, 'edu_village_logo.png');
    const studentPhoto = await fetchAndEmbedPhoto(pdfDoc, studentData.user?.profileImageUrl || studentData.documents?.photo);

    // Page Border
    page.drawRectangle({
        x: 20,
        y: 20,
        width: width - 40,
        height: height - 40,
        borderColor: COLORS.TEAL,
        borderWidth: 1.5,
    });

    // Header Area
    const headerHeight = 160;
    const headerY = height - headerHeight - 30; // 30pt padding from top
    page.drawRectangle({
        x: 20,
        y: headerY,
        width: width - 40,
        height: headerHeight,
        color: COLORS.WHITE,
    });

    // Student Photo (Right Aligned) - Standard Passport Size (approx 3.5x4.5cm)
    const photoWidth = 100;
    const photoHeight = 125;
    const photoX = width - 40 - photoWidth - 10;
    const photoY = headerY + 15;

    if (studentPhoto) {
        page.drawImage(studentPhoto, {
            x: photoX,
            y: photoY,
            width: photoWidth,
            height: photoHeight,
        });
    } else {
        // Placeholder box for photo
        page.drawRectangle({
            x: photoX,
            y: photoY,
            width: photoWidth,
            height: photoHeight,
            borderColor: COLORS.SLATE,
            borderWidth: 1,
            color: rgb(0.98, 0.98, 0.98),
        });
        page.drawText('PHOTO', { x: photoX + 32, y: photoY + 58, size: 10, font: boldFont, color: COLORS.SLATE });
    }

    // Brand Header - Website Style (Logo Only)
    const logoScale = 0.07; // Made small again
    const logoWidth = primaryLogo ? primaryLogo.scale(logoScale).width : 0;
    const logoHeight = primaryLogo ? primaryLogo.scale(logoScale).height : 0;
    
    // Logo Position (Top Left of Header)
    const logoX = 50;
    const logoY = headerY + headerHeight - logoHeight - 20;

    if (primaryLogo) {
        page.drawImage(primaryLogo, {
            x: logoX,
            y: logoY,
            width: logoWidth,
            height: logoHeight,
        });
    }
    
    // Define targetCenter for centered text elements
    const targetCenter = width / 2;

    // Restore Centered Main Header
    const centerBrand1 = 'Darussalam';
    const centerBrand2 = ' Edu Village';
    const centerSize = 22;
    
    const cw1 = boldFont.widthOfTextAtSize(centerBrand1, centerSize);
    const cw2 = boldFont.widthOfTextAtSize(centerBrand2, centerSize);
    const totalCenterWidth = cw1 + cw2;
    const centerStartX = targetCenter - totalCenterWidth / 2;
    const centerBrandY = headerY + headerHeight - 45;

    page.drawText(centerBrand1, { x: centerStartX, y: centerBrandY, size: centerSize, font: boldFont, color: COLORS.CORAL });
    page.drawText(centerBrand2, { x: centerStartX + cw1, y: centerBrandY, size: centerSize, font: boldFont, color: COLORS.DEEP });

    // University Affiliation (Centered)
    const affilText = 'Under Darussalam Islamic University (DIU)';
    const affilWidth = italicFont.widthOfTextAtSize(affilText, 10);
    page.drawText(affilText, {
        x: targetCenter - affilWidth / 2,
        y: headerY + headerHeight - 65,
        size: 10,
        font: italicFont,
        color: COLORS.TEAL,
    });

    const subtText = 'Center for Advanced Qur\'anic Studies & Academic Excellence';
    const subtWidth = italicFont.widthOfTextAtSize(subtText, 10);
    page.drawText(subtText, {
        x: targetCenter - subtWidth / 2,
        y: headerY + headerHeight - 85,
        size: 10,
        font: italicFont,
        color: COLORS.SLATE,
    });

    // Form Subject
    let yPos = height - 205;
    const subjectTitle = 'OFFICIAL SELECTION ENTRY - 2026';
    const subjectWidth = boldFont.widthOfTextAtSize(subjectTitle, 14);
    
    page.drawText(subjectTitle, {
        x: width / 2 - subjectWidth / 2,
        y: yPos,
        size: 14,
        font: boldFont,
        color: COLORS.TEXT,
    });

    // Separator line
    yPos -= 8;
    page.drawLine({
        start: { x: 50, y: yPos },
        end: { x: 545, y: yPos },
        thickness: 1.5,
        color: COLORS.TEAL,
    });

    // App ID + Status Badge (Aligned)
    yPos -= 35;
    
    // Left Box: Candidate Name
    page.drawRectangle({ x: 50, y: yPos, width: 200, height: 25, color: COLORS.CREAM, borderColor: COLORS.TEAL, borderWidth: 0.5 });
    page.drawText('CANDIDATE: ' + (studentData.user?.name || studentData.name || 'Unknown').toUpperCase(), { x: 60, y: yPos + 8, size: 10, font: boldFont, color: COLORS.DEEP });
    
    // Right Box: Application ID
    page.drawRectangle({ x: width - 200, y: yPos, width: 150, height: 25, color: COLORS.CREAM, borderColor: COLORS.TEAL, borderWidth: 0.5 });
    page.drawText('APP ID: ' + (studentData.applicationNo || 'N/A'), { x: width - 190, y: yPos + 8, size: 10, font: boldFont, color: COLORS.DEEP });

    yPos -= 40;

    // Evaluation Matrix Header
    page.drawText('EVALUATION MATRIX', { x: 50, y: yPos, size: 12, font: boldFont, color: COLORS.DEEP });
    yPos -= 25;

    // Table Header
    page.drawRectangle({ x: 50, y: yPos - 8, width: width - 100, height: 25, color: COLORS.TEAL });
    page.drawText('SUBJECT / CATEGORY', { x: 65, y: yPos, size: 9, font: boldFont, color: COLORS.WHITE });
    page.drawText('MARKS', { x: 300, y: yPos, size: 9, font: boldFont, color: COLORS.WHITE });
    page.drawText('REMARKS / OBSERVATIONS', { x: 380, y: yPos, size: 9, font: boldFont, color: COLORS.WHITE });
    
    yPos -= 35;

    evaluations.forEach((evaluation: any, idx: number) => {
        if (idx % 2 === 0) {
            page.drawRectangle({ x: 50, y: yPos - 8, width: width - 100, height: 25, color: rgb(0.98, 0.98, 0.98) });
        }
        page.drawText(sanitizeText(evaluation.subject || 'General'), { x: 65, y: yPos, size: 10, font: boldFont, color: COLORS.TEXT });
        page.drawText(sanitizeText(`${evaluation.marks ?? '—'}`), { x: 300, y: yPos, size: 11, font: boldFont, color: COLORS.TEXT });
        
        // Truncate Remarks if too long
        let remarks = sanitizeText(evaluation.remarks || '-');
        if (remarks.length > 35) remarks = remarks.substring(0, 32) + '...';
        
        page.drawText(remarks, { x: 380, y: yPos, size: 9, font, color: COLORS.SLATE });
        yPos -= 25;
    });

    yPos -= 20;
    
    // Performance Summary (Right Aligned Box)
    const summaryBoxY = yPos - 60;
    page.drawRectangle({ x: width - 250, y: summaryBoxY, width: 200, height: 60, color: COLORS.CREAM, borderColor: COLORS.SLATE, borderWidth: 0.5 });
    
    page.drawText('PERFORMANCE SUMMARY', { x: width - 235, y: yPos - 15, size: 9, font: boldFont, color: COLORS.TEAL });
    page.drawText(`TOTAL MARKS: ${resultData.totalMarks || '0'}`, { x: width - 235, y: yPos - 35, size: 10, font: boldFont, color: COLORS.DEEP });
    page.drawText(`PERCENTAGE: ${resultData.averageMarks || '0'}%`, { x: width - 235, y: yPos - 50, size: 10, font: boldFont, color: COLORS.DEEP });

    // Final Decision Badge
    const isAccepted = resultData.decision === 'ACCEPTED';
    const isRejected = resultData.decision === 'REJECTED';
    const badgeColor = isAccepted ? COLORS.TEAL : isRejected ? COLORS.CORAL : rgb(0.8, 0.6, 0);

    yPos -= 100;

    page.drawRectangle({ x: 50, y: yPos - 40, width: 250, height: 50, color: badgeColor, opacity: 0.1 });
    page.drawRectangle({ x: 50, y: yPos - 40, width: 5, height: 50, color: badgeColor }); // Left accent bar
    
    page.drawText('FINAL ADMISSION DECISION:', { x: 65, y: yPos - 10, size: 9, font: boldFont, color: COLORS.SLATE });
    page.drawText(resultData.decision || 'PENDING', { x: 65, y: yPos - 30, size: 18, font: boldFont, color: badgeColor });

    // Principal's Note
    yPos -= 80;
    page.drawText('OFFICE OF THE PRINCIPAL - ADMINISTRATIVE NOTE', { x: 50, y: yPos, size: 10, font: boldFont, color: COLORS.TEAL });
    yPos -= 20;
    const note = isAccepted 
        ? "Congratulations on your selection. You have demonstrated the required proficiency and character for the Tharqiya program. Please complete your enrollment in the candidate portal."
        : isRejected
        ? "We regret to inform you that we are unable to offer you admission at this stage. We encourage you to continue your studies with dedication and wish you success ahead."
        : "Your evaluation is currently under further administrative review. Check the portal for the final update.";
    
    page.drawText(note, { x: 50, y: yPos, size: 10, font, color: COLORS.TEXT, maxWidth: 500, lineHeight: 14 });

    // Footer (Identical to Application PDF)
    page.drawRectangle({
        x: 20,
        y: 20,
        width: width - 40,
        height: 50,
        color: COLORS.WHITE,
        borderColor: COLORS.TEAL,
        borderWidth: 0.5,
    });

    const footerText1 = 'Darussalam Edu Village © 2026 | Tharqiya Admission System';
    const footerText2 = 'For more info, visit: www.darussalameduvillage.com';
    const footerText3 = 'This is a digitally generated official selection record.';
    
    const f1w = boldFont.widthOfTextAtSize(footerText1, 9);
    const f2w = font.widthOfTextAtSize(footerText2, 9);
    const f3w = font.widthOfTextAtSize(footerText3, 8);

    page.drawText(footerText1, {
        x: width / 2 - f1w / 2,
        y: 50,
        size: 9,
        font: boldFont,
        color: COLORS.TEAL,
    });
    
    page.drawText(footerText2, {
        x: width / 2 - f2w / 2,
        y: 40,
        size: 9,
        font,
        color: COLORS.DEEP,
    });

    page.drawText(footerText3, {
        x: width / 2 - f3w / 2,
        y: 30,
        size: 8,
        font,
        color: COLORS.SLATE,
    });

    return await pdfDoc.save();
};

export const generateAllotmentPDF = async (studentData: any, allotmentData: any) => {
    if (!studentData || !allotmentData) throw new Error("Incomplete data for allotment PDF generation");

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const primaryLogo = await embedImage(pdfDoc, 'edu_village_logo.png');
    const studentPhoto = await fetchAndEmbedPhoto(pdfDoc, studentData.user?.profileImageUrl || studentData.documents?.photo);

    // Page Border
    page.drawRectangle({
        x: 20,
        y: 20,
        width: width - 40,
        height: height - 40,
        borderColor: COLORS.TEAL,
        borderWidth: 1.5,
    });

    // Header Area (Reuse exact same layout as Application PDF)
    const headerHeight = 160;
    const headerY = height - headerHeight - 30;
    page.drawRectangle({ x: 20, y: headerY, width: width - 40, height: headerHeight, color: COLORS.WHITE });

    // Student Photo (Right Aligned)
    const photoWidth = 100;
    const photoHeight = 125;
    const photoX = width - 40 - photoWidth - 10;
    const photoY = headerY + 15;

    if (studentPhoto) {
        page.drawImage(studentPhoto, { x: photoX, y: photoY, width: photoWidth, height: photoHeight });
    } else {
        page.drawRectangle({ x: photoX, y: photoY, width: photoWidth, height: photoHeight, borderColor: COLORS.SLATE, borderWidth: 1, color: rgb(0.98, 0.98, 0.98) });
        page.drawText('PHOTO', { x: photoX + 32, y: photoY + 58, size: 10, font: boldFont, color: COLORS.SLATE });
    }

    // Brand Header - Website Style (Logo Only)
    const logoScale = 0.07; // Made small again
    const logoWidth = primaryLogo ? primaryLogo.scale(logoScale).width : 0;
    const logoHeight = primaryLogo ? primaryLogo.scale(logoScale).height : 0;
    
    // Logo Position (Top Left of Header)
    const logoX = 50;
    const logoY = headerY + headerHeight - logoHeight - 20;

    if (primaryLogo) {
        page.drawImage(primaryLogo, {
            x: logoX,
            y: logoY,
            width: logoWidth,
            height: logoHeight,
        });
    }
    
    // Define targetCenter for centered text elements
    const targetCenter = width / 2;

    // Restore Centered Main Header
    const centerBrand1 = 'Darussalam';
    const centerBrand2 = ' Edu Village';
    const centerSize = 22;
    
    const cw1 = boldFont.widthOfTextAtSize(centerBrand1, centerSize);
    const cw2 = boldFont.widthOfTextAtSize(centerBrand2, centerSize);
    const totalCenterWidth = cw1 + cw2;
    const centerStartX = targetCenter - totalCenterWidth / 2;
    const centerBrandY = headerY + headerHeight - 45;

    page.drawText(centerBrand1, { x: centerStartX, y: centerBrandY, size: centerSize, font: boldFont, color: COLORS.CORAL });
    page.drawText(centerBrand2, { x: centerStartX + cw1, y: centerBrandY, size: centerSize, font: boldFont, color: COLORS.DEEP });

    const affilText = 'Under Darussalam Islamic University (DIU)';
    page.drawText(affilText, { x: targetCenter - italicFont.widthOfTextAtSize(affilText, 10) / 2, y: headerY + headerHeight - 65, size: 10, font: italicFont, color: COLORS.TEAL });

    const titleText = 'OFFICIAL ALLOTMENT LETTER - 2026';
    page.drawText(titleText, { x: targetCenter - boldFont.widthOfTextAtSize(titleText, 12) / 2, y: headerY + headerHeight - 85, size: 12, font: boldFont, color: COLORS.DEEP });

    let yPos = height - 210;
    page.drawLine({ start: { x: 50, y: yPos }, end: { x: 545, y: yPos }, thickness: 1.5, color: COLORS.TEAL });

    // Allotment Details Table
    yPos -= 40;
    const rowHeight = 30;
    const col1Width = 150;
    const col2Width = 300;
    const tableX = (width - (col1Width + col2Width)) / 2;

    // Table Header
    page.drawRectangle({ x: tableX, y: yPos, width: col1Width + col2Width, height: 30, color: COLORS.TEAL });
    page.drawText('ALLOTMENT DETAILS', { x: tableX + 10, y: yPos + 8, size: 11, font: boldFont, color: COLORS.WHITE });
    yPos -= rowHeight;

    const details = [
        ['Candidate Name', studentData.user?.name || studentData.name || 'Unknown'],
        ['Application ID', studentData.applicationNo || 'N/A'],
        ['Allotted Campus', allotmentData.campus || 'TBD'],
        ['Assigned Programme', allotmentData.course || 'TBD'],
        ['Academic Session', '2026-2027'],
    ];

    details.forEach(([label, value], i) => {
        // Row Background
        if (i % 2 === 0) {
            page.drawRectangle({ x: tableX, y: yPos, width: col1Width + col2Width, height: rowHeight, color: COLORS.CREAM });
        } else {
             page.drawRectangle({ x: tableX, y: yPos, width: col1Width + col2Width, height: rowHeight, color: COLORS.WHITE });
        }
        
        // Border
        page.drawRectangle({ x: tableX, y: yPos, width: col1Width + col2Width, height: rowHeight, borderColor: COLORS.TEAL, borderWidth: 0.5 });
        
        // Label
        page.drawText(label, { x: tableX + 10, y: yPos + 8, size: 10, font: boldFont, color: COLORS.SLATE });
        
        // Value (Truncate if needed)
        let displayValue = sanitizeText(String(value || 'N/A'));
        if (displayValue.length > 40) displayValue = displayValue.substring(0, 37) + '...';
        
        page.drawText(displayValue, { x: tableX + col1Width + 10, y: yPos + 8, size: 11, font: boldFont, color: COLORS.TEXT });
        
        yPos -= rowHeight;
    });

    yPos -= 50;
    page.drawText('INSTRUCTIONS FOR ENROLLMENT', { x: 50, y: yPos, size: 12, font: boldFont, color: COLORS.TEAL });
    yPos -= 25;
    const instructions = [
        "1. Login to Student Portal and confirm your seat immediately.",
        "2. Download your Result PDF and Application Record.",
        "3. Report to your campus on the date shown in the portal.",
        "4. Bring all original certificates and ID proof.",
        "5. Seat will be cancelled if not confirmed on time."
    ];

    instructions.forEach(text => {
        page.drawText(text, { x: 50, y: yPos, size: 10, font, color: COLORS.TEXT, maxWidth: 500 });
        yPos -= 20;
    });

    yPos -= 40;
    page.drawText('This is a system-generated official letter. Please keep this PDF copy for campus enrollment.', {
        x: 50, y: yPos, size: 9, font: italicFont, color: COLORS.SLATE, maxWidth: 500, lineHeight: 12
    });

    // Signatures
    yPos -= 80;
    page.drawLine({ start: { x: 400, y: yPos }, end: { x: 550, y: yPos }, thickness: 1, color: COLORS.DEEP });
    page.drawText("Registrar / Admission Officer", { x: 410, y: yPos - 15, size: 9, font: boldFont, color: COLORS.DEEP });

    // Footer
    page.drawRectangle({ x: 20, y: 20, width: width - 40, height: 50, color: COLORS.WHITE, borderColor: COLORS.TEAL, borderWidth: 0.5 });
    const footerText1 = `Darussalam Edu Village © 2026 | ID: ${studentData.applicationNo || 'N/A'} | Admission System`;
    const footerText2 = 'For more info, visit: www.darussalameduvillage.com';
    const footerText3 = 'This is a digitally generated official allotment record.';
    
    const f1w = boldFont.widthOfTextAtSize(footerText1, 9);
    const f2w = font.widthOfTextAtSize(footerText2, 9);
    const f3w = font.widthOfTextAtSize(footerText3, 8);

    page.drawText(footerText1, {
        x: width / 2 - f1w / 2,
        y: 50,
        size: 9,
        font: boldFont,
        color: COLORS.TEAL,
    });
    
    page.drawText(footerText2, {
        x: width / 2 - f2w / 2,
        y: 40,
        size: 9,
        font,
        color: COLORS.DEEP,
    });

    page.drawText(footerText3, {
        x: width / 2 - f3w / 2,
        y: 30,
        size: 8,
        font,
        color: COLORS.SLATE,
    });

    return await pdfDoc.save();
};

const truncateText = (text: string, maxWidth: number, font: any, size: number) => {
    if (!text) return '';
    const safeInput = sanitizeText(text);
    let truncated = safeInput;
    let width = safeMeasure(font, truncated, size);
    
    if (width <= maxWidth) return truncated;
    
    while (width > maxWidth - 10 && truncated.length > 0) {
        truncated = truncated.substring(0, truncated.length - 1);
        width = safeMeasure(font, truncated + '...', size);
    }
    return truncated + '...';
};

const calculateColumnWidths = (applications: any[], font: any, boldFont: any, fontSize: number, totalTableWidth: number) => {
    // Fixed columns: # (25), Sub1 (30), Sub2 (30), Sub3 (30), Total (35)
    const fixedWidths = { index: 25, sub1: 30, sub2: 30, sub3: 30, score: 35 };
    let availableWidth = totalTableWidth - fixedWidths.index - fixedWidths.sub1 - fixedWidths.sub2 - fixedWidths.sub3 - fixedWidths.score;

    // Measure max required width for: ID, Name, Status
    let maxIdWidth = 0;
    let maxStatusWidth = 0;
    let maxNameWidth = 0;

    applications.forEach(app => {
        const student = app.student || {};
        const name = sanitizeText(String(student.name || 'Unknown'));
        const appNo = sanitizeText(String(student.applicationNo || 'N/A'));
        const status = sanitizeText(String(app.status || 'PENDING').replace(/_/g, ' '));

        maxIdWidth = Math.max(maxIdWidth, safeMeasure(boldFont, appNo, fontSize));
        maxStatusWidth = Math.max(maxStatusWidth, safeMeasure(font, status, fontSize));
        maxNameWidth = Math.max(maxNameWidth, safeMeasure(boldFont, name.toUpperCase(), fontSize));
    });

    // Add padding
    maxIdWidth += 10;
    maxStatusWidth += 15;
    maxNameWidth += 10;

    // Constraints for high-visibility columns
    const idWidth = Math.min(maxIdWidth, 75);
    const statusWidth = Math.min(maxStatusWidth, 85);
    availableWidth -= (idWidth + statusWidth);

    // Remaining width goes to Name
    const nameWidth = availableWidth;

    return [fixedWidths.index, idWidth, nameWidth, statusWidth, fixedWidths.sub1, fixedWidths.sub2, fixedWidths.sub3, fixedWidths.score];
};

export const generateApplicantsListPDF = async (applications: any[], filterTitle: string) => {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    const primaryLogo = await embedImage(pdfDoc, 'edu_village_logo.png');

    const drawHeaderAndFooter = (page: any, pageNumber: number, totalPages: number) => {
        const { width, height } = page.getSize();
        
        // Border
        page.drawRectangle({
            x: 20,
            y: 20,
            width: width - 40,
            height: height - 40,
            borderColor: COLORS.TEAL,
            borderWidth: 1.5,
        });

        // Logo
        if (primaryLogo) {
            const logoScale = 0.04;
            page.drawImage(primaryLogo, {
                x: 40,
                y: height - 65,
                width: primaryLogo.scale(logoScale).width,
                height: primaryLogo.scale(logoScale).height,
            });
        }

        // Title Group
        const titleX = 100;
        page.drawText('Darussalam Edu Village', {
            x: titleX,
            y: height - 45,
            size: 16,
            font: boldFont,
            color: COLORS.CORAL,
        });
        page.drawText('Tharqiya Admission System - Candidate Roster', {
            x: titleX,
            y: height - 58,
            size: 10,
            font: italicFont,
            color: COLORS.DEEP,
        });

        // Report Info Group (Right Aligned)
        const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const filterText = `Report: ${truncateText(filterTitle, 180, boldFont, 9)}`;
        const dateText = `Generated: ${dateStr}`;
        
        page.drawText(filterText, { x: width - 220, y: height - 45, size: 9, font: boldFont, color: COLORS.TEAL });
        page.drawText(dateText, { x: width - 220, y: height - 58, size: 9, font, color: COLORS.SLATE });

        // Footer
        const footerText = `Page ${pageNumber} of ${totalPages} | © 2026 Darussalam Edu Village | Institutional Confidential`;
        const footerWidth = font.widthOfTextAtSize(footerText, 8);
        page.drawText(footerText, {
            x: width / 2 - footerWidth / 2,
            y: 35,
            size: 8,
            font,
            color: COLORS.SLATE,
        });
    };

    const itemsPerPage = 12;
    const totalPages = Math.ceil(applications.length / itemsPerPage) || 1;

    // Pre-calculate dynamic column widths based on metadata
    const tableWidth = 525; // Standard usable width for A4 with margins
    const colWidths = calculateColumnWidths(applications, font, boldFont, 9, tableWidth);
    const headers = ['#', 'APP ID', 'CANDIDATE NAME', 'STATUS', 'HIFZ', 'ENG', 'GEN', 'TOT'];

    for (let p = 0; p < totalPages; p++) {
        const page = pdfDoc.addPage(PageSizes.A4);
        const { width, height } = page.getSize();
        drawHeaderAndFooter(page, p + 1, totalPages);

        let yPos = height - 110;

        // Table Header Background
        page.drawRectangle({ x: 35, y: yPos - 5, width: width - 70, height: 25, color: COLORS.TEAL });
        
        let xPos = 45;
        headers.forEach((h, i) => {
            page.drawText(h, { x: xPos, y: yPos + 3, size: 8, font: boldFont, color: COLORS.WHITE });
            xPos += colWidths[i];
        });

        yPos -= 35;

        // Rows
        const pageItems = applications.slice(p * itemsPerPage, (p + 1) * itemsPerPage);
        pageItems.forEach((app, idx) => {
            const rowIdx = p * itemsPerPage + idx;
            
            // Alternate Row Shading
            if (rowIdx % 2 === 1) {
                page.drawRectangle({ x: 35, y: yPos - 8, width: width - 70, height: 42, color: COLORS.CREAM, opacity: 0.4 });
            }

            let rxPos = 45;
            const student = app.student || {};
            const evaluations = app.interview?.evaluations || [];
            
            // Strict Subject Mapping
            const getMark = (subjectName: string) => {
                const ev = evaluations.find((e: any) => (e.subject || '').toLowerCase() === subjectName.toLowerCase());
                return ev ? String(ev.marks ?? '—') : '—';
            };

            const hifzMark = getMark('Hifz');
            const engMark = getMark('English');
            const genMark = getMark('General');

            const totalMarks = evaluations.length > 0 ? Math.round(evaluations.reduce((s: any, e: any) => s + (Number(e.marks) || 0), 0) / evaluations.length) : 0;
            
            // Core Data with dynamic widths and proportional truncation
            const data = [
                { text: String(rowIdx + 1), font: font, width: colWidths[0] },
                { text: student.applicationNo || 'N/A', font: boldFont, width: colWidths[1] },
                { text: (student.name || 'Unknown').toUpperCase(), font: boldFont, width: colWidths[2] - 10 },
                { text: (app.status || 'PENDING').replace(/_/g, ' '), font: font, width: colWidths[3] - 5 },
                { text: hifzMark, font: font, width: colWidths[4] },
                { text: engMark, font: font, width: colWidths[5] },
                { text: genMark, font: font, width: colWidths[6] },
                { text: totalMarks > 0 ? String(totalMarks) : '—', font: boldFont, width: colWidths[7] }
            ];

            data.forEach((item, i) => {
                const displayValue = truncateText(item.text, item.width, item.font, 9);
                
                // Status Color Logic
                let color = COLORS.TEXT;
                if (i === 3) {
                    const status = app.status || 'PENDING';
                    if (status === 'ACCEPTED' || status === 'ADMISSION_AUTHORIZED') color = COLORS.TEAL;
                    else if (status === 'REJECTED') color = COLORS.CORAL;
                    else if (status === 'PENDING') color = rgb(0.8, 0.5, 0); // Amber
                }

                page.drawText(displayValue, { 
                    x: rxPos, 
                    y: yPos + 12, 
                    size: 8, 
                    font: item.font, 
                    color
                });
                rxPos += colWidths[i];
            });

            // Minor Detail (Origin/Place) - correctly aligned under Name
            if (student.district || student.state) {
                const originX = 45 + colWidths[0] + colWidths[1];
                const originText = truncateText(`${student.district || ''}${student.district && student.state ? ', ' : ''}${student.state || ''}`, colWidths[2] - 10, italicFont, 7);
                page.drawText(originText, { 
                    x: originX, 
                    y: yPos + 2, 
                    size: 7, 
                    font: italicFont, 
                    color: COLORS.SLATE 
                });
            }

            yPos -= 48; // Padding between rows
        });
    }

    return await pdfDoc.save();
};

const drawBox = (page: any, x: number, y: number, width: number, height: number, color: any) => {
    page.drawRectangle({ x, y, width, height, color });
};
