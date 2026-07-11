<?php

declare(strict_types=1);

namespace App\DTOs;

use InvalidArgumentException;

class GlobalSearchDTO
{
    /**
     * @var array<int, array{key: string, op: string, mask: string}>
     */
    public readonly array $fields;

    public function __construct(array $data)
    {
        $validatedFields = [];

        foreach ($data as $index => $item) {
            if (! is_array($item)) {
                throw new InvalidArgumentException("Global search item at index {$index} must be an array.");
            }

            if (! isset($item['key'])) {
                throw new InvalidArgumentException("Global search item at index {$index} is missing the required 'key'.");
            }

            if (! isset($item['op'])) {
                throw new InvalidArgumentException("Global search item at index {$index} is missing the required 'op'.");
            }

            if (! isset($item['mask'])) {
                throw new InvalidArgumentException("Global search item at index {$index} is missing the required 'mask'.");
            }

            $validatedFields[] = [
                'key' => (string) $item['key'],
                'op' => isset($item['op']) ? (string) $item['op'] : 'like',
                'mask' => isset($item['mask']) ? (string) $item['mask'] : '%{value}%',
            ];
        }

        $this->fields = $validatedFields;
    }
}
