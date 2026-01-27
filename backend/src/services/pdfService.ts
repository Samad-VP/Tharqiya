import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const generateApplicationPDF = async (studentData: any) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Header
    page.drawText('Darussalam Edu Village', {
        x: 50,
        y: height - 50,
        size: 24,
        font: boldFont,
        color: rgb(0.1, 0.5, 0.4),
    });

    page.drawText('Tharqiya Course - Application Form', {
        x: 50,
        y: height - 80,
        size: 18,
        font: boldFont,
    });

    page.drawLine({
        start: { x: 50, y: height - 90 },
        end: { x: 550, y: height - 90 },
        thickness: 2,
        color: rgb(0.7, 0.7, 0.7),
    });

    // Content
    let yPos = height - 130;
    const drawRow = (label: string, value: string) => {
        page.drawText(`${label}:`, { x: 50, y: yPos, size: 12, font: boldFont });
        page.drawText(value || 'N/A', { x: 200, y: yPos, size: 12, font });
        yPos -= 25;
    };

    drawRow('Application No', studentData.applicationNo);
    drawRow('Full Name', studentData.user?.name || studentData.name);
    drawRow('Date of Birth', new Date(studentData.dob).toLocaleDateString());
    drawRow('Phone', studentData.user?.phone || studentData.phone);
    drawRow('Place', studentData.place);
    drawRow('District', studentData.district);
    drawRow('Address', studentData.address);
    drawRow('WhatsApp', studentData.whatsapp);
    drawRow('Hifz Institution', studentData.hifzCenter);
    drawRow('Dawras Completed', studentData.dawrasCount);
    drawRow('School Education', studentData.schoolEducation);
    drawRow('Father/Guardian', studentData.fatherName);

    yPos -= 20;
    page.drawText('Campus Preferences', { x: 50, y: yPos, size: 14, font: boldFont });
    yPos -= 25;
    drawRow('1st Option', studentData.firstOption);
    drawRow('2nd Option', studentData.secondOption);
    drawRow('3rd Option', studentData.thirdOption);

    // Footer
    page.drawText('Generated automatically by Tharqiya Admission System', {
        x: 50,
        y: 40,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5),
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};

export const generateResultPDF = async (studentData: any, resultData: any, evaluations: any[]) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Header (Similar to Application)
    page.drawText('Darussalam Edu Village', {
        x: 50,
        y: height - 50,
        size: 24,
        font: boldFont,
        color: rgb(0.1, 0.5, 0.4),
    });

    page.drawText('Official Interview Result', {
        x: 50,
        y: height - 80,
        size: 18,
        font: boldFont,
    });

    page.drawLine({
        start: { x: 50, y: height - 90 },
        end: { x: 550, y: height - 90 },
        thickness: 2,
        color: rgb(0.7, 0.7, 0.7),
    });

    // Student Info
    let yPos = height - 130;
    page.drawText('Student Details', { x: 50, y: yPos, size: 14, font: boldFont });
    yPos -= 25;
    page.drawText(`Name: ${studentData.user?.name}`, { x: 50, y: yPos, size: 12, font });
    page.drawText(`App No: ${studentData.applicationNo}`, { x: 350, y: yPos, size: 12, font });
    yPos -= 40;

    // Evaluation Results
    page.drawText('Evaluation Matrix', { x: 50, y: yPos, size: 14, font: boldFont });
    yPos -= 25;
    
    evaluations.forEach((evaluation: any) => {
        page.drawText(`${evaluation.subject}:`, { x: 50, y: yPos, size: 12, font: boldFont });
        page.drawText(`${evaluation.marks} Marks`, { x: 200, y: yPos, size: 12, font });
        if (evaluation.remarks) {
            page.drawText(`(${evaluation.remarks})`, { x: 300, y: yPos, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
        }
        yPos -= 20;
    });

    yPos -= 20;
    page.drawLine({ 
        start: { x: 50, y: yPos }, 
        end: { x: 550, y: yPos }, 
        thickness: 1, 
        color: rgb(0.8, 0.8, 0.8) 
    });
    yPos -= 30;

    // Final Decision
    page.drawText('Final Summary', { x: 50, y: yPos, size: 14, font: boldFont });
    yPos -= 25;
    page.drawText(`Total Marks: ${resultData.totalMarks}`, { x: 50, y: yPos, size: 12, font });
    page.drawText(`Average: ${resultData.averageMarks}%`, { x: 200, y: yPos, size: 12, font });
    yPos -= 40;

    const decisionColor = resultData.decision === 'ACCEPTED' ? rgb(0, 0.6, 0) : resultData.decision === 'REJECTED' ? rgb(0.8, 0, 0) : rgb(0.8, 0.6, 0);
    
    page.drawText('ADMISSION STATUS:', { x: 50, y: yPos, size: 14, font: boldFont });
    page.drawText(resultData.decision, { x: 200, y: yPos, size: 20, font: boldFont, color: decisionColor });

    // Footer
    page.drawText('This is a computer-generated document and does not require a physical signature.', {
        x: 50,
        y: 40,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5),
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};
