use SWP391

--Sample subcription
INSERT INTO [subcriptions] ([sub_type], [duration], [price])
VALUES 
  ('Free', 0, 0.0),

  ('Premium - Monthly', 1, 9.99),
  ('Premium - Yearly', 12, 99.99),

  ('Pro - Monthly', 1, 19.99),
  ('Pro - Yearly', 12, 199.99);

--Sample user info
INSERT INTO [users] ([auth0_id], [username], [email], [created_at], [avatar])
VALUES 
('auth0|abc123', 'john_doe', 'john@example.com', '2025-05-15 00:00:00', null),
('auth0|xyz789', 'jane_smith', 'jane@example.com', '2025-05-15 00:00:00', null),
('auth0|lmn456', 'bob_lee', 'bob@example.com', '2025-05-15 00:00:00', null),
('google-oauth2|105815855269571869013', N'Minh Thiện', 'ubw1212@gmail.com', '2025-05-15 00:00:00', 'https://lh3.googleusercontent.com/a/ACg8ocIVvvIT6NIJhzBx3ktxTSYJ6x3phvcqCzaJOHSznVOomREzAA=s96-c'),
('google-oauth2|111595895123096866179', N'Lak Big', 'biglak123@gmail.com', '2025-06-01 18:06:27.967', 'https://lh3.googleusercontent.com/a/ACg8ocKI_H6d_viefsrC78Sm2iWTnndeEjJuGRuHMhwFoNfoFAn5ag=s96-c'),
('google-oauth2|108533841030682315532', N'Tran Minh Thien (K18 HCM)', 'thientmse184897@fpt.edu.vn', '2025-06-01 02:55:15.157', 'https://lh3.googleusercontent.com/a/ACg8ocLspJRXpILQwHstZtQyGO0_g0mpzP8GeeVJFVxZ5ETTiHGujDY=s96-c'),
('google-oauth2|118429602254096661272', N'Thien Tran', 'thien.tm2727@gmail.com', '2025-06-01 00:58:02.400', 'https://lh3.googleusercontent.com/a/ACg8ocIrgAzxmaR9_zwicS_OTgbP5mFGMJgeZElFR8TntqJXR3pXiqs=s96-c'),
('google-oauth2|101805593223909898949', N'qwe asd', 'accracc2@gmail.com', '2025-06-01 00:58:54.637', 'https://lh3.googleusercontent.com/a/ACg8ocKByukGSvQp0D4AR_bivfRSOxW5b3WJKSbd7AxYzNe05Egfvg=s96-c');

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
INSERT INTO social_category(category_tag, category_name, img_path, [description]) VALUES ('quit-experiences', N'Chia sẻ trải nghiệm', '/quit-experiences.svg', N'Chia sẻ hành trình cai thuốc của bạn – từ thử thách đến những chiến thắng.')
INSERT INTO social_category(category_tag, category_name, img_path, [description]) VALUES ('getting-started', N'Bắt đầu hành trình', '/getting-started.svg', N'Lập kế hoạch và chuẩn bị để bắt đầu hành trình cai thuốc hiệu quả.')
INSERT INTO social_category(category_tag, category_name, img_path, [description]) VALUES ('staying-quit', N'Duy trì cai thuốc', '/staying-quit.svg', N'Chiến lược để giữ vững quyết tâm và vượt qua cám dỗ trong quá trình cai.')
INSERT INTO social_category(category_tag, category_name, img_path, [description]) VALUES ('hints-and-tips', N'Mẹo và lời khuyên', '/hints-and-tips.svg', N'Chia sẻ mẹo vượt qua cơn thèm thuốc, giảm stress, và hoạt động thay thế.')
INSERT INTO social_category(category_tag, category_name, img_path, [description]) VALUES ('reasons-to-quit', N'Lý do bỏ thuốc', '/reasons-to-quit-2.svg', N'Tác động tích cực đến sức khỏe, tài chính và gia đình bạn khi bỏ thuốc.')

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
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported]) VALUES
(NULL, 4, 1, N'Bài viết rất hay và hữu ích! Cảm ơn bạn đã chia sẻ.', '2025-05-14 08:30:00.000', 0),
(NULL, 4, 3, N'Tôi cũng có cùng suy nghĩ như bạn về vấn đề này.', '2025-05-15 10:15:00.000', 0),
(NULL, 4, 5, N'Kinh nghiệm của bạn thật quý báu, tôi sẽ áp dụng thử.', '2025-05-14 14:20:00.000', 0),
(NULL, 4, 7, N'Cảm ơn bạn đã giải thích rõ ràng từng bước.', '2025-05-15 16:45:00.000', 0),
(NULL, 4, 9, N'Mình cũng đang gặp tình huống tương tự.', '2025-05-07 12:30:00.000', 0),
(NULL, 4, 12, N'Bạn có thể chia sẻ thêm chi tiết được không?', '2025-06-02 09:15:00.000', 0),
(NULL, 4, 15, N'Rất đồng ý với quan điểm của bạn.', '2025-06-15 11:20:00.000', 0);

