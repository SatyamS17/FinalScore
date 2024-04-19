import mysql from 'mysql2/promise';

const dbConfig = { 
    host: '35.188.195.243',
    user: 'root',
    password: 'skomoteam105',
    database: 'final-score'
};

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const db = await mysql.createConnection(dbConfig);
            const [rows] = await db.execute('SELECT team_id, name FROM Team');
            await db.end(); 
            res.status(200).json(rows); 
        } catch (error) {
            console.error('Error fetching teams:', error);
            res.status(500).json({ error: 'Database error' }); 
        }
    } else {
        res.status(405).end();
    }
}