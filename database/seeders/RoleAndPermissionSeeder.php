<?php

namespace Database\Seeders;

use App\Enums\SystemRole;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $modules = [
            'Dashboard' => [
                'Manage Dashboard',
            ],
            'Users' => [
                'Manage Users',
                'Manage All Users',
                'Manage Own Users',
                'Create Users',
                'Edit Users',
                'Delete Users',
                'Change Status Users',
                'Reset Password Users',
            ],
            'Roles' => [
                'Manage Roles',
                'Manage All Roles',
                'Manage Own Roles',
                'View Roles',
                'Create Roles',
                'Edit Roles',
                'Delete Roles',
            ],
        ];

        foreach ($modules as $module => $permissions) {
            foreach ($permissions as $permission) {
                Permission::firstOrCreate(
                    ['name' => $permission],
                    ['module' => $module]
                );
            }
        }

        // Optional: create a Super Admin role and assign all permissions
        $role = Role::firstOrCreate(['name' => SystemRole::SUPER_ADMIN->value], ['description' => 'Administrator with full access']);
        $role->givePermissionTo(Permission::all());
    }
}
