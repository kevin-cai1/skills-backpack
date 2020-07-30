-- sample data for skills system

-- Inserting data into candidate table
INSERT INTO Candidate (email, name, university, password, degree, gradYear) 
VALUES 
	('charmaineleung@unsw.edu.au', 'Charmaine Leung', 'UNSW', 'password', 'Computer Science', 2021),
	('mirannakamura@usyd.edu.au', 'Miran Nakamura', 'USYD', 'password', 'Computer Science', 2021),
	('kevincai@unsw.edu.au', 'Kevin Cai', 'UNSW', 'password', 'Computer Science', 2020),
	('gordonxie@unsw.edu.au', 'Gordon Xie', 'UNSW', 'password', 'Computer Science', 2020),
	('alexgu@unsw.edu.au', 'Alex Gu', 'UNSW', 'password', 'Computer Science', 2020);
	--('alexgu@uts.edu.au', 'Alex Gu', 'UTS', 'alex'

-- Inserting data into Employer table
INSERT INTO Employer (email, name, password, company)
VALUES
	('gordon.xie2@gmail.com', 'Macquarie HR Rep', 'password', 'Macquarie Group'),
	('google@gmail.com', 'Google HR Rep', 'password', 'Google');
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
	('admin', 'skillsbackpack@gmail.com', 'password'),
	('sbadmin2', 'sbadmin2@gmail.com', 'sbadmin2');

-- Inserting data into Course table
INSERT INTO Course (code, university, faculty, description, name, link, courseAdminEmail)
VALUES
	('COMP3900', 'UNSW', 'Computer Science and Engineering', 'build a project in a team', 'Computer Science Project', 'COMP3900.com', 'courseadmin1@unsw.edu.au'),
	('COMP1000', 'USYD', 'Computer Science', 'hack the system', 'Hackerman 101', 'COMP1000.com', 'courseadmin2@usyd.edu.au'),
	('COMP1511', 'UNSW', 'Computer Science and Engineering', 'introduction to programming', 'Programming Fundamentals', 'COMP1511.com', 'courseadmin1@unsw.edu.au'),
	('COMP4200', 'USYD', 'Computer Science', 'Low level computing', 'Computer system fundamentals', 'COMP4200.com', 'courseadmin2@usyd.edu.au');
	

-- Inserting data into LearningOutcomes table
INSERT INTO LearningOutcomes(l_outcome)
VALUES
	('hacking'),
	('coding'),
	('object oriented programming'),
	('Python'),
	('SQL');

-- Inserting data into GraduateOutcomes table
INSERT INTO GraduateOutcomes(g_outcome, university)
VALUES
	('Scholars capable of independent and collaborative enquiry', 'UNSW'),
	('Scholars rigorous in their analysis', 'UNSW'),
	('Scholars able to innovate by applying their knowledge and skills to the solution of novel problems', 'UNSW'),
	('Scholars able to innovate by applying their knowledge and skills to the solution of routine problems', 'UNSW'),
	('Entrepreneurial leaders capable of initiating and embracing innovation and change', 'UNSW'),
	('Entrepreneurial leaders engaging and enabling others to contribute to change', 'UNSW'),
	('Professionals capable of ethical learning', 'UNSW'),
	('Professionals capable of self-directed practice', 'UNSW'),
	('Professionals capable of independent lifelong learning', 'UNSW'),
	('Global citizens who are culturally adept', 'UNSW'),
	('Global citizens who are capable of respecting diversity', 'UNSW'),
	('Global citizens who are capable of acting in a socially just and responsible way', 'UNSW'),
	('Depth of disciplinary expertise', 'USYD'),
	('Critical thinking and problem solving', 'USYD'),
	('Oral and written communication', 'USYD'),
	('Information and digital literacy', 'USYD'),
	('Generating novel ideas and solutions', 'USYD'),
	('Cultural competence', 'USYD'),
	('Interdisciplinary effectiveness', 'USYD'),
	('Integrated professional, ethical, and personal identity', 'USYD'),
	('Engaging others in a process, idea or vision', 'USYD');

-- Inserting data into Employment table
INSERT INTO Employment(id, job_title, candidate_email, description, startDate, endDate, employer)
VALUES
	(1, 'Full stack developer', 'charmaineleung@unsw.edu.au', 'software development', '01/01/2020', '02/01/2020', 'Macquarie Group'),
	(2, 'Security Analyst', 'mirannakamura@usyd.edu.au', 'hacking', '01/01/2020', '02/01/2020', 'Google');

-- Inserting data into Course_LearnOutcomes table
INSERT INTO Course_LearnOutcomes(l_outcome, code, university)
VALUES
	(1, 'COMP1000', 'USYD'),
	(2, 'COMP1511', 'UNSW'),
	(1, 'COMP3900', 'UNSW'),
	(2, 'COMP3900', 'UNSW'),
	(2, 'COMP1000', 'USYD'),
	(2, 'COMP4200', 'USYD'),
	(3, 'COMP4200', 'USYD');

-- Inserting data into Course_GradOutcomes table
INSERT INTO Course_GradOutcomes(g_outcome, code, university)
VALUES
	(1, 'COMP3900', 'UNSW'),
	(2, 'COMP1511', 'UNSW'),
	(12, 'COMP1000', 'USYD'),
	(14, 'COMP4200', 'USYD'),
	(16, 'COMP4200', 'USYD');

-- Inserting data into ePortfolio_courses table
INSERT INTO ePortfolio_Courses (EP_ID, code, university)
VALUES
	('charmaineleung@unsw.edu.au', 'COMP3900', 'UNSW'),
	('mirannakamura@usyd.edu.au', 'COMP1000', 'USYD'),
	('mirannakamura@usyd.edu.au', 'COMP4200', 'USYD');
--	('charmaineleung@unsw.edu.au', 'COMP1511', 'UNSW');


-- Inserting data into Candidate_Links table
INSERT INTO Candidate_Links (link, email, tag)
VALUES
	('DhcYTRw9sOW5S9kWCacw', 'charmaineleung@unsw.edu.au', 'CBA'),
	('2fTDuxArAR4G5Z1FEbJj', 'mirannakamura@usyd.edu.au', 'UNSW');

-- Inserting data into Skill table
INSERT INTO Skill (id, name)
VALUES
	(1, 'Python'),
	(2, 'C Programming'),
	(3, 'Java'),
	(4, 'MIPS');

-- Inserting data into employer_skill table
INSERT INTO Employer_Skill (employer, skillID)
VALUES
	('gordon.xie2@gmail.com', 1),
	('gordon.xie2@gmail.com', 2),
	('google@gmail.com', 2);

INSERT INTO ePortfolio_Skill (candidate, skillID)
VALUES
	('charmaineleung@unsw.edu.au', 1),
	('charmaineleung@unsw.edu.au', 2),
	('charmaineleung@unsw.edu.au', 3),
	('mirannakamura@usyd.edu.au', 2),
	('mirannakamura@usyd.edu.au', 3),
	('mirannakamura@usyd.edu.au', 4);

INSERT INTO Employer_GradOutcomes (employerEmail, gradOutcomeID)
VALUES
	('gordon.xie2@gmail.com', 1),
	('gordon.xie2@gmail.com', 2),
	('google@gmail.com', 3),
	('google@gmail.com', 4);

INSERT INTO LoginActivity (email, user_type, time)
VALUES
	('charmaineleung@unsw.edu.au', 'candidate', '21-07-2020'),
	('charmaineleung@unsw.edu.au', 'candidate', '22-07-2020'),
	('charmaineleung@unsw.edu.au', 'candidate', '23-07-2020'),
	('charmaineleung@unsw.edu.au', 'candidate', '24-07-2020'),
	('charmaineleung@unsw.edu.au', 'candidate', '25-07-2020'),
	('charmaineleung@unsw.edu.au', 'candidate', '26-07-2020'),
	('sbadmin1@gmail.com', 'skillsAdmin', '21-07-2020'),
	('sbadmin1@gmail.com', 'skillsAdmin', '23-07-2020'),
	('sbadmin1@gmail.com', 'skillsAdmin', '24-07-2020'),
	('sbadmin1@gmail.com', 'skillsAdmin', '26-07-2020'),
	('sbadmin2@gmail.com', 'skillsAdmin', '24-07-2020'),
	('sbadmin2@gmail.com', 'skillsAdmin', '26-07-2020');
