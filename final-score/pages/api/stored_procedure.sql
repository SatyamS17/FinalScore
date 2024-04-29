CREATE PROCEDURE GetRefereeStats()
BEGIN
    -- most accurate referee in the regular season
    SELECT Referee.ref_id, Referee.first_name, Referee.last_name, AVG((Referee.call_count - Referee.i_call_count) / Referee.call_count) AS accuracy
    FROM Referee
    LEFT JOIN Calls AS Call1 ON Referee.ref_id = Call1.ref1
    LEFT JOIN Calls AS Call2 ON Referee.ref_id = Call2.ref2
    LEFT JOIN Calls AS Call3 ON Referee.ref_id = Call3.ref3
    JOIN Game ON Call1.game = Game.game_id OR Call2.game = Game.game_id OR Call3.game = Game.game_id
    WHERE Game.playoff = 0
    GROUP BY Referee.ref_id, Referee.first_name, Referee.last_name
    ORDER BY accuracy DESC
    LIMIT 5;

    -- least accurate referee in the regular season
    SELECT Referee.ref_id, Referee.first_name, Referee.last_name, AVG((Referee.call_count - Referee.i_call_count) / Referee.call_count) AS accuracy
    FROM Referee
    LEFT JOIN Calls AS Call1 ON Referee.ref_id = Call1.ref1
    LEFT JOIN Calls AS Call2 ON Referee.ref_id = Call2.ref2
    LEFT JOIN Calls AS Call3 ON Referee.ref_id = Call3.ref3
    JOIN Game ON Call1.game = Game.game_id OR Call2.game = Game.game_id OR Call3.game = Game.game_id
    WHERE Game.playoff = 0
    GROUP BY Referee.ref_id, Referee.first_name, Referee.last_name
    ORDER BY accuracy ASC
    LIMIT 5;

    -- most accurate referee in the playoffs
    SELECT Referee.ref_id, Referee.first_name, Referee.last_name, AVG((Referee.call_count - Referee.i_call_count) / Referee.call_count) AS accuracy
    FROM Referee
    LEFT JOIN Calls AS Call1 ON Referee.ref_id = Call1.ref1
    LEFT JOIN Calls AS Call2 ON Referee.ref_id = Call2.ref2
    LEFT JOIN Calls AS Call3 ON Referee.ref_id = Call3.ref3
    JOIN Game ON Call1.game = Game.game_id OR Call2.game = Game.game_id OR Call3.game = Game.game_id
    WHERE Game.playoff = 1
    GROUP BY Referee.ref_id, Referee.first_name, Referee.last_name
    ORDER BY accuracy DESC
    LIMIT 5;

    -- least accurate referee in the playoffs
    SELECT Referee.ref_id, Referee.first_name, Referee.last_name, AVG((Referee.call_count - Referee.i_call_count) / Referee.call_count) AS accuracy
    FROM Referee
    LEFT JOIN Calls AS Call1 ON Referee.ref_id = Call1.ref1
    LEFT JOIN Calls AS Call2 ON Referee.ref_id = Call2.ref2
    LEFT JOIN Calls AS Call3 ON Referee.ref_id = Call3.ref3
    JOIN Game ON Call1.game = Game.game_id OR Call2.game = Game.game_id OR Call3.game = Game.game_id
    WHERE Game.playoff = 1
    GROUP BY Referee.ref_id, Referee.first_name, Referee.last_name
    ORDER BY accuracy ASC
    LIMIT 5;
END;