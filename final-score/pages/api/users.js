import mysql from 'mysql2/promise';

var insert_user_query = `
~ TRANSACTION insert_user;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
INSERT INTO Users (user_id, first_name, last_name, email, password) VALUES ((
    SELECT MAX(user_id) + 1 FROM Users
) ?, ?, ?, ?);
`

var delete_user_query = 
`
BEGIN TRANSACTION delete_user;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
DELETE FROM Users WHERE user_id = ? AND password = ?
`;

const dbConfig = { 
    host: '35.188.195.243',
    user: 'root',
    password: 'skomoteam105',
    database: 'final-score'
};

export default async function handler(req, res) {
   if (req.method === 'DELETE' ) {    
        const { email, pwd} = req.body;
        try {
            const query = `DELETE FROM Users WHERE email = ? AND password = ?`;
            const db = await mysql.createConnection(dbConfig);
            await db.query(query, [email, pwd]);
            await db.end(); 
            
            res.status(200).json({ message: 'User deleted successfully' });
            } catch (error) {
            console.error('Error deleting call:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
        }
        else if (req.method === 'GET' ) {
        console.log('trying to get??');
        try {
            const {email, password} = req.query;
            console.log('trying to log into:', email);
            const db = await mysql.createConnection(dbConfig);
            const [rows] = await db.execute(`SELECT first_name FROM User WHERE email LIKE '%${email}%' AND password LIKE '%${password}%'`);
            await db.end(); 
            
            res.status(200).json(rows); 
        } catch (error) {
            console.log('ERROR IN GETTING LOGIN');
            res.status(500).json({ error: 'Internal server error' });
        }  
   } else if (req.method === 'POST' ) {
        handleAddUser(req, res);
   }
   else {
       res.status(405).end();
   }
}

const handleAddUser = async (req, res) => {
    const { newFirstName, newLastName, newEmail, newPassword } = req.body;
    const db = await mysql.createConnection(dbConfig);
    try {
        await db.query('START TRANSACTION');
        const [existingUsers] = await db.execute(`SELECT * FROM User WHERE email = ? FOR UPDATE`, [newEmail]);
        if (existingUsers.length > 0) {
            await db.query('ROLLBACK');
            res.status(400).json({ error: 'Email already exists' });
            return;
        }
        const [rows] = await db.execute(`SELECT user_id FROM User ORDER BY user_id DESC LIMIT 1 FOR UPDATE`);
        const rowResult = rows[0];
        const newID = rowResult['user_id'] + 1;
        await db.query(`INSERT INTO User (user_id, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)`, [newID, newFirstName, newLastName, newEmail, newPassword]);
        await db.query('COMMIT');
        res.status(201).json({ message: `${newFirstName} successfully signed up!` }); 
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Database error' }); 
    } finally {
        await db.end();
    }
}