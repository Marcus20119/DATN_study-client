import { Menu } from '@headlessui/react';
import { buttonClassName, menuColors } from './common';

interface IItemManageProject {}

const ItemManageProject: React.FC<IItemManageProject> = () => {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          className={buttonClassName(active)}
          style={{
            backgroundColor: active ? menuColors.fillActive : '',
          }}
        >
          <FileIcon active={active} />
          Quản lý dự án
        </button>
      )}
    </Menu.Item>
  );
};

export default ItemManageProject;

function FileIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="mr-2 h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M13 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V9l-7-7z"
        fill={active ? menuColors.fillActive : menuColors.fillInactive}
        stroke={active ? menuColors.strokeActive : menuColors.strokeInactive}
        strokeWidth="2.3"
        className="scale-[0.85]"
      />
      <path
        d="M13 3v6h6"
        fill={active ? menuColors.fillActive : menuColors.fillInactive}
        stroke={active ? menuColors.strokeActive : menuColors.strokeInactive}
        strokeWidth="2.3"
        className="scale-[0.85]"
      />
    </svg>
  );
}
