import { useSelector } from 'react-redux';
import { Container } from '~/components/Common';
import { useScrollOnTop } from '~/hooks';
import { IRootState } from '~/store/rootReducer';

type ICalenderPage = {};

const CalenderPage: React.FC<ICalenderPage> = () => {
  useScrollOnTop();
  const { isReachScrolling } = useSelector((state: IRootState) => state.base);
  return (
    <Container className={`!items-start h-[1000px] `}>
      <div className="w-full mt-4">
        <span>Trang lịch làm việc</span>
      </div>
    </Container>
  );
};

export default CalenderPage;
