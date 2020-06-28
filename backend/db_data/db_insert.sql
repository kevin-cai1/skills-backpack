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
INSERT INTO Employer (email, name, graduateCriteria, skillsCriteria, password, company)
VALUES
	('macquariegroup@gmail.com', 'Macquarie HR Rep', 'smart', 'python', 'password', 'Macquarie Group'),
	('google@gmail.com', 'Google', 'Google HR Rep', 'C', 'password', 'Google');
	--('atlassian@gmail.com', 'Atlassian', 'leadership', 'C++', 'atlassian')

-- Inserting data into CourseAdmin table
INSERT INTO CourseAdmin (name, email, university, password)
VALUES
	('courseadmin1', 'courseadmin1@unsw.edu.au', 'UNSW', 'password'),
	('courseadmin2', 'courseadmin2@usyd.edu.au', 'USYD', 'password');

-- Inserting data into SkillsBackpackAdmin table
INSERT INTO SkillsBackpackAdmin (email, password)
VALUES
	('sbadmin1@gmail.com', 'sbadmin1'),
	('sbadmin2@gmail.com', 'sbadmin2');

-- Inserting data into Course table
INSERT INTO Course (code, university, faculty, description, name, link)
VALUES
	('COMP3900', 'UNSW', 'Computer Science and Engineering', 'build a project in a team', 'Computer Science Project', 'COMP3900.com'),
	('COMP1000', 'USYD', 'Computer Science', 'hack the system', 'Hackerman 101', 'COMP1000.com');

-- Inserting data into LearningOutcomes table
INSERT INTO LearningOutcomes(l_outcome)
VALUES
	('hacking'),
	('coding');

-- Inserting data into GraduateOutcomes table
INSERT INTO GraduateOutcomes(g_outcome)
VALUES
	('teamwork'),
	('leadership');

-- Inserting data into ePortfolio table
INSERT INTO ePortfolio(id, employabilitySkills, jobSkills)
VALUES
	(1, 'yuppy', 'yuppy'),
	(2, 'guppy', 'guppy');

-- Inserting data into Employment table
INSERT INTO Employment(id, description, startDate, endDate, employer)
VALUES
	(1, 'software development', '01/01/2020', '02/01/2020', 'Macquarie Group'),
	(2, 'hacking', '01/01/2020', '02/01/2020', 'Google');

-- Inserting data into Course_LearnOutcomes table
INSERT INTO Course_LearnOutcomes(l_outcome, code, university)
VALUES
	('hacking', 'COMP1000', 'USYD'),
	('hacking', 'COMP3900', 'UNSW'),
	('coding', 'COMP3900', 'UNSW');

-- Inserting data into Course_GradOutcomes table
INSERT INTO Course_GradOutcomes(g_outcome, code, university)
VALUES
	('teamwork', 'COMP3900', 'UNSW'),
	('leadership', 'COMP3900', 'UNSW'),
	('teamwork', 'COMP1000', 'USYD');

-- Inserting data into Employment_ePortfolio table
INSERT INTO Employment_ePortfolio(employmentId, portfolioName)
VALUES
	(1, 'Charmaine Leung'),
	(2, 'Miran Nakamura');

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

-- Inserting data into Candidate_ePortfolio table
INSERT INTO Candidate_ePortfolio (id, email)
VALUES
	(1, 'charmaineleung@unsw.edu.au'),
	(2, 'mirannakamura@usyd.edu.au');
