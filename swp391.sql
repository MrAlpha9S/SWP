USE master;
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'SWP391')
BEGIN
    ALTER DATABASE SWP391 SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE SWP391;
END
GO

CREATE DATABASE SWP391
GO
USE SWP391
GO

CREATE TABLE [users] (
  [user_id] int PRIMARY KEY IDENTITY(1, 1),
  [auth0_id] varchar(255) UNIQUE NOT NULL,
  [username] nvarchar(100),
  [email] varchar(255),
  [role] nvarchar(50) DEFAULT ('Member'),
  [created_at] datetime DEFAULT (CURRENT_TIMESTAMP),
  [sub_id] int DEFAULT (1),
  [vip_end_date] datetime DEFAULT (null),
  [isBanned] int DEFAULT (0)
)
GO

CREATE TABLE [subcriptions] (
  [sub_id] int PRIMARY KEY IDENTITY(1, 1),
  [sub_type] varchar(50),
  [duration] int,
  [price] float
)
GO

CREATE TABLE [user_profiles] (
  [profile_id] int PRIMARY KEY IDENTITY(1, 1),
  [user_id] int,
  [readiness_value] varchar(20),
  [start_date] datetime,
  [quit_date] datetime,
  [expected_quit_date] datetime,
  [cigs_per_day] int,
  [cigs_per_pack] int,
  [price_per_pack] decimal(10,2),
  [time_after_waking] varchar(30),
  [quitting_method] varchar(20),
  [cigs_reduced] int,
  [custom_time_of_day] nvarchar(100),
  [custom_trigger] nvarchar(100),
  [created_at] datetime default (CURRENT_TIMESTAMP),
  [updated_at] datetime,
  [is_public] bit default (1),
)
GO

CREATE TABLE [checkin_log] (
  [log_id] int PRIMARY KEY IDENTITY(1, 1),
  [user_id] int,
  [feeling] nvarchar(10),
  [logged_at] datetime default (CURRENT_TIMESTAMP),
  [cigs_smoked] int,
  [isFreeText] bit default(1) ,
)

ALTER TABLE [checkin_log] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

CREATE TABLE [qna] (
  [qna_id] int PRIMARY KEY IDENTITY(1, 1),
  [user_id] int,
  [qna_question] varchar(30),
  [qna_answer] nvarchar(max),
)

ALTER TABLE [qna] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

CREATE TABLE [free_text] (
  [free_text_id] int PRIMARY KEY IDENTITY(1, 1),
  [user_id] int,
  [free_text_content] nvarchar(max)
)

ALTER TABLE [free_text] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

CREATE TABLE [quittingItems] (
  [item_id] int PRIMARY KEY IDENTITY(1, 1),
  [item_name] nvarchar(30)
)

CREATE TABLE [journal_quit] (
  [item_id] int,
  [log_id] int,
  PRIMARY KEY ([item_id], [log_id])
)

ALTER TABLE [journal_quit] ADD FOREIGN KEY ([item_id]) REFERENCES [quittingItems] ([item_id])
ALTER TABLE [journal_quit] ADD FOREIGN KEY ([log_id]) REFERENCES [checkin_log] ([log_id])
GO

CREATE TABLE [goals] (
  [goal_id] int PRIMARY KEY IDENTITY(1, 1),
  [goal_name] nvarchar(50),
  [goal_amount] float,
  [profile_id] int
)
GO


CREATE TABLE [plan_log] (
  [plan_id] int PRIMARY KEY IDENTITY(1, 1),
  [profile_id] int,
  [date] datetime,
  [num_of_cigs] int
)
GO

CREATE TABLE [time_profile] (
  [profile_id] int,
  [time_value] varchar(30),
  PRIMARY KEY ([profile_id], [time_value])
)
GO

CREATE TABLE [triggers_profiles] (
  [profile_id] int,
  [trigger_value] varchar(30),
  PRIMARY KEY ([trigger_value], [profile_id])
)
GO

CREATE TABLE [profiles_reasons] (
  [profile_id] int,
  [reason_value] varchar(30),
  PRIMARY KEY ([profile_id], [reason_value])
)
GO

select * from profiles_reasons

