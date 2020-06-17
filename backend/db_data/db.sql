-- sql file for database schema

-- Create candidate table
CREATE TABLE Candidate (
	name TEXT NOT NULL,
	email TEXT PRIMARY KEY,
	university TEXT,
	password TEXT NOT NULL
);

-- Create ePortfolioLink table
CREATE TABLE ePortfolioLink (
	link TEXT PRIMARY KEY
);

-- Create Employer table
CREATE TABLE Employer (
	name TEXT NOT NULL,
	email TEXT PRIMARY KEY,
	graduateCriteria TEXT,
	skillsCriteria TEXT,
	password TEXT NOT NULL
);

-- Create CourseAdmin table
CREATE TABLE CourseAdmin (
	email TEXT PRIMARY KEY,
	university TEXT NOT NULL,
	password TEXT NOT NULL
);

-- Create SkillsBackpackAdmin table
CREATE TABLE SkillsBackpackAdmin (
	email TEXT PRIMARY KEY,
	password TEXT
);

-- Create Course table
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
CREATE TABLE ePortfolio (
	name TEXT PRIMARY KEY,
	employabilitySkills TEXT, 
	jobSkills TEXT,
	PRIMARY KEY (name),
	FOREIGN KEY (name)
		REFERENCES Candidate (name)
			ON DELETE CASCADE
			ON UPDATE CASCADE
);

-- Create Employment table
CREATE TABLE Employment (
	id INTEGER PRIMARY KEY,
	description TEXT,
	startDate TEXT NOT NULL,
	endDate TEXT NOT NULL,
	employer TEXT NOT NULL
);

-- Create Employment_ePortfolio table
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
			ON UPDATE CASCADE,
	PRIMARY KEY (employmentId, portfolioName)
);

-- Create ePortfolio_Courses table
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
