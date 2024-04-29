import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const dbConfig = { 
    host: '35.188.195.243',
    user: 'root',
    password: 'skomoteam105',
    database: 'final-score'
};

export default async function handler(req, res) {
    try {
        const db = await mysql.createConnection(dbConfig);

        await db.query(`DROP PROCEDURE IF EXISTS GetAttendance;`);

        await db.query(`
        CREATE PROCEDURE GetAttendance()
        BEGIN
            SELECT T.name, AVG(G.attendance) AS avg_attendance, COUNT(G.game_id) AS total_home_games, MAX(G.attendance) AS max_attendance
            FROM Team T
            JOIN Game G ON T.team_id = G.home_team
            WHERE G.season = 2023
            GROUP BY T.name
            HAVING 
                AVG(G.attendance) IN (
                    SELECT subquery.avg_attendance
                    FROM (
                        SELECT AVG(G.attendance) AS avg_attendance
                        FROM Team T2
                        JOIN Game G2 ON T2.team_id = G2.home_team
                        WHERE G2.attendance IS NOT NULL AND G2.season = 2023
                        GROUP BY T2.name
                        ORDER BY avg_attendance DESC
                    ) AS subquery
                )
            ORDER BY avg_attendance DESC
            LIMIT 15;
        END;
        `);

        const procedureExists = await db.query('SHOW CREATE PROCEDURE GetAttendance');
        const [rows] = await db.execute('CALL GetAttendance()');
        await db.end();
        console.log(rows);
        res.status(200).json(rows[0]);
    } catch (error) {
        
        console.error(error);
        res.status(500).json({ error: 'An error occurred while executing the function.' });
    }
};