-- Get the IDs of parent comments for child comments (assuming auto-increment starts from 1)
-- Child comments for user_id = 4
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported]) VALUES
(1, 4, 1, N'Mình cũng nghĩ vậy, đặc biệt là phần về việc lập kế hoạch.', '2025-05-14 09:00:00.000', 0),
(3, 4, 5, N'Bạn thử áp dụng từ từ nhé, đừng vội vàng quá.', '2025-05-14 15:30:00.000', 0),
(5, 4, 9, N'Chúng ta có thể trao đổi thêm qua tin nhắn riêng không?', '2025-05-07 13:45:00.000', 0);

-- Comments for user_id = 5
-- 7 parent comments + 3 child comments = 10 total comments
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported]) VALUES
(NULL, 5, 2, N'Bài viết này đã giúp tôi hiểu rõ hơn về vấn đề.', '2025-05-13 10:00:00.000', 0),
(NULL, 5, 6, N'Tôi rất ấn tượng với cách tiếp cận của bạn.', '2025-06-15 14:30:00.000', 0),
(NULL, 5, 8, N'Có vẻ như tôi cần phải thay đổi suy nghĩ của mình.', '2025-06-16 16:20:00.000', 0),
(NULL, 5, 10, N'Kinh nghiệm này rất bổ ích cho tôi.', '2025-06-05 18:15:00.000', 0),
(NULL, 5, 13, N'Tôi cũng từng trải qua điều tương tự.', '2025-06-07 20:30:00.000', 0),
(NULL, 5, 16, N'Cảm ơn bạn đã chia sẻ câu chuyện này.', '2025-06-15 08:45:00.000', 0),
(NULL, 5, 20, N'Mình hoàn toàn đồng ý với bạn.', '2025-06-06 11:00:00.000', 0);

-- Child comments for user_id = 5
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported]) VALUES
(12, 5, 6, N'Mình sẽ thử áp dụng phương pháp này xem sao.', '2025-06-15 15:00:00.000', 0),
(14, 5, 10, N'Bạn có thể chia sẻ thêm về trải nghiệm cá nhân không?', '2025-06-05 19:30:00.000', 0),
(15, 5, 13, N'Tình huống của mình cũng khá giống bạn.', '2025-06-07 21:15:00.000', 0);

-- Comments for user_id = 6
-- 7 parent comments + 3 child comments = 10 total comments
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported]) VALUES
(NULL, 6, 4, N'Lời khuyên này rất thiết thực và dễ áp dụng.', '2025-05-12 13:20:00.000', 0),
(NULL, 6, 11, N'Tôi cảm thấy bài viết này rất chân thực.', '2025-06-15 15:45:00.000', 0),
(NULL, 6, 14, N'Góc nhìn của bạn thật thú vị và mới mẻ.', '2025-06-10 17:30:00.000', 0),
(NULL, 6, 17, N'Cảm ơn bạn đã chia sẻ kinh nghiệm quý báu này.', '2025-06-01 19:15:00.000', 0),
(NULL, 6, 19, N'Tôi cũng đang tìm hiểu về vấn đề này.', '2025-06-04 21:00:00.000', 0),
(NULL, 6, 22, N'Bài viết rất hay, tôi đã học được nhiều điều.', '2025-06-12 08:30:00.000', 0),
(NULL, 6, 24, N'Mình sẽ bookmark bài này để đọc lại.', '2025-06-12 10:45:00.000', 0);

