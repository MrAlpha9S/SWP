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
  [username] nvarchar(100),
  [email] varchar(255),
  [role] nvarchar(50) DEFAULT ('Member'),
  [created_at] datetime,
  [updated_at] datetime,
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
  [is_reported] int DEFAULT (0),
  [likes] int DEFAULT (0),
  [comments] int DEFAULT (0),
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
  [likes] int DEFAULT (0),
  [comments] int DEFAULT (0),
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
INSERT INTO [users] ([auth0_id], [username], [email], [created_at])
VALUES 
('auth0|abc123', 'john_doe', 'john@example.com', null),
('auth0|xyz789', 'jane_smith', 'jane@example.com', null),
('auth0|lmn456', 'bob_lee', 'bob@example.com', null),
('google-oauth2|105815855269571869013', N'Minh Thiện', 'ubw1212@gmail.com', '2025-05-15 00:00:00'),
('google-oauth2|111595895123096866179', N'Lak Big', 'biglak123@gmail.com', '2025-06-01 18:06:27.967'),
('google-oauth2|108533841306823155327', N'Tran Minh Thien (K18 HCM)', 'thientmse184897@fpt.edu.vn', '2025-06-01 02:55:15.157'),
('google-oauth2|118429602225409666127', N'Thien Tran', 'thien.tm2727@gmail.com', '2025-06-01 00:58:02.400'),
('google-oauth2|101805593223909898949', N'qwe asd', 'accracc2@gmail.com', '2025-06-01 00:58:54.637');

--UPDATE users
--SET created_at = '2025-05-01 00:00:00'
--WHERE user_id = 4;


--Sample data for onboarding
INSERT INTO user_profiles (
    user_id, readiness_value, start_date, quit_date, expected_quit_date,
    cigs_per_day, cigs_per_pack, price_per_pack, time_after_waking, quitting_method,
    cigs_reduced, custom_time_of_day, custom_trigger, created_at, updated_at, is_public
) VALUES (
    4, 'ready', '2025-06-01 00:00:00', NULL, '2025-07-06 00:00:00',
    15, 15, 35000, 'within_5', 'gradual-weekly',
    3, N'Ngủ', N'Chơi game', '2025-06-12 15:54:59', '2025-06-12 16:03:56', 1
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

INSERT INTO plan_log (profile_id, date, num_of_cigs) VALUES (1, '2025-06-01 00:00:00', 15);
INSERT INTO plan_log (profile_id, date, num_of_cigs) VALUES (1, '2025-06-08 00:00:00', 12);
INSERT INTO plan_log (profile_id, date, num_of_cigs) VALUES (1, '2025-06-15 00:00:00', 9);
INSERT INTO plan_log (profile_id, date, num_of_cigs) VALUES (1, '2025-06-22 00:00:00', 6);
INSERT INTO plan_log (profile_id, date, num_of_cigs) VALUES (1, '2025-06-29 00:00:00', 3);
INSERT INTO plan_log (profile_id, date, num_of_cigs) VALUES (1, '2025-07-06 00:00:00', 0);

-- Goal
INSERT INTO goals (goal_name, goal_amount, profile_id, created_at) VALUES (N'Du lịch Đà Lạt', 3000000, 1, '2025-06-16 00:00:00');
INSERT INTO goals (goal_name, goal_amount, profile_id, created_at) VALUES (N'iPhone 16 Pro Max', 30000000, 1, '2025-06-15 00:00:00');
INSERT INTO goals (goal_name, goal_amount, profile_id, created_at, is_completed, completed_date) VALUES (N'Ăn Manwah', 50000, 1, '2025-05-15 00:00:00', 1, '2025-06-15 00:00:00');
--Sample check-in data
--Check in log
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'good', '2025-06-01 00:00:00.000', 12);
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'bad', '2025-06-02 00:00:00.000', 11);
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'great', '2025-06-03 00:00:00.000', 0);
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'terrible', '2025-06-04 00:00:00.000', 11);
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'okay', '2025-06-05 00:00:00.000', 10);
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'good', '2025-06-06 00:00:00.000', 0);
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'bad', '2025-06-07 00:00:00.000', 10);
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'great', '2025-06-09 00:00:00.000', 9);

