-- sample data for skills system

-- Inserting data into candidate table
INSERT INTO Candidate (email, name, university, password, degree, gradYear) 
VALUES 
	('charmaineleung@unsw.edu.au', 'Charmaine Leung', 'UNSW', 'charmaine', 'Computer Science', 2021),
	('mirannakamura@usyd.edu.au', 'Miran Nakamura', 'USYD', 'miran', 'Computer Science', 2021);
	--('alexgu@uts.edu.au', 'Alex Gu', 'UTS', 'alex'

-- Inserting data in ePortfolioLink table
INSERT INTO ePortfolioLink (link)
VALUES
	('link1'),
	('link2');
	--('link3');

-- Inserting data into Employer table
INSERT INTO Employer (email, name, graduateCriteria, password, company)
VALUES
	('macquariegroup@gmail.com', 'Macquarie HR Rep', 'smart', 'password', 'Macquarie Group'),
	('google@gmail.com', 'Google', 'Google HR Rep', 'password', 'Google');
	--('atlassian@gmail.com', 'Atlassian', 'leadership', 'C++', 'atlassian')

-- Inserting data into CourseAdmin table
INSERT INTO CourseAdmin (name, email, university, password)
VALUES
	('courseadmin1', 'courseadmin1@unsw.edu.au', 'UNSW', 'password'),
	('courseadmin2', 'courseadmin2@usyd.edu.au', 'USYD', 'password');

-- Inserting data into SkillsBackpackAdmin table
INSERT INTO SkillsBackpackAdmin (name, email, password)
VALUES
	('sbadmin1', 'sbadmin1@gmail.com', 'sbadmin1'),
	('sbadmin2', 'sbadmin2@gmail.com', 'sbadmin2');

-- Inserting data into Course table
INSERT INTO Course (code, university, faculty, description, name, link, courseAdminEmail)
VALUES
	('COMP3900', 'UNSW', 'Computer Science and Engineering', 'build a project in a team', 'Computer Science Project', 'COMP3900.com', 'courseadmin1@unsw.edu.au'),
	('COMP1000', 'USYD', 'Computer Science', 'hack the system', 'Hackerman 101', 'COMP1000.com', 'courseadmin2@usyd.edu.au'),
	('COMP6969', 'UNSW', 'Computer Science and Engineering', 'hehexd', 'Funny course', 'COMP6969.com', 'courseadmin1@unsw.edu.au'),
	('COMP4200', 'USYD', 'Computer Science', 'desc', 'mow the lawn', 'COMP4200.com', 'courseadmin2@usyd.edu.au');
	

-- Inserting data into LearningOutcomes table
INSERT INTO LearningOutcomes(l_outcome)
VALUES
	('hacking'),
	('coding'),
	('meming'),
	('teeming');

-- Inserting data into GraduateOutcomes table
INSERT INTO GraduateOutcomes(g_outcome, university)
VALUES
	('teamwork', 'UNSW'),
	('leadership', 'USYD'),
	('meming', 'UNSW'),
	('teeming', 'USYD');

-- Inserting data into Employment table
INSERT INTO Employment(id, job_title, candidate_email, description, startDate, endDate, employer)
VALUES
	(1, 'Full stack developer', 'charmaineleung@unsw.edu.au', 'software development', '01/01/2020', '02/01/2020', 'Macquarie Group'),
	(2, 'Security Analyst', 'mirannakamura@usyd.edu.au', 'hacking', '01/01/2020', '02/01/2020', 'Google'),
	(3, 'Meme page manager', 'charmaineleung@unsw.edu.au', 'meme making', '05/06/2020', '06/06/2020', 'Meme lords'),
	(4, 'Valorant pro', 'mirannakamura@usyd.edu.au', 'clicking on heads', '06/07/2020', '07/07/2020', 'Riot games');

-- Inserting data into Course_LearnOutcomes table
INSERT INTO Course_LearnOutcomes(l_outcome, code, university)
VALUES
	(1, 'COMP1000', 'USYD'),
	(1, 'COMP3900', 'UNSW'),
	(2, 'COMP3900', 'UNSW'),
	(3, 'COMP6969', 'UNSW'),
	(4, 'COMP6969', 'UNSW'),
	(2, 'COMP1000', 'USYD'),
	(2, 'COMP4200', 'USYD'),
	(3, 'COMP4200', 'USYD');

-- Inserting data into Course_GradOutcomes table
INSERT INTO Course_GradOutcomes(g_outcome, code, university)
VALUES
	(1, 'COMP3900', 'UNSW'),
	(2, 'COMP1000', 'USYD'),
	(2, 'COMP4200', 'USYD'),
	(4, 'COMP4200', 'USYD'),
	(3, 'COMP6969', 'UNSW'),
	(1, 'COMP6969', 'UNSW');

-- Inserting data into ePortfolio_courses table
INSERT INTO ePortfolio_Courses (EP_ID, code, university)
VALUES
	('charmaineleung@unsw.edu.au', 'COMP3900', 'UNSW'),
	('mirannakamura@usyd.edu.au', 'COMP1000', 'USYD'),
	('charmaineleung@unsw.edu.au', 'COMP6969', 'UNSW'),
	('mirannakamura@usyd.edu.au', 'COMP4200', 'USYD');


-- Inserting data into Candidate_Links table
INSERT INTO Candidate_Links (link, email)
VALUES
	('link1', 'charmaineleung@unsw.edu.au'),
	('link2', 'mirannakamura@usyd.edu.au');

INSERT INTO Skill (id, name)
VALUES
	(1, 'Python'),
	(2, 'C Programming'),
	(3, 'Java'),
	(4, 'MIPS');

INSERT INTO Employer_Skill (employer, skillID)
VALUES
	('macquariegroup@gmail.com', 1),
	('google@gmail.com', 2);

INSERT INTO ePortfolio_Skill (candidate, skillID)
VALUES
	('charmaineleung@unsw.edu.au', 1),
	('mirannakamura@usyd.edu.au', 2),
	('charmaineleung@unsw.edu.au', 3),
	('mirannakamura@usyd.edu.au', 4);
