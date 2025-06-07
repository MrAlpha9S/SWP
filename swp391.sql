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

-- ========================== SUBSCRIPTIONS ==========================
CREATE TABLE [subcriptions] (
    [sub_id] INT PRIMARY KEY IDENTITY(1, 1),
    [sub_type] VARCHAR(50),
    [duration] INT,
    [price] FLOAT
)
GO

-- ========================== USERS ==========================
CREATE TABLE [users] (
    [user_id] INT PRIMARY KEY IDENTITY(1, 1),
    [auth0_id] VARCHAR(255) UNIQUE NOT NULL,
    [username] NVARCHAR(100),
    [email] VARCHAR(255),
    [role] NVARCHAR(50) DEFAULT ('Member'),
    [created_at] DATETIME DEFAULT (CURRENT_TIMESTAMP),
    [sub_id] INT DEFAULT (1),
    [vip_end_date] DATETIME DEFAULT (NULL),
    [isBanned] INT DEFAULT (0),
    FOREIGN KEY ([sub_id]) REFERENCES [subcriptions] ([sub_id])
)
GO

-- ========================== USER PROFILES ==========================
CREATE TABLE [user_profiles] (
    [profile_id] INT PRIMARY KEY IDENTITY(1, 1),
    [user_id] INT,
    [readiness] VARCHAR(20),
    [start_date] DATETIME,
    [quit_date] DATETIME,
    [expected_quit_date] DATETIME,
    [cigs_per_day] INT,
    [cigs_per_pack] INT,
    [price_per_pack] DECIMAL(10,2),
    [time_after_waking] VARCHAR(30),
    [quit_method] VARCHAR(20),
    [cigs_reduced] INT,
    [custom_time_of_day] NVARCHAR(100),
    [custom_trigger] NVARCHAR(100),
    [created_at] DATETIME DEFAULT (CURRENT_TIMESTAMP),
    [updated_at] DATETIME,
    FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
)
GO

CREATE TABLE [goals] (
    [goal_id] INT PRIMARY KEY IDENTITY(1, 1),
    [goal_name] NVARCHAR(50),
    [goal_amount] FLOAT,
    [profile_id] INT,
    FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id])
)
GO

CREATE TABLE [plan_log] (
    [plan_id] INT PRIMARY KEY IDENTITY(1, 1),
    [profile_id] INT,
    [date] DATETIME,
    [num_of_cigs] INT,
    FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id])
)
GO

CREATE TABLE [time_of_day] (
    [time_id] INT PRIMARY KEY IDENTITY(1, 1),
    [content] VARCHAR(30)
)
GO

CREATE TABLE [time_profile] (
    [profile_id] INT,
    [time_id] INT,
    PRIMARY KEY ([profile_id], [time_id]),
    FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id]),
    FOREIGN KEY ([time_id]) REFERENCES [time_of_day] ([time_id])
)
GO

CREATE TABLE [smoke_triggers] (
    [trigger_id] INT PRIMARY KEY IDENTITY(1, 1),
    [trig_content] VARCHAR(50)
)
GO

CREATE TABLE [triggers_profiles] (
    [trigger_id] INT,
    [profile_id] INT,
    PRIMARY KEY ([trigger_id], [profile_id]),
    FOREIGN KEY ([trigger_id]) REFERENCES [smoke_triggers] ([trigger_id]),
    FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id])
)
GO

CREATE TABLE [quit_reasons] (
    [reason_id] INT PRIMARY KEY IDENTITY(1, 1),
    [reason] NVARCHAR(250)
)
GO

CREATE TABLE [profiles_reasons] (
    [profile_id] INT,
    [reason_id] INT,
    PRIMARY KEY ([profile_id], [reason_id]),
    FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id]),
    FOREIGN KEY ([reason_id]) REFERENCES [quit_reasons] ([reason_id])
)
GO

CREATE TABLE [user_progresses] (
    [progress_id] INT PRIMARY KEY IDENTITY(1, 1),
    [user_id] INT,
    [cigs_per_day] INT,
    [money_saved] DECIMAL(5,2),
    [logged_at] DATETIME DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
)
GO

CREATE TABLE [health_benefits] (
    [benefit_id] INT PRIMARY KEY IDENTITY(1, 1),
    [benefit_name] NVARCHAR(100),
    [time_length] TIME,
    [description] NVARCHAR(250)
)
GO

