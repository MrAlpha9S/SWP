import {Routes, Route, useNavigate} from "react-router-dom";
import {createContext, useMemo} from "react";
import Navbar from './components/layout/navbar.jsx';
import './App.css';
import Homepage from './pages/homepage/homepage.jsx';
import DashBoard from "./pages/dashboardPage/dashboard.jsx";
import PostSignUpCallback from "./pages/signup/postSignUpCallback.jsx";
import Onboarding from "./pages/signup/onboarding.jsx";
import PostOnboardingCallback from "./pages/signup/postOnboardingCallback.jsx";
import MyProfile from "./pages/dashboardPage/myProfile.jsx";
import ErrorPage from "./pages/errorPage.jsx";
import {useAuth0} from "@auth0/auth0-react";
import {getUserProfile, syncProfileToStores} from "./components/utils/profileUtils.js";
import ForumPage from "./pages/forumPage/forumPage.jsx";
import CheckIn from "./pages/dashboardPage/checkInPage/checkIn.jsx";
import Footer from "./components/layout/footer.jsx";
import QuitExperiences from "./pages/forumPage/quitExperiences.jsx";
import GettingStarted from "./pages/forumPage/gettingStarted.jsx";
import StayingQuit from "./pages/forumPage/stayingQuit.jsx";
import HintsAndTips from "./pages/forumPage/hintsAndTips.jsx";
import ReasonsToQuit from "./pages/forumPage/reasonsToQuit.jsx";
import AllPosts from "./pages/forumPage/allPosts.jsx";
import PostPage from "./components/layout/forum/postPage.jsx";
import ForumEditor from './components/layout/forum/forumeditor.jsx'
import ForumProfile from './pages/forumPage/forumprofile.jsx'
import UpdateForumEditor from './components/layout/forum/editor/updateforumeditor.jsx'

import TopicsPage from "./pages/topicsPage/topicsPage.jsx";
import Topic from "./pages/topicsPage/topic.jsx";
import BlogPost from "./pages/topicsPage/blogPost.jsx";
import SubscriptionPage from "./pages/subscriptionPage/subscriptionPage.jsx";
import CongratulationPage from "./pages/subscriptionPage/CongratulationPage.jsx";
import CoachSelectPage from "./pages/subscriptionPage/coachSelectPage.jsx";
import {AnimatePresence} from "framer-motion";
import Profile from "./pages/profilePage/profile.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useEffect} from "react";
import {useOnlineUsersStore, useSocketStore} from "./stores/useSocketStore.js";
import {NotificationProvider, useNotificationManager} from './components/hooks/useNotificationManager.jsx';
import {queryClient} from "./main.jsx";
import {
    useCurrentStepDashboard, useHighlightCommentIdStore, useHighlightReviewIdStore,
    useNotificationAllowedStore,
    useSelectedUserAuth0IdStore,
    useUserInfoStore
} from "./stores/store.js";
import CoachRegistration from "./pages/coachRegisterPage/coachRegister.jsx";
import {generateToken} from "../notifications/firebase.js";
import {onMessage} from 'firebase/messaging'
import {messaging} from '../notifications/firebase.js'
import {updateUserToken} from "./components/utils/userUtils.js";
import Settings from "./pages/profilePage/settings.jsx";
import AdminDashboard from './pages/adminPage/adminDashboard.jsx';

const Context = createContext({name: 'Default'});


