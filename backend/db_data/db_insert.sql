-- sample data for skills system

-- Inserting data into candidate table
INSERT INTO Candidate (email, name, university, password) 
VALUES 
	('charmaineleung@unsw.edu.au', 'Charmaine Leung', 'UNSW', 'charmaine'),
	('mirannakamura@usyd.edu.au', 'Miran Nakamura', 'USYD', 'miran');
	--('alexgu@uts.edu.au', 'Alex Gu', 'UTS', 'alex'

-- Inserting data in ePortfolioLink table
INSERT INTO ePortfolioLink (link)
VALUES
	('link1'),
	('link2');
	--('link3');

-- Inserting data into Employer table
INSERT INTO Employer (email, name, graduateCriteria, skillsCriteria, password)
VALUES
	('macquariegroup@gmail.com', 'Macquarie Group', 'smart', 'python', 'macquariegroup'),
	('google@gmail.com', 'Google', 'teamwork', 'C', 'google');
	--('atlassian@gmail.com', 'Atlassian', 'leadership', 'C++', 'atlassian')

-- Inserting data into CourseAdmin table
INSERT INTO CourseAdmin (email, university, password)
VALUES
	('courseadmin1@unsw.edu.au', 'UNSW', 'courseadmin1'),
	('courseadmin2@usyd.edu.au', 'USYD', 'courseadmin2');

-- Inserting data into SkillsBackpackAdmin table
INSERT INTO SkillsBackpackAdmin (email, password)
VALUES
	('sbadmin1@gmail.com', 'sbadmin1'),
	('sbadmin2@gmail.com', 'sbadmin2');

-- Inserting data into Course table
INSERT INTO Course (code, learningOutcomes, university, faculty, gradOutcomes, description, name, link)
VALUES
	('COMP3900', 'coding', 'UNSW', 'Computer Science and Engineering', 'smart', 'build a project in a team', 'Computer Science Project', 'COMP3900.com'),
	('COMP1000', 'hacking', 'USYD', 'Computer Science', 'teamwork', 'hack the system', 'Hackerman 101', 'COMP1000.com');

-- Inserting data into ePortfolio table
INSERT INTO ePortfolio(name, employabilitySkills, jobSkills)
VALUES
	('Charmaine Leung', 'yuppy', 'yuppy'),
	('Miran Nakamura', 'guppy', 'guppy');

-- Inserting data into Employment table
INSERT INTO Employment(id, description, startDate, endDate, employer)
VALUES
	(1, 'software development', '01/01/2020', '02/01/2020', 'Macquarie Group'),
	(2, 'hacking', '01/01/2020', '02/01/2020', 'Google');

-- Inserting data into Employment_ePortfolio table
INSERT INTO Employment_ePortfolio(employmentId, portfolioName)
VALUES
	('1', 'Charmaine Leung'),
	('2', 'Miran Nakamura');

-- Inserting data into ePortfolio_courses table
INSERT INTO ePortfolio_Courses (name, code, university)
VALUES
	('Charmaine Leung', 'COMP3900', 'UNSW'),
	('Miran Nakamura', 'COMP1000', 'USYD');

-- Inserting data into Candidate_Links table
INSERT INTO Candidate_Links (link, email)
VALUES
	('link1', 'charmaineleung@unsw.edu.au'),
	('link2', 'mirannakamura@usyd.edu.au');

-- Inserting data into Course_CourseAdmin table
INSERT INTO Course_CourseAdmin (email, code, university)
VALUES
	('courseadmin1@unsw.edu.au', 'COMP3900', 'UNSW'),
	('courseadmin2@usyd.edu.au', 'COMP1000', 'USYD');
