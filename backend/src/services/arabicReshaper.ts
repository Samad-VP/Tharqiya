/**
 * Arabic Reshaper for pdf-lib
 * 
 * pdf-lib does not support complex text layout (Arabic shaping, RTL).
 * This module converts Arabic text into Unicode Presentation Forms B,
 * which contain the pre-shaped (connected) glyphs, and reverses the
 * text order for correct RTL display in pdf-lib's LTR renderer.
 */

// Arabic letter forms: [isolated, final, initial, medial]
// Using Unicode Arabic Presentation Forms-B (U+FE70–U+FEFF)
const ARABIC_FORMS: Record<number, [number, number, number, number]> = {
    0x0621: [0xFE80, 0xFE80, 0xFE80, 0xFE80], // HAMZA
    0x0622: [0xFE81, 0xFE82, 0xFE81, 0xFE82], // ALEF WITH MADDA
    0x0623: [0xFE83, 0xFE84, 0xFE83, 0xFE84], // ALEF WITH HAMZA ABOVE
    0x0624: [0xFE85, 0xFE86, 0xFE85, 0xFE86], // WAW WITH HAMZA
    0x0625: [0xFE87, 0xFE88, 0xFE87, 0xFE88], // ALEF WITH HAMZA BELOW
    0x0626: [0xFE89, 0xFE8A, 0xFE8B, 0xFE8C], // YEH WITH HAMZA
    0x0627: [0xFE8D, 0xFE8E, 0xFE8D, 0xFE8E], // ALEF
    0x0628: [0xFE8F, 0xFE90, 0xFE91, 0xFE92], // BEH
    0x0629: [0xFE93, 0xFE94, 0xFE93, 0xFE94], // TEH MARBUTA
    0x062A: [0xFE95, 0xFE96, 0xFE97, 0xFE98], // TEH
    0x062B: [0xFE99, 0xFE9A, 0xFE9B, 0xFE9C], // THEH
    0x062C: [0xFE9D, 0xFE9E, 0xFE9F, 0xFEA0], // JEEM
    0x062D: [0xFEA1, 0xFEA2, 0xFEA3, 0xFEA4], // HAH
    0x062E: [0xFEA5, 0xFEA6, 0xFEA7, 0xFEA8], // KHAH
    0x062F: [0xFEA9, 0xFEAA, 0xFEA9, 0xFEAA], // DAL
    0x0630: [0xFEAB, 0xFEAC, 0xFEAB, 0xFEAC], // THAL
    0x0631: [0xFEAD, 0xFEAE, 0xFEAD, 0xFEAE], // REH
    0x0632: [0xFEAF, 0xFEB0, 0xFEAF, 0xFEB0], // ZAIN
    0x0633: [0xFEB1, 0xFEB2, 0xFEB3, 0xFEB4], // SEEN
    0x0634: [0xFEB5, 0xFEB6, 0xFEB7, 0xFEB8], // SHEEN
    0x0635: [0xFEB9, 0xFEBA, 0xFEBB, 0xFEBC], // SAD
    0x0636: [0xFEBD, 0xFEBE, 0xFEBF, 0xFEC0], // DAD
    0x0637: [0xFEC1, 0xFEC2, 0xFEC3, 0xFEC4], // TAH
    0x0638: [0xFEC5, 0xFEC6, 0xFEC7, 0xFEC8], // ZAH
    0x0639: [0xFEC9, 0xFECA, 0xFECB, 0xFECC], // AIN
    0x063A: [0xFECD, 0xFECE, 0xFECF, 0xFED0], // GHAIN
    0x0640: [0x0640, 0x0640, 0x0640, 0x0640], // TATWEEL
    0x0641: [0xFED1, 0xFED2, 0xFED3, 0xFED4], // FEH
    0x0642: [0xFED5, 0xFED6, 0xFED7, 0xFED8], // QAF
    0x0643: [0xFED9, 0xFEDA, 0xFEDB, 0xFEDC], // KAF
    0x0644: [0xFEDD, 0xFEDE, 0xFEDF, 0xFEE0], // LAM
    0x0645: [0xFEE1, 0xFEE2, 0xFEE3, 0xFEE4], // MEEM
    0x0646: [0xFEE5, 0xFEE6, 0xFEE7, 0xFEE8], // NOON
    0x0647: [0xFEE9, 0xFEEA, 0xFEEB, 0xFEEC], // HEH
    0x0648: [0xFEED, 0xFEEE, 0xFEED, 0xFEEE], // WAW
    0x0649: [0xFEEF, 0xFEF0, 0xFEEF, 0xFEF0], // ALEF MAKSURA
    0x064A: [0xFEF1, 0xFEF2, 0xFEF3, 0xFEF4], // YEH
};

