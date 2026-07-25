<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'utm_source_id', 'ip_address', 'user_agent', 'referer', 'landing_page'])]
class UtmVisit extends Model
{
    use HasFactory, HasUlids;

    public function source()
    {
        return $this->belongsTo(UtmSource::class, 'utm_source_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