--qna
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (1, 'smokeCraving', 'awfwafaw');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (1, 'healthChanges', 'awfwafaw');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (1, 'healthChanges', 'awfwafaw');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (1, 'exercise', 'awfwafaw');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (1, 'encourage', 'awfwafaw');
-- log_id = 2
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (2, 'smokeCraving', N'Có, nhưng tôi đã uống nước và đi dạo để quên đi.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (2, 'healthChanges', N'Tôi thấy dễ thở hơn và ngủ ngon hơn.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (2, 'exercise', N'Tôi đi bộ 30 phút vào buổi sáng, cảm thấy rất sảng khoái.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (2, 'cravings', N'Tôi thèm ăn ngọt, nên tôi ăn trái cây thay vì bánh kẹo.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (2, 'encourage', N'Bạn tôi gọi điện hỏi thăm, tôi cảm thấy rất được động viên.');

-- log_id = 3
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (3, 'smokeCraving', N'Tôi cảm thấy muốn hút vào buổi chiều, nhưng tôi gọi cho một người bạn để trò chuyện.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (3, 'healthChanges', N'Tôi không còn ho như trước nữa.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (3, 'exercise', N'Tôi chơi cầu lông, thấy tinh thần rất phấn chấn.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (3, 'cravings', N'Tôi ăn hạt hướng dương để quên cảm giác thèm thuốc.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (3, 'encourage', N'Gia đình tôi rất ủng hộ, điều đó giúp tôi kiên định.');

-- log_id = 4
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (4, 'smokeCraving', N'Tôi cảm thấy thèm sau bữa ăn, nhưng tôi đi đánh răng để làm dịu cảm giác.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (4, 'healthChanges', N'Tôi thấy mình có nhiều năng lượng hơn vào buổi sáng.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (4, 'exercise', N'Tôi leo cầu thang thay vì dùng thang máy.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (4, 'cravings', N'Tôi uống trà nóng khi cảm thấy thèm.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (4, 'encourage', N'Đồng nghiệp tôi khen tôi cố gắng, tôi rất vui.');

-- log_id = 5
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (5, 'smokeCraving', N'Tôi thèm khi căng thẳng nhưng đã nghe nhạc thư giãn.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (5, 'healthChanges', N'Tôi thấy đầu óc tỉnh táo hơn khi làm việc.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (5, 'exercise', N'Tôi tập yoga buổi tối, thấy tâm trạng ổn định hơn.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (5, 'cravings', N'Tôi nhai cà rốt khi thấy miệng trống trải.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (5, 'encourage', N'Bạn cùng phòng tôi nhắc nhở tôi rất nhiều, tôi biết ơn điều đó.');

--free text
INSERT INTO free_text (log_id, free_text_content) VALUES 
(6, N'Gần đây tôi cảm thấy khá ổn, dù vẫn còn thèm thuốc vào buổi tối. Tôi đang cố gắng giữ bản thân bận rộn để không nghĩ đến việc hút.'),
(7, N'Có một vài ngày tôi cảm thấy rất mệt mỏi và dễ cáu, nhưng tôi biết đó là một phần của quá trình cai. Tôi đã viết nhật ký để giải tỏa cảm xúc.'),
(8, N'Tuần trước tôi bị cám dỗ khi gặp lại nhóm bạn cũ hay hút thuốc, nhưng tôi đã từ chối và cảm thấy rất tự hào về bản thân.');

--quitting_items
INSERT INTO quitting_items(item_value, log_id) VALUES ('positive_mindset', 3);
INSERT INTO quitting_items(item_value, log_id) VALUES ('social_support', 3);
INSERT INTO quitting_items(item_value, log_id) VALUES ('craving_management', 3);
INSERT INTO quitting_items(item_value, log_id) VALUES ('trigger_avoidance', 3);
INSERT INTO quitting_items(item_value, log_id) VALUES ('quit_plan', 6);
INSERT INTO quitting_items(item_value, log_id) VALUES ('positive_mindset', 6);
INSERT INTO quitting_items(item_value, log_id) VALUES ('mindfulness', 6);

--social category
INSERT INTO social_category(category_tag, category_name, img_path, [description]) VALUES ('exp-share', N'Chia sẻ trải nghiệm', '/quit-experiences.svg', N'Chia sẻ hành trình cai thuốc của bạn – từ thử thách đến những chiến thắng.')
INSERT INTO social_category(category_tag, category_name, img_path, [description]) VALUES ('journey-start', N'Bắt đầu hành trình', '/getting-started.svg', N'Lập kế hoạch và chuẩn bị để bắt đầu hành trình cai thuốc hiệu quả.')
INSERT INTO social_category(category_tag, category_name, img_path, [description]) VALUES ('maintain', N'Duy trì cai thuốc', '/staying-quit.svg', N'Chiến lược để giữ vững quyết tâm và vượt qua cám dỗ trong quá trình cai.')
INSERT INTO social_category(category_tag, category_name, img_path, [description]) VALUES ('tips-n-tricks', N'Mẹo và lời khuyên', '/hints-and-tips.svg', N'Chia sẻ mẹo vượt qua cơn thèm thuốc, giảm stress, và hoạt động thay thế.')
INSERT INTO social_category(category_tag, category_name, img_path, [description]) VALUES ('reasons', N'Lý do bỏ thuốc', '/reasons-to-quit-2.svg', N'Tác động tích cực đến sức khỏe, tài chính và gia đình bạn khi bỏ thuốc.')

--social posts
INSERT INTO [social_posts] ([category_id], [user_id], [title], [content], [created_at])
VALUES 
-- User 4
(1, 4, N'Chia sẻ đầu tiên', N'Hành trình bắt đầu với nhiều thử thách nhưng tôi đã vượt qua từng ngày.', '2025-05-14 00:00:00.000'),
(2, 4, N'Kế hoạch hành động', N'Tôi đã chuẩn bị tâm lý và thiết lập kế hoạch cụ thể để cai thuốc.', '2025-05-13 00:00:00.000'),
(3, 4, N'Giữ vững quyết tâm', N'Mỗi ngày là một chiến thắng nhỏ, tôi luôn tự nhắc nhở bản thân lý do mình bắt đầu.', '2025-05-15 00:00:00.000'),
(4, 4, N'Mẹo nhỏ mỗi ngày', N'Tôi thường uống nước mỗi khi thèm thuốc và điều đó giúp ích rất nhiều.', '2025-05-12 00:00:00.000'),
(5, 4, N'Tác động tích cực', N'Tôi cảm thấy sức khỏe tốt hơn rõ rệt và tiết kiệm được nhiều tiền.', '2025-05-14 00:00:00.000'),

-- User 5
(1, 5, N'Hành trình của tôi', N'Tôi đã từng bỏ cuộc nhưng lần này tôi quyết tâm làm được.', '2025-06-15 00:00:00.000'),
(2, 5, N'Sẵn sàng bắt đầu', N'Tôi đã lập danh sách các lý do và điều đó giúp tôi bắt đầu dễ dàng hơn.', '2025-06-15 00:00:00.000'),
(3, 5, N'Không bỏ cuộc', N'Mỗi sáng thức dậy tôi lại chọn không hút thuốc – và tôi tự hào về điều đó.', '2025-06-14 00:00:00.000'),
(4, 5, N'Mẹo vượt cơn thèm', N'Tôi thường đi bộ nhanh khi cảm thấy thèm thuốc.', '2025-06-07 00:00:00.000'),
(5, 5, N'Tài chính thay đổi', N'Sau 1 tháng, tôi đã để dành được đủ tiền để mua thứ mình thích.', '2025-06-05 00:00:00.000'),

-- User 6
(1, 6, N'Giai đoạn đầu khó khăn', N'Tôi từng nghĩ mình không thể nhưng tôi đã sai.', '2025-06-15 00:00:00.000'),
(2, 6, N'Chuẩn bị thật kỹ', N'Khi đã có mục tiêu rõ ràng, mọi thứ trở nên dễ kiểm soát hơn.', '2025-06-02 00:00:00.000'),
(3, 6, N'Tránh cám dỗ', N'Tôi tránh những nơi có người hút thuốc để bảo vệ quyết tâm của mình.','2025-06-07 00:00:00.000'),
(4, 6, N'Ứng phó thông minh', N'Tôi dùng kẹo cao su không đường mỗi khi thấy thèm.', '2025-06-10 00:00:00.000'),
(5, 6, N'Gia đình hạnh phúc hơn', N'Tôi không còn bị con cái phàn nàn về mùi khói thuốc nữa.', '2025-06-15 00:00:00.000'),

-- User 7
(1, 7, N'Câu chuyện thật', N'Bạn bè và gia đình chính là nguồn động viên lớn nhất của tôi.', '2025-06-15 00:00:00.000'),
(2, 7, N'Kế hoạch chi tiết', N'Tôi viết nhật ký để theo dõi tiến trình cai thuốc mỗi ngày.', '2025-06-01 00:00:00.000'),
(3, 7, N'Gắn bó với mục tiêu', N'Mỗi lần thèm thuốc tôi mở lại những lý do mình viết ra.', '2025-06-03 00:00:00.000'),
(4, 7, N'Chiến lược hiệu quả', N'Dùng ứng dụng theo dõi ngày không hút thuốc rất hữu ích.', '2025-06-04 00:00:00.000'),
(5, 7, N'Tự tin hơn', N'Tôi cảm thấy mình làm chủ được cuộc sống nhiều hơn.', '2025-06-06 00:00:00.000'),

-- User 8
(1, 8, N'Hành trình cá nhân', N'Lúc đầu rất khó nhưng mỗi ngày tôi thấy mình mạnh mẽ hơn.', '2025-06-15 00:00:00.000'),
(2, 8, N'Chuẩn bị tâm lý', N'Đọc câu chuyện của người khác giúp tôi tin vào bản thân.', '2025-06-12 00:00:00.000'),
(3, 8, N'Biến đổi tích cực', N'Tôi thấy mình ít căng thẳng hơn, ngủ ngon hơn.', '2025-06-11 00:00:00.000'),
(4, 8, N'Mẹo tự giúp mình', N'Ghi chú lý do bỏ thuốc vào điện thoại và xem lại thường xuyên.', '2025-06-12 00:00:00.000'),
(5, 8, N'Vì tương lai', N'Tôi muốn sống khỏe mạnh để đồng hành lâu dài cùng gia đình.', '2025-06-15 00:00:00.000');

-- Comments for user_id = 4
-- 7 parent comments + 3 child comments = 10 total comments
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported], [likes], [comments]) VALUES
(NULL, 4, 1, N'Bài viết rất hay và hữu ích! Cảm ơn bạn đã chia sẻ.', '2025-05-14 08:30:00.000', 0, 2, 1),
(NULL, 4, 3, N'Tôi cũng có cùng suy nghĩ như bạn về vấn đề này.', '2025-05-15 10:15:00.000', 0, 1, 0),
(NULL, 4, 5, N'Kinh nghiệm của bạn thật quý báu, tôi sẽ áp dụng thử.', '2025-05-14 14:20:00.000', 0, 3, 1),
(NULL, 4, 7, N'Cảm ơn bạn đã giải thích rõ ràng từng bước.', '2025-05-15 16:45:00.000', 0, 0, 0),
(NULL, 4, 9, N'Mình cũng đang gặp tình huống tương tự.', '2025-05-07 12:30:00.000', 0, 1, 1),
(NULL, 4, 12, N'Bạn có thể chia sẻ thêm chi tiết được không?', '2025-06-02 09:15:00.000', 0, 0, 0),
(NULL, 4, 15, N'Rất đồng ý với quan điểm của bạn.', '2025-06-15 11:20:00.000', 0, 2, 0);

-- Get the IDs of parent comments for child comments (assuming auto-increment starts from 1)
-- Child comments for user_id = 4
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported], [likes], [comments]) VALUES
(1, 4, 1, N'Mình cũng nghĩ vậy, đặc biệt là phần về việc lập kế hoạch.', '2025-05-14 09:00:00.000', 0, 1, 0),
(3, 4, 5, N'Bạn thử áp dụng từ từ nhé, đừng vội vàng quá.', '2025-05-14 15:30:00.000', 0, 0, 0),
(5, 4, 9, N'Chúng ta có thể trao đổi thêm qua tin nhắn riêng không?', '2025-05-07 13:45:00.000', 0, 1, 0);

-- Comments for user_id = 5
-- 7 parent comments + 3 child comments = 10 total comments
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported], [likes], [comments]) VALUES
(NULL, 5, 2, N'Bài viết này đã giúp tôi hiểu rõ hơn về vấn đề.', '2025-05-13 10:00:00.000', 0, 1, 0),
(NULL, 5, 6, N'Tôi rất ấn tượng với cách tiếp cận của bạn.', '2025-06-15 14:30:00.000', 0, 2, 1),
(NULL, 5, 8, N'Có vẻ như tôi cần phải thay đổi suy nghĩ của mình.', '2025-06-16 16:20:00.000', 0, 0, 0),
(NULL, 5, 10, N'Kinh nghiệm này rất bổ ích cho tôi.', '2025-06-05 18:15:00.000', 0, 3, 1),
(NULL, 5, 13, N'Tôi cũng từng trải qua điều tương tự.', '2025-06-07 20:30:00.000', 0, 1, 1),
(NULL, 5, 16, N'Cảm ơn bạn đã chia sẻ câu chuyện này.', '2025-06-15 08:45:00.000', 0, 2, 0),
(NULL, 5, 20, N'Mình hoàn toàn đồng ý với bạn.', '2025-06-06 11:00:00.000', 0, 0, 0);

-- Child comments for user_id = 5
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported], [likes], [comments]) VALUES
(12, 5, 6, N'Mình sẽ thử áp dụng phương pháp này xem sao.', '2025-06-15 15:00:00.000', 0, 1, 0),
(14, 5, 10, N'Bạn có thể chia sẻ thêm về trải nghiệm cá nhân không?', '2025-06-05 19:30:00.000', 0, 0, 0),
(15, 5, 13, N'Tình huống của mình cũng khá giống bạn.', '2025-06-07 21:15:00.000', 0, 1, 0);

