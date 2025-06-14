import {useState} from "react";
import {FEELINGS, qnaOptions} from "../../constants/constants.js";
import {convertYYYYMMDDStrToDDMMYYYYStr} from "../utils/dateUtils.js";
import {MdExpandMore, MdExpandLess} from "react-icons/md";
import {useNavigate} from "react-router-dom";

const TimelineEntry = ({entry}) => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    const isMissed = entry.isMissed;
    const dateStrDDMMYY = convertYYYYMMDDStrToDDMMYYYYStr(entry.logged_at.split('T')[0]);

    const handleCheckIn = (dateStrDDMMYY) => {
        navigate('/dashboard/check-in/' + dateStrDDMMYY);
    }

    if (isMissed) {
        return (
            <div className="p-2 border-l-4 border-red-400 bg-red-50 rounded">
                <p className="text-base font-semibold text-gray-800">{dateStrDDMMYY}</p>
                <p className="text-sm italic text-gray-700">Bạn đã bỏ lỡ check-in trong ngày này.</p>
                <button className='hover:text-primary-600' onClick={() => handleCheckIn(entry.logged_at.split('T')[0])}>Nhấn vào đây để Check-in ngay</button>
            </div>
        );
    }

    const feeling = FEELINGS.find((feel) => entry.feeling === feel.value);
    const freetext = entry.free_text_content;
    const qna = entry.qna || [];
    const cigsSmoked = entry.cigs_smoked;

    const cigsSmokedPhrase =
        cigsSmoked === 0
            ? 'Tôi đã không hút điếu nào trong hôm nay'
            : cigsSmoked > 0
                ? `Tôi đã hút ${cigsSmoked} điếu thuốc`
                : 'missed';

    const shouldShowExpand = freetext?.length > 200 || qna.length > 0;

    return (
        <>
            <div className="transition-all duration-300 relative"
                 style={expanded ? {} : {maxHeight: 180, overflow: 'hidden'}}>
                <p className="text-base font-semibold text-gray-800">{dateStrDDMMYY}</p>

                {feeling && (
                    <p className="text-sm font-medium text-gray-600">
                        {feeling.emoji} {feeling.label}
                    </p>
                )}

                <p className="text-sm italic text-gray-700">{cigsSmokedPhrase}</p>

                {(freetext || qna.length > 0) && (
                    <p className="text-sm font-semibold text-primary-700 mt-2">Tôi đã viết:</p>
                )}

                {freetext && (
                    <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">{freetext}</p>
                )}

                {qna.length > 0 && qnaOptions.map(({label}, index) => (
                    <div key={index} className="mb-3 line-clamp-5">
                        <p className="text-sm font-medium text-gray-700">{label}</p>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                            {qna[index]?.qna_answer ?? "Không có câu trả lời"}
                        </p>
                    </div>
                ))}
            </div>

            {!expanded && shouldShowExpand && <p className='text-xl font-bold text-center'>...</p>}

            {shouldShowExpand && (
                <div className="text-sm text-gray-600 flex justify-center mt-2 cursor-pointer">
                    <button onClick={() => setExpanded(!expanded)} className="mt-1 flex items-center gap-1 hover:text-primary-600">
                        {expanded ? (
                            <>
                                Rút gọn <MdExpandLess className="size-5" />
                            </>
                        ) : (
                            <>
                                Xem thêm <MdExpandMore className="size-5" />
                            </>
                        )}
                    </button>
                </div>
            )}
        </>
    );
};

export default TimelineEntry;
