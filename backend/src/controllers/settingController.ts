import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public (or Private if needed)
export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
    const settings = await prisma.setting.findMany();
    
    // Transform to key-value object for easier frontend use
    const settingsMap = settings.reduce((acc: Record<string, string>, curr: { key: string, value: string }) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    res.json({
        status: 'success',
        data: settingsMap
    });
});

// @desc    Update or create settings
// @route   POST /api/settings
// @access  Private (Admin only)
export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
    const { settings } = req.body; // Expecting an object { KEY: VALUE, ... }

    if (!settings || typeof settings !== 'object') {
        res.status(400).json({ status: 'error', message: 'Settings object required' });
        return;
    }

    const updatePromises = Object.entries(settings).map(([key, value]) => {
        return prisma.setting.upsert({
            where: { key },
            update: { value: String(value) },
            create: { key, value: String(value) }
        });
    });

    await Promise.all(updatePromises);

    res.json({
        status: 'success',
        message: 'Settings updated successfully'
    });
});
