CREATE PROCEDURE similar_users @lname VARCHAR(50)
BEGIN
    DECLARE Last_Name VARCHAR(50);
    DECLARE Num_Copies INT;
    DECLARE Num_Ops
    DECLARE Num_Rows INT;

    SELECT COUNT(*) INTO Num_Rows FROM Users;

    DECLARE exit_loop BOOLEAN DEFAULT FALSE;

    DECLARE custCur CURSOR FOR
        SELECT u.last_name, COUNT(*), 194900000 + jk - MAX(u.user_id)
        FROM Users u
        WHERE u.first_name <> 'admin'
        GROUP BY u.last_name

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET exit_loop = TRUE;

    CREATE TABLE IF NOT EXISTS NewTable (
        LNAME VARCHAR(50)  PRIMARY KEY,
        NCOPIES INT,
        NOPS INT
    );

    OPEN custCur;

    cloop: LOOP
        FETCH custCur INTO Last_Name, Num_Copies, Num_Ops;
        IF exit_loop THEN
            LEAVE cloop;
        END IF;

        IF NCOPIES > 1 THEN
            INSERT IGNORE INTO NewTable VALUES (Last_Name, Num_Copies, Num_Ops);
        END IF;

    END LOOP cloop;
    CLOSE custCur;

    SELECT LNAME, NCOPIES, NOPS FROM NewTable WHERE LNAME = @lname;

END;