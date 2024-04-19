import mysql from 'mysql2/promise';

const dbConfig = { 
    host: '35.188.195.243',
    user: 'root',
    password: 'skomoteam105',
    database: 'final-score'
};

export default async function handler(req, res) {
   if (req.method === 'GET') {
    const { playerName, year, limit = 20, callType, decisionType } = req.query; 
    if (playerName) { 
        // Fetch Based on Player
        if (callType && decisionType) {
            await handleCallCountSearch(req, res); 
        } else {
            await handlePlayerCallSearch(req, res);
        }
    } else {
         res.status(400).json({ error: 'Player name is required' });
    }
   } else if (req.method === 'POST') {
    await handleAddPlayer(req, res);
   } else {
       res.status(405).end();
   }
}

const handlePlayerCallSearch = async (req, res) => {
    const { playerName, year, limit } = req.query;
    let query = `SELECT * FROM Calls JOIN Player ON (Calls.committing = Player.player_id OR Calls.disadvantaged = Player.player_id) JOIN Game ON Game.game_id = Calls.game WHERE CONCAT(LOWER(Player.first_name), ' ', LOWER(Player.last_name)) LIKE '%${playerName.trim().replace(/\s+/g, '%')}%'`;
    if (year) {
        query += ` AND EXTRACT(YEAR FROM Game.game_date) = ${year}`;
    }
    if (limit) {
        query += ` LIMIT ${limit}`;
    }

    try {
        const db = await mysql.createConnection(dbConfig);
        const [rows] = await db.execute(query);
        await db.end(); 
        
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching player calls:', error);
        res.status(500).json({ error: 'Database error' }); 
    }
}

const handleCallCountSearch = async (req, res) => {
    const { playerName, callType, decisionType } = req.query;

    let query = `SELECT COUNT(*) FROM Calls JOIN Player ON (Calls.${callType === 'committed' ? 'committing' : 'disadvantaged'} = Player.player_id) WHERE (SELECT p.player_id FROM Player p WHERE CONCAT(LOWER(p.first_name), ' ', LOWER(p.last_name)) LIKE '%${playerName.trim().replace(/\s+/g, '%')}%' LIMIT 1) = Player.player_id`;

    if (decisionType !== 'all') {
        query += ` AND decision ${decisionType === 'incorrect' ? 'LIKE' : 'NOT LIKE'} '%I%' `;
    }

    try {
        const db = await mysql.createConnection(dbConfig);
        const [rows] = await db.execute(query);
        
        const countResult = rows[0];
        const callCount = countResult['COUNT(*)'];
        await db.end();         
        res.status(200).json({ callCount }); 
    } catch (error) {
        console.error('Error fetching call counts:', error);
        res.status(500).json({ error: 'Database error' }); 
    }
}

const handleAddPlayer = async (req, res) => {
    const { newFirstName, newLastName, selectedTeamId } = req.body; 
    try {
        const db = await mysql.createConnection(dbConfig);
        const [rows] = await db.execute(`SELECT player_id FROM Player ORDER BY player_id DESC LIMIT 1`);
        const rowResult = rows[0];
        const newID = rowResult['player_id'] + 1;
        await db.query(`INSERT INTO Player (player_id, first_name, last_name, team) VALUES (${newID}, '${newFirstName}', '${newLastName}', '${selectedTeamId}')`);
        await db.end();
        res.status(201).json({ message: `${newFirstName} ${newLastName} was added to ${selectedTeamId}` }); 
    } catch (error) {
        console.error('Error adding player:', error);
        res.status(500).json({ error: 'Database error' }); 
    }
}