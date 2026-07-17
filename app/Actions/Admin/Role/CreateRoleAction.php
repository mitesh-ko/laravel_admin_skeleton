<?php

declare(strict_types=1);

namespace App\Actions\Admin\Role;

use App\DTOs\RoleDTO;
use App\Models\Role;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreateRoleAction
{
    public function execute(RoleDTO $dto): Role
    {
        try {
            return DB::transaction(function () use ($dto) {
                $role = Role::create([
                    'name' => $dto->name,
                    'description' => $dto->description,
                ]);

                if (! empty($dto->permissions)) {
                    $role->syncPermissions($dto->permissions);
                }

                return $role;
            });
        } catch (Exception $e) {
            Log::error('Failed to create role: '.$e->getMessage(), ['exception' => $e]);
            throw new \RuntimeException('Failed to create role. Please try again later.');
        }
    }
}
