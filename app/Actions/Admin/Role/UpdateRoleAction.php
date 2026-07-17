<?php

declare(strict_types=1);

namespace App\Actions\Admin\Role;

use App\DTOs\RoleDTO;
use App\Models\Role;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdateRoleAction
{
    public function execute(Role $role, RoleDTO $dto): Role
    {
        try {
            return DB::transaction(function () use ($role, $dto) {
                $role->update([
                    'name' => $dto->name,
                    'description' => $dto->description,
                ]);

                if (! empty($dto->permissions)) {
                    $role->syncPermissions($dto->permissions);
                } else {
                    $role->syncPermissions([]);
                }

                return $role;
            });
        } catch (Exception $e) {
            Log::error('Failed to update role: '.$e->getMessage(), ['exception' => $e]);
            throw new \RuntimeException('Failed to update role. Please try again later.');
        }
    }
}
