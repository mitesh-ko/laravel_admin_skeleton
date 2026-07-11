<?php

namespace App\Utils;

use App\DTOs\GlobalSearchDTO;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * This Table Utility class is specially designed for ReactMaterialTable backed requirements.
 */
class TableUtility
{
    protected mixed $query;

    protected mixed $data;

    /**
     * Constructor to initialize the query.
     *
     * @param  mixed  $query  The Eloquent query builder or related query object.
     */
    public function __construct(mixed $query)
    {
        $this->query = $query;
    }

    /**
     * Applies a series of filters to the query.
     *
     * The request should contain a JSON string under the 'filters' key that decodes to an array.
     * Each filter is expected to have:
     *   - key: a string like "self.uploaded_to_date" (or "self.fieldname")
     *   - val1: the primary value
     *   - val2 (optional): a secondary value for range filters
     */
    public function applyFilters(Request $request): void
    {
        $filtersJson = $request->input('filters', '[]');
        $filters = json_decode($filtersJson);
        if (! is_array($filters)) {
            $filters = [];
        }

        foreach ($filters as $filter) {
            try {
                // Determine the table and field based on the key.
                $lastDotPosition = strrpos($filter->key, '.');
                if ($lastDotPosition === false) {
                    // No dot found; assume current table.
                    $table = 'self';
                    $field = $filter->key;
                } else {
                    $table = substr($filter->key, 0, $lastDotPosition);
                    $field = substr($filter->key, $lastDotPosition + 1);
                }

                // Prepare a closure to apply filter logic (for reuse in self/whereHas).
                $applyFilter = function ($query) use ($filter, $field) {
                    // If val1 is an array and not empty, use whereIn.
                    if (is_array($filter->val1) && count($filter->val1) > 0) {
                        $query->whereIn($field, $filter->val1);
                    }
                    // Else, if a second value is provided, assume a range filter.
                    elseif (isset($filter->val2) && $filter->val2) {
                        $query->whereBetween($field, [$filter->val1, $filter->val2]);
                    }
                    // Otherwise, use a LIKE filter.
                    else {
                        $query->where($field, 'LIKE', "%{$filter->val1}%");
                    }
                };

                if ($table === 'self') {
                    $applyFilter($this->query);
                } else {
                    $this->query->whereHas($table, function ($query) use ($applyFilter) {
                        $applyFilter($query);
                    });
                }
            } catch (\Exception $e) {
                Log::error('Error applying filter: '.json_encode($filter).' Exception: '.$e->getMessage());
                // Continue processing remaining filters.
            }
        }
    }

    /**
     * Applies global search across multiple columns based on configuration.
     */
    public function applyGlobalSearch(Request $request, GlobalSearchDTO $globalSearchDTO): void
    {
        $globalFilter = $request->input('global_filter');
        if (empty($globalFilter) || empty($globalSearchDTO->fields)) {
            return;
        }

        $this->query->where(function ($q) use ($globalFilter, $globalSearchDTO) {
            $isFirst = true;
            foreach ($globalSearchDTO->fields as $config) {
                $key = $config['key'];
                $op = $config['op'];
                $mask = $config['mask'];

                if (! $key) {
                    continue;
                }

                $value = str_replace('{value}', $globalFilter, $mask);
                $lastDotPosition = strrpos($key, '.');

                if ($lastDotPosition === false) {
                    if ($isFirst) {
                        $q->where($key, $op, $value);
                    } else {
                        $q->orWhere($key, $op, $value);
                    }
                } else {
                    $table = substr($key, 0, $lastDotPosition);
                    $field = substr($key, $lastDotPosition + 1);

                    if ($isFirst) {
                        $q->whereHas($table, function ($subQ) use ($field, $op, $value) {
                            $subQ->where($field, $op, $value);
                        });
                    } else {
                        $q->orWhereHas($table, function ($subQ) use ($field, $op, $value) {
                            $subQ->where($field, $op, $value);
                        });
                    }
                }
                $isFirst = false;
            }
        });
    }

    /**
     * Applies sorting to the query.
     *
     * The request is expected to contain sorting details under 'sorting'. This method only supports single-column sorting.
     */
    public function sort(Request $request): void
    {
        try {
            if ($request->input('sorting')) {
                $sortField = $request->input('sorting.0.id');
                $sortDirection = $request->input('sorting.0.desc') === 'true' ? 'desc' : 'asc';
                $lastDotPosition = strrpos($sortField, '.');
                if ($lastDotPosition === false) {
                    // No dot; sort on the current table.
                    $field = $sortField;
                    $this->query->orderBy($field, $sortDirection);
                } else {
                    $table = substr($sortField, 0, $lastDotPosition);
                    $field = substr($sortField, $lastDotPosition + 1);
                    if ($table) {
                        $this->query->whereHas($table, function ($query) use ($sortDirection, $field) {
                            $query->orderBy($field, $sortDirection);
                        });
                    } else {
                        $this->query->orderBy($field, $sortDirection);
                    }
                }
            } else {
                $this->query->orderBy('id', 'desc');
            }
        } catch (\Exception $e) {
            Log::error('Error applying sorting: '.$e->getMessage());
        }
    }

    /**
     * Paginates the query results.
     *
     * @param  Request  $request  The request containing pagination parameters.
     * @param  array  $columns  Columns to select from the database (default: all columns).
     * @return mixed Paginated data.
     */
    public function paginate(Request $request, array $columns = ['*']): mixed
    {
        try {
            $pageIndex = $request->input('pagination.pageIndex', 0);
            $pageSize = $request->input('pagination.pageSize', config('constants.records_per_page'));
            $page = $pageIndex + 1;
            $this->data = $this->query->paginate($pageSize, $columns, 'page', $page);

            return $this->data;
        } catch (\Exception $e) {
            Log::error('Error during pagination: '.$e->getMessage());
            throw $e;
        }
    }

    /**
     * Returns a JSON response for the data table.
     *
     * @param  mixed  $tableData  The processed data to return.
     */
    public function dataTableResponse(Request $request, $tableData = false): JsonResponse
    {
        return response()->json([
            'dataList' => $tableData ?: $this->data->items(),
            'meta' => [
                'totalRows' => $this->data->total(),
                'pageIndex' => $request->input('pagination.pageIndex', 0),
                'pageSize' => $request->input('pagination.pageSize', 10),
            ],
        ]);
    }
}