function AppContent() {
    const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();
    const initSocket = useSocketStore((state) => state.initSocket);
    const {openNotification} = useNotificationManager();
    const {setCurrentStepDashboard, currentStepDashboard} = useCurrentStepDashboard();
    const navigate = useNavigate();
    const {setSelectedUserAuth0Id} = useSelectedUserAuth0IdStore()
    const {notificationAllowed} = useNotificationAllowedStore();
    const {setHighlightCommentId} = useHighlightCommentIdStore()
    const {setHighlightReviewId} = useHighlightReviewIdStore()


    const updateFCMMutation = useMutation({
        mutationFn: async ({token, user, getAccessTokenSilently, isAuthenticated}) => {
            return await updateUserToken(user, getAccessTokenSilently, isAuthenticated, token);
        },
    });

    useEffect(() => {
        const setupFCM = async () => {
            const token = await generateToken();
            if (token) {
                updateFCMMutation.mutate({user, getAccessTokenSilently, isAuthenticated, token});

                onMessage(messaging, (payload) => {
                    const isVisible = document.visibilityState === 'visible';
                    if (payload?.data?.type === 'motivation' && isVisible) {
                        openNotification('motivation', payload.data);
                    }
                });
            } else {
                console.warn('🔕 User denied or blocked notifications');
            }
        };

        if (!user && !isAuthenticated) return
        setupFCM();
    }, [isAuthenticated, user, notificationAllowed]);


    const {isPending, data: userData} = useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            if (!isAuthenticated || !user) return null;
            const result = await getUserProfile(user, getAccessTokenSilently, isAuthenticated);
            return result?.data;
        },
        enabled: !!isAuthenticated && !!user,
    });

    useEffect(() => {
        if (!isPending && userData) {
            syncProfileToStores(userData);

            const currentStepDashboard = useCurrentStepDashboard.getState().currentStepDashboard;
            if (userData?.userInfo?.role === 'Member' && currentStepDashboard?.length === 0) {
                useCurrentStepDashboard.getState().setCurrentStepDashboard('dashboard');
            } else if (userData?.userInfo?.role === 'Coach' && currentStepDashboard?.length === 0) {
                useCurrentStepDashboard.getState().setCurrentStepDashboard('overview');
            }
        }
    }, [userData, isPending]);


    useEffect(() => {
        const connectSocket = async () => {
            if (!isAuthenticated) return;

            const token = await getAccessTokenSilently();
            const socket = initSocket(token);

            socket.on('connect', () => {
                socket.emit('user_authenticate', {
                    userId: user.sub,
                    username: user.name,
                    avatar: user.picture
                });
            });

            socket.on('online_users_list', (users) => {
                const usersMap = new Map(users.map(u => [u.userId, u]));
                useOnlineUsersStore.getState().setOnlineUsers(usersMap);
            });

            socket.on('coach_selected', (data) => {
                queryClient.invalidateQueries(['notifications'])
                if (currentStepDashboard === 'notifications') return
                const onClick = () => {
                    navigate('/dashboard')
                    setCurrentStepDashboard('coach-user')
                    setSelectedUserAuth0Id(data.userAuth0Id)
                }
                queryClient.invalidateQueries(['coach-info'])
                openNotification('coach_selected', data, onClick);
            });

            socket.on('new_message', () => {
                queryClient.invalidateQueries(['messageConversations'])
            });

            socket.on('new_message_noti', (data) => {
                const currentStepDashboard = useCurrentStepDashboard.getState().currentStepDashboard;
                const isVisible = document.visibilityState === 'visible';
                const isUserCurrentlyFocused = isVisible

                if (!isUserCurrentlyFocused) {
                    // User is not focused, let push notification handle it
                    return;
                }
                queryClient.invalidateQueries(['notifications'])
                if (!location.pathname.startsWith('/dashboard') || (location.pathname.startsWith('/dashboard') && currentStepDashboard !== 'coach' && currentStepDashboard !== 'notifications')) {
                    const onClick = () => {
                        if (userData?.userInfo?.role === 'Coach') {
                            setCurrentStepDashboard('coach-user')
                            setSelectedUserAuth0Id(data.senderAuth0Id)
                            navigate('/dashboard')
                        } else if (userData?.userInfo?.role === 'Member') {
                            setCurrentStepDashboard('coach')
                            navigate('/dashboard')
                        }
                    }
                    openNotification('new_message', data, onClick);
                }
            });

            socket.on('plan-edit-by-coach', (data) => {
                queryClient.invalidateQueries(['notifications'])
                if (currentStepDashboard === 'notifications') return
                const onClick = () => {
                    setCurrentStepDashboard('coach')
                    navigate('/dashboard')
                }
                openNotification('plan-edit-by-coach', data, onClick);
            })

            socket.on('plan-edit-by-user', (data) => {
                queryClient.invalidateQueries(['notifications'])
                if (currentStepDashboard === 'notifications') return
                const onClick = () => {
                    navigate('/dashboard')
                    setCurrentStepDashboard('coach-user')
                    setSelectedUserAuth0Id(data.userAuth0Id)
                }
                openNotification('plan-edit-by-user', data, onClick);
            })

            socket.on('new-coach-review', (data) => {
                queryClient.invalidateQueries(['notifications'])
                if (currentStepDashboard === 'notifications') return
                const onClick = () => {
                    setHighlightReviewId(data.reviewId)
                    setCurrentStepDashboard('user-review')
                    navigate('/dashboard')
                }
                openNotification('new-coach-review', data, onClick);
            })

            socket.on('new-achievement', (data) => {
                queryClient.invalidateQueries(['notifications'])
                if (currentStepDashboard === 'notifications') return
                queryClient.invalidateQueries(['achieved'])
                const onClick = () => {
                    setCurrentStepDashboard('badges')
                    navigate('/dashboard')
                }
                openNotification('new-achievement', data, onClick);
            })

            socket.on('like', (data) => {
                queryClient.invalidateQueries(['notifications'])
                if (currentStepDashboard === 'notifications') return
                const onClick = () => {
                    if (data.inner_type === 'post') {
                        navigate(`/forum/${data.category_tag}/${data.post_id}`)
                    } else if (data.inner_type === 'comment') {
                        setHighlightCommentId(data.comment_id)
                        navigate(`/forum/${data.category_tag}/${data.post_id}`)
                    }
                }
                openNotification('like', data, onClick)
            })

            socket.on('reply', (data) => {
                queryClient.invalidateQueries(['notifications'])
                if (currentStepDashboard === 'notifications') return
                const onClick = () => {
                    setHighlightCommentId(data.comment_id)
                    navigate(`/forum/${data.category_tag}/${data.post_id}`)
                }
                openNotification('reply', data, onClick)
            })

            socket.on('post-approved', (data) => {
                queryClient.invalidateQueries(['notifications'])
                if (currentStepDashboard === 'notifications') return
                const onClick = () => {
                    navigate(`/forum/${data.category_tag}/${data.post_id}`)
                }
                openNotification('success', {
                    message: <span>
                Bài viết <strong>{data.post_title}</strong> vừa được duyệt.
            </span>,
                    content: ``,
                    ...data
                }, onClick)
            })

            socket.on('post-rejected', (data) => {
                queryClient.invalidateQueries(['notifications'])
                if (currentStepDashboard === 'notifications') return
                openNotification('failed', {
                    message: <span>
                Bài viết <strong>{data.post_title}</strong> bị từ chối.
            </span>,
                    content: ``,
                    ...data
                })
            })

            socket.on('delete-on-report-post', (data) => {
                queryClient.invalidateQueries(['notifications'])
                if (currentStepDashboard === 'notifications') return
                openNotification('failed', {
                    message: <span>Bài viết <strong>{data.post_title}</strong> của bạn bị xóa.</span>,
                    content: `Lý do: ${data.reason}`,
                    timestamp: data.timestamp
                })
            })

            socket.on('delete-on-report-comment', (data) => {
                queryClient.invalidateQueries(['notifications'])
                if (currentStepDashboard === 'notifications') return
                openNotification('failed', {
                    message: <span>Bình luận <strong>{data.comment_content}</strong> của bạn bị xóa.</span>,
                    content: `Lý do: ${data.reason}`,
                    timestamp: data.timestamp
                })
            })

            socket.on('blog-approved', (data) => {
                queryClient.invalidateQueries(['notifications'])
                if (currentStepDashboard === 'notifications') return
                const onClick = () => {
                    navigate(`/topics/${data.topic_id}/${data.blog_id}`)
                }
                openNotification('success', {
                    message: <span>Bài blog <strong>{data.title}</strong> của bạn đã được duyệt.</span>,
                    content: ``,
                    timestamp: data.timestamp
                }, onClick)
            })

            socket.on('blog-rejected', (data) => {
                queryClient.invalidateQueries(['notifications'])
                if (currentStepDashboard === 'notifications') return
                openNotification('failed', {
                    message: <span>Bài blog <strong>{data.title}</strong> của bạn bị từ chối.</span>,
                    content: ``,
                    timestamp: data.timestamp
                })
            })

            return () => {
                socket.disconnect();
            };
        };

        connectSocket();
    }, [isAuthenticated, getAccessTokenSilently, initSocket, user, userData, openNotification, navigate, setCurrentStepDashboard, setSelectedUserAuth0Id]);

    const contextValue = useMemo(() => ({name: 'Ant Design'}), []);

    return (
        <Context.Provider value={contextValue}>
            <Navbar/>
            <div className="w-full mx-auto min-h-screen bg-[#fff7e5]">
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<Homepage/>}/>
                        <Route path="/settings" element={<Settings/>}/>
                        <Route path="/dashboard" element={<DashBoard/>}/>
                        <Route path="/dashboard/check-in" element={<CheckIn/>}/>
                        <Route path="/dashboard/check-in/:date" element={<CheckIn/>}/>
                        <Route path="/topics" element={<TopicsPage/>}/>
                        <Route path="/topics/:topicId" element={<Topic/>}/>
                        <Route path="/topics/:topicId/:blogId" element={<BlogPost/>}/>
                        <Route path="/post-signup" element={<PostSignUpCallback/>}/>
                        <Route path="/onboarding/:from?" element={<Onboarding/>}/>
                        <Route path="/error" element={<ErrorPage/>}/>
                        <Route path="/banned" element={<ErrorPage status='403' title='Tài khoản của bạn đã bị khóa.' subTitle='Hãy liên hệ với hỗ trợ nếu bạn nghĩ đây là một sự nhầm lẫn.'/>}/>
                        <Route path="/post-onboarding/:from?" element={<PostOnboardingCallback/>}/>
                        <Route path="/my-profile" element={<MyProfile/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/forum" element={<ForumPage/>}/>
                        <Route path="/forum/quit-experiences" element={<QuitExperiences/>}/>
                        <Route path="/forum/getting-started" element={<GettingStarted/>}/>
                        <Route path="/forum/staying-quit" element={<StayingQuit/>}/>
                        <Route path="/forum/hints-and-tips" element={<HintsAndTips/>}/>
                        <Route path="/forum/reasons-to-quit" element={<ReasonsToQuit/>}/>
                        <Route path="/forum/all-posts" element={<AllPosts/>}/>
                        <Route path="/forum/:category/:postId" element={<PostPage/>}/>
                        <Route path="/subscription/:from?" element={<SubscriptionPage/>}/>
                        <Route path="/congratulationPage" element={<CongratulationPage/>}/>
                        <Route path="/coach-selection/:from?" element={<CoachSelectPage/>}/>
                        <Route path="/forum/editor" element={<ForumEditor/>}></Route>
                        <Route path="/forum/profile/:auth0_id" element={<ForumProfile/>}></Route>
                        <Route path="/coach-register" element={<CoachRegistration/>}></Route>
                        <Route path="/admin" element={<AdminDashboard/>}/>
                        <Route path="/forum/edit/:postId" element={<UpdateForumEditor/>}></Route>
                    </Routes>
                </AnimatePresence>
            </div>
            <Footer/>
        </Context.Provider>
    );
}

function App() {
    return (
        <NotificationProvider>
            <AppContent/>
        </NotificationProvider>
    );
}

export default App;