// Letters that DON'T connect to the next letter (right-joiners only)
const RIGHT_JOIN_ONLY = new Set([
    0x0622, 0x0623, 0x0624, 0x0625, 0x0627, // ALEF variants
    0x0629, // TEH MARBUTA
    0x062F, 0x0630, // DAL, THAL
    0x0631, 0x0632, // REH, ZAIN
    0x0648, 0x0649, // WAW, ALEF MAKSURA
    0x0621, // HAMZA
]);

// Arabic diacritics (tashkeel) - these don't affect shaping
const DIACRITICS = new Set([
    0x064B, 0x064C, 0x064D, 0x064E, 0x064F, 0x0650, 0x0651, 0x0652,
    0x0653, 0x0654, 0x0655, 0x0656, 0x0657, 0x0658, 0x0659, 0x065A,
    0x065B, 0x065C, 0x065D, 0x065E, 0x065F, 0x0670,
]);

const isArabicLetter = (cp: number): boolean => {
    return ARABIC_FORMS[cp] !== undefined;
};

const isDiacritic = (cp: number): boolean => {
    return DIACRITICS.has(cp);
};

/**
 * Reshape Arabic text into presentation forms with proper letter joining.
 * Also reverses the text for RTL display in pdf-lib's LTR renderer.
 */
export const reshapeArabic = (text: string): string => {
    if (!text) return text;

    // Convert string to array of codepoints (handling surrogate pairs)
    const codePoints: number[] = [];
    for (let i = 0; i < text.length; i++) {
        const cp = text.codePointAt(i)!;
        codePoints.push(cp);
        if (cp > 0xFFFF) i++; // skip surrogate pair
    }

    const result: number[] = [];

    for (let i = 0; i < codePoints.length; i++) {
        const cp = codePoints[i];

        // Skip diacritics in shaping logic but keep them in output
        if (isDiacritic(cp)) {
            result.push(cp);
            continue;
        }

        if (!isArabicLetter(cp)) {
            result.push(cp);
            continue;
        }

        const forms = ARABIC_FORMS[cp];

        // Find previous non-diacritic Arabic letter
        let prevArabic: number | null = null;
        for (let j = i - 1; j >= 0; j--) {
            if (isDiacritic(codePoints[j])) continue;
            if (isArabicLetter(codePoints[j])) prevArabic = codePoints[j];
            break;
        }

        // Find next non-diacritic Arabic letter
        let nextArabic: number | null = null;
        for (let j = i + 1; j < codePoints.length; j++) {
            if (isDiacritic(codePoints[j])) continue;
            if (isArabicLetter(codePoints[j])) nextArabic = codePoints[j];
            break;
        }

        // Can the previous letter connect forward (to this letter)?
        const prevConnects = prevArabic !== null && !RIGHT_JOIN_ONLY.has(prevArabic);

        // Can this letter connect forward (to next letter)?
        const canConnectForward = !RIGHT_JOIN_ONLY.has(cp) && nextArabic !== null;

        let formIndex: number;

        if (prevConnects && canConnectForward) {
            formIndex = 3; // medial
        } else if (prevConnects) {
            formIndex = 1; // final
        } else if (canConnectForward) {
            formIndex = 2; // initial
        } else {
            formIndex = 0; // isolated
        }

        result.push(forms[formIndex]);
    }

    // Handle LAM-ALEF ligatures
    const ligatureResult: number[] = [];
    for (let i = 0; i < result.length; i++) {
        // Check for LAM followed by ALEF variants
        if (i + 1 < result.length) {
            const curr = result[i];
            const next = result[i + 1];
            
            // LAM initial/medial + ALEF final forms → ligature
            if ((curr === 0xFEDF || curr === 0xFEE0) && next === 0xFE8E) {
                // لا ligature
                ligatureResult.push(curr === 0xFEE0 ? 0xFEFC : 0xFEFB);
                i++;
                continue;
            }
            if ((curr === 0xFEDF || curr === 0xFEE0) && next === 0xFE82) {
                // لآ ligature
                ligatureResult.push(curr === 0xFEE0 ? 0xFEF6 : 0xFEF5);
                i++;
                continue;
            }
            if ((curr === 0xFEDF || curr === 0xFEE0) && next === 0xFE84) {
                // لأ ligature
                ligatureResult.push(curr === 0xFEE0 ? 0xFEF8 : 0xFEF7);
                i++;
                continue;
            }
            if ((curr === 0xFEDF || curr === 0xFEE0) && next === 0xFE88) {
                // لإ ligature
                ligatureResult.push(curr === 0xFEE0 ? 0xFEFA : 0xFEF9);
                i++;
                continue;
            }
        }
        ligatureResult.push(result[i]);
    }

    // Reverse the Arabic portions for RTL display in LTR renderer
    // We need to reverse Arabic segments while keeping Latin/numbers in order
    const finalResult = reverseArabicSegments(ligatureResult);

    return String.fromCodePoint(...finalResult);
};

