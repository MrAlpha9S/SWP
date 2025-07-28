// Các hàm util gọi API admin backend
// Sử dụng fetch, truyền token nếu cần, base URL: /api/admin

export async function getAllUsers(token) {
  const res = await fetch('http://localhost:3000/admin/users', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy danh sách user');
  return await res.json();
}

export async function getUserById(id, token) {
  const res = await fetch(`http://localhost:3000/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy user');
  return await res.json();
}

export async function updateUser(id, data, token) {
  const res = await fetch(`http://localhost:3000/admin/users/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi cập nhật user');
  return await res.json();
}

export async function deleteUser(id, token) {
  const res = await fetch(`http://localhost:3000/admin/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi xóa user');
  return await res.json();
}

export async function toggleBanUser(id, isBanned, token) {
  const res = await fetch(`http://localhost:3000/admin/users/${id}/ban`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ isBanned })
  });
  if (!res.ok) throw new Error('Lỗi ban user');
  return await res.json();
}

export async function getAllCoaches(token) {
  const res = await fetch('http://localhost:3000/admin/coaches', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy danh sách coach');
  return await res.json();
}

export async function getCoachById(id, token) {
  const res = await fetch(`http://localhost:3000/admin/coaches/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy coach');
  return await res.json();
}

export async function updateCoach(id, data, token) {
  const res = await fetch(`http://localhost:3000/admin/coaches/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi cập nhật coach');
  return await res.json();
}

export async function deleteCoach(id, token) {
  const res = await fetch(`http://localhost:3000/admin/coaches/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi xóa coach');
  return await res.json();
}

export async function getAllPosts(token) {
  const res = await fetch('http://localhost:3000/admin/posts', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy danh sách post');
  return await res.json();
}

export async function getPostById(id, token) {
  const res = await fetch(`http://localhost:3000/admin/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy post');
  return await res.json();
}

export async function deletePost(id, token) {
  const res = await fetch(`http://localhost:3000/admin/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi xóa post');
  return await res.json();
}

export async function createPost(data, token) {
  const res = await fetch('http://localhost:3000/admin/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi tạo post');
  return await res.json();
}
export async function updatePost(id, data, token) {
  const res = await fetch(`http://localhost:3000/admin/posts/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi cập nhật post');
  return await res.json();
}

export async function getAllComments(token) {
  const res = await fetch('http://localhost:3000/admin/comments', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy danh sách comment');
  return await res.json();
}

export async function deleteComment(id, token) {
  const res = await fetch(`http://localhost:3000/admin/comments/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi xóa comment');
  return await res.json();
}

export async function getAllBlogs(token) {
  const res = await fetch('http://localhost:3000/admin/blogs', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy danh sách blog');
  return await res.json();
}

export async function getBlogById(id, token) {
  const res = await fetch(`http://localhost:3000/admin/blogs/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy blog');
  return await res.json();
}

export async function deleteBlog(id, token) {
  const res = await fetch(`http://localhost:3000/admin/blogs/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi xóa blog');
  return await res.json();
}

export async function getAllTopics(token) {
  const res = await fetch('http://localhost:3000/admin/topics', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy danh sách topic');
  return await res.json();
}

export async function createTopic(data, token) {
  const res = await fetch('http://localhost:3000/admin/topics', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      topic_id: data.topic_id,
      topic_name: data.topic_name,
      topic_content: data.topic_content
    })
  });
  if (!res.ok) throw new Error('Lỗi tạo topic');
  return await res.json();
}

export async function updateTopic(id, data, token) {
  const res = await fetch(`http://localhost:3000/admin/topics/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi cập nhật topic');
  return await res.json();
}

export async function deleteTopic(id, token) {
  const res = await fetch(`http://localhost:3000/admin/topics/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi xóa topic');
  return await res.json();
}

export async function getAllSubscriptions(token) {
  const res = await fetch('http://localhost:3000/admin/subscriptions', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy danh sách subscription');
  return await res.json();
}

export async function createSubscription(data, token) {
  const res = await fetch('http://localhost:3000/admin/subscriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi tạo subscription');
  return await res.json();
}

export async function updateSubscription(id, data, token) {
  const res = await fetch(`http://localhost:3000/admin/subscriptions/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi cập nhật subscription');
  return await res.json();
}

export async function deleteSubscription(id, token) {
  const res = await fetch(`http://localhost:3000/admin/subscriptions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi xóa subscription');
  return await res.json();
}

export async function getAllCheckIns(token) {
  const res = await fetch('http://localhost:3000/admin/checkins', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy danh sách check-in');
  return await res.json();
}

export async function getCheckInById(id, token) {
  const res = await fetch(`http://localhost:3000/admin/checkins/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy check-in');
  return await res.json();
}

export async function deleteCheckIn(id, token) {
  const res = await fetch(`http://localhost:3000/admin/checkins/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi xóa check-in');
  return await res.json();
}

export async function getStatistics(token) {
  const res = await fetch('http://localhost:3000/admin/statistics', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy thống kê');
  return await res.json();
}

export async function createUser(data, token) {
  const res = await fetch('http://localhost:3000/admin/users', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi tạo user');
  return await res.json();
}

export async function getPostLikes(id, token) {
  const res = await fetch(`http://localhost:3000/admin/posts/${id}/likes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy danh sách like');
  return await res.json();
}

export async function getAllUserSubscriptions(token) {
  const res = await fetch('http://localhost:3000/admin/user-subscriptions', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy danh sách user subscriptions');
  return await res.json();
}
export async function createUserSubscription(data, token) {
  const res = await fetch('http://localhost:3000/admin/user-subscriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi tạo user subscription');
  return await res.json();
}
export async function updateUserSubscription(user_id, sub_id, data, token) {
  const res = await fetch(`http://localhost:3000/admin/user-subscriptions/${user_id}/${sub_id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi cập nhật user subscription');
  return await res.json();
}
export async function deleteUserSubscription(user_id, sub_id, token) {
  const res = await fetch(`http://localhost:3000/admin/user-subscriptions/${user_id}/${sub_id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi xóa user subscription');
  return await res.json();
} 
export async function getAllUserAchievements(token) {
  return fetch('http://localhost:3000/admin/user-achievements', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.json());
}
export async function addUserAchievement(data, token) {
  return fetch('http://localhost:3000/admin/user-achievements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  }).then(res => res.json());
}
export async function deleteUserAchievement(user_id, achievement_id, token) {
  return fetch(`/api/admin/user-achievements/${user_id}/${achievement_id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.json());
}
export async function getAllAchievements(token) {
  return fetch('/api/achievements', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.json());
}