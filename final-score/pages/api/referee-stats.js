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
    if (req.method === 'GET') {
        const { queryNumber } = req.query; 

        if(queryNumber == 0) { res.status(200).json([]); }

        try {
            const db = await mysql.createConnection(dbConfig);

            await db.query(`DROP PROCEDURE IF EXISTS FinalScoreProcedure;`);

            await db.query(`
            CREATE PROCEDURE FinalScoreProcedure(IN queryNumber INT)
            BEGIN
                IF queryNumber = 1 THEN
                    SELECT T.name, CEIL(AVG(G.attendance)) AS avg_attendance, COUNT(G.game_id) AS total_home_games, MAX(G.attendance) AS max_attendance
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
                ELSEIF queryNumber = 2 THEN
                    SELECT p.first_name, p.last_name, COUNT(c.committing) as foul_count
                    FROM Player p
                    JOIN Calls c ON p.player_id = c.committing
                    JOIN Game g ON c.game = g.game_id
                    WHERE YEAR(g.game_date) > 2015 AND g.playoff = 1 AND g.attendance > (SELECT AVG(attendance) FROM Game WHERE YEAR(game_date) > 2015 AND playoff = 1)
                    GROUP BY p.player_id
                    ORDER BY foul_count DESC
                    LIMIT 15;
                ELSEIF queryNumber = 3 THEN
                    SELECT p.first_name, p.last_name, COUNT(c.disadvantaged) AS disadvantaged_calls
                    FROM Player p
                    JOIN Calls c ON p.player_id = c.disadvantaged
                    JOIN (
                        SELECT ref_id, (i_call_count / call_count) AS call_percentage 
                        FROM Referee
                        ORDER BY call_percentage DESC 
                        LIMIT 5
                    ) AS worst_refs ON c.ref1 = worst_refs.ref_id
                    GROUP BY p.player_id
                    ORDER BY disadvantaged_calls DESC
                    LIMIT 15;
                END IF;
            END;
            `);

            const [rows] = await db.execute(`CALL FinalScoreProcedure(${queryNumber})`);
            await db.end();
            res.status(200).json(rows[0]);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while executing the function.' });
        }
}
};