<?php

declare(strict_types=1);

namespace App\DTOs;

class RoleDTO
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $description = null,
        public readonly array $permissions = [],
    ) {}
}
