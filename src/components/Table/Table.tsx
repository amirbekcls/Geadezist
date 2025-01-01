import { Popover } from 'antd';
import React from 'react';

// Thead interfeysi
export interface Thead {
  id: number;
  name: string;
}

// Table komponenti
interface TableProps {
  thead: Thead[];
  children: React.ReactNode;
}


const Table: React.FC<TableProps> = ({ thead, children }) => {
  return (
    <div className="rounded-sm bg-white">
      <div className="max-w-full overflow-x-auto w-[100%]">
        <table className="w-full table-auto border-collapse border">
          {/* Thead qismini render qilish */}
          <thead>
            <tr className="text-left border-gray-300">
              {thead.map((item) => (
                <th
                  key={item.id}
                  className="min-w-[150px] p-5 font-medium text-black border border-gray-300"
                >
                  {item.name.length > 15 ? (
                    <Popover title={item.name} overlayStyle={{ textAlign: 'center' }}>
                      {item.name.slice(0, 15)}...
                    </Popover>
                  ) : (
                    item.name
                  )}
                </th>
              ))}
            </tr>
          </thead>
          {/* Children qismini render qilish */}
          <tbody className="bg-white">{children}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
