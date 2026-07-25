<?php

declare(strict_types=1);

namespace App\DTOs;

class MailSettingDTO
{
    public function __construct(
        public readonly string $mail_mailer,
        public readonly string $mail_host,
        public readonly int $mail_port,
        public readonly ?string $mail_username,
        public readonly ?string $mail_password,
        public readonly ?string $mail_encryption,
        public readonly string $mail_from_address,
        public readonly string $mail_from_name,
    ) {}

}
