import { actionButtonClassName } from './common';

type IActivateButton = {
  onClick?: () => void;
  title?: string;
};

const ActivateButton: React.FC<IActivateButton> = ({
  onClick = () => {},
  title = 'Activate',
}) => {
  return (
    <button title={title} className={actionButtonClassName} onClick={onClick}>
      <ActivateIcon />
    </button>
  );
};

export { ActivateButton };

const ActivateIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
      className="w-6 h-6"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
};