-- Comments for user_id = 6
-- 7 parent comments + 3 child comments = 10 total comments
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported], [likes], [comments]) VALUES
(NULL, 6, 4, N'Lời khuyên này rất thiết thực và dễ áp dụng.', '2025-05-12 13:20:00.000', 0, 2, 1),
(NULL, 6, 11, N'Tôi cảm thấy bài viết này rất chân thực.', '2025-06-15 15:45:00.000', 0, 1, 0),
(NULL, 6, 14, N'Góc nhìn của bạn thật thú vị và mới mẻ.', '2025-06-10 17:30:00.000', 0, 3, 1),
(NULL, 6, 17, N'Cảm ơn bạn đã chia sẻ kinh nghiệm quý báu này.', '2025-06-01 19:15:00.000', 0, 0, 0),
(NULL, 6, 19, N'Tôi cũng đang tìm hiểu về vấn đề này.', '2025-06-04 21:00:00.000', 0, 1, 1),
(NULL, 6, 22, N'Bài viết rất hay, tôi đã học được nhiều điều.', '2025-06-12 08:30:00.000', 0, 2, 0),
(NULL, 6, 24, N'Mình sẽ bookmark bài này để đọc lại.', '2025-06-12 10:45:00.000', 0, 1, 0);

-- Child comments for user_id = 6
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported], [likes], [comments]) VALUES
(19, 6, 4, N'Đặc biệt là phần về cách quản lý thời gian.', '2025-05-12 14:00:00.000', 0, 0, 0),
(21, 6, 14, N'Tôi chưa bao giờ nghĩ về vấn đề theo cách này.', '2025-06-10 18:15:00.000', 0, 1, 0),
(23, 6, 19, N'Bạn có tài liệu nào để tham khảo thêm không?', '2025-06-04 21:45:00.000', 0, 0, 0);

