import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type {
    ColumnDef,
    SortingState,
    PaginationState,
    VisibilityState,
    Header,
    Cell,
} from '@tanstack/react-table';
import axios from 'axios';

import {
    Rows4Icon,
    Rows3Icon,
    Rows2Icon,
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
    PinOffIcon,
    EllipsisIcon,
    ArrowLeftFromLineIcon,
    ArrowRightFromLineIcon,
    GripVerticalIcon,
    Columns3Icon,
    SearchIcon,
    RefreshCcwIcon,
    ChevronDownIcon,
    XIcon,
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
} from 'lucide-react';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

interface TableDataResponse {
    dataList: any[];
    meta: {
        totalRows: number;
    };
}

function getColumnId(col: ColumnDef<any, any>): string {
    const id = (col.id ??
        (col as Record<string, any>).accessorKey ??
        '') as string;

    return id.replace(/\./g, '_');
}

interface AdvancedTableProps {
    afterDataFetch?: (apiData: any) => void;
    columnsDetails: ColumnDef<any, any>[];
    dataUrl: string;
    extraPayload?: object;
    searchPlaceholder?: string;
    pinnedColumns?: { left?: string[]; right?: string[] };
    enableColumnOrdering?: boolean;
    enableColumnVisibility?: boolean;
    showSrNo?: boolean;
}

type DensityOption = {
    label: string;
    value: string | null;
    icon: React.ReactNode;
};

const densityItems: DensityOption[] = [
    { label: 'Density', value: null, icon: null },
    {
        label: 'Compact',
        value: 'compact',
        icon: <Rows4Icon className="size-4" />,
    },
    {
        label: 'Standard',
        value: 'standard',
        icon: <Rows3Icon className="size-4" />,
    },
    {
        label: 'Flexible',
        value: 'flexible',
        icon: <Rows2Icon className="size-4" />,
    },
];

const DraggableTableHeader = ({
    header,
    enableColumnOrdering,
}: {
    header: Header<any, unknown>;
    enableColumnOrdering: boolean;
}) => {
    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: header.column.id,
        disabled:
            !enableColumnOrdering || header.column.getIsPinned() !== false,
    });

    const style: React.CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        transform: CSS.Translate.toString(transform),
        transition,
        left:
            header.column.getIsPinned() === 'left'
                ? `${header.column.getStart('left')}px`
                : undefined,
        right:
            header.column.getIsPinned() === 'right'
                ? `${header.column.getAfter('right')}px`
                : undefined,
        zIndex: isDragging ? 30 : header.column.getIsPinned() ? 20 : 0,
    };

    return (
        <TableHead
            ref={setNodeRef}
            style={style}
            className={cn(
                'border-r border-border last:border-r-0',
                header.column.getIsPinned()
                    ? 'sticky bg-muted shadow-[inset_-1px_0_0_rgba(0,0,0,0.1)] dark:shadow-[inset_-1px_0_0_rgba(255,255,255,0.1)]'
                    : '',
            )}
        >
            {header.isPlaceholder ? null : (
                <div className="flex items-center justify-between gap-2">
                    {enableColumnOrdering && !header.column.getIsPinned() && (
                        <Button
                            size="icon"
                            variant="ghost"
                            className="-ml-2 size-7 shrink-0 cursor-grab active:cursor-grabbing"
                            {...attributes}
                            {...listeners}
                            aria-label="Drag to reorder"
                        >
                            <GripVerticalIcon
                                className="size-4 opacity-60"
                                aria-hidden="true"
                            />
                        </Button>
                    )}

                    <div
                        className={
                            header.column.getCanSort()
                                ? 'group flex w-full cursor-pointer items-center gap-1 transition-colors select-none hover:text-foreground/80'
                                : 'flex w-full items-center gap-1'
                        }
                        onClick={header.column.getToggleSortingHandler()}
                    >
                        {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                        )}
                        {{
                            asc: <ArrowUp className="size-4" />,
                            desc: <ArrowDown className="size-4" />,
                        }[header.column.getIsSorted() as string] ??
                            (header.column.getCanSort() ? (
                                <ArrowUpDown className="size-4 opacity-30 transition-opacity group-hover:opacity-60" />
                            ) : null)}
                    </div>

                    {header.column.getCanPin() &&
                        (header.column.getIsPinned() ? (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="-mr-1 size-7 shrink-0"
                                onClick={() => header.column.pin(false)}
                            >
                                <PinOffIcon
                                    className="size-4 opacity-60"
                                    aria-hidden="true"
                                />
                            </Button>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="-mr-1 size-7 shrink-0"
                                    >
                                        <EllipsisIcon
                                            className="size-4 opacity-60"
                                            aria-hidden="true"
                                        />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() =>
                                            header.column.pin('left')
                                        }
                                    >
                                        <ArrowLeftFromLineIcon
                                            size={16}
                                            className="mr-2 opacity-60"
                                            aria-hidden="true"
                                        />
                                        Stick to left
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            header.column.pin('right')
                                        }
                                    >
                                        <ArrowRightFromLineIcon
                                            size={16}
                                            className="mr-2 opacity-60"
                                            aria-hidden="true"
                                        />
                                        Stick to right
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ))}
                </div>
            )}
        </TableHead>
    );
};