CREATE TABLE [progress_benefit] (
    [progress_id] INT,
    [benefit_id] INT,
    [current_percentage] DECIMAL(5,2),
    PRIMARY KEY ([progress_id], [benefit_id]),
    FOREIGN KEY ([progress_id]) REFERENCES [user_progresses] ([progress_id]),
    FOREIGN KEY ([benefit_id]) REFERENCES [health_benefits] ([benefit_id])
)
GO

CREATE TABLE [achievements] (
    [achievement_id] INT PRIMARY KEY IDENTITY(1, 1),
    [achievement_name] NVARCHAR(250),
    [criteria] NVARCHAR(MAX)
)
GO

CREATE TABLE [user_achievements] (
    [user_id] INT,
    [achievement_id] INT,
    [achieved_at] DATETIME DEFAULT (CURRENT_TIMESTAMP),
    PRIMARY KEY ([user_id], [achievement_id]),
    FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id]),
    FOREIGN KEY ([achievement_id]) REFERENCES [achievements] ([achievement_id])
)
GO

CREATE TABLE [feedbacks] (
    [feedback_id] INT PRIMARY KEY IDENTITY(1, 1),
    [user_id] INT,
    [title] NVARCHAR(250),
    [content] NVARCHAR(250),
    [rating] INT,
    [created_at] DATETIME DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
)
GO

CREATE TABLE [Topics] (
    [topic_id] VARCHAR(100) PRIMARY KEY,
    [topic_name] NVARCHAR(255) NOT NULL
)
GO

CREATE TABLE [blog_posts] (
    [blog_id] INT PRIMARY KEY IDENTITY(1, 1),
    [title] NVARCHAR(255),
    [content] NVARCHAR(MAX),
    [user_id] INT,
    [created_at] DATETIME DEFAULT (CURRENT_TIMESTAMP),
    [isPendingForApprovement] INT DEFAULT (1),
    [topic_id] VARCHAR(100),
    FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id]),
    FOREIGN KEY ([topic_id]) REFERENCES [Topics] ([topic_id])
)
GO


CREATE TABLE [social_posts] (
    [post_id] INT PRIMARY KEY IDENTITY(1, 1),
    [user_id] INT,
    [content] NVARCHAR(MAX),
    [created_at] DATETIME DEFAULT (CURRENT_TIMESTAMP),
    [isReported] INT DEFAULT (0),
    FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
)
GO

CREATE TABLE [social_comments] (
    [comment_id] INT PRIMARY KEY IDENTITY(1, 1),
    [parent_comment_id] INT,
    [user_id] INT,
    [post_id] INT,
    [content] NVARCHAR(MAX),
    [created_at] DATETIME DEFAULT (CURRENT_TIMESTAMP),
    [isReported] INT DEFAULT (0),
    FOREIGN KEY ([parent_comment_id]) REFERENCES [social_comments] ([comment_id]),
    FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id]),
    FOREIGN KEY ([post_id]) REFERENCES [social_posts] ([post_id])
)
GO

