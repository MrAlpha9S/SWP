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
ALTER DATABASE SWP391 COLLATE Vietnamese_CI_AS;
GO

CREATE TABLE [users] (
  [user_id] int PRIMARY KEY IDENTITY(1, 1),
  [auth0_id] varchar(255) UNIQUE NOT NULL,
  [avatar] nvarchar(MAX),
  [username] nvarchar(100),
  [email] varchar(255),
  [role] nvarchar(50) DEFAULT ('Member'),
  [created_at] datetime,
  [updated_at] datetime,
  [sub_id] int DEFAULT (1),
  [vip_end_date] datetime DEFAULT (null),
  [isBanned] int DEFAULT (0),
  [is_social] int,
)
GO

CREATE TABLE [subscriptions] (
  [sub_id] int PRIMARY KEY IDENTITY(1, 1),
  [sub_type] varchar(50),
  [sub_name] nvarchar(50),
  [duration] int,
  [price] float
)
GO

CREATE TABLE [users_subscriptions] (
  [user_id] int,
  [sub_id] int,
  [purchased_date] DATETIME,
  PRIMARY KEY ([user_id], [sub_id])
)
ALTER TABLE [users_subscriptions] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
ALTER TABLE [users_subscriptions] ADD FOREIGN KEY ([sub_id]) REFERENCES [subscriptions] ([sub_id])
GO


CREATE TABLE [subs_features] (
  [feature_id] int PRIMARY KEY IDENTITY(1, 1),
  [sub_id] int,
  [feature] nvarchar(100)
)
GO

ALTER TABLE [subs_features] ADD FOREIGN KEY ([sub_id]) REFERENCES [subscriptions] ([sub_id])
GO

CREATE TABLE [coach_info] (
  [coach_id] int PRIMARY KEY,
  [years_of_exp] int,
  [bio] nvarchar(200),
  [detailed_bio] nvarchar(max),
  [motto] nvarchar(100),
  [commission_rate] float DEFAULT(0.3)
)
ALTER TABLE [coach_info] ADD FOREIGN KEY ([coach_id]) REFERENCES [users] ([user_id])
GO

CREATE TABLE [coach_specialties_achievements] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [content] nvarchar(50),
  [is_specialties] BIT,
  [coach_id] int
)
ALTER TABLE [coach_specialties_achievements] ADD FOREIGN KEY ([coach_id]) REFERENCES [users] ([user_id])

CREATE TABLE [coach_reviews] (
  [review_id] int PRIMARY KEY IDENTITY(1, 1),
  [review_content] nvarchar(200),
  [stars] int,
  [user_id] int,
  [coach_id] int,
  [created_date] DATETIME,
)
ALTER TABLE [coach_reviews] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
ALTER TABLE [coach_reviews] ADD FOREIGN KEY ([coach_id]) REFERENCES [users] ([user_id])
GO


CREATE TABLE [coach_user] (
  [coach_id] int,
  [user_id] int,
  [started_date] DATETIME,
  PRIMARY KEY ([coach_id], [user_id], [started_date])
)
ALTER TABLE [coach_user] ADD FOREIGN KEY ([coach_id]) REFERENCES [users] ([user_id])
ALTER TABLE [coach_user] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
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
  [last_edited_by] int,
  [is_public] bit default (1),
)
GO
ALTER TABLE [user_profiles] ADD FOREIGN KEY ([last_edited_by]) REFERENCES [users] ([user_id])

CREATE TABLE [checkin_log] (
  [log_id] int PRIMARY KEY IDENTITY(1, 1),
  [user_id] int,
  [feeling] varchar(10),
  [logged_at] datetime,
  [cigs_smoked] int,
)

ALTER TABLE [checkin_log] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

CREATE TABLE [qna] (
  [qna_id] int PRIMARY KEY IDENTITY(1, 1),
  [log_id] int,
  [qna_question] varchar(30),
  [qna_answer] nvarchar(max),
)

ALTER TABLE [qna] ADD FOREIGN KEY ([log_id]) REFERENCES [checkin_log] ([log_id])
GO

CREATE TABLE [free_text] (
  [free_text_id] int PRIMARY KEY IDENTITY(1, 1),
  [log_id] int,
  [free_text_content] nvarchar(max)
)

ALTER TABLE [free_text] ADD FOREIGN KEY ([log_id]) REFERENCES [checkin_log] ([log_id])
GO

CREATE TABLE [quitting_items] (
  [item_value] varchar(30),
  [log_id] int,
  PRIMARY KEY ([item_value], [log_id])
)

ALTER TABLE [quitting_items] ADD FOREIGN KEY ([log_id]) REFERENCES [checkin_log] ([log_id])
GO

CREATE TABLE [goals] (
  [goal_id] int PRIMARY KEY IDENTITY(1, 1),
  [goal_name] nvarchar(50),
  [goal_amount] float,
  [profile_id] int,
  [created_at] DATETIME,
  [is_completed] bit default(0),
  [completed_date] DATETIME default(null)
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

CREATE TABLE [Topics] (
  [topic_id] VARCHAR(100) PRIMARY KEY,
  [topic_name] NVARCHAR(255) NOT NULL,
  [topic_content] NVARCHAR(2000)
)
GO

CREATE TABLE [blog_posts] (
  [blog_id] INT PRIMARY KEY IDENTITY(1, 1),
  [title] NVARCHAR(255),
  [description] NVARCHAR(255),
  [content] NVARCHAR(MAX),
  [user_id] INT,
  [created_at] DATETIME,
  [isPendingForApprovement] INT DEFAULT (1),
  [is_pending_for_deletion] INT DEFAULT (0),
  [topic_id] VARCHAR(100),
  FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id]),
  FOREIGN KEY ([topic_id]) REFERENCES [Topics] ([topic_id])
)
GO

CREATE TABLE [social_category] (
  [category_id] int PRIMARY KEY IDENTITY(1, 1),
  [category_tag] varchar(20),
  [category_name] nvarchar(50),
  [img_path] varchar(30),
  [description] nvarchar(max)
)

CREATE TABLE [social_posts] (
  [post_id] int PRIMARY KEY IDENTITY(1, 1),
  [category_id] int,
  [user_id] int,
  [title] nvarchar(max),
  [content] nvarchar(max),
  [created_at] datetime,
  [is_pinned] bit default(0),
  [is_reported] int DEFAULT (0),
  [is_pending] bit DEFAULT (1),
)
GO

ALTER TABLE [social_posts] ADD FOREIGN KEY ([category_id]) REFERENCES [social_category] ([category_id])
GO

CREATE TABLE [social_comments] (
  [comment_id] int PRIMARY KEY IDENTITY(1, 1),
  [parent_comment_id] int,
  [user_id] int,
  [post_id] int,
  [content] nvarchar(max),
  [created_at] datetime,
  [is_reported] int DEFAULT (0),
)
GO

CREATE TABLE [social_likes] (
  [like_id] INT PRIMARY KEY IDENTITY(1,1),
  [user_id] INT,
  [post_id] INT NULL,
  [comment_id] INT NULL,
  [created_at] DATETIME
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


ALTER TABLE [users] ADD FOREIGN KEY ([sub_id]) REFERENCES [subscriptions] ([sub_id])
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

use SWP391
SELECT * FROM users


DELETE FROM users where user_id = 17

SELECT * FROM user_profiles
select * from plan_log
select * from profiles_reasons
select * from goals
select * from triggers_profiles
select * from checkin_log
select * from qna
select * from quitting_items
select * from free_text
select * from social_category
select * from social_posts

