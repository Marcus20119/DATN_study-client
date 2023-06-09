import Header from '~/layouts/Header/Header';

type ILoadingPage = {};

const LoadingPage: React.FC<ILoadingPage> = () => {
  return (
    <>
      <div className="w-full h-[1000px]">
        <Header />
      </div>
    </>
  );
};

export default LoadingPage;