-- Child comments for user_id = 6
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported]) VALUES
(19, 6, 4, N'Đặc biệt là phần về cách quản lý thời gian.', '2025-05-12 14:00:00.000', 0),
(21, 6, 14, N'Tôi chưa bao giờ nghĩ về vấn đề theo cách này.', '2025-06-10 18:15:00.000', 0),
(23, 6, 19, N'Bạn có tài liệu nào để tham khảo thêm không?', '2025-06-04 21:45:00.000', 0);

-- Comments for user_id = 7
-- 7 parent comments + 3 child comments = 10 total comments
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported]) VALUES
(NULL, 7, 18, N'Bạn viết rất hay và dễ hiểu.', '2025-06-03 12:30:00.000', 0),
(NULL, 7, 21, N'Tôi hoàn toàn đồng ý với quan điểm này.', '2025-06-15 14:15:00.000', 0),
(NULL, 7, 23, N'Cảm ơn bạn đã chia sẻ kinh nghiệm thực tế.', '2025-06-11 16:00:00.000', 0),
(NULL, 7, 25, N'Bài viết này đã truyền cảm hứng cho tôi.', '2025-06-15 18:30:00.000', 0),
(NULL, 7, 1, N'Rất hữu ích cho người mới bắt đầu như tôi.', '2025-05-14 20:45:00.000', 0),
(NULL, 7, 3, N'Tôi sẽ thử áp dụng lời khuyên của bạn.', '2025-05-15 22:00:00.000', 0),
(NULL, 7, 5, N'Kinh nghiệm này rất đáng để học hỏi.', '2025-05-14 07:15:00.000', 0);

-- Child comments for user_id = 7
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported]) VALUES
(27, 7, 21, N'Đặc biệt là phần phân tích về tâm lý.', '2025-06-15 15:00:00.000', 0),
(29, 7, 25, N'Tôi sẽ chia sẻ bài này với bạn bè.', '2025-06-15 19:15:00.000', 0),
(30, 7, 1, N'Bạn có thể viết thêm về chủ đề này không?', '2025-05-14 21:30:00.000', 0);

-- Comments for user_id = 8
-- 7 parent comments + 3 child comments = 10 total comments
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported]) VALUES
(NULL, 8, 2, N'Bài viết rất thực tế và dễ áp dụng.', '2025-05-13 11:45:00.000', 0),
(NULL, 8, 6, N'Tôi đã học được nhiều điều từ bài này.', '2025-06-15 13:30:00.000', 0),
(NULL, 8, 9, N'Cách giải quyết vấn đề của bạn rất hay.', '2025-06-07 15:15:00.000', 0),
(NULL, 8, 12, N'Tôi cũng gặp tình huống tương tự như bạn.', '2025-06-02 17:00:00.000', 0),
(NULL, 8, 15, N'Kinh nghiệm này rất bổ ích cho tôi.', '2025-06-15 19:45:00.000', 0),
(NULL, 8, 18, N'Cảm ơn bạn đã chia sẻ những suy nghĩ này.', '2025-06-03 21:30:00.000', 0),
(NULL, 8, 20, N'Mình hoàn toàn đồng ý với bạn.', '2025-06-06 23:15:00.000', 0);

-- Child comments for user_id = 8
INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported]) VALUES
(34, 8, 2, N'Đặc biệt là phần về lập kế hoạch chi tiết.', '2025-05-13 12:30:00.000', 0),
(37, 8, 12, N'Chúng ta có thể trao đổi thêm về vấn đề này.', '2025-06-02 18:00:00.000', 0),
(38, 8, 15, N'Tôi sẽ áp dụng thử và chia sẻ kết quả sau.', '2025-06-15 20:30:00.000', 0);

-- Social Likes Data
-- Each user likes 15 posts and 30 comments
-- Created dates are random but after user creation date

