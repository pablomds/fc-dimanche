import { useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { LuArrowDownAZ, LuArrowUpAZ } from "react-icons/lu";
import _ from "lodash";

const index = ({ rows, columns, defaultSortKey, defaultOrder, isUserLoggedIn = false } : { rows: any[], columns: any[], defaultSortKey?: string, defaultOrder?: 'asc' | 'desc', isUserLoggedIn?: boolean }) => {

    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
        key: defaultSortKey ?? '',
        direction: defaultOrder ?? 'asc',
      });

    const sortedRows = useMemo(() => {
      if (sortConfig.key) {
        return _.orderBy(
            rows,
            [(row) => row[sortConfig.key].value],
            [sortConfig.direction] 
          );
      }
      return rows;
    }, [rows, sortConfig]);
  
    const handleSort = (columnKey: string) => {
        let direction: 'asc' | 'desc' = 'asc'; 
        if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
          direction = 'desc';
        }
        setSortConfig({ key: columnKey, direction });
      };

    const Tag = ({textColor, backgroundColor, text} : {textColor: string, backgroundColor: string, text: string}) => {
      return (
        <span
          className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
            textColor ?? "bg-slate-200"
          }`}
        >
          <span
            aria-hidden
            className={`absolute inset-0 opacity-50 rounded-full ${backgroundColor ?? "text-slate-900"}`}
          ></span>
          <span className="relative">{text ?? "Tag"}</span>
        </span>
      );
    };

  return (
    <table className="w-full h-full text-sm text-left text-gray-500 custom-scroll select-none">
      <thead className="text-xs sticky top-0 z-10 text-gray-700 uppercase bg-gray-300">
        <tr>
          <th scope="col" className="py-3 cursor-pointer">
            {sortConfig.direction === "asc" ? (
              <LuArrowDownAZ className="h-5 w-5" />
            ) : (
              <LuArrowUpAZ className="h-5 w-5" />
            )}
          </th>
          {_.map(columns, (column, index) => (
            <th
              scope="col"
              className="px-4 py-3 cursor-pointer"
              onClick={() => handleSort(column.key)}
              key={index}
            >
              {column.label}
            </th>
          ))}
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {_.map(sortedRows, (row, index) => (
          <tr className="bg-white border-b" key={index}>
            <td
              scope="row"
              className="py-4 text-sm font-medium text-gray-900 whitespace-nowrap"
            ></td>
            <td
              scope="row"
              className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap"
            >
              {row.name.value}
            </td>
            <td
              scope="row"
              className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap"
            >
              {row.status.isTag && (
                <Tag
                  textColor={row.status.tag.textColor}
                  backgroundColor={row.status.tag.backgroundColor}
                  text={row.status.tag.text}
                />
              )}
            </td>
            {isUserLoggedIn && (
              <td className="px-4 py-4 text-sm cursor-pointer p-2">
                  <IoMdClose className="w-5 h-5 text-white bg-slate-400 rounded-full" />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default index;