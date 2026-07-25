<?php

declare(strict_types=1);

namespace App\DTOs;

class GeneralSettingDTO
{
    public function __construct(
        public readonly string $site_name,
        public readonly bool $site_active,
        public readonly string $support_email,
    ) {}
}
