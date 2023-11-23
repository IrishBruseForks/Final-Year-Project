-- Insert test users
INSERT INTO Users (id, username, picture)
VALUES (
        "101915797943822058743",
        "Ethan Conneely (IrishBruse)",
        "https://lh3.googleusercontent.com/a/ACg8ocLIyC5EsYQxWNhiKBmQp_fkSebzHP65JDd6Q17FFyMxK0Y=s96-c"
    ),
    (
        "108148078418375467933",
        "Irishbruse 10",
        "https://lh3.googleusercontent.com/a/ACg8ocKXcYp0FM0VhmQhxDnkdzbunXCvQlX4ovjpQbhG59tuiw=s96-c"
    ),
    (
        "1",
        "Test Account 1",
        "https://picsum.photos/id/10/200"
    ),
    (
        "103599007347698685839",
        "Ryan Harte",
        "https://lh3.googleusercontent.com/a/ACg8ocLiEexQGgJZmVm0juXAdU0sa59ZF2HbA345tsA5bkmn=s96-c"
    ),
    (
        "2",
        "Test Account 2",
        "https://picsum.photos/id/20/200"
    );
-- Insert test channels
INSERT INTO Channels (name, picture, lastMessage)
VALUES (
        "Test Channel",
        "https://picsum.photos/id/100/200",
        1
    );
-- Insert test messages
INSERT INTO Users_Channels (Users_id, Channels_id)
VALUES ("101915797943822058743", LAST_INSERT_ID()),
    ("103599007347698685839", LAST_INSERT_ID());
