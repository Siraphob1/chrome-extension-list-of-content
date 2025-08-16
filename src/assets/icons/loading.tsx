import clsx from "clsx";

interface IconLoadingProps {
  className?: string;
}

const IconLoading = ({ className }: IconLoadingProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      className={clsx("lucide lucide-loader-circle-icon lucide-loader-circle ", className)}
      aria-label="Icon-Loading"
      role="img"
    ><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
  );
}

export default IconLoading