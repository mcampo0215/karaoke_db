/*************************************************************
* This script creates the database named karaoke_db
**************************************************************/

DROP DATABASE IF EXISTS karaoke_db;
CREATE DATABASE karaoke_db;
USE karaoke_db;

-- create the tables for the database
CREATE TABLE users (
  user_id           INT            PRIMARY KEY   AUTO_INCREMENT,
  email_address		VARCHAR(100)   NOT NULL,
  username          VARCHAR(50)    NOT NULL      UNIQUE,
  password          VARCHAR(60)    NOT NULL,
  first_name        VARCHAR(100)   NOT NULL,
  last_name         VARCHAR(100)   NOT NULL
);
  
CREATE TABLE artists ( 
	artist_id      	   INT            PRIMARY KEY   AUTO_INCREMENT,
    artist_stage_name  VARCHAR(255)   NOT NULL,
    birthdate 		   DATE,
    country_of_origin VARCHAR(100)	  NOT NULL	
); 

CREATE TABLE genres ( 
	genre_id      	   INT            PRIMARY KEY   AUTO_INCREMENT,
    genre_name  	   VARCHAR(255)   NOT NULL,
    genre_description  TEXT
); 

CREATE TABLE songs (
	song_id      	INT            PRIMARY KEY   AUTO_INCREMENT,
    song_title 		VARCHAR(255)   NOT NULL,
	artist_id		INT			   NOT NULL,
	genre_id		INT		       NOT NULL,
	duration 		TIME,
	releaseYear		YEAR,
    CONSTRAINT songs_fk_artists FOREIGN KEY (artist_id) REFERENCES artists (artist_id),
	CONSTRAINT songs_fk_genres FOREIGN KEY (genre_id) REFERENCES genres (genre_id)
);

