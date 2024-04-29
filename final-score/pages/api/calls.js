import mysql from 'mysql2/promise';


const dbConfig = {
    host: '35.188.195.243',
    user: 'root',
    password: 'skomoteam105',
    database: 'final-score'
};

async function createTrigger() {
    const db = await mysql.createConnection(dbConfig);
    const sql1 = `
    DROP TRIGGER IF EXISTS update_decisions;
    `;
    const sql = `
    CREATE TRIGGER update_decisions 
    BEFORE UPDATE ON Calls
    FOR EACH ROW
    BEGIN
        IF NEW.decision IS NULL OR NEW.decision = '' THEN
            SET NEW.decision = 'PENDING';
        END IF;

        IF NEW.call_type IS NULL OR NEW.call_type = '' THEN
            SET NEW.decision = 'PENDING';
            SET NEW.call_type = 'PENDING';
        END IF;
    END;
    `;
    try {
        await db.query(sql1);
        await db.query(sql);
        console.log("Trigger created successfully!");
    } catch (error) {
        console.log(error);
    } finally {
      await db.end();
    }
}

  export default async function handler(req, res) {
    
    await createTrigger();

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
    // test if commited is passed in to test is update or add
    const { selectedcommited } = req.body;

    if(selectedcommited) {
        handleAddCall(req, res);
    }else{
        handleUpdateCall(req, res);
    }
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

const handleUpdateCall = async (req, res) => {
    const { selectedCallId, newCallType, newDecisionType} = req.body;
    const db = await mysql.createConnection(dbConfig);
    try {
        const sql = `UPDATE Calls SET call_type = ?, decision = ? WHERE call_id = ?`;
        const values = [newCallType, newDecisionType, selectedCallId];
        await db.query('START TRANSACTION');
        await db.execute(sql, values);
        await db.query('COMMIT');
        res.status(200).json({'message': `Updated call ${selectedCallId}`}); 
      } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error updating call:', error);
        res.status(500).json({ error: 'Internal server error' });
      } finally {
        await db.end(); 
      }
}

const handleAddCall = async (req, res) => {
    const {selectedCallType, selectedcommited, selecteddisadvantaged, newDecisionType, selectedTimeLeft, selectedPeriod, selectedref1, selectedref2, selectedref3, selectedComment} = req.body; 
    try {
        const db = await mysql.createConnection(dbConfig);
        
        // check for invalid paramaters
        if(selectedCallType === "" || selectedcommited === "" || selecteddisadvantaged === "" || newDecisionType === "" || selectedTimeLeft === "" || selectedPeriod === ""  || selectedref1 === ""  || selectedref2 === ""  || selectedref3 === "") {
            res.status(500).json({ error: 'Invalid inputs' });
            return;
        }
        // get a new call id
        const [rows] = await db.execute(`SELECT call_id FROM Calls ORDER BY call_id DESC LIMIT 1`);
        const rowResult = rows[0];
        const newID = rowResult['call_id'] + 1;
        await db.query(`INSERT INTO Calls (call_id, call_type, committing, disadvantaged, decision , comments, time_left, period, ref1, ref2, ref3) VALUES (${newID}, '${selectedCallType}', '${selectedcommited}', '${selecteddisadvantaged}', '${newDecisionType}', '${selectedComment}', '${selectedTimeLeft}', '${selectedPeriod}', '${selectedref1}', '${selectedref2}',  '${selectedref3}')`);
        await db.end();
        
        res.status(200).json({ message: `Call of ${selectedCallType} was added!` }); 
    } catch (error) {
        console.error('Error adding call:', error);
        res.status(500).json({ error: 'Database error' }); 
    }
}

