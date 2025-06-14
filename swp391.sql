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
  [created_at] datetime,
  [updated_at] datetime,
  [sub_id] int DEFAULT (1),
  [vip_end_date] datetime DEFAULT (null),
  [isBanned] int DEFAULT (0),
  FOREIGN KEY ([sub_id]) REFERENCES [subcriptions] ([sub_id])
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

CREATE TABLE [checkin_log] (
  [log_id] int PRIMARY KEY IDENTITY(1, 1),
  [user_id] int,
  [feeling] varchar(10),
  [logged_at] datetime,
  [cigs_smoked] int,
  FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
)
GO

CREATE TABLE [qna] (
  [qna_id] int PRIMARY KEY IDENTITY(1, 1),
  [log_id] int,
  [qna_question] varchar(30),
  [qna_answer] nvarchar(max),
  FOREIGN KEY ([log_id]) REFERENCES [checkin_log] ([log_id])
)
GO

CREATE TABLE [free_text] (
  [free_text_id] int PRIMARY KEY IDENTITY(1, 1),
  [log_id] int,
  [free_text_content] nvarchar(max),
  FOREIGN KEY ([log_id]) REFERENCES [checkin_log] ([log_id])
)
GO

CREATE TABLE [quitting_items] (
  [item_value] varchar(30),
  [log_id] int,
  PRIMARY KEY ([item_value], [log_id]),
  FOREIGN KEY ([log_id]) REFERENCES [checkin_log] ([log_id])
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

CREATE TABLE [time_profile] (
  [profile_id] int,
  [time_value] varchar(30),
  PRIMARY KEY ([profile_id], [time_value]),
  FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id])
)
GO

CREATE TABLE [triggers_profiles] (
  [profile_id] int,
  [trigger_value] varchar(30),
  PRIMARY KEY ([trigger_value], [profile_id]),
  FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id])
)
GO

CREATE TABLE [profiles_reasons] (
  [profile_id] int,
  [reason_value] varchar(30),
  PRIMARY KEY ([profile_id], [reason_value]),
  FOREIGN KEY ([profile_id]) REFERENCES [user_profiles] ([profile_id])
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
  [topic_content] NVARCHAR(2000)
)
GO

CREATE TABLE [blog_posts] (
  [blog_id] INT PRIMARY KEY IDENTITY(1, 1),
  [image_data] VARCHAR(MAX),
  [title] NVARCHAR(255),
  [description] NVARCHAR(255),
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
  FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id]),
  FOREIGN KEY ([post_id]) REFERENCES [social_posts] ([post_id]),
  FOREIGN KEY ([parent_comment_id]) REFERENCES [social_comments] ([comment_id])
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


INSERT INTO [users] ([auth0_id], [username], [email], [role])
VALUES 
('google-oauth2|105341948329602399922', 'The anh Pham', 'mr28042005@gmail.com', 'Coach');


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
INSERT INTO goals (goal_name, goal_amount, profile_id) VALUES (N'Du lịch Đà Lạt', 3000000, 1);

--Sample check-in data
--Check in log
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'good', '2025-06-01 00:00:00.000', 12);
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'bad', '2025-06-02 00:00:00.000', 11);
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'great', '2025-06-03 00:00:00.000', 0);
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'terrible', '2025-06-04 00:00:00.000', 11);
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'okay', '2025-06-05 00:00:00.000', 10);
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'good', '2025-06-06 00:00:00.000', 0);
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'bad', '2025-06-07 00:00:00.000', 10);
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'okay', '2025-06-08 00:00:00.000', null);
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'great', '2025-06-09 00:00:00.000', 9);
INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked) VALUES (4, 'terrible', '2025-06-10 00:00:00.000', null);

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