-- Comments for user_id = 7
-- 7 parent comments + 3 child comments = 10 total comments
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported], [likes], [comments]) VALUES
(NULL, 7, 18, N'Bạn viết rất hay và dễ hiểu.', '2025-06-03 12:30:00.000', 0, 1, 0),
(NULL, 7, 21, N'Tôi hoàn toàn đồng ý với quan điểm này.', '2025-06-15 14:15:00.000', 0, 2, 1),
(NULL, 7, 23, N'Cảm ơn bạn đã chia sẻ kinh nghiệm thực tế.', '2025-06-11 16:00:00.000', 0, 0, 0),
(NULL, 7, 25, N'Bài viết này đã truyền cảm hứng cho tôi.', '2025-06-15 18:30:00.000', 0, 3, 1),
(NULL, 7, 1, N'Rất hữu ích cho người mới bắt đầu như tôi.', '2025-05-14 20:45:00.000', 0, 1, 1),
(NULL, 7, 3, N'Tôi sẽ thử áp dụng lời khuyên của bạn.', '2025-05-15 22:00:00.000', 0, 2, 0),
(NULL, 7, 5, N'Kinh nghiệm này rất đáng để học hỏi.', '2025-05-14 07:15:00.000', 0, 0, 0);

-- Child comments for user_id = 7
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported], [likes], [comments]) VALUES
(27, 7, 21, N'Đặc biệt là phần phân tích về tâm lý.', '2025-06-15 15:00:00.000', 0, 1, 0),
(29, 7, 25, N'Tôi sẽ chia sẻ bài này với bạn bè.', '2025-06-15 19:15:00.000', 0, 0, 0),
(30, 7, 1, N'Bạn có thể viết thêm về chủ đề này không?', '2025-05-14 21:30:00.000', 0, 1, 0);

