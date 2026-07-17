<?php

declare(strict_types=1);

namespace App\Actions\Admin\Role;

use App\Enums\SystemRole;
use App\Models\Role;
use Exception;
use Illuminate\Support\Facades\Log;

class DeleteRoleAction
{
    public function execute(Role $role): bool
    {
        if ($role->name === SystemRole::SUPER_ADMIN->value) {
            throw new \InvalidArgumentException('Cannot delete Super Admin role.');
        }

        if ($role->users()->exists()) {
            throw new \InvalidArgumentException('Cannot delete role because it is assigned to one or more users. Please remove the role from all users first.');
        }

        try {
            return $role->delete();
        } catch (Exception $e) {
            Log::error('Failed to delete role: '.$e->getMessage(), ['exception' => $e]);
            throw new \RuntimeException('Failed to delete role. Please try again later.');
        }
    }
}
