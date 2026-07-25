<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['key', 'subject', 'html_content', 'available_snippets'])]
class MailTemplate extends Model
{
    use HasUlids;

    protected $casts = [
        'available_snippets' => 'array',
    ];
}
