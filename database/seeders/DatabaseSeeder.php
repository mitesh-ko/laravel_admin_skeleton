<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if ($this->command) {
            $count = (int) $this->command->ask('How many random users would you like to create?', 0);
        }

        if ($count > 0) {
            User::factory($count)->create();
        }

        $this->call([
            RoleSeeder::class,
            RoleAndPermissionSeeder::class,
            UserSeeder::class,
        ]);
    }
}
