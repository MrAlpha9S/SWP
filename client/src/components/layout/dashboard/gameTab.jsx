import React, {useState} from 'react';
import {Card, Modal} from "antd";
import {FaArrowRight} from "react-icons/fa";

const GameTab = () => {
    const [breathingModalOpen, setBreathingModalOpen] = useState(false);
    const [game1ModalOpen, setGame1ModalOpen] = useState(false);
    const [game2ModalOpen, setGame2ModalOpen] = useState(false);
    const [game3ModalOpen, setGame3ModalOpen] = useState(false);

    return (
        <div className=" mx-auto space-y-10">
            {/* Breathing Section */}
            <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Bài tập hít thở</h2>
                <p className="text-gray-700">
                    Hít thở đúng cách giúp bạn vượt qua cơn thèm thuốc và giữ tinh thần tỉnh táo trong hành trình cai thuốc.
                </p>

                <Card
                    className="bg-primary-100 border-0"
                    bodyStyle={{padding: '24px'}}
                    hoverable
                    onClick={() => setBreathingModalOpen(true)}
                >
                    <div className="flex items-center gap-5">
                        <img
                            src="/square-breathing.png"
                            alt="Square breathing"
                            className="w-24 h-24 md:w-32 md:h-32"
                        />
                        <div className="flex-1 space-y-1">
                            <h3 className="text-xl font-bold text-primary-800">Square breathing</h3>
                            <p className="text-gray-800">
                                Thực hành thở sâu và tập trung vào cảm giác thư giãn khi bạn thở ra.
                            </p>
                            <p className="text-sm text-gray-500 mt-1">🎥 Video · 3 phút</p>
                        </div>
                        <FaArrowRight className="text-primary-700 text-lg"/>
                    </div>
                </Card>
            </section>

            {/* Games Section */}
            <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Trò chơi thư giãn</h2>
                <p className="text-gray-700">
                    Các trò chơi đơn giản giúp bạn nhanh chóng phân tâm khỏi cơn thèm thuốc và giảm triệu chứng cai nghiện.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card
                        hoverable
                        className="bg-primary-100 border-0 h-full"
                        bodyStyle={{padding: '20px', height: '100%'}}
                        onClick={() => setGame1ModalOpen(true)}
                    >
                        <div className="flex flex-col h-full">
                            <img src="/sokoban.png" alt="Sokoban" className="w-full h-32 object-contain mb-4"/>
                            <h3 className="text-lg font-bold text-primary-800">Sokoban</h3>
                            <p className="text-gray-800 flex-grow">
                                Sokoban là trò chơi giải đố nơi bạn điều khiển người gác kho đẩy các thùng hàng vào đúng
                                vị trí. Luật chơi đơn giản nhưng đòi hỏi tư duy logic và chiến lược di chuyển khéo léo
                                để không bị kẹt.
                            </p>
                            <div className="mt-auto pt-2">
                                <FaArrowRight className="text-primary-700"/>
                            </div>
                        </div>
                    </Card>

                    <Card
                        hoverable
                        className="bg-primary-100 border-0 h-full"
                        bodyStyle={{padding: '20px', height: '100%'}}
                        onClick={() => setGame2ModalOpen(true)}
                    >
                        <div className="flex flex-col h-full">
                            <img src="/2048.jpg" alt="2048" className="w-full h-32 object-cover mb-4"/>
                            <h3 className="text-lg font-bold text-primary-800">2048</h3>
                            <p className="text-gray-800 flex-grow">
                                Trượt các ô số để hợp nhất thành số lớn hơn cho đến khi bạn đạt đến 2048.
                            </p>
                            <div className="mt-auto pt-2">
                                <FaArrowRight className="text-primary-700"/>
                            </div>
                        </div>
                    </Card>

                    <Card
                        hoverable
                        className="bg-primary-100 border-0 h-full"
                        bodyStyle={{padding: '20px', height: '100%'}} // ensure full height inside
                        onClick={() => setGame3ModalOpen(true)}
                    >
                        <div className="flex flex-col h-full">
                            <img src="/contra.png" alt="Contra Classic" className="w-full h-32 object-contain mb-4"/>
                            <h3 className="text-lg font-bold text-primary-800">Contra Classic</h3>
                            <p className="text-gray-800 flex-grow">
                                Contra là một trò chơi hành động đi cảnh cổ điển, nơi người chơi chiến đấu qua các màn
                                đầy kẻ địch, sử dụng nhiều loại vũ khí khác nhau để đánh bại trùm cuối và cứu thế giới.
                            </p>
                            <div className="mt-auto pt-2">
                                <FaArrowRight className="text-primary-700"/>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Breathing Modal */}
            <Modal
                title="Hít thở thư giãn"
                open={breathingModalOpen}
                onCancel={() => setBreathingModalOpen(false)}
                footer={null}
                width="80%"
                destroyOnClose
                centered
            >
                <div className="relative w-full pb-[56.25%] h-0 mb-6">
                    <iframe
                        src="https://www.youtube.com/embed/bF_1ZiFta-E"
                        title="Square Breathing Video"
                        className="absolute top-0 left-0 w-full h-full rounded shadow border"
                        allowFullScreen
                    ></iframe>
                </div>

                <div className="space-y-4 text-gray-800 text-base leading-relaxed">
                    <h2 className="text-xl font-semibold">Hít thở một chút</h2>
                    <p>
                        Phương pháp thở hộp (box breathing) có thể giúp bạn cảm thấy bình tĩnh và kiểm soát tốt hơn.
                        Cách thực hiện:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Hít vào bằng mũi trong 4 giây.</li>
                        <li>Giữ hơi thở trong 4 giây.</li>
                        <li>Thở ra từ từ bằng miệng trong 4 giây.</li>
                        <li>Giữ tiếp trong 4 giây.</li>
                    </ul>
                    <p>
                        Đó là một vòng. Hãy thử thực hiện 3 đến 4 vòng. Giữ vai thả lỏng và tập trung vào nhịp thở. Hãy
                        tưởng tượng như bạn đang vẽ một hình vuông trong đầu – lên, ngang, xuống, ngang.
                    </p>
                    <p>
                        Cảm thấy khá hơn chưa? Hãy ghi nhớ nhịp thở này để sử dụng khi cần thiết.
                    </p>
                </div>
            </Modal>

            <Modal
                title="Sokoban"
                open={game1ModalOpen}
                onCancel={() => setGame1ModalOpen(false)}
                footer={null}
                width="80%"
                destroyOnHidden
                centered
            >
                <div className="relative w-full pb-[150%] sm:pb-[100%] h-0">
                    <iframe
                        src="/games/Sokoban-Level-Generator-master/index.html"
                        title="HexGL"
                        className="absolute top-0 left-0 w-full h-full rounded shadow border"
                        allowFullScreen
                    ></iframe>
                </div>
            </Modal>

            <Modal
                title="2048"
                open={game2ModalOpen}
                onCancel={() => setGame2ModalOpen(false)}
                footer={null}
                width="80%"
                destroyOnHidden
                centered
            >
                <div className="relative w-full pb-[150%] sm:pb-[100%] h-0">
                    <iframe
                        src="/games/2048-master/index.html"
                        title="2048"
                        className="absolute top-0 left-0 w-full h-full"
                    ></iframe>
                </div>
            </Modal>

            <Modal
                title="Contra"
                open={game3ModalOpen}
                onCancel={() => setGame3ModalOpen(false)}
                footer={null}
                width="80%"
                destroyOnClose
                centered
            >
                <div className="relative w-full pb-[56.25%] h-0 mb-4">
                    <iframe
                        src="/games/contra-game-main/index.html"
                        title="Contra Game"
                        className="absolute top-0 left-0 w-full h-full rounded shadow border"
                        allowFullScreen
                    ></iframe>
                </div>

                <div className="text-sm text-gray-700 space-y-1 leading-relaxed">
                    <p><strong>Phím WASD:</strong> Di chuyển nhân vật (lên, trái, xuống, phải)</p>
                    <p><strong>Phím J:</strong> Bắn</p>
                    <p><strong>Phím K:</strong> Nhảy</p>
                    <p><strong>Phím Enter:</strong> Bắt đầu trò chơi / Tạm dừng</p>
                </div>
            </Modal>
        </div>)
};

export default GameTab;