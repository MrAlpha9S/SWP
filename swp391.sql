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

CREATE TABLE [subcriptions] (
  [sub_id] int PRIMARY KEY IDENTITY(1, 1),
  [sub_type] varchar(50),
  [duration] int,
  [price] float
)
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
  [isBanned] int DEFAULT (0),
  FOREIGN KEY ([sub_id]) REFERENCES [subcriptions] ([sub_id])
)
GO

CREATE TABLE [achievements] (
  [achievement_id] int PRIMARY KEY IDENTITY(1, 1),
  [achievement_name] nvarchar(250),
  [criteria] nvarchar(max)
)
GO

CREATE TABLE [user_achievements] (
  [user_id] int,
  [achievement_id] int,
  [achieved_at] datetime DEFAULT (CURRENT_TIMESTAMP),
  PRIMARY KEY ([user_id], [achievement_id]),
  FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id]),
  FOREIGN KEY ([achievement_id]) REFERENCES [achievements] ([achievement_id])
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
  FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
)
GO

CREATE TABLE [journal_log] (
  [log_id] int PRIMARY KEY IDENTITY(1, 1),
  [user_id] int,
  [feeling] nvarchar(10),
  [created_at] datetime default (CURRENT_TIMESTAMP),
  [cigs_slipped] int,
  FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
)
GO

CREATE TABLE [goals] (
  [goal_id] int PRIMARY KEY IDENTITY(1, 1),
  [goal_name] nvarchar(50),
  [goal_amount] float,
  [profile_id] int,
  FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id])
)
GO

CREATE TABLE [plan_log] (
  [plan_id] int PRIMARY KEY IDENTITY(1, 1),
  [profile_id] int,
  [date] datetime,
  [num_of_cigs] int,
  FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id])
)
GO

CREATE TABLE [time_of_day] (
  [time_id] int PRIMARY KEY IDENTITY(1, 1),
  [content] varchar(30)
)
GO

CREATE TABLE [time_profile] (
  [profile_id] int,
  [time_id] int,
  PRIMARY KEY ([profile_id], [time_id]),
  FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id]),
  FOREIGN KEY ([time_id]) REFERENCES [time_of_day] ([time_id])
)
GO

CREATE TABLE [smoke_triggers] (
  [trigger_id] int PRIMARY KEY IDENTITY(1, 1),
  [trig_content] varchar(50)
)
GO

CREATE TABLE [triggers_profiles] (
  [trigger_id] int,
  [profile_id] int,
  PRIMARY KEY ([trigger_id], [profile_id]),
  FOREIGN KEY ([trigger_id]) REFERENCES [smoke_triggers] ([trigger_id]),
  FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id])
)
GO

CREATE TABLE [quit_reasons] (
  [reason_id] int PRIMARY KEY IDENTITY(1, 1),
  [reason] nvarchar(250)
)
GO

CREATE TABLE [profiles_reasons] (
  [profile_id] int,
  [reason_id] int,
  PRIMARY KEY ([profile_id], [reason_id]),
  FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id]),
  FOREIGN KEY ([reason_id]) REFERENCES [quit_reasons] ([reason_id])
)
GO

CREATE TABLE [user_progresses] (
  [progress_id] int PRIMARY KEY IDENTITY(1, 1),
  [user_id] int,
  [cigs_per_day] int,
  [money_saved] decimal(5,2),
  [logged_at] datetime DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
)
GO

CREATE TABLE [health_benefits] (
  [benefit_id] int PRIMARY KEY IDENTITY(1, 1),
  [benefit_name] nvarchar(100),
  [time_length] time,
  [description] nvarchar(250)
)
GO

CREATE TABLE [progress_benefit] (
  [progress_id] int,
  [benefit_id] int,
  [current_percentage] decimal(5,2),
  PRIMARY KEY ([progress_id], [benefit_id]),
  FOREIGN KEY ([progress_id]) REFERENCES [user_progresses] ([progress_id]),
  FOREIGN KEY ([benefit_id]) REFERENCES [health_benefits] ([benefit_id])
)
GO