/**
 * Reverse Arabic text segments for RTL display.
 * Keeps non-Arabic segments (Latin, numbers) in their original LTR order.
 */
const reverseArabicSegments = (codePoints: number[]): number[] => {
    const isArabicRange = (cp: number): boolean => {
        return (cp >= 0x0600 && cp <= 0x06FF) ||
               (cp >= 0x0750 && cp <= 0x077F) ||
               (cp >= 0x08A0 && cp <= 0x08FF) ||
               (cp >= 0xFB50 && cp <= 0xFDFF) ||
               (cp >= 0xFE70 && cp <= 0xFEFF) ||
               cp === 0x0020; // Include spaces within Arabic
    };

    // If the whole string is Arabic (including spaces), just reverse it
    const allArabicOrSpace = codePoints.every(cp => isArabicRange(cp));
    if (allArabicOrSpace) {
        return [...codePoints].reverse();
    }

    // Mixed content: reverse Arabic segments, keep Latin segments  
    const segments: { chars: number[]; isArabic: boolean }[] = [];
    let currentSegment: number[] = [];
    let currentIsArabic = isArabicRange(codePoints[0]) && codePoints[0] !== 0x0020;

    for (let i = 0; i < codePoints.length; i++) {
        const cp = codePoints[i];
        const cpIsArabic = isArabicRange(cp) && cp !== 0x0020;
        
        if (cp === 0x0020) {
            // Space: add to current segment
            currentSegment.push(cp);
        } else if (cpIsArabic !== currentIsArabic) {
            if (currentSegment.length > 0) {
                segments.push({ chars: currentSegment, isArabic: currentIsArabic });
            }
            currentSegment = [cp];
            currentIsArabic = cpIsArabic;
        } else {
            currentSegment.push(cp);
        }
    }
    if (currentSegment.length > 0) {
        segments.push({ chars: currentSegment, isArabic: currentIsArabic });
    }

    // Reverse Arabic segments, reverse overall segment order for RTL context
    const result: number[] = [];
    // Reverse the segment order (RTL layout) and reverse Arabic chars within
    for (let i = segments.length - 1; i >= 0; i--) {
        if (segments[i].isArabic) {
            result.push(...segments[i].chars.reverse());
        } else {
            result.push(...segments[i].chars);
        }
    }

    return result;
};
