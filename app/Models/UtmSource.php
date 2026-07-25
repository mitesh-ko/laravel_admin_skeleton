<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'code', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'description', 'is_active'])]
class UtmSource extends Model
{
    use HasFactory, HasUlids;

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public const GLOBAL_SEARCH = [
        [
            'key' => 'name',
            'op' => 'like',
            'mask' => '%{value}%',
        ],
        [
            'key' => 'code',
            'op' => 'like',
            'mask' => '%{value}%',
        ],
    ];

    public function visits()
    {
        return $this->hasMany(UtmVisit::class, 'utm_source_id');
    }

    public function registrations()
    {
        return $this->hasManyThrough(User::class, UtmVisit::class, 'utm_source_id', 'id', 'id', 'user_id');
    }
}
