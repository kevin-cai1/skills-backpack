-- sql file for database schema

-- Create candidate table
-- Stores candidate login information and their university (which should be derived from their email)
DROP TABLE IF EXISTS Candidate;
CREATE TABLE Candidate (
	email TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	university TEXT,
	password TEXT NOT NULL,
	degree TEXT,
	gradYear INTEGER
);

-- Create ePortfolioLink table
-- Stores every EP link as a string 
DROP TABLE IF EXISTS ePortfolioLink;
CREATE TABLE ePortfolioLink (
	link TEXT PRIMARY KEY
);

-- Create Employer table
-- Stores Employer login info and their graduate and skills criteria
DROP TABLE IF EXISTS Employer;
CREATE TABLE Employer (
	email TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	graduateCriteria TEXT,
	skillsCriteria TEXT,
	password TEXT NOT NULL,
	company TEXT NOT NULL
);

-- Create CourseAdmin table
-- Contains login info for course admins and their associated university (derived from email)
DROP TABLE IF EXISTS CourseAdmin;
CREATE TABLE CourseAdmin (
	name TEXT NOT NULL,
	email TEXT PRIMARY KEY,
	university TEXT NOT NULL,
	password TEXT NOT NULL
);

-- Create SkillsBackpackAdmin table
-- Contains login info for skills backpack admin
DROP TABLE IF EXISTS SkillsBackpackAdmin;
CREATE TABLE SkillsBackpackAdmin (
	name TEXT,
	email TEXT PRIMARY KEY,
	password TEXT
);

-- Create Course table
-- Contains info about each registered course
DROP TABLE IF EXISTS Course;
CREATE TABLE Course (
	code TEXT NOT NULL,
	learningOutcomes TEXT,
	university TEXT NOT NULL,
	faculty TEXT NOT NULL,
	gradOutcomes TEXT,
	description TEXT,
	name TEXT NOT NULL,
	PRIMARY KEY (code, university)
);

-- Create ePortfolio table
-- Contains info regarding each EP, mapping the name to the name of the candidate who created it
DROP TABLE IF EXISTS ePortfolio;
CREATE TABLE ePortfolio (
	id INTEGER PRIMARY KEY,
	email TEXT,
	employabilitySkills TEXT, 
	jobSkills TEXT,
	FOREIGN KEY (email)
		REFERENCES Candidate (email)
			ON DELETE CASCADE
			ON UPDATE CASCADE
);

-- Create Employment table
-- Represents an instance of past employment done by a candidate
DROP TABLE IF EXISTS Employment;
CREATE TABLE Employment (
	id INTEGER PRIMARY KEY,
	description TEXT,
	startDate TEXT NOT NULL,
	endDate TEXT NOT NULL,
	employer TEXT NOT NULL
);

-- Create Employment_ePortfolio table
-- Maps each EP to each instance of past employment info
DROP TABLE IF EXISTS Employment_ePortfolio;
CREATE TABLE Employment_ePortfolio (
	employmentId INTEGER NOT NULL,
	portfolioName TEXT NOT NULL,
	FOREIGN KEY (employmentId)
		REFERENCES Employment (id)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
	FOREIGN KEY (portfolioName)
		REFERENCES ePortfolio (name)
			ON DELETE CASCADE
			ON UPDATE CASCADE
);


-- Create ePortfolio_Courses table
-- Maps each EP to each completed course included in it
DROP TABLE IF EXISTS ePortfolio_Courses;
CREATE TABLE ePortfolio_Courses (
	name TEXT NOT NULL,
	code TEXT NOT NULL,
	university TEXT NOT NULL,
	FOREIGN KEY (name)
		REFERENCES ePortfolio (name)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
	FOREIGN KEY (code, university)
		REFERENCES Course (code, university)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
	PRIMARY KEY (name, code, university)
);


-- Create Candidate_Links table
-- Maps each link to the candidate that generated it
DROP TABLE IF EXISTS Candidate_Links;
CREATE TABLE Candidate_Links (
	link TEXT NOT NULL,
	email TEXT NOT NULL,
	FOREIGN KEY (link)
		REFERENCES Candidate (email)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
	FOREIGN KEY (email)
		REFERENCES ePortfolioLink (link)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
	PRIMARY KEY (link, email)
);

-- Create Course_CourseAdmin table
-- Maps each course to the course admin who submitted it
DROP TABLE IF EXISTS Course_CourseAdmin;
CREATE TABLE Course_CourseAdmin (
	email TEXT NOT NULL,
	code TEXT NOT NULL,
	university TEXT NOT NULL,
	FOREIGN KEY (email)
		REFERENCES CourseAdmin (email)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
	FOREIGN KEY (code, university)
		REFERENCES Course (code, university)
			ON DELETE CASCADE
			ON UPDATE CASCADE
);
