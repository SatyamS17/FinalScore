import mysql from 'mysql2/promise';


const dbConfig = {
    host: '35.188.195.243',
    user: 'root',
    password: 'skomoteam105',
    database: 'final-score'
};


export default async function handler(req, res) {
   if (req.method === 'DELETE' ) {    
    const { callId } = req.body;
    await handleDeleteCall(callId, res);
   }
   else if (req.method === 'GET' ) {
        const db = await mysql.createConnection(dbConfig);
        const [rows] = await db.execute('SELECT DISTINCT call_type FROM Calls');
        await db.end(); 
        res.status(200).json(rows); 
   }
   else if (req.method === 'POST' ) {
    const { selectedCallId, newCallType, newDecisionType} = req.body;
    const db = await mysql.createConnection(dbConfig);
    const sql = `UPDATE Calls SET call_type = ?, decision = ? WHERE call_id = ?`;
    const values = [newCallType, newDecisionType, selectedCallId];
    await db.execute(sql, values);    
    await db.end(); 
    
    res.status(200).json({'message': `Updated call ${selectedCallId}`}); 
   }
   else {
       res.status(405).end();
   }
}


const handleDeleteCall = async (callId, res) => {
    try {
        const query = `DELETE FROM Calls WHERE call_id = ?`;

        const db = await mysql.createConnection(dbConfig);
        await db.query(query, [callId]);
        await db.end(); 
        
        res.status(200).json({ message: 'Call deleted successfully' });
      } catch (error) {
        console.error('Error deleting call:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