-- User 1 (created: 2025-05-15) - 15 posts + 30 comments
INSERT INTO [social_likes] ([user_id], [post_id], [comment_id], [created_at]) VALUES
(1, 3, NULL, '2025-05-16 08:30:00.000'),
(1, 7, NULL, '2025-05-17 14:20:00.000'),
(1, 12, NULL, '2025-05-18 09:45:00.000'),
(1, 2, NULL, '2025-05-19 16:30:00.000'),
(1, 18, NULL, '2025-05-20 11:15:00.000'),
(1, 5, NULL, '2025-05-21 13:40:00.000'),
(1, 23, NULL, '2025-05-22 10:25:00.000'),
(1, 9, NULL, '2025-05-23 15:50:00.000'),
(1, 14, NULL, '2025-05-24 12:35:00.000'),
(1, 21, NULL, '2025-05-25 17:20:00.000'),
(1, 6, NULL, '2025-05-26 09:10:00.000'),
(1, 16, NULL, '2025-05-27 14:55:00.000'),
(1, 25, NULL, '2025-05-28 11:30:00.000'),
(1, 4, NULL, '2025-05-29 16:45:00.000'),
(1, 19, NULL, '2025-05-30 13:20:00.000'),
(1, NULL, 8, '2025-05-16 09:15:00.000'),
(1, NULL, 15, '2025-05-17 11:30:00.000'),
(1, NULL, 22, '2025-05-18 14:45:00.000'),
(1, NULL, 3, '2025-05-19 08:20:00.000'),
(1, NULL, 31, '2025-05-20 16:35:00.000'),
(1, NULL, 7, '2025-05-21 12:50:00.000'),
(1, NULL, 44, '2025-05-22 09:25:00.000'),
(1, NULL, 18, '2025-05-23 15:40:00.000'),
(1, NULL, 26, '2025-05-24 11:15:00.000'),
(1, NULL, 39, '2025-05-25 17:30:00.000'),
(1, NULL, 12, '2025-05-26 13:45:00.000'),
(1, NULL, 47, '2025-05-27 10:20:00.000'),
(1, NULL, 5, '2025-05-28 16:35:00.000'),
(1, NULL, 33, '2025-05-29 14:50:00.000'),
(1, NULL, 20, '2025-05-30 12:25:00.000'),
(1, NULL, 41, '2025-05-31 08:40:00.000'),
(1, NULL, 14, '2025-06-01 15:55:00.000'),
(1, NULL, 28, '2025-06-02 11:10:00.000'),
(1, NULL, 36, '2025-06-03 17:25:00.000'),
(1, NULL, 9, '2025-06-04 13:40:00.000'),
(1, NULL, 42, '2025-06-05 09:55:00.000'),
(1, NULL, 17, '2025-06-06 16:10:00.000'),
(1, NULL, 30, '2025-06-07 12:25:00.000'),
(1, NULL, 45, '2025-06-08 08:40:00.000'),
(1, NULL, 23, '2025-06-09 14:55:00.000'),
(1, NULL, 38, '2025-06-10 11:10:00.000'),
(1, NULL, 6, '2025-06-11 17:25:00.000'),
(1, NULL, 49, '2025-06-12 13:40:00.000'),
(1, NULL, 11, '2025-06-13 09:55:00.000'),
(1, NULL, 34, '2025-06-14 16:10:00.000'),
(1, NULL, 24, '2025-06-15 12:25:00.000');

-- User 2 (created: 2025-05-15) - 15 posts + 30 comments
INSERT INTO [social_likes] ([user_id], [post_id], [comment_id], [created_at]) VALUES
(2, 1, NULL, '2025-05-16 10:20:00.000'),
(2, 8, NULL, '2025-05-17 15:35:00.000'),
(2, 13, NULL, '2025-05-18 12:50:00.000'),
(2, 20, NULL, '2025-05-19 09:15:00.000'),
(2, 24, NULL, '2025-05-20 16:30:00.000'),
(2, 11, NULL, '2025-05-21 13:45:00.000'),
(2, 17, NULL, '2025-05-22 11:20:00.000'),
(2, 3, NULL, '2025-05-23 17:35:00.000'),
(2, 22, NULL, '2025-05-24 14:50:00.000'),
(2, 6, NULL, '2025-05-25 10:15:00.000'),
(2, 15, NULL, '2025-05-26 16:30:00.000'),
(2, 25, NULL, '2025-05-27 12:45:00.000'),
(2, 9, NULL, '2025-05-28 09:20:00.000'),
(2, 18, NULL, '2025-05-29 15:35:00.000'),
(2, 5, NULL, '2025-05-30 11:50:00.000'),
(2, NULL, 4, '2025-05-16 11:25:00.000'),
(2, NULL, 19, '2025-05-17 08:40:00.000'),
(2, NULL, 32, '2025-05-18 15:55:00.000'),
(2, NULL, 13, '2025-05-19 12:10:00.000'),
(2, NULL, 27, '2025-05-20 09:25:00.000'),
(2, NULL, 40, '2025-05-21 16:40:00.000'),
(2, NULL, 16, '2025-05-22 13:55:00.000'),
(2, NULL, 29, '2025-05-23 10:10:00.000'),
(2, NULL, 43, '2025-05-24 17:25:00.000'),
(2, NULL, 21, '2025-05-25 14:40:00.000'),
(2, NULL, 35, '2025-05-26 11:55:00.000'),
(2, NULL, 48, '2025-05-27 08:10:00.000'),
(2, NULL, 2, '2025-05-28 15:25:00.000'),
(2, NULL, 37, '2025-05-29 12:40:00.000'),
(2, NULL, 10, '2025-05-30 09:55:00.000'),
(2, NULL, 46, '2025-05-31 16:10:00.000'),
(2, NULL, 25, '2025-06-01 13:25:00.000'),
(2, NULL, 1, '2025-06-02 10:40:00.000'),
(2, NULL, 50, '2025-06-03 17:55:00.000'),
(2, NULL, 7, '2025-06-04 14:10:00.000'),
(2, NULL, 22, '2025-06-05 11:25:00.000'),
(2, NULL, 41, '2025-06-06 08:40:00.000'),
(2, NULL, 14, '2025-06-07 15:55:00.000'),
(2, NULL, 33, '2025-06-08 12:10:00.000'),
(2, NULL, 18, '2025-06-09 09:25:00.000'),
(2, NULL, 44, '2025-06-10 16:40:00.000'),
(2, NULL, 26, '2025-06-11 13:55:00.000'),
(2, NULL, 39, '2025-06-12 10:10:00.000'),
(2, NULL, 12, '2025-06-13 17:25:00.000'),
(2, NULL, 31, '2025-06-14 14:40:00.000');

