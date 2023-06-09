import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useState } from 'react';
import { useResponsive } from '~/hooks/useResponsive';

type ITableFilter = {
  setOrderField: (state: any) => void;
  setOrderType: (state: any) => void;
  fieldsList: {
    id: number;
    name: string;
    type: any;
  }[];
  initialType?: 'ASC' | 'DESC';
};

const types: {
  id: number;
  name: string;
  type: 'ASC' | 'DESC';
}[] = [
  { id: 1, name: 'Tăng dần', type: 'ASC' },
  { id: 2, name: 'Giảm dần', type: 'DESC' },
];

const TableFilter: React.FC<ITableFilter> = ({
  setOrderField,
  setOrderType,
  fieldsList: fields,
  initialType = 'ASC',
}) => {
  const [selectedField, setSelectedField] = useState(fields[0]);
  const [queryField, setQueryField] = useState('');

  const filteredField =
    queryField === ''
      ? fields
      : fields.filter(person =>
          person.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(queryField.toLowerCase().replace(/\s+/g, ''))
        );

  useEffect(() => {
    setOrderField(selectedField.type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedField]);

  const [selectedType, setSelectedType] = useState(
    initialType === 'ASC' ? types[0] : types[1]
  );
  const [queryType, setQueryType] = useState('');

  const filteredType =
    queryType === ''
      ? types
      : types.filter(type =>
          type.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(queryType.toLowerCase().replace(/\s+/g, ''))
        );

  useEffect(() => {
    setOrderType(selectedType.type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);
  const { isMobile } = useResponsive();
  return (
    <div className="relative z-20 inline-flex items-center gap-2">
      <span className="text-[#212a39] pr-3 font-bold mt-1">Sắp xếp theo:</span>
      <div className={isMobile ? '' : 'w-[180px]'}>
        <Combobox value={selectedField} onChange={setSelectedField}>
          <div className="relative mt-1">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-main-blue-80 sm:text-sm">
              <Combobox.Input
                className="w-full border-none py-[7px] pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                displayValue={(field: {
                  id: number;
                  name: string;
                  type: string;
                }) => field.name}
                onChange={event => setQueryField(event.target.value)}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQueryField('')}
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm custom-scrollbar">
                {filteredField.length === 0 && queryField !== '' ? (
                  <div className="relative cursor-default select-none py-[7px] px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredField.map(field => (
                    <Combobox.Option
                      key={field.id}
                      className={({ active }) =>
                        `relative cursor-default select-none text-[13px] py-[7px] pl-8 pr-4 rounded-sm ${
                          active
                            ? 'bg-main-blue-80 text-white'
                            : 'text-gray-900'
                        }`
                      }
                      value={field}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {field.name}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-main-blue-80'
                              }`}
                            >
                              <CheckIcon
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
      <div className="w-[150px]">
        <Combobox value={selectedType} onChange={setSelectedType}>
          <div className="relative mt-1">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-main-blue-80 sm:text-sm">
              <Combobox.Input
                className="w-full border-none py-[7px] pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                displayValue={(type: {
                  id: number;
                  name: string;
                  type: string;
                }) => type.name}
                onChange={event => setQueryType(event.target.value)}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQueryType('')}
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredType.length === 0 && queryType !== '' ? (
                  <div className="relative cursor-default select-none py-[7px] px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredType.map(type => (
                    <Combobox.Option
                      key={type.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-[7px] pl-8 pr-4 rounded-sm ${
                          active
                            ? 'bg-main-blue-80 text-white'
                            : 'text-gray-900'
                        }`
                      }
                      value={type}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {type.name}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-main-blue-80'
                              }`}
                            >
                              <CheckIcon
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
    </div>
  );
};

export { TableFilter };
