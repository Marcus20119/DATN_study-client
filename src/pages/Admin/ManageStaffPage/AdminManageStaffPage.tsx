import queryString from 'query-string';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { Container, Section } from '~/components/Common';
import Paginate from '~/components/Paginate/Paginate';
import { TableFilter } from '~/components/Table';
import TableTab from '~/components/Table/TableTab';
import { useNavigateQuery, useScrollOnTop } from '~/hooks';
import { actionAdminGetAllDataFromStaff } from '~/store/admin/admin.action';
import { IRootState } from '~/store/rootReducer';
import {
  GetAllDataFromStaffType,
  ManageStaffTabType,
  StaffDataType,
} from '~/store/rootType';
import { SearchParams } from '~/types';
import AdminManageStaffTable from './AdminManageStaffTable';

interface IAdminManageStaffPage {}

const tableTabs: ManageStaffTabType[] = ['Active Staff', 'Deleted Staff'];
const fieldsList: {
  id: number;
  name: string;
  type: keyof StaffDataType;
}[] = [
  { id: 1, name: 'ID', type: 'id' },
  { id: 2, name: 'Tên nhân viên', type: 'full_name' },
  { id: 3, name: 'Email', type: 'email' },
  { id: 4, name: 'SĐT', type: 'phone_number' },
  { id: 5, name: 'Giới tính', type: 'gender' },
  { id: 6, name: 'Ngày tạo', type: 'created_at' },
];

const AdminManageStaffPage: React.FC<IAdminManageStaffPage> = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const params = queryString.parse(search) as SearchParams;
  const {
    loadingGetStaffsData,
    tableTotalPage,
    toggleForceRefetchAdminStaffsData,
  } = useSelector((state: IRootState) => state.admin);

  const [tableCurrentTab, setTableCurrentTab] = useState<ManageStaffTabType>(
    params.tab as ManageStaffTabType
  );
  const [tableCurrentPage, setTableCurrentPage] = useState<number>(
    Number.parseInt(params.page)
  );
  useScrollOnTop([tableCurrentPage]);

  // Set lại state khi thay đổi query
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      setTableCurrentTab(params.tab as ManageStaffTabType);
      setTableCurrentPage(Number.parseInt(params.page));
    }
    didMountRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const [orderField, setOrderField] =
    useState<GetAllDataFromStaffType['query']['orderField']>('id');
  const [orderType, setOrderType] =
    useState<GetAllDataFromStaffType['query']['orderType']>('ASC');

  // Fetch dữ liệu với dữ liệu từ query
  useEffect(() => {
    dispatch(
      actionAdminGetAllDataFromStaff({
        query: { orderField, orderType, page: tableCurrentPage },
        type: tableCurrentTab,
      })
    );
  }, [
    dispatch,
    orderField,
    orderType,
    tableCurrentPage,
    tableCurrentTab,
    toggleForceRefetchAdminStaffsData,
  ]);

  // Thay đổi query
  useNavigateQuery({
    newPath: `/admin/staff/manage?tab=${tableCurrentTab}&page=${tableCurrentPage}`,
    rerenderConditions: [tableCurrentPage, tableCurrentTab],
  });

  return (
    <Container>
      <Section
        sectionTitle="QUẢN LÝ NHÂN VIÊN"
        isLoading={loadingGetStaffsData}
        navigateLabel="Thêm nhân viên"
        navigatePath="/admin/staff/add-new"
        protectedMobile
      >
        <div className="w-full mb-4">
          <div className="flex justify-end items-center w-full mb-4">
            <TableFilter
              setOrderField={setOrderField}
              setOrderType={setOrderType}
              fieldsList={fieldsList}
            />
          </div>
          <div className="relative w-full z-10">
            <TableTab
              tableTabs={tableTabs}
              tableCurrentTab={tableCurrentTab}
              handleSetTab={(tab: ManageStaffTabType) => {
                setTableCurrentTab(tab);
                setTableCurrentPage(1);
              }}
              disabled={loadingGetStaffsData}
            />
            <AdminManageStaffTable
              currentTab={tableCurrentTab}
              currentPage={tableCurrentPage}
            />
          </div>
          <Paginate
            currentPage={tableCurrentPage}
            setCurrentPage={setTableCurrentPage}
            totalPage={tableTotalPage}
          />
        </div>
      </Section>
    </Container>
  );
};

export default AdminManageStaffPage;