-- log_id = 6
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (6, 'smokeCraving', N'Tôi thèm khi căng thẳng nhưng đã nghe nhạc thư giãn.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (6, 'healthChanges', N'Tôi thấy đầu óc tỉnh táo hơn khi làm việc.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (6, 'exercise', N'Tôi tập yoga buổi tối, thấy tâm trạng ổn định hơn.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (6, 'cravings', N'Tôi nhai cà rốt khi thấy miệng trống trải.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (6, 'encourage', N'Bạn cùng phòng tôi nhắc nhở tôi rất nhiều, tôi biết ơn điều đó.');

-- log_id = 8
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (8, 'smokeCraving', N'Không, hôm nay tôi cảm thấy ổn.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (8, 'healthChanges', N'Tôi ít mệt khi leo cầu thang.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (8, 'exercise', N'Tôi dọn dẹp nhà cửa, đổ mồ hôi khá nhiều.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (8, 'cravings', N'Tôi ngậm kẹo bạc hà.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (8, 'encourage', N'Mẹ tôi rất vui khi tôi bỏ thuốc.');

-- log_id = 10
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (10, 'smokeCraving', N'Không nhiều, tôi bận rộn nên không nghĩ đến.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (10, 'healthChanges', N'Tôi không còn thấy hụt hơi khi chạy.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (10, 'exercise', N'Tôi đi bộ cùng chó cưng.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (10, 'cravings', N'Tôi ăn bánh gạo thay vì hút thuốc.');
INSERT INTO qna (log_id, qna_question, qna_answer) VALUES (10, 'encourage', N'Một người bạn lâu ngày gọi điện động viên.');

--free text
INSERT INTO free_text (log_id, free_text_content) VALUES 
(5, N'Gần đây tôi cảm thấy khá ổn, dù vẫn còn thèm thuốc vào buổi tối. Tôi đang cố gắng giữ bản thân bận rộn để không nghĩ đến việc hút.'),
(7, N'Có một vài ngày tôi cảm thấy rất mệt mỏi và dễ cáu, nhưng tôi biết đó là một phần của quá trình cai. Tôi đã viết nhật ký để giải tỏa cảm xúc.'),
(9, N'Tuần trước tôi bị cám dỗ khi gặp lại nhóm bạn cũ hay hút thuốc, nhưng tôi đã từ chối và cảm thấy rất tự hào về bản thân.'),
(10, N'Tôi cảm thấy nhẹ nhõm và tự tin hơn vì đã vượt qua được tuần khó khăn nhất. Gia đình tôi cũng nhận ra sự thay đổi tích cực ở tôi.');

--quitting_items
INSERT INTO quitting_items(item_value, log_id) VALUES ('positive_mindset', 3);
INSERT INTO quitting_items(item_value, log_id) VALUES ('social_support', 3);
--INSERT INTO quitting_items(item_value, log_id) VALUES ('positive_mindset', 3);
INSERT INTO quitting_items(item_value, log_id) VALUES ('trigger_avoidance', 3);
INSERT INTO quitting_items(item_value, log_id) VALUES ('quit_plan', 6);
INSERT INTO quitting_items(item_value, log_id) VALUES ('positive_mindset', 6);
INSERT INTO quitting_items(item_value, log_id) VALUES ('mindfulness', 6);

--Topic and blog sample
INSERT INTO [Topics] ([topic_id], [topic_name], [topic_content]) VALUES
('preparing-to-quit',                    N'Chuẩn bị để bỏ thuốc', N'Nếu bạn đang nghĩ đến việc bỏ thuốc lá, việc có những câu hỏi hoặc lo lắng về việc cai thuốc lá sẽ như thế nào là điều bình thường. ' + CHAR(13) + CHAR(10) + N'Tìm hiểu sự thật về nicotine và cách hút thuốc lá và thuốc lá điện tử ảnh hưởng đến bạn và những người xung quanh có thể giúp bạn cảm thấy sẵn sàng và tự tin hơn để thực hiện bước đầu tiên.'),
('smoking-and-your-health',             N'Hút thuốc và sức khỏe của bạn', N'Khoảnh khắc bạn bỏ hút thuốc, cơ thể bạn bắt đầu chữa lành và sức khỏe của bạn bắt đầu được cải thiện. Khám phá cách hút thuốc ảnh hưởng đến cơ thể của bạn, những rủi ro của việc hút thuốc thụ động và những gì xảy ra trong quá trình rút tiền khi bạn bắt đầu hành trình đến sức khỏe tốt hơn.'),
('smoking-and-pregnancy',               N'Hút thuốc và mang thai', N'Một số người ngừng hút thuốc ngay khi họ phát hiện ra họ đang mang thai. Những người khác cắt giảm, nhưng đấu tranh để bỏ thuốc lá. Một số người nhận thấy sự thôi thúc của họ và hút thuốc tăng trong khi mang thai.'),
('helping-friends-and-family-quit',     N'Giúp bạn bè và gia đình bỏ thuốc lá', N'Hút thuốc có thể gây hại cho những người xung quanh bạn, đặc biệt là trẻ em, vì cơ thể đang phát triển của chúng dễ bị ảnh hưởng của hút thuốc thụ động.'),
('cravings-triggers-and-routines',      N'Sự thèm muốn, nguyên nhân và thói quen', N'Ngừng hút thuốc là một trong những điều tốt nhất bạn có thể làm cho sức khỏe của mình - và bạn không phải làm điều đó một mình. Có rất nhiều công cụ và chiến thuật làm cho cảm giác thèm ăn và rút tiền dễ dàng hơn để quản lý, tăng cơ hội bỏ việc tốt.'),
('preparing-to-stop-smoking',           N'Chuẩn bị bỏ thuốc lá', N'Nếu ai đó bạn biết đang cố gắng bỏ hút thuốc hoặc vaping, cung cấp hỗ trợ là một trong những điều quan trọng nhất bạn có thể làm.'),
('vaping',                              N'Hút thuốc lá điện tử', N'Vapes (hoặc thuốc lá điện tử) thường được thúc đẩy như một sự thay thế ít gây hại cho hút thuốc, nhưng sự an toàn của chúng vẫn đang được nghiên cứu. Những ảnh hưởng sức khỏe lâu dài của vaping vẫn không chắc chắn và vapes chưa được chứng minh là một cách an toàn hoặc hiệu quả để bỏ thuốc lá hút thuốc.'),
('resources-for-health-professionals',  N'Tài nguyên cho Chuyên gia Y tế', N'Khi ai đó quyết định ngừng hút thuốc, mỗi chút hỗ trợ bạn có thể cung cấp cho họ. Các chuyên gia y tế và nhân viên cộng đồng có một vai trò quan trọng. Nghiên cứu đã chỉ ra rằng ngay cả lời khuyên ngắn gọn để bỏ hút thuốc từ một chuyên gia y tế cũng có thể tăng cơ hội bỏ thuốc thành công.')
GO

INSERT INTO [blog_posts] ([title], [image_data], [description], [content], [user_id], [topic_id]) VALUES
-- preparing-to-quit
(N'Bí quyết sẵn sàng bỏ thuốc lá', '', N'Nếu bạn nghĩ đến việc bỏ hút thuốc, bạn đã tiến một bước tiến lớn theo một hướng thực sự tuyệt vời. Cách tốt nhất để bắt đầu là biết những gì mong đợi, vì vậy bạn đã trang bị tốt hơn để đáp ứng các thách thức trên đường đi.', N'<p><strong>Nguyên nhân nào gây ra tình trạng phụ thuộc?</strong></p><p>Thuốc lá có chứa nicotine, một loại thuốc gây nghiện. Nicotine giải phóng dopamine, một chất hóa học "cảm thấy thoải mái" trong "trung tâm khen thưởng" của não.</p><p>Dopamine được giải phóng tự nhiên bất cứ khi nào chúng ta làm điều gì đó mà chúng ta thích. Nicotine khiến lượng dopamine được giải phóng lớn hơn. Não của bạn liên kết cảm giác "cảm thấy thoải mái" với trải nghiệm hút thuốc. Chính mối liên hệ này có thể dẫn đến thói quen hình thành thói quen và tình trạng phụ thuộc vào thuốc lá.</p><p>Ví dụ, nếu bạn có xu hướng hút thuốc sau khi ăn, não của bạn sẽ liên kết tác dụng "cảm thấy thoải mái" của việc hút thuốc với việc ăn uống. Não của bạn sẽ ghi nhớ thói quen hút thuốc của bạn và "nhắc nhở" bạn hút thuốc sau khi ăn. Đó là lý do tại sao việc thay đổi thói quen của bạn có thể giúp làm suy yếu các tác nhân gây ra cơn thèm thuốc.</p><p>Nếu bạn là người hút thuốc thường xuyên, não của bạn sẽ cố gắng bù đắp cho sự hiện diện của nicotine. Não thực hiện điều này bằng cách làm mất cảm giác ở các thụ thể não mà nicotine liên kết, đồng thời có thể kích hoạt nhiều thụ thể này hơn.</p><p>Quá trình thích nghi của não với sự hiện diện của nicotine bắt đầu giảm dần khi bạn ngừng hút thuốc. Đây là nguyên nhân gây ra các triệu chứng cai thuốc.</p><p></p><p><strong>Các triệu chứng cai thuốc</strong></p><p>Các triệu chứng cai thuốc có xu hướng xảy ra trong 1 đến 2 tuần đầu sau khi cai thuốc. Chúng giảm dần về cường độ và tần suất theo thời gian. Điều quan trọng cần nhớ là các triệu chứng cai thuốc sẽ qua đi. Với sự hỗ trợ, bạn sẽ vượt qua giai đoạn này và đang trên con đường cai thuốc hoàn toàn.</p><p>Quá trình cai thuốc và sự phụ thuộc của mỗi người là khác nhau. Hãy đọc lời khuyên của chúng tôi về cách kiểm soát các triệu chứng cai thuốc và cơn thèm thuốc của bạn.</p><p></p><p><strong>Tăng cân sau khi cai thuốc</strong></p><p>Bạn có thể lo lắng rằng mình sẽ tăng cân khi cai thuốc. Điều này là dễ hiểu. Hầu hết mọi người tăng khoảng 4kg trong năm đầu tiên hoặc lâu hơn. Họ có xu hướng giảm cân theo thời gian vì họ có thể thở dễ hơn và tập thể dục nhiều hơn.</p><p>Một số người không tăng thêm cân nào cả. Nhìn xa hơn, những người từng hút thuốc không có xu hướng tăng cân nhiều hơn những người chưa bao giờ hút thuốc. Vì vậy, đừng quá lo lắng - những lợi ích cho sức khỏe và ngoại hình của bạn khi bạn bỏ thuốc là rất tuyệt vời.</p><p>Điều quan trọng là phải suy nghĩ về chế độ ăn uống và thói quen của bạn, và lên kế hoạch trước:</p><p>Trong những tuần đầu tiên cai thuốc, liệu pháp thay thế nicotine (NRT) hoặc thuốc cai thuốc lá theo toa có thể giúp giảm thiểu tình trạng tăng cân</p><p>Ăn một chế độ ăn uống cân bằng với nhiều trái cây và rau</p><p>Tránh thực phẩm có đường và chất béo</p><p>Cố gắng không ăn vặt như một cách để kiểm soát cơn thèm nicotine</p><p>Uống nước hoặc đồ uống ít calo thay vì ăn vặt</p><p>Tập thể dục thường xuyên</p>', 1, 'preparing-to-quit'),
(N'Lập kế hoạch bỏ thuốc', '', N'Hướng dẫn chi tiết từng bước để lên kế hoạch bỏ thuốc hiệu quả.', N'<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; background-color: #f9f9f9; color: #333;">
<h1 style="color:#2c3e50; font-size:28px; margin-bottom:10px;">📝 Lập kế hoạch bỏ thuốc</h1>
<p><strong>Hướng dẫn chi tiết từng bước để người hút thuốc chủ động kiểm soát quá trình cai thuốc và tăng tỷ lệ thành công</strong></p>
<p>Không có thành công nào đến từ may mắn. Một kế hoạch cụ thể, rõ ràng sẽ giúp bạn đối mặt và vượt qua từng giai đoạn của việc bỏ thuốc. Dưới đây là các bước đơn giản nhưng hiệu quả để xây dựng <span style="font-weight:bold; color:#e74c3c;">kế hoạch bỏ thuốc cá nhân hóa</span>.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">📅 Bước 1: Chọn “Ngày Cai Thuốc” chính thức</h2>
<p>Hãy chọn một ngày gần – trong vòng 7 ngày tới – để bạn có đủ thời gian chuẩn bị nhưng không đủ lâu để trì hoãn. Ghi rõ ngày đó và đánh dấu trong lịch hoặc điện thoại.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🔍 Bước 2: Xác định lý do muốn bỏ thuốc</h2>
<ul style="margin-top:5px;">
<li>Vì sức khỏe?</li>
<li>Vì con cái, gia đình?</li>
<li>Vì kinh tế, tự do, hình ảnh bản thân?</li>
</ul>
<p>Viết ra ít nhất 3 lý do và đặt ở nơi dễ thấy – ví dụ: gương, ví tiền, điện thoại.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🛠️ Bước 3: Dọn sạch môi trường khỏi thuốc lá</h2>
<p>Vứt bỏ tất cả thuốc lá, bật lửa, gạt tàn. Làm sạch mùi thuốc trong nhà, xe, quần áo để tránh gợi lại thói quen cũ.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">📦 Bước 4: Chuẩn bị vật dụng thay thế</h2>
<ul style="margin-top:5px;">
<li>Kẹo cao su, kẹo ngậm, nước lạnh, trái cây cắt nhỏ</li>
<li>Đồ bóp tay, bút viết, ống hút (để “đánh lừa tay”)</li>
<li>Ứng dụng hỗ trợ cai thuốc hoặc sổ tay theo dõi</li>
</ul>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🤝 Bước 5: Xây dựng hệ thống hỗ trợ</h2>
<p>Nói với người thân, bạn bè về kế hoạch của bạn và nhờ họ động viên, nhắc nhở. Có thể chọn một “người đồng hành” để chia sẻ mỗi khi bạn cảm thấy yếu lòng.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">💡 Bước 6: Lập kế hoạch ứng phó với cơn thèm</h2>
<ul style="margin-top:5px;">
<li>Khi thèm: hãy thở sâu 10 lần, đi bộ 5 phút, uống nước lạnh</li>
<li>Tránh các tình huống quen hút: cà phê, tụ tập bạn bè hút thuốc, stress</li>
<li>Lưu số điện thoại người bạn tin tưởng để gọi khi khó chịu</li>
</ul>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🔄 Bước 7: Theo dõi tiến trình mỗi ngày</h2>
<p>Ghi lại ngày đã cai, số tiền tiết kiệm, cảm xúc mỗi ngày. Khen thưởng bản thân bằng những món quà nhỏ như một ly sinh tố, một buổi xem phim, hay thời gian nghỉ ngơi xứng đáng.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🎯 Kết luận</h2>
<p><strong>Thành công không đến từ ý chí đơn thuần, mà từ một kế hoạch tốt và sự kiên trì từng bước.</strong> Hãy viết ra kế hoạch, hành động theo từng bước và tin tưởng rằng bạn xứng đáng với một cuộc sống khỏe mạnh – không khói thuốc.</p>
</body>
', 1, 'preparing-to-quit'),
(N'Chuyện gì sẽ xảy ra vào ngày đầu tiên?', '', N'Chuẩn bị cho ngày đầu tiên không thuốc lá.', N'<p>Nếu ngày cai thuốc của bạn đang đến gần, thì đã đến lúc bạn phải chuẩn bị. Bắt đầu bằng cách loại bỏ bất cứ thứ gì có thể khiến bạn nhớ đến việc hút thuốc hoặc thuốc lá điện tử. Kiểm tra nhà cửa, xe hơi và nơi làm việc của bạn. Vứt bỏ thuốc lá, thuốc lá điện tử, bật lửa và gạt tàn. Nếu ai đó sống cùng bạn hút thuốc hoặc thuốc lá điện tử, hãy yêu cầu họ không hút thuốc trước mặt bạn trong khi bạn đang cố gắng cai thuốc.</p><p></p><p>Việc có kế hoạch cho những khoảnh khắc khó khăn cũng rất hữu ích. Cảm giác thèm thuốc là bình thường, nhưng chúng sẽ qua đi. Hãy thử viết ra một vài điều bạn có thể làm thay vì với lấy điếu thuốc hoặc thuốc lá điện tử. Một số ý tưởng bao gồm:</p><ul><li><p>- Nhai kẹo cao su hoặc kẹo bạc hà</p></li><li><p>- Nhấp một ngụm nước lạnh</p></li><li><p>- Đi bộ</p></li><li><p>- Thử bài tập thở</p></li><li><p>_ Ăn một bữa ăn nhẹ lành mạnh</p></li><li><p>_ Nhắn tin hoặc gọi điện cho bạn bè</p></li><li><p>_ Chơi trò chơi trên điện thoại</p></li><li><p>- Sử dụng quả bóng giảm căng thẳng hoặc đồ chơi giải tỏa căng thẳng</p></li></ul>', 1, 'preparing-to-quit'),

-- smoking-and-your-health
(N'Tác hại của thuốc lá đến sức khỏe', '', N'Phân tích chi tiết ảnh hưởng của thuốc lá đến cơ thể.', N'<p><strong>Tổng quan</strong></p><p>Những người hút thuốc có nguy cơ mắc ung thư, bệnh phổi và bệnh tim mạch cao hơn.</p><p>Bất kể bạn bao nhiêu tuổi hay đã hút thuốc bao lâu, bạn có thể giảm đáng kể nguy cơ đối với sức khỏe của mình bằng cách bỏ thuốc. Ngay khi bạn bỏ thuốc, sức khỏe của bạn sẽ bắt đầu cải thiện.</p><p><strong>Ung thư phổi</strong></p><p>Bạn bỏ thuốc càng sớm thì cơ hội sống lâu và khỏe mạnh càng cao.</p><p>Nếu bạn bị ung thư phổi, việc bỏ thuốc có thể làm giảm nguy cơ khối u tiến triển và cải thiện kết quả điều trị. Nếu bạn cần phải điều trị bằng hóa trị hoặc xạ trị, bạn có thể sẽ gặp ít tác dụng phụ và biến chứng hơn nếu bạn không còn hút thuốc nữa.</p><p>Bằng chứng cho thấy số người bỏ thuốc sau khi được chẩn đoán mắc ung thư phổi giai đoạn đầu vẫn còn sống sau năm năm cao gấp đôi.</p><p><strong>Bệnh khí phế thũng</strong></p><p>Bỏ thuốc không thể đảo ngược bệnh khí phế thũng, nhưng sẽ có tác động tích cực đến sức khỏe của bạn.</p><p>Nếu bạn bị khí phế thũng, việc bỏ thuốc lá có thể:</p><p>Cải thiện khả năng thở</p><p>Tăng chất lượng cuộc sống tổng thể</p><p>Làm chậm quá trình suy giảm chức năng phổi</p><p>Giảm khả năng phải nhập viện và tử vong sớm</p><p><strong>Hút thuốc gây ra khí phế thũng như thế nào</strong></p><p>Khí phế thũng còn được gọi là bệnh phổi tắc nghẽn mãn tính (hay COPD).</p><p>Khi bạn hút thuốc lá, khói thuốc bạn hít vào phổi có thể làm hỏng các túi khí nhỏ vận chuyển oxy vào máu của bạn.</p><p>Các túi khí trở nên kém đàn hồi hơn, có thể khiến việc thở trở nên khó khăn. Bạn có thể thấy rằng ngay cả những hoạt động đơn giản cũng có thể khiến bạn khó thở. Những triệu chứng này có thể dẫn đến khí phế thũng.</p><p><strong>Bệnh tim</strong></p><p>Không bao giờ là quá muộn để bỏ thuốc lá và bắt đầu giảm nguy cơ mắc bệnh tim - không chỉ cho bản thân bạn mà còn cho những người thân yêu của bạn.</p><p>Tác động của việc hút thuốc đối với tim của bạn</p><p>Hút thuốc làm hẹp và tắc nghẽn động mạch. Điều này hạn chế lưu lượng máu và làm giảm lưu lượng oxy đi khắp cơ thể bạn. Nguồn cung cấp máu bị hạn chế cho tim của bạn có thể gây tổn thương vĩnh viễn cho cơ tim của bạn.</p><p>Nếu động mạch của bạn bị tắc quá mức, chúng có thể bị chặn lại – điều này có thể gây ra cơn đau tim.</p><p>Nếu bạn đã mắc một số dạng bệnh tim, việc cai thuốc sẽ làm giảm nguy cơ bị tổn thương thêm. Nó cũng sẽ làm giảm nguy cơ bị đau tim hoặc đột quỵ lần nữa.</p><p>Hãy nói chuyện với bác sĩ nếu bạn bị bệnh tim mạch và đang cân nhắc sử dụng liệu pháp thay thế nicotine (NRT) để giúp bạn cai thuốc lá.</p><p><strong>Đột quỵ</strong></p><p>Bỏ thuốc lá sẽ làm giảm nguy cơ bị đột quỵ.</p><p>Đột quỵ xảy ra khi động mạch dẫn máu đến não đột nhiên bị tắc, khiến một phần não bị chết. Điều này có thể gây mất khả năng vận động, thị lực hoặc khả năng nói.</p><p>Những người hút thuốc có nguy cơ hình thành cục máu đông trong động mạch cao hơn. Các hóa chất độc hại trong khói thuốc lá có thể làm hỏng mạch máu và khiến động mạch bị hẹp hoặc cứng lại. Tổn thương động mạch này làm tăng nguy cơ hình thành cục máu đông.</p><p>Những người hút thuốc có nguy cơ bị đột quỵ cao hơn 1,5 đến 2 lần so với những người không hút thuốc. Những người hút thuốc nhiều thậm chí còn có nguy cơ cao hơn.</p><p><strong>Bệnh mạch máu ngoại biên</strong></p><p>Hút thuốc là yếu tố nguy cơ hàng đầu dẫn đến bệnh mạch máu ngoại biên (PVD). Nó cũng làm cho các tác động của bệnh trở nên tồi tệ hơn.</p><p>PVD xảy ra khi các động mạch cung cấp máu cho chân, bàn chân, cánh tay hoặc bàn tay của bạn bị hẹp hoặc tắc nghẽn.</p><p>Điều này có thể dẫn đến một loạt các triệu chứng, bao gồm đau khi đi bộ hoặc nghỉ ngơi, kim châm và tê liệt. Trong những trường hợp nghiêm trọng, bộ phận cơ thể bị ảnh hưởng sẽ cần phải cắt bỏ do lưu lượng máu giảm.</p><p><strong>Bất lực</strong></p><p>Những người hút thuốc có nguy cơ mắc chứng bất lực cao hơn đáng kể so với những người không hút thuốc. Bạn hút thuốc càng lâu và hút càng nhiều thuốc lá thì nguy cơ mắc chứng bất lực càng cao. Tình trạng này còn được gọi là rối loạn cương dương.</p>', 1, 'smoking-and-your-health'),
(N'Lợi ích khi bỏ thuốc lá', '', N'Cơ thể sẽ thay đổi tích cực như thế nào sau khi ngừng hút thuốc.', N'<h3><strong>1. Cải thiện sức khỏe toàn diện</strong></h3><ul><li><p>Sau 20 phút: huyết áp và nhịp tim trở về bình thường.</p></li><li><p>Sau 12 giờ: giảm CO trong máu, tăng lượng oxy.</p></li><li><p>Sau vài tuần – vài tháng: chức năng phổi cải thiện, dễ thở, ít ho hơn.</p></li><li><p>Về lâu dài: giảm nguy cơ mắc ung thư, bệnh tim mạch, đột quỵ,…</p></li></ul><hr><h3><strong>2. Cải thiện ngoại hình</strong></h3><ul><li><p>Làn da tươi sáng, chậm lão hóa hơn.</p></li><li><p>Răng trắng hơn, hơi thở thơm mát hơn.</p></li><li><p>Tăng sự tự tin trong giao tiếp và công việc.</p></li></ul><hr><h3><strong>3. Tiết kiệm chi phí</strong></h3><ul><li><p>Không phải tốn tiền mua thuốc mỗi ngày.</p></li><li><p>Tiết kiệm hàng triệu đồng mỗi tháng.</p></li><li><p>Có thể dùng số tiền đó cho việc chăm sóc bản thân, học tập hoặc giúp đỡ gia đình.</p></li></ul><hr><h3><strong>4. Bảo vệ người thân và cộng đồng</strong></h3><ul><li><p>Tránh cho người thân hít phải khói thuốc thụ động.</p></li><li><p>Giảm nguy cơ bệnh hô hấp ở trẻ nhỏ và phụ nữ mang thai.</p></li><li><p>Góp phần xây dựng môi trường sống lành mạnh.</p></li></ul><hr><h3><strong>5. Cải thiện chất lượng cuộc sống</strong></h3><ul><li><p>Sống khỏe mạnh, năng động và thoải mái hơn.</p></li><li><p>Ít lo lắng về bệnh tật do thuốc lá gây ra.</p></li><li><p>Làm gương tốt cho người khác, đặc biệt là con cháu.</p></li></ul>', 1, 'smoking-and-your-health'),
(N'Thuốc lá và phổi của bạn', '', N'Khám phá tổn thương phổi do thuốc lá gây ra.', N'<p>Thuốc lá là một trong những nguyên nhân hàng đầu gây tổn thương nghiêm trọng cho phổi. Dù chỉ hút một vài điếu mỗi ngày, người hút thuốc vẫn có nguy cơ cao bị suy giảm chức năng hô hấp và mắc các bệnh phổi nguy hiểm. Hãy cùng tìm hiểu cụ thể thuốc lá đã tàn phá lá phổi của bạn như thế nào:</p><hr><h3><strong>1. Phá hủy cấu trúc phổi</strong></h3><ul><li><p>Khói thuốc chứa hơn 7.000 chất hóa học, trong đó hàng trăm chất độc và hàng chục chất gây ung thư.</p></li><li><p>Những hóa chất này làm tổn thương các lông mao trong đường hô hấp – bộ phận giúp làm sạch bụi bẩn và vi khuẩn, khiến phổi dễ bị nhiễm trùng.</p></li><li><p>Các túi phế nang – nơi trao đổi khí – cũng bị phá hủy dần, dẫn đến khó thở và giảm lượng oxy cung cấp cho cơ thể.</p></li></ul><hr><h3><strong>2. Gây ra các bệnh phổi nghiêm trọng</strong></h3><ul><li><p><strong>Bệnh phổi tắc nghẽn mạn tính (COPD):</strong> là hậu quả thường gặp nhất ở người hút thuốc lâu năm. Người bệnh ho dai dẳng, khò khè, khó thở tăng dần theo thời gian.</p></li><li><p><strong>Viêm phế quản mạn tính:</strong> khói thuốc làm viêm lớp niêm mạc ống phế quản, gây ho kéo dài kèm đờm.</p></li><li><p><strong>Ung thư phổi:</strong> là dạng ung thư chết người phổ biến nhất do thuốc lá gây ra. Hơn 85% ca ung thư phổi liên quan trực tiếp đến hút thuốc.</p></li></ul><hr><h3><strong>3. Làm giảm khả năng hô hấp và chất lượng sống</strong></h3><ul><li><p>Người hút thuốc thường xuyên bị hụt hơi, thở nông, không thể vận động mạnh.</p></li><li><p>Dễ mắc các bệnh hô hấp thông thường như cảm cúm, viêm phổi do hệ miễn dịch tại phổi bị suy yếu.</p></li><li><p>Chất lượng cuộc sống suy giảm, mất khả năng lao động, giảm tuổi thọ.</p></li></ul><hr><h3><strong>4. Tác hại kéo dài ngay cả sau khi ngưng hút</strong></h3><ul><li><p>Dù đã bỏ thuốc, phổi cần nhiều năm để phục hồi – và trong nhiều trường hợp tổn thương là không thể đảo ngược.</p></li><li><p>Tuy nhiên, việc ngừng hút thuốc càng sớm thì khả năng phục hồi chức năng phổi càng cao và nguy cơ mắc bệnh càng giảm.</p></li></ul><hr><h3><strong>💡 Kết luận</strong></h3><p>Phổi là cơ quan sống còn giúp bạn hít thở và duy trì sự sống mỗi giây. Hút thuốc lá chính là hành động “đầu độc” phổi mỗi ngày. Việc hiểu rõ những tổn thương mà thuốc lá gây ra sẽ là động lực để bạn — hoặc người thân — từ bỏ thói quen nguy hiểm này càng sớm càng tốt.</p>', 1, 'smoking-and-your-health'),

-- smoking-and-pregnancy
(N'Hút thuốc khi mang thai: Nguy hiểm thế nào?', '', N'Những nguy cơ tiềm ẩn đối với mẹ và thai nhi.', N'<h2>🚭 <strong>Hút thuốc khi mang thai: Nguy hiểm thế nào?</strong></h2><p>Hút thuốc lá trong thai kỳ là một trong những nguyên nhân hàng đầu gây ra các biến chứng nguy hiểm cho cả mẹ và thai nhi. Dù chỉ một lượng nhỏ nicotin và khói thuốc cũng có thể gây hậu quả nghiêm trọng đến sự phát triển của bé. Hãy cùng khám phá những rủi ro mà mẹ bầu và thai nhi có thể phải đối mặt khi tiếp xúc với thuốc lá.</p><hr><h3>🧬 <strong>1. Ảnh hưởng đến thai nhi ngay từ trong bụng mẹ</strong></h3><ul><li><p><strong>Giảm cung cấp oxy:</strong> Nicotin làm co mạch máu, giảm lượng máu và oxy truyền từ mẹ sang thai nhi.</p></li><li><p><strong>Chậm phát triển trong tử cung (IUGR):</strong> Thai nhi có thể bị thiếu cân, nhỏ hơn so với tuổi thai.</p></li><li><p><strong>Tăng nguy cơ dị tật bẩm sinh:</strong> Thuốc lá làm tăng khả năng mắc dị tật môi – vòm miệng, tim mạch và hệ thần kinh trung ương.</p></li></ul><hr><h3>❗ <strong>2. Nguy cơ sảy thai và sinh non cao hơn</strong></h3><ul><li><p>Mẹ hút thuốc có nguy cơ sảy thai cao hơn so với người không hút.</p></li><li><p>Tăng nguy cơ <strong>vỡ ối sớm</strong>, <strong>chuyển dạ sớm</strong> và <strong>sinh non</strong>, khiến bé sinh ra yếu, cần chăm sóc đặc biệt.</p></li></ul><hr><h3>💔 <strong>3. Thai chết lưu và đột tử sau sinh (SIDS)</strong></h3><ul><li><p>Hút thuốc lá làm tăng đáng kể nguy cơ thai chết lưu (thai chết trong tử cung ở giai đoạn muộn).</p></li><li><p>Sau khi sinh, trẻ có mẹ hút thuốc có nguy cơ bị <strong>hội chứng đột tử ở trẻ sơ sinh</strong> cao hơn bình thường.</p></li></ul><hr><h3>🤱 <strong>4. Tác động kéo dài đến sự phát triển của trẻ</strong></h3><ul><li><p>Trẻ có mẹ hút thuốc khi mang thai dễ bị:</p><ul><li><p>Bệnh hô hấp như hen suyễn, viêm phổi</p></li><li><p>Chậm phát triển về thể chất và trí tuệ</p></li><li><p>Khó khăn trong học tập và hành vi sau này</p></li></ul></li></ul><hr><h3>🧍‍♀️ <strong>5. Nguy hiểm cả khi mẹ không trực tiếp hút (hút thuốc thụ động)</strong></h3><ul><li><p>Chỉ cần hít phải khói thuốc từ người khác cũng đủ để gây hại cho thai nhi.</p></li><li><p>Không gian sống có người hút thuốc khiến mẹ bầu vẫn tiếp xúc với hàng trăm chất độc hại.</p></li></ul><hr><h3>✅ <strong>Kết luận: Đừng để thuốc lá cướp đi tương lai của con bạn</strong></h3><ul><li><p>Bỏ thuốc trước và trong khi mang thai là quyết định đúng đắn nhất để bảo vệ con.</p></li><li><p>Nếu bạn là chồng, người thân hoặc người xung quanh mẹ bầu, hãy <strong>ngừng hút thuốc</strong> để tạo môi trường an toàn cho mẹ và bé.</p></li></ul>', 1, 'smoking-and-pregnancy'),
(N'Cách bỏ thuốc khi đang mang thai', '', N'Giải pháp hỗ trợ phụ nữ mang thai bỏ thuốc lá.', N'<h2>👶🚭 <strong>Cách bỏ thuốc khi đang mang thai</strong></h2><h3><em>Giải pháp hỗ trợ phụ nữ mang thai bỏ thuốc lá an toàn và hiệu quả</em></h3><p>Mang thai là khoảng thời gian tuyệt vời nhưng cũng đầy thách thức, đặc biệt với những người phụ nữ từng hút thuốc lá. Việc ngừng hút thuốc ngay khi biết mình mang thai không chỉ giúp bảo vệ sức khỏe của mẹ mà còn là món quà quý giá nhất dành cho con. Dưới đây là các giải pháp thiết thực giúp phụ nữ mang thai bỏ thuốc hiệu quả:</p><hr><h3>✅ <strong>1. Hiểu rõ tác hại để có động lực mạnh mẽ</strong></h3><ul><li><p>Nhận thức đầy đủ về hậu quả thuốc lá gây ra cho thai nhi (dị tật, sinh non, thai chết lưu…) giúp tăng quyết tâm từ bỏ.</p></li><li><p>Hãy tưởng tượng hình ảnh một thai nhi khỏe mạnh và dùng điều đó làm mục tiêu mỗi ngày.</p></li></ul><p></p><h3>💬 <strong>2. Tâm sự với bác sĩ, hộ sinh hoặc chuyên gia</strong></h3><ul><li><p>Chủ động trao đổi với bác sĩ sản khoa để được tư vấn cách bỏ thuốc phù hợp khi mang thai.</p></li><li><p>Không nên tự dùng các sản phẩm thay thế nicotine (kẹo, miếng dán) nếu chưa có chỉ định y tế.</p></li></ul><p></p><h3>💪 <strong>3. Tìm kiếm sự hỗ trợ từ người thân</strong></h3><ul><li><p>Nhờ chồng/người thân <strong>ngừng hút thuốc cùng</strong> để tạo môi trường không khói thuốc trong nhà.</p></li><li><p>Chia sẻ với gia đình và bạn bè để nhận được sự động viên, nhắc nhở khi cảm thấy muốn hút lại.</p></li></ul><p></p><h3>📱 <strong>4. Tham gia các chương trình hỗ trợ bỏ thuốc</strong></h3><ul><li><p>Tham gia các nhóm tư vấn tâm lý, nhóm hỗ trợ bỏ thuốc qua điện thoại hoặc online.</p></li><li><p>Một số tổ chức y tế (ví dụ: Bộ Y tế, Bệnh viện Phụ sản) có chương trình hướng dẫn dành riêng cho bà bầu.</p></li></ul><p></p><h3>🎯 <strong>5. Tránh xa các yếu tố kích thích</strong></h3><ul><li><p>Tránh các tình huống dễ khiến bạn nhớ đến thuốc lá như cà phê, tụ tập bạn bè hút thuốc, căng thẳng.</p></li><li><p>Thay thế thói quen hút thuốc bằng các hoạt động lành mạnh như: uống nước, đi bộ, tập yoga nhẹ, đọc sách,...</p></li></ul><p></p><h3>🧘‍♀️ <strong>6. Quản lý căng thẳng bằng phương pháp tự nhiên</strong></h3><ul><li><p>Tập hít thở sâu, thiền hoặc nghe nhạc thư giãn để giảm lo âu, stress – nguyên nhân phổ biến khiến người mang thai hút thuốc trở lại.</p></li><li><p>Nghỉ ngơi đủ giấc và ăn uống lành mạnh giúp tinh thần ổn định hơn.</p></li></ul><p></p><h3>🍼 <strong>Kết luận: Bỏ thuốc là món quà đầu đời bạn dành cho con</strong></h3><p>Không bao giờ là quá muộn để bỏ thuốc, đặc biệt khi bạn đang nuôi dưỡng một sinh linh bé nhỏ. Với sự hỗ trợ đúng cách và lòng quyết tâm, bạn hoàn toàn có thể vượt qua thói quen này – vì con, vì chính mình.</p>', 1, 'smoking-and-pregnancy'),
(N'Câu chuyện từ những bà mẹ đã bỏ thuốc', '', N'Chia sẻ thực tế từ phụ nữ đã cai thuốc trong thai kỳ.', N'<h2>👩‍🍼 <strong>Câu chuyện từ những bà mẹ đã bỏ thuốc</strong></h2><h3><em>Chia sẻ thực tế từ phụ nữ đã cai thuốc trong thai kỳ</em></h3><p>Không phải ai cũng dễ dàng từ bỏ thuốc lá, nhất là khi nó đã trở thành một phần trong cuộc sống hàng ngày. Nhưng nhiều phụ nữ đã chứng minh rằng: <strong>khi mang thai – vì con, họ có thể làm được điều tưởng chừng không thể</strong>. Dưới đây là những câu chuyện truyền cảm hứng từ những người mẹ đã vượt qua thói quen hút thuốc trong thai kỳ:</p><hr><h3>💬 <strong>1. Minh – 28 tuổi, Hà Nội</strong></h3><p><strong>“Tôi từng hút gần một gói mỗi ngày suốt 5 năm. Khi biết mình mang thai, tôi hoảng loạn và cảm thấy tội lỗi.”</strong></p><p>Minh chia sẻ: “Trong tuần đầu tiên, tôi mất ngủ, bứt rứt và cáu gắt. Nhưng rồi tôi tưởng tượng hình ảnh con mình sinh ra khỏe mạnh, tôi nắm tay con đi học, đi chơi. Chính hình ảnh đó giúp tôi vượt qua cơn thèm thuốc.”</p><p>Hiện tại, Minh đã sinh bé trai khỏe mạnh 3,2kg và hoàn toàn không hút lại sau sinh. Cô cho biết: “Bỏ thuốc khiến tôi thấy mình mạnh mẽ hơn bao giờ hết.”</p><hr><h3>💬 <strong>2. Hồng – 31 tuổi, TP. HCM</strong></h3><p><strong>“Tôi không nghĩ mình sẽ bỏ được, nhưng bác sĩ đã khiến tôi thay đổi.”</strong></p><p>Hồng kể: “Trong buổi khám thai đầu tiên, bác sĩ cho tôi xem hình ảnh phổi của thai nhi tiếp xúc với khói thuốc. Tôi đã khóc. Tôi gọi cho chồng ngay lúc đó và nói: ‘Chúng ta phải bỏ thuốc, cả hai vợ chồng’. Và chúng tôi đã làm được.”</p><p>Giờ đây, bé gái của Hồng phát triển rất tốt. “Tôi cảm thấy mình đã cho con một khởi đầu mới – trong lành hơn.”</p><hr><h3>💬 <strong>3. Trang – 24 tuổi, Đà Nẵng</strong></h3><p><strong>“Tôi chọn yêu con nhiều hơn là yêu thuốc lá.”</strong></p><p>Trang là một người mẹ đơn thân, từng nghĩ thuốc lá là cách duy nhất để giải tỏa căng thẳng. Nhưng khi thấy nhịp tim thai đập mạnh mẽ trên màn hình siêu âm, cô quyết định dừng lại.</p><p>“Tôi thay thuốc lá bằng việc đi bộ mỗi sáng, uống nước cam và viết nhật ký thai kỳ. Dần dần tôi không còn nghĩ đến thuốc nữa.”</p><hr><h3>❤️ <strong>Thông điệp chung: Bạn không đơn độc</strong></h3><p>Mỗi người mẹ đều có nỗi sợ, có thử thách. Nhưng hàng ngàn phụ nữ đã làm được – và bạn cũng có thể. Hãy tìm sự hỗ trợ, đừng ngại chia sẻ, và luôn nhớ: <strong>bỏ thuốc không chỉ cứu chính bạn, mà còn cứu lấy một cuộc đời đang lớn lên từng ngày trong bạn.</strong></p>', 1, 'smoking-and-pregnancy'),

-- helping-friends-and-family-quit
(N'Giúp người thân bỏ thuốc lá', '', N'Cách bạn có thể hỗ trợ người thân trong quá trình cai thuốc.', N'<h2>❤️ <strong>Giúp người thân bỏ thuốc lá</strong></h2><h3><em>Cách bạn có thể hỗ trợ người thân trong hành trình cai thuốc</em></h3><p>Bỏ thuốc lá là một hành trình đầy thử thách, nhưng <strong>người thân yêu của bạn không cần phải bước đi một mình</strong>. Sự hỗ trợ đúng cách từ gia đình, bạn bè có thể tạo nên sự khác biệt lớn, giúp họ vượt qua cơn thèm thuốc và duy trì cuộc sống không khói thuốc lâu dài. Dưới đây là những cách hiệu quả để bạn đồng hành cùng họ:</p><hr><h3>✅ <strong>1. Lắng nghe thay vì phán xét</strong></h3><ul><li><p>Đừng chỉ trích hay làm họ cảm thấy tội lỗi vì hút thuốc.</p></li><li><p>Hãy lắng nghe họ chia sẻ lý do vì sao muốn bỏ thuốc và những khó khăn họ đang đối mặt.</p></li></ul><p><strong>👉 Thái độ thấu hiểu, đồng cảm sẽ giúp họ cảm thấy được ủng hộ và vững vàng hơn.</strong></p><hr><h3>🗓️ <strong>2. Giúp họ lập kế hoạch bỏ thuốc</strong></h3><ul><li><p>Cùng họ chọn ngày bắt đầu cai thuốc.</p></li><li><p>Gợi ý họ ghi lại những lý do muốn bỏ thuốc và đọc lại khi cần động lực.</p></li><li><p>Nếu cần, hỗ trợ họ tìm đến bác sĩ, tư vấn tâm lý hoặc chương trình cai thuốc chuyên nghiệp.</p></li></ul><hr><h3>💬 <strong>3. Trở thành nguồn động viên tích cực</strong></h3><ul><li><p>Khen ngợi họ mỗi lần vượt qua một cơn thèm thuốc.</p></li><li><p>Nhắc nhở nhẹ nhàng nhưng không gây áp lực.</p></li><li><p>Cùng họ ăn mừng những cột mốc nhỏ: 1 ngày, 1 tuần, 1 tháng không hút thuốc.</p></li></ul><hr><h3>🚫 <strong>4. Tạo môi trường không khói thuốc</strong></h3><ul><li><p>Không hút thuốc trước mặt người đang cai.</p></li><li><p>Giữ không gian sống sạch sẽ, không có mùi thuốc lá hay gạt tàn.</p></li><li><p>Giúp họ loại bỏ thuốc lá, bật lửa, gạt tàn trong nhà.</p></li></ul><hr><h3>🤝 <strong>5. Tham gia thay đổi lối sống cùng họ</strong></h3><ul><li><p>Cùng tập thể dục, đi dạo, uống nước, chơi thể thao – để phân tán sự chú ý khỏi cơn thèm thuốc.</p></li><li><p>Cùng thử món ăn mới, sở thích mới thay vì hút thuốc sau bữa ăn như thói quen cũ.</p></li></ul><hr><h3>💡 <strong>6. Kiên nhẫn – vì cai thuốc là cả một quá trình</strong></h3><ul><li><p>Thỉnh thoảng họ có thể tái nghiện – đó là bình thường.</p></li><li><p>Hãy ở bên, khích lệ họ <strong>bắt đầu lại</strong> thay vì trách móc.</p></li><li><p>Chính sự kiên trì của bạn là điều họ sẽ ghi nhớ suốt đời.</p></li></ul><hr><h3>🧠 <strong>Kết luận</strong></h3><p>Bạn không cần làm điều gì to tát. <strong>Chỉ cần hiện diện, ủng hộ và nhắc họ rằng: bạn tin họ làm được.</strong><br>Tình yêu thương và sự đồng hành của bạn có thể là chìa khóa giúp người thân thoát khỏi thuốc lá – để sống lâu hơn, khỏe hơn và hạnh phúc hơn.</p>', 1, 'helping-friends-and-family-quit'),
(N'Nên và không nên nói gì', '', N'Những câu nói có thể giúp hoặc làm hại quá trình cai thuốc.', N'<h2>🗣️ <strong>Nên và không nên nói gì</strong></h2><h3><em>Những lời nói có thể giúp hoặc cản trở quá trình bỏ thuốc lá</em></h3><p>Khi một người thân đang cố gắng bỏ thuốc, <strong>những gì bạn nói có thể ảnh hưởng rất lớn đến tâm lý và quyết tâm của họ</strong>. Một lời động viên đúng lúc có thể nâng đỡ tinh thần, trong khi một lời chê trách có thể khiến họ nản lòng và từ bỏ nỗ lực. Dưới đây là những điều <strong>nên</strong> và <strong>không nên</strong> nói trong quá trình hỗ trợ:</p><hr><h3>✅ <strong>NÊN NÓI – Những lời giúp người cai thuốc thêm động lực</strong></h3><ol><li><p><strong>“Anh/em/bố/mẹ đang làm rất tốt, tiếp tục cố gắng nhé!”</strong><br>→ Lời khen ngợi đơn giản nhưng mang lại cảm giác được công nhận.</p></li><li><p><strong>“Anh có thể dựa vào em bất cứ khi nào thấy thèm thuốc.”</strong><br>→ Tạo cảm giác an toàn, không cô đơn.</p></li><li><p><strong>“Anh đã đi được xa rồi, đừng bỏ cuộc nha.”</strong><br>→ Nhắc họ nhớ về nỗ lực và hành trình đã vượt qua.</p></li><li><p><strong>“Hãy nghĩ đến con/cháu/em bé – anh làm điều này không chỉ cho mình mà còn cho gia đình.”</strong><br>→ Kết nối hành động bỏ thuốc với giá trị lớn hơn.</p></li><li><p><strong>“Mỗi ngày không hút thuốc là một chiến thắng.”</strong><br>→ Giúp họ trân trọng từng bước nhỏ.</p></li></ol><hr><h3>❌ <strong>KHÔNG NÊN NÓI – Những lời khiến họ tổn thương hoặc bỏ cuộc</strong></h3><ol><li><p><strong>“Sao không bỏ nổi mấy điếu thuốc, yếu thế?”</strong><br>→ Làm họ cảm thấy xấu hổ, bị hạ thấp.</p></li><li><p><strong>“Anh lại hút à? Vô ích thật.”</strong><br>→ Một lần trượt ngã không có nghĩa là thất bại. Đừng biến họ thành tội đồ.</p></li><li><p><strong>“Bỏ thuốc có gì khó đâu, người ta làm được đầy.”</strong><br>→ Mỗi người khác nhau. So sánh khiến họ cảm thấy mình kém cỏi.</p></li><li><p><strong>“Nếu anh thực sự yêu em thì anh đã bỏ rồi.”</strong><br>→ Tạo cảm giác tội lỗi thay vì động viên, dễ dẫn đến phản ứng tiêu cực.</p></li><li><p><strong>“Anh hứa bao nhiêu lần rồi? Lần này lại thất bại thôi.”</strong><br>→ Làm họ mất niềm tin vào chính mình.</p></li></ol><p></p><h3>💡 <strong>Kết luận</strong></h3><p>Ngôn ngữ không chỉ là giao tiếp – <strong>nó là thuốc chữa lành hoặc vết thương âm thầm</strong>. Hãy dùng lời nói để tiếp thêm nghị lực cho người thân trong hành trình bỏ thuốc.<br><strong>Một câu nói tích cực của bạn hôm nay có thể là lý do để họ không hút thuốc ngày mai.</strong></p>', 1, 'helping-friends-and-family-quit'),
(N'Làm bạn đồng hành trong hành trình cai thuốc', '', N'Vai trò của bạn như một người đồng hành.', N'<h2>👥 <strong>Làm bạn đồng hành trong hành trình cai thuốc</strong></h2><h3><em>Vai trò của bạn như một người đồng hành tích cực</em></h3><p>Bỏ thuốc lá không chỉ là cuộc chiến của riêng người hút thuốc mà còn là hành trình của cả những người xung quanh họ. Là người thân, bạn bè, đồng nghiệp – <strong>bạn có thể trở thành nguồn sức mạnh quan trọng giúp họ vượt qua thử thách</strong>. Dưới đây là vai trò và những cách bạn có thể thực hiện để trở thành người đồng hành thực sự:</p><hr><h3>❤️ <strong>1. Là người tạo động lực tinh thần</strong></h3><ul><li><p>Lời nói tích cực, sự động viên đúng lúc sẽ giúp người cai thuốc cảm thấy được quan tâm, không đơn độc.</p></li><li><p>Bạn chính là chỗ dựa mỗi khi họ cảm thấy yếu lòng hay muốn bỏ cuộc.</p></li></ul><blockquote><p>“Anh làm rất tốt. Em tin anh sẽ thành công.” – Đơn giản nhưng đầy sức mạnh.</p></blockquote><hr><h3>👂 <strong>2. Là người lắng nghe, không phán xét</strong></h3><ul><li><p>Hành trình bỏ thuốc có thể có nhiều lần tái nghiện. Đừng chỉ trích. Hãy lắng nghe lý do, cảm xúc, khó khăn mà họ trải qua.</p></li><li><p>Sự cảm thông sẽ giúp họ tin tưởng và tiếp tục cố gắng.</p></li></ul><hr><h3>🧭 <strong>3. Là người giúp định hướng</strong></h3><ul><li><p>Gợi ý những hoạt động thay thế hút thuốc: đi dạo, uống nước, ăn nhẹ lành mạnh, thể thao.</p></li><li><p>Giúp họ lên kế hoạch cai thuốc, nhắc nhở nhẹ nhàng nhưng không gây áp lực.</p></li></ul><hr><h3>🧹 <strong>4. Là người giữ môi trường “sạch khói”</strong></h3><ul><li><p>Giữ không gian sống không có mùi thuốc, không để bật lửa hay gạt tàn trong nhà.</p></li><li><p>Nếu bạn từng hút thuốc, hãy <strong>cùng bỏ</strong> hoặc <strong>hút ở nơi khác</strong> để không gây cám dỗ.</p></li></ul><hr><h3>📅 <strong>5. Là người ghi nhận từng bước tiến</strong></h3><ul><li><p>Cùng họ ăn mừng mỗi ngày không hút thuốc. Việc này giúp duy trì cảm hứng và tăng sự tự hào.</p></li><li><p>Ghi chú các mốc quan trọng: 1 ngày – 1 tuần – 1 tháng – 6 tháng không hút thuốc.</p></li></ul><hr><h3>🧠 <strong>6. Là người hiểu rằng: bỏ thuốc là một quá trình, không phải kết quả ngay lập tức</strong></h3><ul><li><p>Hãy kiên nhẫn. Hành trình này có thể kéo dài và gian nan.</p></li><li><p>Sự hiện diện bền bỉ của bạn chính là món quà lớn nhất.</p></li></ul><hr><h3>🎯 <strong>Kết luận</strong></h3><p>Bạn không cần phải là chuyên gia để giúp người thân bỏ thuốc. <strong>Chỉ cần làm một người bạn đồng hành chân thành, nhẫn nại và đầy yêu thương</strong>, bạn đã giúp họ tiến gần hơn tới một cuộc sống khỏe mạnh, không khói thuốc.</p>', 1, 'helping-friends-and-family-quit'),

-- cravings-triggers-and-routines
(N'Nhận diện các yếu tố kích thích thèm thuốc', '', N'Hiểu rõ nguyên nhân khiến bạn muốn hút thuốc.', N'<div style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; background-color: #f9f9f9; color: #333;">
<h1 style="color:#2c3e50; font-size:28px; margin-bottom:10px;">🔍 Nhận diện các yếu tố kích thích thèm thuốc</h1>
<p><strong>Hiểu rõ nguyên nhân khiến bạn muốn hút thuốc – bước đầu để kiểm soát cơn thèm</strong></p>
<p>Thèm thuốc không xảy ra ngẫu nhiên. Nó thường bị kích hoạt bởi những tình huống, cảm xúc hoặc thói quen lặp lại. Việc <span style="font-weight:bold; color:#e74c3c;">hiểu rõ các yếu tố kích thích</span> giúp bạn chủ động phòng tránh và kiểm soát tốt hơn.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">✅ 1. Thói quen hằng ngày gắn liền với việc hút thuốc</h2>
<ul style="margin-top:5px;"><li>Sau bữa ăn</li><li>Uống cà phê, trà</li><li>Khi chờ đợi hoặc buồn chán</li></ul>
<p><em>👉 Giải pháp:</em> Thay bằng kẹo cao su, uống nước, đi bộ, nghe nhạc hoặc trò chuyện với người khác.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">😤 2. Căng thẳng, lo âu hoặc buồn bã</h2>
<p><em>👉 Giải pháp:</em> Hít thở sâu, thiền, chia sẻ cảm xúc, viết nhật ký.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">👥 3. Ảnh hưởng từ môi trường và người xung quanh</h2>
<p><em>👉 Giải pháp:</em> Tránh nơi có người hút thuốc, yêu cầu không hút gần bạn, tìm nhóm hỗ trợ.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">⏱️ 4. Thời gian trống, rảnh rỗi</h2>
<p><em>👉 Giải pháp:</em> Lấp đầy bằng hoạt động tích cực như học tập, đọc sách, tập thể dục.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">💭 5. Suy nghĩ cho phép bản thân</h2>
<p><em>👉 Giải pháp:</em> Đọc lại lý do bỏ thuốc, nghĩ đến gia đình và mục tiêu dài hạn.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🧠 6. Các phản ứng sinh lý (thiếu nicotine)</h2>
<p><em>👉 Giải pháp:</em> Uống nước, ngủ đủ, ăn trái cây, tập thể dục, hỗ trợ y tế nếu cần.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🎯 Kết luận</h2>
<p><strong>Hiểu được yếu tố kích thích = kiểm soát cơn thèm.</strong> Hãy ghi chú lại các tình huống thường gặp và chuẩn bị sẵn cách ứng phó. Chủ động nhận diện là bước đầu tiên để chiến thắng thuốc lá!</p>
</div>', 1, 'cravings-triggers-and-routines'),
(N'Phá vỡ thói quen hút thuốc', '', N'Chiến lược thay đổi hành vi thường ngày.', N'<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; background-color: #f9f9f9; color: #333;">
<h1 style="color:#2c3e50; font-size:28px; margin-bottom:10px;">🚫 Phá vỡ thói quen hút thuốc</h1>
<p><strong>Chiến lược thay đổi hành vi thường ngày giúp bạn kiểm soát và từ bỏ thuốc lá hiệu quả</strong></p>
<p>Thói quen hút thuốc thường gắn với các hành vi lặp lại mỗi ngày như uống cà phê, lái xe, hay sau giờ làm việc. Để bỏ thuốc thành công, bạn không chỉ cần ý chí mà còn cần <span style="font-weight:bold; color:#e74c3c;">thay đổi hành vi và môi trường xung quanh</span>.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">✅ 1. Nhận diện thời điểm bạn thường hút thuốc</h2>
<p>Hãy ghi lại các thời điểm bạn thấy mình thèm thuốc nhất: sau bữa ăn, khi căng thẳng, lúc nghỉ trưa... Việc hiểu rõ "thời điểm nguy hiểm" giúp bạn có chiến lược thay thế phù hợp.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🔄 2. Tạo thay đổi nhỏ trong thói quen hàng ngày</h2>
<ul style="margin-top:5px;"><li>Thay vì cà phê – hãy thử trà thảo mộc</li><li>Thay vì ngồi một mình – hãy đi bộ nhẹ nhàng</li><li>Thay vì hút thuốc sau ăn – đánh răng, uống nước, nghe nhạc</li></ul>
<p><em>👉 Mục tiêu:</em> Tạo cảm giác mới mẻ, tránh gợi nhớ hành vi hút thuốc cũ.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">💪 3. Xây dựng thói quen lành mạnh thay thế</h2>
<p>Tập thể dục, viết nhật ký, vẽ tranh, học kỹ năng mới hoặc tham gia các hoạt động cộng đồng – tất cả đều giúp bạn lấp đầy khoảng trống do thuốc lá để lại.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🧠 4. Tự nhắc nhở bản thân bằng cách nhìn thấy lý do</h2>
<p>Dán hình ảnh người thân, ghi chú động lực như “Tôi làm điều này vì con” ở nơi dễ nhìn thấy – để mỗi lần bạn định hút thuốc, bạn nhớ lý do vì sao mình bắt đầu cai.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🤝 5. Chia sẻ với người khác</h2>
<p>Khi cảm thấy yếu lòng, hãy nói chuyện với người bạn tin tưởng. Sự chia sẻ sẽ giúp bạn giảm áp lực và tăng sức mạnh tinh thần.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🎯 Kết luận</h2>
<p><strong>Thay đổi hành vi là chìa khóa để phá vỡ thói quen hút thuốc.</strong> Hãy kiên trì thay đổi từng chút một trong sinh hoạt hằng ngày. Mỗi bước nhỏ hôm nay là một bước gần hơn đến cuộc sống không khói thuốc ngày mai.</p>
</body>
', 1, 'cravings-triggers-and-routines'),
(N'Thực hành chánh niệm khi thèm thuốc', '', N'Áp dụng thiền chánh niệm để vượt qua cơn thèm.', N'<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; background-color: #f9f9f9; color: #333;">
<h1 style="color:#2c3e50; font-size:28px; margin-bottom:10px;">🧘 Thực hành chánh niệm khi thèm thuốc</h1>
<p><strong>Áp dụng thiền chánh niệm để vượt qua cơn thèm một cách bình tĩnh và chủ động</strong></p>
<p>Thèm thuốc là cảm giác mạnh mẽ, nhưng không phải là không thể vượt qua. Thay vì chống lại cơn thèm một cách căng thẳng, bạn có thể <span style="font-weight:bold; color:#e74c3c;">quan sát và đối diện với nó bằng chánh niệm</span> – một phương pháp thiền đơn giản nhưng đầy hiệu quả.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">✅ 1. Chánh niệm là gì?</h2>
<p>Chánh niệm là trạng thái nhận biết rõ ràng những gì đang xảy ra trong hiện tại – mà không phán xét hay phản ứng vội vàng. Với người đang cai thuốc, chánh niệm giúp bạn quan sát cơn thèm như một hiện tượng thoáng qua, thay vì bị cuốn theo nó.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🌀 2. Khi cơn thèm xuất hiện, hãy dừng lại và thở</h2>
<p>Đừng vội phản ứng. Hãy dừng mọi việc đang làm và thực hiện 3–5 nhịp thở sâu. Tập trung vào hơi thở giúp làm dịu hệ thần kinh và giảm phản xạ hút thuốc.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">👁️ 3. Quan sát cảm giác trong cơ thể</h2>
<p>Đặt tay lên ngực hoặc bụng. Tự hỏi: "Tôi đang cảm thấy gì? Căng thẳng ở đâu? Cơn thèm này giống như sóng, liệu tôi có thể đứng yên quan sát nó không?"</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">📝 4. Ghi nhận mà không phán xét</h2>
<p>Hãy nói thầm: “Đây là cảm giác thèm thuốc – nó sẽ qua như mọi cảm xúc khác.” Đừng tự trách mình vì thấy thèm. Thay vào đó, hãy ghi nhận: “Tôi đang học cách vượt qua nó.”</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🕒 5. Duy trì 5 phút yên lặng</h2>
<p>Ngồi yên, tập trung vào hơi thở ra vào, hoặc lắng nghe âm thanh xung quanh. Sau vài phút, cơn thèm sẽ yếu dần. Bạn sẽ ngạc nhiên vì mình có thể vượt qua mà không cần đến thuốc.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🎯 Kết luận</h2>
<p><strong>Chánh niệm không làm cơn thèm biến mất ngay lập tức, nhưng giúp bạn làm chủ bản thân khi đối diện với nó.</strong> Hãy thực hành mỗi ngày, đặc biệt trong những thời điểm bạn thấy yếu lòng. Từng khoảnh khắc tỉnh thức sẽ dẫn bạn đến cuộc sống tự do khỏi thuốc lá.</p>
</body>
', 1, 'cravings-triggers-and-routines'),

-- preparing-to-stop-smoking
(N'Chuẩn bị cuối cùng trước ngày cai thuốc', '', N'Danh sách kiểm tra trước khi bắt đầu.', N'<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; background-color: #f9f9f9; color: #333;">
<h1 style="color:#2c3e50; font-size:28px; margin-bottom:10px;">📆 Chuẩn bị cuối cùng trước ngày cai thuốc</h1>
<p><strong>Danh sách kiểm tra trước khi bắt đầu giúp bạn bước vào hành trình bỏ thuốc với sự tự tin và sẵn sàng</strong></p>
<p>Ngày cai thuốc có thể là cột mốc quan trọng trong cuộc đời bạn. Việc chuẩn bị kỹ lưỡng giúp giảm căng thẳng, tăng khả năng thành công và giúp bạn chủ động đối mặt với các thử thách. Dưới đây là danh sách những điều <span style="font-weight:bold; color:#e74c3c;">nên làm trước ngày chính thức bắt đầu</span>.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">✅ 1. Chọn một ngày cụ thể</h2>
<p>Hãy chọn ngày mà bạn ít bị áp lực và có thể kiểm soát thời gian – ví dụ cuối tuần, nghỉ phép hoặc sau một dịp lễ. Ghi rõ ngày đó vào lịch và coi đó là “Ngày Tự Do”.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🧹 2. Dọn dẹp môi trường sống</h2>
<p>Loại bỏ tất cả thuốc lá, bật lửa, gạt tàn trong nhà, xe hơi, túi xách. Làm sạch mùi khói trong không gian sống để không bị gợi nhớ.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">📋 3. Chuẩn bị các vật thay thế</h2>
<ul style="margin-top:5px;"><li>Kẹo cao su không đường hoặc kẹo ngậm</li><li>Trái cây tươi, nước lọc, ống hút</li><li>Bút, đồ chơi chống stress, đồ bóp tay</li></ul>
<p><em>👉 Mục tiêu:</em> Sẵn sàng cho cảm giác thèm thuốc mà không cần phải hút.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">📞 4. Thông báo cho người thân, bạn bè</h2>
<p>Hãy nói với những người thân thiết về kế hoạch bỏ thuốc của bạn. Nhờ họ hỗ trợ, động viên, và không hút thuốc trước mặt bạn trong những ngày đầu.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🧠 5. Ghi lại lý do bạn muốn bỏ thuốc</h2>
<p>Viết ra 3–5 lý do quan trọng nhất khiến bạn quyết định bỏ thuốc: vì sức khỏe, vì con cái, vì tiết kiệm,... và giữ chúng bên mình như một nguồn động lực.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">📱 6. Tải app hỗ trợ hoặc chuẩn bị sổ theo dõi</h2>
<p>Có thể dùng ứng dụng cai thuốc hoặc sổ tay để ghi nhận hành trình mỗi ngày. Điều này giúp bạn theo dõi tiến trình và giữ vững cam kết.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🎯 Kết luận</h2>
<p><strong>Chuẩn bị tốt chính là đặt nền móng vững chắc cho hành trình bỏ thuốc.</strong> Ngày cai thuốc không cần hoàn hảo, chỉ cần bạn sẵn sàng. Hãy bước vào ngày đó như một ngày bắt đầu cuộc sống mới – khỏe mạnh, tự do và không khói thuốc.</p>
</body>
', 1, 'preparing-to-stop-smoking'),
(N'Những vật dụng cần thiết khi bỏ thuốc', '', N'Dụng cụ hỗ trợ như kẹo cao su nicotine, miếng dán...', N'<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; background-color: #f9f9f9; color: #333;">
<h1 style="color:#2c3e50; font-size:28px; margin-bottom:10px;">🧰 Những vật dụng cần thiết khi bỏ thuốc</h1>
<p><strong>Dụng cụ hỗ trợ như kẹo cao su nicotine, miếng dán... giúp bạn vượt qua cơn thèm một cách an toàn và chủ động</strong></p>
<p>Bỏ thuốc không phải là việc đơn giản, nhưng bạn không cần phải “chiến đấu tay không”. Có rất nhiều vật dụng và công cụ hỗ trợ giúp bạn kiểm soát cơn thèm nicotine và giữ vững cam kết. Dưới đây là danh sách những vật dụng <span style="font-weight:bold; color:#e74c3c;">nên có bên mình trong quá trình cai thuốc</span>.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🧃 1. Kẹo cao su nicotine (Nicotine gum)</h2>
<p>Là một dạng thay thế nicotine giúp giảm dần cơn thèm mà không gây hại như thuốc lá. Dùng mỗi khi cảm thấy khó chịu hoặc muốn hút, đặc biệt trong tuần đầu tiên.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🩹 2. Miếng dán nicotine (Nicotine patch)</h2>
<p>Dán lên da để cung cấp lượng nicotine ổn định trong ngày. Giúp giảm các triệu chứng thiếu thuốc như bứt rứt, cáu gắt, khó tập trung. Thường dùng vào buổi sáng và tháo ra trước khi ngủ.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🍬 3. Kẹo ngậm, bạc hà, nước lạnh</h2>
<p>Giúp miệng bạn bận rộn thay vì cầm điếu thuốc. Nên chọn loại không đường và luôn mang theo bên mình, nhất là khi ra ngoài.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🖊️ 4. Vật thay thế cử động tay – bút, đồ bóp tay, ống hút</h2>
<p>Nhiều người thèm hút do quen cầm điếu thuốc. Hãy dùng bút, bóp tay chống stress hoặc ống hút để tay bận rộn, giảm cảm giác thiếu thói quen.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">📱 5. Ứng dụng cai thuốc hoặc sổ tay theo dõi</h2>
<p>Ghi chú số ngày không hút, số tiền tiết kiệm, cảm xúc trong từng giai đoạn. Việc theo dõi giúp bạn thấy được tiến bộ và giữ vững cam kết dài hạn.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">📖 6. Danh sách lý do bỏ thuốc và hình ảnh truyền động lực</h2>
<p>Dán những lý do bỏ thuốc hoặc ảnh người thân, ảnh mục tiêu (sức khỏe, con cái, du lịch...) ở nơi dễ thấy để tiếp thêm sức mạnh tinh thần mỗi ngày.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🎯 Kết luận</h2>
<p><strong>Dụng cụ hỗ trợ không thay thế ý chí, nhưng là vũ khí hữu ích trong hành trình bỏ thuốc.</strong> Hãy chuẩn bị những vật đơn giản nhưng hiệu quả này trước ngày bắt đầu để bạn luôn chủ động khi đối mặt với cơn thèm thuốc.</p>
</body>
', 1, 'preparing-to-stop-smoking'),
(N'Tạo dựng mạng lưới hỗ trợ', '', N'Những ai sẽ giúp bạn giữ vững ý chí cai thuốc.', N'<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; background-color: #f9f9f9; color: #333;">
<h1 style="color:#2c3e50; font-size:28px; margin-bottom:10px;">🤝 Tạo dựng mạng lưới hỗ trợ</h1>
<p><strong>Những ai sẽ giúp bạn giữ vững ý chí cai thuốc – và cách để xây dựng sự hỗ trợ hiệu quả</strong></p>
<p>Không ai phải bỏ thuốc một mình. Một mạng lưới hỗ trợ tốt không chỉ giúp bạn vượt qua cơn thèm thuốc mà còn tăng cơ hội thành công gấp nhiều lần. Việc xác định và kết nối với những người có thể giúp bạn là bước cực kỳ quan trọng trong hành trình cai thuốc.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🏡 1. Gia đình – vòng tròn hỗ trợ gần nhất</h2>
<p>Hãy chia sẻ rõ với vợ/chồng, bố mẹ, anh chị em về mong muốn bỏ thuốc của bạn. Yêu cầu họ hỗ trợ như: không hút gần bạn, nhắc nhở nhẹ nhàng, và khích lệ khi bạn làm tốt.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">👫 2. Bạn bè thân thiết</h2>
<p>Chọn một hoặc hai người bạn mà bạn tin tưởng để “đồng hành cai thuốc”. Nhờ họ gọi, nhắn tin kiểm tra hằng ngày hoặc trò chuyện mỗi khi bạn thấy yếu lòng.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">👨‍⚕️ 3. Bác sĩ hoặc chuyên gia tư vấn cai thuốc</h2>
<p>Những chuyên gia y tế có thể hướng dẫn bạn lựa chọn phương pháp phù hợp (kẹo, dán, thuốc) và hỗ trợ xử lý các triệu chứng cai. Đừng ngại xin tư vấn – đó là dấu hiệu của sự chủ động, không phải yếu đuối.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">👥 4. Nhóm hỗ trợ cộng đồng (offline hoặc online)</h2>
<p>Tham gia các nhóm người cùng bỏ thuốc giúp bạn học hỏi kinh nghiệm, chia sẻ cảm xúc và thấy mình không đơn độc. Họ hiểu bạn vì họ cũng đang trải qua điều tương tự.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">📱 5. Ứng dụng hỗ trợ hoặc chatbot nhắc nhở</h2>
<p>Các app như QuitNow, Smoke Free... có cộng đồng người dùng, thống kê tiến trình, và nhắc nhở thông minh. Bạn có thể xem số ngày không hút, số tiền tiết kiệm và những mốc đáng tự hào.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">💡 Mẹo:</h2>
<p>In ra danh sách những người bạn có thể gọi khi thấy thèm thuốc. Đặt nó ở nơi dễ thấy để sẵn sàng nhấc máy thay vì châm thuốc.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🎯 Kết luận</h2>
<p><strong>Bỏ thuốc là hành trình cá nhân, nhưng bạn không cần đi một mình.</strong> Một lời động viên, một cái nắm tay, hay chỉ là sự hiện diện của người thân cũng đủ giúp bạn vững vàng hơn. Hãy chủ động xây dựng mạng lưới hỗ trợ – đó là vũ khí mạnh mẽ nhất bạn có thể có.</p>
</body>
', 1, 'preparing-to-stop-smoking'),

-- vaping
(N'Vape có an toàn hơn thuốc lá không?', '', N'Tìm hiểu về lợi ích và rủi ro của thuốc lá điện tử.', N'<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; background-color: #f9f9f9; color: #333;">
<h1 style="color:#2c3e50; font-size:28px; margin-bottom:10px;">💨 Vape có an toàn hơn thuốc lá không?</h1>
<p><strong>Tìm hiểu về lợi ích và rủi ro của thuốc lá điện tử để đưa ra lựa chọn đúng đắn cho sức khỏe</strong></p>
<p>Thuốc lá điện tử (vape) thường được quảng bá như một lựa chọn "an toàn hơn" so với thuốc lá truyền thống. Tuy nhiên, <span style="font-weight:bold; color:#e74c3c;">“ít hại hơn” không có nghĩa là “vô hại”</span>. Dưới đây là cái nhìn toàn diện về cả lợi ích và rủi ro của việc sử dụng vape.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">✅ 1. Vape có thể giúp một số người bỏ thuốc lá</h2>
<p>Một số người dùng vape như một bước trung gian để giảm dần lượng nicotine và tiến đến bỏ thuốc hoàn toàn. Vape không đốt cháy thuốc lá, nên không sinh ra hắc ín và carbon monoxide – hai chất gây hại chính trong khói thuốc.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">⚠️ 2. Tuy nhiên, vape vẫn chứa nicotine</h2>
<p>Nhiều loại vape chứa hàm lượng nicotine cao, gây nghiện tương tự thuốc lá. Nicotine ảnh hưởng đến não bộ, đặc biệt là ở thanh thiếu niên và phụ nữ mang thai. Nó làm tăng nhịp tim, huyết áp và có thể dẫn đến lệ thuộc lâu dài.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🧪 3. Các hóa chất trong hơi vape chưa được kiểm soát chặt chẽ</h2>
<p>Một số sản phẩm chứa formaldehyde, kim loại nặng (như chì), hương liệu tổng hợp có thể gây viêm phổi và kích ứng đường hô hấp. Nhiều nghiên cứu vẫn đang được tiến hành để đánh giá tác động dài hạn của vape lên sức khỏe con người.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">👦 4. Vape thu hút giới trẻ và có thể là “cửa ngõ” hút thuốc thật</h2>
<p>Hương vị trái cây, thiết kế thời trang khiến nhiều thanh thiếu niên dùng thử vape và sau đó chuyển sang hút thuốc thật. Nghiên cứu cho thấy người trẻ dùng vape có nguy cơ hút thuốc lá cao hơn gấp 3 lần.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">❌ 5. Không nên xem vape là giải pháp lâu dài</h2>
<p>Mục tiêu cuối cùng vẫn là <strong>không sử dụng nicotine dưới mọi hình thức</strong>. Dùng vape để cai thuốc nên có kế hoạch rõ ràng, thời gian cụ thể và sự tư vấn của bác sĩ.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🎯 Kết luận</h2>
<p><strong>Vape có thể ít hại hơn thuốc lá, nhưng không phải là an toàn.</strong> Nếu bạn không hút thuốc, đừng bắt đầu với vape. Nếu đang hút thuốc, hãy cân nhắc sử dụng vape như một bước chuyển ngắn hạn – nhưng mục tiêu cuối cùng vẫn là từ bỏ hoàn toàn cả vape và nicotine.</p>
</body>
', 1, 'vaping'),
(N'Vape và thanh thiếu niên', '', N'Những số liệu đáng lo ngại về giới trẻ sử dụng vape.', N'<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; background-color: #f9f9f9; color: #333;">
<h1 style="color:#2c3e50; font-size:28px; margin-bottom:10px;">📊 Vape và thanh thiếu niên – Những số liệu đáng lo ngại</h1>
<p><strong>Xem xét thực trạng sử dụng vape ở giới trẻ – xu hướng, nguy cơ và tác động sức khỏe</strong></p>
<p>Sự bùng nổ sử dụng thuốc lá điện tử ở thanh thiếu niên là vấn đề đáng báo động, đặc biệt vì não bộ của họ vẫn đang phát triển và dễ nghiện nicotine hơn người lớn.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🌍 Tình hình toàn cầu</h2>
<p>Trung bình khoảng 3,1 % trẻ 13‑15 tuổi trên toàn thế giới hiện đang dùng vape, cao hơn nữa tại Đông Nam Á với 3,6 % và Đông Địa Trung Hải là 4,2 % :contentReference[oaicite:0]{index=0}.</p>
<p>Tại Mỹ, năm 2024 có đến 1,63 triệu học sinh trung học và cấp 2 (5,9 %) đang dùng vape; trong đó 87 % dùng sản phẩm có hương vị và 26 % dùng mỗi ngày :contentReference[oaicite:1]{index=1}.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🇻🇳 Ở Việt Nam</h2>
<p>Tỷ lệ học sinh 13–17 tuổi dùng vape tăng từ 2,6 % năm 2019 lên 8,1 % năm 2023; nhóm 13–15 tuổi tăng từ 3,5 % năm 2022 lên 8 % năm 2023 :contentReference[oaicite:2]{index=2}.</p>
<p>Năm 2023, có 1.224 ca nhập viện do vape/nóng, trong đó 71 ca là trẻ dưới 18 tuổi :contentReference[oaicite:3]{index=3}.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">⚠️ Tác động và nguy cơ</h2>
<ul style="margin-top:5px;">
  <li>Nicotine gây nghiện mạnh, ảnh hưởng tới não phát triển ở trẻ vị thành niên :contentReference[oaicite:4]{index=4}.</li>
  <li>Vape có thể chứa chất độc như formaldehyde, kim loại nặng và hương liệu tổng hợp gây kích ứng đường hô hấp :contentReference[oaicite:5]{index=5}.</li>
  <li>Khoảng hơn 30 trẻ dưới 18 ở Anh phải nhập viện do bệnh liên quan vape, bao gồm khó thở, chóng mặt, nôn ói :contentReference[oaicite:6]{index=6}.</li>
  <li>Học sinh dùng mạng xã hội nhiều hơn 7 giờ/ngày có tỷ lệ vape cao gấp 4 lần so với bạn bè không dùng :contentReference[oaicite:7]{index=7}.</li>
</ul>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🎯 Kết luận</h2>
<p><strong>Vape không chỉ là mốt nhất thời – nó đã và đang trở thành mối nguy hiểm với thế hệ trẻ.</strong> Các con số đáng lo ngại về tỷ lệ sử dụng, các ca nhập viện và tác hại sinh lý nhấn mạnh rằng: cần hành động cấp bách hơn trong giáo dục, kiểm soát quảng cáo hương vị và cung cấp hỗ trợ cai nghiện.</p>
</body>
', 1, 'vaping'),
(N'Dùng vape để bỏ thuốc: Có nên không?', '', N'Đánh giá việc dùng vape làm bước đệm cai thuốc.', N'<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; background-color: #f9f9f9; color: #333;">
<h1 style="color:#2c3e50; font-size:28px; margin-bottom:10px;">🚬➡️💨 Dùng vape để bỏ thuốc: Có nên không?</h1>
<p><strong>Đánh giá khách quan về việc sử dụng thuốc lá điện tử như một bước đệm để cai thuốc lá truyền thống</strong></p>
<p>Nhiều người chuyển sang dùng thuốc lá điện tử (vape) như một cách để cai thuốc lá, với hy vọng đây là phương pháp "ít hại hơn". Nhưng liệu đây có phải là giải pháp an toàn và hiệu quả? Dưới đây là cái nhìn toàn diện về lợi ích, rủi ro và lời khuyên chuyên môn.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">✅ Lợi ích tiềm năng của việc dùng vape để cai thuốc</h2>
<ul style="margin-top:5px;">
<li>Vape không đốt cháy, nên không tạo ra hắc ín và carbon monoxide – 2 chất gây hại lớn nhất trong thuốc lá điếu.</li>
<li>Có thể giúp người hút giảm dần lượng nicotine khi được kiểm soát đúng cách.</li>
<li>Là lựa chọn thay thế phù hợp cho người đã từng thất bại với các phương pháp khác như kẹo cao su hay miếng dán nicotine.</li>
</ul>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">⚠️ Rủi ro cần cân nhắc</h2>
<ul style="margin-top:5px;">
<li>Vape vẫn chứa nicotine – chất gây nghiện mạnh, ảnh hưởng đến tim mạch và não bộ, đặc biệt ở người trẻ.</li>
<li>Nhiều người “chuyển từ thuốc sang vape” nhưng lại tiếp tục sử dụng lâu dài mà không có kế hoạch bỏ hẳn nicotine.</li>
<li>Vape có thể chứa các hóa chất độc hại khác (như formaldehyde, kim loại nặng) chưa được kiểm định đầy đủ về an toàn lâu dài.</li>
</ul>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🧠 Lời khuyên từ chuyên gia</h2>
<p>Nếu bạn không hút thuốc – <strong>đừng bắt đầu với vape</strong>. Nếu bạn đang hút thuốc lá điếu và thật sự không thể bỏ bằng các phương pháp truyền thống, bạn có thể <strong>dùng vape như bước chuyển tiếp</strong> – nhưng <strong>phải có kế hoạch rõ ràng để dừng hẳn</strong>.</p>
<p>Hãy kết hợp vape với hỗ trợ tâm lý, tư vấn y tế, và cam kết cụ thể để rút dần liều lượng và tiến tới cai hoàn toàn.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🎯 Kết luận</h2>
<p><strong>Vape có thể là công cụ hỗ trợ cai thuốc – nhưng không nên là giải pháp lâu dài.</strong> Việc dùng vape cần đi kèm với mục tiêu rõ ràng, kiểm soát chặt chẽ và tốt nhất là có hướng dẫn từ chuyên gia. Đích đến cuối cùng vẫn là một cuộc sống không nicotine – không khói, không hơi, không lệ thuộc.</p>
</body>
', 1, 'vaping'),

-- resources-for-health-professionals
(N'Kỹ thuật phỏng vấn tạo động lực', '', N'Hướng dẫn chuyên môn dành cho nhân viên y tế.', N'<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; background-color: #f9f9f9; color: #333;">
<h1 style="color:#2c3e50; font-size:28px; margin-bottom:10px;">🗣️ Kỹ thuật phỏng vấn tạo động lực</h1>
<p><strong>Hướng dẫn chuyên môn dành cho nhân viên y tế hỗ trợ người cai thuốc một cách hiệu quả và tôn trọng</strong></p>
<p>Phỏng vấn tạo động lực (Motivational Interviewing – MI) là một kỹ thuật giao tiếp y khoa giúp bệnh nhân khám phá và củng cố động lực thay đổi hành vi. Với người muốn cai thuốc lá, phương pháp này mang lại hiệu quả tích cực nhờ <span style="font-weight:bold; color:#e74c3c;">lấy bệnh nhân làm trung tâm</span> và <span style="font-weight:bold; color:#e74c3c;">xây dựng niềm tin thay vì áp lực</span>.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🔑 Nguyên tắc cơ bản của phỏng vấn tạo động lực</h2>
<ul style="margin-top:5px;">
<li><strong>Đồng cảm (Empathy):</strong> Thể hiện sự hiểu biết và lắng nghe không phán xét.</li>
<li><strong>Phát triển sự khác biệt (Develop discrepancy):</strong> Khơi gợi khoảng cách giữa hiện tại và điều người bệnh mong muốn.</li>
<li><strong>Tránh tranh luận (Roll with resistance):</strong> Không đối đầu, thay vào đó linh hoạt chuyển hướng.</li>
<li><strong>Hỗ trợ sự tự tin (Support self-efficacy):</strong> Gợi mở niềm tin rằng họ có thể thay đổi.</li>
</ul>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🛠️ Kỹ thuật giao tiếp cốt lõi: OARS</h2>
<ul style="margin-top:5px;">
<li><strong>O – Open-ended questions:</strong> Câu hỏi mở để khuyến khích chia sẻ. (Ví dụ: “Điều gì khiến anh muốn bỏ thuốc?”)</li>
<li><strong>A – Affirmations:</strong> Lời ghi nhận, khen ngợi nỗ lực. (“Tôi thấy anh đã cố gắng rất nhiều.”)</li>
<li><strong>R – Reflective listening:</strong> Nghe phản hồi và lặp lại để thể hiện thấu hiểu. (“Anh đang lo mình sẽ tái nghiện?”)</li>
<li><strong>S – Summarizing:</strong> Tổng hợp những gì đã trao đổi để củng cố quyết tâm. (“Tóm lại, anh rất quan tâm sức khỏe của con nên muốn cai thuốc.”)</li>
</ul>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">📋 Gợi ý tình huống áp dụng MI khi tư vấn cai thuốc</h2>
<p><strong>Bệnh nhân:</strong> “Tôi biết hút thuốc không tốt nhưng tôi stress quá, bỏ không nổi.”</p>
<p><strong>Nhân viên y tế:</strong> “Tôi hiểu, thuốc lá từng giúp anh giảm stress. Anh có thể kể thêm điều gì khiến anh nghĩ đến việc bỏ thuốc?”</p>
<p><em>👉 Cách tiếp cận này giúp người bệnh tự suy nghĩ và khơi gợi nội lực thay vì cảm thấy bị ra lệnh.</em></p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🎯 Kết luận</h2>
<p><strong>Phỏng vấn tạo động lực không phải là thuyết phục, mà là đồng hành.</strong> Với kỹ thuật phù hợp, nhân viên y tế có thể giúp bệnh nhân chuyển từ do dự sang hành động – và giữ vững cam kết thay đổi lâu dài.</p>
</body>
', 1, 'resources-for-health-professionals'),
(N'Hướng dẫn lâm sàng trong cai thuốc', '', N'Cách tiếp cận dựa trên bằng chứng khoa học.', N'<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; background-color: #f9f9f9; color: #333;">
<h1 style="color:#2c3e50; font-size:28px; margin-bottom:10px;">🩺 Hướng dẫn lâm sàng trong cai thuốc</h1>
<p><strong>Cách tiếp cận dựa trên bằng chứng khoa học giúp nhân viên y tế hỗ trợ người bệnh bỏ thuốc hiệu quả</strong></p>
<p>Cai thuốc lá là một trong những can thiệp y học tiết kiệm chi phí và mang lại lợi ích sức khỏe lâu dài nhất. Hướng dẫn lâm sàng giúp các chuyên gia y tế <span style="font-weight:bold; color:#e74c3c;">áp dụng phương pháp dựa trên bằng chứng</span> để nâng cao tỷ lệ thành công cho bệnh nhân.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🔍 1. Quy trình 5A (ASK - ADVISE - ASSESS - ASSIST - ARRANGE)</h2>
<ul style="margin-top:5px;">
<li><strong>ASK:</strong> Hỏi về tình trạng hút thuốc của tất cả bệnh nhân tại mỗi lần khám.</li>
<li><strong>ADVISE:</strong> Đưa ra lời khuyên rõ ràng, cá nhân hóa: “Bỏ thuốc là điều tốt nhất anh có thể làm cho sức khỏe.”</li>
<li><strong>ASSESS:</strong> Đánh giá mức độ sẵn sàng bỏ thuốc của bệnh nhân (sẵn sàng, đang cân nhắc, chưa muốn...).</li>
<li><strong>ASSIST:</strong> Hỗ trợ bằng tư vấn, đơn thuốc, kỹ thuật tâm lý hoặc giới thiệu chương trình cai thuốc.</li>
<li><strong>ARRANGE:</strong> Sắp xếp lịch tái khám hoặc liên lạc để theo dõi, hỗ trợ sau lần tư vấn đầu.</li>
</ul>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">💊 2. Các liệu pháp được chứng minh hiệu quả</h2>
<ul style="margin-top:5px;">
<li><strong>Thay thế nicotine:</strong> Miếng dán, kẹo cao su, viên ngậm – giúp kiểm soát cơn thèm mà không hút.</li>
<li><strong>Thuốc kê toa:</strong> Bupropion SR hoặc Varenicline (Champix) – làm giảm triệu chứng cai và giúp cai dứt điểm.</li>
<li><strong>Tư vấn hành vi:</strong> Tăng đáng kể hiệu quả khi kết hợp với điều trị thuốc (qua điện thoại, gặp trực tiếp hoặc nhóm).</li>
</ul>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">📈 3. Tư duy theo giai đoạn thay đổi hành vi (Transtheoretical Model)</h2>
<p>Chia bệnh nhân thành 5 giai đoạn: <strong>Tiền nhận thức → Nhận thức → Chuẩn bị → Hành động → Duy trì</strong>. Mỗi giai đoạn cần chiến lược khác nhau. Ví dụ: với người chưa sẵn sàng, nên tập trung vào lắng nghe và cung cấp thông tin nhẹ nhàng.</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">📋 4. Các lưu ý trong thực hành lâm sàng</h2>
<ul style="margin-top:5px;">
<li>Không phán xét, tránh ép buộc bệnh nhân phải bỏ ngay lập tức.</li>
<li>Ghi nhận mọi nỗ lực, kể cả khi bệnh nhân chưa thành công.</li>
<li>Chủ động ghi nhận tiền sử hút thuốc vào hồ sơ và cập nhật tiến trình qua các lần tái khám.</li>
</ul>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🎯 Kết luận</h2>
<p><strong>Áp dụng hướng dẫn lâm sàng giúp nhân viên y tế tiếp cận cai thuốc một cách hệ thống, có cấu trúc và hiệu quả hơn.</strong> Khi hỗ trợ đúng phương pháp, người bệnh sẽ có thêm động lực và niềm tin để rời xa thuốc lá vĩnh viễn.</p>
</body>
', 1, 'resources-for-health-professionals'),
(N'Tài liệu truyền thông cho bệnh nhân', '', N'Mẫu tờ rơi, bảng thông tin hỗ trợ người bệnh.', N'<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; background-color: #ffffff; color: #333;">
<h1 style="color:#2c3e50; font-size:28px; margin-bottom:10px;">📄 Tài liệu truyền thông cho bệnh nhân</h1>
<p><strong>Mẫu tờ rơi, bảng thông tin ngắn gọn – dễ hiểu – truyền cảm hứng hỗ trợ người bệnh bỏ thuốc lá</strong></p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🎯 Mục tiêu của tài liệu</h2>
<p>✅ Cung cấp thông tin rõ ràng và khoa học về tác hại của thuốc lá<br>✅ Gợi ý giải pháp và nguồn lực hỗ trợ cai thuốc<br>✅ Truyền động lực bằng lời nhắn tích cực và gần gũi</p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">📌 Mẫu nội dung tờ rơi A5</h2>
<h3 style="color:#e67e22;">[MẶT TRƯỚC – “BẠN CÓ THỂ BỎ THUỐC!”]</h3>
<ul style="margin-top:5px;">
<li><strong>1. Vì sao nên bỏ thuốc?</strong><br>– Giảm nguy cơ ung thư, đột quỵ, bệnh tim<br>– Hơi thở thơm hơn, da sáng hơn, sống khỏe hơn</li>
<li><strong>2. Dấu hiệu bạn đã sẵn sàng?</strong><br>– Nghĩ đến việc bỏ thuốc mỗi ngày<br>– Cảm thấy mệt mỏi vì phụ thuộc vào thuốc<br>– Muốn sống khỏe vì gia đình, con cái</li>
<li><strong>3. Bỏ thuốc – bạn không đơn độc</strong><br>– Có nhiều phương pháp hỗ trợ: kẹo cao su, miếng dán, tư vấn<br>– Bạn có thể gọi 1800.xxx.xxx để được tư vấn miễn phí</li>
</ul>
<h3 style="color:#2980b9;">[MẶT SAU – “BẢNG KẾ HOẠCH CAI THUỐC CÁ NHÂN”]</h3>
<p><strong>✔ Ngày bắt đầu cai thuốc: ..............<br>✔ Điều tôi sợ nhất khi bỏ thuốc là: ....................................<br>✔ Điều giúp tôi vượt qua cơn thèm: .....................................<br>✔ Người tôi sẽ gọi khi cảm thấy muốn hút: ................................<br>✔ Lý do quan trọng nhất khiến tôi bỏ thuốc là: ...........................</strong></p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">📎 Mẫu bảng treo tường (A3) – Dành cho phòng khám</h2>
<p><strong>“3 LÝ DO NÊN BỎ THUỐC NGAY HÔM NAY”</strong></p>
<ol>
<li>Bạn sẽ sống lâu hơn và khỏe mạnh hơn</li>
<li>Bạn sẽ tiết kiệm hàng triệu đồng mỗi năm</li>
<li>Bạn sẽ làm gương cho con cái và người thân</li>
</ol>
<p><strong>📞 Cần giúp đỡ?</strong> Hãy liên hệ bác sĩ hoặc gọi hotline hỗ trợ cai thuốc: <span style="color:#e74c3c;">1800 xxx xxx</span></p>
<h2 style="color:#2c3e50; font-size:22px; margin-top:30px;">🎯 Kết luận</h2>
<p><strong>Tài liệu truyền thông hiệu quả phải đơn giản, dễ hiểu và mang tính hành động.</strong> Bạn có thể điều chỉnh theo từng đối tượng (người trẻ, thai phụ, người lớn tuổi...) và kết hợp hình ảnh minh họa trực quan để tăng tính hấp dẫn.</p>
</body>
', 1, 'resources-for-health-professionals')
GO


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
