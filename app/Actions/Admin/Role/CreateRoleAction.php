<?php

declare(strict_types=1);

namespace App\Actions\Admin\Role;

use App\Models\Role;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreateRoleAction
{
    public function execute(array $data): Role
    {
        try {
            return DB::transaction(function () use ($data) {
                $role = Role::create([
                    'name' => $data['name'],
                    'description' => $data['description'] ?? null,
                ]);

                if (! empty($data['permissions'])) {
                    $role->syncPermissions($data['permissions']);
                }

                return $role;
            });
        } catch (Exception $e) {
            Log::error('Failed to create role: '.$e->getMessage(), ['exception' => $e]);
            throw new \RuntimeException('Failed to create role. Please try again later.');
        }
    }
}
