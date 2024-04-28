import mysql from 'mysql2/promise';

var insert_user_query = `
BEGIN TRANSACTION insert_user;
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
        
   }
   else if (req.method === 'POST' ) {
    // if method is post, add a user with fields user_id, first_name, last_name, email, and password into the Users table
    const { first_name, last_name, email, password } = req.body;
    const db = await mysql.createConnection(dbConfig);
    // fix
    await db.execute('INSERT INTO Users (user_id, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)', [user_id, first_name, last_name, email, password]);
    await db.end();
    
    res.status(200).json({ message: 'User added successfully' });
   }
   else {
       res.status(405).end();
   }
}