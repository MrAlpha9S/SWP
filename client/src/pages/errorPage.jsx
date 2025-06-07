
import React from 'react';
import { Button, Result, Typography } from 'antd';
import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import {useNavigate} from "react-router-dom";

const { Title, Paragraph } = Typography;

const ErrorPage = ({
                       status = '500',
                       title,
                       subTitle,
                       showHomeButton = true,
                       showRefreshButton = false,
                       onHomeClick = () => window.location.href = '/',
                       onRefreshClick = () => window.location.reload()
                   }) => {
    const {navigate} = useNavigate()
    const getDefaultContent = () => {
        switch (status) {
            case '404':
                return {
                    title: title || 'Page Not Found',
                    subTitle: subTitle || 'Sorry, the page you visited does not exist.',
                };
            case '500':
                return {
                    title: title || 'Server Error',
                    subTitle: subTitle || 'Sorry, something went wrong on our end.',
                };
            case '403':
                return {
                    title: title || 'Access Denied',
                    subTitle: subTitle || 'Sorry, you are not authorized to access this page.',
                };
            default:
                return {
                    title: title || 'Something went wrong',
                    subTitle: subTitle || 'An unexpected error occurred.',
                };
        }
    };

    const { title: defaultTitle, subTitle: defaultSubTitle } = getDefaultContent();

    const actions = [];

    if (showHomeButton) {
        actions.push(
            <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                onClick={() => navigate('/')}
                className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
                key="home"
            >
                Back to Home
            </Button>
        );
    }

    if (showRefreshButton) {
        actions.push(
            <Button
                size="large"
                icon={<ReloadOutlined />}
                onClick={onRefreshClick}
                className="border-gray-300 hover:border-blue-500 hover:text-blue-500"
                key="refresh"
            >
                Try Again
            </Button>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="bg-white rounded-2xl shadow-2xl shadow-blue-100/50 p-8 md:p-12 border border-gray-100">
                    <Result
                        status={status}
                        title={
                            <Title
                                level={1}
                                className="!text-gray-800 !mb-4 text-2xl md:text-3xl lg:text-4xl font-bold"
                            >
                                {defaultTitle}
                            </Title>
                        }
                        subTitle={
                            <Paragraph className="!text-gray-600 !text-lg md:!text-xl !mb-8 leading-relaxed">
                                {defaultSubTitle}
                            </Paragraph>
                        }
                        extra={
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                {actions}
                            </div>
                        }
                        className="!p-0"
                    />

                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <div className="text-center">
                            <Paragraph className="!text-gray-500 !text-sm">
                                Need help? Contact our{' '}
                                <a
                                    href="mailto:support@example.com"
                                    className="text-blue-500 hover:text-blue-600 underline decoration-blue-200 hover:decoration-blue-400 transition-colors"
                                >
                                    support team
                                </a>
                            </Paragraph>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-10 w-24 h-24 bg-pink-200/20 rounded-full blur-xl animate-pulse delay-500"></div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
