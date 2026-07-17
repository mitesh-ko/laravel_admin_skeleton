<?php

declare(strict_types=1);

namespace App\Enums;

enum SystemRole: string
{
    case SUPER_ADMIN = 'Super Admin';
    case ADMIN = 'Admin';
    case MANAGER = 'Manager';
}
