import React from "react";
import {
  CellBasic,
  CellHeader,
  TableHeader,
  TableRow,
  Table,
  Button,
  Icon,
  Tag,
} from "czifui";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  RowData,
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

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<Person>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        className="editable-input"
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );
  },
};

const defaultColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.lastName,
    id: "lastName",
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
  const [log, setLog] = React.useState(null);
  const [data, setData] = React.useState(() => makeData(8));
  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ]);

  // Create the table and pass your options
  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              setLog(`Row index: ${rowIndex}\nColumn Id: ${columnId}\nOld value: ${old[rowIndex][columnId]}\nNew value: ${value}
              `);
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  // Manage your own state
  const [state, setState] = React.useState(table.initialState);

  // Change table data
  const changeTableData = () => {
    setData(() => makeData(8));
    setLog(null);
  };

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
        management state. Table Cells are <strong>Editable</strong>, click on a
        cell to start editing (Changes will apply on blur!)
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

      <div className="actions">
        <Button
          startIcon={<Icon sdsIcon="refresh" sdsSize="s" sdsType="button" />}
          sdsStyle="rounded"
          sdsType="primary"
          onClick={changeTableData}
        >
          Change table data
        </Button>
      </div>

      {log && (
        <div className="log">
          <h2>Cell Value Update Log:</h2>
          <pre>{log}</pre>
        </div>
      )}

      {data && (
        <div className="log">
          <h2>Table data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
