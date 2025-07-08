type PriceDirectionArrowProps = {
    direction: string;
  };
  
  export const PriceDirectionArrow = ({
    direction,
  }: PriceDirectionArrowProps) => {
    if (direction === "none") return <span className="w-6">-</span>;
    const isUp = direction === "up";
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={`w-6 h-6 transition-colors ${
          isUp ? "text-green-500" : "text-red-500"
        }`}
      >
        <path
          fillRule="evenodd"
          d={
            isUp
              ? "M10 17a.75.75 0 01-.75-.75V5.612L5.03 9.83a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l5.25 5.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25A.75.75 0 0110 17z"
              : "M10 3a.75.75 0 01.75.75v10.638l4.22-4.22a.75.75 0 111.06 1.06l-5.25 5.25a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 111.06-1.06l4.22 4.22V3.75A.75.75 0 0110 3z"
          }
          clipRule="evenodd"
        />
      </svg>
    );
  };
  