-- User 3 (created: 2025-05-15) - 15 posts + 30 comments
INSERT INTO [social_likes] ([user_id], [post_id], [comment_id], [created_at]) VALUES
(3, 4, NULL, '2025-05-16 09:45:00.000'),
(3, 10, NULL, '2025-05-17 14:20:00.000'),
(3, 16, NULL, '2025-05-18 11:35:00.000'),
(3, 21, NULL, '2025-05-19 16:50:00.000'),
(3, 7, NULL, '2025-05-20 13:15:00.000'),
(3, 14, NULL, '2025-05-21 10:30:00.000'),
(3, 23, NULL, '2025-05-22 17:45:00.000'),
(3, 2, NULL, '2025-05-23 14:20:00.000'),
(3, 19, NULL, '2025-05-24 11:35:00.000'),
(3, 25, NULL, '2025-05-25 08:50:00.000'),
(3, 12, NULL, '2025-05-26 16:15:00.000'),
(3, 6, NULL, '2025-05-27 13:30:00.000'),
(3, 18, NULL, '2025-05-28 10:45:00.000'),
(3, 9, NULL, '2025-05-29 17:20:00.000'),
(3, 15, NULL, '2025-05-30 14:35:00.000'),
(3, NULL, 6, '2025-05-16 10:50:00.000'),
(3, NULL, 23, '2025-05-17 08:15:00.000'),
(3, NULL, 35, '2025-05-18 15:30:00.000'),
(3, NULL, 11, '2025-05-19 12:45:00.000'),
(3, NULL, 28, '2025-05-20 09:20:00.000'),
(3, NULL, 42, '2025-05-21 16:35:00.000'),
(3, NULL, 17, '2025-05-22 13:50:00.000'),
(3, NULL, 30, '2025-05-23 11:15:00.000'),
(3, NULL, 45, '2025-05-24 18:30:00.000'),
(3, NULL, 9, '2025-05-25 15:45:00.000'),
(3, NULL, 24, '2025-05-26 12:20:00.000'),
(3, NULL, 38, '2025-05-27 09:35:00.000'),
(3, NULL, 13, '2025-05-28 16:50:00.000'),
(3, NULL, 47, '2025-05-29 14:15:00.000'),
(3, NULL, 20, '2025-05-30 11:30:00.000'),
(3, NULL, 34, '2025-05-31 08:45:00.000'),
(3, NULL, 3, '2025-06-01 16:20:00.000'),
(3, NULL, 49, '2025-06-02 13:35:00.000'),
(3, NULL, 15, '2025-06-03 10:50:00.000'),
(3, NULL, 31, '2025-06-04 18:15:00.000'),
(3, NULL, 44, '2025-06-05 15:30:00.000'),
(3, NULL, 8, '2025-06-06 12:45:00.000'),
(3, NULL, 26, '2025-06-07 09:20:00.000'),
(3, NULL, 40, '2025-06-08 16:35:00.000'),
(3, NULL, 5, '2025-06-09 13:50:00.000'),
(3, NULL, 22, '2025-06-10 11:15:00.000'),
(3, NULL, 37, '2025-06-11 18:30:00.000'),
(3, NULL, 12, '2025-06-12 15:45:00.000'),
(3, NULL, 29, '2025-06-13 12:20:00.000'),
(3, NULL, 46, '2025-06-14 09:35:00.000');

