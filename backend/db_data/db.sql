-- sql file for database schema

-- Create candidate table
CREATE TABLE Candidate (
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
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

-- Create Course Admin table
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
	PRIMARY KEY(code, university)
);

-- Create ePortfolio table
CREATE TABLE ePortfolio(
	name TEXT PRIMARY KEY,
	employabilitySkills TEXT, 
	jobSkills TEXT
);

-- Create Employment table
CREATE TABLE Employment (
	id INTEGER PRIMARY KEY,
	description TEXT,
	startDate TEXT NOT NULL,
	endDate TEXT NOT NULL,
	employer TEXT NOT NULL,
);
