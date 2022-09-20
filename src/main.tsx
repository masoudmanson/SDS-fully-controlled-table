import React from "react";
import { CellBasic, CellHeader, TableHeader, TableRow, Table } from "czifui";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { makeData } from "./makeData";
import "./index.css";

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const defaultColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "firstName",
    cell: (info) => info.getValue(),
    header: "First Name",
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.lastName,
    id: "lastName",
    cell: (info) => info.getValue(),
    header: "Last Name",
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "age",
    header: "Age",
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "visits",
    header: "Visits",
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "status",
    header: "Status",
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "progress",
    header: "Profile Progress",
    footer: (props) => props.column.id,
  },
];

function App() {
  const [data] = React.useState(() => makeData(100));
  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ]);

  // Create the table and pass your options
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Manage your own state
  const [state, setState] = React.useState(table.initialState);

  React.useEffect(() => {
    console.log(state);
  }, [state]);

  // Override the state managers for the table to your own
  table.setOptions((prev) => ({
    ...prev,
    state,
    onStateChange: setState,
    // These are just table options, so if things
    // need to change based on your state, you can
    // derive them here
  }));

  return (
    <div className="app">
      <h1 className="title">Fully Controlled Table</h1>
      <p className="description">
        Table that demonstrates how to access the table’s internal data
        management state.
      </p>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => (
              <CellHeader key={header.id} colSpan={header.colSpan} hideSortIcon>
                {
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  ) as string
                }
              </CellHeader>
            ))
          )}
        </TableHeader>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <CellBasic
                  key={cell.id}
                  primaryText={
                    flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    ) as string
                  }
                  shouldShowTooltipOnHover={false}
                />
              ))}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default App;