CREATE TABLE [user_progresses] (
  [progress_id] int PRIMARY KEY IDENTITY(1, 1),
  [user_id] int,
  [cigs_per_day] int,
  [money_saved] decimal(5,2),
  [logged_at] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [progress_benefit] (
  [progress_id] int,
  [benefit_id] int,
  [current_percentage] decimal(5,2),
  PRIMARY KEY ([progress_id], [benefit_id])
)
GO

CREATE TABLE [health_benefits] (
  [benefit_id] int PRIMARY KEY IDENTITY(1, 1),
  [benefit_name] nvarchar(100),
  [time_length] time,
  [description] nvarchar(250)
)
GO

CREATE TABLE [user_achievements] (
  [user_id] int,
  [achievement_id] int,
  [achieved_at] datetime DEFAULT (CURRENT_TIMESTAMP),
  PRIMARY KEY ([user_id], [achievement_id])
)
GO

CREATE TABLE [achievements] (
  [achievement_id] int PRIMARY KEY IDENTITY(1, 1),
  [achievement_name] nvarchar(250),
  [criteria] nvarchar(max)
)
GO

CREATE TABLE [feedbacks] (
  [feedback_id] int PRIMARY KEY IDENTITY(1, 1),
  [user_id] int,
  [title] nvarchar(250),
  [content] nvarchar(250),
  [rating] int,
  [created_at] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [blog_posts] (
  [blog_id] int PRIMARY KEY IDENTITY(1, 1),
  [title] nvarchar(255),
  [content] nvarchar(max),
  [user_id] int,
  [created_at] datetime DEFAULT (CURRENT_TIMESTAMP),
  [isPendingForApprovement] int DEFAULT (1)
)
GO

CREATE TABLE [social_posts] (
  [post_id] int PRIMARY KEY IDENTITY(1, 1),
  [user_id] int,
  [title] nvarchar(max),
  [content] nvarchar(max),
  [created_at] datetime DEFAULT (CURRENT_TIMESTAMP),
  [is_reported] int DEFAULT (0),
  [likes] int DEFAULT (0),
  [comments] int DEFAULT (0),
  [is_liked] bit DEFAULT (0)
)
GO

CREATE TABLE [social_comments] (
  [comment_id] int PRIMARY KEY IDENTITY(1, 1),
  [parent_comment_id] int,
  [user_id] int,
  [post_id] int,
  [content] nvarchar(max),
  [created_at] datetime DEFAULT (CURRENT_TIMESTAMP),
  [is_reported] int DEFAULT (0),
  [likes] int DEFAULT (0),
  [comments] int DEFAULT (0),
  [is_liked] bit DEFAULT (0)
)
GO

CREATE TABLE [social_likes] (
  [like_id] INT PRIMARY KEY IDENTITY(1,1),
  [user_id] INT,
  [post_id] INT NULL,
  [comment_id] INT NULL,
  [created_at] DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE [social_reports] (
  [report_id] INT PRIMARY KEY IDENTITY(1,1),
  [user_id] INT,
  [post_id] INT NULL,
  [comment_id] INT NULL,
  [reason] NVARCHAR(MAX),
  [created_at] DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE [conversations] (
  [conversation_id] int PRIMARY KEY IDENTITY(1, 1),
  [conversation_name] nvarchar(50),
  [created_at] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [messages] (
  [message_id] int PRIMARY KEY IDENTITY(1, 1),
  [conversation_id] int,
  [user_id] int,
  [content] nvarchar(max),
  [created_at] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [user_conversation] (
  [conversation_id] int,
  [user_id] int,
  PRIMARY KEY ([conversation_id], [user_id])
)
GO


ALTER TABLE [users] ADD FOREIGN KEY ([sub_id]) REFERENCES [subcriptions] ([sub_id])
GO

ALTER TABLE [user_achievements] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

ALTER TABLE [user_profiles] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

ALTER TABLE [user_progresses] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

ALTER TABLE [user_achievements] ADD FOREIGN KEY ([achievement_id]) REFERENCES [achievements] ([achievement_id])
GO

ALTER TABLE [feedbacks] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

ALTER TABLE [blog_posts] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

ALTER TABLE [social_posts] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

ALTER TABLE [social_comments] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

ALTER TABLE [social_comments] ADD FOREIGN KEY ([parent_comment_id]) REFERENCES [social_comments] ([comment_id])
GO

ALTER TABLE [social_comments] ADD FOREIGN KEY ([post_id]) REFERENCES [social_posts] ([post_id])
GO

ALTER TABLE [messages] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

ALTER TABLE [progress_benefit] ADD FOREIGN KEY ([progress_id]) REFERENCES [user_progresses] ([progress_id])
GO

ALTER TABLE [progress_benefit] ADD FOREIGN KEY ([benefit_id]) REFERENCES [health_benefits] ([benefit_id])
GO

ALTER TABLE [messages] ADD FOREIGN KEY ([conversation_id]) REFERENCES [conversations] ([conversation_id])
GO

ALTER TABLE [user_conversation] ADD FOREIGN KEY ([conversation_id]) REFERENCES [conversations] ([conversation_id])
GO

ALTER TABLE [user_conversation] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

ALTER TABLE [profiles_reasons] ADD FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id])
GO

ALTER TABLE [time_profile] ADD FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id])
GO

ALTER TABLE [triggers_profiles] ADD FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id])
GO

