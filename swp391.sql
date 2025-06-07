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
  [is_public] bit default (1)
)
GO

CREATE TABLE [journal_log] (
  [log_id] int PRIMARY KEY IDENTITY(1, 1),
  [user_id] int,
  [feeling] nvarchar(10),
  [created_at] datetime default (CURRENT_TIMESTAMP),
  [cigs_slipped] int,
  
)

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
  [time_id] int,
  PRIMARY KEY ([profile_id], [time_id])
)
GO

CREATE TABLE [time_of_day] (
  [time_id] int PRIMARY KEY IDENTITY(1, 1),
  [content] varchar(30)
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
  PRIMARY KEY ([trigger_id], [profile_id])
)
GO



CREATE TABLE [profiles_reasons] (
  [profile_id] int,
  [reason_id] int,
  PRIMARY KEY ([profile_id], [reason_id])
)
GO

CREATE TABLE [quit_reasons] (
  [reason_id] int PRIMARY KEY IDENTITY(1, 1),
  [reason] nvarchar(250)
)
GO


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

ALTER TABLE [profiles_reasons] ADD FOREIGN KEY ([reason_id]) REFERENCES [quit_reasons] ([reason_id])
GO

ALTER TABLE [time_profile] ADD FOREIGN KEY ([time_id]) REFERENCES [time_of_day] ([time_id])
GO

ALTER TABLE [triggers_profiles] ADD FOREIGN KEY ([trigger_id]) REFERENCES [smoke_triggers] ([trigger_id])
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


SELECT * FROM users

SELECT * FROM user_profiles
select * from plan_log
select * from quit_reasons
select * from goals
select * from time_of_day
select * from smoke_triggers
select * from triggers_profiles