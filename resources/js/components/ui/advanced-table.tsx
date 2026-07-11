import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  useMaterialReactTable,
  type MRT_TableOptions,
} from "material-react-table";
import { SortingState } from "@tanstack/react-table";
import { ThemeProvider, createTheme } from "@mui/material";
import axios from "axios";

interface AdvancedTableProps {
  afterDataFetch?: (apiData: any) => void;
  columnsDetails: any[]; // Or MRT_ColumnDef<any>[]
  tableOptions?: Partial<MRT_TableOptions<any>>;
  apiUrl: string;
  extraPayload?: object;
}

const AdvancedTable = forwardRef(function AdvancedTable(
  {
    columnsDetails,
    tableOptions = {},
    apiUrl,
    afterDataFetch,
    extraPayload = {},
  }: AdvancedTableProps,
  ref
) {
  // 1. Data State
  const [hasTableData, setHasTableData] = useState({
    dataList: [],
    meta: { totalRows: 0 },
  });

  // 2. Table State (Controlled)
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 3. Theme Management (Sync with Tailwind dark mode)
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
          background: {
            default: isDark ? 'hsl(var(--background))' : 'hsl(var(--background))',
            paper: isDark ? 'hsl(var(--card))' : 'hsl(var(--card))',
          },
        },
        typography: {
          fontFamily: 'inherit',
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [isDark]
  );

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => columnsDetails,
    [columnsDetails]
  );

  // 4. Data Fetching
  const fetchData = () => {
    if (!apiUrl) return;
    setIsLoading(true);

    const params: Record<string, any> = {
      globalFilter: globalFilter,
      'pagination[pageIndex]': pagination.pageIndex,
      'pagination[pageSize]': pagination.pageSize,
      ...extraPayload,
    };

    if (sorting.length > 0) {
      params['sorting[0][id]'] = sorting[0].id;
      params['sorting[0][desc]'] = sorting[0].desc;
    }

    axios
      .get(apiUrl, {
        params,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        }
      })
      .then((response) => {
        if (typeof response.data === 'string') {
          console.error("Received HTML instead of JSON. Check your session/auth!");
        }
        setHasTableData({
          dataList: response.data.dataList || [],
          meta: response.data.meta || { totalRows: 0 },
        });
        if (afterDataFetch) afterDataFetch(response.data);
      })
      .catch((e) => {
        console.error("AdvancedTable fetch error:", e?.response?.data ?? e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [sorting, pagination.pageIndex, pagination.pageSize, globalFilter, apiUrl]);

  useImperativeHandle(ref, () => ({ fetchData }));

  const table = useMaterialReactTable({
    ...tableOptions,
    columns,
    data: hasTableData.dataList,
    rowCount: hasTableData.meta.totalRows,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      // isLoading,
      sorting,
      pagination,
      globalFilter,
      ...tableOptions?.state,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <MaterialReactTable table={table} />
    </ThemeProvider>
  );
});

export default AdvancedTable;