CREATE TABLE [feedbacks] (
  [feedback_id] int PRIMARY KEY IDENTITY(1, 1),
  [user_id] int,
  [title] nvarchar(250),
  [content] nvarchar(250),
  [rating] int,
  [created_at] datetime DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
)
GO

CREATE TABLE [Topics] (
    [topic_id] VARCHAR(100) PRIMARY KEY,
    [topic_name] NVARCHAR(255) NOT NULL,
	[topic_content] NVARCHAR(2000) NOT NULL
)
GO

CREATE TABLE [blog_posts] (
  [blog_id] int PRIMARY KEY IDENTITY(1, 1),
  [title] nvarchar(255),
  [content] nvarchar(max),
  [user_id] int,
  [topic_id] VARCHAR(100),
  [created_at] datetime DEFAULT (CURRENT_TIMESTAMP),
  [isPendingForApprovement] int DEFAULT (1),
  FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id]),
  FOREIGN KEY ([topic_id]) REFERENCES [Topics] ([topic_id])
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
  [is_liked] bit DEFAULT (0),
  FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
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
  [is_liked] bit DEFAULT (0),
  FOREIGN KEY ([parent_comment_id]) REFERENCES [social_comments] ([comment_id]),
  FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id]),
  FOREIGN KEY ([post_id]) REFERENCES [social_posts] ([post_id])
)
GO

CREATE TABLE [social_likes] (
  [like_id] INT PRIMARY KEY IDENTITY(1,1),
  [user_id] INT,
  [post_id] INT NULL,
  [comment_id] INT NULL,
  [created_at] DATETIME DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [social_reports] (
  [report_id] INT PRIMARY KEY IDENTITY(1,1),
  [user_id] INT,
  [post_id] INT NULL,
  [comment_id] INT NULL,
  [reason] NVARCHAR(MAX),
  [created_at] DATETIME DEFAULT (CURRENT_TIMESTAMP)
)
GO

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
  [created_at] datetime DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY ([conversation_id]) REFERENCES [conversations] ([conversation_id]),
  FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
)
GO

CREATE TABLE [user_conversation] (
  [conversation_id] int,
  [user_id] int,
  PRIMARY KEY ([conversation_id], [user_id]),
  FOREIGN KEY ([conversation_id]) REFERENCES [conversations] ([conversation_id]),
  FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
)
GO

-- Seed subscription & users
INSERT INTO [subcriptions] ([sub_type], [duration], [price])
VALUES 
  ('Free', 0, 0.0),
  ('Premium - Monthly', 1, 9.99),
  ('Premium - Yearly', 12, 99.99),
  ('Pro - Monthly', 1, 19.99),
  ('Pro - Yearly', 12, 199.99);

INSERT INTO [users] ([auth0_id], [username], [email], [role])
VALUES 
  ('auth0|abc123', 'john_doe', 'john@example.com', 'Coach'),
  ('auth0|xyz789', 'jane_smith', 'jane@example.com', 'Admin'),
  ('auth0|lmn456', 'bob_lee', 'bob@example.com', 'Member');

-- topic and blog
-- Tạo bảng Topics
CREATE TABLE [Topics] (
    [topic_id] VARCHAR(100) PRIMARY KEY,
    [topic_name] NVARCHAR(255) NOT NULL
)
GO

-- Thêm dữ liệu vào bảng Topics
INSERT INTO [Topics] ([topic_id], [topic_name], [topic_content]) VALUES
('preparing-to-quit',                    N'Preparing to Quit', N'a'),
('smoking-and-your-health',             N'Smoking and Your Health', N'b'),
('smoking-and-pregnancy',               N'Smoking and Pregnancy', N'c'),
('helping-friends-and-family-quit',     N'Helping Friends and Family Quit', N'd'),
('cravings-triggers-and-routines',      N'Cravings, Triggers, and Routines', N'e'),
('preparing-to-stop-smoking',           N'Preparing to Stop Smoking', N'f'),
('vaping',                              N'Vaping', N'g'),
('resources-for-health-professionals',  N'Resources for Health Professionals', N'h')
GO


SELECT * FROM users

SELECT * FROM user_profiles
select * from plan_log
select * from quit_reasons
select * from goals
select * from time_of_day
select * from smoke_triggers
select * from triggers_profiles