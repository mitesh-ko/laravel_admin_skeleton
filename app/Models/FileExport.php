<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FileExport extends Model
{
    use HasUlids;

    public const GLOBAL_SEARCH = [
        [
            'key' => 'name',
            'op' => 'like',
            'mask' => '%{value}%',
        ],
        [
            'key' => 'status',
            'op' => 'like',
            'mask' => '%{value}%',
        ],
        [
            'key' => 'completed_at',
            'op' => 'like',
            'mask' => '{value}%',
        ],
    ];

    protected $fillable = [
        'user_id',
        'name',
        'status',
        'file_path',
        'details',
        'error_message',
        'completed_at',
    ];

    protected $casts = [
        'details' => 'array',
        'completed_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