-- User 4 (created: 2025-05-15) - 15 posts + 30 comments
INSERT INTO [social_likes] ([user_id], [post_id], [comment_id], [created_at]) VALUES
(4, 8, NULL, '2025-05-16 11:15:00.000'),
(4, 13, NULL, '2025-05-17 16:30:00.000'),
(4, 19, NULL, '2025-05-18 13:45:00.000'),
(4, 2, NULL, '2025-05-19 10:20:00.000'),
(4, 24, NULL, '2025-05-20 17:35:00.000'),
(4, 6, NULL, '2025-05-21 14:50:00.000'),
(4, 17, NULL, '2025-05-22 12:15:00.000'),
(4, 22, NULL, '2025-05-23 09:30:00.000'),
(4, 11, NULL, '2025-05-24 16:45:00.000'),
(4, 25, NULL, '2025-05-25 13:20:00.000'),
(4, 4, NULL, '2025-05-26 10:35:00.000'),
(4, 16, NULL, '2025-05-27 17:50:00.000'),
(4, 20, NULL, '2025-05-28 15:15:00.000'),
(4, 10, NULL, '2025-05-29 12:30:00.000'),
(4, 14, NULL, '2025-05-30 09:45:00.000'),
(4, NULL, 16, '2025-05-16 12:25:00.000'),
(4, NULL, 29, '2025-05-17 09:40:00.000'),
(4, NULL, 41, '2025-05-18 16:55:00.000'),
(4, NULL, 7, '2025-05-19 14:10:00.000'),
(4, NULL, 33, '2025-05-20 11:25:00.000'),
(4, NULL, 48, '2025-05-21 18:40:00.000'),
(4, NULL, 14, '2025-05-22 15:55:00.000'),
(4, NULL, 27, '2025-05-23 12:10:00.000'),
(4, NULL, 39, '2025-05-24 09:25:00.000'),
(4, NULL, 4, '2025-06-25 16:40:00.000'),
(4, NULL, 21, '2025-05-26 13:55:00.000'),
(4, NULL, 36, '2025-05-27 11:10:00.000'),
(4, NULL, 50, '2025-05-28 18:25:00.000'),
(4, NULL, 18, '2025-05-29 15:40:00.000'),
(4, NULL, 32, '2025-05-30 12:55:00.000'),
(4, NULL, 8, '2025-05-31 10:10:00.000'),
(4, NULL, 43, '2025-06-01 17:25:00.000'),
(4, NULL, 25, '2025-06-02 14:40:00.000'),
(4, NULL, 1, '2025-06-03 11:55:00.000'),
(4, NULL, 37, '2025-06-04 09:10:00.000'),
(4, NULL, 12, '2025-06-05 16:25:00.000'),
(4, NULL, 46, '2025-06-06 13:40:00.000'),
(4, NULL, 23, '2025-06-07 10:55:00.000'),
(4, NULL, 35, '2025-06-08 18:10:00.000'),
(4, NULL, 9, '2025-06-09 15:25:00.000'),
(4, NULL, 44, '2025-06-10 12:40:00.000'),
(4, NULL, 19, '2025-06-11 09:55:00.000'),
(4, NULL, 31, '2025-06-12 17:10:00.000'),
(4, NULL, 5, '2025-06-13 14:25:00.000'),
(4, NULL, 42, '2025-06-14 11:40:00.000');

