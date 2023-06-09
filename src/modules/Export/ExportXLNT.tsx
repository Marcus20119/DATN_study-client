import queryString from 'query-string';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'sheetjs-style';
import { privateAxios } from '~/axiosConfig';

import { ButtonPrimary } from '~/components/Button';
import { Section } from '~/components/Common';
import Paginate from '~/components/Paginate/Paginate';
import { TableBase, TableFilter, TableLoading } from '~/components/Table';
import { ReadData } from '~/helpers';
import { useNavigateQuery } from '~/hooks';
import { actionClientGetAllDataFromError } from '~/store/client/client.action';
import { IRootState } from '~/store/rootReducer';
import { ErrorDataType, GetAllDataFromErrorType } from '~/store/rootType';
import { SearchParams } from '~/types';

interface IExportXLNT {}

const fieldsList: {
  id: number;
  name: string;
  type: keyof ErrorDataType;
}[] = [
  { id: 1, name: 'ID', type: 'id' },
  { id: 2, name: 'Lỗi', type: 'error_message' },
  { id: 3, name: 'Ngày tạo', type: 'created_at' },
];

const ExportXLNT: React.FC<IExportXLNT> = ({}) => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const params = queryString.parse(search) as SearchParams;
  const {
    errorsData,
    loadingGetErrorsData,
    tableTotalPage,
    toggleForceRefetchClientErrorsData,
  } = useSelector((state: IRootState) => state.client);
  const { userData } = useSelector((state: IRootState) => state.auth);

  const [tableCurrentPage, setTableCurrentPage] = useState<number>(
    Number.parseInt(params.page)
  );

  // Set lại state khi thay đổi query
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      setTableCurrentPage(Number.parseInt(params.page));
    }
    didMountRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const [orderField, setOrderField] =
    useState<GetAllDataFromErrorType['query']['orderField']>('id');
  const [orderType, setOrderType] =
    useState<GetAllDataFromErrorType['query']['orderType']>('DESC');

  useEffect(() => {
    dispatch(
      actionClientGetAllDataFromError({
        query: { orderField, orderType, page: tableCurrentPage },
        project_id: userData.project_id,
      })
    );
  }, [
    dispatch,
    orderField,
    orderType,
    tableCurrentPage,
    toggleForceRefetchClientErrorsData,
    userData.project_id,
  ]);

  // Thay đổi query
  useNavigateQuery({
    newPath: `/client/export?page=${tableCurrentPage}`,
    rerenderConditions: [tableCurrentPage],
  });

  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [allErrorData, setAllErrorData] = useState<any>([]);
  useEffect(() => {
    (async () => {
      setExportLoading(true);
      const { data } = await privateAxios.request({
        method: 'GET',
        url: '/g/export-error/' + userData.project_id,
      });
      const neededData = data.data.map((item: Partial<ErrorDataType>) => ({
        ...item,
        created_at: ReadData.time(item.created_at),
      }));
      setAllErrorData(neededData);
      setExportLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(allErrorData);

    // Style File Excel
    const titleStyle = {
      font: { bold: true, sz: '16' },
      alignment: {
        vertical: 'center',
        horizontal: 'center',
      },
    };
    const headerStyle = {
      font: { bold: true },
      alignment: {
        vertical: 'center',
        horizontal: 'center',
      },
    };
    const cellStyle = {
      alignment: {
        vertical: 'center',
        horizontal: 'center',
      },
    };

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [['DỮ LIỆU LỖI CỦA DỰ ÁN XỬ LÝ NƯỚC THẢI', '', '']],
      { origin: 'A1' }
    );

    XLSX.utils.sheet_add_json(worksheet, allErrorData, { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(worksheet, [['ID', 'Lỗi', 'Thời gian']], {
      origin: 'A2',
    });

    for (let row = 0; row < allErrorData.length + 1 + 1; row++) {
      for (let col = 0; col < Object.keys(allErrorData[0]).length; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (row === 0) {
          worksheet[cellAddress].s = titleStyle;
        } else if (row === 1) {
          worksheet[cellAddress].s = headerStyle;
        } else {
          worksheet[cellAddress].s = cellStyle;
        }
      }
    }

    // Merge cell excel
    const merge = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];
    worksheet['!merges'] = merge;

    // Adjust to fit data
    function fitToColumn(arrayOfArray: any) {
      // get maximum character of each column
      return arrayOfArray[0].map((a: any, i: any) => ({
        wch:
          10 +
          Math.max(
            ...arrayOfArray.map((a2: any) =>
              a2[i] ? a2[i].toString().length : 0
            )
          ),
      }));
    }
    const transformedData = allErrorData.map((obj: any) => Object.values(obj));
    worksheet['!cols'] = fitToColumn([
      ['ID', 'Lỗi', 'Thời gian'],
      ...transformedData,
    ]);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Error');
    // Export Excel File
    XLSX.writeFile(workbook, 'XLNT_Error.xlsx', { compression: true });
    // setExportLoading(false);
  };

  return (
    <Section
      sectionTitle="DỮ LIỆU LỖI"
      isLoading={loadingGetErrorsData && exportLoading}
      protectedMobile
    >
      <div className="w-full mb-4">
        <div className="flex justify-between items-center w-full mb-4">
          <TableFilter
            setOrderField={setOrderField}
            setOrderType={setOrderType}
            fieldsList={fieldsList}
            initialType="DESC"
          />
          <div className="w-[200px]">
            <ButtonPrimary onClick={exportToExcel} disabled={exportLoading}>
              Xuất trang này
            </ButtonPrimary>
          </div>
        </div>
        <div className="relative w-full z-10">
          <TableBase>
            <thead>
              <tr>
                <th className="w-[48px]">#</th>
                <th className="w-[48px]">ID</th>
                <th className="text-left">Lỗi</th>
                <th className="w-[250px]">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {!loadingGetErrorsData &&
                !!errorsData &&
                errorsData.length > 0 &&
                errorsData.map((errorData, index) => (
                  <tr key={errorData.id}>
                    <td>{10 * (tableCurrentPage - 1) + index + 1}</td>
                    <td>{errorData.id}</td>
                    <td className="text-left">
                      <span className="line-clamp-1">
                        {errorData.error_message}
                      </span>
                    </td>
                    <td>{ReadData.time(errorData.created_at)}</td>
                  </tr>
                ))}
              <TableLoading
                data={errorsData}
                loading={loadingGetErrorsData}
                currentPage={tableCurrentPage}
                nCol={3}
              />
            </tbody>
          </TableBase>
        </div>
        <Paginate
          currentPage={tableCurrentPage}
          setCurrentPage={setTableCurrentPage}
          totalPage={tableTotalPage}
        />
      </div>
    </Section>
  );
};

export { ExportXLNT };
