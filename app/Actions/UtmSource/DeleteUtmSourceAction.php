<?php

namespace App\Actions\UtmSource;

use App\Models\UtmSource;

class DeleteUtmSourceAction
{
    public function execute(UtmSource $utmSource): void
    {
        $utmSource->delete();
    }
}