-- User 5 (created: 2025-06-01 18:06:27.967) - 15 posts + 30 comments
INSERT INTO [social_likes] ([user_id], [post_id], [comment_id], [created_at]) VALUES
(5, 3, NULL, '2025-06-02 08:30:00.000'),
(5, 9, NULL, '2025-06-02 14:45:00.000'),
(5, 15, NULL, '2025-06-03 11:20:00.000'),
(5, 21, NULL, '2025-06-03 17:35:00.000'),
(5, 7, NULL, '2025-06-04 13:50:00.000'),
(5, 18, NULL, '2025-06-04 10:15:00.000'),
(5, 24, NULL, '2025-06-05 16:30:00.000'),
(5, 12, NULL, '2025-06-05 12:45:00.000'),
(5, 5, NULL, '2025-06-06 09:20:00.000'),
(5, 20, NULL, '2025-06-06 15:35:00.000'),
(5, 14, NULL, '2025-06-07 11:50:00.000'),
(5, 25, NULL, '2025-06-07 18:15:00.000'),
(5, 8, NULL, '2025-06-08 14:30:00.000'),
(5, 16, NULL, '2025-06-08 10:45:00.000'),
(5, 22, NULL, '2025-06-09 17:20:00.000'),
(5, NULL, 2, '2025-06-02 09:15:00.000'),
(5, NULL, 17, '2025-06-02 15:30:00.000'),
(5, NULL, 34, '2025-06-03 12:45:00.000'),
(5, NULL, 11, '2025-06-03 18:20:00.000'),
(5, NULL, 26, '2025-06-04 14:35:00.000'),
(5, NULL, 43, '2025-06-04 11:50:00.000'),
(5, NULL, 19, '2025-06-05 17:15:00.000'),
(5, NULL, 36, '2025-06-05 13:30:00.000'),
(5, NULL, 8, '2025-06-06 10:45:00.000'),
(5, NULL, 29, '2025-06-06 16:20:00.000'),
(5, NULL, 45, '2025-06-07 12:35:00.000'),
(5, NULL, 13, '2025-06-07 19:50:00.000'),
(5, NULL, 30, '2025-06-08 15:15:00.000'),
(5, NULL, 47, '2025-06-08 11:30:00.000'),
(5, NULL, 6, '2025-06-09 18:45:00.000'),
(5, NULL, 22, '2025-06-09 14:20:00.000'),
(5, NULL, 38, '2025-06-10 10:35:00.000'),
(5, NULL, 15, '2025-06-10 16:50:00.000'),
(5, NULL, 31, '2025-06-11 13:15:00.000'),
(5, NULL, 44, '2025-06-11 09:30:00.000'),
(5, NULL, 7, '2025-06-12 15:45:00.000'),
(5, NULL, 24, '2025-06-12 12:20:00.000'),
(5, NULL, 41, '2025-06-13 18:35:00.000'),
(5, NULL, 18, '2025-06-13 14:50:00.000'),
(5, NULL, 33, '2025-06-14 11:15:00.000'),
(5, NULL, 50, '2025-06-14 17:30:00.000'),
(5, NULL, 9, '2025-06-15 13:45:00.000'),
(5, NULL, 27, '2025-06-15 10:20:00.000'),
(5, NULL, 42, '2025-06-16 16:35:00.000'),
(5, NULL, 16, '2025-06-16 12:50:00.000');

