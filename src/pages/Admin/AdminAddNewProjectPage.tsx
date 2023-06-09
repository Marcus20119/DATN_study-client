import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { privateAxios } from '~/axiosConfig';
import { Container, Section } from '~/components/Common';
import { Input, Radio } from '~/components/Form';
import { Checkbox } from '~/components/Form/Checkbox';
import { useScrollOnTop } from '~/hooks';
import { BaseModule } from '~/modules';
import { StaffDataType } from '~/store/rootType';
import { useForm } from 'react-hook-form';
import { MyToast } from '~/utils';

interface IAdminAddNewProjectPage {}

const schemaProject = yup.object({
  name: yup.string().required('Không được để trống mục này'),
  project_key: yup
    .string()
    .required('Không được để trống mục này')
    .matches(/^[^A-Z]*[A-Z][^A-Z]*[A-Z][^A-Z]*[A-Z][^A-Z]*[A-Z][^A-Z]*$/, {
      message: 'Mã dự án phải có đúng 4 chữ cái in hoa',
    }),
  status: yup.number().required('Không được để trống mục này').oneOf([0, 1]),
});

const AdminAddNewProjectPage: React.FC<IAdminAddNewProjectPage> = ({}) => {
  useScrollOnTop();
  const [checkboxData, setCheckboxData] = useState<
    { label: string; value: number }[]
  >([]);
  const [fetchDataLoading, setFetchDataLoading] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      setFetchDataLoading(true);
      try {
        const { data: staffData } = await privateAxios.request({
          method: 'GET',
          url: '/g/staffs/',
        });
        const staffFetchData: StaffDataType[] = staffData.data;
        setCheckboxData(
          staffFetchData.map(item => ({
            label: item.full_name,
            value: item.id,
          }))
        );
      } catch (err) {
        console.log(err);
      } finally {
        setFetchDataLoading(false);
      }
    })();
  }, []);
  const {
    control: controlProject,
    handleSubmit: handleSubmitProject,
    formState: { isSubmitting: isSubmittingProject, errors: errorsProject },
    reset: resetProject,
  } = useForm({
    resolver: yupResolver(schemaProject),
    mode: 'onSubmit',
  });
  useEffect(() => {
    resetProject({ status: 0 });
  }, []);
  const [errorSubmitProject, setErrorSubmitProject] = useState<string>('');
  const onSubmitProjectHandler = async (data: any) => {
    setErrorSubmitProject('');
    try {
      console.log(' Data:', data);
      await privateAxios.request({
        method: 'POST',
        url: '/p/project/add-new/',
        data: {
          ...data,
          staff_count: data?.staff_ids?.length || 0,
          user_ids: [],
          user_count: 0,
        },
      });
      MyToast.success('Thêm dự án thành công');
    } catch (err: any) {
      console.log(err);
      setErrorSubmitProject(err?.response?.data?.message);
    }
  };
  const radioData: {
    name: string;
    value: number;
  }[] = [
    { name: 'Đang phát triển', value: 0 },
    {
      name: 'Đã hoàn thành',
      value: 1,
    },
  ];
  return (
    <Container>
      <Section
        sectionTitle="THÊM DỰ ÁN MỚI"
        isLoading={fetchDataLoading}
        protectedMobile
      >
        <div className="flex flex-col gap-8 w-full">
          <BaseModule
            handleSubmit={handleSubmitProject}
            onSubmitHandler={onSubmitProjectHandler}
            errors={errorsProject}
            errorSubmit={errorSubmitProject}
            isSubmitting={isSubmittingProject}
            title=""
            buttonSubmitLabel="Thêm dự án"
          >
            <Input
              control={controlProject}
              name="name"
              label="Tên dự án *"
              direction="horizontal"
              labelWidth={100}
            />
            <Input
              control={controlProject}
              name="project_key"
              label="Mã dự án *"
              direction="horizontal"
              labelWidth={100}
            />
            <Radio
              control={controlProject}
              label="Trạng thái *"
              name="status"
              radios={radioData}
              direction="horizontal"
              labelWidth={100}
            />
            {checkboxData && (
              <Checkbox
                control={controlProject}
                name="staff_ids"
                label="Nhân viên"
                checkboxes={checkboxData}
                labelWidth={100}
                direction="horizontal"
                checkboxDirection="vertical"
              />
            )}
          </BaseModule>
        </div>
      </Section>
    </Container>
  );
};

export default AdminAddNewProjectPage;