CREATE TABLE [conversations] (
    [conversation_id] INT PRIMARY KEY IDENTITY(1, 1),
    [conversation_name] NVARCHAR(50),
    [created_at] DATETIME DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [messages] (
    [message_id] INT PRIMARY KEY IDENTITY(1, 1),
    [conversation_id] INT,
    [user_id] INT,
    [content] NVARCHAR(MAX),
    [created_at] DATETIME DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY ([conversation_id]) REFERENCES [conversations] ([conversation_id]),
    FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
)
GO

CREATE TABLE [user_conversation] (
    [conversation_id] INT,
    [user_id] INT,
    PRIMARY KEY ([conversation_id], [user_id]),
    FOREIGN KEY ([conversation_id]) REFERENCES [conversations] ([conversation_id]),
    FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
)
GO

-- ========================== SAMPLE DATA ==========================
INSERT INTO [subcriptions] ([sub_type], [duration], [price]) VALUES
    ('Free', 0, 0.0),
    ('Premium - Monthly', 1, 9.99),
    ('Premium - Yearly', 12, 99.99),
    ('Pro - Monthly', 1, 19.99),
    ('Pro - Yearly', 12, 199.99)
GO

INSERT INTO [users] ([auth0_id], [username], [email], [role]) VALUES
    ('auth0|abc123', 'john_doe', 'john@example.com', 'Coach'),
    ('auth0|xyz789', 'jane_smith', 'jane@example.com', 'Admin'),
    ('auth0|lmn456', 'bob_lee', 'bob@example.com', 'Member')
GO

INSERT INTO [Topics] ([topic_id], [topic_name]) VALUES
('preparing-to-quit', 'Preparing to Quit'),
('smoking-and-your-health', 'Smoking and Your Health'),
('smoking-and-pregnancy', 'Smoking and Pregnancy'),
('helping-friends-and-family-quit', 'Helping Friends and Family Quit'),
('cravings-triggers-and-routines', 'Cravings, Triggers, and Routines'),
('preparing-to-stop-smoking', 'Preparing to Stop Smoking'),
('vaping', 'Vaping'),
('resources-for-health-professionals', 'Resources for Health Professionals')
GO

-- 3 bài viết cho mỗi topic trong blog_posts
INSERT INTO [blog_posts] ([title], [content], [user_id], [topic_id]) VALUES
-- preparing-to-quit
(N'Tips for Getting Ready to Quit', N'Content about preparing mentally to quit smoking.', 1, 'preparing-to-quit'),
(N'Creating a Quit Plan', N'Step-by-step guide to make a personalized quit plan.', 1, 'preparing-to-quit'),
(N'What to Expect on Quit Day', N'Prepare yourself for the first day of quitting.', 1, 'preparing-to-quit'),

-- smoking-and-your-health
(N'Health Effects of Smoking', N'Detailed explanation of how smoking affects your body.', 1, 'smoking-and-your-health'),
(N'Benefits of Quitting Smoking', N'What improves after you quit smoking.', 1, 'smoking-and-your-health'),
(N'How Smoking Impacts the Lungs', N'In-depth analysis of lung damage caused by smoking.', 1, 'smoking-and-your-health'),

-- smoking-and-pregnancy
(N'Smoking During Pregnancy: Risks', N'Dangers of smoking while pregnant.', 1, 'smoking-and-pregnancy'),
(N'How to Quit Smoking When Pregnant', N'Support strategies for pregnant women.', 1, 'smoking-and-pregnancy'),
(N'Stories from Pregnant Women Who Quit', N'Real experiences of quitting during pregnancy.', 1, 'smoking-and-pregnancy'),

-- helping-friends-and-family-quit
(N'Supporting a Loved One to Quit', N'Ways to support a friend or family member.', 1, 'helping-friends-and-family-quit'),
(N'What to Say (and Not Say)', N'Helpful and unhelpful things to say to someone quitting.', 1, 'helping-friends-and-family-quit'),
(N'Being a Quit Buddy', N'How to walk alongside someone’s quit journey.', 1, 'helping-friends-and-family-quit'),

-- cravings-triggers-and-routines
(N'Identifying Smoking Triggers', N'Understand what causes the urge to smoke.', 1, 'cravings-triggers-and-routines'),
(N'How to Break Smoking Habits', N'Strategies to change routines and habits.', 1, 'cravings-triggers-and-routines'),
(N'Mindfulness for Cravings', N'Use mindfulness to overcome cravings.', 1, 'cravings-triggers-and-routines'),

-- preparing-to-stop-smoking
(N'Last-Minute Preparation', N'Checklist before the quit day.', 1, 'preparing-to-stop-smoking'),
(N'What Supplies You Need to Quit', N'NRTs and other helpful tools.', 1, 'preparing-to-stop-smoking'),
(N'Setting Up a Support Network', N'Who can help during your quit.', 1, 'preparing-to-stop-smoking'),

-- vaping
(N'Is Vaping Safer Than Smoking?', N'A discussion on harm reduction and risks.', 1, 'vaping'),
(N'Vaping and Youth', N'Data and concerns about youth and e-cigarettes.', 1, 'vaping'),
(N'Using Vaping to Quit Smoking', N'Pros and cons of using e-cigarettes to quit.', 1, 'vaping'),

-- resources-for-health-professionals
(N'Motivational Interviewing Techniques', N'How health workers can support quitters.', 1, 'resources-for-health-professionals'),
(N'Clinical Guidelines for Smoking Cessation', N'Evidence-based practices.', 1, 'resources-for-health-professionals'),
(N'Patient Education Materials', N'Sample brochures and handouts.', 1, 'resources-for-health-professionals')
GO

SELECT * FROM [blog_posts]
