interface IProps {
  color: string;
  size: number;
}
export default function Svf({ color, size }: IProps) {
  return (
    <svg
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2}
        fill={color}
        stroke="black"
        strokeWidth="1"
      />
    </svg>
  );
}
