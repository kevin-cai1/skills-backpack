-- sql file for database schema

-- Create candidate table
-- Stores candidate login information and their university (which should be derived from their email)
CREATE TABLE Candidate (
	email TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	university TEXT,
	password TEXT NOT NULL
);

-- Create ePortfolioLink table
-- Stores every EP link as a string 
CREATE TABLE ePortfolioLink (
	link TEXT PRIMARY KEY
);

-- Create Employer table
-- Stores Employer login info and their graduate and skills criteria
CREATE TABLE Employer (
	email TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	graduateCriteria TEXT,
	skillsCriteria TEXT,
	password TEXT NOT NULL
);

-- Create CourseAdmin table
-- Contains login info for course admins and their associated university (derived from email)
CREATE TABLE CourseAdmin (
	email TEXT PRIMARY KEY,
	university TEXT NOT NULL,
	password TEXT NOT NULL
);

-- Create SkillsBackpackAdmin table
-- Contains login info for skills backpack admin
CREATE TABLE SkillsBackpackAdmin (
	email TEXT PRIMARY KEY,
	password TEXT
);

-- Create Course table
-- Contains info about each registered course
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
CREATE TABLE ePortfolio (
	name TEXT PRIMARY KEY,
	employabilitySkills TEXT, 
	jobSkills TEXT,
	FOREIGN KEY (name)
		REFERENCES Candidate (name)
			ON DELETE CASCADE
			ON UPDATE CASCADE
);

-- Create Employment table
-- Represents an instance of past employment done by a candidate
CREATE TABLE Employment (
	id INTEGER PRIMARY KEY,
	description TEXT,
	startDate TEXT NOT NULL,
	endDate TEXT NOT NULL,
	employer TEXT NOT NULL
);

-- Create Employment_ePortfolio table
-- Maps each EP to each instance of past employment info
CREATE TABLE Employment_ePortfolio (
	employmentId INTEGER NOT NULL,
	portfolioName TEXT NOT NULL,
	PRIMARY KEY (employmentId, portfolioName),
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