const DragAlongCell = ({
    cell,
    enableColumnOrdering,
}: {
    cell: Cell<any, unknown>;
    enableColumnOrdering: boolean;
}) => {
    const { isDragging, setNodeRef, transform, transition } = useSortable({
        id: cell.column.id,
        disabled: !enableColumnOrdering || cell.column.getIsPinned() !== false,
    });

    const style: React.CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        transform: CSS.Translate.toString(transform),
        transition,
        left:
            cell.column.getIsPinned() === 'left'
                ? `${cell.column.getStart('left')}px`
                : undefined,
        right:
            cell.column.getIsPinned() === 'right'
                ? `${cell.column.getAfter('right')}px`
                : undefined,
        zIndex: isDragging ? 30 : cell.column.getIsPinned() ? 10 : 0,
    };

    return (
        <TableCell
            ref={setNodeRef}
            style={style}
            className={cn(
                cell.column.getIsPinned()
                    ? 'sticky bg-background shadow-[inset_-1px_0_0_rgba(0,0,0,0.1)] group-hover/row:bg-muted/50 dark:shadow-[inset_-1px_0_0_rgba(255,255,255,0.1)]'
                    : '',
            )}
        >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
    );
};

const AdvancedTable = forwardRef(function AdvancedTable(
    {
        columnsDetails,
        dataUrl,
        afterDataFetch,
        extraPayload = {},
        searchPlaceholder = 'Search...',
        pinnedColumns,
        enableColumnOrdering = false,
        enableColumnVisibility = false,
        showSrNo = true,
    }: AdvancedTableProps,
    ref,
) {
    // 1. Data State
    const dndContextId = useId();
    const [tableData, setTableData] = useState<TableDataResponse>({
        dataList: [],
        meta: { totalRows: 0 },
    });

    // 2. Table State (Controlled)
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [columnSearch, setColumnSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [density, setDensity] = useState<string | null>(null);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );

    const finalColumns = React.useMemo(() => {
        if (!showSrNo) {
            return columnsDetails;
        }

        const srNoColumn: ColumnDef<any, any> = {
            id: 'srNo',
            header: 'Sr.No.',
            enableSorting: false,
            enablePinning: true,
            cell: ({ row, table }) => {
                return (
                    table.getState().pagination.pageIndex *
                        table.getState().pagination.pageSize +
                    row.index +
                    1
                );
            },
        };

        return [srNoColumn, ...columnsDetails];
    }, [columnsDetails, showSrNo]);

    // Column Ordering State
    const [columnOrder, setColumnOrder] = useState<string[]>(
        finalColumns.map(getColumnId),
    );

    useEffect(() => {
        setColumnOrder(finalColumns.map(getColumnId));
    }, [finalColumns]);

    // Debounce search input
    const debouncedSearchValue = useDebounce(searchValue);

    useEffect(() => {
        setGlobalFilter(debouncedSearchValue);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [debouncedSearchValue]);

    // 3. Data Fetching
    const fetchData = useCallback(() => {
        if (!dataUrl) {
            return;
        }

        setIsLoading(true);

        const params: Record<string, any> = {
            global_filter: globalFilter,
            'pagination[pageIndex]': pagination.pageIndex,
            'pagination[pageSize]': pagination.pageSize,
            ...extraPayload,
        };

        if (sorting.length > 0) {
            const sortId = sorting[0].id;
            // Map TanStack's sanitized ID (user_name) back to original accessorKey (user.name) for the API
            const columnDef = finalColumns.find(
                (col) => getColumnId(col) === sortId,
            ) as any;
            const originalId = columnDef?.accessorKey || sortId;

            params['sorting[0][id]'] = originalId;
            params['sorting[0][desc]'] = sorting[0].desc;
        }

        axios
            .get(dataUrl, {
                params,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            })
            .then((response) => {
                if (typeof response.data === 'string') {
                    console.error(
                        'Received HTML instead of JSON. Check your session/auth!',
                    );
                }

                setTableData({
                    dataList: response.data.dataList || [],
                    meta: response.data.meta || { totalRows: 0 },
                });

                if (afterDataFetch) {
                    afterDataFetch(response.data);
                }
            })
            .catch((e) => {
                console.error(
                    'AdvancedTable fetch error:',
                    e?.response?.data ?? e,
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        dataUrl,
        globalFilter,
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
    ]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Use ref so useImperativeHandle always exposes the latest fetchData
    const fetchDataRef = useRef(fetchData);
    fetchDataRef.current = fetchData;

    useImperativeHandle(
        ref,
        () => ({
            fetchData: () => fetchDataRef.current(),
        }),
        [],
    );

    // 4. TanStack Table Instance
    const table = useReactTable({
        data: tableData.dataList,
        columns: finalColumns,
        pageCount: Math.ceil(tableData.meta.totalRows / pagination.pageSize),
        state: {
            sorting,
            pagination,
            globalFilter,
            columnOrder,
            columnVisibility,
        },
        initialState: {
            columnPinning: pinnedColumns,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        onColumnOrderChange: setColumnOrder,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    });

    // DND Handlers
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            setColumnOrder((order) => {
                const oldIndex = order.indexOf(active.id as string);
                const newIndex = order.indexOf(over.id as string);

                return arrayMove(order, oldIndex, newIndex);
            });
        }
    }

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {}),
    );

    return (
        <Card className="w-full shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="relative w-full sm:max-w-sm">
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(event) =>
                                setSearchValue(event.target.value)
                            }
                            className="w-full pr-8"
                        />
                        {searchValue && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-0 right-0 h-full w-8 px-2 py-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                                onClick={() => setSearchValue('')}
                            >
                                <XIcon className="size-4" />
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {enableColumnVisibility && (
                            <DropdownMenu
                                onOpenChange={(open) => {
                                    if (!open) {
                                        setColumnSearch('');
                                    }
                                }}
                            >
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="justify-between sm:w-[150px]"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Columns3Icon className="size-4" />
                                            Columns
                                        </span>
                                        <ChevronDownIcon className="size-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-[200px]"
                                >
                                    <div className="relative p-2">
                                        <Input
                                            value={columnSearch}
                                            onChange={(e) =>
                                                setColumnSearch(e.target.value)
                                            }
                                            className="h-8 pl-8"
                                            placeholder="Search columns..."
                                            onKeyDown={(e) =>
                                                e.stopPropagation()
                                            }
                                        />
                                        <SearchIcon className="absolute top-4 left-4 size-4 text-muted-foreground" />
                                    </div>
                                    <DropdownMenuSeparator />
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {table
                                            .getAllColumns()
                                            .filter((column) =>
                                                column.getCanHide(),
                                            )
                                            .map((column) => {
                                                const title =
                                                    typeof column.columnDef
                                                        .header === 'string'
                                                        ? column.columnDef
                                                              .header
                                                        : column.id;

                                                if (
                                                    columnSearch &&
                                                    !title
                                                        .toLowerCase()
                                                        .includes(
                                                            columnSearch.toLowerCase(),
                                                        )
                                                ) {
                                                    return null;
                                                }

                                                return (
                                                    <DropdownMenuCheckboxItem
                                                        key={column.id}
                                                        className="capitalize"
                                                        checked={column.getIsVisible()}
                                                        onCheckedChange={(
                                                            value,
                                                        ) =>
                                                            column.toggleVisibility(
                                                                !!value,
                                                            )
                                                        }
                                                        onSelect={(e) =>
                                                            e.preventDefault()
                                                        }
                                                    >
                                                        {title}
                                                    </DropdownMenuCheckboxItem>
                                                );
                                            })}
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => {
                                            table.resetColumnVisibility();
                                            setColumnSearch('');
                                        }}
                                        className="justify-center text-muted-foreground"
                                    >
                                        <RefreshCcwIcon className="mr-2 size-4" />
                                        Reset
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        <Select
                            value={density || undefined}
                            onValueChange={(value) =>
                                setDensity(value as string | null)
                            }
                        >
                            <SelectTrigger
                                className="w-full sm:max-w-[150px]"
                                aria-label="Density select"
                            >
                                <SelectValue placeholder="Density">
                                    {(() => {
                                        const item = densityItems.find(
                                            (i) => i.value === density,
                                        );

                                        return density ? (
                                            <span className="flex items-center gap-2">
                                                {item?.icon}
                                                {item?.label}
                                            </span>
                                        ) : (
                                            'Density'
                                        );
                                    })()}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Density</SelectLabel>
                                    {densityItems.slice(1).map((item) => (
                                        <SelectItem
                                            key={item.value as string}
                                            value={item.value as string}
                                        >
                                            <div className="flex items-center gap-2">
                                                {item.icon}
                                                {item.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="relative border-y">
                    <DndContext
                        id={dndContextId}
                        collisionDetection={closestCenter}
                        modifiers={[restrictToHorizontalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                    >
                        <Table
                            wrapperClassName="max-h-[65vh]"
                            className={cn({
                                '[&_td]:px-3 [&_td]:py-px [&_th]:px-3 [&_th]:py-px':
                                    density === 'compact',
                                '[&_td]:px-4 [&_td]:py-1 [&_th]:px-4 [&_th]:py-1':
                                    density === 'standard',
                                '[&_td]:px-6 [&_td]:py-2 [&_th]:px-6 [&_th]:py-2':
                                    density === 'flexible',
                            })}
                        >
                            <TableHeader className="sticky top-0 z-10 border-b bg-muted shadow-sm">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow
                                        key={headerGroup.id}
                                        className="border-none"
                                    >
                                        <SortableContext
                                            items={columnOrder}
                                            strategy={
                                                horizontalListSortingStrategy
                                            }
                                        >
                                            {headerGroup.headers.map(
                                                (header) => (
                                                    <DraggableTableHeader
                                                        key={header.id}
                                                        header={header}
                                                        enableColumnOrdering={
                                                            enableColumnOrdering
                                                        }
                                                    />
                                                ),
                                            )}
                                        </SortableContext>
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody
                                className={cn(
                                    'transition-opacity duration-200',
                                    isLoading &&
                                        'pointer-events-none opacity-50',
                                )}
                            >
                                {isLoading &&
                                !table.getRowModel().rows?.length ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={finalColumns.length}
                                            className="h-24 text-center"
                                        >
                                            Loading data...
                                        </TableCell>
                                    </TableRow>
                                ) : table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={
                                                row.getIsSelected() &&
                                                'selected'
                                            }
                                            className="group/row"
                                        >
                                            <SortableContext
                                                items={columnOrder}
                                                strategy={
                                                    horizontalListSortingStrategy
                                                }
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <DragAlongCell
                                                            key={cell.id}
                                                            cell={cell}
                                                            enableColumnOrdering={
                                                                enableColumnOrdering
                                                            }
                                                        />
                                                    ))}
                                            </SortableContext>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={finalColumns.length}
                                            className="h-24 text-center"
                                        >
                                            No results found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
            </CardContent>

            <CardFooter className="pt-4">
                <div className="flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row sm:gap-0">
                    <div className="w-full flex-1 text-center text-sm text-muted-foreground sm:text-left">
                        Showing{' '}
                        {table.getState().pagination.pageIndex *
                            table.getState().pagination.pageSize +
                            (tableData.meta.totalRows > 0 ? 1 : 0)}{' '}
                        to{' '}
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) *
                                table.getState().pagination.pageSize,
                            tableData.meta.totalRows,
                        )}{' '}
                        of {tableData.meta.totalRows} entries
                    </div>
                    <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:gap-6 lg:gap-8">
                        <div className="flex w-full items-center justify-between space-x-2 sm:w-auto sm:justify-start">
                            <p className="text-sm font-medium">Rows per page</p>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value));
                                }}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue
                                        placeholder={
                                            table.getState().pagination.pageSize
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem
                                            key={pageSize}
                                            value={`${pageSize}`}
                                        >
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">
                                    Go to first page
                                </span>
                                <ChevronsLeft className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">
                                    Go to previous page
                                </span>
                                <ChevronLeft className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRight className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                    table.setPageIndex(table.getPageCount() - 1)
                                }
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <ChevronsRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
});

export default AdvancedTable;
