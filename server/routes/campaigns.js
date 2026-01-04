import express from 'express';
import Campaign from '../models/Campaign.js';
import { Op } from 'sequelize';

const router = express.Router();

// Get all active campaigns (public)
router.get('/active', async (req, res) => {
    try {
        const now = new Date();
        const campaigns = await Campaign.findAll({
            where: {
                isActive: true,
                startDate: { [Op.lte]: now },
                endDate: { [Op.gte]: now },
            },
            order: [['priority', 'DESC']],
        });
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all campaigns (admin)
router.get('/', async (req, res) => {
    try {
        const campaigns = await Campaign.findAll({
            order: [['createdAt', 'DESC']],
        });
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single campaign
router.get('/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findByPk(req.params.id);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create campaign (admin)
router.post('/', async (req, res) => {
    try {
        const campaign = await Campaign.create(req.body);
        res.status(201).json(campaign);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update campaign (admin)
router.put('/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findByPk(req.params.id);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }
        await campaign.update(req.body);
        res.json(campaign);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete campaign (admin)
router.delete('/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findByPk(req.params.id);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }
        await campaign.destroy();
        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Track impression
router.post('/:id/impression', async (req, res) => {
    try {
        await Campaign.increment('impressions', { where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Track click
router.post('/:id/click', async (req, res) => {
    try {
        await Campaign.increment('clicks', { where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Track conversion
router.post('/:id/conversion', async (req, res) => {
    try {
        await Campaign.increment('conversions', { where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Toggle campaign status
router.patch('/:id/toggle', async (req, res) => {
    try {
        const campaign = await Campaign.findByPk(req.params.id);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }
        campaign.isActive = !campaign.isActive;
        await campaign.save();
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
