<?php

declare(strict_types=1);

namespace App\DTOs;

class NotificationData
{
    public function __construct(
        public readonly string $title,
        public readonly string $message,
        public readonly ?string $actionLabel = null,
        public readonly ?string $actionUrl = null,
    ) {}

    public static function make(
        string $title,
        string $message,
        ?string $actionLabel = null,
        ?string $actionUrl = null,
    ): self {
        return new self(
            title: $title,
            message: $message,
            actionLabel: $actionLabel,
            actionUrl: $actionUrl,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'title' => $this->title,
            'message' => $this->message,
            'action_label' => $this->actionLabel,
            'action_url' => $this->actionUrl,
        ], fn ($value) => $value !== null);
    }
}