-- User 6 (created: 2025-06-01 02:55:15.157) - 15 posts + 30 comments
INSERT INTO [social_likes] ([user_id], [post_id], [comment_id], [created_at]) VALUES
(6, 1, NULL, '2025-06-01 14:20:00.000'),
(6, 11, NULL, '2025-06-02 10:35:00.000'),
(6, 17, NULL, '2025-06-02 16:50:00.000'),
(6, 23, NULL, '2025-06-03 13:15:00.000'),
(6, 4, NULL, '2025-06-03 09:30:00.000'),
(6, 19, NULL, '2025-06-04 15:45:00.000'),
(6, 25, NULL, '2025-06-04 12:20:00.000'),
(6, 8, NULL, '2025-06-05 18:35:00.000'),
(6, 13, NULL, '2025-06-05 14:50:00.000'),
(6, 21, NULL, '2025-06-06 11:15:00.000'),
(6, 6, NULL, '2025-06-06 17:30:00.000'),
(6, 16, NULL, '2025-06-07 13:45:00.000'),
(6, 22, NULL, '2025-06-07 10:20:00.000'),
(6, 9, NULL, '2025-06-08 16:35:00.000'),
(6, 15, NULL, '2025-06-08 12:50:00.000'),
(6, NULL, 10, '2025-06-01 15:25:00.000'),
(6, NULL, 28, '2025-06-02 11:40:00.000'),
(6, NULL, 39, '2025-06-02 17:55:00.000'),
(6, NULL, 5, '2025-06-03 14:10:00.000'),
(6, NULL, 32, '2025-06-03 10:25:00.000'),
(6, NULL, 46, '2025-06-04 16:40:00.000'),
(6, NULL, 20, '2025-06-04 13:55:00.000'),
(6, NULL, 35, '2025-06-05 19:10:00.000'),
(6, NULL, 14, '2025-06-05 15:25:00.000'),
(6, NULL, 27, '2025-06-06 12:40:00.000'),
(6, NULL, 41, '2025-06-06 18:55:00.000'),
(6, NULL, 6, '2025-06-07 14:10:00.000'),
(6, NULL, 23, '2025-06-07 11:25:00.000'),
(6, NULL, 37, '2025-06-08 17:40:00.000'),
(6, NULL, 12, '2025-06-08 13:55:00.000'),
(6, NULL, 49, '2025-06-09 10:10:00.000'),
(6, NULL, 18, '2025-06-09 16:25:00.000'),
(6, NULL, 31, '2025-06-10 12:40:00.000'),
(6, NULL, 44, '2025-06-10 09:55:00.000'),
(6, NULL, 3, '2025-06-11 16:10:00.000'),
(6, NULL, 25, '2025-06-11 13:25:00.000'),
(6, NULL, 40, '2025-06-12 19:40:00.000'),
(6, NULL, 8, '2025-06-12 15:55:00.000'),
(6, NULL, 33, '2025-06-13 12:10:00.000'),
(6, NULL, 47, '2025-06-13 18:25:00.000'),
(6, NULL, 15, '2025-06-14 14:40:00.000'),
(6, NULL, 29, '2025-06-14 11:55:00.000'),
(6, NULL, 42, '2025-06-15 18:10:00.000'),
(6, NULL, 7, '2025-06-15 14:25:00.000'),
(6, NULL, 36, '2025-06-16 10:40:00.000');

-- User 7 (created: 2025-06-01 00:58:02.400) - 15 posts + 30 comments
INSERT INTO [social_likes] ([user_id], [post_id], [comment_id], [created_at]) VALUES
(7, 2, NULL, '2025-06-01 12:15:00.000'),
(7, 12, NULL, '2025-06-02 08:30:00.000'),
(7, 18, NULL, '2025-06-02 14:45:00.000'),
(7, 24, NULL, '2025-06-03 11:20:00.000'),
(7, 5, NULL, '2025-06-03 17:35:00.000'),
(7, 20, NULL, '2025-06-04 13:50:00.000'),
(7, 7, NULL, '2025-06-04 10:15:00.000'),
(7, 14, NULL, '2025-06-05 16:30:00.000'),
(7, 23, NULL, '2025-06-05 12:45:00.000'),
(7, 10, NULL, '2025-06-06 09:20:00.000'),
(7, 17, NULL, '2025-06-06 15:35:00.000'),
(7, 25, NULL, '2025-06-07 11:50:00.000'),
(7, 4, NULL, '2025-06-07 18:15:00.000'),
(7, 19, NULL, '2025-06-08 14:30:00.000'),
(7, 13, NULL, '2025-06-08 10:45:00.000'),
(7, NULL, 21, '2025-06-01 13:20:00.000'),
(7, NULL, 35, '2025-06-02 09:35:00.000'),
(7, NULL, 4, '2025-06-02 15:50:00.000'),
(7, NULL, 48, '2025-06-03 12:15:00.000'),
(7, NULL, 16, '2025-06-03 18:40:00.000'),
(7, NULL, 30, '2025-06-04 14:55:00.000'),
(7, NULL, 43, '2025-06-04 11:10:00.000'),
(7, NULL, 9, '2025-06-05 17:25:00.000'),
(7, NULL, 26, '2025-06-05 13:40:00.000'),
(7, NULL, 38, '2025-06-06 10:55:00.000'),
(7, NULL, 11, '2025-06-06 16:10:00.000'),
(7, NULL, 45, '2025-06-07 12:25:00.000'),
(7, NULL, 19, '2025-06-07 19:40:00.000'),
(7, NULL, 32, '2025-06-08 15:55:00.000'),
(7, NULL, 6, '2025-06-08 11:10:00.000'),
(7, NULL, 41, '2025-06-09 17:25:00.000');