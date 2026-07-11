<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\DTOs\UserDTO;
use App\Mail\UserCreatedMail;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class CreateUserAction
{
    public function execute(UserDTO $data): User
    {
        $password = Str::password(12, true, true, true, false);

        $user = User::create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($password),
        ]);

        if (! empty($data->roles)) {
            $user->assignRole($data->roles);
        }

        Mail::to($user->email)->send(new UserCreatedMail($user, $password));

        return $user;
    }
}
