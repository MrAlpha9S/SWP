import React, { useState, useEffect } from 'react';
import { Carousel } from 'antd';
import { Typography } from 'antd';
import {quotes} from '../../constants/constants.js'; // Adjust path if needed

const { Paragraph, Text } = Typography;

// Utility: pick 3 random quotes from the full array
const getRandomQuotes = (arr, count = 5) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const QuoteCarousel = () => {
    const [selectedQuotes, setSelectedQuotes] = useState([]);

    // Shuffle quotes on component mount
    useEffect(() => {
        setSelectedQuotes(getRandomQuotes(quotes, 3));
    }, []);

    // Shuffle quotes every time the carousel completes a full cycle
    const handleAfterChange = (current) => {
        // When we reach the last slide, shuffle for the next cycle
        if (current === selectedQuotes.length - 1) {
            setTimeout(() => {
                setSelectedQuotes(getRandomQuotes(quotes, 3));
            }, 6000); // Wait for the autoplay delay before shuffling
        }
    };

    if (selectedQuotes.length === 0) {
        return <div>Loading quotes...</div>;
    }

    return (
        <Carousel
            arrows
            autoplay
            autoplaySpeed={6000}
            dots
            afterChange={handleAfterChange}
            className='bg-primary-100 rounded-lg h-[130px] flex items-center justify-center p-5'
        >
            {selectedQuotes.map((quote, index) => (
                <div key={`${quote.author}-${index}`} style={{ padding: '30px', background: '#f0fdf4', minHeight: 180 }}>
                    <Paragraph
                        style={{
                            fontSize: 18,
                            fontStyle: 'italic',
                            textAlign: 'center',
                            maxWidth: 600,
                            margin: '0 auto',
                        }}
                    >
                        <strong>"{quote.content}"</strong>
                    </Paragraph>
                    <Text
                        type="secondary"
                        style={{
                            display: 'block',
                            marginTop: 16,
                            textAlign: 'center',
                            fontWeight: 'bold',
                        }}
                    >
                        — {quote.author}
                    </Text>
                </div>
            ))}
        </Carousel>
    );
};

export default QuoteCarousel;