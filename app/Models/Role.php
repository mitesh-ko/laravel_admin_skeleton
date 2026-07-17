<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Spatie\Permission\Models\Role as SpatieRole;

#[Fillable(['name', 'guard_name', 'description', 'created_by'])]
class Role extends SpatieRole
{
    use HasUlids;

    /**
     * Get the user that created this role.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