ALTER TABLE [plan_log] ADD FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id])
GO

ALTER TABLE [goals] ADD FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id])
GO

ALTER TABLE [social_posts] 
ADD FOREIGN KEY ([user_id]) REFERENCES [users]([user_id]);

ALTER TABLE [social_comments] 
ADD FOREIGN KEY ([user_id]) REFERENCES [users]([user_id]);

ALTER TABLE [social_comments] 
ADD FOREIGN KEY ([post_id]) REFERENCES [social_posts]([post_id]);

ALTER TABLE [social_comments] 
ADD FOREIGN KEY ([parent_comment_id]) REFERENCES [social_comments]([comment_id]);


--Sample subcription
INSERT INTO [subcriptions] ([sub_type], [duration], [price])
VALUES 
  ('Free', 0, 0.0),

  ('Premium - Monthly', 1, 9.99),
  ('Premium - Yearly', 12, 99.99),

  ('Pro - Monthly', 1, 19.99),
  ('Pro - Yearly', 12, 199.99);

--Sample user info
INSERT INTO [users] ([auth0_id], [username], [email])
VALUES 
('auth0|abc123', 'john_doe', 'john@example.com'),
('auth0|xyz789', 'jane_smith', 'jane@example.com'),
('auth0|lmn456', 'bob_lee', 'bob@example.com'),
('google-oauth2|105815855269571869013', N'Minh Thiện', 'ubw1212@gmail.com');

--Sample data for onboarding
INSERT INTO user_profiles (
    user_id, readiness_value, start_date, quit_date, expected_quit_date,
    cigs_per_day, cigs_per_pack, price_per_pack, time_after_waking, quitting_method,
    cigs_reduced, custom_time_of_day, custom_trigger, created_at, updated_at, is_public
) VALUES (
    4, 'ready', '2025-05-25 00:00:00', NULL, '2025-06-29 00:00:00',
    15, 15, 35000, 'within_5', 'gradual-weekly',
    3, N'Ngủ', N'Chơi game', '2025-06-08 15:54:59', '2025-06-08 16:03:56', 1
);

-- Reasons
INSERT INTO profiles_reasons (profile_id, reason_value) VALUES (1, 'cost');
INSERT INTO profiles_reasons (profile_id, reason_value) VALUES (1, 'health');
INSERT INTO profiles_reasons (profile_id, reason_value) VALUES (1, 'physical');
INSERT INTO profiles_reasons (profile_id, reason_value) VALUES (1, 'pregnancy');

-- Triggers
INSERT INTO triggers_profiles (profile_id, trigger_value) VALUES (1, 'around_smokers');
INSERT INTO triggers_profiles (profile_id, trigger_value) VALUES (1, 'other');
INSERT INTO triggers_profiles (profile_id, trigger_value) VALUES (1, 'self_reward');
INSERT INTO triggers_profiles (profile_id, trigger_value) VALUES (1, 'using_phone_computer');

-- Time of day
INSERT INTO time_profile (profile_id, time_value) VALUES (1, 'after_work');
INSERT INTO time_profile (profile_id, time_value) VALUES (1, 'before_dinner');
INSERT INTO time_profile (profile_id, time_value) VALUES (1, 'other');

-- Plan log
INSERT INTO plan_log (profile_id, date, num_of_cigs) VALUES (1, '2025-05-25 00:00:00', 15);
INSERT INTO plan_log (profile_id, date, num_of_cigs) VALUES (1, '2025-06-01 00:00:00', 12);
INSERT INTO plan_log (profile_id, date, num_of_cigs) VALUES (1, '2025-06-08 00:00:00', 9);
INSERT INTO plan_log (profile_id, date, num_of_cigs) VALUES (1, '2025-06-15 00:00:00', 6);
INSERT INTO plan_log (profile_id, date, num_of_cigs) VALUES (1, '2025-06-22 00:00:00', 3);
INSERT INTO plan_log (profile_id, date, num_of_cigs) VALUES (1, '2025-06-29 00:00:00', 0);

-- Goal
INSERT INTO goals (goal_name, goal_amount, profile_id) VALUES (N'Du lịch Đà Lạt', 3000000, 1);


SELECT * FROM users

SELECT * FROM user_profiles
select * from plan_log
select * from profiles_reasons
select * from goals
select * from triggers_profiles