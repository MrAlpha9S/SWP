import React, {useEffect, useState} from 'react';
import {
    Form,
    Input,
    DatePicker,
    Select,
    Button,
    Upload,
    Steps,
    Card,
    Space,
    Radio,
    message,
    Divider,
    Row,
    Col
} from 'antd';
import {
    PlusOutlined,
    UploadOutlined,
    DeleteOutlined,
    UserOutlined,
    FileTextOutlined,
    TrophyOutlined,
    BookOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {useUserInfoStore} from "../../stores/store.js";
import { registerCoach } from "../../components/utils/userUtils";
import { useAuth0 } from '@auth0/auth0-react';

const { TextArea } = Input;
const { Option } = Select;

function CoachRegistration() {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [experiences, setExperiences] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const {userInfo} = useUserInfoStore()
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    useEffect(() => {
        if (userInfo?.username) {
            form.setFieldsValue({
                name: userInfo.username,
            });
        }
    }, [userInfo, form]);

    const steps = [
        {
            title: 'Thông tin cá nhân',
            icon: <UserOutlined />,
        },
        {
            title: 'Kinh nghiệm',
            icon: <TrophyOutlined />,
        },
        {
            title: 'Giới thiệu',
            icon: <FileTextOutlined />,
        },
        {
            title: 'Chứng chỉ',
            icon: <BookOutlined />,
        },
        {
            title: 'Xem lại thông tin',
            icon: <FileTextOutlined />,
        },
    ];

    const addExperience = () => {
        setExperiences([...experiences, { id: Date.now(), type: '', description: '' }]);
    };

    const removeExperience = (id) => {
        setExperiences(experiences.filter(exp => exp.id !== id));
    };

    const updateExperience = (id, field, value) => {
        setExperiences(experiences.map(exp =>
            exp.id === id ? { ...exp, [field]: value } : exp
        ));
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleFileUpload = async (file) => {
        if (file.size > 10 * 1024 * 1024) {
            message.error('Kích thước file không được vượt quá 10MB');
            return false;
        }

        try {
            const base64 = await convertToBase64(file);
            setCertificates([...certificates, {
                id: Date.now(),
                name: file.name,
                base64: base64,
                size: file.size
            }]);
            message.success('Tải lên thành công');
        } catch (error) {
            message.error('Lỗi khi tải file');
        }
        return false;
    };

    const removeCertificate = (id) => {
        setCertificates(certificates.filter(cert => cert.id !== id));
    };

    const onFinish = async () => {
        console.log('onFinish called at step:', currentStep);
        console.log('isSubmitting:', isSubmitting, 'hasSubmitted:', hasSubmitted);
        
        // Ngăn chặn submit nhiều lần
        if (isSubmitting || hasSubmitted) {
            console.log('Already submitting or submitted, ignoring...');
            return;
        }

        // Validate form trước khi submit
        try {
            await form.validateFields();
        } catch (error) {
            console.log('Form validation failed:', error);
            message.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        console.log('Submitting coach registration...');
        setIsSubmitting(true);
        
        try {
            const values = form.getFieldsValue(true);
            const formData = {
                name: values.name,
                birthdate: values.birthdate?.format('YYYY-MM-DD'),
                sex: values.sex,
                cccd: values.cccd,
                cccdIssuedDate: values.cccdIssuedDate?.format('YYYY-MM-DD'),
                address: values.address,
                experiences: experiences,
                motto: values.motto,
                selfIntroduction: values.selfIntroduction,
                certificates: certificates
            };

            console.log('Form data to submit:', formData);

            const token = await getAccessTokenSilently();
            const result = await registerCoach(formData, token);
            
            if (result.success) {
                setHasSubmitted(true);
                message.success('Đăng ký thành công! Hồ sơ của bạn đang chờ được duyệt.');
                // Có thể redirect hoặc reset form ở đây
            } else {
                message.error(result.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            console.error('Error in onFinish:', error);
            message.error('Có lỗi xảy ra khi gửi đăng ký');
        } finally {
            setIsSubmitting(false);
        }
    };


    const nextStep = () => {
        console.log('nextStep called at step:', currentStep);
        if (currentStep < 4) {
            form.validateFields()
                .then(() => {
                    const allValues = form.getFieldsValue(true);
                    console.log('Full Values:', allValues);
                    setCurrentStep(currentStep + 1);
                })
                .catch(() => {
                    message.error('Vui lòng điền đầy đủ thông tin bắt buộc');
                });
        }
        // Không cho phép chuyển tiếp từ step cuối cùng
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cá nhân</h3>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Họ và tên"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}

                                >
                                    <Input 
                                        placeholder="Nhập họ và tên" 
                                        disabled
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="birthdate"
                                    label="Ngày sinh"
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                                >
                                    <DatePicker
                                        placeholder="Chọn ngày sinh"
                                        style={{ width: '100%' }}
                                        format="DD/MM/YYYY"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="sex"
                                    label="Giới tính"
                                    rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                                >
                                    <Select placeholder="Chọn giới tính">
                                        <Option value="male">Nam</Option>
                                        <Option value="female">Nữ</Option>
                                        <Option value="other">Khác</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="cccd"
                                    label="Số CCCD"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số CCCD' },
                                        { pattern: /^\d{12}$/, message: 'CCCD phải có 12 chữ số' }
                                    ]}
                                >
                                    <Input placeholder="Nhập số CCCD" maxLength={12} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="cccdIssuedDate"
                                    label="Ngày cấp CCCD"
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày cấp CCCD' }]}
                                >
                                    <DatePicker
                                        placeholder="Chọn ngày cấp"
                                        style={{ width: '100%' }}
                                        format="DD/MM/YYYY"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="address"
                                    label="Địa chỉ"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                >
                                    <Input placeholder="Nhập địa chỉ" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Kinh nghiệm</h3>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={addExperience}
                                className="bg-teal-600 hover:bg-teal-700"
                            >
                                Thêm kinh nghiệm
                            </Button>
                        </div>

                        {experiences.map((exp, index) => (
                            <Card key={exp.id} className="mb-4">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-medium text-gray-700">Kinh nghiệm {index + 1}</span>
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeExperience(exp.id)}
                                    />
                                </div>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Select
                                            placeholder="Chọn loại"
                                            value={exp.type}
                                            onChange={(value) => updateExperience(exp.id, 'type', value)}
                                            style={{ width: '100%' }}
                                        >
                                            <Option value="specialty">Chuyên môn</Option>
                                            <Option value="achievement">Thành tích</Option>
                                        </Select>
                                    </Col>
                                    <Col span={16}>
                                        <Input
                                            placeholder="Mô tả kinh nghiệm"
                                            value={exp.description}
                                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        ))}

                        {experiences.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <TrophyOutlined className="text-4xl mb-2" />
                                <p>Chưa có kinh nghiệm nào. Hãy thêm kinh nghiệm của bạn!</p>
                            </div>
                        )}
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Giới thiệu bản thân</h3>
                        <Form.Item
                            name="motto"
                            label="Phương châm làm việc"
                            rules={[{ required: true, message: 'Vui lòng nhập phương châm' }]}
                        >
                            <TextArea
                                rows={3}
                                placeholder="Chia sẻ phương châm làm việc của bạn"
                                maxLength={200}
                                showCount
                            />
                        </Form.Item>

                        <Form.Item
                            name="selfIntroduction"
                            label="Giới thiệu bản thân"
                            rules={[{ required: true, message: 'Vui lòng viết giới thiệu bản thân' }]}
                        >
                            <TextArea
                                rows={6}
                                placeholder="Giới thiệu về bản thân, kinh nghiệm và sở thích của bạn"
                                maxLength={1000}
                                showCount
                            />
                        </Form.Item>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Chứng chỉ</h3>
                            <Upload
                                accept="image/*"
                                beforeUpload={handleFileUpload}
                                showUploadList={false}
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                    className="bg-teal-600 hover:bg-teal-700 text-white"
                                >
                                    Tải lên chứng chỉ
                                </Button>
                            </Upload>
                        </div>

                        <div className="text-sm text-gray-600 mb-4">
                            <p>• Chỉ chấp nhận file hình ảnh (JPG, PNG, GIF)</p>
                            <p>• Kích thước tối đa: 10MB</p>
                            <p>• Có thể tải lên nhiều chứng chỉ</p>
                        </div>

                        {certificates.map((cert) => (
                            <Card key={cert.id} className="mb-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <FileTextOutlined className="text-blue-500 mr-2" />
                                        <div>
                                            <p className="font-medium">{cert.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {(cert.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeCertificate(cert.id)}
                                    />
                                </div>
                            </Card>
                        ))}

                        {certificates.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <BookOutlined className="text-4xl mb-2" />
                                <p>Chưa có chứng chỉ nào. Hãy tải lên chứng chỉ của bạn!</p>
                            </div>
                        )}
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6">Xem lại thông tin đăng ký</h3>

                        {/* Personal Information Summary */}
                        <Card title="Thông tin cá nhân" className="mb-4">
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 text-sm">Họ và tên</span>
                                        <span className="font-medium">{form.getFieldValue('name') || 'Chưa nhập'}</span>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 text-sm">Ngày sinh</span>
                                        <span className="font-medium">
                      {form.getFieldValue('birthdate')?.format('DD/MM/YYYY') || 'Chưa chọn'}
                    </span>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 text-sm">Giới tính</span>
                                        <span className="font-medium">
                      {form.getFieldValue('sex') === 'male' ? 'Nam' :
                          form.getFieldValue('sex') === 'female' ? 'Nữ' :
                              form.getFieldValue('sex') === 'other' ? 'Khác' : 'Chưa chọn'}
                    </span>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 text-sm">Số CCCD</span>
                                        <span className="font-medium">{form.getFieldValue('cccd') || 'Chưa nhập'}</span>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 text-sm">Ngày cấp CCCD</span>
                                        <span className="font-medium">
                      {form.getFieldValue('cccdIssuedDate')?.format('DD/MM/YYYY') || 'Chưa chọn'}
                    </span>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 text-sm">Địa chỉ</span>
                                        <span className="font-medium">{form.getFieldValue('address') || 'Chưa nhập'}</span>
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        {/* Experience Summary */}
                        <Card title="Kinh nghiệm" className="mb-4">
                            {experiences.length > 0 ? (
                                <div className="space-y-3">
                                    {experiences.map((exp, index) => (
                                        <div key={exp.id} className="border-l-4 border-teal-500 pl-4 py-2">
                                            <div className="flex items-center mb-1">
                        <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs font-medium mr-2">
                          {exp.type === 'specialty' ? 'Chuyên môn' : 'Thành tích'}
                        </span>
                                            </div>
                                            <p className="text-gray-700">{exp.description || 'Chưa có mô tả'}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">Chưa có kinh nghiệm nào được thêm</p>
                            )}
                        </Card>

                        {/* Introduction Summary */}
                        <Card title="Giới thiệu" className="mb-4">
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <div className="flex flex-col mb-4">
                                        <span className="text-gray-600 text-sm mb-2">Phương châm làm việc</span>
                                        <div className="bg-gray-50 p-3 rounded border">
                                            <p className="text-gray-700">
                                                {form.getFieldValue('motto') || 'Chưa nhập phương châm'}
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={24}>
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 text-sm mb-2">Giới thiệu bản thân</span>
                                        <div className="bg-gray-50 p-3 rounded border">
                                            <p className="text-gray-700 whitespace-pre-wrap">
                                                {form.getFieldValue('selfIntroduction') || 'Chưa có giới thiệu'}
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        {/* Certificates Summary */}
                        <Card title="Chứng chỉ" className="mb-4">
                            {certificates.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {certificates.map((cert) => (
                                        <div key={cert.id} className="border rounded-lg p-3 bg-gray-50">
                                            <div className="flex items-center">
                                                <FileTextOutlined className="text-blue-500 mr-2 text-lg" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800 truncate">{cert.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {(cert.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">Chưa có chứng chỉ nào được tải lên</p>
                            )}
                        </Card>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        Xác nhận thông tin
                                    </h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <p>Vui lòng kiểm tra lại tất cả thông tin trước khi hoàn thành đăng ký. Sau khi gửi, bạn sẽ không thể chỉnh sửa thông tin này.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Đăng ký trở thành huấn luyện viên
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Chia sẻ kinh nghiệm và giúp đỡ những người muốn cải thiện sức khỏe
                            </p>
                        </div>
                        <div className="w-48 h-32 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <UserOutlined className="text-white text-4xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-[1180px] mx-auto px-6 py-8">
                <Card className="shadow-lg">
                    {/* Progress Steps */}
                    <div className="mb-8">
                        <Steps
                            current={currentStep}
                            items={steps}
                            className="mb-6"
                        />
                    </div>

                    {/* Form */}
                    <Form
                        form={form}
                        layout="vertical"
                        className="space-y-6"
                        onKeyPress={(e) => {
                            // Ngăn chặn submit form bằng Enter key
                            if (e.key === 'Enter') {
                                e.preventDefault();
                            }
                        }}
                    >
                        {renderStepContent()}

                        <Divider />

                        {/* Navigation Buttons */}
                        <div className="flex justify-between">
                            <Button
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                size="large"
                            >
                                Quay lại
                            </Button>

                            <div className="flex space-x-3">
                                {currentStep < steps.length - 1 ? (
                                    <Button
                                        type="primary"
                                        onClick={nextStep}
                                        size="large"
                                        className="bg-teal-600 hover:bg-teal-700"
                                        htmlType="button" // Đảm bảo không submit form
                                    >
                                        {currentStep === steps.length - 2 ? 'Xem lại thông tin' : 'Tiếp theo'}
                                    </Button>
                                ) : (
                                    <Button
                                        type="primary"
                                        onClick={onFinish}
                                        size="large"
                                        className="bg-green-600 hover:bg-green-700"
                                        loading={isSubmitting}
                                        disabled={hasSubmitted}
                                    >
                                        {hasSubmitted ? 'Đã đăng ký thành công' : 'Hoàn thành đăng ký'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
}

export default CoachRegistration;