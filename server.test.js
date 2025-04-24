const request = require('supertest');
const express = require('express');
const chalk = require('chalk');

// Custom reporter to show green dots
beforeEach(() => {
    process.stdout.write(chalk.green('•'));
});

// Create Express app for testing
const app = express();
app.get('/api/name', (req, res) => {
    res.json({ name: 'persona grata' });
});

describe('GET /api/name endpoint', () => {
    it('should return project name successfully', async () => {
        const response = await request(app).get('/api/name');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ name: 'persona grata' });
    });

    it('should return JSON content type', async () => {
        const response = await request(app).get('/api/name');
        expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should handle multiple requests consistently', async () => {
        const responses = await Promise.all([
            request(app).get('/api/name'),
            request(app).get('/api/name'),
            request(app).get('/api/name')
        ]);

        responses.forEach(response => {
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ name: 'persona grata' });
        });
    });
});