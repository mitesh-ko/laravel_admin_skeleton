<?php

namespace Database\Seeders;

use App\Enums\PermissionName;
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
                PermissionName::MANAGE_DASHBOARD->value,
            ],
            'Users' => [
                PermissionName::MANAGE_USERS->value,
                PermissionName::MANAGE_ALL_USERS->value,
                PermissionName::MANAGE_OWN_USERS->value,
                PermissionName::CREATE_USERS->value,
                PermissionName::EDIT_USERS->value,
                PermissionName::DELETE_USERS->value,
                PermissionName::CHANGE_STATUS_USERS->value,
                PermissionName::RESET_PASSWORD_USERS->value,
            ],
            'Roles' => [
                PermissionName::MANAGE_ROLES->value,
                PermissionName::MANAGE_ALL_ROLES->value,
                PermissionName::MANAGE_OWN_ROLES->value,
                PermissionName::VIEW_ROLES->value,
                PermissionName::CREATE_ROLES->value,
                PermissionName::EDIT_ROLES->value,
                PermissionName::DELETE_ROLES->value,
            ],
            'Logs' => [
                PermissionName::MANAGE_ACTIVITY_LOGS->value,
                PermissionName::MANAGE_AUTHENTICATION_LOGS->value,
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