CREATE TABLE playlists (
	playlist_id        INT            PRIMARY KEY   AUTO_INCREMENT,
    user_id			   INT			  NOT NULL, 
    playlist_name 	   VARCHAR(255)   NOT NULL, 
    created_at         DATETIME       DEFAULT CURRENT_TIMESTAMP,
    mood_tag	       VARCHAR(100),   
    CONSTRAINT playlists_fk_users FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE song_playlists	(
	playlist_id		  INT		       NOT NULL,
	song_id			  INT		       NOT NULL, 
    CONSTRAINT songplay_fk_playlists FOREIGN KEY (playlist_id) REFERENCES playlists (playlist_id),
    CONSTRAINT songplay_fk_songs     FOREIGN KEY (song_id)	   REFERENCES songs (song_id)
); 

CREATE TABLE karaoke_interest (
	user_id			INT		       NOT NULL,
	song_id			INT		       NOT NULL, 
    CONSTRAINT karaoke_fk_users FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT karaoke_fk_songs FOREIGN KEY (song_id) REFERENCES songs (song_id)
); 

/*************************************************************
* This script inserts values into karaoke_db 
tables: users, artists, genres,
**************************************************************/
INSERT INTO users (user_id, email_address, username, password, first_name, last_name) VALUES
(1, 'ashleyp12@gmail.com', 'ashleyp12', 'user1pswd', 'Ashley' , 'Peralta'), 
(2, 'matthewc2@gmail.com', 'matthewc2', 'user2pswd', 'Matthew', 'Camps'), 
(3, 'sarahg6@gmail.com',   'sarahg6' , 'user3pswd' , 'Sarah' , 'Gover'), 
(4, 'kevenf4@gmail.com',   'kevenf4' , 'user4pswd' , 'Keven' , 'Ferrer'), 
(5, 'dougv7@gmail.com',    'dougv7',  'user5pswd' , 'Doug' , 'Vera'), 
(6, 'suzanw8@gmail.com',   'suzanw8', 'user6pswd' , 'Suzan' , 'Williams'); 

INSERT INTO artists (artist_stage_name, birthdate, country_of_origin) VALUES
('Rauw Alejandro', '1993-01-10', 'Puerto Rico'),
('Bad Bunny', '1994-03-10', 'Puerto Rico'),
('Karol G', '1991-02-14', 'Colombia'),
('Feid', '1992-08-19', 'Colombia'),
('Bruno Mars', '1985-10-08', 'United States'),
('Zara Larsson', '1997-12-16', 'Sweden'),
('Charlie Puth', '1991-12-02', 'United States'),
('The Chainsmokers', NULL, 'United States'),
('The Weeknd', '1990-02-16', 'Canada'),
('Drake', '1986-10-24', 'Canada'),
('Travis Scott', '1991-04-30', 'United States'),
('Kendrick Lamar', '1987-06-17', 'United States'),
('J. Cole', '1985-01-28', 'United States'),
('Post Malone', '1995-07-04', 'United States'),
('Kali Uchis', '1994-07-17', 'United States'),
('Cardi B', '1992-10-11', 'United States'),
('SZA', '1989-11-08', 'United States'),
('Frank Ocean', '1987-10-28', 'United States'),
('Usher', '1978-10-14', 'United States'),
('Miguel', '1985-10-23', 'United States'),
('Chris Brown', '1989-05-05', 'United States'),
('Alicia Keys', '1981-01-25', 'United States'),
('J Balvin', '1985-05-07', 'Colombia'),
('Ozuna', '1992-03-13', 'Puerto Rico'),
('Myke Towers', '1994-01-15', 'Puerto Rico'),
('Latin Mafia', NULL, 'Mexico'),
('Maluma', '1994-01-28', 'Colombia'),
('Daddy Yankee', '1977-02-03', 'Puerto Rico'),
('Don Omar', '1978-02-10', 'Puerto Rico');

INSERT INTO genres (genre_name, genre_description) VALUES
('Latin Urban', 'A modern fusion of Latin rhythms with urban influences'),
('Reggaeton', 'A genre originating from Puerto Rico with reggae and hip-hop influences'),
('Latin Pop', 'Pop music with Latin cultural and rhythmic elements'),
('Pop', 'Mainstream popular music across various styles'),
('Rap', 'Rhythmic spoken lyrics over beats'),
('Hip-Hop', 'A cultural movement including rap, beats, and urban expression'),
('R&B', 'Rhythm and blues with soulful vocals and smooth production'),
('Trap', 'A subgenre of hip-hop featuring heavy bass and hi-hat patterns'),
('Dance Pop', 'Upbeat pop music designed for dancing'),
('Electronic', 'Music produced primarily with electronic instruments and synthesizers');


INSERT INTO songs (song_title, artist_id, genre_id, duration, releaseYear) 
VALUES 
('Todo De Ti', 1, 3, '00:03:23', 2021),
('Ni Me Conozco', 1, 1, '00:03:50', 2024),
('Amar de Nuevo' , 1, 1, '00:04:29', 2024), 
('Tu Con El' , 1, 1, '00:04:50' , 2024), 
('Aquel Nap ZzZz' , 1, 1, '00:4:56' , 2021), 
('LOKERA' , 1, 1, '00:03:17' , 2023),
('SATURNO' , 1, 1, '00:01:32', 2023),

('Tití Me Preguntó', 2, 2, '00:04:03', 2022),
('Callaíta', 2, 2, '00:04:10', 2019),
('Soy Peor', 2, 2, '00:04:17' , 2016),
('DtMF' , 2, 2, '00:03:57', 2025), 
('TURiSTA' , 2, 2, '00:03:10' , 2025), 
('KLOuFRENS', 2, 2, '00:03:19' , 2025), 
('PERRO NEGRO' , 2, 2, '00:02:43' , 2023), 
('MONACO', 2, 2, '00:04:26' , 2023), 

('Tusa', 3, 3, '00:03:20', 2019),
('Provenza', 3, 3, '00:03:30', 2022),
('Unica' , 3, 3, '00:02:25' , 2025), 
('LATINA FOREVER' , 3, 3, '00:02:40' , 2025), 
('Ivonny Bonita', 3, 3, '00:03:43' , 2025), 
('Mi Ex Tenia Razon', 3, 3, '00:02:34' , 2023), 
('Amargura' , 3, 1, '00:02:51' , 2023), 


('Ferxxo 100', 4, 1, '00:03:00', 2023),
('Normal', 4, 1, '00:02:50', 2022),
('Feliz Cumpleaños Ferxxo', 4, 1, '00:03:20', 2022),
('Chorrito Pa Las Animas', 4, 1, '00:02:35', 2022),
('Hey Mor', 4, 1, '00:03:27', 2022),
('Si Te La Encuentras Por Ahí', 4, 1, '00:03:10', 2021),
('Porfa', 4, 1, '00:03:53', 2020),
('Porfa Remix', 4, 1, '00:05:20', 2020),
('Vacaxiones', 4, 1, '00:03:05', 2021),
('Castigo', 4, 1, '00:02:50', 2022),
('X19X', 4, 1, '00:02:45', 2023),
('Le Pido a Dios', 4, 1, '00:03:40', 2023),

('24K Magic', 5, 4, '00:03:45', 2016),
('That’s What I Like', 5, 7, '00:03:26', 2017),
('Versace on the Floor', 5, 4, '00:04:21', 2016),
('Locked Out of Heaven', 5, 4, '00:03:53', 2012),
('Treasure', 5, 4, '00:02:58', 2013),
('Just the Way You Are', 5, 4, '00:03:40', 2010),
('Grenade', 5, 4, '00:03:42', 2010),
('When I Was Your Man', 5, 7, '00:03:33', 2012),
('Finesse', 5, 7, '00:03:11', 2016),
('Risk It All' , 5, 4, '00:03:24' , 2026), 
('When I Was Your Man' , 5,  3, '00:03:33' , 2012), 

('Lush Life', 6, 9, '00:03:21', 2015),
('Never Forget You', 6, 9, '00:03:33', 2015),
('Ain’t My Fault', 6, 9, '00:03:46', 2016),
('Symphony', 6, 9, '00:03:32', 2017),
('Ruin My Life', 6, 4, '00:03:11', 2018),
('Uncover', 6, 7, '00:03:34', 2013),
('So Good', 6, 4, '00:02:46', 2017),
('I Would Like', 6, 9, '00:03:43', 2016),
('Wow', 6, 9, '00:02:12', 2020),
('Love Me Land', 6, 9, '00:02:40', 2020),
('Talk About Love', 6, 7, '00:03:21', 2021),

('Attention', 7, 4, '00:03:31', 2017),
('We Don’t Talk Anymore', 7, 4, '00:03:37', 2016),
('One Call Away', 7, 4, '00:03:14', 2015),
('How Long', 7, 4, '00:03:20', 2017),
('See You Again', 7, 4, '00:03:49', 2015),
('Marvin Gaye', 7, 7, '00:03:10', 2015),
('The Way I Am', 7, 4, '00:03:06', 2018),
('Done For Me', 7, 7, '00:03:00', 2018),
('Left and Right', 7, 4, '00:02:34', 2022),
('Light Switch', 7, 9, '00:03:05', 2022),
('Smells Like Me', 7, 4, '00:03:24', 2022),

('Closer', 8, 10, '00:04:05', 2016),
('Don’t Let Me Down', 8, 10, '00:03:28', 2016),
('Something Just Like This', 8, 10, '00:04:07', 2017),
('Paris', 8, 9, '00:03:41', 2017),
('Roses', 8, 10, '00:03:46', 2015),
('All We Know', 8, 9, '00:03:14', 2016),
('Sick Boy', 8, 10, '00:03:13', 2018),
('Everybody Hates Me', 8, 10, '00:03:43', 2018),
('This Feeling', 8, 9, '00:03:18', 2018),
('Call You Mine', 8, 10, '00:03:37', 2019),
('Takeaway', 8, 10, '00:03:29', 2019),

('Blinding Lights', 9, 10, '00:03:20', 2019),
('Starboy', 9, 7, '00:03:50', 2016),
('Save Your Tears', 9, 10, '00:03:35', 2020),
('The Hills', 9, 10, '00:04:02', 2015),
('Can’t Feel My Face', 9, 10, '00:03:34', 2015),
('I Feel It Coming', 9, 10, '00:04:29', 2016),
('In The Night', 9, 10, '00:03:55', 2015),
('Call Out My Name', 9, 7, '00:03:48', 2018),

('Hotline Bling', 10, 6, '00:04:27', 2015),
('God’s Plan', 10, 6, '00:03:18', 2018),
('One Dance', 10, 6, '00:02:54', 2016),
('In My Feelings', 10, 6, '00:03:38', 2018),
('Passionfruit', 10, 6, '00:04:58', 2017),
('Nonstop', 10, 6, '00:03:58', 2018),
('Started From the Bottom', 10, 6, '00:02:54', 2013),
('Hold On, We’re Going Home', 10, 7, '00:03:47', 2013),

('SICKO MODE', 11, 8, '00:05:12', 2018),
('Goosebumps', 11, 8, '00:04:04', 2016),
('HIGHEST IN THE ROOM', 11, 8, '00:02:55', 2019),
('Antidote', 11, 8, '00:04:22', 2015),
('BUTTERFLY EFFECT', 11, 8, '00:03:10', 2017),
('Stargazing', 11, 8, '00:04:38', 2018),
('FE!N', 11, 8, '00:03:11', 2023),

('HUMBLE', 12, 6, '00:02:57', 2017),
('DNA.', 12, 6, '00:03:06', 2017),
('Alright', 12, 6, '00:03:39', 2015),
('LOVE.', 12, 7, '00:03:33', 2017),
('Swimming Pools (Drank)', 12, 6, '00:03:40', 2012),
('King Kunta', 12, 6, '00:03:54', 2015),
('Money Trees', 12, 6, '00:06:26', 2012),

('No Role Modelz', 13, 6, '00:04:52', 2014),
('Wet Dreamz', 13, 6, '00:03:59', 2014),
('Middle Child', 13, 6, '00:03:33', 2019),
('Power Trip', 13, 7, '00:04:00', 2013),
('G.O.M.D.', 13, 6, '00:05:01', 2014),
('Love Yourz', 13, 6, '00:03:31', 2014),
('Work Out', 13, 4, '00:03:55', 2011),

('Circles', 14, 4, '00:03:35', 2019),
('Rockstar', 14, 8, '00:03:38', 2017),
('Congratulations', 14, 4, '00:03:40', 2016),
('Sunflower', 14, 4, '00:02:38', 2018),
('Better Now', 14, 4, '00:03:51', 2018),
('White Iverson', 14, 8, '00:04:17', 2015),
('Wow.', 14, 4, '00:02:29', 2018), 

('Telepatía', 15, 10, '00:02:40', 2021),
('Moonlight', 15, 10, '00:03:07', 2023),
('After the Storm', 15, 7, '00:03:27', 2018),
('Dead to Me', 15, 10, '00:03:20', 2018),
('Melting', 15, 7, '00:03:18', 2015),
('I Wish You Roses', 15, 10, '00:03:45', 2023),
('Tyrant', 15, 10, '00:03:25', 2017),

('Good Days', 17, 10, '00:04:39', 2020),
('Kill Bill', 17, 10, '00:02:33', 2022),
('Snooze', 17, 7, '00:03:21', 2022),
('The Weekend', 17, 7, '00:04:32', 2017),
('Love Galore', 17, 7, '00:04:35', 2017),
('Shirt', 17, 10, '00:03:02', 2022),
('Broken Clocks', 17, 10, '00:03:51', 2017),

('Thinkin Bout You', 18, 10, '00:03:20', 2012),
('Pink + White', 18, 10, '00:03:04', 2016),
('Nights', 18, 10, '00:05:07', 2016),
('Ivy', 18, 10, '00:04:09', 2016),
('Lost', 18, 10, '00:03:54', 2012),
('Novacane', 18, 10, '00:05:02', 2011),
('Swim Good', 18, 10, '00:04:17', 2011),

('Yeah!', 19, 7, '00:04:10', 2004),
('Burn', 19, 7, '00:04:15', 2004),
('U Got It Bad', 19, 7, '00:04:07', 2001),
('DJ Got Us Fallin’ In Love', 19, 9, '00:03:42', 2010),
('My Boo', 19, 7, '00:03:43', 2004),
('Love in This Club', 19, 7, '00:04:19', 2008),
('Confessions Part II', 19, 7, '00:03:49', 2004),

('Adorn', 20, 7, '00:03:13', 2012),
('Sure Thing', 20, 7, '00:03:15', 2010),
('Sky Walker', 20, 7, '00:04:19', 2017),
('Coffee', 20, 7, '00:04:50', 2015),
('How Many Drinks?', 20, 7, '00:04:32', 2012),
('Come Through and Chill', 20, 7, '00:04:36', 2017),
('Waves', 20, 7, '00:03:22', 2015),

('With You', 21, 7, '00:04:12', 2007),
('Forever', 21, 9, '00:04:38', 2008),
('No Guidance', 21, 7, '00:04:20', 2019),
('Loyal', 21, 7, '00:04:24', 2014),
('Kiss Kiss', 21, 9, '00:04:10', 2007),
('Don’t Wake Me Up', 21, 9, '00:03:42', 2012),
('Under the Influence', 21, 7, '00:03:04', 2019),

('If I Ain’t Got You', 22, 7, '00:03:48', 2003),
('No One', 22, 7, '00:04:13', 2007),
('Girl on Fire', 22, 7, '00:03:44', 2012),
('Fallin’', 22, 7, '00:03:30', 2001),
('Un-Thinkable (I’m Ready)', 22, 7, '00:03:48', 2009),
('Empire State of Mind (Part II)', 22, 7, '00:03:36', 2009),
('You Don’t Know My Name', 22, 7, '00:03:57', 2003),

('Mi Gente', 23, 2, '00:03:05', 2017),
('Ginza', 23, 2, '00:02:50', 2015),
('Ay Vamos', 23, 2, '00:04:24', 2014),
('Safari', 23, 2, '00:03:25', 2016),
('X', 23, 2, '00:02:53', 2018),
('Reggaeton', 23, 2, '00:03:08', 2018),
('Que Pretendes', 23, 2, '00:03:44', 2019),

('Taki Taki', 24, 2, '00:03:33', 2018),
('Caramelo', 24, 2, '00:03:36', 2020),
('Se Preparó', 24, 2, '00:03:46', 2017),
('Dile Que Tú Me Quieres', 24, 2, '00:03:07', 2016),
('Baila Baila Baila', 24, 2, '00:02:42', 2019),
('Tu Foto', 24, 2, '00:03:17', 2017),

('La Playa', 25, 2, '00:03:20', 2019),
('Girl', 25, 2, '00:03:19', 2020),
('Bandido', 25, 2, '00:03:12', 2020),
('Diosa', 25, 2, '00:03:31', 2020),
('Lala', 25, 2, '00:03:12', 2023),
('Ulala', 25, 2, '00:03:20', 2022),

('Julieta', 26, 3, '00:03:10', 2023),
('Patadas de Ahogado', 26, 3, '00:03:05', 2023),
('No Digas Nada', 26, 3, '00:02:58', 2022),
('Morena', 26, 3, '00:03:12', 2023),
('Se Fue', 26, 3, '00:03:20', 2023),
('Mala', 26, 3, '00:03:00', 2022),

('Hawái', 27, 2, '00:03:20', 2020),
('Felices los 4', 27, 2, '00:03:49', 2017),
('Corazón', 27, 2, '00:03:05', 2017),
('HP', 27, 2, '00:03:04', 2019),
('Borro Cassette', 27, 2, '00:03:26', 2015),
('Cuatro Babys', 27, 2, '00:04:16', 2016),

('Gasolina', 28, 2, '00:03:12', 2004),
('Dura', 28, 2, '00:03:20', 2018),
('Shaky Shaky', 28, 2, '00:03:58', 2016),
('Limbo', 28, 2, '00:03:44', 2012),
('Rompe', 28, 2, '00:03:06', 2005),
('Lo Que Pasó, Pasó', 28, 2, '00:03:30', 2004),

('Danza Kuduro', 29, 2, '00:03:19', 2010),
('Pobre Diabla', 29, 2, '00:03:26', 2003),
('Salió El Sol', 29, 2, '00:03:17', 2006),
('Taboo', 29, 2, '00:03:52', 2011),
('Virtual Diva', 29, 2, '00:03:55', 2009),
('Dile', 29, 2, '00:03:27', 2003);

INSERT INTO playlists (user_id, playlist_name, mood_tag) VALUES
(1, 'Late Night Vibes', 'chill'),
(2, 'Workout Energy Boost', 'energetic'),
(3, 'Romantic Evening', 'romantic'),
(4, 'Party Starters', 'party'),
(5, 'Sunday Morning Coffee', 'relaxed'),
(1, 'Latin Heat', 'latin'),
(2, 'Hip-Hop Essentials', 'hype'),
(3, 'Sad Hours', 'melancholic'),
(4, 'Feel-Good Pop', 'happy'),
(5, 'Karaoke Favorites', 'fun'),
(6, 'Evening Chillout', 'relaxed'),
(6, 'Focus Mode', 'study');

INSERT INTO playlists (user_id, playlist_name, created_at, mood_tag) VALUES
(1, 'Road Trip Mix', '2024-01-12 14:30:00', 'adventurous'),
(2, 'Study & Focus', '2024-06-01 09:15:00', 'focus'),
(3, 'Throwback Hits', '2023-12-20 18:45:00', 'nostalgic'),
(4, 'Reggaeton Party', '2024-03-05 22:10:00', 'latin'),
(5, 'Chill Electronic', '2024-01-30 20:00:00', 'chill'),
(1, 'R&B Slow Jams', '2025-12-14 21:00:00', 'romantic'),
(2, 'Top 2020s Hits', '2024-03-01 12:00:00', 'popular'),
(3, 'Mood Booster', '2024-02-10 08:30:00', 'happy'),
(4, 'Trap Bangers', '2025-11-07 23:59:00', 'hype'),
(5, 'Acoustic Calm', '2025-01-05 10:20:00', 'relaxed');

-- Late Night Vibes Playlist
INSERT INTO song_playlists (playlist_id, song_id)
VALUES
(1, 79),  
(1, 80),  
(1, 130),  
(1, 139), 
(1, 27),  
(1, 91);

-- Energy Boost
INSERT INTO song_playlists (playlist_id, song_id)
VALUES
(2, 95),  
(2, 102),  
(2, 203),  
(2, 204), 
(2, 8),
(2, 15);  

-- Love Vibes 
INSERT INTO song_playlists (playlist_id, song_id)
VALUES
(3, 165),  
(3, 166),  
(3, 151),  
(3, 152),  
(3, 137),  
(3, 138);  

-- party 
INSERT INTO song_playlists (playlist_id, song_id)
VALUES
(4, 172),  
(4, 6),  
(4, 14),  
(4, 206), 
(4, 1),  
(4, 177);  

-- relaxed 
INSERT INTO song_playlists (playlist_id, song_id)
VALUES
(5, 21),   
(5, 24),   
(5, 40), 
(5, 53), 
(5, 84),  
(5, 78);  

INSERT INTO song_playlists (playlist_id, song_id)
VALUES
(6, 131),  
(6, 34),  
(6, 72),  
(6, 196),  
(6, 123),   
(6, 214); 

INSERT INTO song_playlists (playlist_id, song_id) VALUES
(7, 3),  
(7, 25),  
(7, 48), 
(7, 67),  
(7, 119),  
(7, 189);  

INSERT INTO song_playlists (playlist_id, song_id) VALUES
(8, 108),  
(8, 114),  
(8, 90), 
(8, 191),  
(8, 120), 
(8, 121); 

INSERT INTO song_playlists (playlist_id, song_id) VALUES
(9, 1),  
(9, 15),  
(9, 27),  
(9, 80),  
(9, 209),  
(9, 123);  

INSERT INTO song_playlists (playlist_id, song_id) VALUES
(10, 100), 
(10, 102), 
(10, 46),  
(10, 57),   
(10, 20),  
(10, 27); 

INSERT INTO song_playlists (playlist_id, song_id) VALUES
(11, 100), 
(11, 50), 
(11, 101), 
(11, 40),  
(11, 1),   
(11, 10);  

INSERT INTO song_playlists (playlist_id, song_id) VALUES
(12, 9),   
(12, 34),  
(12, 72),  
(12, 34),  
(12, 62),  
(12, 20);  

INSERT INTO song_playlists (playlist_id, song_id) VALUES
(13, 73),  
(13, 78),  
(13, 4),  
(13, 5),  
(13, 50),  
(13, 45); 

INSERT INTO song_playlists (playlist_id, song_id) VALUES
(14, 60),  
(14, 62),  
(14, 101), 
(14, 100),
(14, 50),  
(14, 19); 

INSERT INTO song_playlists (playlist_id, song_id) VALUES
(15, 34), 
(15, 31), 
(15, 24),  
(15, 25),  
(15, 26),  
(15, 61); 

INSERT INTO song_playlists (playlist_id, song_id) VALUES
(16, 20),  
(16, 21),  
(16, 22),  
(16, 23),  
(16, 27),  
(16, 24);  

INSERT INTO song_playlists (playlist_id, song_id) VALUES
(17, 40),  
(17, 41), 
(17, 53),  
(17, 61),  
(17, 46),  
(17, 57);  

INSERT INTO song_playlists (playlist_id, song_id) VALUES
(18, 9),   
(18, 45),  
(18, 25),  
(18, 26), 
(18, 34),  
(18, 119); 

INSERT INTO song_playlists (playlist_id, song_id) VALUES
(19, 100), 
(19, 101), 
(19, 4),  
(19, 5),  
(19, 20), 
(19, 31); 

INSERT INTO song_playlists (playlist_id, song_id) VALUES
(20, 11), 
(20, 12),  
(20, 90),
(20, 91),  
(20, 62), 
(20, 60); 

INSERT INTO song_playlists (playlist_id, song_id) VALUES
(21, 73),  
(21, 78),  
(21, 50), 
(21, 4),  
(21, 5),   
(21, 80);  

INSERT INTO song_playlists (playlist_id, song_id) VALUES
(22, 100), 
(22, 101), 
(22, 4),
(22, 5),   
(22, 20),  
(22, 21);  
