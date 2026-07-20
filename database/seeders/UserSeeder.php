<?php

namespace Database\Seeders;

use App\Enums\SystemRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = 'pa$$Word';

        for ($i = 1; $i <= 10; $i++) {
            User::firstOrCreate(
                ['email' => "user{$i}@throtik.com"],
                [
                    'name' => "User {$i}",
                    'password' => Hash::make($password),
                ]
            );
        }

        $admin = User::firstOrCreate(
            ['email' => 'admin@throtik.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make($password),
            ]
        );

        $admin->assignRole(SystemRole::SUPER_ADMIN->value);
    }
}
