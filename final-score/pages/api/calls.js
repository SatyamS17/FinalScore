import mysql from 'mysql2/promise';


const dbConfig = {
    host: '35.188.195.243',
    user: 'root',
    password: 'skomoteam105',
    database: 'final-score'
};


export default async function handler(req, res) {
    console.log("TEST!");
   if (req.method === 'DELETE' ) {    
    const callId = req.url.split('/')[3];
    await handleDeleteCall(callId, res);
   }
   else {
       res.status(405).end();
   }
}


const handleDeleteCall = async (callId, res) => {
    try {
        console.log("TEST!")
        const deleteQuery = `DELETE FROM calls WHERE call_id = ?`;
        const [result] = await pool.query(deleteQuery, [callId]);
   
        if (result.affectedRows === 1) {
          res.json({ message: `Call with ID ${callId} deleted successfully!` });
        } else {
          res.status(400).json({ error: 'Failed to delete call' });
        }
      } catch (error) {
        console.error('Error deleting call:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

