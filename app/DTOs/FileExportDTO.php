<?php

declare(strict_types=1);

namespace App\DTOs;

class FileExportDTO
{
    public function __construct(
        public readonly string $userId,
        public readonly string $name,
        public readonly ?array $details = null
    ) {
        if ($this->details !== null) {
            $allowedKeys = ['filters', 'columns', 'sort', 'format', 'total_records'];
            $invalidKeys = array_diff(array_keys($this->details), $allowedKeys);

            if (! empty($invalidKeys)) {
                throw new \InvalidArgumentException('Invalid keys in details array: '.implode(', ', $invalidKeys));
            }
        }
    }
}
