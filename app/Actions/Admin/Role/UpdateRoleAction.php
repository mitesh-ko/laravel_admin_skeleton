<?php

declare(strict_types=1);

namespace App\Actions\Admin\Role;

use App\Models\Role;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdateRoleAction
{
    public function execute(Role $role, array $data): Role
    {
        try {
            return DB::transaction(function () use ($role, $data) {
                $role->update([
                    'name' => $data['name'],
                    'description' => $data['description'] ?? null,
                ]);

                if (isset($data['permissions'])) {
                    $role->syncPermissions($data['permissions']);
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
