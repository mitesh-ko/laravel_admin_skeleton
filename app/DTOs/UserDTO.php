<?php

declare(strict_types=1);

namespace App\DTOs;

class UserDTO
{
    /**
     * @param  array<int, string>  $roles
     */
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly array $roles = [],
        public readonly array $permissions = [],
        public readonly array $assigned_users = [],
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            roles: $data['roles'] ?? [],
            permissions: $data['permissions'] ?? [],
            assigned_users: $data['assigned_users'] ?? [],
        );
    }
}