-- Comments for user_id = 8
-- 7 parent comments + 3 child comments = 10 total comments
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported], [likes], [comments]) VALUES
(NULL, 8, 2, N'Bài viết rất thực tế và dễ áp dụng.', '2025-05-13 11:45:00.000', 0, 2, 1),
(NULL, 8, 6, N'Tôi đã học được nhiều điều từ bài này.', '2025-06-15 13:30:00.000', 0, 1, 0),
(NULL, 8, 9, N'Cách giải quyết vấn đề của bạn rất hay.', '2025-06-07 15:15:00.000', 0, 0, 0),
(NULL, 8, 12, N'Tôi cũng gặp tình huống tương tự như bạn.', '2025-06-02 17:00:00.000', 0, 3, 1),
(NULL, 8, 15, N'Kinh nghiệm này rất bổ ích cho tôi.', '2025-06-15 19:45:00.000', 0, 1, 1),
(NULL, 8, 18, N'Cảm ơn bạn đã chia sẻ những suy nghĩ này.', '2025-06-03 21:30:00.000', 0, 2, 0),
(NULL, 8, 20, N'Mình hoàn toàn đồng ý với bạn.', '2025-06-06 23:15:00.000', 0, 0, 0);

-- Child comments for user_id = 8
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported], [likes], [comments]) VALUES
(34, 8, 2, N'Đặc biệt là phần về lập kế hoạch chi tiết.', '2025-05-13 12:30:00.000', 0, 1, 0),
(37, 8, 12, N'Chúng ta có thể trao đổi thêm về vấn đề này.', '2025-06-02 18:00:00.000', 0, 0, 0),
(38, 8, 15, N'Tôi sẽ áp dụng thử và chia sẻ kết quả sau.', '2025-06-15 20:30:00.000', 0, 1, 0);

use SWP391
SELECT * FROM users

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

select sc.category_id, sc.category_name, sc.description , count(sc.category_id) as post_count from social_category sc, social_posts sp where sc.category_id = sp.category_id group by sc.category_id, sc.category_name, sc.description

SELECT 
  sc.category_id, 
  sc.category_name, 
  sc.description,
  COUNT(scmt.comment_id) AS comment_count
FROM social_category sc
JOIN social_posts sp ON sc.category_id = sp.category_id
JOIN social_comments scmt ON sp.post_id = scmt.post_id
GROUP BY sc.category_id, sc.category_name, sc.description
ORDER BY sc.category_id;
