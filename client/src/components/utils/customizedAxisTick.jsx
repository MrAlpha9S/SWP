export const CustomizedAxisTick = ({ x, y, payload }) => {
    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={16}
                textAnchor="end"
                fill="#666"
                fontSize={10}
                transform="rotate(-35)"
            >
                {payload.value}
            </text>
        </g>
    );
};
