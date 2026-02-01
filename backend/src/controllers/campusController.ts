
import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get all campuses with seat stats
// @route   GET /api/campus
// @access  Private (Admin/Principal)
export const getCampuses = asyncHandler(async (req: Request, res: Response) => {
    const campuses = await prisma.campus.findMany({
        orderBy: { name: 'asc' }
    });

    // Calculate current occupancy
    const stats = await prisma.allotment.groupBy({
        by: ['campus'],
        _count: {
            id: true
        }
    });

    const campusesWithStats = campuses.map(campus => {
        const stat = stats.find(s => s.campus === campus.name);
        return {
            ...campus,
            occupied: stat?._count.id || 0,
            available: campus.maxSeats - (stat?._count.id || 0)
        };
    });

    res.json({
        status: 'success',
        data: campusesWithStats
    });
});

// @desc    Update campus capacity
// @route   PUT /api/campus/:id
// @access  Private (Principal Only)
export const updateCampusCapacity = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { maxSeats } = req.body;

    const campus = await prisma.campus.update({
        where: { id: id as string },
        data: { maxSeats: parseInt(maxSeats) }
    });

    res.json({
        status: 'success',
        data: campus,
        message: 'Campus capacity updated'
    });
});

// @desc    Seed Initial Campuses (Helper)
// @route   POST /api/campus/seed
// @access  Private (Principal Only)
export const seedCampuses = asyncHandler(async (req: Request, res: Response) => {
    const initialCampuses = [
        { name: 'Darussalam Tharqiyathul Huffaz, Darussalam Edu Village, Muchukunnu', maxSeats: 50 },
        { name: 'Shamsul Ulama Tharqiyathul Huffaz, Mannarkkad, Palakkad', maxSeats: 30 },
        { name: 'Umariyya Tharqiyathul Huffaz, Athinjal, Kanjangad', maxSeats: 30 }
    ];

    const results = [];
    for (const c of initialCampuses) {
        const campus = await prisma.campus.upsert({
            where: { name: c.name },
            update: {},
            create: c
        });
        results.push(campus);
    }

    res.json({
        status: 'success',
        data: results
    });
});
