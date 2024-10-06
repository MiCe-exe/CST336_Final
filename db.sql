-- Create the user table with ENUM for position
CREATE TABLE user (
    username VARCHAR(255) PRIMARY KEY,
    pwd VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    profession VARCHAR(255),
    summary TEXT,
    position ENUM('recruiter', 'applicant') NOT NULL
);

-- Create the accnt_info table with ENUM for job_status
CREATE TABLE accnt_info (
    saved_jobs TEXT,
    job_status ENUM('applied', 'interviewed', 'received offer') NOT NULL
);

-- Create the job_posting table with ENUM for job_status
CREATE TABLE job_posting (
    applicants TEXT,
    job_status ENUM('accepting applications', 'position filled') NOT NULL
);

Select * FROM accnt_info;

SELECT * FROM user;

ALTER TABLE accnt_info ADD userID varchar(255);
ALTER TABLE accnt_info add id INT PRIMARY KEY AUTO_INCREMENT;

-- Prepopulate tables
INSERT INTO `user` (`username`, `pwd`, `email`, `profession`, `summary`, `position`) VALUES
("Coder_Dave", "123mypw123", "fake_email@gmail.com", "Software Engineer", "Working at some company for 10 years.... blah blah blah", "applicant"),
("Coder_Jane", "123mypw123", "fake_email@gmail.com", "Software Engineer", "Working at some company for 10 years.... blah blah blah", "applicant"),
("Coder_Joe", "123mypw123", "fake_email@gmail.com", "Software Engineer", "Working at some company for 10 years.... blah blah blah", "applicant"),
("FullStack_Dev_Mike", "123mypw123", "fake_email@gmail.com", "Fullstack Engineer", "Working at some company for 10 years.... blah blah blah", "applicant"),
("FullStack_Dev_Linda", "123mypw123", "fake_email@gmail.com", "Fullstack Engineer", "Working at some company for 10 years.... blah blah blah", "applicant"),
("Go_Dev_James", "123mypw123", "fake_email@gmail.com", "Software Engineer", "Working at some company for 10 years.... blah blah blah", "applicant"),
("Juan_GO_Dev", "123mypw123", "fake_email@gmail.com", "Software Engineer", "Working at some company for 10 years.... blah blah blah", "applicant"),
("FrontEnd_Dev_Amber", "123mypw123", "fake_email@gmail.com", "Fullstack Engineer", "Working at some company for 10 years.... blah blah blah", "applicant"),
("Coder_Sam", "123mypw123", "fake_email@gmail.com", "Software Engineer", "Working at some company for 10 years.... blah blah blah", "applicant"),
("TS_Dev_Michael", "123mypw123", "fake_email@gmail.com", "Fullstack Engineer", "Working at some company for 10 years.... blah blah blah", "applicant"),
("Angular_Dev_Richard", "123mypw123", "fake_email@gmail.com", "Fullstack Engineer", "Working at some company for 10 years.... blah blah blah", "applicant"),
("Coder_Henry", "123mypw123", "fake_email@gmail.com", "Software Engineer", "Working at some company for 10 years.... blah blah blah", "applicant"),
("Coder_Matt", "123mypw123", "fake_email@gmail.com", "Software Engineer", "Working at some company for 10 years.... blah blah blah", "applicant"),
("Coder_Emily", "123mypw123", "fake_email@gmail.com", "Software Engineer", "Working at some company for 10 years.... blah blah blah", "applicant"),
("Coder_Ashley", "123mypw123", "fake_email@gmail.com", "Software Engineer", "Working at some company for 10 years.... blah blah blah", "applicant"),
("Microsoft", "123mypw123", "fake_email@gmail.com", "Recruiter", "Expanding the MS model", "recruiter"),
("Google", "123mypw123", "fake_email@gmail.com", "Recruiter", "Buidling our company one bloack at a time", "recruiter"),
("US Federal Gov", "123mypw123", "fake_email@gmail.com", "Recruiter", "Looking for the best!", "recruiter");

-- alter tables to reflect fav table
ALTER TABLE accnt_info DROP COLUMN saved_jobs;
ALTER TABLE accnt_info DROP COLUMN comapny;
ALTER TABLE accnt_info DROP COLUMN userID;

ALTER TABLE accnt_info ADD COLUMN `job_title` VARCHAR(255) AFTER `id`;
ALTER TABLE accnt_info ADD COLUMN `company` VARCHAR(255) AFTER `location`;
ALTER TABLE accnt_info ADD COLUMN `location` VARCHAR(255) AFTER `id`;
ALTER TABLE accnt_info ADD COLUMN `posted_date` VARCHAR(255) AFTER `id`;
ALTER TABLE accnt_info ADD COLUMN `url` VARCHAR(255) AFTER `id`;
ALTER TABLE accnt_info ADD COLUMN `username` varchar(255) AFTER `id`;

-- test if query works with added information
SELECT `job_status`, `username`, `url`, `posted_date`, `location`, `company`, `job_title` FROM accnt_info
NATURAL JOIN user
WHERE username LIKE Coder_Dave;

-- Prepopulate tables
insert into `accnt_info` (`job_status`, `username`, `url`, `posted_date`, `location`, `company`, `job_title`) VALUES
("Applied", "Coder_Dave", "https://google.com", "12-13-2003", "Los Angeles", "Tech Guru", ".NET Angular Dev"),
("Applied", "Coder_Dave", "https://google.com", "12-13-2003", "Los Angeles", "Tech Guru", ".NET Angular Dev"),
("Applied", "Coder_Dave", "https://google.com", "12-13-2003", "Los Angeles", "Tech Guru", ".NET Angular Dev");